<template>
  <div
    class="flex items-center justify-center bg-primary text-primary-foreground text-2xl py-2 font-bold w-full rounded-t-lg"
  >
    <CalendarIcon class="inline-block mr-2 w-6 h-6" />
    Appointment Form
  </div>
  <section class="relative h-auto overflow-hidden px-[10%] py-8 pb-32">
    <div class="flex flex-col md:flex-row w-full gap-4">
      <!-- Left column: Form (both pages) -->
      <div class="w-full md:w-1/2">
        <div v-if="currentPage === 1">
          <div class="relative z-10 flex flex-col">
            <Card class="p-6">
              <CardHeader>
                <CardTitle>Appointment Information</CardTitle>
                <CardDescription>
                  Please provide your correct information. This will be used for
                  your registration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  @submit.prevent="handleNextClick"
                  class="flex flex-col gap-4"
                >
                  <!-- Service, Procedure and Price in one row -->
                  <div
                    class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-4"
                  >
                    <div
                      class="flex flex-col items-start flex-1 w-full sm:w-auto"
                    >
                      <label class="text-sm font-semibold mb-1.5 text-primary"
                        >Service</label
                      >
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          class="border border-border bg-background hover:bg-slate-50 text-muted-foreground p-2.5 rounded-md flex text-sm items-center justify-between gap-2 w-full shadow-sm"
                        >
                          <span class="font-medium">{{
                            formData.selectedService || "Select Service"
                          }}</span>
                          <ChevronDown class="w-4 h-4 opacity-70" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            v-for="service in dropdownItems"
                            :key="service.title"
                            @click="selectService(service)"
                            class="hover:text-primary cursor-pointer"
                          >
                            {{ service.title }}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <p
                        v-if="!formData.selectedService && isPage1Validated"
                        class="text-destructive text-xs mt-1"
                      >
                        Service is required
                      </p>
                    </div>
                    <div
                      class="flex flex-col items-start flex-1 w-full sm:w-auto"
                    >
                      <label class="text-sm font-semibold mb-1.5 text-primary"
                        >Procedure</label
                      >
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          class="border border-border bg-background hover:bg-slate-50 text-muted-foreground p-2.5 rounded-md flex text-sm items-center justify-between gap-2 w-full shadow-sm"
                          :class="{ 'opacity-60': !formData.selectedService }"
                          :disabled="!formData.selectedService"
                        >
                          <span class="font-medium">{{
                            formData.selectedProcedure || "Select Procedure"
                          }}</span>
                          <ChevronDown class="w-4 h-4 opacity-70" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            v-for="procedure in availableProcedures"
                            :key="procedure.name"
                            @click="setProcedurePrice(procedure)"
                            class="hover:text-primary cursor-pointer"
                          >
                            {{ procedure.name }}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <p
                        v-if="!formData.selectedProcedure && isPage1Validated"
                        class="text-destructive text-xs mt-1"
                      >
                        Procedure is required
                      </p>
                    </div>
                    <div class="flex flex-col items-start w-full sm:w-auto">
                      <label class="text-sm font-semibold mb-1.5 text-primary"
                        >Price</label
                      >
                      <div
                        class="bg-primary/5 border border-primary/10 px-4 py-2 rounded-md shadow-sm"
                      >
                        <h3 class="text-2xl font-bold text-primary">
                          ₱
                          {{
                            price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })
                          }}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <!-- Appointment time selection with improved styling -->
                  <div class="flex flex-col items-start w-full mb-4">
                    <!-- Date picker section -->
                    <div class="flex flex-col items-start mb-4 w-full sm:w-1/2">
                      <label class="text-sm font-semibold mb-1.5 text-primary"
                        >Appointment Date <span class="text-xs text-muted-foreground">(Must be at least 1 day in advance)</span></label
                      >
                      <div class="relative w-full">
                        <input
                          type="date"
                          v-model="formData.selectedDate"
                          class="border border-border bg-background hover:border-primary/50 p-2.5 text-sm rounded-md w-full shadow-sm focus:ring-1 focus:ring-primary/30 focus:border-primary"
                          :min="minDate"
                          @change="handleDateChange"
                        />
                        <CalendarIcon
                          class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                        />
                      </div>
                      <p
                        v-if="!formData.selectedDate && isPage1Validated"
                        class="text-destructive text-xs mt-1"
                      >
                        Please select an appointment date
                      </p>
                      <p
                        v-else-if="isInvalidDate"
                        class="text-destructive text-xs mt-1"
                      >
                        Cannot book for today. Please select a future date.
                      </p>
                      <p class="text-muted-foreground text-xs mt-1">
                        Same-day appointments cannot be booked online.
                      </p>
                    </div>
                    <label class="text-sm font-semibold mb-2 text-primary"
                      >Appointment Time</label
                    >

                    <RadioGroup
                      v-model="formData.selectedTime"
                      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full"
                    >
                      <div
                        v-for="slot in timeSlots" 
                        :key="slot.id"
                        class="flex items-center space-x-2 border border-border rounded-md px-3 py-2 transition-all"
                        :class="{
                          'bg-primary/5 border-primary': formData.selectedTime === slot.time,
                          'hover:border-primary/50 cursor-pointer': !isTimeSlotFull(slot.id),
                          'opacity-50 bg-gray-100 dark:bg-gray-800 cursor-not-allowed': isTimeSlotFull(slot.id)
                        }"
                      >
                        <RadioGroupItem
                          :id="`time-${slot.id}`"
                          :value="slot.time"
                          :disabled="isTimeSlotFull(slot.id)"
                        />
                        <Label 
                          :for="`time-${slot.id}`" 
                          class="font-medium"
                          :class="{'cursor-pointer': !isTimeSlotFull(slot.id), 'cursor-not-allowed': isTimeSlotFull(slot.id)}"
                        >
                          {{ slot.time }}
                          <span v-if="formData.selectedDate && isTimeSlotFull(slot.id)" 
                                class="text-destructive ml-2 text-xs">
                            (Unavailable)
                          </span>
                          <span v-else-if="formData.selectedDate" 
                                class="text-primary ml-2 text-xs">
                            ({{ getAvailableSlots(slot.id) }} available)
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                    <p
                      v-if="!formData.selectedTime && isPage1Validated"
                      class="text-destructive text-xs mt-2"
                    >
                      Please select an appointment time
                    </p>
                  </div>

                  <!-- Date and reason with improved styling -->
                  <div class="flex flex-col sm:flex-row gap-5 w-full">
                    <div class="flex flex-col items-start w-full sm:w-1/2">
                      <label class="text-sm font-semibold mb-1.5 text-primary"
                        >Reason for Appointment</label
                      >
                      <Textarea
                        id="reason"
                        v-model="formData.reason"
                        rows="3"
                        placeholder="Please describe your reason for the appointment..."
                        class="text-sm p-2.5 rounded-md border border-border w-full resize-none shadow-sm hover:border-primary/50 focus:ring-1 focus:ring-primary/30 focus:border-primary"
                      />
                      <!-- Optional validation for reason -->
                      <!-- <p v-if="isPage1Validated && !formData.reason" class="text-destructive text-xs mt-1">
                        Please provide a reason for your appointment
                      </p> -->
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter class="flex justify-end gap-3">
                <Button
                  variant="outline"
                  class="w-30 hover:cursor-pointer"
                  @click="$router.push('/home')"
                >
                  Cancel
                </Button>
                <Button
                  @click="handleNextClick"
                  variant="default"
                  class="w-30 hover:cursor-pointer"
                >Next</Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <!-- When on page 2, this side shows the second part of the form -->
        <div v-if="currentPage === 2">
          <div class="relative z-10 flex flex-col">
            <Card class="p-6">
              <CardHeader>
                <CardTitle class="text-primary">Basic Information</CardTitle>
                <CardDescription>
                  Please provide your correct and accurate information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  @submit.prevent="handleNextClick"
                  class="grid grid-cols-2 gap-x-6 gap-y-4"
                >
                  <div class="flex flex-col items-start">
                    <label class="text-xs font-medium">First Name</label>
                    <Input
                      id="firstName"
                      v-model="formData.firstName"
                      type="text"
                      placeholder="Juan"
                      class="text-xs p-2 rounded-md border border-border w-full"
                      :class="{'border-destructive': isPage2Validated && !formData.firstName}"
                    />
                    <p
                      v-if="isPage2Validated && !formData.firstName"
                      class="text-destructive text-xs mt-1"
                    >
                      First name is required
                    </p>
                  </div>
                  <div class="flex flex-col items-start">
                    <label class="text-xs font-medium">Last Name</label>
                    <Input
                      id="lastName"
                      v-model="formData.lastName"
                      type="text"
                      placeholder="Dela Cruz"
                      class="text-xs p-2 rounded-md border border-border w-full"
                      :class="{'border-destructive': isPage2Validated && !formData.lastName}"
                    />
                    <p
                      v-if="isPage2Validated && !formData.lastName"
                      class="text-destructive text-xs mt-1"
                    >
                      Last name is required
                    </p>
                  </div>
                  <div class="flex flex-col items-start">
                    <label class="text-xs font-medium">Contact Number</label>
                    <Input
                      id="contact"
                      v-model="formData.contactNumber"
                      type="tel"
                      placeholder="09XXXXXXXXX"
                      class="text-xs p-2 rounded-md border border-border w-full"
                      :class="{'border-destructive': isPage2Validated && !formData.contactNumber}"
                      @blur="validateContactNumber"
                    />
                    <p
                      v-if="isPage2Validated && !formData.contactNumber"
                      class="text-destructive text-xs mt-1"
                    >
                      Contact number is required
                    </p>
                    <p
                      v-else-if="isPage2Validated && formData.contactNumber && !isValidContactNumber"
                      class="text-destructive text-xs mt-1"
                    >
                      Please enter a valid Philippine mobile number
                    </p>
                  </div>
                  <!-- Update the email input field to properly show required validation -->
                  <div class="flex flex-col items-start">
                    <label class="text-xs font-medium">Email Address <span class="text-destructive">*</span></label>
                    <Input
                      id="email"
                      v-model="formData.email"
                      type="email"
                      placeholder="example@email.com"
                      class="text-xs p-2 rounded-md border border-border w-full"
                      :class="{
                        'border-destructive': 
                          isPage2Validated && 
                          (!formData.email || (!isValidEmail && formData.email))
                      }"
                      @blur="validateEmail"
                    />
                    <p
                      v-if="isPage2Validated && !formData.email"
                      class="text-destructive text-xs mt-1"
                    >
                      Email address is required
                    </p>
                    <p
                      v-else-if="isPage2Validated && formData.email && !isValidEmail"
                      class="text-destructive text-xs mt-1"
                    >
                      Please enter a valid email address
                    </p>
                  </div>
                  <div class="flex flex-col items-start">
                    <label class="text-xs font-medium">Sex</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        class="border border-border text-muted-foreground p-2 rounded-md flex text-xs items-center gap-2"
                        :class="{'border-destructive': isPage2Validated && !formData.sex}"
                      >
                        <span>{{ formData.sex || "Select Sex" }}</span>
                        <ChevronDown class="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem @click="formData.sex = 'Male'">
                          Male
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="formData.sex = 'Female'">
                          Female
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <p
                      v-if="isPage2Validated && !formData.sex"
                      class="text-destructive text-xs mt-1"
                    >
                      Please select your sex
                    </p>
                  </div>
                  <!-- Modify the Date of Birth field to trigger age calculation -->
