"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { GatewayRequirement } from "@/lib/types";

interface WaiverDialogProps {
  requirement: GatewayRequirement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWaiver: (data: { requirementId: string; justification: string; riskLevel: string }) => void;
}

export function WaiverDialog({
  requirement,
  open,
  onOpenChange,
  onWaiver,
}: WaiverDialogProps) {
  const [justification, setJustification] = useState("");
  const [riskLevel, setRiskLevel] = useState("");

  const handleSubmit = () => {
    if (!justification.trim() || !riskLevel) {
      alert("Please provide both a justification and a risk assessment.");
      return;
    }

    onWaiver({
      requirementId: requirement.id,
      justification: justification.trim(),
      riskLevel,
    });

    alert(
      `Waiver request submitted for "${requirement.label}".\n\nRisk: ${riskLevel}\nJustification: ${justification.trim()}\n\nThe request will be reviewed by the Compliance Manager.`
    );

    setJustification("");
    setRiskLevel("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setJustification("");
    setRiskLevel("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Waiver</DialogTitle>
          <DialogDescription>
            Submit a waiver request for a non-compliant requirement. This will
            be reviewed by the Compliance Manager.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Requirement info */}
          <div className="rounded-md border bg-gray-50 p-3">
            <p className="text-sm font-medium text-gray-900">
              {requirement.label}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              {requirement.description}
            </p>
            {requirement.standardRef && (
              <Badge
                variant="outline"
                className="mt-2 text-xs bg-sky-50 text-sky-700 border-sky-200"
              >
                {requirement.standardRef}
              </Badge>
            )}
          </div>

          {/* Justification */}
          <div className="space-y-2">
            <Label htmlFor="justification" className="text-sm font-medium">
              Justification
            </Label>
            <Textarea
              id="justification"
              placeholder="Explain why this requirement cannot be met and any mitigating measures in place..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={4}
            />
          </div>

          {/* Risk assessment */}
          <div className="space-y-2">
            <Label htmlFor="risk-level" className="text-sm font-medium">
              Risk Assessment
            </Label>
            <Select value={riskLevel} onValueChange={setRiskLevel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select risk level..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!justification.trim() || !riskLevel}
            className="bg-brand-navy hover:bg-brand-navy/90"
          >
            Submit Waiver Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
