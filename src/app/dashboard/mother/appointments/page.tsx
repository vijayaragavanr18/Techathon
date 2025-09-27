'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar'; // Assuming Calendar component exists
import { getAppointments, Appointment } from '@/services/health';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { Loader2, CalendarPlus, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"; // Import Dialog components

export default function MotherAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [showAllPastAppointments, setShowAllPastAppointments] = useState(false); // State to control showing all past appointments
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null); // State for selected appointment details
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAppointments();
        // Sort appointments by date
        const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setAppointments(sortedData);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Could not load appointments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const upcomingAppointments = appointments.filter(app => new Date(app.date) >= new Date());
  const pastAppointments = appointments.filter(app => new Date(app.date) < new Date()).reverse(); // Reverse to show most recent first

  const displayedPastAppointments = showAllPastAppointments ? pastAppointments : pastAppointments.slice(0, 5);

  // Function to handle opening the dialog
  const handleOpenDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  // Function to handle closing the dialog
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedAppointment(null); // Reset selected appointment when dialog closes
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold text-primary">Appointments</h1>
         <Button>
            <CalendarPlus className="mr-2 h-4 w-4" /> Schedule New
         </Button>
      </div>


      {error && <p className="text-destructive">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Calendar View */}
         <Card className="lg:col-span-1">
           <CardHeader>
             <CardTitle>Calendar</CardTitle>
           </CardHeader>
           <CardContent className="flex justify-center">
             <Calendar
               mode="single"
               selected={selectedDate}
               onSelect={setSelectedDate}
               className="rounded-md border"
                // Highlight appointment dates (basic example)
               modifiers={{
                 highlighted: appointments.map(app => new Date(app.date)),
               }}
               modifiersStyles={{
                  highlighted: { border: "2px solid hsl(var(--accent))", borderRadius: '50%' },
               }}
             />
           </CardContent>
         </Card>

         {/* Upcoming Appointments */}
         <Card className="lg:col-span-2">
           <CardHeader>
             <CardTitle>Upcoming Appointments</CardTitle>
           </CardHeader>
           <CardContent>
             {isLoading ? (
               <div className="flex justify-center items-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
               </div>
             ) : upcomingAppointments.length > 0 ? (
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Date</TableHead>
                       <TableHead>Time</TableHead>
                       <TableHead>Doctor</TableHead>
                       <TableHead>Speciality</TableHead>
                       <TableHead>Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {upcomingAppointments.map((app, index) => (
                       <TableRow key={index}>
                         <TableCell>{format(new Date(app.date), 'PPP')}</TableCell>
                         <TableCell>{app.time}</TableCell>
                         <TableCell>{app.doctorName}</TableCell>
                         <TableCell>{app.doctorSpeciality}</TableCell>
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
               <p className="text-muted-foreground text-center py-4">No upcoming appointments.</p>
             )}
           </CardContent>
         </Card>

          {/* Past Appointments */}
         <Card className="lg:col-span-3">
           <CardHeader>
             <CardTitle>Past Appointments</CardTitle>
           </CardHeader>
           <CardContent>
             {isLoading && pastAppointments.length === 0 ? ( // Show loader only if history is also loading
                 <div className="flex justify-center items-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                 </div>
             ) : displayedPastAppointments.length > 0 ? (
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Date</TableHead>
                       <TableHead>Time</TableHead>
                       <TableHead>Doctor</TableHead>
                       <TableHead>Speciality</TableHead>
                       <TableHead>Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {displayedPastAppointments.map((app, index) => (
                       <TableRow key={index} className="opacity-70">
                         <TableCell>{format(new Date(app.date), 'PPP')}</TableCell>
                         <TableCell>{app.time}</TableCell>
                         <TableCell>{app.doctorName}</TableCell>
                         <TableCell>{app.doctorSpeciality}</TableCell>
                         <TableCell>
                            {/* Button now just triggers the state change */}
                           <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(app)}>
                             <Info className="mr-1 h-3 w-3" /> View Notes
                           </Button>
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
             ) : (
               <p className="text-muted-foreground text-center py-4">No past appointments recorded.</p>
             )}
              {pastAppointments.length > 5 && !showAllPastAppointments && (
                  <Button
                     variant="link"
                     className="mt-2"
                     onClick={() => setShowAllPastAppointments(true)}
                    >
                     View All Past Appointments
                   </Button>
              )}
              {showAllPastAppointments && (
                 <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => setShowAllPastAppointments(false)}
                   >
                    Show Less
                  </Button>
              )}
           </CardContent>
         </Card>
      </div>

      {/* Centralized Details Dialog controlled by state */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              {selectedAppointment ? `Details for appointment on ${format(new Date(selectedAppointment.date), 'PPP')} with ${selectedAppointment.doctorName}` : 'Appointment details'}
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment ? (
            <div className="py-4 space-y-2">
              <p><strong>Date:</strong> {format(new Date(selectedAppointment.date), 'PPP')}</p>
              <p><strong>Time:</strong> {selectedAppointment.time}</p>
              <p><strong>Doctor:</strong> {selectedAppointment.doctorName} ({selectedAppointment.doctorSpeciality})</p>
              <p><strong>Reason:</strong> Placeholder (e.g., Routine Prenatal Visit, Ultrasound, Consultation)</p>
              <p><strong>Notes:</strong> Placeholder for doctor's notes, tests performed, advice given.</p>
              <p><strong>Next Steps:</strong> Placeholder (e.g., Follow-up appointment scheduled, Lab tests ordered)</p>
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

    </div>
  );
}