<div class="flex flex-col items-start">
  <label class="text-xs font-medium">Date of Birth</label>
  <div class="relative">
    <Input
      id="dob"
      v-model="formData.dateOfBirth"
      type="date"
      class="text-xs p-2 pr-8 rounded-md border border-border"
      :class="{'border-destructive': isPage2Validated && !formData.dateOfBirth}"
      @change="calculateAge"
      :max="maxDate"
    />
    <CalendarIcon class="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
  </div>
  <p
    v-if="isPage2Validated && !formData.dateOfBirth"
    class="text-destructive text-xs mt-1"
  >
    Date of birth is required
  </p>
</div>

<!-- Modify the Age field to show the minor message immediately -->
<div class="flex flex-col items-start">
  <label class="text-xs font-medium">Age</label>
  <Input
    id="age"
    v-model="formData.age"
    type="number"
    disabled
    class="text-xs p-2 rounded-md border border-border w-full bg-muted cursor-not-allowed"
    :class="{
      'border-destructive': isPage2Validated && Number(formData.age) > 99
    }"
  />
  <p
    v-if="isPage2Validated && (!formData.age && formData.age !== '0')"
    class="text-destructive text-xs mt-1"
  >
    Please select a date of birth to calculate age
  </p>
  <p
    v-else-if="Number(formData.age) < 18"
    class="text-muted-foreground text-xs mt-1"
  >
    Minors (under 18) must be accompanied by a parent or guardian
  </p>
  <p
    v-else-if="isPage2Validated && formData.age && Number(formData.age) > 99"
    class="text-destructive text-xs mt-1"
  >
    Please verify your date of birth
  </p>
