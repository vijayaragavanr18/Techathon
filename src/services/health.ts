/**
 * Represents a single historical data point for various metrics.
 */
export interface HistoricalDataPoint {
  /**
   * The month the data was recorded (e.g., "Jan", "Feb").
   */
  month: string;
  /**
   * Weight recorded for the month (in kg).
   */
  weight?: number;
  /**
   * Blood glucose level recorded for the month (e.g., mg/dL).
   */
  glucose?: number;
  /**
   * Systolic blood pressure reading for the month.
   */
  bpSystolic?: number;
  /**
   * Diastolic blood pressure reading for the month.
   */
  bpDiastolic?: number;
  /**
   * BMI calculated for the month.
   */
  bmi?: number;
   /**
   * Hemoglobin level for the month (g/dL).
   */
  hemoglobin?: number;
}


/**
 * Represents a health report with various metrics, including current, previous, and historical data.
 */
export interface HealthReport {
  /**
   * Current blood pressure reading (e.g., "120/80").
   */
  bloodPressure: string;
  /**
   * Current hemoglobin level (g/dL).
   */
  hemoglobin: number;
  /**
   * Current Body Mass Index.
   */
  bmi: number;
  /**
   * Current weight (kg).
   */
  weight: number;
  /**
   * Current blood glucose level (mg/dL).
   */
  glucose: number;
  /**
   * Latest heart rate reading (optional, e.g., from wearable).
   */
  heartRate?: number;
  /**
   * Health data from the previous month for comparison. Null if not available.
   */
  previousMonthReport: {
    bloodPressure: string;
    hemoglobin: number;
    bmi: number;
    weight: number;
    glucose: number;
  } | null;
   /**
   * Array of historical data points for trends over the last few months.
   */
  historicalData: HistoricalDataPoint[];
}


/**
 * Asynchronously retrieves the health report.
 * @returns A promise that resolves to a HealthReport object.
 */
export async function getHealthReport(): Promise<HealthReport> {
  // TODO: Implement this by calling an API.
  // Mock data for demonstration purposes.
  const currentMonth = {
    bloodPressure: '120/80',
    hemoglobin: 12.5,
    bmi: 22.5,
    weight: 65,
    glucose: 95,
    heartRate: 72,
  };

  const previousMonth = {
    bloodPressure: '118/78',
    hemoglobin: 12.8,
    bmi: 22.1,
    weight: 64,
    glucose: 92,
  };

  const history: HistoricalDataPoint[] = [
    { month: 'Mar', weight: 62, glucose: 88, bpSystolic: 115, bpDiastolic: 75, bmi: 21.5, hemoglobin: 13.0 },
    { month: 'Apr', weight: 63, glucose: 90, bpSystolic: 116, bpDiastolic: 76, bmi: 21.8, hemoglobin: 12.9 },
    { month: 'May', weight: 64, glucose: 92, bpSystolic: 118, bpDiastolic: 78, bmi: 22.1, hemoglobin: 12.8 },
    { month: 'Jun', weight: 65, glucose: 95, bpSystolic: 120, bpDiastolic: 80, bmi: 22.5, hemoglobin: 12.5 }, // Current month data point added to history for charts
  ];


  return {
    ...currentMonth,
    previousMonthReport: previousMonth,
    historicalData: history,
  };
}


/**
 * Represents appointment information.
 */
export interface Appointment {
  /**
   * Date of the appointment.
   */
  date: string;
  /**
   * Time of the appointment.
   */
  time: string;
  /**
   * Doctor's name.
   */
  doctorName: string;
  /**
   * Speciality of doctor
   */
  doctorSpeciality: string;
}

/**
 * Asynchronously retrieves the appointments.
 * @returns A promise that resolves to a list of Appointment objects.
 */
