"use client";

import { useSmartShelfStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Bell, LogOut, ShieldAlert, Download } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings } = useSmartShelfStore();

  return (
    <div className="min-h-screen bg-background p-6 space-y-8 animate-in slide-in-from-left duration-300">
      <header className="flex items-center gap-4">
        <Button size="icon" variant="ghost" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>

      <main className="space-y-8">
        <section className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Bell className="w-4 h-4" /> Notifications
            </h2>
            
            <div className="space-y-2">
              <Label htmlFor="reminderTime">Daily reminder time</Label>
              <Input
                id="reminderTime"
                type="time"
                value={settings.reminderTime}
                onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                className="h-12 bg-white rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Quiet hours</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="time"
                  value={settings.quietHoursStart}
                  onChange={(e) => updateSettings({ quietHoursStart: e.target.value })}
                  className="h-12 bg-white rounded-xl"
                />
                <Input
                  type="time"
                  value={settings.quietHoursEnd}
                  onChange={(e) => updateSettings({ quietHoursEnd: e.target.value })}
                  className="h-12 bg-white rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Label>Notification style</Label>
              <RadioGroup value={settings.notificationStyle} onValueChange={(val: 'digest' | 'all') => updateSettings({ notificationStyle: val })}>
                <div className="flex items-center space-x-3 py-2 border-b border-muted">
                  <RadioGroupItem value="digest" id="digest" />
                  <div className="space-y-0.5">
                    <Label htmlFor="digest" className="font-semibold">Digest only</Label>
                    <p className="text-xs text-muted-foreground">One summary per day at your chosen time.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 py-2">
                  <RadioGroupItem value="all" id="all" />
                  <div className="space-y-0.5">
                    <Label htmlFor="all" className="font-semibold">Digest + urgent alerts</Label>
                    <p className="text-xs text-muted-foreground">Get extra alerts when items expire in hours.</p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Data & Defaults
          </h2>
          <div className="grid gap-3">
             <Button variant="outline" className="h-14 rounded-2xl justify-between group">
                <span className="flex items-center gap-3"><Download className="w-5 h-5 text-muted-foreground" /> Export data</span>
                <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground uppercase font-bold">Coming Soon</span>
             </Button>
             <Button variant="ghost" className="h-14 rounded-2xl justify-start gap-3 text-destructive hover:bg-destructive/5 hover:text-destructive" onClick={() => { localStorage.clear(); window.location.reload(); }}>
                <LogOut className="w-5 h-5" /> Reset all data
             </Button>
          </div>
        </section>
      </main>

      <footer className="text-center pt-8">
        <p className="text-xs text-muted-foreground">Smart Shelf v1.0.0</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Use it before you lose it</p>
      </footer>
    </div>
  );
}