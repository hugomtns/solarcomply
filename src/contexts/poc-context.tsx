"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type {
  ComplianceCheckRequest,
  ComplianceCheckResponse,
  ComplianceCheckResult,
} from "@/lib/types";
import { generateG8AnnualReport, renderG8AnnualReportMarkdown, type G8AnnualReportData } from "@/data/synthetic-docs/g8-annual-report";

interface PocContextType {
  // Results keyed by projectId
  complianceResults: Record<string, ComplianceCheckResponse>;
  isChecking: boolean;
  checkError: string | null;
  syntheticDoc: string | null;
  syntheticDocData: G8AnnualReportData | null;
  tokenUsage: { total: number; calls: number };
  runComplianceCheck: (request: ComplianceCheckRequest) => Promise<ComplianceCheckResponse | null>;
  runAllAiChecks: (projectId: string, gatewayCode: string, jurisdictions: string[]) => Promise<void>;
  clearResults: () => void;
  generateSyntheticDoc: (projectId: string) => void;
  getResultForRequirement: (projectId: string, requirementId: string) => ComplianceCheckResult | undefined;
}

const PocContext = createContext<PocContextType | null>(null);

export function PocProvider({ children }: { children: ReactNode }) {
  const [complianceResults, setComplianceResults] = useState<Record<string, ComplianceCheckResponse>>({});
  const [isChecking, setIsChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [syntheticDoc, setSyntheticDoc] = useState<string | null>(null);
  const [syntheticDocData, setSyntheticDocData] = useState<G8AnnualReportData | null>(null);
  const [tokenUsage, setTokenUsage] = useState({ total: 0, calls: 0 });

  const runComplianceCheck = useCallback(async (request: ComplianceCheckRequest): Promise<ComplianceCheckResponse | null> => {
    setIsChecking(true);
    setCheckError(null);

    try {
      const res = await fetch("/api/compliance-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const response: ComplianceCheckResponse = await res.json();

      setComplianceResults((prev) => ({
        ...prev,
        [request.projectId]: response,
      }));

      setTokenUsage((prev) => ({
        total: prev.total + (response.metadata.totalTokens ?? 0),
        calls: prev.calls + 1,
      }));

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setCheckError(message);
      return null;
    } finally {
      setIsChecking(false);
    }
  }, []);

  const runAllAiChecks = useCallback(async (
    projectId: string,
    gatewayCode: string,
    jurisdictions: string[],
  ) => {
    await runComplianceCheck({ projectId, gatewayCode, jurisdictions });
  }, [runComplianceCheck]);

  const clearResults = useCallback(() => {
    setComplianceResults({});
    setCheckError(null);
    setTokenUsage({ total: 0, calls: 0 });
  }, []);

  const generateSyntheticDocFn = useCallback((projectId: string) => {
    try {
      const data = generateG8AnnualReport(projectId);
      setSyntheticDocData(data);
      setSyntheticDoc(renderG8AnnualReportMarkdown(data));
    } catch (error) {
      setCheckError(error instanceof Error ? error.message : "Failed to generate report");
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
        syntheticDoc,
        syntheticDocData,
        tokenUsage,
        runComplianceCheck,
        runAllAiChecks,
        clearResults,
        generateSyntheticDoc: generateSyntheticDocFn,
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
