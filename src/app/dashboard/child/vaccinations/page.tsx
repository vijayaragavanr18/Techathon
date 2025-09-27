'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getVaccinationSchedule, VaccinationSchedule } from '@/services/health';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Loader2, ShieldCheck, CalendarDays, PlusCircle, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // For Date Picker
import { Calendar } from "@/components/ui/calendar"; // For Date Picker
import { cn } from "@/lib/utils"; // For Date Picker styling

// Interface for the new vaccine form data
interface NewVaccineForm {
  vaccine: string;
  dueDate: Date | undefined; // Use Date type for picker
  status: string; // Keep as string, likely 'Completed' when adding manually
}

export default function ChildVaccinationsPage() {
  const [schedule, setSchedule] = useState<VaccinationSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Control dialog visibility
  const [newVaccineData, setNewVaccineData] = useState<NewVaccineForm>({
     vaccine: '',
     dueDate: undefined,
     status: 'Completed', // Default to Completed when adding record
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getVaccinationSchedule();
        // Sort by due date, putting 'Due' ones first, then by date
        const sortedData = data.sort((a, b) => {
           if (a.status === 'Due' && b.status !== 'Due') return -1;
           if (a.status !== 'Due' && b.status === 'Due') return 1;
           return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
         });
        setSchedule(sortedData);
      } catch (err) {
        console.error("Failed to fetch vaccination schedule:", err);
        setError("Could not load vaccination schedule. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, []);

   const handleMarkAsCompleted = (vaccineName: string) => {
      // TODO: Implement API call to update vaccination status
      console.log(`Marking ${vaccineName} as completed`);
      // Update local state optimistically (or after API success)
      setSchedule(prev =>
        prev.map(item =>
          item.vaccine === vaccineName ? { ...item, status: 'Completed' } : item
        ).sort((a, b) => { // Re-sort after update
             if (a.status === 'Due' && b.status !== 'Due') return -1;
             if (a.status !== 'Due' && b.status === 'Due') return 1;
             return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
           })
      );
       toast({
         title: "Vaccination Updated",
         description: `${vaccineName} marked as completed.`,
       });
   };

   const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
      switch (status.toLowerCase()) {
         case 'completed':
            return 'default';
         case 'due':
            return 'destructive';
         default:
            return 'secondary';
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     setNewVaccineData(prev => ({ ...prev, [name]: value }));
   };

   const handleDateChange = (date: Date | undefined) => {
      setNewVaccineData(prev => ({ ...prev, dueDate: date }));
   };

   const handleAddVaccineSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newVaccineData.vaccine || !newVaccineData.dueDate) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill in the vaccine name and date.",
        });
        return;
      }

      // TODO: Implement API call to save the new vaccination record
      console.log("Adding new vaccine record:", newVaccineData);

      const newRecord: VaccinationSchedule = {
        ...newVaccineData,
        dueDate: format(newVaccineData.dueDate, 'yyyy-MM-dd'), // Format date back to string for display/storage consistency
      };

      // Update local state optimistically
      setSchedule(prev =>
         [...prev, newRecord].sort((a, b) => { // Add and re-sort
            if (a.status === 'Due' && b.status !== 'Due') return -1;
            if (a.status !== 'Due' && b.status === 'Due') return 1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
         })
      );

      toast({
         title: "Vaccination Record Added",
         description: `${newVaccineData.vaccine} added successfully.`,
       });

      // Reset form and close dialog
      setNewVaccineData({ vaccine: '', dueDate: undefined, status: 'Completed' });
      setIsDialogOpen(false);
   };


  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
           <ShieldCheck className="w-6 h-6" /> Vaccination Schedule
         </h1>
         {/* Added Vaccination Dialog Trigger */}
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
               <Button>
                 <PlusCircle className="mr-2 h-4 w-4" /> Add Vaccination Record
               </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                 {/* Added DialogTitle here */}
                <DialogTitle>Add Vaccination Record</DialogTitle>
                <DialogDescription>
                  Enter the details of the vaccination administered.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddVaccineSubmit}>
                 <div className="grid gap-4 py-4">
                   <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="vaccine-name" className="text-right">
                       Vaccine Name
                     </Label>
                     <Input
                       id="vaccine-name"
                       name="vaccine" // Ensure name matches state key
                       value={newVaccineData.vaccine}
                       onChange={handleInputChange}
                       className="col-span-3"
                       required
                     />
                   </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="vaccine-date" className="text-right">
                       Date Given
                     </Label>
                     <Popover>
                         <PopoverTrigger asChild>
                           <Button
                             variant={"outline"}
                             className={cn(
                               "col-span-3 justify-start text-left font-normal",
                               !newVaccineData.dueDate && "text-muted-foreground"
                             )}
                           >
                             <CalendarIcon className="mr-2 h-4 w-4" />
                             {newVaccineData.dueDate ? format(newVaccineData.dueDate, "PPP") : <span>Pick a date</span>}
                           </Button>
                         </PopoverTrigger>
                         <PopoverContent className="w-auto p-0">
                           <Calendar
                             mode="single"
                             selected={newVaccineData.dueDate}
                             onSelect={handleDateChange}
                             initialFocus
                             disabled={(date) => date > new Date()}
                           />
                         </PopoverContent>
                       </Popover>
                   </div>
                 </div>
                 <DialogFooter>
                   <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                   </DialogClose>
                   <Button type="submit">Add Record</Button>
                 </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
       </div>
       <p className="text-muted-foreground">Stay up-to-date with your child's required vaccinations.</p>


      {error && <p className="text-destructive">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Schedule Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : schedule.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vaccine</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.vaccine}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(item.dueDate), 'PPP')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.status === 'Due' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsCompleted(item.vaccine)}
                        >
                          Mark as Completed
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">No vaccination schedule available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
