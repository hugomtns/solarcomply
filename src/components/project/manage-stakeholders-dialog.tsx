"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { organizations } from "@/data/stakeholders";
import { projects } from "@/data/projects";
import { ORG_TYPE_BADGE_COLORS } from "@/lib/stakeholder-utils";
import { ORG_TYPE_LABELS } from "@/lib/constants";
import { X, Plus } from "lucide-react";

interface ManageStakeholdersDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageStakeholdersDialog({
  projectId,
  open,
  onOpenChange,
}: ManageStakeholdersDialogProps) {
  const project = projects.find((p) => p.id === projectId);
  const [selectedOrgToAdd, setSelectedOrgToAdd] = useState<string>("");

  if (!project) return null;

  const currentOrgs = organizations.filter((org) =>
    project.organizationIds.includes(org.id)
  );
  const availableOrgs = organizations.filter(
    (org) => !project.organizationIds.includes(org.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Stakeholders</DialogTitle>
          <DialogDescription>
            Add or remove organizations from this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Current Stakeholders */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              Current Stakeholders
            </p>
            <div className="space-y-1.5">
              {currentOrgs.map((org) => {
                const isOwner = org.id === "org-greenfield";
                return (
                  <div
                    key={org.id}
                    className="flex items-center gap-2 rounded-md border px-3 py-2"
                  >
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-[10px] font-bold text-gray-600">
                      {org.logo || org.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="flex-1 truncate text-sm text-gray-700">
                      {org.name}
                    </span>
                    <Badge
                      variant="outline"
                      className={`flex-shrink-0 text-[10px] ${
                        ORG_TYPE_BADGE_COLORS[org.type] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {ORG_TYPE_LABELS[org.type] || org.type}
                    </Badge>
                    {isOwner ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              disabled
                              className="flex-shrink-0"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Cannot remove project owner
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="flex-shrink-0 text-gray-400 hover:text-red-600"
                        onClick={() =>
                          toast.success(`${org.name} removed`)
                        }
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Organization */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              Add Organization
            </p>
            {availableOrgs.length === 0 ? (
              <p className="text-sm text-gray-400">
                All organizations already added.
              </p>
            ) : (
              <div className="flex gap-2">
                <Select
                  value={selectedOrgToAdd}
                  onValueChange={setSelectedOrgToAdd}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select organization..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOrgs.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  disabled={!selectedOrgToAdd}
                  onClick={() => {
                    const org = organizations.find(
                      (o) => o.id === selectedOrgToAdd
                    );
                    toast.success(`${org?.name ?? "Organization"} added`);
                    setSelectedOrgToAdd("");
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
