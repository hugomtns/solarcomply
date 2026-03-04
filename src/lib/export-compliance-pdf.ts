import { jsPDF } from "jspdf";
import type { ComplianceCheckResponse } from "@/lib/types";

const PAGE_WIDTH = 210;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;
const LINE_HEIGHT = 5;
const SECTION_GAP = 8;

export function exportCompliancePdf(
  result: ComplianceCheckResponse,
  projectName: string
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  function checkPage(needed: number) {
    if (y + needed > 280) {
      doc.addPage();
      y = MARGIN;
    }
  }

  function heading(text: string, size: number) {
    checkPage(size + 4);
    doc.setFontSize(size);
    doc.setFont("helvetica", "bold");
    doc.text(text, MARGIN, y);
    y += size * 0.5 + 2;
  }

  function label(key: string, value: string) {
    checkPage(LINE_HEIGHT + 2);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`${key}: `, MARGIN, y);
    const keyWidth = doc.getTextWidth(`${key}: `);
    doc.setFont("helvetica", "normal");
    doc.text(value, MARGIN + keyWidth, y);
    y += LINE_HEIGHT;
  }

  function wrappedText(text: string, indent = 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH - indent);
    for (const line of lines) {
      checkPage(LINE_HEIGHT);
      doc.text(line, MARGIN + indent, y);
      y += LINE_HEIGHT;
    }
  }

  // Compute summary stats
  const allFindings = result.results.flatMap((r) => r.findings);
  const criticalCount = allFindings.filter((f) => f.severity === "critical").length;
  const warningCount = allFindings.filter((f) => f.severity === "warning").length;
  const infoCount = allFindings.filter((f) => f.severity === "info").length;
  const passCount = result.results.filter((r) => r.status === "pass").length;
  const warnCount = result.results.filter((r) => r.status === "warning").length;
  const failCount = result.results.filter((r) => r.status === "fail").length;
  const avgConfidence =
    result.results.length > 0
      ? result.results.reduce((sum, r) => sum + r.confidence, 0) / result.results.length
      : 0;
  const overallStatus = failCount > 0 ? "Non-Compliant" : warnCount > 0 ? "Issues Found" : "Compliant";

  // ── Title ──
  heading("AI Compliance Analysis Report", 18);
  y += 2;

  // ── Meta ──
  label("Project", projectName);
  label("Gateway", result.gatewayCode);
  label("Date", new Date(result.metadata.timestamp).toLocaleString());
  label("Model", result.metadata.model);
  label("Regulations", result.metadata.regulationsLoaded.join(", "));
  if (result.metadata.totalTokens) {
    label("Tokens Used", result.metadata.totalTokens.toLocaleString());
  }
  label("Duration", `${result.metadata.durationMs.toLocaleString()}ms`);
  y += SECTION_GAP;

  // ── Summary ──
  heading("Summary", 13);
  label("Overall Status", overallStatus);
  label("Findings", `${criticalCount} critical, ${warningCount} warning, ${infoCount} info`);
  label("Requirements", `${passCount} pass / ${warnCount} warn / ${failCount} fail (${result.results.length} total)`);
  label("Avg Confidence", `${Math.round(avgConfidence * 100)}%`);
  y += SECTION_GAP;

  // ── Detailed Results ──
  heading("Detailed Results", 13);

  for (const check of result.results) {
    checkPage(20);

    // Requirement header with status
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const statusLabel = check.status.toUpperCase().replace("_", " ");
    doc.text(`[${statusLabel}] ${check.requirementId}`, MARGIN, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const confText = `${Math.round(check.confidence * 100)}% confidence`;
    doc.text(confText, PAGE_WIDTH - MARGIN - doc.getTextWidth(confText), y);
    y += LINE_HEIGHT + 1;

    // Summary
    wrappedText(check.summary);
    y += 2;

    // Findings
    for (const finding of check.findings) {
      checkPage(25);

      // Severity + title
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      const sevTag = `[${finding.severity.toUpperCase()}] `;
      doc.text(sevTag + finding.title, MARGIN + 4, y);
      y += LINE_HEIGHT;

      // Description
      wrappedText(finding.description, 4);

      // Document section
      if (finding.documentSection) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        checkPage(LINE_HEIGHT);
        doc.text(`Section: ${finding.documentSection}`, MARGIN + 4, y);
        y += LINE_HEIGHT;
      }

      // Citations
      if (finding.citations.length > 0) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        for (const cite of finding.citations) {
          checkPage(LINE_HEIGHT);
          let citeText = `${cite.regulationName}, ${cite.article}`;
          if (cite.excerpt) citeText += ` — "${cite.excerpt}"`;
          const citeLines = doc.splitTextToSize(citeText, CONTENT_WIDTH - 8);
          for (const line of citeLines) {
            checkPage(LINE_HEIGHT);
            doc.text(line, MARGIN + 8, y);
            y += LINE_HEIGHT - 0.5;
          }
        }
      }

      // Recommendation
      if (finding.recommendation) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        checkPage(LINE_HEIGHT);
        doc.text("Recommendation:", MARGIN + 4, y);
        y += LINE_HEIGHT;
        doc.setFont("helvetica", "normal");
        wrappedText(finding.recommendation, 4);
      }

      y += 3;
    }

    // Separator line between requirements
    checkPage(4);
    doc.setDrawColor(200);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 4;
  }

  // Footer note
  checkPage(10);
  y += 2;
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150);
  doc.text(
    "Generated by SolarComply AI Compliance Analysis. This report is for informational purposes only.",
    MARGIN,
    y
  );

  doc.save(`compliance-analysis-${result.projectId}.pdf`);
}
