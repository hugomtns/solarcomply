"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PERMISSION_LEVEL_LABELS } from "@/lib/constants";
import { PermissionLevel } from "@/lib/types";
import { Copy, Link2, Send } from "lucide-react";

const SHARE_LEVELS: PermissionLevel[] = [
  "view",
  "download",
  "upload",
  "approve",
];

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({ open, onOpenChange }: ShareDialogProps) {
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState<PermissionLevel>("view");
  const [expiry, setExpiry] = useState("");
  const [message, setMessage] = useState("");
  const [watermark, setWatermark] = useState(true);
  const [disableDownloads, setDisableDownloads] = useState(false);

  const mockLink = `https://solarcomply.app/share/${Math.random().toString(36).slice(2, 10)}`;

  const handleShare = () => {
    toast.success("Document shared successfully");
    setEmail("");
    setMessage("");
    setExpiry("");
    onOpenChange(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(mockLink);
    toast.success("Link copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Share access to this document with external or internal
            stakeholders.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="share-email">Recipient Email</Label>
            <Input
              id="share-email"
              type="email"
              placeholder="name@organization.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Permission Level</Label>
              <Select
                value={level}
                onValueChange={(v) => setLevel(v as PermissionLevel)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHARE_LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {PERMISSION_LEVEL_LABELS[l]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="share-expiry">Expiry Date</Label>
              <Input
                id="share-expiry"
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="share-message">Message (optional)</Label>
            <Textarea
              id="share-message"
              placeholder="Add a note for the recipient..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[72px]"
            />
          </div>

          <div className="space-y-3 rounded-md border p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Watermark documents</p>
                <p className="text-xs text-gray-500">
                  Add recipient name to viewed pages
                </p>
              </div>
              <Switch checked={watermark} onCheckedChange={setWatermark} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Disable downloads</p>
                <p className="text-xs text-gray-500">
                  Prevent recipient from downloading files
                </p>
              </div>
              <Switch
                checked={disableDownloads}
                onCheckedChange={setDisableDownloads}
              />
            </div>
          </div>

          <div className="rounded-md border border-dashed p-3">
            <div className="flex items-center gap-2 text-sm">
              <Link2 className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500">Generated link:</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <code className="flex-1 truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-700">
                {mockLink}
              </code>
              <Button
                variant="outline"
                size="icon-xs"
                onClick={handleCopyLink}
                title="Copy link"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={!email}>
            <Send className="mr-1.5 h-4 w-4" />
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
