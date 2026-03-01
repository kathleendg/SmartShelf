"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSmartShelfStore } from "@/lib/store";
import { suggestRecipesForExpiringItems, SuggestRecipesForExpiringItemsOutput } from "@/ai/flows/suggest-recipes-for-expiring-items";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChefHat, Clock, Sparkles, RefreshCcw, CheckCircle2, AlertCircle } from "lucide-react";
import { differenceInHours } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeSuggestionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { items, markAsConsumed } = useSmartShelfStore();
  
  const item = items.find(i => i.id === id);
  const [recipe, setRecipe] = useState<SuggestRecipesForExpiringItemsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipe = async () => {
    if (!item) return;
    setLoading(true);
    setError(null);
    try {
      const result = await suggestRecipesForExpiringItems({
        itemName: item.name,
        category: item.category,
        expiryDate: item.expiryDate
      });
      setRecipe(result);
    } catch (err) {
      setError("Failed to find a recipe. Try freezing it or planning it for today.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  if (!item) return <div className="p-8">Item not found</div>;

  const hoursLeft = Math.max(0, differenceInHours(new Date(item.expiryDate), new Date()));

  return (
    <div className="min-h-screen bg-background p-6 space-y-8 animate-in fade-in duration-300">
      <header className="space-y-1">
        <Button size="icon" variant="ghost" onClick={() => router.back()} className="rounded-full -ml-2 mb-2">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Use up {item.name}</h1>
        <p className="text-muted-foreground flex items-center gap-1.5 font-medium">
          <Clock className="w-4 h-4 text-destructive" /> Expires in {hoursLeft} hours
        </p>
      </header>

      {loading ? (
        <Card className="rounded-3xl border-none shadow-lg overflow-hidden animate-pulse">
          <CardHeader className="bg-primary/5 pb-2">
             <Skeleton className="h-6 w-1/3 mb-2" />
             <Skeleton className="h-10 w-3/4" />
          </CardHeader>
          <CardContent className="p-6 space-y-6">
             <div className="flex gap-4">
               <Skeleton className="h-6 w-20" />
               <Skeleton className="h-6 w-20" />
             </div>
             <div className="space-y-2">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-2/3" />
             </div>
          </CardContent>
        </Card>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">No recipe found yet</h3>
            <p className="text-muted-foreground max-w-xs">{error}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button variant="secondary" className="rounded-2xl h-14">Freeze</Button>
            <Button className="rounded-2xl h-14 bg-primary">Plan today</Button>
          </div>
        </div>
      ) : recipe && (
        <Card className="rounded-3xl border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Sparkles className="w-24 h-24" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Suggested recipe</p>
            <CardTitle className="text-2xl font-bold leading-tight">{recipe.recipeTitle}</CardTitle>
            <div className="flex gap-4 mt-4">
               <div className="flex items-center gap-1.5 text-sm font-medium">
                 <Clock className="w-4 h-4" /> {recipe.estimatedTime}
               </div>
               <div className="flex items-center gap-1.5 text-sm font-medium">
                 <ChefHat className="w-4 h-4" /> {recipe.difficulty}
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <h3 className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" /> Ingredients
              </h3>
              <ul className="grid gap-2 text-sm text-muted-foreground pl-1">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold">Instructions</h3>
              <div className="space-y-4">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold shrink-0">{i+1}</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {recipe.notes && (
              <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
                <p className="text-xs text-accent-foreground leading-relaxed italic">
                  <strong>Note:</strong> {recipe.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {!loading && !error && (
          <>
            <Button onClick={() => { markAsConsumed(item.id); router.push("/"); }} className="h-14 text-lg bg-primary hover:bg-primary/90 rounded-2xl font-bold">
              I&apos;ll make this
            </Button>
            <Button variant="outline" onClick={fetchRecipe} className="h-14 rounded-2xl font-semibold gap-2">
              <RefreshCcw className="w-5 h-5" /> Show another
            </Button>
          </>
        )}
        <Button variant="ghost" onClick={() => router.back()} className="h-12 text-muted-foreground rounded-2xl">
          Back to item
        </Button>
      </div>
    </div>
  );
}