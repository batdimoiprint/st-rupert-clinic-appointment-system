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
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
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
  background-color: #FFA500 !important; /* Orange */
  border-color: #FF8C00 !important;
}

:deep(.status-checked-in) {
  background-color: #1E90FF !important; /* Blue */
  border-color: #0000CD !important;
}

:deep(.status-in_consultation) {
  background-color: #9370DB !important; /* Purple */
  border-color: #8A2BE2 !important;
}

:deep(.status-complete) {
  background-color: #32CD32 !important; /* Green */
  border-color: #228B22 !important;
}

:deep(.fc-event) {
  cursor: pointer;
  border-radius: 4px;
  padding: 2px 4px;
}

:deep(.fc-daygrid-event) {
  white-space: normal !important;
  align-items: center;
}
</style>