import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getRegulationsForCheck } from "@/lib/regulation-router";
import { generateG8AnnualReport, renderG8AnnualReportMarkdown } from "@/data/synthetic-docs/g8-annual-report";
import type { ComplianceCheckRequest, ComplianceCheckResponse, ComplianceCheckResult, ComplianceFinding } from "@/lib/types";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: ComplianceCheckRequest = await request.json();
    const { projectId, gatewayCode, jurisdictions } = body;

    // 1. Get applicable regulations
    const regulations = getRegulationsForCheck(gatewayCode, jurisdictions);
    if (regulations.length === 0) {
      return NextResponse.json(
        { error: "No regulations found for this gateway/jurisdiction combination" },
        { status: 400 }
      );
    }

    // 2. Load regulation text files
    const regulationTexts: Record<string, string> = {};
    const extractedDir = path.join(process.cwd(), "docs", "regs", "extracted");

    for (const reg of regulations) {
      try {
        const filePath = path.join(extractedDir, reg.fileName);
        regulationTexts[reg.id] = await fs.readFile(filePath, "utf-8");
      } catch {
        console.warn(`Could not load regulation file: ${reg.fileName}`);
      }
    }

    // 3. Generate synthetic document
    const reportData = generateG8AnnualReport(projectId);
    const reportMarkdown = renderG8AnnualReportMarkdown(reportData);

    // 4. Build Gemini prompt
    const systemPrompt = buildSystemPrompt();
    const regulationContext = buildRegulationContext(regulationTexts, regulations);
    const userPrompt = buildUserPrompt(reportMarkdown, body);

    console.log("[compliance-check] Request:", {
      projectId,
      gatewayCode,
      jurisdictions,
      regulationsLoaded: regulations.map((r) => r.name),
      promptLengths: {
        system: systemPrompt.length,
        regulations: regulationContext.length,
        user: userPrompt.length,
        totalChars: systemPrompt.length + regulationContext.length + userPrompt.length,
      },
    });

    // 5. Call Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured. Add it to .env.local" },
        { status: 500 }
      );
    }

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

    // 6. Parse response
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
      console.warn("[compliance-check] finishReason:", finishReason, "— attempting truncated JSON recovery");

      // The response was likely truncated (hit token limit).
      // Find the last complete top-level object in the array and close it.
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

    // 7. Build response

    const response: ComplianceCheckResponse = {
      requestId: `chk-${Date.now()}`,
      projectId,
      gatewayCode,
      results: parsedResults.map(normalizeResult),
      metadata: {
        model: GEMINI_MODEL,
        regulationsLoaded: regulations.map((r) => r.name),
        totalTokens,
        durationMs,
        timestamp: new Date().toISOString(),
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
  return `You are a regulatory compliance expert specializing in EU and US energy regulations for solar PV and battery energy storage systems (BESS).

Your task is to analyze an annual compliance report against applicable regulations and identify compliance gaps, missing disclosures, and areas of concern.

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
        "documentSection": "Which section of the report this relates to",
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

Be thorough but practical. Focus on material gaps that would be flagged in a real compliance audit. Assign severity based on:
- critical: Missing mandatory disclosure, regulatory deadline breach, or legal non-compliance
- warning: Incomplete disclosure, approaching deadline, or best practice deviation
- info: Minor improvement opportunity or optional enhancement`;
}

function buildRegulationContext(
  texts: Record<string, string>,
  regulations: { id: string; name: string }[],
): string {
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

function buildUserPrompt(reportMarkdown: string, request: ComplianceCheckRequest): string {
  const requirementIds = request.requirementIds?.length
    ? `\nFocus on these specific requirements: ${request.requirementIds.join(", ")}`
    : "";

  return `=== DOCUMENT TO ANALYZE ===

${reportMarkdown}

=== INSTRUCTIONS ===

Analyze the above annual compliance report for a ${request.gatewayCode} (Annual Compliance Review) gateway check.
Project jurisdictions: ${request.jurisdictions.join(", ")}
${requirementIds}

For each area of the report, check compliance against the applicable regulations provided above.
Identify all gaps, missing disclosures, incomplete information, and non-compliance issues.

Generate one ComplianceCheckResult per major compliance area (CSRD, ESRS E1, ESRS E2, ESRS E4, ESRS E5, Battery Passport, Taxonomy, Nature Restoration, F-Gas).
Use requirement IDs that match the gateway requirements where possible (e.g., "g8-son-r2" for CSRD, "g8-son-r3" for ESRS E1, etc.).

Respond with ONLY the JSON array — no markdown, no explanation, no code blocks.
Keep each result concise — limit findings to the top 3 most important per area. Keep descriptions under 2 sentences and recommendations under 1 sentence.`;
}

/**
 * Recover a truncated JSON array by finding the last complete top-level object.
 * Works by trying to parse progressively shorter substrings ending at each `}`.
 */
function recoverTruncatedJsonArray(raw: string): ComplianceCheckResult[] | null {
  // Find the opening bracket
  const startIdx = raw.indexOf("[");
  if (startIdx === -1) return null;

  // Find all positions where a top-level object might end ("},")
  // by looking for the pattern `}\s*,` or `}\s*]`
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
      // depth 0 means we closed a top-level object inside the root array
      if (depth === 0 && ch === "}") {
        closingPositions.push(i);
      }
    }
  }

  // Try from the last complete object backwards
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