</div>
                  <div class="flex flex-col items-start col-span-2">
                    <label class="text-xs font-medium">Address</label>
                    <Input
                      id="address"
                      v-model="formData.address"
                      type="text"
                      placeholder="Street, Barangay, Municipality"
                      class="text-xs p-2 rounded-md border border-border w-full"
                      :class="{'border-destructive': isPage2Validated && !formData.address}"
                    />
                    <p
                      v-if="isPage2Validated && !formData.address"
                      class="text-destructive text-xs mt-1"
                    >
                      Address is required
                    </p>
                  </div>
                </form>
              </CardContent>
              <CardFooter class="flex justify-end gap-3">
                <Button
                  variant="outline"
                  class="w-30 hover:cursor-pointer"
                  @click="$router.push('/home')"
                >
                  Cancel
                </Button>
                <Button
                  @click="handlePreviousClick"
                  variant="outline"
                  class="w-30 hover:cursor-pointer"
                  >Back</Button
                >
                <Button
                  @click="handleNextClick"
                  variant="default"
                  class="w-30 hover:cursor-pointer"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting" class="flex items-center">
                    <svg
                      class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                  <span v-else>Submit</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <!-- Right column: Image (both pages) - Hidden on mobile -->
      <div class="hidden md:block md:w-1/2 h-full">
        <img
          :src="FormPictures"
          alt="Form illustration"
          class="w-full h-140 rounded-2xl brightness-75 object-cover"
        />
      </div>
    </div>
  </section>

  <!-- Guidelines Dialog - Shows on page load -->
  <Dialog
    :open="showGuidelinesDialog"
    @update:open="showGuidelinesDialog = $event"
  >
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle class="text-center flex items-center justify-center gap-2">
          <AlertTriangle class="h-5 w-5 text-primary" />
          Appointment Guidelines
        </DialogTitle>
        <DialogDescription class="text-center">
          Please review these important guidelines before booking your
          appointment
        </DialogDescription>
      </DialogHeader>

      <div class="py-4">
        <div class="space-y-4">
          <div class="flex items-start gap-2">
            <CheckCircle2 class="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p class="text-sm">
              <span class="font-semibold">Age Requirement:</span> You must be 18
              years or older to book an appointment. Minors must be accompanied
              by a parent or guardian.
            </p>
          </div>

          <div class="flex items-start gap-2">
            <CheckCircle2 class="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p class="text-sm">
              <span class="font-semibold">Advance Booking:</span> Appointments
              can only be booked for dates after the current day. Same-day
              appointments are not available online.
            </p>
          </div>

          <div class="flex items-start gap-2">
            <CheckCircle2 class="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p class="text-sm">
              <span class="font-semibold">Required Information:</span> All
              fields in the form must be completed with accurate information for
              successful booking.
            </p>
          </div>

          <div class="flex items-start gap-2">
            <CheckCircle2 class="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p class="text-sm">
              <span class="font-semibold">Email Verification:</span> A valid
              email address is required as you will receive a verification code
              to confirm your appointment.
            </p>
          </div>

          <div class="flex items-start gap-2">
            <CheckCircle2 class="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p class="text-sm">
              <span class="font-semibold">Payment:</span> Payment must be
              completed during the booking process to confirm your appointment.
            </p>
          </div>

          <div class="flex items-start gap-2">
            <CheckCircle2 class="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p class="text-sm">
              <span class="font-semibold">Arrival Time:</span> Please arrive 15
              minutes before your scheduled appointment time with any required
              documents.
            </p>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button @click="acknowledgeGuidelines" variant="default" class="w-full hover:cursor-pointer">
          I Understand
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- Email verification dialog -->
  <Dialog
    :open="showVerificationDialog"
    @update:open="showVerificationDialog = $event"
  >
    <DialogContent class="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="text-center flex items-center justify-center gap-2">
          <Mail v-if="!verificationSuccess" class="h-6 w-6 text-primary" />
          <CreditCard
            v-else-if="verificationSuccess && !paymentCompleted"
            class="h-6 w-6 text-primary"
          />
          <CheckCircle v-else class="h-6 w-6 text-green-500" />
          {{
            !verificationSuccess
              ? "Email Verification Required"
              : !paymentCompleted
                ? "Complete Payment"
                : "Appointment Confirmed"
          }}
        </DialogTitle>
        <DialogDescription class="text-center">
          <span v-if="!verificationSuccess">
            We've sent a verification code to
            <span class="font-semibold">{{ formData.email }}</span
            >.<br />
            Please enter the code below to verify your email.
          </span>
          <span v-else-if="!paymentCompleted">
            Please complete your payment to confirm your appointment.
          </span>
          <span v-else>
            Your appointment has been confirmed. You'll receive a confirmation
            email shortly.
          </span>
        </DialogDescription>
      </DialogHeader>

      <div v-if="!verificationSuccess" class="grid gap-4 py-4">
        <div class="flex items-center space-x-2">
          <Lock class="h-4 w-4 opacity-50" />
          <Input
            v-model="otpValue"
            type="text"
            placeholder="Enter verification code"
            class="text-center text-lg tracking-widest"
            :maxlength="6"
          />
        </div>

        <p
          v-if="verificationError"
          class="text-destructive text-sm text-center"
        >
          {{ verificationError }}
        </p>

        <div class="flex items-center justify-center space-x-2 mt-2 mb-2">
          <Checkbox id="privacy-policy" v-model="privacyPolicyAgreed" />
          <label for="privacy-policy" class="text-sm leading-none">
            I agree to the
            <a href="#" class="text-primary hover:underline"
              >privacy policy and terms of service</a
            >
          </label>
        </div>

        <Button
          @click="verifyOTP"
          class="w-full cursor:hover-pointer"
          variant="default"
          :disabled="isVerifying || !otpValue || !privacyPolicyAgreed"
        >
          <span v-if="isVerifying" class="flex items-center">
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Verifying...
          </span>
          <span v-else>Verify Code</span>
        </Button>

        <div class="text-center text-sm">
          <button @click="resendOTP" class="text-primary hover:underline">
            Didn't receive the code? Resend
          </button>
        </div>
      </div>

      <div v-else-if="!paymentCompleted" class="grid gap-4 py-4">
        <div class="border-2 border-primary rounded-lg p-6 bg-primary/5">
          <h4
            class="text-xl font-semibold mb-4 flex items-center gap-2 text-primary"
          >
            <CreditCard class="h-5 w-5" />
            Payment Required
          </h4>

          <div class="grid grid-cols-2 gap-3 text-sm mb-6">
            <div class="font-medium text-muted-foreground">Service:</div>
            <div class="font-medium">{{ formData.selectedService }}</div>

            <div class="font-medium text-muted-foreground">Procedure:</div>
            <div class="font-medium">{{ formData.selectedProcedure }}</div>

            <div class="font-medium text-muted-foreground">Date:</div>
            <div class="font-medium">{{ formData.selectedDate }}</div>

            <div class="font-medium text-muted-foreground">Time:</div>
            <div class="font-medium">{{ formData.selectedTime }}</div>

            <div
              class="font-medium text-muted-foreground border-t border-border pt-2 mt-2"
            >
              Total Amount:
            </div>
            <div
              class="font-bold text-lg border-t border-border pt-2 mt-2 text-primary"
            >
              ₱
              {{
                price.toLocaleString(undefined, { minimumFractionDigits: 2 })
              }}
            </div>
          </div>

          <Button
            @click="goToPayment"
            variant="default"
            class="w-full text-base py-6 hover:cursor-pointer"
          >
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
            <div class="font-medium col-span-2">
              {{ formData.selectedService }}
            </div>

            <div class="font-medium text-muted-foreground">Procedure:</div>
            <div class="font-medium col-span-2">
              {{ formData.selectedProcedure }}
            </div>

            <div class="font-medium text-muted-foreground">Date:</div>
            <div class="font-medium col-span-2">
              {{ formData.selectedDate }}
            </div>

            <div class="font-medium text-muted-foreground">Time:</div>
            <div class="font-medium col-span-2">
              {{ formData.selectedTime }}
            </div>

            <div class="font-medium text-muted-foreground">Price:</div>
            <div class="font-medium col-span-2">
              ₱
              {{
                price.toLocaleString(undefined, { minimumFractionDigits: 2 })
              }}
            </div>

            <!-- Personal information -->
            <div
              class="col-span-3 border-t border-border my-2 pt-2 font-semibold"
            >
              Personal Information
            </div>

            <div class="font-medium text-muted-foreground">Name:</div>
            <div class="font-medium col-span-2">
              {{ formData.firstName }} {{ formData.lastName }}
            </div>

            <div class="font-medium text-muted-foreground">Email:</div>
            <div class="font-medium col-span-2">{{ formData.email }}</div>

            <div class="font-medium text-muted-foreground">Contact:</div>
            <div class="font-medium col-span-2">
              {{ formData.contactNumber }}
            </div>

            <div class="font-medium text-muted-foreground">Sex:</div>
            <div class="font-medium col-span-2">{{ formData.sex }}</div>

            <div class="font-medium text-muted-foreground">Age:</div>
            <div class="font-medium col-span-2">{{ formData.age }}</div>

            <div class="font-medium text-muted-foreground">Date of Birth:</div>
            <div class="font-medium col-span-2">{{ formData.dateOfBirth }}</div>

            <div class="font-medium text-muted-foreground">Address:</div>
            <div class="font-medium col-span-2">{{ formData.address }}</div>

            <div class="font-medium text-muted-foreground">Reason:</div>
            <div class="font-medium col-span-2">
              {{ formData.reason || "Not specified" }}
            </div>
          </div>
        </div>
      </div>

      <DialogFooter class="sm:justify-center">
        <Button
          v-if="paymentCompleted"
          @click="
            closeVerificationDialog();
            $router.push('/home');
          "
          class="w-full sm:w-auto"
        >
          Go Back Home
        </Button>
        <Button
          v-if="!verificationSuccess"
          @click="closeVerificationDialog"
          variant="outline"
          class="w-full sm:w-auto"
        >
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PinInput, PinInputGroup } from "@/components/ui/pin-input";
import {
  ChevronDown,
  Mail,
  Lock,
  CheckCircle,
  CreditCard,
  CalendarIcon,
  AlertTriangle,
  CheckCircle2,
} from "lucide-vue-next";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import FormPictures from "@/assets/Form-Background.webp";
import { medicalServices } from "@/data/medicalServices";
// Import only the time slots structure from medicalServices
import { timeSlots as defaultTimeSlots } from "@/data/medicalServices";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Form Data Setup
const formData = ref({
  // Page 1 Data
  selectedService: "",
  selectedProcedure: "",
  price: 0,
  selectedTime: "",
  selectedDate: "",

  // Page 2 Data
  firstName: "",
  lastName: "",
  contactNumber: "",
  email: "",
  sex: "",
  dateOfBirth: "",
  reason: "",
  age: "",
  address: "",
});

