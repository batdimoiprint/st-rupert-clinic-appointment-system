// This file contains all the medical services and procedures offered by the clinic
// Used in the appointment form for service selection

// Define time slots for the clinic
export const timeSlots = [
  { id: 1, time: "8:00 AM - 9:00 AM", maxCapacity: 10 },
  { id: 2, time: "9:00 AM - 10:00 AM", maxCapacity: 10 },
  { id: 3, time: "10:00 AM - 11:00 AM", maxCapacity: 10 },
  { id: 4, time: "11:00 AM - 12:00 PM", maxCapacity: 10 },
  { id: 5, time: "1:00 PM - 2:00 PM", maxCapacity: 10 },
  { id: 6, time: "3:00 PM - 4:00 PM", maxCapacity: 10 },
  { id: 7, time: "4:00 PM - 5:00 PM", maxCapacity: 10 },
];

// Mock data for time slot availability (in a real app, this would come from a backend API)
// This simulates the number of appointments already booked for each time slot on specific dates
export const timeSlotAvailability = {
  // Format: "YYYY-MM-DD": { timeSlotId: bookedCount }
  "2025-05-03": {
    1: 10, // 8:00 AM - 9:00 AM: fully booked (10/10)
    2: 8,  // 9:00 AM - 10:00 AM: 8/10 booked
    3: 5,  // 10:00 AM - 11:00 AM: 5/10 booked
    4: 10, // 11:00 AM - 12:00 PM: fully booked (10/10)
    5: 3,  // 1:00 PM - 2:00 PM: 3/10 booked
    6: 7,  // 3:00 PM - 4:00 PM: 7/10 booked
    7: 2,  // 4:00 PM - 5:00 PM: 2/10 booked
  },
  "2025-05-04": {
    1: 6, // 8:00 AM - 9:00 AM: 6/10 booked
    2: 10, // 9:00 AM - 10:00 AM: fully booked (10/10)
    3: 10, // 10:00 AM - 11:00 AM: fully booked (10/10)
    4: 4, // 11:00 AM - 12:00 PM: 4/10 booked
    5: 10, // 1:00 PM - 2:00 PM: fully booked (10/10)
    6: 2, // 3:00 PM - 4:00 PM: 2/10 booked
    7: 10, // 4:00 PM - 5:00 PM: fully booked (10/10)
  },
  "2025-05-05": {
    1: 10, // All time slots fully booked for this date
    2: 10,
    3: 10,
    4: 10,
    5: 10,
    6: 10,
    7: 10,
  },
};

export const medicalServices = [
  {
    id: 1,
    title: "Bacteriology",
    procedures: [
      { id: 1, name: "AFB Stain-Sputum Exam", price: 390 },
      { id: 1, name: "Gram Staining", price: 250 },
      { id: 1, name: "Blood: Culture & Sensitivity", price: 950 },
      { id: 1, name: "Urine: Culture & Sensitivity", price: 250 },
      { id: 1, name: "KOH (Potassium Hydroxide)", price: 650 },
    ],
  },
  {
    id: 2,
    title: "Blood Chemistry",
    procedures: [
      { id: 2, name: "Fasting Blood Sugar (FBS)", price: 250 },
      { id: 2, name: "Random Blood Sugar (RBS)", price: 300 },
      { id: 2, name: "Blood Uric Acid (BUA)", price: 250 },
      { id: 2, name: "Blood Urea Nitrogen (BUN)", price: 250 },
      { id: 2, name: "Serum Creatinine", price: 250 },
      { id: 2, name: "Total Cholesterol", price: 300 },
      { id: 2, name: "Triglycerides", price: 250 },
    ],
  },
  {
    id: 3,
    title: "Consultation",
    procedures: [
      { id: 3, name: "Consultation", price: 400 },
      { id: 3, name: "Check-up with Medical Certificate", price: 500 },
    ],
  },
  {
    id: 4,
    title: "Electrolytes",
    procedures: [
      { id: 4, name: "Sodium", price: 350 },
      { id: 4, name: "Potassium", price: 350 },
      { id: 4, name: "Chloride", price: 350 },
      { id: 4, name: "Calcium", price: 350 },
      { id: 4, name: "Ionized Calcium", price: 350 },
      { id: 4, name: "Magnesium", price: 350 },
      { id: 4, name: "Phosphorus", price: 350 },
    ],
  },
  {
    id: 5,
    title: "Hematology",
    procedures: [
      { id: 5, name: "Complete Blood Count (CBC)", price: 250 },
      { id: 5, name: "Actual Platelet Count (APC)", price: 250 },
      { id: 5, name: "ABO Blood Typing (B/T)", price: 300 },
      { id: 5, name: "Erythrocyte Sedimentation Rate (ESR)", price: 250 },
      { id: 5, name: "Pt, Ptt", price: 490, each: true },
    ],
  },
  {
    id: 6,
    title: "Microscopy",
    procedures: [
      { id: 6, name: "Urinalysis (Urine)", price: 250 },
      { id: 6, name: "Fecalysis (Stool)", price: 250 },
      { id: 6, name: "Occult Blood", price: 450 },
      { id: 6, name: "Pregnancy Test (Urine)", price: 350 },
      { id: 6, name: "Pregnancy Test (Serum)", price: 500 },
    ],
  },
  {
    id: 7,
    title: "Serology",
    procedures: [
      { id: 7, name: "Hepa-B Screening (HBsAg)", price: 300 },
      { id: 7, name: "VDRI / RPR Screening", price: 300 },
      { id: 7, name: "ASO Screening", price: 500 },
      { id: 7, name: "Dengue NS1", price: 1950 },
      { id: 7, name: "Dengue NS1, IgG & IgM (Duo)", price: 3400 },
    ],
  },
  {
    id: 8,
    title: "Thyroid Function",
    procedures: [
      { id: 8, name: "T3 (Triiodothyronine)", price: 490 },
      { id: 8, name: "T4 (Thyroxine)", price: 490 },
      { id: 8, name: "FT3 (Free Triiodothyronine)", price: 550 },
      { id: 8, name: "FT4 (Free Thyroxine)", price: 550 },
      { id: 8, name: "TSH (Thyroid-Stimulating Hormone)", price: 650 },
    ],
  },
  {
    id: 9,
    title: "Ultrasound",
    procedures: [
      { id: 9, name: "Whole Abdomen Ultrasound", price: 1500 },
      { id: 9, name: "KUB Ultrasound", price: 1000 },
      { id: 9, name: "Transvaginal Ultrasound", price: 950 },
      { id: 9, name: "Pelvic/Abdominal Ultrasound", price: 500 },
      { id: 9, name: "Bio Physical Scoring (BPS)", price: 950 },
    ],
  },
  {
    id: 10,
    title: "X-ray",
    procedures: [
      { id: 10, name: "Chest X-ray", price: 450 },
      { id: 10, name: "Skull X-ray", price: 650 },
      { id: 10, name: "Lumbosacral X-ray", price: 850 },
      { id: 10, name: "Extremities X-ray", price: 750 },
      { id: 10, name: "With Lateral view", price: 550 },
    ],
  },
];