'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Import Accordion
import { searchKnowledgeBase, SearchKnowledgeInput, SearchKnowledgeOutput, KnowledgeBaseArticle } from '@/ai/flows/search-knowledge-base';
import { useToast } from '@/hooks/use-toast';


// Ensure each article object includes its category to match the schema
const knowledgeBase = [
  {
    category: 'Pregnancy Health',
    articles: [
      { category: 'Pregnancy Health', title: 'First Trimester Essentials', content: 'During the first trimester (weeks 1-12), focus on establishing healthy habits. Take prenatal vitamins, especially folic acid, to support neural tube development. Eat a balanced diet rich in fruits, vegetables, lean protein, and whole grains. Stay hydrated by drinking plenty of water. Manage common symptoms like nausea (try small, frequent meals, ginger) and fatigue (prioritize rest). Attend your first prenatal checkup to confirm pregnancy and discuss health history.' },
      { category: 'Pregnancy Health', title: 'Understanding Gestational Diabetes', content: 'Gestational diabetes is high blood sugar that develops during pregnancy and usually disappears after giving birth. Risk factors include being overweight, family history, and older maternal age. It\'s typically diagnosed via glucose screening tests between 24-28 weeks. Management involves dietary changes (monitoring carbohydrates, choosing whole foods), regular exercise, and sometimes medication or insulin. Controlling blood sugar is crucial to prevent complications for both mother (e.g., high blood pressure) and baby (e.g., large birth weight, jaundice).' },
      { category: 'Pregnancy Health', title: 'Benefits of Prenatal Exercise', content: 'Regular, moderate exercise during a healthy pregnancy offers numerous benefits: improved mood, better sleep, reduced backaches and constipation, potential prevention of gestational diabetes, and increased stamina for labor. Safe activities often include walking, swimming, stationary cycling, and modified prenatal yoga or Pilates. Avoid high-impact activities, contact sports, or exercises involving lying flat on your back later in pregnancy. Always consult your healthcare provider before starting or modifying an exercise routine.' },
    ],
  },
  {
    category: 'Postpartum Care',
    articles: [
      { category: 'Postpartum Care', title: 'Recovering After Birth', content: 'Postpartum recovery involves physical and emotional healing. Expect vaginal bleeding (lochia) for several weeks. Use pads, not tampons. Sitz baths or perineal spray can soothe soreness. Prioritize rest whenever possible, accept help, and eat nutritious meals. Watch for warning signs like heavy bleeding, fever, severe pain, or signs of infection, and contact your provider immediately. Pelvic floor exercises (Kegels) can aid recovery.' },
      { category: 'Postpartum Care', title: 'Breastfeeding Basics', content: 'Successful breastfeeding often starts with a good latch – baby\'s mouth should cover the nipple and much of the areola. Feed on demand (8-12 times in 24 hours initially). Look for hunger cues like rooting or sucking motions. Ensure you\'re comfortable and supported. Common challenges include sore nipples (check latch), engorgement (frequent feeding, cool compresses), and low supply concerns (seek lactation support). Stay hydrated and eat well.' },
      { category: 'Postpartum Care', title: 'Managing Postpartum Emotions', content: 'The "baby blues" (mood swings, sadness, anxiety) are common in the first two weeks postpartum. If symptoms are severe or last longer, it could be postpartum depression (PPD) or anxiety. PPD involves intense sadness, hopelessness, or loss of interest. Seek help from your healthcare provider if you suspect PPD or another mood disorder. Support groups, therapy, and sometimes medication can help manage postpartum emotional challenges.' },
    ],
  },
   {
    category: 'Infant Care (0-1 Year)',
    articles: [
      { category: 'Infant Care (0-1 Year)', title: 'Safe Sleep Practices', content: 'To reduce the risk of Sudden Infant Death Syndrome (SIDS), always place baby on their back to sleep for naps and at night. Use a firm, flat sleep surface (crib, bassinet, play yard) with only a fitted sheet. Keep the sleep area clear of soft bedding, blankets, pillows, bumpers, and toys. Room-sharing (baby in own sleep space in parents\' room) is recommended for at least the first 6 months. Avoid overheating; dress baby appropriately for the room temperature.' },
      { category: 'Infant Care (0-1 Year)', title: 'Recognizing Infant Milestones', content: 'Developmental milestones are skills most children achieve by a certain age. Examples include: Social smile (around 2 months), rolling over (4-6 months), sitting without support (6-7 months), crawling (6-10 months), pulling to stand (9-10 months), first words (around 12 months), and walking (12-15 months). Remember that timelines vary. Track milestones using checklists and discuss any concerns with your pediatrician during well-child visits.' },
      { category: 'Infant Care (0-1 Year)', title: 'Common Infant Illnesses', content: 'Infants are prone to common illnesses like colds (runny nose, cough, mild fever), ear infections (fussiness, ear pulling, fever), and diarrhea. Most colds are viral and resolve on their own; focus on comfort measures like saline drops and suctioning. Call the doctor for high fevers (especially in newborns), difficulty breathing, signs of dehydration (fewer wet diapers), persistent vomiting/diarrhea, or if the baby seems unusually lethargic or irritable.' },
    ],
  },
   {
     category: 'Toddler & Preschooler Health (1-5 Years)',
     articles: [
       { category: 'Toddler & Preschooler Health (1-5 Years)', title: 'Handling Picky Eaters', content: 'Picky eating is common in toddlers. Offer a variety of healthy foods consistently without pressure. Make mealtimes positive and avoid battles. Serve small portions and allow the child to ask for more. Involve them in simple food prep. Model healthy eating yourself. It can take many exposures for a child to accept a new food. Focus on the overall weekly intake rather than a single meal. Consult your pediatrician if you have concerns about growth or nutrition.' },
       { category: 'Toddler & Preschooler Health (1-5 Years)', title: 'Potty Training Readiness', content: 'Signs of readiness include staying dry for longer periods, showing interest in the toilet, understanding simple instructions, and communicating the need to go. Don\'t rush the process. Use positive reinforcement (praise, stickers). Expect accidents and handle them calmly. Choose appropriate potty chairs or seat reducers. Dress the child in easy-to-remove clothing. Consistency is key. Nighttime training often comes later than daytime training.' },
       { category: 'Toddler & Preschooler Health (1-5 Years)', title: 'Importance of Play', content: 'Play is crucial for cognitive, social, emotional, and physical development. Through play, children learn problem-solving, creativity, language skills, and how to interact with others. Provide age-appropriate toys and opportunities for both structured and unstructured play (indoors and outdoors). Ensure play environments are safe. Limit screen time and encourage active play.' },
     ],
   },
];

