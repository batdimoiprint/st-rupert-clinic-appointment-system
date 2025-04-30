<template>
  <section class="relative font-Inter h-auto overflow-hidden">
    <div class="absolute inset-0 bg-[url('@/assets/AppointmentForm/Form-Background.svg')] bg-cover bg-no-repeat bg-center brightness-30 h-120 z-0"></div>
    <div class="relative z-10 flex flex-col items-center">
      <h2 class="bg-primary text-primary-foreground text-xl text-center font-bold w-full">
        Appointment Form
      </h2>
      <div class="bg-background w-290 h-100 p-10">
        <h4 class="text-xl font-bold text-primary">Appointment Information</h4>
        <p class="text-xs font-medium">Please provide your correct information. This will be used for your registration.</p>
        <div v-if="currentPage === 1">
          <form @submit.prevent="handleNextClick" class="flex flex-row justify-evenly gap-10 mt-5">
          <div class="flex flex-col items-start">
            <label class="text-xs font-medium">Service</label>
            <DropdownMenu>
              <DropdownMenuTrigger class="border border-border text-muted-foreground p-2 rounded-md flex text-xs items-center gap-2 w-40">
                <span>{{ selectedService || 'Select Service' }}</span>
                <ChevronDown class="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem v-for="service in dropdownItems" :key="service.title" @click="selectedService = service.title; selectedProcedure = ''">
                  {{ service.title }}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <p v-if="!selectedService && isNextClicked" class="text-destructive text-xs">Service is required</p>
          </div>
          <div class="flex flex-col items-start">
            <label class="text-xs font-medium">Procedure</label>
            <DropdownMenu>
              <DropdownMenuTrigger class="border border-border text-muted-foreground p-2 rounded-md flex text-xs items-center gap-2 w-50">
                <span>{{ selectedProcedure || 'Select Procedure' }}</span>
                <ChevronDown class="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem v-for="procedure in availableProcedures" :key="procedure.name" @click="setProcedurePrice(procedure)">
                  {{ procedure.name }}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <p v-if="!selectedProcedure && isNextClicked" class="text-destructive text-xs">Procedure is required</p>
          </div>
          <div class="flex flex-col items-start">
            <label class="text-xs font-medium">Price</label>
            <h3 class="text-2xl font-bold">₱ {{ price.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</h3>
          </div>
          <div class="flex flex-col items-start">
            <label class="text-xs font-medium">Appointment Time</label>
            <RadioGroup v-model="selectedTime">
              <div class="flex items-center space-x-2">
                <RadioGroupItem id="time-8am" value="8:00 AM - 9:00 AM" />
                <Label for="time-8am">8:00 AM - 9:00 AM</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem id="time-9am" value="9:00 AM - 10:00 AM" />
                <Label for="time-9am">9:00 AM - 10:00 AM</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem id="time-10am" value="10:00 AM - 11:00 AM" />
                <Label for="time-10am">10:00 AM - 11:00 AM</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem id="time-11am" value="11:00 AM - 12:00 PM" />
                <Label for="time-11am">11:00 AM - 12:00 PM</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem id="time-1pm" value="1:00 PM - 2:00 PM" />
                <Label for="time-1pm">1:00 PM - 2:00 PM</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem id="time-3pm" value="3:00 PM - 4:00 PM" />
                <Label for="time-3pm">3:00 PM - 4:00 PM</Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem id="time-4pm" value="4:00 PM - 5:00 PM" />
                <Label for="time-4pm">4:00 PM - 5:00 PM</Label>
              </div>
            </RadioGroup>
            <p v-if="!selectedTime && isNextClicked" class="text-destructive text-xs mt-2">Time is required</p>
          </div>
          <div class="flex flex-col items-start">
            <label class="text-xs font-medium">Appointment Date</label>
            <input
              type="date"
              v-model="selectedDate"
              class="border p-2 font-Inter text-xs rounded-md"
              :min="minDate"
            />
            <p v-if="!selectedDate && isNextClicked" class="text-destructive text-xs">Date is required</p>
          </div>
        </form>
        </div>
        <div v-if="currentPage === 2">
          <h4 class="text-xl font-bold text-primary">Page 2</h4>
          <p>This is page 2 of the form (add content here later).</p>
        </div>
        <div class="flex flex-row items-center justify-end gap-3 mt-5">
          <Button variant="outline" class="w-30 hover:cursor-pointer">Cancel</Button>
          <!-- Show the 'Back' button on Page 2 -->
          <Button v-if="currentPage === 2" @click="handlePreviousClick" variant="outline" class="w-30 hover:cursor-pointer">Back</Button>
          <Button 
            v-if="currentPage === 1" 
            @click="handleNextClick" 
            variant="default" 
            class="w-30 hover:cursor-pointer"
            :disabled="isNextDisabled">Next</Button>

          <!-- Show the 'Next' button on Page 2 -->
          <Button 
            v-if="currentPage === 2" 
            @click="handleNextClick" 
            variant="default" 
            class="w-30 hover:cursor-pointer"
            :disabled="isNextDisabled">Next</Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-vue-next'

const today = new Date()
today.setDate(today.getDate() + 2)
const minDate = today.toISOString().split('T')[0]

// Services Data
const dropdownItems = [
  {
    title: 'Bacteriology',
    procedures: [
      { name: 'AFB Stain-Sputum Exam', price: 390 },
      { name: 'Gram Staining', price: 950 },
      { name: 'Blood: Culture & Sensitivity', price: 950 },
      { name: 'Urine: Culture & Sensitivity', price: 950 },
      { name: 'KOH (Potassium Hydroxide)', price: 650 },
    ]
  },
  {
    title: 'Blood Chemistry',
    procedures: [
      { name: 'Fasting Blood Sugar (FBS)', price: 250 },
      { name: 'Random Blood Sugar (RBS)', price: 300 },
      { name: 'Blood Uric Acid (BUA)', price: 250 },
      { name: 'Blood Urea Nitrogen (BUN)', price: 250 },
      { name: 'Random Blood Sugar (RBS)', price: 300 },
      { name: 'Serum Creatinine', price: 250 },
      { name: 'Total Cholesterol', price: 300 },
      { name: 'Triglycerides', price: 250 },
    ]
  },
  {
    title: 'Consultation',
    procedures: [
      { name: 'Consultation', price: 400 },
      { name: 'Check-up with Medical Certificate', price: 500 },
    ]
  },
  {
    title: 'Electrolytes',
    procedures: [
      { name: 'Sodium', price: 350 },
      { name: 'Potassium', price: 350 },
      { name: 'Chloride', price: 350 },
      { name: 'Calcium', price: 350 },
      { name: 'Ionized Calcium', price: 350 },
      { name: 'Magnesium', price: 350 },
      { name: 'Phosphorus', price: 350 },
    ]
  },
  {
    title: 'Hematology',
    procedures: [
      { name: 'Complete Blood Count (CBC)', price: 250 },
      { name: 'Actual Blood Count (ABC)', price: 250 },
      { name: 'ABO Blood Typing (B/T)', price: 300 },
      { name: 'Erythrocyte Sedimentation Rate (ESR)', price: 500 },
      { name: 'Pt, Ptt', price: 490.00 },
    ]
  },
  {
    title: 'Microscopy',
    procedures: [
      { name: 'Urinalysis (Urine)', price: 250 },
      { name: 'Fecalysis (Stool)', price: 250 },
      { name: 'Occult Blood', price: 450 },
      { name: 'Pregnancy Test (Urine)', price: 350 },
      { name: 'Pregnancy Test (Serum)', price: 500 },
    ]
  },
  {
    title: 'Serology',
    procedures: [
      { name: 'Hepa-B Screening (HBsAg)', price: 300 },
      { name: 'VDRI / RPR Screening', price: 300 },
      { name: 'ASO Screening', price: 500 },
      { name: 'Dengue NS1', price: 1950.00 },
      { name: 'Dengue NS1, IgG & IgM (Duo)', price: 3400.00 },
    ]
  },
  {
    title: 'Thyroid Function',
    procedures: [
      { name: 'T3 (Triiodothyronine)', price: 490 },
      { name: 'T4 (Thyroxine)', price: 490 },
      { name: 'FT3 (Free Triiodothyronine)', price: 550 },
      { name: 'FT4 (Free Thyroxine)', price: 550 },
      { name: 'TSH (Thyroid-Stimulating Hormone)', price: 650 },
    ]
  },
  {
    title: 'Ultrasound',
    procedures: [
      { name: 'Whole Abdomen Ultrasound', price: 1500 },
      { name: 'KUB Ultrasound', price: 1000 },
      { name: 'Transvaginal Ultrasound', price: 950 },
      { name: 'Pelvic/Abdominal Ultrasound', price: 500 },
      { name: 'Bio Physical Scoring (BPS)', price: 950 },
    ]
  },
  {
    title: 'X-ray',
    procedures: [
      { name: 'Chest X-ray', price: 450 },
      { name: 'Skull X-ray', price: 650 },
      { name: 'Lumbosacral X-ray', price: 850 },
      { name: 'Extremities X-ray', price: 750 },
      { name: 'With Lateral view', price: 550 },
    ]
  },
]

const selectedDate = ref(null)
const selectedTime = ref('')
const selectedService = ref('')
const selectedProcedure = ref('')
const price = ref(0)
const isNextClicked = ref(false)
const currentPage = ref(1)

const availableProcedures = computed(() => {
  const service = dropdownItems.find(s => s.title === selectedService.value)
  return service?.procedures ?? []
})

function setProcedurePrice(procedure: { name: string, price: number }) {
  selectedProcedure.value = procedure.name
  price.value = procedure.price
}

function handleNextClick() {
  isNextClicked.value = true
  currentPage.value = 2  
}

function handlePreviousClick() {
  currentPage.value = 1 
}

const isNextDisabled = computed(() => {
  return !selectedService.value || !selectedProcedure.value || !selectedTime.value || !selectedDate.value
})
</script>