export async function getAppointments(): Promise<Appointment[]> {
  // Get current year and next year for dynamic future dates
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);


  // Function to format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // TODO: Implement this by calling an API.
  return [
    // Past Appointments
    {
      date: '2024-03-15',
      time: '10:00',
      doctorName: 'Dr. Smith',
      doctorSpeciality: 'Gynaecologist',
    },
    {
      date: '2024-03-22',
      time: '14:00',
      doctorName: 'Dr. Jones',
      doctorSpeciality: 'Pediatrician',
    },
     {
       date: '2024-05-20', // Past date
       time: '15:00',
       doctorName: 'Dr. Smith',
       doctorSpeciality: 'Gynaecologist',
      },
      {
       date: '2024-06-18', // Past date
       time: '13:15',
       doctorName: 'Dr. Jones',
       doctorSpeciality: 'Pediatrician',
      },
     {
      date: '2024-07-25', // Past date
      time: '11:00',
      doctorName: 'Dr. Lee',
      doctorSpeciality: 'Nutritionist',
     },

      // Upcoming Appointments (using dynamic future dates)
      {
        date: formatDate(tomorrow), // Example: Tomorrow
        time: '09:30',
        doctorName: 'Dr. Miller',
        doctorSpeciality: 'Gynaecologist',
      },
      {
        date: formatDate(nextWeek), // Example: Next Week
        time: '14:45',
        doctorName: 'Dr. Davis',
        doctorSpeciality: 'Sonographer',
      },
      {
         date: `${currentYear}-10-15`, // Example: October 15th of the current year
         time: '11:30',
         doctorName: 'Dr. Garcia',
         doctorSpeciality: 'Pediatrician',
       },
       {
         date: `${currentYear}-11-01`, // Example: November 1st of the current year
         time: '14:45',
         doctorName: 'Dr. Davis',
         doctorSpeciality: 'Sonographer',
       },
       {
         date: `${nextYear}-01-20`, // Example: January 20th of next year
         time: '09:00',
         doctorName: 'Dr. Garcia',
         doctorSpeciality: 'Pediatrician',
       },
      {
         date: `${nextYear}-03-05`, // Example: March 5th of next year
         time: '10:15',
         doctorName: 'Dr. Rodriguez',
         doctorSpeciality: 'Lactation Consultant',
       },
       {
       date: '2024-08-10', // Future date (kept for variety)
       time: '09:30',
       doctorName: 'Dr. Allen',
       doctorSpeciality: 'Cardiologist',
       },
  ];
}


/**
 * Represents a vaccination schedule.
 */
export interface VaccinationSchedule {
  /**
   * Name of the vaccine.
   */
  vaccine: string;
  /**
   * Due date for the vaccination.
   */
  dueDate: string;
  /**
   * Status of the vaccination (e.g., 'Completed', 'Due').
   */
  status: string;
}

/**
 * Asynchronously retrieves the vaccination schedule.
 * @returns A promise that resolves to a list of VaccinationSchedule objects.
 */
export async function getVaccinationSchedule(): Promise<VaccinationSchedule[]> {
  // TODO: Implement this by calling an API.
  return [
    {
      vaccine: 'BCG',
      dueDate: '2024-03-10',
      status: 'Completed',
    },
     {
      vaccine: 'Hepatitis B (Birth)',
      dueDate: '2024-03-10',
      status: 'Completed',
    },
    {
      vaccine: 'OPV (Birth)',
      dueDate: '2024-03-10',
      status: 'Completed',
    },
    {
      vaccine: 'OPV (6 Weeks)',
      dueDate: '2024-04-21',
      status: 'Due',
    },
    {
      vaccine: 'Pentavalent (6 Weeks)',
      dueDate: '2024-04-21',
      status: 'Due',
    },
     {
      vaccine: 'Rotavirus (6 Weeks)',
      dueDate: '2024-04-21',
      status: 'Due',
    },
     {
      vaccine: 'PCV (6 Weeks)',
      dueDate: '2024-04-21',
      status: 'Due',
    },
    {
      vaccine: 'IPV (6 Weeks)',
      dueDate: '2024-04-21',
      status: 'Scheduled', // Added another status example
    },
    {
      vaccine: 'OPV (10 Weeks)',
      dueDate: '2024-05-19',
      status: 'Scheduled',
    },
     {
      vaccine: 'Pentavalent (10 Weeks)',
      dueDate: '2024-05-19',
      status: 'Scheduled',
    },
     {
      vaccine: 'Rotavirus (10 Weeks)',
      dueDate: '2024-05-19',
      status: 'Scheduled',
    },
  ];
}

