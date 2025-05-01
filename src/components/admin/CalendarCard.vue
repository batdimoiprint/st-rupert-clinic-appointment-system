<script setup>
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

// FullCalendar configuration options
const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  selectable: true,
  dateClick: info => console.log('Date clicked:', info.dateStr),
  events: [
    { title: 'Appointment', date: '2025-05-10' },
    { title: 'Visit', date: '2025-05-15' }
  ]
};
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Calendar</CardTitle>
    </CardHeader>
    <CardContent>
      <FullCalendar :options="calendarOptions" />
    </CardContent>
  </Card>
</template>