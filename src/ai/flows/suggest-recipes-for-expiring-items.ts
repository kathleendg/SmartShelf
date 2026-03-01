'use server';
/**
 * @fileOverview This file implements a Genkit flow for suggesting recipes based on an expiring food item.
 *
 * - suggestRecipesForExpiringItems - A function that handles the recipe suggestion process.
 * - SuggestRecipesForExpiringItemsInput - The input type for the suggestRecipesForExpiringItems function.
 * - SuggestRecipesForExpiringItemsOutput - The return type for the suggestRecipesForExpiringItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRecipesForExpiringItemsInputSchema = z.object({
  itemName: z.string().describe('The name of the expiring food item.'),
  expiryDate: z.string().optional().describe('The estimated expiry date of the item.'),
  category: z.string().optional().describe('The category of the item (e.g., Dairy, Produce).'),
});
export type SuggestRecipesForExpiringItemsInput = z.infer<typeof SuggestRecipesForExpiringItemsInputSchema>;

const SuggestRecipesForExpiringItemsOutputSchema = z.object({
  recipeTitle: z.string().describe('The title of the suggested recipe.'),
  estimatedTime: z.string().describe('The estimated preparation and cooking time for the recipe (e.g., "30 min", "1 hour").'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe('The difficulty level of the recipe.'),
  usesItem: z.string().describe('The expiring item that this recipe prominently uses.'),
  ingredients: z.array(z.string()).describe('A list of ingredients required for the recipe.'),
  instructions: z.array(z.string()).describe('A step-by-step list of instructions to prepare the recipe.'),
  notes: z.string().optional().describe('Any additional notes about the recipe, such as using common pantry items.'),
});
export type SuggestRecipesForExpiringItemsOutput = z.infer<typeof SuggestRecipesForExpiringItemsOutputSchema>;

export async function suggestRecipesForExpiringItems(
  input: SuggestRecipesForExpiringItemsInput
): Promise<SuggestRecipesForExpiringItemsOutput> {
  return suggestRecipesForExpiringItemsFlow(input);
}

const recipeSuggestionPrompt = ai.definePrompt({
  name: 'recipeSuggestionPrompt',
  input: {schema: SuggestRecipesForExpiringItemsInputSchema},
  output: {schema: SuggestRecipesForExpiringItemsOutputSchema},
  prompt: `You are a helpful culinary assistant.
Suggest a simple and easy-to-prepare recipe that prominently uses the expiring food item: "{{{itemName}}}".
The recipe should primarily use "{{{itemName}}}" and common pantry ingredients.
If an expiry date is provided ({{{expiryDate}}}), emphasize quick preparation.
If a category is provided ({{{category}}}), consider recipes typical for that category.

Provide the response in a JSON format matching the following schema. Make sure to clearly list "{{{itemName}}}" in the ingredients.`,
});

const suggestRecipesForExpiringItemsFlow = ai.defineFlow(
  {
    name: 'suggestRecipesForExpiringItemsFlow',
    inputSchema: SuggestRecipesForExpiringItemsInputSchema,
    outputSchema: SuggestRecipesForExpiringItemsOutputSchema,
  },
  async (input) => {
    const {output} = await recipeSuggestionPrompt(input);
    if (!output) {
      throw new Error('Failed to get a recipe suggestion.');
    }
    return output;
  }
);
