"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CustomRequirementDialogProps {
  gatewayCode: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (req: { label: string; description: string; format: string; provider: string; reviewerApprover: string }) => void;
}

export function CustomRequirementDialog({
  gatewayCode,
  open,
  onOpenChange,
  onAdd,
}: CustomRequirementDialogProps) {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState("");
  const [provider, setProvider] = useState("");
  const [reviewer, setReviewer] = useState("");

  const handleSubmit = () => {
    if (!label.trim()) return;
    onAdd({
      label: label.trim(),
      description: description.trim(),
      format: format.trim(),
      provider: provider.trim(),
      reviewerApprover: reviewer.trim(),
    });
    setLabel("");
    setDescription("");
    setFormat("");
    setProvider("");
    setReviewer("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLabel("");
    setDescription("");
    setFormat("");
    setProvider("");
    setReviewer("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Requirement</DialogTitle>
          <DialogDescription>
            Add a custom requirement to gateway {gatewayCode}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="req-label" className="text-sm font-medium">Label</Label>
            <Input
              id="req-label"
              placeholder="e.g., Battery Transport Safety Certificate"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="req-desc" className="text-sm font-medium">Description</Label>
            <Textarea
              id="req-desc"
              placeholder="Describe the requirement..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Format</Label>
              <Input placeholder="PDF" value={format} onChange={(e) => setFormat(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Provider</Label>
              <Input placeholder="EPC" value={provider} onChange={(e) => setProvider(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-slate-400">Reviewer</Label>
              <Input placeholder="TA, DEV" value={reviewer} onChange={(e) => setReviewer(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!label.trim()}
            className="bg-[#2E75B6] hover:bg-[#245d91]"
          >
            Add Requirement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
