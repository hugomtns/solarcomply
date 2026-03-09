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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORG_TYPE_LABELS } from "@/lib/constants";
import { Send } from "lucide-react";
import { toast } from "sonner";

interface InviteStakeholderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteStakeholderDialog({
  open,
  onOpenChange,
}: InviteStakeholderDialogProps) {
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [orgType, setOrgType] = useState("");
  const [message, setMessage] = useState("");

  const canSubmit = orgName.trim() !== "" && email.trim() !== "";

  const handleSubmit = () => {
    toast.success(`Invite sent to ${email} for "${orgName}"`);
    setOrgName("");
    setEmail("");
    setOrgType("");
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Invite Stakeholder</DialogTitle>
          <DialogDescription>
            Send an invitation to a new organization to join this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="invite-org-name">Organization Name</Label>
            <Input
              id="invite-org-name"
              placeholder="e.g. Acme Solar GmbH"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invite-email">Contact Email</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="contact@organization.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Organization Type</Label>
            <Select value={orgType} onValueChange={setOrgType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ORG_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="invite-message">Message (optional)</Label>
            <Textarea
              id="invite-message"
              placeholder="Add a note for the recipient..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[72px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            <Send className="mr-1.5 h-4 w-4" />
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
