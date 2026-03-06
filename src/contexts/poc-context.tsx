"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type {
  ComplianceCheckRequest,
  ComplianceCheckResponse,
  ComplianceCheckResult,
} from "@/lib/types";
import {
  generateG8DocumentPackage,
  G8_COMPLIANCE_BATCHES,
  type G8DocumentPackage,
  type ComplianceBatch,
} from "@/data/synthetic-docs/g8-document-package";

export interface BatchStatus {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
  error?: string;
}

interface PocContextType {
  // Results keyed by projectId
  complianceResults: Record<string, ComplianceCheckResponse>;
  isChecking: boolean;
  checkError: string | null;
  documentPackage: G8DocumentPackage | null;
  batchStatuses: BatchStatus[];
  tokenUsage: { total: number; calls: number };
  runComplianceCheck: (request: ComplianceCheckRequest) => Promise<ComplianceCheckResponse | null>;
  runAllAiChecks: (projectId: string, gatewayCode: string, jurisdictions: string[]) => Promise<void>;
  clearResults: () => void;
  generateDocumentPackage: (projectId: string) => void;
  getResultForRequirement: (projectId: string, requirementId: string) => ComplianceCheckResult | undefined;
}

const PocContext = createContext<PocContextType | null>(null);

export function PocProvider({ children }: { children: ReactNode }) {
  const [complianceResults, setComplianceResults] = useState<Record<string, ComplianceCheckResponse>>({});
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [documentPackage, setDocumentPackage] = useState<G8DocumentPackage | null>(null);
  const [batchStatuses, setBatchStatuses] = useState<BatchStatus[]>([]);
  const [tokenUsage, setTokenUsage] = useState({ total: 0, calls: 0 });

  const runComplianceCheck = useCallback(async (request: ComplianceCheckRequest): Promise<ComplianceCheckResponse | null> => {
    setCheckError(null);

    try {
      console.log("[poc] Starting compliance check:", request);
      const t0 = performance.now();

      const res = await fetch("/api/compliance-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...request,
          apiPassword: process.env.NEXT_PUBLIC_COMPLIANCE_API_PASSWORD,
        }),
      });

      const elapsed = ((performance.now() - t0) / 1000).toFixed(1);

      if (!res.ok) {
        const errorData = await res.json();
        console.error(`[poc] Compliance check failed (${elapsed}s):`, errorData);
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const response: ComplianceCheckResponse = await res.json();
      console.log(`[poc] Compliance check completed (${elapsed}s):`, {
        batchId: request.batchId ?? "all",
        results: response.results.length,
        model: response.metadata.model,
        tokens: response.metadata.totalTokens,
        durationMs: response.metadata.durationMs,
      });

      setTokenUsage((prev) => ({
        total: prev.total + (response.metadata.totalTokens ?? 0),
        calls: prev.calls + 1,
      }));

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("[poc] Compliance check error:", message);
      setCheckError(message);
      return null;
    }
  }, []);

  const runAllAiChecks = useCallback(async (
    projectId: string,
    gatewayCode: string,
    jurisdictions: string[],
  ) => {
    setIsChecking(true);
    setCheckError(null);

    // Generate document package if not already done
    let pkg = documentPackage;
    if (!pkg || pkg.projectId !== projectId) {
      try {
        pkg = generateG8DocumentPackage(projectId);
        setDocumentPackage(pkg);
      } catch (error) {
        setCheckError(error instanceof Error ? error.message : "Failed to generate document package");
        setIsChecking(false);
        return;
      }
    }

    // Initialize batch statuses
    const initialStatuses: BatchStatus[] = G8_COMPLIANCE_BATCHES.map((b) => ({
      id: b.id,
      label: b.label,
      status: "pending" as const,
    }));
    setBatchStatuses(initialStatuses);

    // Run batches sequentially to avoid overwhelming the API
    const allResults: ComplianceCheckResult[] = [];
    const allRegulations: string[] = [];
    const allDocuments: { id: string; title: string }[] = [];
    let totalDuration = 0;

    for (const batch of G8_COMPLIANCE_BATCHES) {
      // Update status to running
      setBatchStatuses((prev) =>
        prev.map((s) => s.id === batch.id ? { ...s, status: "running" } : s)
      );

      const response = await runComplianceCheck({
        projectId,
        gatewayCode,
        jurisdictions,
        batchId: batch.id,
      });

      if (response) {
        allResults.push(...response.results);
        allRegulations.push(...response.metadata.regulationsLoaded);
        if (response.metadata.documentsAnalyzed) {
          allDocuments.push(...response.metadata.documentsAnalyzed);
        }
        totalDuration += response.metadata.durationMs;

        setBatchStatuses((prev) =>
          prev.map((s) => s.id === batch.id ? { ...s, status: "done" } : s)
        );
      } else {
        setBatchStatuses((prev) =>
          prev.map((s) => s.id === batch.id
            ? { ...s, status: "error", error: checkError ?? "Unknown error" }
            : s
          )
        );
      }
    }

    // Combine all batch results into a single response
    if (allResults.length > 0) {
      const combined: ComplianceCheckResponse = {
        requestId: `chk-combined-${Date.now()}`,
        projectId,
        gatewayCode,
        results: allResults,
        metadata: {
          model: "gemini-2.5-flash",
          regulationsLoaded: [...new Set(allRegulations)],
          totalTokens: tokenUsage.total,
          durationMs: totalDuration,
          timestamp: new Date().toISOString(),
          documentsAnalyzed: allDocuments,
        },
      };

      setComplianceResults((prev) => ({
        ...prev,
        [projectId]: combined,
      }));
    }

    setIsChecking(false);
  }, [documentPackage, runComplianceCheck, checkError, tokenUsage.total]);

  const clearResults = useCallback(() => {
    setComplianceResults({});
    setCheckError(null);
    setTokenUsage({ total: 0, calls: 0 });
    setBatchStatuses([]);
  }, []);

  const generateDocumentPackageFn = useCallback((projectId: string) => {
    try {
      const pkg = generateG8DocumentPackage(projectId);
      setDocumentPackage(pkg);
    } catch (error) {
      setCheckError(error instanceof Error ? error.message : "Failed to generate document package");
    }
  }, []);

  const getResultForRequirement = useCallback(
    (projectId: string, requirementId: string): ComplianceCheckResult | undefined => {
      const response = complianceResults[projectId];
      if (!response) return undefined;
      return response.results.find((r) => r.requirementId === requirementId);
    },
    [complianceResults],
  );

  return (
    <PocContext.Provider
      value={{
        complianceResults,
        isChecking,
        checkError,
        documentPackage,
        batchStatuses,
        tokenUsage,
        runComplianceCheck,
        runAllAiChecks,
        clearResults,
        generateDocumentPackage: generateDocumentPackageFn,
        getResultForRequirement,
      }}
    >
      {children}
    </PocContext.Provider>
  );
}

export function usePoc() {
  const ctx = useContext(PocContext);
  if (!ctx) throw new Error("usePoc must be used within PocProvider");
  return ctx;
}
