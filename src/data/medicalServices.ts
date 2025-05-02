// This file contains all the medical services and procedures offered by the clinic
// Used in the appointment form for service selection

export const medicalServices = [
  {
    title: "Bacteriology",
    procedures: [
      { id: 1, name: "AFB Stain-Sputum Exam", price: 390 },
      { id: 2, name: "Gram Staining", price: 950 },
      { id: 3, name: "Blood: Culture & Sensitivity", price: 950 },
      { id: 4, name: "Urine: Culture & Sensitivity", price: 950 },
      { id: 5, name: "KOH (Potassium Hydroxide)", price: 650 },
    ],
  },
  {
    title: "Blood Chemistry",
    procedures: [
      { id: 6, name: "Fasting Blood Sugar (FBS)", price: 250 },
      { id: 7, name: "Random Blood Sugar (RBS)", price: 300 },
      { id: 8, name: "Blood Uric Acid (BUA)", price: 250 },
      { id: 9, name: "Blood Urea Nitrogen (BUN)", price: 250 },
      { id: 10, name: "Serum Creatinine", price: 250 },
      { id: 11, name: "Total Cholesterol", price: 300 },
      { id: 12, name: "Triglycerides", price: 250 },
    ],
  },
  {
    title: "Consultation",
    procedures: [
      { id: 13, name: "Consultation", price: 400 },
      { id: 14, name: "Check-up with Medical Certificate", price: 500 },
    ],
  },
  {
    title: "Electrolytes",
    procedures: [
      { id: 15, name: "Sodium", price: 350 },
      { id: 16, name: "Potassium", price: 350 },
      { id: 17, name: "Chloride", price: 350 },
      { id: 18, name: "Calcium", price: 350 },
      { id: 19, name: "Ionized Calcium", price: 350 },
      { id: 20, name: "Magnesium", price: 350 },
      { id: 21, name: "Phosphorus", price: 350 },
    ],
  },
  {
    title: "Hematology",
    procedures: [
      { id: 22, name: "Complete Blood Count (CBC)", price: 250 },
      { id: 23, name: "Actual Blood Count (ABC)", price: 250 },
      { id: 24, name: "ABO Blood Typing (B/T)", price: 300 },
      { id: 25, name: "Erythrocyte Sedimentation Rate (ESR)", price: 500 },
      { id: 26, name: "Pt, Ptt", price: 490.0 },
    ],
  },
  {
    title: "Microscopy",
    procedures: [
      { id: 27, name: "Urinalysis (Urine)", price: 250 },
      { id: 28, name: "Fecalysis (Stool)", price: 250 },
      { id: 29, name: "Occult Blood", price: 450 },
      { id: 30, name: "Pregnancy Test (Urine)", price: 350 },
      { id: 31, name: "Pregnancy Test (Serum)", price: 500 },
    ],
  },
  {
    title: "Serology",
    procedures: [
      { id: 32, name: "Hepa-B Screening (HBsAg)", price: 300 },
      { id: 33, name: "VDRI / RPR Screening", price: 300 },
      { id: 34, name: "ASO Screening", price: 500 },
      { id: 35, name: "Dengue NS1", price: 1950.0 },
      { id: 36, name: "Dengue NS1, IgG & IgM (Duo)", price: 3400.0 },
    ],
  },
  {
    title: "Thyroid Function",
    procedures: [
      { id: 37, name: "T3 (Triiodothyronine)", price: 490 },
      { id: 38, name: "T4 (Thyroxine)", price: 490 },
      { id: 39, name: "FT3 (Free Triiodothyronine)", price: 550 },
      { id: 40, name: "FT4 (Free Thyroxine)", price: 550 },
      { id: 41, name: "TSH (Thyroid-Stimulating Hormone)", price: 650 },
    ],
  },
  {
    title: "Ultrasound",
    procedures: [
      { id: 42, name: "Whole Abdomen Ultrasound", price: 1500 },
      { id: 43, name: "KUB Ultrasound", price: 1000 },
      { id: 44, name: "Transvaginal Ultrasound", price: 950 },
      { id: 45, name: "Pelvic/Abdominal Ultrasound", price: 500 },
      { id: 46, name: "Bio Physical Scoring (BPS)", price: 950 },
    ],
  },
  {
    title: "X-ray",
    procedures: [
      { id: 47, name: "Chest X-ray", price: 450 },
      { id: 48, name: "Skull X-ray", price: 650 },
      { id: 49, name: "Lumbosacral X-ray", price: 850 },
      { id: 50, name: "Extremities X-ray", price: 750 },
      { id: 51, name: "With Lateral view", price: 550 },
    ],
  },
];