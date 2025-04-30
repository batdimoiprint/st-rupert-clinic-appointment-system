<template>
    <section class = "bg-muted font-Inter h-auto w-full">
        <div class = "flex flex-row items-center justify-between px-9 h-140"> <!-- Landing Page with reservation button. -->
            <div class = "flex flex-col items-start justify-center h-30 gap-5">
                <h2 class = "font-black text-4xl text-primary">Your <span class = "text-accent"><br>Best Patient-Friendly</span> Clinic</h2>
                <p class = "font-medium">Serving you 7 days a week from 7:30AM to 5:30PM</p>
                <Button variant = "default" class = "cursor-pointer">Request Appointment</Button>
            </div>
            <div class = "flex flex-col items-start justify-center">
                <img src = "@/assets/About/About-1.svg" class = "h-150 w-150 object-contain">
            </div>
        </div>
        <div class = "h-auto flex flex-col items-center"> <!-- Reservation Steps -->
            <h2 class = "bg-primary text-primary-foreground text-xl text-center font-bold w-full">How to book an appointment?</h2>
            <div class = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row-dense gap-5 items-center justify-center py-5">
                <Card
                    v-for = "(card, index) in stepCards"
                    :key = "index"
                    class = "w-60 h-70 border-border">
                    <CardHeader>
                        <CardTitle class = "text-accent-blue text-xl text-center font-bold">{{ card.title }}</CardTitle>
                    </CardHeader>
                    <CardContent class = "flex flex-col items-center justify-center gap-4">
                        <img :src = "card.image" class = "w-24 h-24 object-contain" />
                        <p class = "text-center text-sm text-accent-blue font-medium">
                            {{ card.description }}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
        <div section id = "our-services" class = "flex flex-col items-center h-auto scroll-mt-24"> <!-- Services -->
            <h2 class = "bg-primary text-primary-foreground text-xl text-center font-bold w-full">
                Our Services
            </h2>
            <div class = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-5 w-full max-w-7xl justify-items-center">
                <Card
                    v-for = "(service, index) in servicesCards"
                    :key = "index"
                    class = "w-60 h-auto border border-border flex flex-col">
                    <CardHeader>
                        <CardTitle class = "text-xl font-bold text-accent-blue text-center">
                        {{ service.title }}
                        </CardTitle>
                    </CardHeader>
                    <CardContent class = "flex flex-col items-center gap-4 flex-grow">
                        <img :src = "service.image" class = "w-30 h-30 object-contain" />
                        <ul class = "w-full flex flex-col gap-2">
                        <li
                            v-for = "(procedure, pIndex) in service.procedures"
                            :key = "pIndex"
                            class = "flex justify-between text-sm text-accent-blue font-medium"
                        >
                            <span>{{ procedure.name }}</span>
                            <span>₱{{ procedure.price.toFixed(2) }}</span>
                        </li>
                        </ul>
                    </CardContent>
                    <div class = "mt-auto w-full flex justify-center pt-4">
                        <Button variant="default" class = "cursor-pointer">
                        Request Appointment
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
        <div section id = "faqs" class = "flex flex-col items-center h-auto"> <!-- FAQs -->
            <h2 class = "bg-primary text-primary-foreground text-xl text-center font-bold w-full">
                Frequently Asked Questions
            </h2>
            <div class = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
                <Accordion
                    v-for = "(item, index) in accordionItems"
                    :key = "index"
                    type = "single"
                    collapsible
                    class = "w-full p-5">
                    <AccordionItem :value="'item-' + (index + 1)">
                        <AccordionTrigger class = "font-medium text-foreground">{{ item.title }}</AccordionTrigger>
                        <AccordionContent class = "font-regular text-foreground">{{ item.content }}</AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>  
    </section>
</template>

<script setup lang = "ts">
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import Step1 from '@/assets/About/Step-1.svg'
import Step2 from '@/assets/About/Step-2.svg'
import Step3 from '@/assets/About/Step-3.svg'
import Step4 from '@/assets/About/Step-4.svg'
import Bacteriology from '@/assets/ClinicServices/Bacteriology.svg'
import BloodTest from '@/assets/ClinicServices/BloodTest.svg'
import Consultation from '@/assets/ClinicServices/Consultation.svg'
import Electrolytes from '@/assets/ClinicServices/Electrolytes.svg'
import Hematology from '@/assets/ClinicServices/Hematology.svg'
import Microscopy from '@/assets/ClinicServices/Microscopy.svg'
import Serology from '@/assets/ClinicServices/Serology.svg'
import ThyroidFunction from '@/assets/ClinicServices/Thyroid Function.svg'
import Ultrasound from '@/assets/ClinicServices/Ultrasound.svg'
import Xray from '@/assets/ClinicServices/X-ray.svg'

// Reservation Data
const stepCards = [
    {
        title: 'STEP 1',
        image: Step1,
        description: 'Click on the “Request Appointment” button.'
    },
    {
        title: 'STEP 2',
        image: Step2,
        description: 'Fill out the appointment form.'
    },
    {
        title: 'STEP 3',
        image: Step3,
        description: 'Wait for the appointment on your provided email account.'
    },
    {
        title: 'STEP 4',
        image: Step4,
        description: 'Show the appointment email during your clinic visit along with a valid ID.'
    },
]

