'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getHealthReport, HealthReport, HistoricalDataPoint } from '@/services/health';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { Loader2, TrendingUp, Droplet, Weight, Activity, ArrowDown, ArrowUp, ArrowRight } from 'lucide-react'; // Removed BPIcon alias
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define chart configurations matching the theme
const chartConfig: ChartConfig = {
  current: { label: 'Current Month', color: 'hsl(var(--chart-1))' }, // Light Blue
  previous: { label: 'Previous Month', color: 'hsl(var(--chart-3))' }, // Mid Blue
  bmi: { label: 'BMI', color: 'hsl(var(--chart-2))' }, // White
  hemoglobin: { label: 'Hemoglobin (g/dL)', color: 'hsl(var(--chart-3))' }, // Mid Blue
  weight: { label: 'Weight (kg)', color: 'hsl(var(--chart-4))' }, // Desaturated Light Blue
  glucose: { label: 'Glucose (mg/dL)', color: 'hsl(var(--chart-5))' }, // Lighter Grayish White
  bpSystolic: { label: 'Systolic BP', color: 'hsl(var(--chart-1))' }, // Light Blue
  bpDiastolic: { label: 'Diastolic BP', color: 'hsl(var(--chart-3))' }, // Mid Blue
};

// Helper to determine trend icon and description
const getTrendInfo = (current: number | undefined, previous: number | undefined | null) => {
  if (current === undefined || previous === undefined || previous === null || current === previous || isNaN(current) || isNaN(previous)) {
    return { Icon: ArrowRight, description: 'Stable', color: 'text-muted-foreground' };
  } else if (current > previous) {
    const diff = Math.abs(current - previous).toFixed(1);
    return { Icon: ArrowUp, description: `Increased by ${diff}`, color: 'text-orange-500' }; // Increased BP/Glucose might be concerning
  } else {
    const diff = Math.abs(current - previous).toFixed(1);
    return { Icon: ArrowDown, description: `Decreased by ${diff}`, color: 'text-green-500' }; // Decrease might be positive
  }
};

// Specific trend for weight (increase is often expected)
const getWeightTrendInfo = (current: number | undefined, previous: number | undefined | null) => {
  if (current === undefined || previous === undefined || previous === null || current === previous || isNaN(current) || isNaN(previous)) {
    return { Icon: ArrowRight, description: 'Stable', color: 'text-muted-foreground' };
  } else if (current > previous) {
    const diff = Math.abs(current - previous).toFixed(1);
    return { Icon: ArrowUp, description: `Increased by ${diff} kg`, color: 'text-green-500' }; // Expected gain
  } else {
    const diff = Math.abs(current - previous).toFixed(1);
    return { Icon: ArrowDown, description: `Decreased by ${diff} kg`, color: 'text-orange-500' }; // Unexpected decrease
  }
};


