'use server';

/**
 * @fileOverview An AI agent that provides personalized health suggestions and reminders based on tracked health data.
 *
 * - getHealthSuggestion - A function that retrieves health suggestions.
 * - HealthSuggestionInput - The input type for the getHealthSuggestion function.
 * - HealthSuggestionOutput - The return type for the getHealthSuggestion function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getHealthReport, getAppointments, getVaccinationSchedule, getMedicines} from '@/services/health';

const HealthSuggestionInputSchema = z.object({
  age: z.number().describe('The age of the user in years.'),
  isMother: z.boolean().describe('Whether the user is a mother or not.'),
  isChild: z.boolean().describe('Whether the user is a child or not.'),
  concerns: z.string().optional().describe('Any specific health concerns or symptoms the user is currently experiencing.'),
  activityLevel: z.string().optional().describe("The user's general activity level (e.g., Sedentary, Lightly Active, Moderately Active, Very Active)."),
});
export type HealthSuggestionInput = z.infer<typeof HealthSuggestionInputSchema>;

const HealthSuggestionOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of personalized health suggestions and reminders.'),
});
export type HealthSuggestionOutput = z.infer<typeof HealthSuggestionOutputSchema>;

export async function getHealthSuggestion(input: HealthSuggestionInput): Promise<HealthSuggestionOutput> {
  return healthSuggestionFlow(input);
}

const healthSuggestionPrompt = ai.definePrompt({
  name: 'healthSuggestionPrompt',
  input: {
    schema: z.object({
      age: z.number().describe('The age of the user in years.'),
      isMother: z.boolean().describe('Whether the user is a mother or not.'),
      isChild: z.boolean().describe('Whether the user is a child or not.'),
      concerns: z.string().optional().describe('Any specific health concerns or symptoms the user is currently experiencing.'),
      activityLevel: z.string().optional().describe("The user's general activity level (e.g., Sedentary, Lightly Active, Moderately Active, Very Active)."),
      healthReport: z.object({
        bloodPressure: z.string(),
        hemoglobin: z.number(),
        bmi: z.number(),
        heartRate: z.number().optional(), // Added heartRate
      }).optional().describe('The user health report including blood pressure, hemoglobin level, BMI, and potentially heart rate.'),
      appointments: z.array(z.object({
        date: z.string(),
        time: z.string(),
        doctorName: z.string(),
        doctorSpeciality: z.string(),
      })).optional().describe('A list of upcoming appointments.'),
      vaccinationSchedule: z.array(z.object({
        vaccine: z.string(),
        dueDate: z.string(),
        status: z.string(),
      })).optional().describe('The user vaccination schedule.'),
      medicines: z.array(z.object({
        name: z.string(),
        dosage: z.string(),
        frequency: z.string(),
      })).optional().describe('The user medicine intake schedule'),
    }),
  },
  output: {
    schema: z.object({
      suggestions: z.array(z.string()).describe('A list of personalized health suggestions and reminders.'),
    }),
  },
  // Updated prompt to potentially include heart rate and new inputs
  prompt: `You are an AI health assistant that provides personalized health suggestions and reminders based on the user's data.

  User Profile:
  Age: {{age}} years old.
  Role: {{#if isMother}}Mother{{/if}}{{#if isChild}}Child{{/if}}
  {{#if activityLevel}}Activity Level: {{activityLevel}}{{/if}}
  {{#if concerns}}Current Concerns/Symptoms: {{concerns}}{{/if}}

  Health Data:
  {{#if healthReport}}Health Report:
  - Blood pressure: {{healthReport.bloodPressure}}
  - Hemoglobin: {{healthReport.hemoglobin}} g/dL
  - BMI: {{healthReport.bmi}}
  {{#if healthReport.heartRate}}- Heart Rate: {{healthReport.heartRate}} BPM{{/if}}{{else}}No health report data available.{{/if}}

  {{#if appointments}}Upcoming Appointments:
  {{#each appointments}}- {{date}} {{time}}: Dr. {{doctorName}} ({{doctorSpeciality}})
  {{/each}}{{else}}No upcoming appointments.{{/if}}

  {{#if vaccinationSchedule}}Vaccination Schedule:
  {{#each vaccinationSchedule}}- {{vaccine}} (Due: {{dueDate}}, Status: {{status}})
  {{/each}}{{else}}No vaccination schedule available.{{/if}}

  {{#if medicines}}Current Medications:
  {{#each medicines}}- {{name}} ({{dosage}}, {{frequency}})
  {{/each}}{{else}}No current medications listed.{{/if}}

  Based on ALL the provided information (profile, concerns, activity level, health data, appointments, vaccinations, medications), provide a list of specific, actionable health suggestions and reminders tailored to this user.

  Format your response as a JSON array of strings.
  `,
});


const healthSuggestionFlow = ai.defineFlow<
  typeof HealthSuggestionInputSchema,
  typeof HealthSuggestionOutputSchema
>({
  name: 'healthSuggestionFlow',
  inputSchema: HealthSuggestionInputSchema,
  outputSchema: HealthSuggestionOutputSchema,
}, async (input) => {
  // Fetch potentially relevant health data
  // In a real app, these might be fetched based on user ID
  const healthReport = await getHealthReport();
  const appointments = await getAppointments();
  const vaccinationSchedule = await getVaccinationSchedule();
  const medicines = await getMedicines();

  // Call the prompt with combined user input and fetched data
  const {output} = await healthSuggestionPrompt({
    ...input,
    healthReport,
    appointments,
    vaccinationSchedule,
    medicines,
  });

  // Ensure output is not null, though schema validation should handle this
  return output!;
});
