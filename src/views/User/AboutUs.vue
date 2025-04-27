<template>
    <div class = "bg-background text-Inter h-auto w-full">
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
        <div class = "bg-background text-Inter h-90 flex flex-col items-center gap-5"> <!-- Reservation Steps -->
            <h2 class = "bg-primary text-primary-foreground text-xl text-center font-bold w-full">How to book an appointment?</h2>
            <div class = "grid grid-cols-4 gap-5 items-center justify-center">
                <Card
                    v-for = "(card, index) in cards"
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
        <div class = ""> <!-- Services -->
            <h2 class = "bg-primary text-primary-foreground text-xl text-center font-bold w-full">Our Services</h2>
        </div>
    </div>
</template>

<script setup lang = "ts">
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Step1 from '@/assets/About/Step-1.svg'
import Step2 from '@/assets/About/Step-2.svg'
import Step3 from '@/assets/About/Step-3.svg'
import Step4 from '@/assets/About/Step-4.svg'

// Card data
const cards = [
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
</script>