export default function MotherReportsPage() {
  const [report, setReport] = useState<HealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getHealthReport();
        setReport(data);
      } catch (err) {
        console.error("Failed to fetch health report:", err);
        setError("Could not load health report. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, []);


  // Prepare data for comparative charts
   const bmiComparisonData = report ? [
     { name: 'Previous Month', value: report.previousMonthReport?.bmi ?? 0, fill: chartConfig.previous.color },
     { name: 'Current Month', value: report.bmi ?? 0, fill: chartConfig.current.color },
   ].filter(d => d.value > 0) : []; // Filter out months with 0 value


   const hemoglobinComparisonData = report ? [
     { name: 'Previous Month', value: report.previousMonthReport?.hemoglobin ?? 0, fill: chartConfig.previous.color },
     { name: 'Current Month', value: report.hemoglobin ?? 0, fill: chartConfig.current.color },
   ].filter(d => d.value > 0) : [];


   // Prepare data for trend charts
   const weightTrendData = report?.historicalData.map(d => ({ month: d.month, weight: d.weight ?? null })) ?? [];
   const glucoseTrendData = report?.historicalData.map(d => ({ month: d.month, glucose: d.glucose ?? null })) ?? [];
   const bpTrendData = report?.historicalData.map(d => ({
     month: d.month,
     systolic: d.bpSystolic ?? null,
     diastolic: d.bpDiastolic ?? null,
   })) ?? [];


   const weightTrendInfo = getWeightTrendInfo(report?.weight, report?.previousMonthReport?.weight);
   const glucoseTrendInfo = getTrendInfo(report?.glucose, report?.previousMonthReport?.glucose);
   // BP trend needs more complex logic, comparing current string to previous string or using historical numeric data
   // Simple placeholder for now, using latest systolic for example trend calculation
   const latestSystolic = report?.historicalData[report.historicalData.length - 1]?.bpSystolic;
   const previousSystolic = report?.historicalData[report.historicalData.length - 2]?.bpSystolic;
   const bpTrendInfo = getTrendInfo(latestSystolic, previousSystolic);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Health Report Details</h1>
      <p className="text-muted-foreground">View your key health metrics, trends, and comparisons.</p>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error Loading Report</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
         <div className="flex justify-center items-center py-10">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      ) : report ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {/* Current Vitals Overview Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" /> {/* Using Activity icon */}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.bloodPressure || 'N/A'}</div>
               <p className="text-xs text-muted-foreground">Latest reading</p>
               <div className="flex items-center text-xs mt-1">
                 <bpTrendInfo.Icon className={`h-3 w-3 mr-1 ${bpTrendInfo.color}`} />
                 <span className={bpTrendInfo.color}>{bpTrendInfo.description} (Systolic vs previous month)</span>
               </div>
            </CardContent>
          </Card>
          <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Weight</CardTitle>
               <Weight className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{report.weight ? `${report.weight.toFixed(1)} kg` : 'N/A'}</div>
               <p className="text-xs text-muted-foreground">Current weight</p>
               <div className="flex items-center text-xs mt-1">
                  <weightTrendInfo.Icon className={`h-3 w-3 mr-1 ${weightTrendInfo.color}`} />
                  <span className={weightTrendInfo.color}>{weightTrendInfo.description} vs last month</span>
               </div>
             </CardContent>
           </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Glucose (mg/dL)</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{report.glucose ? report.glucose.toFixed(0) : 'N/A'}</div>
               <p className="text-xs text-muted-foreground">Latest reading</p>
               <div className="flex items-center text-xs mt-1">
                 <glucoseTrendInfo.Icon className={`h-3 w-3 mr-1 ${glucoseTrendInfo.color}`} />
                 <span className={glucoseTrendInfo.color}>{glucoseTrendInfo.description} vs last month</span>
               </div>
            </CardContent>
          </Card>
          {/* Placeholder card to maintain grid layout if needed */}
           <Card className="opacity-0 pointer-events-none hidden lg:block">
             <CardHeader><CardTitle></CardTitle></CardHeader>
             <CardContent></CardContent>
           </Card>


           {/* Weight Gain Pattern Analysis */}
           <Card className="md:col-span-2">
             <CardHeader>
               <CardTitle className="flex items-center gap-2"><Weight className="h-5 w-5 text-muted-foreground" />Weight Gain Pattern</CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This chart shows your weight changes over the past few months. During pregnancy, some weight gain is expected. Your trend shows you have {weightTrendInfo.description.toLowerCase()} compared to last month. Talk to your doctor about the ideal weight gain for your pregnancy.
                </p>
                {weightTrendData.length > 1 ? (
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                     <LineChart data={weightTrendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                       <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                       <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                       <YAxis width={30} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} fontSize={12}/>
                       <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="line" />} />
                       <Line dataKey="weight" type="monotone" stroke={chartConfig.weight.color} strokeWidth={2} dot={{ r: 4, fill: chartConfig.weight.color }} name="Weight (kg)" connectNulls />
                     </LineChart>
                   </ChartContainer>
                ) : (
                   <p className="text-sm text-muted-foreground italic">Not enough data to show weight trend.</p>
                )}
             </CardContent>
           </Card>


           {/* Glucose and Blood Pressure Trends */}
           <Card className="md:col-span-2">
             <CardHeader>
               <CardTitle>Glucose & Blood Pressure Trends</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                <div>
                   <h3 className="text-md font-semibold mb-2">Blood Glucose Trend</h3>
                   <p className="text-sm text-muted-foreground mb-4">This chart tracks your blood sugar levels. Keeping these levels stable is important during pregnancy. Your latest reading is {report.glucose ? report.glucose.toFixed(0) : 'N/A'} mg/dL ({glucoseTrendInfo.description.toLowerCase()} vs last month).</p>
                   {glucoseTrendData.length > 1 ? (
                      <ChartContainer config={chartConfig} className="h-[150px] w-full">
                        <LineChart data={glucoseTrendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                          <YAxis width={30} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} fontSize={12}/>
                          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="line" />} />
                          <Line dataKey="glucose" type="monotone" stroke={chartConfig.glucose.color} strokeWidth={2} dot={{ r: 4, fill: chartConfig.glucose.color }} name="Glucose (mg/dL)" connectNulls />
                        </LineChart>
                      </ChartContainer>
                   ) : (
                      <p className="text-sm text-muted-foreground italic">Not enough data to show glucose trend.</p>
                   )}
                </div>
                <div>
                   <h3 className="text-md font-semibold mb-2">Blood Pressure Trend</h3>
                   <p className="text-sm text-muted-foreground mb-4">This chart shows your blood pressure readings over time (Systolic is the top number, Diastolic is the bottom). Your doctor watches this to ensure it stays in a healthy range.</p>
                    {bpTrendData.length > 1 ? (
                      <ChartContainer config={chartConfig} className="h-[150px] w-full">
                         <LineChart data={bpTrendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                           <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                           <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12}/>
                            <YAxis width={30} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} fontSize={12}/>
                           <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                           <Line dataKey="systolic" type="monotone" stroke={chartConfig.bpSystolic.color} strokeWidth={2} dot={{ r: 4, fill: chartConfig.bpSystolic.color }} name="Systolic" connectNulls />
                           <Line dataKey="diastolic" type="monotone" stroke={chartConfig.bpDiastolic.color} strokeWidth={2} dot={{ r: 4, fill: chartConfig.bpDiastolic.color }} name="Diastolic" connectNulls />
                         </LineChart>
                       </ChartContainer>
                    ) : (
                       <p className="text-sm text-muted-foreground italic">Not enough data to show blood pressure trend.</p>
                    )}
                </div>
             </CardContent>
           </Card>


           {/* Comparative Bar Charts */}
           <Card>
             <CardHeader>
               <CardTitle>BMI Comparison</CardTitle>
               <p className="text-xs text-muted-foreground">Current vs. Previous Month</p>
             </CardHeader>
             <CardContent className="h-[100px]"> {/* Reduced height */}
                {bmiComparisonData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={bmiComparisonData} layout="vertical" margin={{ left: 0, right: 10, top: 10, bottom: 10 }}>
                         <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)"/>
                         <XAxis type="number" hide />
                          <YAxis
                            type="category"
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            width={80} // Adjust width for labels
                            fontSize={12}
                           />
                         <ChartTooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent hideLabel indicator="line" />} />
                         <Bar dataKey="value" radius={4} barSize={25}> {/* Adjusted bar size */}
                           {bmiComparisonData.map((entry, index) => (
                              <Cell key={`cell-bmi-${index}`} fill={entry.fill} />
                           ))}
                         </Bar>
                       </BarChart>
                     </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <p className="text-sm text-muted-foreground italic text-center pt-6">No comparison data available.</p>
                )}
             </CardContent>
             <CardContent className="text-sm text-muted-foreground pt-2">
                 Your current BMI is <strong>{report.bmi ? report.bmi.toFixed(1) : 'N/A'}</strong>.
                 {report.previousMonthReport?.bmi && ` Last month it was ${report.previousMonthReport.bmi.toFixed(1)}.`}
                 A healthy BMI before pregnancy is usually 18.5-24.9.
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle>Hemoglobin Comparison</CardTitle>
               <p className="text-xs text-muted-foreground">Current vs. Previous Month (g/dL)</p>
             </CardHeader>
             <CardContent className="h-[100px]"> {/* Reduced height */}
                {hemoglobinComparisonData.length > 0 ? (
                   <ChartContainer config={chartConfig} className="h-full w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={hemoglobinComparisonData} layout="vertical" margin={{ left: 0, right: 10, top: 10, bottom: 10 }}>
                         <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)"/>
                         <XAxis type="number" domain={[0, 'dataMax + 2']} hide />
                         <YAxis
                            type="category"
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            width={80} // Adjust width for labels
                            fontSize={12}
                           />
                         <ChartTooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent hideLabel indicator="line" />} />
                         <Bar dataKey="value" radius={4} barSize={25}> {/* Adjusted bar size */}
                            {hemoglobinComparisonData.map((entry, index) => (
                              <Cell key={`cell-hb-${index}`} fill={entry.fill} />
                           ))}
                         </Bar>
                       </BarChart>
                     </ResponsiveContainer>
                   </ChartContainer>
                 ) : (
                   <p className="text-sm text-muted-foreground italic text-center pt-6">No comparison data available.</p>
                 )}
             </CardContent>
             <CardContent className="text-sm text-muted-foreground pt-2">
                  Your current hemoglobin is <strong>{report.hemoglobin ? report.hemoglobin.toFixed(1) : 'N/A'} g/dL</strong>.
                  {report.previousMonthReport?.hemoglobin && ` Last month it was ${report.previousMonthReport.hemoglobin.toFixed(1)} g/dL.`}
                  Normal levels during pregnancy are often 11-14 g/dL.
             </CardContent>
           </Card>


        </div>
      ) : (
         !error && <p className="text-muted-foreground text-center py-10">No health report data available.</p>
      )}
    </div>
  );
}
