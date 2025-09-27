'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Apple, Info, Download } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import jsPDF from 'jspdf'; // Import jsPDF
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { format } from 'date-fns'; // For date in footer


// Placeholder data - replace with actual diet plans, potentially fetched based on age
const dietPlans = {
  '0-6': {
    title: '0-6 Months: Exclusive Breastfeeding/Formula',
    recommendations: [
      'Exclusive breastfeeding is recommended for the first 6 months.',
      'If formula feeding, use an appropriate iron-fortified infant formula.',
      'Feed on demand, typically every 2-3 hours.',
      'Look for hunger cues like rooting, sucking motions, and lip smacking.',
      'Ensure proper latch if breastfeeding.',
      'No water, juice, or solid foods needed at this stage.',
    ],
    importantNotes: 'Consult your pediatrician for personalized feeding advice and vitamin D supplementation recommendations.',
    detailedPlan: [
        { time: 'Morning (On Demand)', meal: 'Breastmilk or Iron-Fortified Formula (approx. 60-120ml per feed)' },
        { time: 'Mid-day (On Demand)', meal: 'Breastmilk or Iron-Fortified Formula' },
        { time: 'Afternoon (On Demand)', meal: 'Breastmilk or Iron-Fortified Formula' },
        { time: 'Evening (On Demand)', meal: 'Breastmilk or Iron-Fortified Formula' },
        { time: 'Night (On Demand)', meal: 'Breastmilk or Iron-Fortified Formula' },
        { time: 'Tips', meal: 'Sterilize bottles and feeding equipment properly. Burp baby after feeds.' },
    ]
  },
  '6-9': {
    title: '6-9 Months: Introduction to Solids',
    recommendations: [
      'Continue breastfeeding or formula feeding as the primary source of nutrition.',
      'Introduce single-ingredient pureed foods (vegetables, fruits, infant cereals) one at a time, waiting 2-3 days between new foods.',
      'Start with iron-rich foods like iron-fortified cereals and pureed meats.',
      'Offer smooth purees initially, gradually increasing texture.',
      'Introduce potential allergens (like eggs, peanuts - in appropriate form) one at a time, under guidance.',
      'Offer small amounts of water in a sippy cup with meals.',
      'Aim for 1-2 solid meals per day initially.',
    ],
    importantNotes: 'Watch for signs of readiness for solids (good head control, interest in food). Avoid honey and cow\'s milk as a drink before 1 year.',
    detailedPlan: [
        { time: 'Breakfast', meal: 'Breastmilk/Formula + 1-2 tbsp Iron-Fortified Infant Cereal (e.g., oat or barley) mixed with breastmilk/formula or water. Example: Gerber Single Grain Oatmeal.' },
        { time: 'Mid-Morning Snack', meal: 'Breastmilk/Formula' },
        { time: 'Lunch', meal: 'Breastmilk/Formula + 1-2 tbsp Single-Ingredient Pureed Vegetable or Fruit (e.g., sweet potato, carrot, pear, banana). Example: Earth\'s Best Organic Stage 1 Carrots.' },
        { time: 'Afternoon Snack', meal: 'Breastmilk/Formula' },
        { time: 'Dinner', meal: 'Breastmilk/Formula (Solid meal optional at this stage, can repeat lunch or cereal)' },
        { time: 'Bedtime', meal: 'Breastmilk/Formula' },
        { time: 'Tips', meal: 'Introduce one new food every 2-3 days. Start with smooth purees.' },
    ]
  },
  '9-12': {
    title: '9-12 Months: Expanding Diet & Textures',
    recommendations: [
      'Continue breastfeeding or formula feeding.',
      'Offer a wider variety of foods: mashed vegetables/fruits, soft cooked meats, poultry, beans, yogurt, cheese.',
      'Increase texture: offer lumpy purees, mashed foods, and soft finger foods (cooked peas, small pieces of soft fruit, toast strips).',
      'Encourage self-feeding with fingers.',
      'Offer 3 meals and 1-2 snacks per day.',
      'Continue offering water in a sippy cup.',
      'Include iron-rich and vitamin C-rich foods together to enhance iron absorption.',
    ],
    importantNotes: 'Supervise closely during mealtimes to prevent choking. Introduce utensils but expect messiness.',
     detailedPlan: [
        { time: 'Breakfast', meal: 'Breastmilk/Formula + 2-4 tbsp Iron-Fortified Cereal or Scrambled Egg Yolk + Small pieces of soft fruit (e.g., banana, ripe peach). Example: Happy Baby Organics Oatmeal Cereal.' },
        { time: 'Mid-Morning Snack', meal: 'Breastmilk/Formula or Plain Whole Milk Yogurt or Small pieces of soft cheese.' },
        { time: 'Lunch', meal: 'Breastmilk/Formula + 2-4 tbsp Pureed/Mashed Meat/Poultry/Beans + 2-4 tbsp Mashed Vegetables (e.g., peas, green beans) + Soft finger foods like toast strips or teething biscuits. Example: Beech-Nut Naturals Stage 2 Chicken & Broth.' },
        { time: 'Afternoon Snack', meal: 'Breastmilk/Formula or Mashed fruit or Soft cooked vegetable sticks.' },
        { time: 'Dinner', meal: 'Breastmilk/Formula + Similar to Lunch (vary the protein/veg) + Small portion of family meal if appropriate (soft, no added salt/sugar).' },
        { time: 'Bedtime', meal: 'Breastmilk/Formula' },
        { time: 'Tips', meal: 'Offer lumpy textures and soft finger foods. Encourage self-feeding.' },
    ]
  },
  '12-24': {
     title: '12-24 Months (1-2 Years): Toddler Nutrition',
     recommendations: [
       'Transition to whole cow\'s milk (if no allergies, limit to 16-24 oz/day) or continue breastfeeding.',
       'Offer 3 meals and 2 healthy snacks per day.',
       'Provide a variety of foods from all food groups: fruits, vegetables, grains, protein foods, dairy.',
       'Cut foods into small, manageable pieces to prevent choking (e.g., grapes cut lengthwise, hot dogs cut lengthwise and then into small pieces).',
       'Encourage use of utensils and drinking from an open cup.',
       'Limit sugary drinks and processed foods.',
       'Involve toddlers in simple meal prep tasks.',
     ],
     importantNotes: 'Toddler appetites can fluctuate; focus on offering healthy options consistently. Continue vitamin D supplementation as recommended.',
     detailedPlan: [
        { time: 'Breakfast', meal: 'Whole Milk (4-6 oz) + 1/2 cup Cooked Oatmeal with fruit or 1 Scrambled Egg + 1/2 slice Whole Wheat Toast. Example: Quaker Old Fashioned Oats.' },
        { time: 'Mid-Morning Snack', meal: '1/4 cup Sliced fruit (e.g., berries, melon) + 2-3 Whole Grain Crackers. Example: Stonyfield Organic YoBaby Yogurt + Gerber Graduates Arrowroot Cookies.' },
        { time: 'Lunch', meal: 'Whole Milk (4-6 oz) + 1-2 oz Cooked Chicken/Fish/Tofu (shredded/cubed) + 1/4 cup Cooked Vegetables (e.g., broccoli florets, diced carrots) + 1/4 cup Whole Wheat Pasta or Brown Rice.' },
        { time: 'Afternoon Snack', meal: '1/4 cup Cottage Cheese or Hummus + Soft vegetable sticks (cucumber, bell pepper strips).' },
        { time: 'Dinner', meal: 'Whole Milk (4-6 oz) + Similar to Lunch (offer variety) or Small portion of family meal (ensure safe texture/size).' },
        { time: 'Tips', meal: 'Offer variety from all food groups. Cut food into bite-sized pieces. Encourage utensil use.' },
    ]
   },
   '2-5': {
     title: '2-5 Years: Preschooler Nutrition',
     recommendations: [
        'Offer 3 meals and 1-2 planned snacks daily.',
        'Focus on nutrient-dense foods: whole grains, lean proteins, fruits, vegetables, low-fat dairy.',
        'Continue to offer a variety of foods, even if initially refused.',
        'Involve children in choosing and preparing meals.',
        'Model healthy eating habits.',
        'Limit sugary drinks, processed snacks, and excessive fats.',
        'Ensure adequate hydration with water.',
        'Pay attention to portion sizes appropriate for preschoolers.',
     ],
     importantNotes: 'Establish regular meal and snack times. Make mealtimes pleasant and social. Consult your pediatrician or a registered dietitian for specific concerns.',
     detailedPlan: [
        { time: 'Breakfast', meal: 'Low-Fat Milk (6-8 oz) + 1/2 - 1 cup Whole Grain Cereal or 1 slice Whole Wheat Toast with Peanut Butter + 1/2 Banana. Example: Cheerios + Jif Natural Peanut Butter.' },
        { time: 'Mid-Morning Snack', meal: 'Apple slices + 1 oz Cheese Stick or Small handful of nuts (if age-appropriate and no allergies). Example: Sargento String Cheese.' },
        { time: 'Lunch', meal: 'Water + Turkey/Ham Sandwich on Whole Wheat Bread with lettuce/tomato or Leftovers from dinner + 1/2 cup Mixed Vegetables + 1/2 cup Fruit Salad.' },
        { time: 'Afternoon Snack', meal: 'Yogurt Cup or Smoothie made with fruit and yogurt or Veggie sticks with hummus. Example: Go-GURT Low Fat Yogurt.' },
        { time: 'Dinner', meal: 'Water + 2-3 oz Baked Chicken/Fish or Lentil Soup + 1/2 cup Brown Rice/Quinoa + 1/2 cup Steamed Green Beans.' },
        { time: 'Tips', meal: 'Offer balanced meals with protein, carbs, and fats. Involve child in simple meal prep. Limit processed foods and sugary drinks.' },
    ]
   }
};

