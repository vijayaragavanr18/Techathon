'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAppointments, Appointment } from '@/services/health'; // Reusing appointments for checkups
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { Loader2, ClipboardList, CalendarPlus, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"; // Import Dialog components

// Filter appointments to show only those likely to be child checkups (e.g., Pediatrician)
const filterChildCheckups = (appointments: Appointment[]): Appointment[] => {
   return appointments.filter(app => app.doctorSpeciality?.toLowerCase() === 'pediatrician');
};

export default function ChildCheckupsPage() {
  const [checkups, setCheckups] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCheckup, setSelectedCheckup] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog visibility
  const { toast } = useToast();


  useEffect(() => {
    const fetchCheckups = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const allAppointments = await getAppointments();
        const childCheckupsData = filterChildCheckups(allAppointments);
         // Sort by date, most recent first for past, earliest first for upcoming
        const sortedData = childCheckupsData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setCheckups(sortedData);
      } catch (err) {
        console.error("Failed to fetch checkups:", err);
        setError("Could not load checkup history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCheckups();
  }, []);

   const upcomingCheckups = checkups.filter(app => new Date(app.date) >= new Date());
   const pastCheckups = checkups.filter(app => new Date(app.date) < new Date()).reverse(); // Show most recent first

    // Function to handle opening the dialog
   const handleOpenDialog = (checkup: Appointment) => {
     setSelectedCheckup(checkup);
     setIsDialogOpen(true);
   };

   // Function to handle closing the dialog
   const handleDialogClose = () => {
     setIsDialogOpen(false);
     // Delay resetting selectedCheckup slightly for smoother animation if needed
     // setTimeout(() => setSelectedCheckup(null), 150);
     setSelectedCheckup(null); // Reset selected checkup when dialog closes
   };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
           <ClipboardList className="w-6 h-6" /> Health Checkups
         </h1>{/*
         <Button>
            <CalendarPlus className="mr-2 h-4 w-4" /> Schedule Checkup
         </Button>*/}
       </div>
       <p className="text-muted-foreground">Track your child's regular health checkups with the pediatrician.</p>

      {error && <p className="text-destructive">{error}</p>}

       {/* Upcoming Checkups */}
       <Card>
         <CardHeader>
           <CardTitle>Upcoming Checkups</CardTitle>
         </CardHeader>
         <CardContent>
           {isLoading ? (
             <div className="flex justify-center items-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
             </div>
           ) : upcomingCheckups.length > 0 ? (
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Date</TableHead>
                     <TableHead>Time</TableHead>
                     <TableHead>Doctor</TableHead>
                     <TableHead>Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {upcomingCheckups.map((app, index) => (
                     <TableRow key={index}>
                       <TableCell>{format(new Date(app.date), 'PPP')}</TableCell>
                       <TableCell>{app.time}</TableCell>
                       <TableCell>{app.doctorName}</TableCell>
                        <TableCell>
                          {/* Button now just triggers the state change */}
                          <Button variant="outline" size="sm" onClick={() => handleOpenDialog(app)}>
                            <Info className="mr-1 h-3 w-3" /> Details
                          </Button>
                        </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
           ) : (
             <p className="text-muted-foreground text-center py-4">No upcoming checkups scheduled.</p>
           )}
         </CardContent>
       </Card>

       {/* Past Checkups */}
       <Card>
         <CardHeader>
           <CardTitle>Checkup History</CardTitle>
         </CardHeader>
         <CardContent>
           {isLoading && pastCheckups.length === 0 ? ( // Show loader only if history is also loading
               <div className="flex justify-center items-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
               </div>
           ) : pastCheckups.length > 0 ? (
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Date</TableHead>
                     <TableHead>Doctor</TableHead>
                     <TableHead>Notes/Summary</TableHead>
                     <TableHead>Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {pastCheckups.slice(0, 5).map((app, index) => ( // Show recent 5
                     <TableRow key={index} className="opacity-80">
                       <TableCell>{format(new Date(app.date), 'PPP')}</TableCell>
                       <TableCell>{app.doctorName}</TableCell>
                       <TableCell className="text-sm italic text-muted-foreground">Notes placeholder...</TableCell>
                       <TableCell>
                         {/* Button now just triggers the state change */}
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(app)}>
                            <Info className="mr-1 h-3 w-3" /> View Details
                          </Button>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
           ) : (
             <p className="text-muted-foreground text-center py-4">No past checkups recorded.</p>
           )}
            {pastCheckups.length > 5 && <Button variant="link" className="mt-2">View Full History</Button>}
         </CardContent>
       </Card>

       {/* Centralized Details Dialog controlled by state */}
       <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Checkup Details</DialogTitle>
             <DialogDescription>
               {selectedCheckup ? `Details for checkup on ${format(new Date(selectedCheckup.date), 'PPP')} with ${selectedCheckup.doctorName}` : 'Checkup details'}
             </DialogDescription>
           </DialogHeader>
           {selectedCheckup ? (
             <div className="py-4 space-y-2">
               <p><strong>Date:</strong> {format(new Date(selectedCheckup.date), 'PPP')}</p>
               <p><strong>Time:</strong> {selectedCheckup.time}</p>
               <p><strong>Doctor:</strong> {selectedCheckup.doctorName} ({selectedCheckup.doctorSpeciality})</p>
               <p><strong>Notes:</strong> Placeholder for doctor's notes, observations, measurements (height, weight, head circumference), and any advice given during the checkup.</p>
               <p><strong>Vitals Taken:</strong> Placeholder (e.g., Temperature, Heart Rate)</p>
               <p><strong>Follow-up:</strong> Placeholder (e.g., Next checkup due in 3 months, Referral needed)</p>
             </div>
           ) : (
             <p>Loading details...</p> // Display a loading or placeholder message
           )}
           <DialogFooter>
              {/* Use a regular button to close the controlled dialog */}
              <Button type="button" variant="secondary" onClick={handleDialogClose}>
                  Close
              </Button>
           </DialogFooter>
         </DialogContent>
        </Dialog>

    </div>
  );
}
