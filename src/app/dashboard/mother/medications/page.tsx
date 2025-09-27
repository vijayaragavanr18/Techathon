'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMedicines, Medicine } from '@/services/health';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox"; // For marking intake
import { Loader2, Pill, PlusCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"; // Import Dialog components

export default function MotherMedicationsPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null); // State for selected medicine details
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility


   // State to track taken status (in a real app, this would persist)
  const [takenStatus, setTakenStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchMedicines = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMedicines();
        setMedicines(data);
         // Initialize taken status (example: all false initially for today)
         const initialStatus: Record<string, boolean> = {};
         data.forEach(med => {
           initialStatus[med.name] = false; // Key by name, adjust if IDs are available
         });
         setTakenStatus(initialStatus);
      } catch (err) {
        console.error("Failed to fetch medicines:", err);
        setError("Could not load medication list. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedicines();
  }, []);

   const handleTakenChange = (medicineName: string, checked: boolean | 'indeterminate') => {
     if (typeof checked === 'boolean') {
       setTakenStatus(prev => ({ ...prev, [medicineName]: checked }));
       toast({
         title: checked ? "Medicine Marked as Taken" : "Medicine Marked as Not Taken",
         description: `${medicineName}`,
       });
       // Here you would typically also update the backend/persistent storage
     }
   };

   // Function to handle opening the dialog
   const handleOpenDialog = (medicine: Medicine) => {
     setSelectedMedicine(medicine);
     setIsDialogOpen(true);
   };

   // Function to handle closing the dialog
   const handleDialogClose = () => {
     setIsDialogOpen(false);
     setSelectedMedicine(null); // Reset selected medicine when dialog closes
   };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold text-primary">Medications</h1>
         {/* Removed "Add New Medication" button */}
       </div>
       <p className="text-muted-foreground">Keep track of your prescribed medications and supplements.</p>

      {error && <p className="text-destructive">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Current Medications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center items-center p-4">
               <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : medicines.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Taken Today</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicines.map((med, index) => (
                  <TableRow key={index}>
                     <TableCell>
                       <Checkbox
                         checked={takenStatus[med.name] || false}
                         onCheckedChange={(checked) => handleTakenChange(med.name, checked)}
                         aria-label={`Mark ${med.name} as taken`}
                       />
                     </TableCell>
                    <TableCell className="font-medium flex items-center gap-2">
                        <Pill className="h-4 w-4 text-muted-foreground" /> {med.name}
                    </TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>{med.frequency}</TableCell>
                    <TableCell>
                       {/* Button now just triggers the state change */}
                       <Button variant="outline" size="sm" onClick={() => handleOpenDialog(med)}>
                          <Info className="mr-1 h-3 w-3" /> Details
                       </Button>
                       {/* Add delete/edit buttons here */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">No medications added yet.</p>
          )}
        </CardContent>
      </Card>

       {/* Centralized Details Dialog controlled by state */}
       <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Medication Details</DialogTitle>
             <DialogDescription>
               {selectedMedicine ? `Information for ${selectedMedicine.name}` : 'Medication details'}
             </DialogDescription>
           </DialogHeader>
           {selectedMedicine ? (
             <div className="py-4 space-y-2">
               <p><strong>Name:</strong> {selectedMedicine.name}</p>
               <p><strong>Dosage:</strong> {selectedMedicine.dosage}</p>
               <p><strong>Frequency:</strong> {selectedMedicine.frequency}</p>
               <p><strong>Purpose:</strong> Placeholder (e.g., To prevent neural tube defects, To treat iron deficiency anemia, To support bone health)</p>
               <p><strong>Prescribed By:</strong> Placeholder (e.g., Dr. Smith)</p>
               <p><strong>Instructions:</strong> Placeholder (e.g., Take with food, Take in the morning)</p>
               <p><strong>Side Effects:</strong> Placeholder (e.g., Common side effects include nausea, constipation)</p>
             </div>
           ) : (
             <p>Loading details...</p>
           )}
           <DialogFooter>
             <Button type="button" variant="secondary" onClick={handleDialogClose}>
               Close
             </Button>
           </DialogFooter>
         </DialogContent>
        </Dialog>


       {/* Optional: Section for Past Medications or Reminders */}
       {/*
       <Card>
         <CardHeader>
           <CardTitle>Reminders</CardTitle>
         </CardHeader>
         <CardContent>
            <p className="text-muted-foreground">Upcoming medication reminders will appear here.</p>
         </CardContent>
       </Card>
       */}
    </div>
  );
}
