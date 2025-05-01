<template>
	<section class = "relative font-Inter h-auto overflow-hidden">
		<div class = "absolute inset-0 bg-[url('@/assets/AppointmentForm/Form-Background.svg')] bg-cover bg-no-repeat bg-center brightness-30 h-120 z-0"></div>
		<div class = "relative z-10 flex flex-col items-center">
			<h2 class = "bg-primary text-primary-foreground text-xl text-center font-bold w-full">
				Appointment Form
			</h2>
			<div class = "bg-background w-290 h-100 p-10">
				<div v-if = "currentPage === 1">
					<h4 class = "text-xl font-bold text-primary">Appointment Information</h4>
					<p class = "text-xs font-medium">Please provide your correct information. This will be used for your registration.</p>
				</div>
				<div v-if = "currentPage === 2">
					<h4 class = "text-xl font-bold text-primary">Basic Information</h4>
					<p class = "text-xs font-medium">Please provide your correct and accurate information.</p>
				</div>
				<div v-if = "currentPage === 1">
					<form @submit.prevent = "handleNextClick" class = "flex flex-row justify-evenly gap-10 mt-5">
						<div class = "flex flex-col items-start">
							<label class = "text-xs font-medium">Service</label>
							<DropdownMenu>
								<DropdownMenuTrigger class = "border border-border text-muted-foreground p-2 rounded-md flex text-xs items-center gap-2 w-40">
									<span>{{ formData.selectedService || 'Select Service' }}</span>
									<ChevronDown class = "w-4 h-4" />
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem v-for = "service in dropdownItems" :key = "service.title" @click = "selectService(service)">
										{{ service.title }}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
							<p v-if = "!formData.selectedService && isNextClicked" class = "text-destructive text-xs">Service is required</p>
						</div>
						<div class = "flex flex-col items-start">
							<label class = "text-xs font-medium">Procedure</label>
							<DropdownMenu>
								<DropdownMenuTrigger class = "border border-border text-muted-foreground p-2 rounded-md flex text-xs items-center gap-2 w-50">
									<span>{{ formData.selectedProcedure || 'Select Procedure' }}</span>
									<ChevronDown class = "w-4 h-4" />
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem v-for = "procedure in availableProcedures" :key = "procedure.name" @click = "setProcedurePrice(procedure)">
										{{ procedure.name }}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
							<p v-if = "!formData.selectedProcedure && isNextClicked" class = "text-destructive text-xs">Procedure is required</p>
						</div>
						<div class = "flex flex-col items-start">
							<label class = "text-xs font-medium">Price</label>
							<h3 class = "text-2xl font-bold">₱ {{ price.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</h3>
						</div>
						<div class = "flex flex-col items-start">
							<label class = "text-xs font-medium">Appointment Time</label>
							<RadioGroup v-model = "formData.selectedTime">
								<div class = "flex items-center space-x-2">
									<RadioGroupItem id = "time-8am" value = "8:00 AM - 9:00 AM" />
									<Label for = "time-8am">8:00 AM - 9:00 AM</Label>
								</div>
								<div class = "flex items-center space-x-2">
									<RadioGroupItem id = "time-9am" value = "9:00 AM - 10:00 AM" />
									<Label for = "time-9am">9:00 AM - 10:00 AM</Label>
								</div>
								<div class = "flex items-center space-x-2">
									<RadioGroupItem id = "time-10am" value = "10:00 AM - 11:00 AM" />
									<Label for = "time-10am">10:00 AM - 11:00 AM</Label>
								</div>
								<div class = "flex items-center space-x-2">
									<RadioGroupItem id = "time-11am" value = "11:00 AM - 12:00 PM" />
									<Label for = "time-11am">11:00 AM - 12:00 PM</Label>
								</div>
								<div class = "flex items-center space-x-2">
									<RadioGroupItem id = "time-1pm" value = "1:00 PM - 2:00 PM" />
									<Label for = "time-1pm">1:00 PM - 2:00 PM</Label>
								</div>
								<div class = "flex items-center space-x-2">
									<RadioGroupItem id = "time-3pm" value = "3:00 PM - 4:00 PM" />
									<Label for = "time-3pm">3:00 PM - 4:00 PM</Label>
								</div>
								<div class = "flex items-center space-x-2">
									<RadioGroupItem id = "time-4pm" value = "4:00 PM - 5:00 PM" />
									<Label for = "time-4pm">4:00 PM - 5:00 PM</Label>
								</div>
							</RadioGroup>
							<p v-if = "!formData.selectedTime && isNextClicked" class = "text-destructive text-xs mt-2">Time is required</p>
						</div>
						<div class = "flex flex-col items-start">
							<label class = "text-xs font-medium">Appointment Date</label>
							<input
								type = "date"
								v-model = "formData.selectedDate"
								class = "border p-2 font-Inter text-xs rounded-md"
								:min = "minDate"
							/>
							<p v-if = "!formData.selectedDate && isNextClicked" class = "text-destructive text-xs">Date is required</p>
						</div>
					</form>
				</div>
				<div v-if = "currentPage === 2">
                    <form @submit.prevent = "handleNextClick" class = "grid grid-cols-3 gap-x-10 gap-y-6 mt-5">
                        <div class = "flex flex-col items-start">
                            <label class = "text-xs font-medium">First Name</label>
                            <Input
                                id = "firstName"
                                v-model = "formData.firstName"
                                type = "text"
                                placeholder = "Juan"
                                class = "text-xs p-2 rounded-md border border-border w-full"
                            />
                        </div>
                        <div class = "flex flex-col items-start">
                            <label class = "text-xs font-medium">Last Name</label>
                            <Input
                                id = "lastName"
                                v-model = "formData.lastName"
                                type = "text"
                                placeholder = "Dela Cruz"
                                class = "text-xs p-2 rounded-md border border-border w-full"
                            />
                        </div>
                        <div class = "flex flex-col items-start">
                            <label class = "text-xs font-medium">Contact Number</label>
                            <Input
                                id = "contact"
                                v-model = "formData.contactNumber"
                                type = "tel"
                                placeholder = "09XXXXXXXXX"
                                class = "text-xs p-2 rounded-md border border-border w-full"
                            />
                        </div>
                        <div class = "flex flex-col items-start">
                            <label class = "text-xs font-medium">Email Address</label>
                            <Input
                                id = "email"
                                v-model = "formData.email"
                                type = "email"
                                placeholder = "example@email.com"
                                class = "text-xs p-2 rounded-md border border-border w-full"
                                :class="{'border-destructive': isNextClicked && !isValidEmail && formData.email}"
                                @blur="validateEmail"
                            />
                            <p v-if = "isNextClicked && !isValidEmail && formData.email" class = "text-destructive text-xs">
                                Please enter a valid email address
                            </p>
                        </div>
                        <div class = "flex flex-col items-start">
                            <label class = "text-xs font-medium">Sex</label>
                            <DropdownMenu>
                                <DropdownMenuTrigger class = "border border-border text-muted-foreground p-2 rounded-md flex text-xs items-center gap-2 w-30">
                                    <span>{{ formData.sex || 'Select Sex' }}</span>
                                    <ChevronDown class = "w-4 h-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem @click = "formData.sex = 'Male'">
                                        Male
                                    </DropdownMenuItem>
                                    <DropdownMenuItem @click = "formData.sex = 'Female'">
                                        Female
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div class = "flex flex-col items-start">
                            <label class = "text-xs font-medium">Date of Birth</label>
                            <div class="relative w-full">
                                <Input
                                    id = "dob"
                                    v-model = "formData.dateOfBirth"
                                    type = "date"
                                    class = "text-xs p-2 pr-8 rounded-md border border-border w-full"
                                />
                                <CalendarIcon class="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>
                        <div class = "flex flex-col items-start">
                            <label class = "text-xs font-medium">Reason for Appointment</label>
                            <Textarea
                                id = "reason"
                                v-model = "formData.reason"
                                rows = "1"
                                placeholder = "Type your reason here..."
                                class = "text-xs p-2 rounded-md border border-border w-full h-10 resize-none"
                            />
                        </div>
                        <div class = "flex flex-col items-start">
                            <label class = "text-xs font-medium">Age</label>
                            <Input
                                id = "age"
                                v-model = "formData.age"
                                type = "number"
                                min = "0"
                                class = "text-xs p-2 rounded-md border border-border w-30"
                            />
                        </div>
                        <div class = "flex flex-col items-start">
                            <label class = "text-xs font-medium">Address</label>
                            <Input
                                id = "address"
                                v-model = "formData.address"
                                type = "text"
                                placeholder = "Street, Barangay, Municipality"
                                class = "text-xs p-2 rounded-md border border-border w-full"
                            />
                        </div>
                    </form>
                </div>
				<div class = "flex flex-row items-center justify-end gap-3 mt-5">
					<Button variant = "outline" class = "w-30 hover:cursor-pointer">Cancel</Button>
					<Button v-if = "currentPage === 2" @click = "handlePreviousClick" variant = "outline" class = "w-30 hover:cursor-pointer">Back</Button>
					<Button 
						v-if = "currentPage === 1" 
						@click = "handleNextClick" 
						variant = "default" 
						class = "w-30 hover:cursor-pointer"
						:disabled = "isNextDisabled">Next</Button>
					<Button 
						v-if = "currentPage === 2" 
						@click = "handleNextClick" 
						variant = "default" 
						class = "w-30 hover:cursor-pointer"
						:disabled = "isNextDisabled">Submit</Button>
				</div>
			</div>
		</div>
	</section>
    
    <!-- Email verification dialog -->
    <Dialog :open="showVerificationDialog" @update:open="showVerificationDialog = $event">
        <DialogContent class="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle class = "text-center flex items-center justify-center gap-2">
                    <Mail v-if = "!verificationSuccess" class = "h-6 w-6 text-primary" />
                    <CreditCard v-else-if = "verificationSuccess && !paymentCompleted" class = "h-6 w-6 text-primary" />
                    <CheckCircle v-else class = "h-6 w-6 text-green-500" />
                    {{ !verificationSuccess ? 'Email Verification Required' : 
                       !paymentCompleted ? 'Complete Payment' : 'Appointment Confirmed' }}
                </DialogTitle>
                <DialogDescription class = "text-center">
                    <span v-if = "!verificationSuccess">
                        We've sent a verification code to <span class = "font-semibold">{{ formData.email }}</span>.<br>
                        Please enter the code below to verify your email.
                    </span>
                    <span v-else-if = "!paymentCompleted">
                        Please complete your payment to confirm your appointment.
                    </span>
                    <span v-else>
                        Your appointment has been confirmed. You'll receive a confirmation email shortly.
                    </span>
                </DialogDescription>
            </DialogHeader>

            <div v-if = "!verificationSuccess" class = "grid gap-4 py-4">
                <div class = "flex items-center space-x-2">
                    <Lock class = "h-4 w-4 opacity-50" />
                    <Input 
                        v-model = "otpValue" 
                        type = "text" 
                        placeholder = "Enter verification code" 
                        class = "text-center text-lg tracking-widest"
                        :maxlength = "6"
                    />
                </div>
                
                <p v-if = "verificationError" class = "text-destructive text-sm text-center">
                    {{ verificationError }}
                </p>
                
                <div class="flex items-center justify-center space-x-2 mt-2 mb-2">
                    <Checkbox id="privacy-policy" v-model="privacyPolicyAgreed" />
                    <label for="privacy-policy" class="text-sm leading-none">
                        I agree to the <a href="#" class="text-primary hover:underline">privacy policy and terms of service</a>
                    </label>
                </div>
                
                <Button 
                    @click = "verifyOTP" 
                    class = "w-full" 
                    variant = "default"
                    :disabled = "isVerifying || !otpValue || !privacyPolicyAgreed"
                >
                    <span v-if = "isVerifying" class = "flex items-center">
                        <svg class = "animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns = "http://www.w3.org/2000/svg" fill = "none" viewBox = "0 0 24 24">
                            <circle class = "opacity-25" cx = "12" cy = "12" r = "10" stroke = "currentColor" stroke-width = "4"></circle>
                            <path class = "opacity-75" fill = "currentColor" d = "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                    </span>
                    <span v-else>Verify Code</span>
                </Button>
                
                <div class = "text-center text-sm">
                    <button 
                        @click = "resendOTP" 
                        class = "text-primary hover:underline"
                    >
                        Didn't receive the code? Resend
                    </button>
                </div>
            </div>
            
            <div v-else-if = "!paymentCompleted" class = "grid gap-4 py-4">
                <div class = "border-2 border-primary rounded-lg p-6 bg-primary/5">
                    <h4 class = "text-xl font-semibold mb-4 flex items-center gap-2 text-primary">
                        <CreditCard class = "h-5 w-5" />
                        Payment Required
                    </h4>
                    
                    <div class = "grid grid-cols-2 gap-3 text-sm mb-6">
                        <div class="font-medium text-muted-foreground">Service:</div>
                        <div class="font-medium">{{ formData.selectedService }}</div>
                        
                        <div class="font-medium text-muted-foreground">Procedure:</div>
                        <div class="font-medium">{{ formData.selectedProcedure }}</div>
                        
                        <div class="font-medium text-muted-foreground">Date:</div>
                        <div class="font-medium">{{ formData.selectedDate }}</div>
                        
                        <div class="font-medium text-muted-foreground">Time:</div>
                        <div class="font-medium">{{ formData.selectedTime }}</div>
                        
                        <div class="font-medium text-muted-foreground border-t border-border pt-2 mt-2">Total Amount:</div>
                        <div class="font-bold text-lg border-t border-border pt-2 mt-2 text-primary">
                            ₱ {{ price.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
                        </div>
                    </div>
                    
                    <Button @click = "goToPayment" variant = "default" class = "w-full text-base py-6">
                        <CreditCard class="mr-2 h-5 w-5" />
                        Proceed to Payment
                    </Button>
                    
                    <p class="text-sm text-muted-foreground mt-3 text-center">
                        Your appointment will be confirmed after successful payment
                    </p>
                </div>
            </div>
            
            <div v-else class="grid gap-4 py-4">
                <div class="border border-border rounded-md p-4">
                    <h4 class="font-semibold mb-2">Appointment Details:</h4>
                    <div class="grid grid-cols-3 gap-x-6 gap-y-1 text-sm">
                        <!-- Service and appointment details -->
                        <div class="font-medium text-muted-foreground">Service:</div>
                        <div class="font-medium col-span-2">{{ formData.selectedService }}</div>
                        
                        <div class="font-medium text-muted-foreground">Procedure:</div>
                        <div class="font-medium col-span-2">{{ formData.selectedProcedure }}</div>
                        
                        <div class="font-medium text-muted-foreground">Date:</div>
                        <div class="font-medium col-span-2">{{ formData.selectedDate }}</div>
                        
                        <div class="font-medium text-muted-foreground">Time:</div>
                        <div class="font-medium col-span-2">{{ formData.selectedTime }}</div>
                        
                        <div class="font-medium text-muted-foreground">Price:</div>
                        <div class="font-medium col-span-2">₱ {{ price.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</div>
                        
                        <!-- Personal information -->
                        <div class="col-span-3 border-t border-border my-2 pt-2 font-semibold">Personal Information</div>
                        
                        <div class="font-medium text-muted-foreground">Name:</div>
                        <div class="font-medium col-span-2">{{ formData.firstName }} {{ formData.lastName }}</div>
                        
                        <div class="font-medium text-muted-foreground">Email:</div>
                        <div class="font-medium col-span-2">{{ formData.email }}</div>
                        
                        <div class="font-medium text-muted-foreground">Contact:</div>
                        <div class="font-medium col-span-2">{{ formData.contactNumber }}</div>
                        
                        <div class="font-medium text-muted-foreground">Sex:</div>
                        <div class="font-medium col-span-2">{{ formData.sex }}</div>
                        
                        <div class="font-medium text-muted-foreground">Age:</div>
                        <div class="font-medium col-span-2">{{ formData.age }}</div>
                        
                        <div class="font-medium text-muted-foreground">Date of Birth:</div>
                        <div class="font-medium col-span-2">{{ formData.dateOfBirth }}</div>
                        
                        <div class="font-medium text-muted-foreground">Address:</div>
                        <div class="font-medium col-span-2">{{ formData.address }}</div>
                        
                        <div class="font-medium text-muted-foreground">Reason:</div>
                        <div class="font-medium col-span-2">{{ formData.reason || 'Not specified' }}</div>
                    </div>
                </div>
            </div>
            
            <DialogFooter class = "sm:justify-center">
                <Button 
                    v-if = "paymentCompleted" 
                    @click = "closeVerificationDialog" 
                    class = "w-full sm:w-auto"
                >
                    Done
                </Button>
                <Button 
                    v-if = "!verificationSuccess" 
                    @click = "closeVerificationDialog" 
                    variant = "outline" 
                    class = "w-full sm:w-auto"
                >
                    Cancel
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PinInput,PinInputGroup } from '@/components/ui/pin-input'
import { ChevronDown, Mail, Lock, CheckCircle, CreditCard, CalendarIcon } from 'lucide-vue-next'
import axios from 'axios'
import { Checkbox } from '@/components/ui/checkbox'

axios.defaults.baseURL = 'http://localhost:3000';

// Form Data Setup
const formData = ref({
    // Page 1 Data
    selectedService: '',
    selectedProcedure: '',
    price: 0,
    selectedTime: '',
    selectedDate: '',
    
    // Page 2 Data
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    sex: '',
    dateOfBirth: '',
    reason: '',
    age: '',
    address: ''
})

// Date Picker
const today = new Date()
today.setDate(today.getDate() + 1)
const minDate = today.toISOString().split('T')[0]

// Services Data
const dropdownItems = [
{
    title: 'Bacteriology',
    procedures: [
    { id: 1, name: 'AFB Stain-Sputum Exam', price: 390 },
    { id: 2, name: 'Gram Staining', price: 950 },
    { id: 3, name: 'Blood: Culture & Sensitivity', price: 950 },
    { id: 4, name: 'Urine: Culture & Sensitivity', price: 950 },
    { id: 5, name: 'KOH (Potassium Hydroxide)', price: 650 },
    ]
},
{
    title: 'Blood Chemistry',
    procedures: [
    { id: 6, name: 'Fasting Blood Sugar (FBS)', price: 250 },
    { id: 7, name: 'Random Blood Sugar (RBS)', price: 300 },
    { id: 8, name: 'Blood Uric Acid (BUA)', price: 250 },
    { id: 9, name: 'Blood Urea Nitrogen (BUN)', price: 250 },
    { id: 10, name: 'Serum Creatinine', price: 250 },
    { id: 11, name: 'Total Cholesterol', price: 300 },
    { id: 12, name: 'Triglycerides', price: 250 },
    ]
},
{
    title: 'Consultation',
    procedures: [
    { id: 13, name: 'Consultation', price: 400 },
    { id: 14, name: 'Check-up with Medical Certificate', price: 500 },
    ]
},
{
    title: 'Electrolytes',
    procedures: [
    { id: 15, name: 'Sodium', price: 350 },
    { id: 16, name: 'Potassium', price: 350 },
    { id: 17, name: 'Chloride', price: 350 },
    { id: 18, name: 'Calcium', price: 350 },
    { id: 19, name: 'Ionized Calcium', price: 350 },
    { id: 20, name: 'Magnesium', price: 350 },
    { id: 21, name: 'Phosphorus', price: 350 },
    ]
},
{
    title: 'Hematology',
    procedures: [
    { id: 22, name: 'Complete Blood Count (CBC)', price: 250 },
    { id: 23, name: 'Actual Blood Count (ABC)', price: 250 },
    { id: 24, name: 'ABO Blood Typing (B/T)', price: 300 },
    { id: 25, name: 'Erythrocyte Sedimentation Rate (ESR)', price: 500 },
    { id: 26, name: 'Pt, Ptt', price: 490.00 },
    ]
},
{
    title: 'Microscopy',
    procedures: [
    { id: 27, name: 'Urinalysis (Urine)', price: 250 },
    { id: 28, name: 'Fecalysis (Stool)', price: 250 },
    { id: 29, name: 'Occult Blood', price: 450 },
    { id: 30, name: 'Pregnancy Test (Urine)', price: 350 },
    { id: 31, name: 'Pregnancy Test (Serum)', price: 500 },
    ]
},
{
    title: 'Serology',
    procedures: [
    { id: 32, name: 'Hepa-B Screening (HBsAg)', price: 300 },
    { id: 33, name: 'VDRI / RPR Screening', price: 300 },
    { id: 34, name: 'ASO Screening', price: 500 },
    { id: 35, name: 'Dengue NS1', price: 1950.00 },
    { id: 36, name: 'Dengue NS1, IgG & IgM (Duo)', price: 3400.00 },
    ]
},
{
    title: 'Thyroid Function',
    procedures: [
    { id: 37, name: 'T3 (Triiodothyronine)', price: 490 },
    { id: 38, name: 'T4 (Thyroxine)', price: 490 },
    { id: 39, name: 'FT3 (Free Triiodothyronine)', price: 550 },
    { id: 40, name: 'FT4 (Free Thyroxine)', price: 550 },
    { id: 41, name: 'TSH (Thyroid-Stimulating Hormone)', price: 650 },
    ]
},
{
    title: 'Ultrasound',
    procedures: [
    { id: 42, name: 'Whole Abdomen Ultrasound', price: 1500 },
    { id: 43, name: 'KUB Ultrasound', price: 1000 },
    { id: 44, name: 'Transvaginal Ultrasound', price: 950 },
    { id: 45, name: 'Pelvic/Abdominal Ultrasound', price: 500 },
    { id: 46, name: 'Bio Physical Scoring (BPS)', price: 950 },
    ]
},
{
    title: 'X-ray',
    procedures: [
    { id: 47, name: 'Chest X-ray', price: 450 },
    { id: 48, name: 'Skull X-ray', price: 650 },
    { id: 49, name: 'Lumbosacral X-ray', price: 850 },
    { id: 50, name: 'Extremities X-ray', price: 750 },
    { id: 51, name: 'With Lateral view', price: 550 },
    ]
},
]

const price = ref(0)
const isNextClicked = ref(false)
const currentPage = ref(1)

// Dialog and OTP state
const showVerificationDialog = ref(false)
const otpValue = ref('')
const isVerifying = ref(false)
const verificationError = ref('')
const verificationSuccess = ref(false)
const appointmentId = ref(null)
const paymentUrl = ref('')
const paymentCompleted = ref(false)
const privacyPolicyAgreed = ref(false)

const availableProcedures = computed(() => {
    const selectedService = formData.value.selectedService
    const service = dropdownItems.find(service => service.title === selectedService)
    return service ? service.procedures : []
})

const selectService = (service) => {
    formData.value.selectedService = service.title
    formData.value.selectedProcedure = '' // Reset procedure when service changes
}

function setProcedurePrice(procedure: { name: string, price: number }) {
    formData.value.selectedProcedure = procedure.name
    price.value = procedure.price
}

// Pagination Functions
function handlePreviousClick() {
    currentPage.value = 1 
}

// Update your handleNextClick function:
async function handleNextClick() {
    isNextClicked.value = true
    
    // Validate email
    validateEmail()
  
    // On page 1, just move to the next page
    if (currentPage.value === 1) {
        if (formData.value.selectedService && 
            formData.value.selectedProcedure && 
            formData.value.selectedTime && 
            formData.value.selectedDate) {
            currentPage.value = 2
        }
        return
    }
  
    // On page 2, submit the appointment and start verification
    if (currentPage.value === 2) {
        // Check if all required fields are filled and email is valid
        if (formData.value.firstName && 
            formData.value.lastName && 
            formData.value.contactNumber && 
            formData.value.email &&
            isValidEmail.value &&
            formData.value.sex &&
            formData.value.address) {
            try {
                // Prepare the data in the format your backend expects
                const appointmentData = {
                    first_name: formData.value.firstName,
                    last_name: formData.value.lastName,
                    sex: formData.value.sex,
                    age: formData.value.age,
                    email: formData.value.email,
                    date_of_birth: formData.value.dateOfBirth,
                    contact_no: formData.value.contactNumber,
                    address: formData.value.address,
                    reason: formData.value.reason,
                    procedure_id: getProcedureId(formData.value.selectedProcedure),
                    appointment_date: formData.value.selectedDate,
                    appointment_time: to24HourFormat(parseStartTime(formData.value.selectedTime)) // ✅
                }
        
                // Submit appointment to backend
                const response = await axios.post('/api/appointment/submit-appointment', appointmentData)
        
                if (response.data.success) {
                    // Store the appointment ID for later verification
                    appointmentId.value = response.data.appointmentId

                    // Show verification dialog
                    showVerificationDialog.value = true
                    otpValue.value = '' // Clear any previous OTP
                    verificationError.value = ''
                    verificationSuccess.value = false
                    paymentUrl.value = ''
                } else {
                    // Handle error
                    console.error('Failed to submit appointment:', response.data.message)
                }
            } catch (error) {
                console.error('Error submitting appointment:', error.response?.data || error.message)
            }
        }
    }
}

function parseStartTime(timeRange) {
  if (!timeRange) return null
  
  return timeRange.split(' - ')[0]
}

function to24HourFormat(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (modifier === 'PM' && hours !== '12') {
    hours = parseInt(hours, 10) + 12;
    } else if (modifier === 'AM' && hours === '12') {
    hours = '00';
    }

    return `${hours}:${minutes}`;
}

// Function to get procedure ID from the procedure name
function getProcedureId(procedureName) {
    // Find the procedure ID in dropdown items
    for (const service of dropdownItems) {
        for (const procedure of service.procedures) {
            if (procedure.name === procedureName) {
                return procedure.id
            }
        }
    }
    return null // Default if not found
}

// Function to verify OTP
async function verifyOTP() {
    if (!otpValue.value || otpValue.value.length < 4) {
        verificationError.value = 'Please enter a valid verification code'
        return
    }
  
    isVerifying.value = true
    verificationError.value = ''
  
    try {
        // Call your backend to verify OTP
        const response = await axios.post('/api/email/verify-email-code', {
            appointmentId: appointmentId.value,
            code: otpValue.value
        })
    
        if (response.data.success) {
            // OTP verified successfully
            verificationSuccess.value = true
            // If there's a payment URL, store it
            if (response.data.checkoutUrl) {
                paymentUrl.value = response.data.checkoutUrl
            }
            isVerifying.value = false
        } else {
            // Invalid OTP
            verificationError.value = response.data.message || 'Invalid verification code. Please try again.'
            isVerifying.value = false
        }
    } catch (error) {
        console.error('Error verifying OTP:', error)
        verificationError.value = error.response?.data?.message || 'An error occurred during verification'
        isVerifying.value = false
    }
}

// Function to close the dialog and reset form if needed
function closeVerificationDialog() {
    showVerificationDialog.value = false
    // If verification was successful, reset the form
    if (verificationSuccess.value && !paymentUrl.value) {
        resetForm()
    }
}

// Function to reset form
function resetForm() {
    formData.value = {
        selectedService: '',
        selectedProcedure: '',
        price: 0,
        selectedTime: '',
        selectedDate: '',
        firstName: '',
        lastName: '',
        contactNumber: '',
        email: '',
        sex: '',
        dateOfBirth: '',
        reason: '',
        age: '',
        address: ''
    }
    currentPage.value = 1
    isNextClicked.value = false
    price.value = 0
    paymentCompleted.value = false
    privacyPolicyAgreed.value = false
}

// Function to resend OTP if needed
async function resendOTP() {
    try {
        const response = await axios.post('/api/email/resend-verification-code', {
            email: formData.value.email
        })
    
        if (response.data.success) {
            verificationError.value = 'New verification code sent to your email'
        } else {
            verificationError.value = response.data.message || 'Failed to resend code'
        }
    } catch (error) {
        console.error('Error resending OTP:', error)
        verificationError.value = error.response?.data?.message || 'Failed to resend verification code'
    }
}

function goToPayment() {
    if (paymentUrl.value) {
        // Open payment URL in a new tab
        window.open(paymentUrl.value, '_blank')
        
        setTimeout(() => {
            paymentCompleted.value = true
        }, 2000)
    } else {
        // If no payment URL is available, show an error or fallback
        console.error("Payment URL not available")
    }
}

const isNextDisabled = computed(() => {
    if (currentPage.value === 1) {
        return !formData.value.selectedService || 
               !formData.value.selectedProcedure || 
               !formData.value.selectedTime || 
               !formData.value.selectedDate
    } else if (currentPage.value === 2) {
        return !formData.value.firstName || 
               !formData.value.lastName || 
               !formData.value.contactNumber || 
               !formData.value.email || 
               !isValidEmail.value ||
               !formData.value.sex
    }
    return false
})

const isValidEmail = ref(true)

function validateEmail() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    isValidEmail.value = emailRegex.test(formData.value.email)
}
</script>
