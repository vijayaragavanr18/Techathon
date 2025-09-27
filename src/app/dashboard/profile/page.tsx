'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, CheckCircle, XCircle } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"; // Import Dialog components
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  // Placeholder data - replace with actual user data fetching
  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatarUrl: 'https://picsum.photos/100/100', // Placeholder image
    birthCertificateVerified: false, // If false, user needs to apply for RCHID to get it verified/issued.
  };

  const statusLabel = user.birthCertificateVerified ? 'Verified' : 'Not Verified';
  const StatusIcon = user.birthCertificateVerified ? CheckCircle : XCircle;
  const iconColor = user.birthCertificateVerified ? 'text-green-500' : 'text-yellow-500';
  const { toast } = useToast();

  // State for RCHID form data (updated fields for pregnancy application)
  const [rchidFormData, setRchidFormData] = useState({
     motherName: user.name, // Pre-fill if possible
     fatherName: '',
     motherAadhaar: '',
     fatherAadhaar: '', // Added
     mobileNumber: '', // Added
     lmp: '', // Last Menstrual Period (Added)
     address: '',
     bankAccountNumber: '', // Added (Optional)
     bankIfscCode: '', // Added (Optional)
   });
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isRchidDialogOpen, setIsRchidDialogOpen] = useState(false); // Control dialog visibility

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     setRchidFormData(prev => ({ ...prev, [name]: value }));
   };

  const handleRchidSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsSubmitting(true);
     console.log("Submitting RCHID Application:", rchidFormData);
     // TODO: Implement actual API call to submit RCHID application
     await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

     toast({
       title: "RCHID Application Submitted",
       description: "Your application is being processed. (Simulated)",
     });
     setIsSubmitting(false);
     setIsRchidDialogOpen(false); // Close the dialog on successful submission
   };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Profile</h1>
      <Card>
        <CardHeader className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
           <Avatar className="h-20 w-20">
             <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person profile"/>
             <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
           </Avatar>
           <div className="text-center md:text-left">
             <CardTitle className="text-2xl">{user.name}</CardTitle>
             <p className="text-muted-foreground">{user.email}</p>
           </div>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
             <Label htmlFor="name">Name</Label>
             <Input id="name" defaultValue={user.name} disabled />
           </div>
           <div>
             <Label htmlFor="email">Email</Label>
             <Input id="email" type="email" defaultValue={user.email} disabled />
           </div>
           <div className="space-y-2">
              <h3 className="text-lg font-medium">Document Status</h3>
              <div className="flex items-center justify-between p-3 rounded-md border bg-muted/50">
                 <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">RCHID / Birth Certificate Status</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${iconColor}`}>{statusLabel}</span>
                     <Switch
                       id="rchid-status"
                       checked={user.birthCertificateVerified}
                       disabled
                       aria-label={`RCHID / Birth Certificate Status: ${statusLabel}`}
                     />
                 </div>
              </div>
               <p className="text-xs text-muted-foreground mt-1">
                 {user.birthCertificateVerified
                    ? "Your RCHID and Birth Certificate process is complete."
                    : "Apply for RCHID to obtain your Birth Certificate."}
               </p>
           </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-4">
           {!user.birthCertificateVerified && (
              <Dialog open={isRchidDialogOpen} onOpenChange={setIsRchidDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Apply for RCHID</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>RCHID Application (During Pregnancy)</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to apply for the Reproductive and Child Health ID (RCHID) during pregnancy. This helps in tracking health and obtaining the birth certificate later.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRchidSubmit}>
                    <div className="grid gap-4 py-4">
                       {/* --- Removed Child Fields --- */}
                       {/*
                       <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="childName" className="text-right">
                           Child's Name
                         </Label>
                         <Input id="childName" name="childName" value={rchidFormData.childName} onChange={handleInputChange} className="col-span-3" placeholder="(Leave blank if not named yet)" />
                       </div>
                       <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="dob" className="text-right">
                           Date of Birth
                         </Label>
                         <Input id="dob" name="dob" type="date" value={rchidFormData.dob} onChange={handleInputChange} className="col-span-3" required />
                       </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="placeOfBirth" className="text-right">
                           Place of Birth
                         </Label>
                         <Input id="placeOfBirth" name="placeOfBirth" value={rchidFormData.placeOfBirth} onChange={handleInputChange} className="col-span-3" placeholder="Hospital name or home address" required />
                       </div>
                       */}

                       {/* --- Existing and Added Fields --- */}
                       <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="motherName" className="text-right">
                           Mother's Name
                         </Label>
                         <Input id="motherName" name="motherName" value={rchidFormData.motherName} onChange={handleInputChange} className="col-span-3" required/>
                       </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="motherAadhaar" className="text-right">
                           Mother's Aadhaar
                         </Label>
                         <Input id="motherAadhaar" name="motherAadhaar" value={rchidFormData.motherAadhaar} onChange={handleInputChange} className="col-span-3" placeholder="12-digit number" required/>
                       </div>
                       <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="fatherName" className="text-right">
                           Father's Name
                         </Label>
                         <Input id="fatherName" name="fatherName" value={rchidFormData.fatherName} onChange={handleInputChange} className="col-span-3" required />
                       </div>
                       <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="fatherAadhaar" className="text-right">
                           Father's Aadhaar
                         </Label>
                         <Input id="fatherAadhaar" name="fatherAadhaar" value={rchidFormData.fatherAadhaar} onChange={handleInputChange} className="col-span-3" placeholder="12-digit number" />
                       </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="mobileNumber" className="text-right">
                           Mobile Number
                         </Label>
                         <Input id="mobileNumber" name="mobileNumber" type="tel" value={rchidFormData.mobileNumber} onChange={handleInputChange} className="col-span-3" required/>
                       </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="lmp" className="text-right">
                           LMP Date
                         </Label>
                         <Input id="lmp" name="lmp" type="date" value={rchidFormData.lmp} onChange={handleInputChange} className="col-span-3" title="Last Menstrual Period Date" required />
                       </div>
                       <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="address" className="text-right">
                           Permanent Address
                         </Label>
                         <Input id="address" name="address" value={rchidFormData.address} onChange={handleInputChange} className="col-span-3" required/>
                       </div>
                       {/* Optional Bank Details */}
                        <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="bankAccountNumber" className="text-right">
                           Bank Account <span className="text-xs text-muted-foreground">(Optional)</span>
                         </Label>
                         <Input id="bankAccountNumber" name="bankAccountNumber" value={rchidFormData.bankAccountNumber} onChange={handleInputChange} className="col-span-3" placeholder="For scheme benefits" />
                       </div>
                       <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="bankIfscCode" className="text-right">
                            Bank IFSC Code <span className="text-xs text-muted-foreground">(Optional)</span>
                         </Label>
                         <Input id="bankIfscCode" name="bankIfscCode" value={rchidFormData.bankIfscCode} onChange={handleInputChange} className="col-span-3" placeholder="IFSC Code"/>
                       </div>
                    </div>
                    <DialogFooter>
                      {/* Use explicit button to close instead of DialogClose for better control */}
                      <Button type="button" variant="outline" onClick={() => setIsRchidDialogOpen(false)}>Cancel</Button>
                       <Button type="submit" disabled={isSubmitting}>
                         {isSubmitting ? "Submitting..." : "Submit Application"}
                       </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
           )}
        </CardFooter>
      </Card>
    </div>
  );
}
