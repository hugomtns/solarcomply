"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useApp } from "@/contexts/app-context";
import { organizations } from "@/data/stakeholders";
import { Settings, User, Bell, Shield, Globe, Palette } from "lucide-react";

export default function SettingsPage() {
  const { currentUser } = useApp();
  const org = organizations.find((o) => o.id === currentUser.organizationId);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [alertCritical, setAlertCritical] = useState(true);
  const [alertWarning, setAlertWarning] = useState(true);
  const [alertInfo, setAlertInfo] = useState(false);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("europe-berlin");
  const [dateFormat, setDateFormat] = useState("dd-mm-yyyy");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account preferences, notifications, and platform configuration"
      >
        <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200">
          <Settings className="h-3 w-3" />
          Preferences
        </div>
      </PageHeader>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-3.5 w-3.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="h-3.5 w-3.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-1.5">
            <Palette className="h-3.5 w-3.5" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6 max-w-2xl">
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-xs text-gray-500">Full Name</Label>
                    <Input id="name" defaultValue={currentUser.name} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-xs text-gray-500">Email</Label>
                    <Input id="email" defaultValue={currentUser.email} className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role" className="text-xs text-gray-500">Role</Label>
                    <Input id="role" defaultValue={currentUser.role} disabled className="mt-1 bg-gray-50" />
                  </div>
                  <div>
                    <Label htmlFor="org" className="text-xs text-gray-500">Organization</Label>
                    <Input id="org" defaultValue={org?.name ?? ""} disabled className="mt-1 bg-gray-50" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Organization Details</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy text-white font-bold text-sm">
                  {org?.logo}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{org?.name}</p>
                  <Badge variant="outline" className="text-[10px] mt-1">
                    {org?.type.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-500">Active Projects</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">5</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-500">Team Members</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">3</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-500">Role</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">IPP</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="grid gap-6 max-w-2xl">
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Notification Channels</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive updates via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Push Notifications</p>
                    <p className="text-xs text-gray-500">Browser push notifications for urgent items</p>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Weekly Digest</p>
                    <p className="text-xs text-gray-500">Summary of compliance activity every Monday</p>
                  </div>
                  <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Alert Severity Filters</h3>
              <p className="text-xs text-gray-500 mb-4">Choose which alert severities trigger notifications</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <p className="text-sm font-medium text-gray-700">Critical Alerts</p>
                  </div>
                  <Switch checked={alertCritical} onCheckedChange={setAlertCritical} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <p className="text-sm font-medium text-gray-700">Warning Alerts</p>
                  </div>
                  <Switch checked={alertWarning} onCheckedChange={setAlertWarning} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <p className="text-sm font-medium text-gray-700">Informational Alerts</p>
                  </div>
                  <Switch checked={alertInfo} onCheckedChange={setAlertInfo} />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="grid gap-6 max-w-2xl">
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Authentication</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-500">Password</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <Input type="password" defaultValue="••••••••••••" disabled className="bg-gray-50" />
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Active Sessions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Current Session</p>
                    <p className="text-xs text-gray-500">Chrome on Windows — Berlin, DE</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Mobile App</p>
                    <p className="text-xs text-gray-500">iOS 18 — Last active 2 hours ago</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-red-600 hover:text-red-700">
                    Revoke
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">API Access</h3>
              <p className="text-xs text-gray-500 mb-3">
                Manage API keys for integrating SolarComply with external systems
              </p>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">SCADA Integration Key</p>
                  <code className="text-xs text-gray-400">sc_live_••••••••••••3f2a</code>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Regenerate</Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <div className="grid gap-6 max-w-2xl">
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                <Globe className="inline h-4 w-4 mr-1.5 -mt-0.5" />
                Regional Settings
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe-berlin">Europe/Berlin (CET)</SelectItem>
                      <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
                      <SelectItem value="america-new-york">America/New York (EST)</SelectItem>
                      <SelectItem value="asia-dubai">Asia/Dubai (GST)</SelectItem>
                      <SelectItem value="america-santiago">America/Santiago (CLT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Date Format</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Units</Label>
                  <Select defaultValue="metric">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric (kW, °C, km)</SelectItem>
                      <SelectItem value="imperial">Imperial (kW, °F, mi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Compliance AI Assistant</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Auto-suggest Standards</p>
                    <p className="text-xs text-gray-500">AI automatically suggests relevant standards for documents</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Gap Analysis Alerts</p>
                    <p className="text-xs text-gray-500">Proactive notifications when compliance gaps are detected</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div>
                  <Label className="text-xs text-gray-500">AI Confidence Threshold</Label>
                  <Select defaultValue="70">
                    <SelectTrigger className="mt-1 w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50% — Show more suggestions</SelectItem>
                      <SelectItem value="70">70% — Balanced</SelectItem>
                      <SelectItem value="90">90% — High confidence only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={handleSave} className="bg-brand-blue hover:bg-brand-blue-hover">
          {saved ? "Saved!" : "Save Changes"}
        </Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </>
  );
}
