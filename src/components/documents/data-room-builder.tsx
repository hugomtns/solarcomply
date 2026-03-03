"use client";

import { useState, useMemo } from "react";
import { Link2, FileText } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DOCUMENT_CATEGORY_LABELS } from "@/lib/constants";
import type { Document } from "@/lib/types";

interface DataRoomBuilderProps {
  documents: Document[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName?: string;
}

export function DataRoomBuilder({
  documents,
  open,
  onOpenChange,
  projectName,
}: DataRoomBuilderProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [roomName, setRoomName] = useState(`${projectName ?? "Project"} - Data Room`);
  const [expiryDate, setExpiryDate] = useState("2026-04-30");
  const [accessLevel, setAccessLevel] = useState("view-only");
  const [watermark, setWatermark] = useState(true);
  const [generatedLink, setGeneratedLink] = useState("");

  const filtered = useMemo(
    () =>
      documents.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      ),
    [documents, search]
  );

  function toggleDoc(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((d) => d.id)));
    }
  }

  const selectedDocs = documents.filter((d) => selectedIds.has(d.id));
  const totalSizeMB = selectedDocs.reduce((s, d) => s + d.fileSizeMB, 0);

  function generateLink() {
    const slug = roomName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 30);
    setGeneratedLink(`https://solarcomply.io/dataroom/${slug}-${Date.now()}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Build Data Room</DialogTitle>
          <DialogDescription>
            Select documents, configure access, and generate a shareable link.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 min-h-0">
          {/* Left column: document list */}
          <div className="flex flex-col min-h-0">
            <Input
              placeholder="Filter documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2"
            />
            <div className="mb-1 flex items-center gap-2">
              <Checkbox
                checked={
                  filtered.length > 0 && selectedIds.size === filtered.length
                }
                onCheckedChange={toggleAll}
              />
              <span className="text-xs text-gray-500">
                Select all ({filtered.length})
              </span>
            </div>
            <ScrollArea className="flex-1 border rounded-md max-h-[300px]">
              <div className="p-2 space-y-1">
                {filtered.map((doc) => (
                  <label
                    key={doc.id}
                    className="flex items-start gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-50 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedIds.has(doc.id)}
                      onCheckedChange={() => toggleDoc(doc.id)}
                      className="mt-0.5"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-gray-900 font-medium text-xs">
                        {doc.name}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {DOCUMENT_CATEGORY_LABELS[doc.category]} &middot;{" "}
                        {doc.fileSizeMB} MB
                      </p>
                    </div>
                  </label>
                ))}
                {filtered.length === 0 && (
                  <p className="py-6 text-center text-xs text-gray-400">
                    No documents match filter.
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right column: summary + settings */}
          <div className="flex flex-col gap-3">
            {/* Selected summary */}
            <div className="rounded-md border bg-gray-50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">
                  {selectedDocs.length} documents selected
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                Total size: {totalSizeMB.toFixed(1)} MB
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedDocs.slice(0, 5).map((d) => (
                  <Badge key={d.id} variant="outline" className="text-[10px]">
                    {d.name.slice(0, 25)}
                    {d.name.length > 25 ? "..." : ""}
                  </Badge>
                ))}
                {selectedDocs.length > 5 && (
                  <Badge variant="outline" className="text-[10px]">
                    +{selectedDocs.length - 5} more
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Settings */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="room-name" className="text-xs mb-1">
                  Data Room Name
                </Label>
                <Input
                  id="room-name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="expiry-date" className="text-xs mb-1">
                  Expiry Date
                </Label>
                <Input
                  id="expiry-date"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs mb-1">Access Level</Label>
                <Select value={accessLevel} onValueChange={setAccessLevel}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view-only">View Only</SelectItem>
                    <SelectItem value="download">Download</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="watermark" className="text-xs">
                  Watermark Documents
                </Label>
                <Switch
                  id="watermark"
                  checked={watermark}
                  onCheckedChange={setWatermark}
                />
              </div>
            </div>

            {/* Generated link */}
            {generatedLink && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-xs font-medium text-emerald-800 mb-1">
                  Data Room Link Generated
                </p>
                <div className="flex items-center gap-2">
                  <Link2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <code className="text-[11px] text-emerald-700 break-all">
                    {generatedLink}
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={generateLink}
            disabled={selectedDocs.length === 0 || !roomName.trim()}
          >
            <Link2 className="h-4 w-4" />
            Generate Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
