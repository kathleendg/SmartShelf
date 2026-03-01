"use client";

import { useSmartShelfStore, ShelfItem } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ChevronRight, PackageOpen, AlertTriangle, Calendar, Settings, Bell } from "lucide-react";
import Link from "next/link";
import { differenceInDays, isPast, isToday } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function Dashboard() {
  const { items } = useSmartShelfStore();

  const activeItems = items.filter(i => i.status === 'active');

  const getUrgency = (item: ShelfItem) => {
    const daysLeft = differenceInDays(new Date(item.expiryDate), new Date());
    if (isPast(new Date(item.expiryDate)) || isToday(new Date(item.expiryDate)) || daysLeft <= 1) return 'urgent';
    if (daysLeft <= 3) return 'soon';
    return 'safe';
  };

  const urgentItems = activeItems.filter(i => getUrgency(i) === 'urgent');
  const soonItems = activeItems.filter(i => getUrgency(i) === 'soon');
  const otherItems = activeItems.filter(i => getUrgency(i) === 'safe');

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-12 pb-6 space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Shelf</h1>
            <p className="text-muted-foreground">{activeItems.length} items tracked</p>
          </div>
          <div className="flex gap-2">
            <Link href="/digest">
              <Button size="icon" variant="ghost" className="rounded-full bg-white/50 backdrop-blur">
                <Bell className="w-5 h-5 text-primary" />
              </Button>
            </Link>
            <Link href="/settings">
              <Button size="icon" variant="ghost" className="rounded-full bg-white/50 backdrop-blur">
                <Settings className="w-5 h-5 text-primary" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-8">
        {/* Urgent Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" /> Urgent (0–1 day)
          </h2>
          {urgentItems.length > 0 ? (
            <div className="grid gap-3">
              {urgentItems.map(item => (
                <ItemCard key={item.id} item={item} urgency="urgent" />
              ))}
            </div>
          ) : (
            <Card className="bg-white/40 border-dashed border-2">
              <CardContent className="py-6 flex flex-col items-center justify-center text-center space-y-2">
                <p className="font-medium">All good for now</p>
                <p className="text-sm text-muted-foreground">Nothing urgent today.</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Soon Section */}
        {soonItems.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent-foreground" /> Soon (2–3 days)
            </h2>
            <div className="grid gap-3">
              {soonItems.map(item => (
                <ItemCard key={item.id} item={item} urgency="soon" />
              ))}
            </div>
          </section>
        )}

        {/* Everything Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Everything</h2>
          {activeItems.length > 0 ? (
            <div className="grid gap-3">
              {otherItems.map(item => (
                <ItemCard key={item.id} item={item} urgency="safe" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <PackageOpen className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Your shelf is empty</h3>
                <p className="text-muted-foreground">Add your first item in 3 seconds.</p>
              </div>
              <Link href="/add-item">
                <Button className="rounded-2xl px-8 bg-primary">Add an item</Button>
              </Link>
            </div>
          )}
        </section>
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6">
        <Link href="/add-item">
          <Button className="w-full h-16 rounded-3xl text-lg font-bold shadow-xl bg-primary hover:bg-primary/90 flex gap-2">
            <Plus className="w-6 h-6" /> Add item
          </Button>
        </Link>
      </div>
    </div>
  );
}

function ItemCard({ item, urgency }: { item: ShelfItem, urgency: 'urgent' | 'soon' | 'safe' }) {
  const daysLeft = differenceInDays(new Date(item.expiryDate), new Date());
  
  const urgencyColors = {
    urgent: 'border-l-4 border-l-destructive bg-white',
    soon: 'border-l-4 border-l-accent bg-white',
    safe: 'bg-white'
  };

  return (
    <Link href={`/item/${item.id}`}>
      <Card className={`${urgencyColors[urgency]} hover:shadow-md transition-all active:scale-[0.98] group`}>
        <CardContent className="p-4 flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <div className="flex gap-2 items-center">
              <Badge variant="secondary" className="font-normal">{item.category}</Badge>
              <span className="text-xs text-muted-foreground">{item.storage}</span>
            </div>
          </div>
          <div className="text-right flex items-center gap-3">
            <div className="space-y-1">
              {urgency === 'urgent' && <p className="text-xs font-bold text-destructive">EXPIRES TODAY</p>}
              {urgency === 'soon' && <p className="text-xs font-bold text-accent-foreground">{daysLeft}d left</p>}
              {urgency === 'safe' && <p className="text-xs text-muted-foreground">{daysLeft}d left</p>}
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}