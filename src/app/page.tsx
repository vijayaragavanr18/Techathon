'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Wand2 } from 'lucide-react'; // Using Wand2 for AI
import { getHealthSuggestion, HealthSuggestionInput, HealthSuggestionOutput } from '@/ai/flows/health-suggestion';
import { useToast } from '@/hooks/use-toast';


export default function AiSuggestionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<HealthSuggestionInput>({
    age: 30, // Default age
    isMother: true, // Default role
    isChild: false,
    concerns: '', // Initialize new field
    activityLevel: 'Moderately Active', // Initialize with a default
  });
  const { toast } = useToast();


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setUserInput(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

   const handleSelectChange = (name: string, value: string) => {
     setUserInput(prev => ({
       ...prev,
       [name]: value,
     }));
   };


  const handleRoleChange = (value: string) => {
    setUserInput(prev => ({
      ...prev,
      isMother: value === 'mother',
      isChild: value === 'child',
    }));
  };

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]); // Clear previous suggestions
    try {
      // Basic validation
      if (userInput.age <= 0) {
        throw new Error("Please enter a valid age.");
      }
      if (!userInput.isMother && !userInput.isChild) {
          throw new Error("Please select a role (Mother or Child).");
      }
      const result: HealthSuggestionOutput = await getHealthSuggestion(userInput);
      setSuggestions(result.suggestions);
      toast({
         title: "Suggestions Generated",
         description: "AI has provided personalized health tips.",
       });
    } catch (err: any) {
      console.error("Error fetching suggestions:", err);
       const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
       setError(errorMessage);
       toast({
         variant: "destructive",
         title: "Error Generating Suggestions",
         description: errorMessage,
       });
    } finally {
      setIsLoading(false);
    }
  };

  // Optionally fetch suggestions on initial load if desired, or require user interaction
  // useEffect(() => {
  //   fetchSuggestions();
  // }, []); // Be careful with fetching on load without user context


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
        <Wand2 className="h-6 w-6" /> AI Health Assistant
      </h1>
      <p className="text-muted-foreground">
        Get personalized health suggestions and reminders based on your profile and health data. Fill in the details below for the best advice.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile Information</CardTitle>
          <p className="text-sm text-muted-foreground">Provide some basic information for tailored advice.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Your Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={userInput.age}
                onChange={handleInputChange}
                placeholder="Enter your age"
                min="1"
                required
              />
            </div>
            <div>
              <Label>Role</Label>
              <RadioGroup
                 value={userInput.isMother ? 'mother' : userInput.isChild ? 'child' : ''}
                 onValueChange={handleRoleChange}
                 className="flex space-x-4 pt-2"
               >
                 <div className="flex items-center space-x-2">
                   <RadioGroupItem value="mother" id="mother" />
                   <Label htmlFor="mother">Mother</Label>
                 </div>
                 <div className="flex items-center space-x-2">
                   <RadioGroupItem value="child" id="child" />
                   <Label htmlFor="child">Child</Label>
                 </div>
               </RadioGroup>
            </div>
             <div>
               <Label htmlFor="activityLevel">Activity Level</Label>
                <Select
                  name="activityLevel"
                  value={userInput.activityLevel}
                  onValueChange={(value) => handleSelectChange('activityLevel', value)}
                >
                  <SelectTrigger id="activityLevel">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedentary">Sedentary (Little or no exercise)</SelectItem>
                    <SelectItem value="Lightly Active">Lightly Active (Light exercise/sports 1-3 days/week)</SelectItem>
                    <SelectItem value="Moderately Active">Moderately Active (Moderate exercise/sports 3-5 days/week)</SelectItem>
                    <SelectItem value="Very Active">Very Active (Hard exercise/sports 6-7 days a week)</SelectItem>
                  </SelectContent>
                </Select>
             </div>
              {/* Empty div for grid alignment if needed, or place concerns here if desired */}
             <div className="md:col-span-2">
               <Label htmlFor="concerns">Specific Concerns/Symptoms (Optional)</Label>
               <Textarea
                 id="concerns"
                 name="concerns"
                 value={userInput.concerns}
                 onChange={handleInputChange}
                 placeholder="e.g., Morning sickness, trouble sleeping, child's recent cough..."
                 rows={3}
               />
             </div>
          </div>
           <Button onClick={fetchSuggestions} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Get AI Suggestions'
            )}
          </Button>
        </CardContent>
      </Card>


       {error && (
         <Alert variant="destructive">
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
       )}


       {isLoading && !error && (
          <div className="flex justify-center items-center py-10">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
             <span className="ml-2 text-muted-foreground">Loading suggestions...</span>
          </div>
       )}


       {!isLoading && !error && suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Personalized Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}


       {!isLoading && !error && suggestions.length === 0 && (
          <Card>
             <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">Enter your details and click "Get AI Suggestions" to see personalized advice.</p>
             </CardContent>
          </Card>
       )}
    </div>
  );
}
