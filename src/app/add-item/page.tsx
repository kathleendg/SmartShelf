"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, StorageLocation, useSmartShelfStore } from "@/lib/store";
import { ArrowLeft, Plus } from "lucide-react";
import { format, addDays } from "date-fns";

const CATEGORIES: Category[] = ['Dairy', 'Meat/Seafood', 'Produce', 'Bakery', 'Pantry', 'Frozen', 'Leftovers', 'Drinks', 'Snacks', 'Other'];
const STORAGE: StorageLocation[] = ['Fridge', 'Pantry', 'Freezer'];

const DEFAULT_LIVES: Record<Category, number> = {
  'Dairy': 7,
  'Meat/Seafood': 3,
  'Produce': 5,
  'Bakery': 4,
  'Pantry': 30,
  'Frozen': 90,
  'Leftovers': 3,
  'Drinks': 10,
  'Snacks': 14,
  'Other': 7,
};

const QUICK_PICKS = ['Milk', 'Eggs', 'Bread', 'Chicken', 'Rice', 'Apples', 'Leftovers'];

export default function AddItemPage() {
  const router = useRouter();
  const { addItem, items } = useSmartShelfStore();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Produce");
  const [storage, setStorage] = useState<StorageLocation>("Fridge");
  const [addedDate, setAddedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [shelfLife, setShelfLife] = useState(DEFAULT_LIVES["Produce"]);

  const handleSave = () => {
    if (!name) return;
    
    const expiryDate = addDays(new Date(addedDate), shelfLife).toISOString();
    
    addItem({
      name,
      category,
      storage,
      addedDate: new Date(addedDate).toISOString(),
      expiryDate,
      status: 'active'
    });
    
    router.push("/");
  };

  const handleQuickPick = (pick: string) => {
    setName(pick);
    // Simple logic to auto-categorize some common picks
    if (['Milk', 'Eggs'].includes(pick)) { setCategory('Dairy'); setShelfLife(DEFAULT_LIVES['Dairy']); }
    if (pick === 'Bread') { setCategory('Bakery'); setShelfLife(DEFAULT_LIVES['Bakery']); }
    if (pick === 'Chicken') { setCategory('Meat/Seafood'); setShelfLife(DEFAULT_LIVES['Meat/Seafood']); }
    if (pick === 'Apples') { setCategory('Produce'); setShelfLife(DEFAULT_LIVES['Produce']); }
  };

  const expiryPreview = addDays(new Date(addedDate), shelfLife);
  const recentItems = Array.from(new Set(items.map(i => i.name))).slice(0, 4);

  return (
    <div className="min-h-screen bg-background p-6 space-y-8 animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4">
        <Button size="icon" variant="ghost" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-bold">Add item</h1>
      </header>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="itemName">Item name</Label>
          <Input
            id="itemName"
            placeholder="e.g., Milk, Eggs, Spinach"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 bg-white rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(val: Category) => {
              setCategory(val);
              setShelfLife(DEFAULT_LIVES[val]);
            }}>
              <SelectTrigger className="h-12 bg-white rounded-xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Stored in</Label>
            <Select value={storage} onValueChange={(val: StorageLocation) => setStorage(val)}>
              <SelectTrigger className="h-12 bg-white rounded-xl">
                <SelectValue placeholder="Storage" />
              </SelectTrigger>
              <SelectContent>
                {STORAGE.map(st => (
                  <SelectItem key={st} value={st}>{st}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="addedOn">Added on</Label>
          <Input
            id="addedOn"
            type="date"
            value={addedDate}
            onChange={(e) => setAddedDate(e.target.value)}
            className="h-12 bg-white rounded-xl"
          />
          <p className="text-xs text-muted-foreground">Usually today—change if needed.</p>
        </div>

        <div className="bg-secondary/40 p-4 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <Label className="text-sm">Default shelf life</Label>
              <p className="text-xs text-muted-foreground">Estimated based on category.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={() => setShelfLife(Math.max(1, shelfLife - 1))}>-</Button>
              <span className="w-12 text-center font-bold">{shelfLife} days</span>
              <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={() => setShelfLife(shelfLife + 1)}>+</Button>
            </div>
          </div>
          <div className="pt-2 border-t border-muted">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Estimated expiry</span>
              <span className="text-sm font-bold text-primary">Expires on {format(expiryPreview, "MMM dd, yyyy")}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">Quick add</Label>
            <div className="flex flex-wrap gap-2">
              {QUICK_PICKS.map(pick => (
                <Button key={pick} variant="secondary" size="sm" className="rounded-full px-4 h-9" onClick={() => handleQuickPick(pick)}>
                  {pick}
                </Button>
              ))}
            </div>
          </div>

          {recentItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <Label className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">Add again</Label>
                <span className="text-[10px] text-muted-foreground mb-2">RECENTLY TRACKED</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {recentItems.map(item => (
                  <Button key={item} variant="outline" size="sm" className="justify-start gap-2 h-10 rounded-xl" onClick={() => handleQuickPick(item)}>
                    <Plus className="w-3 h-3" /> {item}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={handleSave} className="h-14 text-lg bg-primary hover:bg-primary/90 rounded-2xl font-bold">
            Save item
          </Button>
          <Button variant="ghost" onClick={() => router.back()} className="h-12 text-muted-foreground rounded-2xl">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}