"use client";

import { useSmartShelfStore, ShelfItem } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, AlertTriangle, Calendar, PackageOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { differenceInDays, isPast, isToday } from "date-fns";

export default function DailyDigestPage() {
  const router = useRouter();
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

  const totalActionNeeded = urgentItems.length + soonItems.length;

  return (
    <div className="min-h-screen bg-background p-6 space-y-8 animate-in fade-in duration-300">
      <header className="space-y-4">
        <Button size="icon" variant="ghost" onClick={() => router.back()} className="rounded-full -ml-2 mb-2">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Today&apos;s Smart Shelf</h1>
        <p className="text-muted-foreground text-lg">
          {totalActionNeeded > 0 ? `${totalActionNeeded} items need attention.` : "You're all caught up!"}
        </p>
      </header>

      {totalActionNeeded > 0 ? (
        <div className="space-y-10">
          {urgentItems.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-destructive flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Use today
              </h2>
              <div className="grid gap-3">
                {urgentItems.map(item => (
                   <DigestItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {soonItems.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Plan next
              </h2>
              <div className="grid gap-3">
                {soonItems.map(item => (
                   <DigestItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Nothing urgent today</h3>
            <p className="text-muted-foreground">You&apos;re on track. Add items to get better reminders.</p>
          </div>
          <Link href="/add-item">
            <Button className="rounded-2xl px-8 bg-primary mt-4">Add items</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function DigestItem({ item }: { item: ShelfItem }) {
  return (
    <Link href={`/item/${item.id}`}>
      <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow group">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <PackageOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-lg">{item.name}</h4>
              <p className="text-xs text-muted-foreground uppercase">{item.storage} • {item.category}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs font-bold group-hover:bg-primary group-hover:text-white transition-colors">
            Choose action
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}