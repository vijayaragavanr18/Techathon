
'use server';
/**
 * @fileOverview An AI agent that searches a knowledge base for relevant articles.
 *
 * - searchKnowledgeBase - A function that handles the knowledge base search process.
 * - SearchKnowledgeInput - The input type for the searchKnowledgeBase function.
 * - SearchKnowledgeOutput - The return type for the searchKnowledgeBase function.
 * - KnowledgeBaseArticle - The structure of a single search result article.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

// Define the structure of a single article within the knowledge base
const KnowledgeBaseArticleSchema = z.object({
  category: z.string().describe('The category the article belongs to.'),
  title: z.string().describe('The title of the article.'),
  content: z.string().describe('The full content or description of the article.'),
});

// Define the structure of the entire knowledge base context passed to the AI
const KnowledgeBaseContextSchema = z.array(
  z.object({
    category: z.string(),
    articles: z.array(KnowledgeBaseArticleSchema),
  })
).describe('The complete knowledge base content provided as context.');


// Define the input schema for the flow
const SearchKnowledgeInputSchema = z.object({
  searchTerm: z.string().describe('The user query or keywords to search for in the knowledge base.'),
  knowledgeBaseContext: KnowledgeBaseContextSchema.describe('The knowledge base articles to search within.'),
});
export type SearchKnowledgeInput = z.infer<typeof SearchKnowledgeInputSchema>;


// Define the schema for a single search result (subset of article)
// DO NOT EXPORT the Zod schema object directly from a 'use server' file
const KnowledgeBaseArticleResultSchema = z.object({
  category: z.string().describe('The category of the found article.'),
  title: z.string().describe('The title of the found article.'),
  summary: z.string().describe('A concise summary of the relevant information found in the article related to the search term.'),
});
// Export the derived TypeScript type
export type KnowledgeBaseArticle = z.infer<typeof KnowledgeBaseArticleResultSchema>;

// Define the output schema for the flow
const SearchKnowledgeOutputSchema = z.object({
  results: z.array(KnowledgeBaseArticleResultSchema).describe('A list of relevant articles found, including their category, title, and a summary pertinent to the search term.'),
});
export type SearchKnowledgeOutput = z.infer<typeof SearchKnowledgeOutputSchema>;


// Exported wrapper function to call the flow
export async function searchKnowledgeBase(input: SearchKnowledgeInput): Promise<SearchKnowledgeOutput> {
  return searchKnowledgeBaseFlow(input);
}

// Define the Genkit prompt
const searchPrompt = ai.definePrompt({
  name: 'searchKnowledgeBasePrompt',
  input: {
    schema: z.object({
      searchTerm: SearchKnowledgeInputSchema.shape.searchTerm,
      // Use JSON string representation for large context to avoid overly complex Handlebars structures
      knowledgeBaseJson: z.string().describe('The knowledge base content as a JSON string.'),
    })
  },
  output: {
    schema: SearchKnowledgeOutputSchema
  },
  prompt: `You are a helpful assistant designed to search through a provided knowledge base about maternal and child health.
The user is searching for information related to: "{{searchTerm}}"

Search through the following knowledge base content provided as a JSON string:
\`\`\`json
{{{knowledgeBaseJson}}}
\`\`\`

Identify the articles most relevant to the user's search term "{{searchTerm}}".
For each relevant article found, provide:
1.  Its original category.
2.  Its original title.
3.  A brief summary (1-2 sentences) focusing specifically on the information relevant to the search term.

If no relevant articles are found, return an empty list of results. Ensure the output strictly follows the requested JSON format.
  `,
});


// Define the Genkit flow (internal, not exported)
const searchKnowledgeBaseFlow = ai.defineFlow<
  typeof SearchKnowledgeInputSchema,
  typeof SearchKnowledgeOutputSchema
>(
  {
    name: 'searchKnowledgeBaseFlow',
    inputSchema: SearchKnowledgeInputSchema,
    outputSchema: SearchKnowledgeOutputSchema,
  },
  async (input) => {
    // Convert the knowledge base context to a JSON string to pass into the prompt
    const knowledgeBaseJson = JSON.stringify(input.knowledgeBaseContext, null, 2); // Pretty print for readability if needed

    const {output} = await searchPrompt({
      searchTerm: input.searchTerm,
      knowledgeBaseJson: knowledgeBaseJson,
    });

    // Return the structured output from the AI
    return output!;
  }
);