// Add isSubmitting and submissionError states
const isSubmitting = ref(false);
const submissionError = ref("");

// Date Picker
const today = new Date();
today.setDate(today.getDate() + 1); // Sets minDate to tomorrow
const minDate = today.toISOString().split("T")[0];

// Add maxDate to prevent future dates
const maxDate = new Date().toISOString().split('T')[0];

// Services Data
const dropdownItems = medicalServices;

const price = ref(0);
const isNextClicked = ref(false);
const currentPage = ref(1);

// Guidelines Dialog State
const showGuidelinesDialog = ref(true);

// Dialog and OTP state
const showVerificationDialog = ref(false);
const otpValue = ref("");
const isVerifying = ref(false);
const verificationError = ref("");
const verificationSuccess = ref(false);
const appointmentId = ref(null);
const paymentUrl = ref("");
const paymentCompleted = ref(false);
const privacyPolicyAgreed = ref(false);

// Time slot data from the backend
const timeSlots = ref(defaultTimeSlots);
const timeSlotAvailability = ref({});
const isLoadingTimeSlots = ref(false);
const timeSlotError = ref("");

// Replace the single isNextClicked with two page-specific flags
const isPage1Validated = ref(false);
const isPage2Validated = ref(false);

const availableProcedures = computed(() => {
  const selectedService = formData.value.selectedService;
  const service = dropdownItems.find(
    (service) => service.title === selectedService
  );
  return service ? service.procedures : [];
});

