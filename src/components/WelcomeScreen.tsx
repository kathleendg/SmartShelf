"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSmartShelfStore } from "@/lib/store";
import { Clock, Moon, ShieldCheck } from "lucide-react";

export function WelcomeScreen() {
  const { settings, updateSettings } = useSmartShelfStore();

  const handleStart = () => {
    updateSettings({ setupComplete: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome to Smart Shelf</h1>
          <p className="text-muted-foreground text-lg px-4">
            Track what you have, get reminders before it expires, and get ideas to use it up. No scanners needed.
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Default reminder time</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reminderTime" className="text-base">Daily reminder time</Label>
                <Input
                  id="reminderTime"
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                  className="bg-secondary/50 border-none h-12 text-lg"
                />
                <p className="text-sm text-muted-foreground">We&apos;ll send one daily summary, not spam.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Quiet hours</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Quiet hours</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="time"
                    value={settings.quietHoursStart}
                    onChange={(e) => updateSettings({ quietHoursStart: e.target.value })}
                    className="bg-secondary/50 border-none h-12"
                  />
                  <Input
                    type="time"
                    value={settings.quietHoursEnd}
                    onChange={(e) => updateSettings({ quietHoursEnd: e.target.value })}
                    className="bg-secondary/50 border-none h-12"
                  />
                </div>
                <p className="text-sm text-muted-foreground">No notifications during these hours.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={handleStart} className="h-14 text-lg bg-primary hover:bg-primary/90 rounded-2xl">
            Get started
          </Button>
          <Button variant="ghost" onClick={handleStart} className="h-12 text-muted-foreground rounded-2xl">
            I&apos;ll set up later
          </Button>
        </div>
      </div>
    </div>
  );
}