"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DOCUMENT_CATEGORY_LABELS } from "@/lib/constants";
import { Upload, FileText, CheckCircle, Sparkles, ArrowRight, ArrowLeft, X } from "lucide-react";
import type { DocumentCategory } from "@/lib/types";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

type Step = "upload" | "metadata" | "validation" | "preview";
const steps: { key: Step; label: string }[] = [
  { key: "upload", label: "Upload" },
  { key: "metadata", label: "Metadata" },
  { key: "validation", label: "Validation" },
  { key: "preview", label: "AI Preview" },
];

export function UploadDialog({ open, onOpenChange, projectId }: UploadDialogProps) {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [gateway, setGateway] = useState<string>("");
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);

  const stepIndex = steps.findIndex((s) => s.key === currentStep);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleNext = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) {
      const nextStep = steps[nextIndex].key;
      setCurrentStep(nextStep);
      if (nextStep === "validation") {
        setValidating(true);
        setTimeout(() => {
          setValidating(false);
          setValidated(true);
        }, 1500);
      }
    }
  };

  const handleBack = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
    }
  };

  const handleSubmit = () => {
    alert(`Document "${file?.name}" uploaded successfully (mock)`);
    onOpenChange(false);
    // Reset state
    setCurrentStep("upload");
    setFile(null);
    setCategory("");
    setGateway("");
    setValidated(false);
  };

  const canNext =
    (currentStep === "upload" && file) ||
    (currentStep === "metadata" && category) ||
    (currentStep === "validation" && validated) ||
    currentStep === "preview";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Add a document to the project repository
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-1 px-1">
          {steps.map((step, i) => (
            <div key={step.key} className="flex flex-1 items-center gap-1">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold transition-colors ${
                  i <= stepIndex
                    ? "bg-[#2E75B6] text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-[11px] ${i <= stepIndex ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                {step.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px ${i < stepIndex ? "bg-[#2E75B6]" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[200px]">
          {currentStep === "upload" && (
            <div
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
                dragActive
                  ? "border-[#2E75B6] bg-blue-50"
                  : file
                    ? "border-emerald-300 bg-emerald-50/50"
                    : "border-gray-300 bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-10 w-10 text-emerald-500" />
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-500"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-10 w-10 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">
                    Drag & drop a file here
                  </p>
                  <p className="text-xs text-gray-500">or click to browse</p>
                  <label>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileInput}
                    />
                    <Button variant="outline" size="sm" className="mt-1" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                </div>
              )}
            </div>
          )}

          {currentStep === "metadata" && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Document Name</Label>
                <Input
                  value={file?.name.replace(/\.[^.]+$/, "") || ""}
                  className="mt-1"
                  readOnly
                />
              </div>
              <div>
                <Label className="text-xs">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DOCUMENT_CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Associated Gateway (optional)</Label>
                <Select value={gateway} onValueChange={setGateway}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select gateway" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {Array.from({ length: 11 }, (_, i) => (
                      <SelectItem key={i} value={`G${i}`}>
                        G{i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === "validation" && (
            <div className="flex flex-col items-center gap-4 py-6">
              {validating ? (
                <>
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#2E75B6]" />
                  <p className="text-sm font-medium text-gray-700">Validating document...</p>
                  <Progress value={65} className="w-48" />
                </>
              ) : (
                <>
                  <CheckCircle className="h-12 w-12 text-emerald-500" />
                  <p className="text-sm font-medium text-gray-900">Validation Complete</p>
                  <div className="space-y-1.5 text-center">
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Format Valid</Badge>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 ml-1.5">Size OK</Badge>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 ml-1.5">No Duplicates</Badge>
                  </div>
                </>
              )}
            </div>
          )}

          {currentStep === "preview" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 p-3">
                <Sparkles className="h-4 w-4 text-purple-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-purple-900">AI Document Preview</p>
                  <p className="text-xs text-purple-700 mt-0.5">
                    AI analysis suggests this document satisfies requirements for{" "}
                    {gateway && gateway !== "none" ? gateway : "G3-G5"} gateways.
                    No inconsistencies detected with existing documentation.
                  </p>
                </div>
              </div>
              <div className="rounded-lg border bg-gray-50 p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">File</span>
                  <span className="font-medium">{file?.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium">{DOCUMENT_CATEGORY_LABELS[category as DocumentCategory] || category}</span>
                </div>
                {gateway && gateway !== "none" && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Gateway</span>
                    <span className="font-medium">{gateway}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {stepIndex > 0 && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {currentStep === "preview" ? (
              <Button size="sm" onClick={handleSubmit}>
                <Upload className="h-3.5 w-3.5 mr-1" />
                Upload
              </Button>
            ) : (
              <Button size="sm" onClick={handleNext} disabled={!canNext}>
                Next
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
