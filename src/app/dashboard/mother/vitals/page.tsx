'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getHealthReport, HealthReport } from '@/services/health'; // Assuming this holds latest vitals including heart rate
import { Loader2, Activity, HeartPulse } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"


// Placeholder for chart data - replace with actual fetched historical heart rate data
// Simulate a more ECG-like pattern with sharper peaks and troughs
const generateHeartRateData = () => {
    return Array.from({ length: 40 }, (_, i) => { // Increased points for better visual
        let baseRate = 75;
        let variation = Math.sin(i * 0.8) * 3; // Basic oscillation
        let spike = 0;

        // Add random sharp spikes simulating QRS complex, occasionally
        if (i % 6 === 0 && Math.random() > 0.5) { // Trigger spike less frequently
            spike = Math.random() > 0.4 ? 15 + Math.random() * 15 : -(10 + Math.random() * 8); // Sharper spikes
        } else if (i % 6 === 1 && spike !== 0) {
            // Quick return after spike, maybe overshoot slightly
            spike = -spike * 0.7 + (Math.random() - 0.5) * 5;
        } else if (i % 6 === 2 && spike !== 0) {
            // Settle back towards baseline
             spike = (Math.random() - 0.5) * 3;
        }
        else {
            // Add smaller random noise otherwise
            variation += (Math.random() - 0.5) * 4;
        }


        return {
            time: i, // Represents time points
            heartRate: Math.max(50, Math.min(130, baseRate + variation + spike)), // Keep within reasonable bounds
        };
    });
};


const chartConfig = {
  heartRate: {
    label: "Heart Rate (BPM)",
    color: "hsl(var(--chart-1))", // Use theme color
  },
} satisfies ChartConfig

export default function MotherVitalsPage() {
  const [latestVitals, setLatestVitals] = useState<Partial<HealthReport>>({});
  const [heartRateHistoryData, setHeartRateHistoryData] = useState(generateHeartRateData());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchLatestVitals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getHealthReport();
        setLatestVitals({
           heartRate: data.heartRate,
           bloodPressure: data.bloodPressure
        });
      } catch (err) {
        console.error("Failed to fetch latest vitals:", err);
        setError("Could not load latest vitals from wearable. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestVitals();

    // Optional: Set up an interval to update the chart data for a "live" effect
    // const intervalId = setInterval(() => {
    //    setHeartRateHistoryData(generateHeartRateData());
    // }, 2000); // Update every 2 seconds

    // return () => clearInterval(intervalId); // Cleanup interval on unmount

  }, []);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
         <Activity className="w-6 h-6" /> Wearable Device Vitals
      </h1>
      <p className="text-muted-foreground">View real-time and historical data from your connected SOS wearable device.</p>

      {error && <p className="text-destructive">{error}</p>}

      {/* Cards for Latest Vitals from Wearable */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
       ) : (
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Latest Heart Rate (BPM)</CardTitle>
                 <HeartPulse className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">{latestVitals.heartRate ? latestVitals.heartRate.toFixed(0) : 'N/A'}</div>
                 <p className="text-xs text-muted-foreground">From wearable device</p>
               </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Latest Blood Pressure</CardTitle>
                  <HeartPulse className="h-4 w-4 text-muted-foreground" /> {/* Reusing icon */}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{latestVitals.bloodPressure || 'N/A'}</div>
                   <p className="text-xs text-muted-foreground">From health report</p>
                </CardContent>
             </Card>
         </div>
       )}


      {/* Vitals History Charts */}
       <Card>
         <CardHeader>
           <CardTitle>Heart Rate Monitor</CardTitle>
         </CardHeader>
         <CardContent>
            <p className="text-muted-foreground mb-4">Simulation of heart rate data from your wearable device.</p>
            {/* Animated Heart Rate Chart */}
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart
                   data={heartRateHistoryData}
                   margin={{ top: 5, right: 20, left: -10, bottom: 5 }} // Adjust margins
                  >
                   <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                   <XAxis dataKey="time" hide /> {/* Hide X axis labels for a cleaner look */}
                   <YAxis
                      domain={['dataMin - 10', 'dataMax + 10']} // Adjust domain for spikes
                      hide // Hide Y axis labels
                    />
                    <ChartTooltip
                        cursor={{stroke: 'hsl(var(--accent))', strokeWidth: 1}} // Use accent color for cursor
                        content={<ChartTooltipContent indicator="line" hideLabel />}
                     />
                   <Line
                     // type="monotone" // Monotone makes it smooth, linear makes it sharp
                     type="linear" // Use linear for sharper points, closer to ECG
                     dataKey="heartRate"
                     stroke={chartConfig.heartRate.color}
                     strokeWidth={2} // Slightly thicker line
                     dot={false} // Hide dots for a continuous line look
                     isAnimationActive={true} // Ensure animation is active
                     animationDuration={300} // Adjust animation speed if needed
                     name="Heart Rate"
                   />
                 </LineChart>
               </ResponsiveContainer>
            </ChartContainer>
         </CardContent>
       </Card>
    </div>
  );
}

