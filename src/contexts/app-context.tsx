"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User, ComplianceAlert } from "@/lib/types";
import { currentUser as defaultUser } from "@/data/stakeholders";
import { alerts as defaultAlerts } from "@/data/alerts";

interface AIContext {
  type: "document" | "requirement" | "gateway" | "chat";
  id: string;
}

interface AppContextType {
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  currentUser: User;
  notifications: ComplianceAlert[];
  acknowledgeAlert: (id: string) => void;
  aiContext: AIContext | null;
  setAiContext: (ctx: AIContext | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedProjectId, setSelectedProjectId] = useState("proj-sonnenberg");
  const [notifications, setNotifications] = useState<ComplianceAlert[]>(defaultAlerts);
  const [aiContext, setAiContext] = useState<AIContext | null>(null);

  const acknowledgeAlert = (id: string) => {
    setNotifications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  return (
    <AppContext.Provider
      value={{
        selectedProjectId,
        setSelectedProjectId,
        currentUser: defaultUser,
        notifications,
        acknowledgeAlert,
        aiContext,
        setAiContext,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