const selectService = (service) => {
  formData.value.selectedService = service.title;
  formData.value.selectedProcedure = ""; // Reset procedure when service changes
};

function setProcedurePrice(procedure: { name: string; price: number }) {
  formData.value.selectedProcedure = procedure.name;
  price.value = procedure.price;
}

// Pagination Functions
function handlePreviousClick() {
  currentPage.value = 1;
}

// Add validation for Philippine mobile number format
const isValidContactNumber = ref(true);

function validateContactNumber() {
  // Validate Philippine mobile numbers (format: 09XXXXXXXXX, 11 digits)
  const mobileRegex = /^09\d{9}$/;
  isValidContactNumber.value = mobileRegex.test(formData.value.contactNumber);
}

// Update handleNextClick to use the page-specific flags
async function handleNextClick() {
  if (currentPage.value === 1) {
    isPage1Validated.value = true;
    
    // Run page 1 validations
    if (
      formData.value.selectedService &&
      formData.value.selectedProcedure &&
      formData.value.selectedTime &&
      formData.value.selectedDate &&
      !isInvalidDate.value
    ) {
      currentPage.value = 2;
      // Important: Don't validate page 2 yet
    } else {
      // Scroll to the first error message on page 1
      setTimeout(() => {
        const errorMessage = document.querySelector('.text-destructive');
        if (errorMessage) {
          errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
    return;
  }

  if (currentPage.value === 2) {
    isPage2Validated.value = true;
    
    // Run all validations for page 2
    validateEmail();
    if (formData.value.contactNumber) {
      validateContactNumber();
    }
    
    // Check if all required fields are filled and properly validated
    const isValid = 
      formData.value.firstName &&
      formData.value.lastName &&
      formData.value.contactNumber &&
      isValidContactNumber.value &&
      formData.value.email &&
      isValidEmail.value &&
      formData.value.sex &&
      formData.value.dateOfBirth &&
      formData.value.age &&
      Number(formData.value.age) <= 99 && // Allow minors, only block ages above 99
      formData.value.address;
    
    if (isValid) {
      // Proceed with submission
      try {
        isSubmitting.value = true;
        submissionError.value = "";
        
        // Send the appointment data with correct field names
        const serviceId = getServiceId(formData.value.selectedService);
        const procedureId = getProcedureId(formData.value.selectedProcedure);

        console.log(`Found procedure ID for '${formData.value.selectedProcedure}': ${procedureId}`);
        console.log(`Found service ID for '${formData.value.selectedService}': ${serviceId}`);

        const response = await axios.post('/api/appointment/submit-appointment', {
          // Basic info fields
          first_name: formData.value.firstName,
          last_name: formData.value.lastName,
          sex: formData.value.sex,
          age: formData.value.age,
          email: formData.value.email,
          date_of_birth: formData.value.dateOfBirth,
          contact_no: formData.value.contactNumber,
          address: formData.value.address,
          reason: formData.value.reason || "",
          
          // Include both IDs and display names
          service_id: serviceId,       // Add service ID for database
          procedure_id: procedureId,   // Add procedure ID for database
          service_name: formData.value.selectedService,    // Keep for display
          procedure_name: formData.value.selectedProcedure, // Keep for display
          appointment_date: formData.value.selectedDate,
          appointment_time: formData.value.selectedTime.split(' - ')[0].trim()
        });
        
        if (response.data.success) {
          // Store appointment ID for verification
          appointmentId.value = response.data.appointmentId;
          
          // Show verification dialog for email verification
          showVerificationDialog.value = true;
        } else {
          submissionError.value = response.data.message || "Failed to create appointment";
        }
      } catch (error) {
        console.error("Error submitting appointment:", error);
        submissionError.value = error.response?.data?.message || "An error occurred while creating your appointment";
      } finally {
        isSubmitting.value = false; // Important: Always reset submitting state
      }
    } else {
      // Scroll to the first error message
      setTimeout(() => {
        const errorMessage = document.querySelector('.text-destructive');
        if (errorMessage) {
          errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }
}

// Function to fetch time slot availability from the backend
async function fetchTimeSlotAvailability() {
  isLoadingTimeSlots.value = true;
  timeSlotError.value = "";
  
  try {
    // Calculate a 30-day range for availability data
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Start from tomorrow
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30); // End after 30 days
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    const response = await axios.get(`/api/appointment/status`, {
      params: {
        startDate: startDateStr,
        endDate: endDateStr
      }
    });
    
    if (response.data.success) {
      // Update time slots and availability from the backend response
      if (response.data.data.timeSlots) {
        timeSlots.value = response.data.data.timeSlots;
      }
      
      if (response.data.data.timeSlotAvailability) {
        timeSlotAvailability.value = response.data.data.timeSlotAvailability;
      }
    } else {
      timeSlotError.value = response.data.message || "Failed to fetch time slot availability";
      // Fall back to default time slots if there's an error
      timeSlots.value = defaultTimeSlots;
    }
  } catch (error) {
    console.error("Error fetching time slot availability:", error);
    timeSlotError.value = "Failed to connect to the server. Using default availability data.";
    // Fall back to default time slots if there's an error
    timeSlots.value = defaultTimeSlots;
  } finally {
    isLoadingTimeSlots.value = false;
  }
}

// Watch for date changes to update the UI
function handleDateChange() {
  // If the selectedDate changes, we might need to update something in the UI
  // But since we already have availability data for a date range, we don't need to fetch again
  // Check if the selected date is today or earlier
  const selectedDate = new Date(formData.value.selectedDate);
  const today = new Date();
  
  // Reset hours, minutes, seconds to make date comparison work correctly
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Check if selected date is today or in the past
  if (selectedDate <= today) {
    isInvalidDate.value = true;
    // Reset the date to avoid proceeding with an invalid date
    formData.value.selectedDate = "";
  } else {
    isInvalidDate.value = false;
  }
}

function parseStartTime(timeRange) {
  if (!timeRange) return null;

  return timeRange.split(" - ")[0];
}

function to24HourFormat(time12h) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = parseInt(hours, 10) + 12;
  } else if (modifier === "AM" && hours === "12") {
    hours = "00";
  }

  return `${hours}:${minutes}`;
}

// Function to get procedure ID from the procedure name
function getProcedureId(procedureName) {
  // Find the procedure ID in dropdown items
  for (const service of dropdownItems) {
    for (const procedure of service.procedures) {
      if (procedure.name === procedureName) {
        return procedure.id;
      }
    }
  }
  return null; // Default if not found
}

// Function to get service ID from the service name
function getServiceId(serviceName) {
  // Find the service ID in dropdown items
  const service = dropdownItems.find(s => s.title === serviceName);
  if (service) {
    console.log(`Found service ID for '${serviceName}': ${service.id}`);
    return service.id;
  }
  console.error("Service ID not found for:", serviceName);
  return null; // Default if not found
}

// Function to verify OTP
async function verifyOTP() {
  if (!otpValue.value || otpValue.value.length < 4) {
    verificationError.value = "Please enter a valid verification code";
    return;
  }

  isVerifying.value = true;
  verificationError.value = "";

  try {
    // Call your backend to verify OTP
    const response = await axios.post("/api/email/verify-email-code", {
      appointmentId: appointmentId.value,
      code: otpValue.value,
    });

    if (response.data.success) {
      // OTP verified successfully
      verificationSuccess.value = true;
      // If there's a payment URL, store it
      if (response.data.checkoutUrl) {
        paymentUrl.value = response.data.checkoutUrl;
      }
      isVerifying.value = false;
    } else {
      // Invalid OTP
      verificationError.value =
        response.data.message || "Invalid verification code. Please try again.";
      isVerifying.value = false;
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    verificationError.value =
      error.response?.data?.message || "An error occurred during verification";
    isVerifying.value = false;
  }
}

// Function to close the dialog and reset form if needed
function closeVerificationDialog() {
  showVerificationDialog.value = false;
  // If verification was successful, reset the form
  if (verificationSuccess.value && !paymentUrl.value) {
    resetForm();
  }
}

// Function to reset form
function resetForm() {
  formData.value = {
    selectedService: "",
    selectedProcedure: "",
    price: 0,
    selectedTime: "",
    selectedDate: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    sex: "",
    dateOfBirth: "",
    reason: "",
    age: "",
    address: "",
  };
  currentPage.value = 1;
  isNextClicked.value = false;
  price.value = 0;
  paymentCompleted.value = false;
  privacyPolicyAgreed.value = false;
}

// Function to resend OTP if needed
async function resendOTP() {
  try {
    const response = await axios.post("/api/email/resend-verification-code", {
      email: formData.value.email,
    });

    if (response.data.success) {
      verificationError.value = "New verification code sent to your email";
    } else {
      verificationError.value =
        response.data.message || "Failed to resend code";
    }
  } catch (error) {
    console.error("Error resending OTP:", error);
    verificationError.value =
      error.response?.data?.message || "Failed to resend verification code";
  }
}

function goToPayment() {
  if (paymentUrl.value) {
    // Open payment URL in a new tab
    window.open(paymentUrl.value, "_blank");

    setTimeout(() => {
      paymentCompleted.value = true;
    }, 2000);
  } else {
    // If no payment URL is available, show an error or fallback
    console.error("Payment URL not available");
  }
}

// Update the isNextDisabled computed property for page 2 to include all validations
const isNextDisabled = computed(() => {
  if (currentPage.value === 1) {
    return (
      !formData.value.selectedService ||
      !formData.value.selectedProcedure ||
      !formData.value.selectedTime ||
      !formData.value.selectedDate ||
      isInvalidDate.value
    );
  } else if (currentPage.value === 2) {
    return (
      !formData.value.firstName ||
      !formData.value.lastName ||
      !formData.value.contactNumber ||
      !isValidContactNumber.value ||
      !formData.value.email ||
      !isValidEmail.value ||
      !formData.value.sex ||
      !formData.value.dateOfBirth ||
      !formData.value.age ||
      Number(formData.value.age) > 99 || // Allow minors, only block ages above 99
      !formData.value.address
    );
  }
  return false;
});

const isValidEmail = ref(true);

function validateEmail() {
  if (!formData.value.email) {
    isValidEmail.value = false;
    return;
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  isValidEmail.value = emailRegex.test(formData.value.email);
}

// Function to acknowledge guidelines
function acknowledgeGuidelines() {
  showGuidelinesDialog.value = false;
}

// Lifecycle hooks
onMounted(() => {
  // Show guidelines dialog on component mount
  showGuidelinesDialog.value = true;
  
  // Fetch time slot availability from the backend
  fetchTimeSlotAvailability();
});

// Check if a time slot is fully booked
const isTimeSlotFull = (slotId) => {
  if (!formData.value.selectedDate) return false;
  
  const dateAvailability = timeSlotAvailability.value[formData.value.selectedDate];
  if (!dateAvailability) return false; // Date not in our availability data
  
  // Check if booked count equals or exceeds max capacity
  const bookedCount = dateAvailability[slotId] || 0;
  const slot = timeSlots.value.find(s => s.id === slotId);
  return bookedCount >= slot.maxCapacity;
};

// Get the number of available slots for a time slot
const getAvailableSlots = (slotId) => {
  if (!formData.value.selectedDate) return timeSlots.value.find(s => s.id === slotId).maxCapacity;
  
  const dateAvailability = timeSlotAvailability.value[formData.value.selectedDate];
  if (!dateAvailability) return timeSlots.value.find(s => s.id === slotId).maxCapacity; // No bookings for this date
  
  const bookedCount = dateAvailability[slotId] || 0;
  const slot = timeSlots.value.find(s => s.id === slotId);
  
  return Math.max(0, slot.maxCapacity - bookedCount);
};

// Add this to your ref declarations
const isInvalidDate = ref(false);

// Function to calculate age from date of birth
function calculateAge() {
  if (!formData.value.dateOfBirth) {
    formData.value.age = "";
    return;
  }
  
  const birthDate = new Date(formData.value.dateOfBirth);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  // Adjust age if birthday hasn't occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Update the age field
  formData.value.age = age.toString();
}
</script>