// Services Data
const servicesCards = [
    {
        title: 'Bacteriology',
        image: Bacteriology,
        procedures: [
            { name: 'AFB Stain-Sputum Exam', price: 390 },
            { name: 'Gram Staining', price: 950 },
            { name: 'Blood: Culture & Sensitivity', price: 950 },
            { name: 'Urine: Culture & Sensitivity', price: 950 },
            { name: 'KOH (Potassium Hydroxide)', price: 650 },
        ]
    },
    {
        title: 'Blood Test',
        image: BloodTest,
        procedures: [
            { name: 'Fasting Blood Sugar (FBS)', price: 250},
            { name: 'Random Blood Sugar (RBS)', price: 300},
            { name: 'Blood Uric Acid (BUA)', price: 250},
            { name: 'Blood Urea Nitrogen (BUN)', price: 250},
            { name: 'Random Blood Sugar (RBS)', price: 300},
            { name: 'Serum Creatinine', price: 250},
            { name: 'Total Cholesterol', price: 300},
            { name: 'Triglycerides', price: 250},
        ]
    },
    {
        title: 'Consultation',
        image: Consultation,
        procedures: [
            { name: 'Consultation', price: 400},
            { name: 'Check-up with Medical Certificate', price: 500},
        ]
    },
    {
        title: 'Electrolytes', 
        image: Electrolytes,
        procedures: [
            { name: 'Sodium', price: 350},
            { name: 'Potassium', price: 350},
            { name: 'Chloride', price: 350},
            { name: 'Calcium', price: 350},
            { name: 'Ionized Calcium', price: 350},
            { name: 'Magnesium', price: 350},
            { name: 'Phosphorus', price: 350},

        ]
    },
    {
        title: 'Hematology',
        image: Hematology,
        procedures: [
            { name: 'Complete Blood Count (CBC)', price: 250},
            { name: 'Actual Blood Count (ABC)', price: 250},
            { name: 'ABO Blood Typing (B/T)', price: 300},
            { name: 'Erythrocyte Sedimentation Rate (ESR)', price: 500},
            { name: 'Pt, Ptt', price: 490.00},
        ]
    },
    {
        title: 'Microscopy',
        image: Microscopy,
        procedures: [
            { name: 'Urinalysis (Urine)', price: 250},
            { name: 'Fecalysis (Stool)', price: 250},
            { name: 'Occult Blood', price: 450},
            { name: 'Pregnancy Test (Urine)', price: 350},
            { name: 'Pregnancy Test (Serum)', price: 500},
        ]
    },
    {
        title: 'Serology',
        image: Serology,
        procedures: [
            { name: 'Hepa-B Screening (HBsAg)', price: 300},
            { name: 'VDRI / RPR Screening', price: 300},
            { name: 'ASO Screening', price: 500},
            { name: 'Dengue NS1', price: 1950.00},
            { name: 'Dengue NS1, IgG & IgM (Duo)', price: 3400.00},
        ]
    },
    {
        title: 'Thyroid Function',
        image: ThyroidFunction,
        procedures: [
            { name: 'T3 (Triiodothyronine)', price: 490},
            { name: 'T4 (Thyroxine)', price: 490},
            { name: 'FT3 (Free Triiodothyronine)', price: 550},
            { name: 'FT4 (Free Thyroxine)', price: 550},
            { name: 'TSH (Thyroid-Stimulating Hormone)', price: 650},
        ]
    },
    {
        title: 'Ultrasound',
        image: Ultrasound,
        procedures: [
            { name: 'Whole Abdomen Ultrasound', price: 1500},
            { name: 'KUB Ultrasound', price: 1000},
            { name: 'Transvaginal Ultrasound', price: 950},
            { name: 'Pelvic/Abdominal Ultrasound', price: 500},
            { name: 'Bio Physical Scoring (BPS)', price: 950},
        ]
    },
    {
        title: 'X-ray',
        image: Xray,
        procedures: [
            { name: 'Chest X-ray', price: 450},
            { name: 'Skull X-ray', price: 650},
            { name: 'Lumbosacral X-ray ', price: 850},
            { name: 'Extremities X-ray ', price: 750},
            { name: 'With Lateral view', price: 550},
        ]
    },
]

const accordionItems = [
    {
        title: "Is my information private?",
        content: "Yes, the information is private and protected. The clinic takes patient confidentiality seriously, ensuring that all personal and medical data is secured according to industry standards."
    },
    {
        title: "How can I get a copy of my medical records?",
        content: "Contact the clinic’s front desk or records office."
    },
    {
        title: "What should I bring to my appointment?",
        content: "Bring any of the following: ID, insurance card, and medical history."
    },
    {
        title: "How long will my appointment take?",
        content: "Appointments usually take 20–60 minutes."
    },
    {
        title: "What if I have follow-up questions after my appointment?",
        content: "You may contact the clinic for any queries."
    },
    {
        title: "What are your clinic hours?",
        content: "Everyday 7:30AM to 5:30PM"
    },
    {
        title: "Can I bring a family member or friend with me?",
        content: "Yes, you can bring someone for support."
    },
    {
        title: "Is this clinic registered?",
        content: "Yes, St. Rupert's Medical Clinic is a certified clinic which aims to bring the best service."
    },
    {
        title: "Do I need an appointment, or do you accept walk-ins?",
        content: "Appointments are preferred, but walk-ins are accepted based on availability."
    }
]
</script>