type AgeGroup = keyof typeof dietPlans;

export default function ChildDietPage() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('0-6');
  const { toast } = useToast(); // Initialize toast

  const currentPlan = dietPlans[selectedAgeGroup];

  const handleDownloadPDF = () => {
    if (!currentPlan) return;

    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15; // Page margin in mm
    const maxLineWidth = pageWidth - margin * 2; // Max width for text lines
    let y = margin + 10; // Initial Y position, leaving space for header

    const checkAddPage = (requiredHeight: number) => {
       if (y + requiredHeight > pageHeight - (margin + 5)) { // Check if content fits, leave footer margin
          addFooter(doc, pageHeight, margin); // Add footer before new page
          doc.addPage();
          y = margin + 10; // Reset Y position for new page
          addHeader(doc, margin); // Add header on new page
       }
    };

    // --- Add Header ---
    const addHeader = (docInstance: jsPDF, margin: number) => {
       docInstance.setFontSize(10);
       docInstance.setFont(undefined, 'normal');
       docInstance.setTextColor(150); // Light gray
       docInstance.text('Navarah - Child Dietary Plan', margin, margin);
       docInstance.line(margin, margin + 2, pageWidth - margin, margin + 2); // Separator line
       docInstance.setTextColor(0); // Reset text color
    };

     // --- Add Footer ---
    const addFooter = (docInstance: jsPDF, pageHeight: number, margin: number) => {
        const pageNum = docInstance.getNumberOfPages();
        docInstance.setFontSize(8);
        docInstance.setTextColor(150);
        const footerText = `Generated on ${format(new Date(), 'PPP')} | Page ${pageNum}`;
        const textWidth = docInstance.getTextWidth(footerText);
        docInstance.text(footerText, (pageWidth - textWidth) / 2, pageHeight - margin + 5);
        docInstance.setTextColor(0);
    };


    // --- Add Content to PDF ---
    addHeader(doc, margin);

    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(currentPlan.title, margin, y);
    y += 10; // Space after title

    // Recommendations Section
    checkAddPage(10); // Check space for section title
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Recommendations:', margin, y);
    y += 6; // Space after section title
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    currentPlan.recommendations.forEach(rec => {
       const splitText = doc.splitTextToSize(`• ${rec}`, maxLineWidth - 3); // Use bullet points, slightly indent
       const textHeight = splitText.length * 4.5; // Estimate height (line height ~4.5mm for 10pt)
       checkAddPage(textHeight + 1); // Check space + small gap
       doc.text(splitText, margin + 3, y); // Indent bullet points
       y += textHeight + 1; // Increment y + gap
    });
    y += 5; // Extra space after section

    // Important Notes Section
    checkAddPage(10); // Check space for section title
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Important Notes:', margin, y);
    y += 6;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setFont(undefined, 'italic');
    const splitNotes = doc.splitTextToSize(currentPlan.importantNotes, maxLineWidth);
    const notesHeight = splitNotes.length * 4.5;
    checkAddPage(notesHeight + 5);
    doc.text(splitNotes, margin, y);
    y += notesHeight + 8; // Extra space after section
    doc.setFont(undefined, 'normal'); // Reset italic

    // Detailed Sample Plan Section
    if (currentPlan.detailedPlan && currentPlan.detailedPlan.length > 0) {
       checkAddPage(10); // Check space for section title
       doc.setFontSize(14);
       doc.setFont(undefined, 'bold');
       doc.text('Sample Daily Meal Plan:', margin, y);
       y += 8; // More space before the plan starts
       doc.setFontSize(10);

       currentPlan.detailedPlan.forEach(item => {
          doc.setFont(undefined, 'bold');
          const timeText = `${item.time}:`;
          const timeHeight = doc.splitTextToSize(timeText, maxLineWidth).length * 4.5;
          checkAddPage(timeHeight + 1); // Check for time text
          doc.text(timeText, margin, y);
          y += timeHeight + 1; // Add small gap after time

          doc.setFont(undefined, 'normal');
          const splitMeal = doc.splitTextToSize(item.meal, maxLineWidth - 5); // Indent meal text
          const mealHeight = splitMeal.length * 4.5;
          checkAddPage(mealHeight + 4); // Check for meal text + gap
          doc.text(splitMeal, margin + 5, y); // Indent meal description
          y += mealHeight + 4; // Increment y based on lines + more gap
       });
    }

    // Add Disclaimer
     y += 5; // Space before disclaimer
     checkAddPage(15); // Check space for disclaimer
     doc.setFontSize(8);
     doc.setFont(undefined, 'italic');
     doc.setTextColor(100);
     const disclaimer = "Disclaimer: This is a general dietary plan. Consult your pediatrician or a registered dietitian for personalized advice based on your child's specific needs, allergies, and health status. Product examples are illustrative and not endorsements.";
     const splitDisclaimer = doc.splitTextToSize(disclaimer, maxLineWidth);
     doc.text(splitDisclaimer, margin, y);
     doc.setFont(undefined, 'normal');
     doc.setTextColor(0);


    // --- Add Footer to the last page ---
    addFooter(doc, pageHeight, margin);


    // --- Save PDF ---
    try {
       doc.save(`Navarah_Diet_Plan_${selectedAgeGroup.replace('-', '_to_')}_Months.pdf`);
       toast({
         title: "Download Started",
         description: "Your dietary plan PDF is being generated.",
       });
    } catch (error) {
       console.error("Error generating PDF:", error);
       toast({
         variant: "destructive",
         title: "Download Failed",
         description: "Could not generate the PDF. Please try again.",
       });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
         <Apple className="w-6 h-6" /> Dietary Plans
      </h1>
      <p className="text-muted-foreground">Access age-appropriate dietary recommendations for your child.</p>

      <Card>
        <CardHeader>
          <CardTitle>Select Age Group</CardTitle>
           <Select onValueChange={(value) => setSelectedAgeGroup(value as AgeGroup)} defaultValue={selectedAgeGroup}>
             <SelectTrigger className="w-[280px]">
               <SelectValue placeholder="Select child's age group" />
             </SelectTrigger>
             <SelectContent>
               {Object.keys(dietPlans).map((age) => (
                  <SelectItem key={age} value={age}>{dietPlans[age as AgeGroup].title.split(':')[0]}</SelectItem>
               ))}
             </SelectContent>
           </Select>
        </CardHeader>
        <CardContent>
          {currentPlan ? (
             <Accordion type="single" collapsible defaultValue="recommendations">
                <AccordionItem value="recommendations">
                   <AccordionTrigger className="text-lg font-semibold">{currentPlan.title}</AccordionTrigger>
                   <AccordionContent>
                      <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                        {currentPlan.recommendations.map((rec, index) => (
                           <li key={index}>{rec}</li>
                        ))}
                      </ul>
                   </AccordionContent>
                </AccordionItem>
                 {/* Accordion Item for Detailed Plan */}
                 {currentPlan.detailedPlan && currentPlan.detailedPlan.length > 0 && (
                    <AccordionItem value="detailedPlan">
                      <AccordionTrigger className="text-lg font-semibold">Sample Daily Meal Plan</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          {currentPlan.detailedPlan.map((item, index) => (
                            <div key={index}>
                              <p className="font-medium text-foreground">{item.time}:</p>
                              <p className="text-muted-foreground pl-2">{item.meal}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                <AccordionItem value="notes">
                   <AccordionTrigger className="text-lg font-semibold flex items-center gap-2">
                      <Info className="w-4 h-4" /> Important Notes
                   </AccordionTrigger>
                   <AccordionContent>
                      <p className="text-muted-foreground italic">{currentPlan.importantNotes}</p>
                   </AccordionContent>
                </AccordionItem>
             </Accordion>

          ) : (
            <p className="text-muted-foreground text-center py-4">Select an age group to view the dietary plan.</p>
          )}
        </CardContent>
         <CardFooter>
            {currentPlan && (
               <Button variant="outline" onClick={handleDownloadPDF}>
                  <Download className="mr-2 h-4 w-4" /> Download Plan (PDF)
               </Button>
            )}
         </CardFooter>
      </Card>

       {/* Placeholder for AI dietary suggestions */}
       <Card>
         <CardHeader>
           <CardTitle>AI Dietary Tips</CardTitle>
         </CardHeader>
         <CardContent>
           <p className="text-muted-foreground">Personalized AI suggestions based on your child's specific needs (e.g., allergies, growth patterns) could appear here.</p>
         </CardContent>
       </Card>
    </div>
  );
}