// Select a few articles to feature
const featuredArticles = [
  knowledgeBase[0].articles[0], // First Trimester Essentials
  knowledgeBase[1].articles[1], // Breastfeeding Basics
  knowledgeBase[2].articles[0], // Safe Sleep Practices
  knowledgeBase[3].articles[0], // Handling Picky Eaters
];


export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<KnowledgeBaseArticle[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
       toast({
         variant: "destructive",
         title: "Empty Search",
         description: "Please enter a term to search for.",
       });
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);
    setHasSearched(true);

    try {
      const input: SearchKnowledgeInput = {
         searchTerm: searchTerm.trim(),
         knowledgeBaseContext: knowledgeBase
      };
      const result: SearchKnowledgeOutput = await searchKnowledgeBase(input);
      setSearchResults(result.results);
      if (result.results.length === 0) {
        toast({
          title: "No Results",
          description: `No information found for "${searchTerm}". Try a different term.`,
        });
      } else {
         toast({
           title: "Search Complete",
           description: `Found ${result.results.length} relevant piece(s) of information.`,
         });
      }
    } catch (err: any) {
      console.error("Error searching knowledge base:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred during the search.";
      setSearchError(errorMessage);
      toast({
        variant: "destructive",
        title: "Search Error",
        description: errorMessage,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };


  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
       <h1 className="text-3xl font-bold text-primary flex items-center gap-2 mb-2">
         <BookOpen className="w-6 h-6" /> Knowledge Base
       </h1>
       <p className="text-muted-foreground text-lg mb-6">Find helpful articles and resources on maternal and child health.</p>

       {/* Search Input and Button */}
       <div className="flex gap-2 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Ask about pregnancy, infant care, etc..."
              className="pl-10 h-12 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSearching}
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching} className="h-12 px-6">
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Searching...
              </>
            ) : (
               <> <Wand2 className="mr-2 h-5 w-5" /> Search </>
            )}
          </Button>
       </div>

       {/* Error Display */}
       {searchError && (
         <Alert variant="destructive" className="mb-6">
            <AlertTitle>Search Failed</AlertTitle>
            <AlertDescription>{searchError}</AlertDescription>
          </Alert>
       )}

       {/* Loading State */}
       {isSearching && (
          <Card className="mb-6">
             <CardContent className="py-12 flex justify-center items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground">Searching for information...</p>
             </CardContent>
          </Card>
       )}

       {/* Search Results Display */}
       {!isSearching && hasSearched && searchResults.length > 0 && (
         <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary mb-4">Search Results:</h2>
            {searchResults.map((result, index) => (
               <Card key={`search-${index}`} className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-xl">{result.title}</CardTitle>
                     <p className="text-sm text-muted-foreground">Category: {result.category}</p>
                  </CardHeader>
                  <CardContent>
                     <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
                  </CardContent>
               </Card>
            ))}
         </div>
       )}

       {/* No Search Results Message */}
       {!isSearching && hasSearched && searchResults.length === 0 && !searchError && (
          <Card className="mb-6">
             <CardContent className="py-12">
              <p className="text-lg text-muted-foreground text-center">
                No information found matching your search term "{searchTerm}".
              </p>
            </CardContent>
          </Card>
       )}

       {/* Featured Articles Section (Accordion) */}
       {!isSearching && !hasSearched && (
         <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-primary mb-4">Common Topics:</h2>
             <Accordion type="single" collapsible className="w-full space-y-2">
                {featuredArticles.map((article, index) => (
                  <AccordionItem key={`featured-${index}`} value={`item-${index}`} className="border rounded-lg overflow-hidden">
                     <AccordionTrigger className="text-lg font-semibold hover:no-underline px-6 py-4 bg-card hover:bg-accent/50 transition-colors duration-200">
                        <div className="flex flex-col text-left">
                          <span>{article.title}</span>
                          <span className="text-sm font-normal text-muted-foreground">Category: {article.category}</span>
                        </div>
                     </AccordionTrigger>
                     <AccordionContent className="bg-card p-6">
                        <p className="text-muted-foreground leading-relaxed">{article.content}</p>
                     </AccordionContent>
                  </AccordionItem>
                ))}
             </Accordion>
         </div>
       )}

       {/* Initial Prompt Message */}
       {!isSearching && !hasSearched && (
         <Card className="mt-8 border-dashed">
            <CardContent className="py-8">
             <p className="text-lg text-muted-foreground text-center">
               Enter a search term above or browse common topics.
             </p>
           </CardContent>
         </Card>
       )}
    </div>
  );
}

    