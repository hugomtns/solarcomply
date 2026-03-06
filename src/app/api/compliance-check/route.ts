import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getRegulationsForCheck, type RegulationFile } from "@/lib/regulation-router";
import {
  generateG8DocumentPackage,
  renderDocumentMarkdown,
  G8_COMPLIANCE_BATCHES,
  type G8DocumentPackage,
  type SyntheticDocument,
} from "@/data/synthetic-docs/g8-document-package";
import type { ComplianceCheckRequest, ComplianceCheckResponse, ComplianceCheckResult, ComplianceFinding } from "@/lib/types";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: ComplianceCheckRequest = await request.json();
    const { projectId, gatewayCode, jurisdictions, batchId } = body;

    // 0. Verify API password
    const expectedPassword = process.env.COMPLIANCE_API_PASSWORD;
    if (!expectedPassword || body.apiPassword !== expectedPassword) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid or missing API password." },
        { status: 401 }
      );
    }

    // 1. Get applicable regulations
    const allRegulations = getRegulationsForCheck(gatewayCode, jurisdictions);
    if (allRegulations.length === 0 && !batchId) {
      return NextResponse.json(
        { error: "No regulations found for this gateway/jurisdiction combination" },
        { status: 400 }
      );
    }

    // 2. Generate document package
    const docPackage = generateG8DocumentPackage(projectId);

    // 3. Determine which batch to run (or run specific batch)
    const batch = batchId
      ? G8_COMPLIANCE_BATCHES.find((b) => b.id === batchId)
      : undefined;

    if (batchId && !batch) {
      return NextResponse.json(
        { error: `Unknown batch: ${batchId}` },
        { status: 400 }
      );
    }

    // 4. Load regulation text files
    const regulationTexts: Record<string, string> = {};
    const extractedDir = path.join(process.cwd(), "docs", "regs", "extracted");

    const regulationIdsNeeded = batch
      ? batch.regulationIds
      : allRegulations.map((r) => r.id);

    const regulationsNeeded = allRegulations.filter((r) =>
      regulationIdsNeeded.includes(r.id)
    );

    for (const reg of regulationsNeeded) {
      try {
        const filePath = path.join(extractedDir, reg.fileName);
        regulationTexts[reg.id] = await fs.readFile(filePath, "utf-8");
      } catch {
        console.warn(`Could not load regulation file: ${reg.fileName}`);
      }
    }

    // 5. Select documents for this batch
    const documents = batch
      ? docPackage.documents.filter((d) => batch.documentIds.includes(d.id))
      : docPackage.documents;

    const requirementIds = batch
      ? batch.requirementIds
      : G8_COMPLIANCE_BATCHES.flatMap((b) => b.requirementIds);

    // 6. Build prompts
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured. Add it to .env.local" },
        { status: 500 }
      );
    }

    const systemPrompt = buildSystemPrompt();
    const regulationContext = buildRegulationContext(regulationTexts, regulationsNeeded);
    const documentContext = buildDocumentContext(documents);
    const userPrompt = buildUserPrompt(documents, requirementIds, body);

    console.log("[compliance-check] Request:", {
      projectId,
      gatewayCode,
      jurisdictions,
      batchId: batchId ?? "all",
      documentsIncluded: documents.map((d) => d.id),
      regulationsLoaded: regulationsNeeded.map((r) => r.name),
      requirementIds,
      promptLengths: {
        system: systemPrompt.length,
        regulations: regulationContext.length,
        documents: documentContext.length,
        user: userPrompt.length,
        totalChars: systemPrompt.length + regulationContext.length + documentContext.length + userPrompt.length,
      },
    });

    // 7. Call Gemini API
    const geminiResponse = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [
          {
            role: "user",
            parts: [
              { text: regulationContext },
              { text: documentContext },
              { text: userPrompt },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          maxOutputTokens: 32768,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        { error: `Gemini API error: ${geminiResponse.status}`, details: errorText },
        { status: 502 }
      );
    }

    const geminiData = await geminiResponse.json();
    const durationMs = Date.now() - startTime;

    // 8. Parse response
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    const finishReason = geminiData.candidates?.[0]?.finishReason;
    const totalTokens = geminiData.usageMetadata?.totalTokenCount;
    const inputTokens = geminiData.usageMetadata?.promptTokenCount;
    const outputTokens = geminiData.usageMetadata?.candidatesTokenCount;

    console.log("[compliance-check] Gemini response metadata:", {
      durationMs,
      finishReason,
      inputTokens,
      outputTokens,
      totalTokens,
      rawTextLength: rawText?.length ?? 0,
      rawTextPreview: rawText?.slice(0, 200),
    });

    if (!rawText) {
      console.error("[compliance-check] Empty response. Full geminiData:", JSON.stringify(geminiData, null, 2));
      return NextResponse.json(
        { error: "Empty response from Gemini", finishReason },
        { status: 502 }
      );
    }

    let parsedResults: ComplianceCheckResult[];
    try {
      const parsed = JSON.parse(rawText);
      parsedResults = Array.isArray(parsed) ? parsed : parsed.results ?? [];
    } catch (firstError) {
      console.warn("[compliance-check] Direct JSON.parse failed:", (firstError as Error).message);
      console.warn("[compliance-check] finishReason:", finishReason, "-- attempting truncated JSON recovery");

      const recovered = recoverTruncatedJsonArray(rawText);
      if (recovered) {
        parsedResults = recovered;
        console.log("[compliance-check] Recovered", parsedResults.length, "results from truncated response");
      } else {
        console.error("[compliance-check] Recovery failed. Raw text (first 2000 chars):", rawText.slice(0, 2000));
        return NextResponse.json(
          { error: "Could not parse Gemini response as JSON (truncated)", raw: rawText.slice(0, 3000) },
          { status: 502 }
        );
      }
    }

    console.log("[compliance-check] Parsed", parsedResults.length, "results");

    // 9. Enrich results with source document references
    const enrichedResults = parsedResults.map((result) => {
      const normalized = normalizeResult(result);
      // Find which document(s) this requirement belongs to
      const sourceDoc = documents.find((d) =>
        d.requirementIds.includes(normalized.requirementId)
      );
      if (sourceDoc) {
        normalized.sourceDocumentId = sourceDoc.id;
        normalized.sourceDocumentTitle = sourceDoc.title;
      }
      return normalized;
    });

    // 10. Build response
    const response: ComplianceCheckResponse = {
      requestId: `chk-${Date.now()}`,
      projectId,
      gatewayCode,
      results: enrichedResults,
      metadata: {
        model: GEMINI_MODEL,
        regulationsLoaded: regulationsNeeded.map((r) => r.name),
        totalTokens,
        durationMs,
        timestamp: new Date().toISOString(),
        batchId: batchId ?? undefined,
        documentsAnalyzed: documents.map((d) => ({ id: d.id, title: d.title })),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Compliance check error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

function normalizeResult(result: ComplianceCheckResult): ComplianceCheckResult {
  return {
    requirementId: result.requirementId || "unknown",
    status: (["pass", "fail", "warning", "not_applicable"].includes(result.status)
      ? result.status
      : "warning") as ComplianceCheckResult["status"],
    confidence: typeof result.confidence === "number" ? result.confidence : 0.5,
    findings: (result.findings || []).map(normalizeFinding),
    summary: result.summary || "No summary provided",
    sourceDocumentId: result.sourceDocumentId,
    sourceDocumentTitle: result.sourceDocumentTitle,
  };
}

function normalizeFinding(finding: ComplianceFinding): ComplianceFinding {
  return {
    id: finding.id || `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    severity: (["critical", "warning", "info"].includes(finding.severity)
      ? finding.severity
      : "info") as ComplianceFinding["severity"],
    title: finding.title || "Untitled finding",
    description: finding.description || "",
    documentSection: finding.documentSection,
    citations: (finding.citations || []).map((c) => ({
      regulationName: c.regulationName || "Unknown",
      article: c.article || "Unknown",
      excerpt: c.excerpt,
    })),
    recommendation: finding.recommendation || "Review and address this finding.",
  };
}

function buildSystemPrompt(): string {
  return `You are a regulatory compliance expert specializing in EU energy regulations for solar PV and battery energy storage systems (BESS).

Your task is to analyze compliance documents submitted for a G8 Annual Compliance Review gateway against applicable regulations. You will receive multiple documents — each is a separate deliverable in the compliance package.

You MUST respond with a JSON array of compliance check results. Each result should follow this exact structure:

[
  {
    "requirementId": "string - the requirement ID from the check request",
    "status": "pass | fail | warning",
    "confidence": 0.0 to 1.0,
    "findings": [
      {
        "id": "unique string",
        "severity": "critical | warning | info",
        "title": "Short title of the finding",
        "description": "Detailed description of the compliance gap or issue",
        "documentSection": "Which section of the source document this relates to",
        "citations": [
          {
            "regulationName": "Name of the regulation",
            "article": "Specific article/section reference",
            "excerpt": "Brief relevant text from the regulation"
          }
        ],
        "recommendation": "Specific action to remediate this finding"
      }
    ],
    "summary": "One-sentence summary of the compliance status for this requirement"
  }
]

Important instructions:
- Evaluate EACH document against its relevant regulations
- Generate one result per requirement ID provided
- Reference specific sections of the source documents in your findings
- Be thorough but practical — focus on material gaps that would be flagged in a real compliance audit
- Assign severity: critical = missing mandatory disclosure / regulatory deadline breach; warning = incomplete disclosure / approaching deadline; info = minor improvement
- Limit findings to the top 3-4 most important per requirement
- Keep descriptions under 2 sentences and recommendations under 1 sentence
- Respond with ONLY the JSON array — no markdown, no explanation, no code blocks`;
}

function buildRegulationContext(
  texts: Record<string, string>,
  regulations: RegulationFile[],
): string {
  if (regulations.length === 0) return "";

  const parts = ["=== APPLICABLE REGULATIONS ===\n"];

  for (const reg of regulations) {
    if (texts[reg.id]) {
      parts.push(`--- ${reg.name} ---`);
      parts.push(texts[reg.id]);
      parts.push("");
    }
  }

  return parts.join("\n");
}

function buildDocumentContext(documents: SyntheticDocument[]): string {
  const parts = ["=== DOCUMENTS TO ANALYZE ===\n"];

  for (const doc of documents) {
    parts.push(`--- DOCUMENT: ${doc.title} ---`);
    parts.push(`Document ID: ${doc.id}`);
    parts.push(`Covers requirements: ${doc.requirementIds.join(", ")}`);
    parts.push("");
    parts.push(renderDocumentMarkdown(doc));
    parts.push("\n");
  }

  return parts.join("\n");
}

function buildUserPrompt(
  documents: SyntheticDocument[],
  requirementIds: string[],
  request: ComplianceCheckRequest,
): string {
  return `=== INSTRUCTIONS ===

Analyze the above documents for a G8 (Annual Compliance Review) gateway check.
Project: Sonnenberg Solar + Storage (100 MWp PV / 100 MWh BESS), Brandenburg, Germany
Project jurisdictions: ${request.jurisdictions.join(", ")}

Documents provided: ${documents.map((d) => d.title).join("; ")}

Generate one ComplianceCheckResult for EACH of the following requirement IDs:
${requirementIds.map((id) => `- ${id}`).join("\n")}

Map each requirement to its relevant source document:
${documents.map((d) => `- ${d.requirementIds.join(", ")} → "${d.title}"`).join("\n")}

For each requirement, assess compliance against the applicable regulations provided above.
Identify all gaps, missing disclosures, incomplete information, and non-compliance issues found in the source document.

Respond with ONLY the JSON array — no markdown, no explanation, no code blocks.`;
}

/**
 * Recover a truncated JSON array by finding the last complete top-level object.
 */
function recoverTruncatedJsonArray(raw: string): ComplianceCheckResult[] | null {
  const startIdx = raw.indexOf("[");
  if (startIdx === -1) return null;

  const closingPositions: number[] = [];
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = startIdx + 1; i < raw.length; i++) {
    const ch = raw[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{" || ch === "[") depth++;
    if (ch === "}" || ch === "]") {
      depth--;
      if (depth === 0 && ch === "}") {
        closingPositions.push(i);
      }
    }
  }

  for (let i = closingPositions.length - 1; i >= 0; i--) {
    const candidate = raw.slice(startIdx, closingPositions[i] + 1) + "]";
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // try shorter
    }
  }
  return null;
}
