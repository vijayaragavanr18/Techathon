'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCenters, Center } from '@/services/health';
import { Loader2, MapPin, Phone, Navigation } from 'lucide-react';

// Basic Map Placeholder Component
const MapPlaceholder = () => (
  <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground border">
    Map Placeholder - Integration with a map library (e.g., @vis.gl/react-google-maps) needed here.
  </div>
);


export default function ChildCentersPage() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCenters = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Ideally, fetch centers based on user's location
        const data = await getCenters();
        setCenters(data);
      } catch (err) {
        console.error("Failed to fetch centers:", err);
        setError("Could not load nearby centers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCenters();
  }, []);

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
         <MapPin className="w-6 h-6" /> Nearby Health Centers
       </h1>
       <p className="text-muted-foreground">Find vaccination centers, clinics, and hospitals near you.</p>

       {/* Map View Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Map View</CardTitle>
          </CardHeader>
          <CardContent>
            <MapPlaceholder />
          </CardContent>
        </Card>

       {/* List View */}
       <Card>
         <CardHeader>
            <CardTitle>Center List</CardTitle>
         </CardHeader>
         <CardContent>
           {error && <p className="text-destructive text-center py-4">{error}</p>}
           {isLoading ? (
              <div className="flex justify-center items-center p-4">
                 <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
           ) : centers.length > 0 ? (
              <div className="space-y-4">
                 {centers.map((center, index) => (
                    <Card key={index} className="p-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                       <div>
                          <h3 className="font-semibold text-lg">{center.name}</h3>
                          <p className="text-sm text-muted-foreground">{center.address}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <Phone className="h-3 w-3 text-muted-foreground" />
                             <span className="text-sm text-muted-foreground">{center.phone}</span>
                          </div>
                       </div>
                       <div className="flex gap-2 flex-shrink-0">
                          <Button variant="outline" size="sm">
                             <Navigation className="mr-1 h-4 w-4" /> Directions
                          </Button>
                          <a href={`tel:${center.phone}`}>
                             <Button variant="outline" size="sm">
                                <Phone className="mr-1 h-4 w-4" /> Call
                             </Button>
                          </a>
                       </div>
                    </Card>
                 ))}
              </div>
           ) : (
              !error && <p className="text-muted-foreground text-center py-4">No centers found.</p>
           )}
         </CardContent>
       </Card>

    </div>
  );
}
