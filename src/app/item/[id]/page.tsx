"use client";

import { useParams, useRouter } from "next/navigation";
import { useSmartShelfStore, ShelfItem } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChefHat, Snowflake, CheckCircle, Trash2, CalendarClock, History } from "lucide-react";
import { format, differenceInDays, isPast, isToday } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ItemDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { items, markAsConsumed, markAsDiscarded, freezeItem } = useSmartShelfStore();
  
  const item = items.find(i => i.id === id);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [discardReason, setDiscardReason] = useState<string>("");

  if (!item) return <div className="p-8">Item not found</div>;

  const getStatus = (item: ShelfItem) => {
    const daysLeft = differenceInDays(new Date(item.expiryDate), new Date());
    if (isPast(new Date(item.expiryDate)) && !isToday(new Date(item.expiryDate))) {
      const daysAgo = Math.abs(daysLeft);
      return { label: `Expired ${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`, variant: 'destructive' as const };
    }
    if (daysLeft <= 1) return { label: `Urgent — expires in ${daysLeft === 0 ? 'today' : daysLeft + ' day'}`, variant: 'destructive' as const };
    if (daysLeft <= 3) return { label: `Use soon — ${daysLeft} days left`, variant: 'accent' as const };
    return { label: `Good for ${daysLeft} days`, variant: 'secondary' as const };
  };

  const status = getStatus(item);

  const handleDiscard = () => {
    markAsDiscarded(item.id, discardReason);
    router.push("/");
  };

  const handleFreeze = () => {
    freezeItem(item.id);
    setShowFreezeModal(false);
  };

  const handleConsume = () => {
    markAsConsumed(item.id);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-300">
      <header className="px-6 pt-12 pb-6 space-y-4">
        <Button size="icon" variant="ghost" onClick={() => router.back()} className="rounded-full -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight">{item.name}</h1>
            <Badge variant={status.variant === 'accent' ? 'outline' : status.variant} className={status.variant === 'accent' ? 'bg-accent text-accent-foreground border-none' : ''}>
              {status.label}
            </Badge>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-8">
        <section className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-muted">
            <span className="text-muted-foreground">Category</span>
            <span className="font-semibold">{item.category}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-muted">
            <span className="text-muted-foreground">Stored in</span>
            <span className="font-semibold">{item.storage}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-muted">
            <span className="text-muted-foreground">Added on</span>
            <span className="font-semibold">{format(new Date(item.addedDate), "MMM dd, yyyy")}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground">Estimated expiry</span>
            <span className="font-semibold">{format(new Date(item.expiryDate), "MMM dd, yyyy")}</span>
          </div>
        </section>

        <section className="grid gap-3">
          <Link href={`/recipe/${item.id}`} className="w-full">
            <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold flex gap-3">
              <ChefHat className="w-6 h-6" /> Cook now
            </Button>
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="h-14 rounded-2xl flex gap-2 font-semibold" onClick={() => setShowFreezeModal(true)}>
              <Snowflake className="w-5 h-5" /> Freeze
            </Button>
            <Button variant="secondary" className="h-14 rounded-2xl flex gap-2 font-semibold" onClick={handleConsume}>
              <CheckCircle className="w-5 h-5 text-primary" /> Consumed
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="ghost" className="h-14 rounded-2xl flex gap-2 text-muted-foreground" onClick={() => setShowDiscardModal(true)}>
              <Trash2 className="w-5 h-5" /> Discard
            </Button>
            <Button variant="ghost" className="h-14 rounded-2xl flex gap-2 text-muted-foreground">
              <CalendarClock className="w-5 h-5" /> Plan today
            </Button>
          </div>
        </section>
      </main>

      <AlertDialog open={showFreezeModal} onOpenChange={setShowFreezeModal}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Move to freezer?</AlertDialogTitle>
            <AlertDialogDescription>
              Freezing usually extends shelf life significantly. We&apos;ll automatically update the expiry estimate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Not now</AlertDialogCancel>
            <AlertDialogAction onClick={handleFreeze} className="rounded-xl bg-primary">Freeze it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDiscardModal} onOpenChange={setShowDiscardModal}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Discard item?</AlertDialogTitle>
            <AlertDialogDescription>Why was it discarded? (optional)</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <RadioGroup value={discardReason} onValueChange={setDiscardReason}>
              {['Spoiled', 'Forgot', 'Cooked too much', 'Didn\'t like it', 'Other'].map(r => (
                <div key={r} className="flex items-center space-x-2 py-1">
                  <RadioGroupItem value={r} id={r} />
                  <Label htmlFor={r}>{r}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscard} className="rounded-xl bg-destructive">Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}