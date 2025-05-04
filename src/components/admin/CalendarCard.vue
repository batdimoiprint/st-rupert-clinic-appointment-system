<script setup>
import { ref, onMounted, computed } from 'vue';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';

// State for calendar events
const events = ref([]);
const isLoading = ref(false);
const error = ref(null);
const initialFetchDone = ref(false);

// Function to fetch calendar events from the backend
const fetchEvents = async () => {
  // Skip if already loading
  if (isLoading.value) return;
  
  isLoading.value = true;
  error.value = null;
  
  try {
    // Make a single fetch for all events without date parameters
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/calendar`);
    if (response.data.success) {
      console.log("Calendar data loaded:", response.data.events.length, "events");
      events.value = response.data.events;
      initialFetchDone.value = true;
    } else {
      error.value = response.data.message || 'Failed to load events response data';
    }
  } catch (err) {
    console.error('Error fetching calendar events:', err);
    error.value = err.message || 'Failed to load events';
  } finally {
    isLoading.value = false;
  }
};

// Event handler for clicking on an event
const handleEventClick = (info) => {
  // Navigate to appointment details or open a modal
  const appointmentId = info.event.id;
  console.log('Appointment clicked:', appointmentId);
  
  // You can add navigation or modal opening logic here
  // Example: router.push(`/admin/appointments/${appointmentId}`);
};

// Use computed property for calendar options to ensure reactivity
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  allDaySlot: false,         // remove the all-day slot
  slotMinTime: '08:00:00',   // start at 8 AM
  slotMaxTime: '17:00:00',   // end at 5 PM
  scrollTime: '08:00:00',    // initial scroll position
  selectable: true,
  dateClick: info => console.log('Date clicked:', info.dateStr),
  // Properly pass events as computed property
  events: events.value,
  eventClick: handleEventClick,
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    meridiem: true,
    hour12: true
  },
  eventClassNames: function(arg) {
    return [`status-${arg.event.extendedProps.status}`];
  }
}));

// Load events when component mounts
onMounted(() => {
  // Initial data load - only once
  fetchEvents();
});
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Appointments Calendar</CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="isLoading && !initialFetchDone" class="flex justify-center items-center h-96">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
      <div v-else-if="error" class="flex justify-center items-center h-96 text-red-500">
        {{ error }}
      </div>
      <div v-else>
        <FullCalendar :options="calendarOptions" />
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
/* Status-based styling for events */
:deep(.status-pending) {
  background-color: var(--accent) !important; /* Yellow from Tailwind theme */
  border-color: var(--accent-foreground) !important;
}

:deep(.status-checked-in) {
  background-color: var(--primary) !important; /* Blue from Tailwind theme */
  border-color: var(--accent-blue) !important;
}

:deep(.status-in_consultation) {
  background-color: var(--accent-blue) !important; /* Dark blue from Tailwind theme */
  border-color: var(--primary) !important;
}

:deep(.status-complete) {
  background-color: #32CD32 !important; /* Keep green for completion */
  border-color: #228B22 !important;
}

:deep(.status-cancelled) {
  background-color: var(--destructive) !important; /* Red from Tailwind theme */
  border-color: var(--destructive-foreground) !important;
}

:deep(.fc-event) {
  cursor: pointer;
  border-radius: var(--radius-md);
  padding: 2px 4px;
}

:deep(.fc-daygrid-event) {
  white-space: normal !important;
  align-items: center;
}

/* In month view, hide event title and only show event time */
:deep(.fc-dayGridMonth-view .fc-event-title) {
  display: none !important;
}
:deep(.fc-dayGridMonth-view .fc-event-time) {
  display: inline !important;
}
</style>