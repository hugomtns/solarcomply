"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Ban, FileText } from "lucide-react";
import { STAKEHOLDER_ABBREV_LABELS } from "@/lib/constants";
import { CustomRequirementDialog } from "./custom-requirement-dialog";
import { ApprovalMatrixTable } from "./approval-matrix-table";
import type {
  GatewayReferenceDefinition,
  GatewayReferenceRequirement,
  RequirementConfigStatus,
  CustomRequirement,
} from "@/lib/types";

interface ConfigurableRequirementsListProps {
  gateways: GatewayReferenceDefinition[];
  filteredRequirements: Map<string, GatewayReferenceRequirement[]>;
  configs: Map<string, RequirementConfigStatus>;
  naReasons: Map<string, string>;
  customRequirements: CustomRequirement[];
  disabledGateways: Set<string>;
  onToggle: (reqId: string, status: RequirementConfigStatus) => void;
  onNaReason: (reqId: string, reason: string) => void;
  onAddCustom: (gatewayCode: string, req: Omit<CustomRequirement, 'id' | 'gatewayCode'>) => void;
  onRemoveCustom: (id: string) => void;
  onToggleGateway: (gatewayCode: string, enabled: boolean) => void;
}

export function ConfigurableRequirementsList({
  gateways,
  filteredRequirements,
  configs,
  naReasons,
  customRequirements,
  disabledGateways,
  onToggle,
  onNaReason,
  onAddCustom,
  onRemoveCustom,
  onToggleGateway,
}: ConfigurableRequirementsListProps) {
  const [naDialogReqId, setNaDialogReqId] = useState<string | null>(null);
  const [naReason, setNaReason] = useState("");
  const [customDialogGateway, setCustomDialogGateway] = useState<string | null>(null);

  const handleNaConfirm = () => {
    if (naDialogReqId && naReason.trim()) {
      onToggle(naDialogReqId, 'not_applicable');
      onNaReason(naDialogReqId, naReason.trim());
    }
    setNaDialogReqId(null);
    setNaReason("");
  };

  const getStatus = (reqId: string): RequirementConfigStatus => configs.get(reqId) ?? 'enabled';

  return (
    <>
      <Accordion type="multiple" defaultValue={gateways.map((g) => g.code)} className="space-y-2">
        {gateways.map((gw) => {
          const reqs = filteredRequirements.get(gw.code) ?? [];
          const gwCustom = customRequirements.filter((c) => c.gatewayCode === gw.code);
          const enabledCount = reqs.filter((r) => getStatus(r.id) === 'enabled').length;
          const isGatewayDisabled = disabledGateways.has(gw.code);

          return (
            <AccordionItem key={gw.code} value={gw.code} className={`border rounded-lg transition-opacity ${isGatewayDisabled ? 'opacity-50' : ''}`}>
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <div
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') e.stopPropagation(); }}
                  >
                    <Switch
                      checked={!isGatewayDisabled}
                      onCheckedChange={(checked) => onToggleGateway(gw.code, checked)}
                    />
                  </div>
                  <span className={`text-sm font-semibold ${isGatewayDisabled ? 'text-text-muted' : 'text-white'}`}>{gw.code}</span>
                  <span className={`text-sm ${isGatewayDisabled ? 'text-text-disabled' : 'text-text-secondary'}`}>{gw.name}</span>
                  {isGatewayDisabled ? (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-white/[0.06] text-text-tertiary border-gray-200">
                      Disabled
                    </Badge>
                  ) : (
                    <>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-primary/15 text-primary border-primary/25">
                        {enabledCount}/{reqs.length + gwCustom.length} enabled
                      </Badge>
                      {gwCustom.length > 0 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-palette-orange-500/15 text-palette-orange-400 border-palette-orange-500/25">
                          +{gwCustom.length} custom
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-1">
                  {reqs.map((req) => {
                    const status = getStatus(req.id);
                    return (
                      <div
                        key={req.id}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                          status === 'not_applicable'
                            ? 'bg-surface-glass opacity-60'
                            : status === 'disabled'
                            ? 'bg-surface-glass opacity-75'
                            : 'hover:bg-surface-glass'
                        }`}
                      >
                        <span className="text-xs font-medium text-brand-blue w-14 shrink-0">{req.id}</span>
                        <span className={`flex-1 text-sm ${status === 'enabled' ? 'text-text-secondary' : 'text-text-muted'}`}>
                          {req.label}
                          {req.isBessOnly && (
                            <Badge variant="outline" className="ml-1.5 text-[9px] px-1 py-0 bg-status-info/15 text-palette-blue-400 border-status-info/25">
                              BESS
                            </Badge>
                          )}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          {status === 'not_applicable' ? (
                            <div className="flex items-center gap-1.5">
                              <Badge variant="outline" className="text-[10px] bg-white/[0.06] text-text-tertiary border-gray-200">
                                N/A
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-1.5 text-[10px] text-text-muted hover:text-text-tertiary"
                                onClick={() => onToggle(req.id, 'enabled')}
                              >
                                Restore
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Switch
                                checked={status === 'enabled'}
                                onCheckedChange={(checked) => onToggle(req.id, checked ? 'enabled' : 'disabled')}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-text-muted hover:text-text-tertiary"
                                title="Mark as N/A"
                                onClick={() => {
                                  setNaDialogReqId(req.id);
                                  setNaReason(naReasons.get(req.id) ?? "");
                                }}
                              >
                                <Ban className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Custom requirements */}
                  {gwCustom.map((cr) => (
                    <div
                      key={cr.id}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm bg-palette-orange-500/10 border border-palette-orange-500/20"
                    >
                      <FileText className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                      <span className="flex-1 text-sm text-text-secondary">
                        {cr.label}
                        <Badge variant="outline" className="ml-1.5 text-[9px] px-1 py-0 bg-palette-orange-500/15 text-palette-orange-400 border-palette-orange-500/25">
                          Custom
                        </Badge>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-1.5 text-[10px] text-red-400 hover:text-red-600"
                        onClick={() => onRemoveCustom(cr.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1"
                    onClick={() => setCustomDialogGateway(gw.code)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Custom Requirement
                  </Button>
                </div>

                {/* Approval Matrix */}
                <Card className="mt-4">
                  <div className="p-3 pb-1">
                    <h5 className="text-xs font-semibold text-white">Approval Matrix</h5>
                  </div>
                  <ApprovalMatrixTable approvals={gw.approvalMatrix} />
                </Card>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* N/A Reason Dialog */}
      <Dialog open={naDialogReqId !== null} onOpenChange={() => { setNaDialogReqId(null); setNaReason(""); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Mark as Not Applicable</DialogTitle>
            <DialogDescription>Provide a reason why this requirement is not applicable.</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="na-reason" className="text-sm font-medium">Reason</Label>
            <Textarea
              id="na-reason"
              placeholder="e.g., PV-only project — no BESS component"
              value={naReason}
              onChange={(e) => setNaReason(e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setNaDialogReqId(null); setNaReason(""); }}>Cancel</Button>
            <Button onClick={handleNaConfirm} disabled={!naReason.trim()} className="bg-brand-navy hover:bg-brand-navy/90">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Requirement Dialog */}
      {customDialogGateway && (
        <CustomRequirementDialog
          gatewayCode={customDialogGateway}
          open={customDialogGateway !== null}
          onOpenChange={(open) => { if (!open) setCustomDialogGateway(null); }}
          onAdd={(req) => onAddCustom(customDialogGateway, req)}
        />
      )}
    </>
  );
}
