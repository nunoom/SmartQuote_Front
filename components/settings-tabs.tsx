"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Globe, Bell, Shield, User, Palette } from "lucide-react"

export function SettingsTabs() {
  const [language, setLanguage] = useState("en")
  const [theme, setTheme] = useState("light")
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    approvals: true,
    quotations: true,
  })

  return (
    <Tabs defaultValue="general" className="space-y-6">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="general" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          General
        </TabsTrigger>
        <TabsTrigger value="language" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Language
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Security
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="appearance" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Appearance
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue="SmartQuote Solutions" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">Company Email</Label>
                <Input id="company-email" type="email" defaultValue="contact@smartquote.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-address">Address</Label>
              <Textarea id="company-address" defaultValue="123 Business Street, Suite 100, City, State 12345" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-approve quotations under $10,000</Label>
                <p className="text-sm text-gray-500">Automatically approve low-value quotations</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email notifications for new quotations</Label>
                <p className="text-sm text-gray-500">Send email alerts when new quotations are created</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="approval-threshold">Approval Threshold</Label>
              <Input id="approval-threshold" type="number" defaultValue="2000000" />
              <p className="text-sm text-gray-500">Quotations above this amount require approval</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="language" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Language & Localization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language-select">Interface Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="brl">BRL (R$)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="aoa">KZ (AOA)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="utc-3">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc-3">UTC-3 (Brazil)</SelectItem>
                  <SelectItem value="utc-5">UTC-5 (US Eastern)</SelectItem>
                  <SelectItem value="utc+0">UTC+0 (London)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-gray-500">Receive browser push notifications</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, push: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Approval Notifications</Label>
                <p className="text-sm text-gray-500">Get notified when approvals are needed</p>
              </div>
              <Switch
                checked={notifications.approvals}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, approvals: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Quotation Notifications</Label>
                <p className="text-sm text-gray-500">Get notified about new quotations</p>
              </div>
              <Switch
                checked={notifications.quotations}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, quotations: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable 2FA</Label>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <Switch />
            </div>
            <Button variant="outline">Setup Authenticator App</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" defaultValue="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue="manager">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appearance" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme-select">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compact Mode</Label>
                <p className="text-sm text-gray-500">Use a more compact interface layout</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Animations</Label>
                <p className="text-sm text-gray-500">Enable interface animations and transitions</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
