<template>
    <section class = "bg-background flex flex-col gap-10 font-Inter h-auto w-full">
        <h2 class = "bg-primary text-primary-foreground text-xl text-center font-bold w-full">About Us</h2>
        <div class = "flex flex-row justify-center gap-6"> <!-- Header Introduction -->
            <img src = "@/assets/About-1.webp" class = "h-60">
            <div class = "flex flex-col justify-evenly w-100">
                <h4 class = "text-accent-blue">A Personalized Healthcare Experience Since 2005</h4>
                <h1 class = "text-4xl font-extrabold text-accent-blue">19 years of Caring with pride and dignity</h1>
                <p class = "text-xs text-justify">St. Rupert Medical Clinic was established on March 9, 2005, 
                    with the mission of providing a patient-friendly atmosphere 
                    within a comprehensive primary healthcare facility. 
                    The clinic is deeply committed to the art of caring and upholding 
                    the value of life by ensuring high-quality medical services. 
                    Our team consists of fully equipped and licensed medical professionals 
                    dedicated to delivering compassionate and expert healthcare to all patients.</p>
            </div>
        </div>
        <div class = "flex flex-col items-center"> <!-- Meet the Team -->
            <h3 class = "text-3xl text-accent-blue font-extrabold">Meet the Team!</h3>
            <Carousel class = "w-full max-w-md h-auto">
                <CarouselContent>
                    <CarouselItem
                    v-for = "(slide, index) in carouselSlides"
                    :key = "index"
                    >
                    <img
                        :src = "slide"
                        alt = "Slide"
                        class = "w-full h-70 object-cover rounded-lg"
                    />
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
                </Carousel>
                <p class = "font-bold text-accent-blue">OWNER/FOUNDER</p>
                <p class = "text-xs text-accent-blue">Mr. Rupert Panao & Mrs. Joanalyn Panao with the rest of the team</p>
        </div>
        <div class = "flex flex-col justify-center p-10"> <!-- Contact Us -->
            <h3 class = "text-3xl text-accent-blue text-center font-extrabold">Contact Us!</h3>
            <div class = "flex flex-row items-start justify-center gap-5">
                <div class = "flex flex-col items-start justify-start font-medium text-accent-blue w-70 text-justify">
                    <div class = "flex items-start gap-2">
                        <MapPin class = "h-7 w-7 text-foreground"/>
                        <p class = "text-xs">Unit 132, LTM Building Ramarosa, Luzon Ave, Quezon City, 1119 Metro Manila</p>
                    </div>
                    <div class = "flex items-center gap-2 mt-2">
                        <Phone class = "h-4 w-5 text-foreground"/>
                        <p class = "text-xs">09202547595  |  8-373-8421</p>
                    </div>
                </div>
                <iframe
                    class = "w-120 h-70"
                    src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.2547204380047!2d121.0690771!3d14.6671809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b75b1beda2a9%3A0x7b74b5c9e9be886a!2sSt.%20Rupert%20Medical%20%26%20Laboratory%20Clinic!5e0!3m2!1sen!2sph!4v1714429115910!5m2!1sen!2sph"
                    allowfullscreen = "true"
                    loading = "lazy"
                    referrerpolicy = "no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    </section>
</template>

<script setup lang = "ts">
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from '@/components/ui/carousel'
import { Phone, MapPin } from 'lucide-vue-next'

const carouselSlides = [
    new URL('@/assets/About/Slide-1.svg', import.meta.url).href,
    new URL('@/assets/About/Slide-2.svg', import.meta.url).href,
    new URL('@/assets/About/Slide-3.svg', import.meta.url).href,
    new URL('@/assets/About/Slide-4.svg', import.meta.url).href,
]
</script>