/**
 * Represents a center.
 */
export interface Center {
  /**
   * Name of the center.
   */
  name: string;
  /**
   * Address of the center.
   */
  address: string;
  /**
   * Phone number of the center.
   */
  phone: string;
}

/**
 * Asynchronously retrieves list of centers.
 * @returns A promise that resolves to a list of Center objects.
 */
export async function getCenters(): Promise<Center[]> {
  // TODO: Implement this by calling an API.
  return [
    {
      name: 'City Health Clinic',
      address: '123 Main St, Anytown',
      phone: '555-1234',
    },
    {
      name: 'Community Wellness Center',
      address: '456 Elm St, Anytown',
      phone: '555-5678',
    },
     {
      name: 'General Hospital Anytown',
      address: '789 Oak Ave, Anytown',
      phone: '555-9012',
    },
     {
      name: 'Pediatric Care Center',
      address: '101 Pine Ln, Anytown',
      phone: '555-3456',
    },
     {
      name: 'Anytown Medical Center',
      address: '202 Maple Dr, Anytown',
      phone: '555-7890',
    },
  ];
}

/**
 * Represents a medicine.
 */
export interface Medicine {
  /**
   * Name of the medicine.
   */
  name: string;
  /**
   * Dosage of the medicine.
   */
  dosage: string;
  /**
   * Frequency of the medicine.
   */
  frequency: string;
}

/**
 * Asynchronously retrieves list of medicines.
 * @returns A promise that resolves to a list of Medicine objects.
 */
export async function getMedicines(): Promise<Medicine[]> {
  // TODO: Implement this by calling an API.
  return [
    {
      name: 'Prenatal Vitamins',
      dosage: '1 tablet',
      frequency: 'Once Daily',
    },
    {
      name: 'Iron Supplement',
      dosage: '60 mg',
      frequency: 'Once Daily',
    },
    {
      name: 'Folic Acid',
      dosage: '800 mcg',
      frequency: 'Once Daily',
    },
     {
      name: 'Calcium + Vitamin D',
      dosage: '500mg / 400 IU',
      frequency: 'Twice Daily',
    },
  ];
}

/**
 * Represents a wellness product.
 */
export interface WellnessProduct {
  /**
   * Name of the product.
   */
  name: string;
  /**
   * Description of the product.
   */
  description: string;
  /**
   * Price of the product.
   */
  price: number;
}

/**
 * Asynchronously retrieves list of wellness products.
 * @returns A promise that resolves to a list of WellnessProduct objects.
 */
export async function getWellnessProducts(): Promise<WellnessProduct[]> {
  // TODO: Implement this by calling an API.
  return [
    {
      name: 'Maternity Support Belt',
      description: 'Provides belly and back support during pregnancy.',
      price: 35.50,
    },
    {
      name: 'Organic Nipple Cream',
      description: 'Soothes and protects sore nipples during breastfeeding.',
      price: 12.99,
    },
     {
      name: 'Stretch Mark Prevention Cream',
      description: 'Helps improve skin elasticity.',
      price: 28.00,
    },
     {
      name: 'Herbal Sitz Bath Soak',
      description: 'Aids postpartum recovery and healing.',
      price: 15.75,
    },
     {
      name: 'Infant Probiotic Drops',
      description: 'Supports baby\'s digestive health.',
      price: 22.50,
    },
  ];
}
