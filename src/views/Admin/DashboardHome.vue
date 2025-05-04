<script setup>
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  CalendarIcon, 
  FileTextIcon, 
  UserIcon, 
  SearchIcon, 
  ClockIcon, 
  CheckIcon, 
  ClipboardListIcon, 
  XIcon, 
  UserCheckIcon, 
  StethoscopeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon
} from 'lucide-vue-next';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import {
  createColumnHelper,
  getCoreRowModel,
  useVueTable,
  getFilteredRowModel,
} from '@tanstack/vue-table';
import CalendarCard from '@/components/admin/CalendarCard.vue';

// State for today's schedule data
const todaySchedule = ref([]);
const statusCounts = ref({
  total: 0,
  pending: 0,
  complete: 0,
  cancelled: 0,
  checkedIn: 0,
  inConsultation: 0
});
const totalAppointments = ref(0);
const tomorrowAppointmentsCount = ref(0);
const loading = ref(true);
const error = ref(null);
const mostCommonProcedure = ref({ name: 'Loading...', count: 0 });

// Date selection state
const selectedDate = ref(new Date().toISOString().split('T')[0]); // Default to today in YYYY-MM-DD format
const selectedDateDisplay = computed(() => {
  const date = new Date(selectedDate.value);
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

// Functions to navigate between dates
const goToPreviousDay = () => {
  const date = new Date(selectedDate.value);
  date.setDate(date.getDate() - 1);
  selectedDate.value = date.toISOString().split('T')[0];
};

const goToNextDay = () => {
  const date = new Date(selectedDate.value);
  date.setDate(date.getDate() + 1);
  selectedDate.value = date.toISOString().split('T')[0];
};

const goToToday = () => {
  selectedDate.value = new Date().toISOString().split('T')[0];
};

// State for appointment insights
const appointmentInsights = ref({
  completionRate: 0,
  completionToUncompletedRatio: 0,
  statsDetail: {
    total: 0,
    completed: 0,
    cancelled: 0,
    pending: 0,
    uncompleted: 0
  }
});

// Backend URL from environment variable
const API_URL = import.meta.env.VITE_BACKEND_URL || '';

// Fetch schedule data based on selected date
const fetchScheduleByDate = async (date) => {
  try {
    loading.value = true;
    error.value = null;
    
    // Determine which endpoint to use based on whether the date is today, tomorrow, or another date
    let endpoint;
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
    
    if (date === today) {
      endpoint = `${API_URL}/api/admin/today-schedule`;
    } else if (date === tomorrow) {
      endpoint = `${API_URL}/api/admin/tomorrow-schedule`;
    } else {
      endpoint = `${API_URL}/api/admin/date-schedule/${date}`;
    }
    
    const response = await axios.get(endpoint);
    
    if (response.data.success) {
      // Process the response data based on the endpoint used
      let appointments;
      
      if (date === today) {
        appointments = response.data.todaySchedule;
        statusCounts.value = response.data.statusCounts;
      } else if (date === tomorrow) {
        appointments = response.data.tomorrowSchedule;
        statusCounts.value = response.data.statusCounts;
      } else {
        appointments = response.data.dateSchedule;
        statusCounts.value = response.data.statusCounts;
      }
      
      // Format appointments for display
      todaySchedule.value = appointments.map(appointment => ({
        id: appointment.id,
        time: `${appointment.appointment_time}`,
        name: `${appointment.basic_info?.first_name || ''} ${appointment.basic_info?.last_name || ''}`,
        service: appointment.procedure?.name || 'N/A',
        status: formatStatus(appointment.status),
        statusColor: getStatusColor(appointment.status),
        rawStatus: appointment.status
      }));
    } else {
      error.value = `Failed to fetch schedule for ${selectedDateDisplay.value}`;
    }
  } catch (err) {
    console.error(`Error fetching schedule for ${date}:`, err);
    error.value = err.message || `An error occurred while fetching the schedule for ${selectedDateDisplay.value}`;
  } finally {
    loading.value = false;
  }
};

// Fetch total appointments count
const fetchTotalAppointments = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/total-appointments`);
    if (response.data.success) {
      totalAppointments.value = response.data.total;
    } else {
      console.error('Failed to fetch total appointments:', response.data.message);
    }
  } catch (err) {
    console.error('Error fetching total appointments:', err);
  }
};

// Fetch tomorrow's appointment count
const fetchTomorrowAppointmentsCount = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/tomorrow-schedule-count`);
    if (response.data.success) {
      tomorrowAppointmentsCount.value = response.data.count;
    } else {
      console.error('Failed to fetch tomorrow\'s appointment count:', response.data.message);
    }
  } catch (err) {
    console.error('Error fetching tomorrow\'s appointment count:', err);
  }
};

// Fetch appointment insights
const fetchAppointmentInsights = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/appointment-insights`);
    if (response.data.success) {
      appointmentInsights.value = response.data.insights;
    } else {
      console.error('Failed to fetch appointment insights:', response.data.message);
    }
  } catch (err) {
    console.error('Error fetching appointment insights:', err);
  }
};

// Fetch most common procedure
const fetchMostCommonProcedure = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/admin/most-common-procedure`);
    if (response.data.success) {
      mostCommonProcedure.value = response.data.procedure;
    } else {
      console.error('Failed to fetch most common procedure:', response.data.message);
    }
  } catch (err) {
    console.error('Error fetching most common procedure:', err);
  }
};

// Format status for display
const formatStatus = (status) => {
  if (!status) return 'Unknown';
  
  switch(status) {
    case 'pending': return 'Pending';
    case 'checked-in': return 'Checked In';
    case 'in_consultation': return 'In Consultation';
    case 'complete': return 'Complete';
    case 'cancelled': return 'Cancelled';
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

// Get status color based on status
const getStatusColor = (status) => {
  if (!status) return 'gray';
  
  switch(status) {
    case 'pending': return 'yellow';
    case 'checked-in': return 'blue';
    case 'in_consultation': return 'blue';
    case 'complete': return 'green';
    case 'cancelled': return 'red';
    default: return 'gray';
  }
};

// Function to get appropriate icon component based on status
const getStatusIcon = (status) => {
  switch(status) {
    case 'pending': return ClockIcon;
    case 'checked-in': return UserCheckIcon;
    case 'in_consultation': return StethoscopeIcon;
    case 'complete': return CheckIcon;
    case 'cancelled': return XIcon;
    default: return ClipboardListIcon;
  }
};

// Watch for changes to the selected date and fetch data accordingly
watch(selectedDate, (newDate) => {
  fetchScheduleByDate(newDate);
});

// Fetch data on component mount
onMounted(() => {
  fetchScheduleByDate(selectedDate.value); // Fetch the selected date's schedule (initially today)
  fetchTotalAppointments();
  fetchTomorrowAppointmentsCount();
  fetchAppointmentInsights();
  fetchMostCommonProcedure();
});

// Global search filter
const globalFilter = ref('');

// Create a column helper
const columnHelper = createColumnHelper();

// Define columns
const columns = [
  columnHelper.accessor('time', {
    header: 'Time',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('service', {
    header: 'Service',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => {
      const row = info.row.original;
      return {
        status: row.status,
        color: row.statusColor
      };
    },
  }),
];

// Create table instance with filtering
const table = useVueTable({
  get data() {
    return todaySchedule.value;
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get globalFilter() {
      return globalFilter.value;
    }
  },
  onGlobalFilterChange: setGlobalFilter,
});

function setGlobalFilter(value) {
  globalFilter.value = value;
}

// Function to get appropriate background and text color classes based on status
const getStatusClasses = (statusColor) => {
  const classes = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800',
    red: 'bg-red-100 text-red-800',
  };
  return classes[statusColor] || classes.gray;
};

// Count of filtered rows
const filteredRowsCount = computed(() => {
  return table.getFilteredRowModel().rows.length;
});

// Count of total rows
const totalRowsCount = computed(() => {
  return todaySchedule.value.length;
});

// Group appointments by time frame (hour)
const appointmentsByTimeFrame = computed(() => {
  const grouped = {};
  
  // Filter appointments if there's a search filter
  const filteredAppointments = globalFilter.value 
    ? table.getFilteredRowModel().rows.map(row => row.original)
    : todaySchedule.value;
    
  // Group appointments by hour
  filteredAppointments.forEach(appointment => {
    // Extract hour from appointment time (assuming format like "09:30 AM")
    const timeParts = appointment.time.split(' ');
    const hourMinute = timeParts[0].split(':');
    const hour = parseInt(hourMinute[0]);
    const ampm = timeParts[1];
    
    // Create a formatted time frame (e.g., "9:00 AM - 10:00 AM")
    let timeFrame;
    if (ampm === 'AM') {
      if (hour === 12) {
        timeFrame = `12:00 AM - 1:00 PM`;
      } else {
        timeFrame = `${hour}:00 AM - ${hour + 1}:00 ${hour + 1 === 12 ? 'PM' : 'AM'}`;
      }
    } else { // PM
      if (hour === 12) {
        timeFrame = `12:00 PM - 1:00 PM`;
      } else {
        timeFrame = `${hour}:00 PM - ${hour + 1 === 12 ? 12 : (hour + 1) % 12}:00 ${hour + 1 >= 12 ? 'AM' : 'PM'}`;
      }
    }
    
    if (!grouped[timeFrame]) {
      grouped[timeFrame] = [];
    }
    
    grouped[timeFrame].push(appointment);
  });
  
  // Sort time frames
  return Object.keys(grouped)
    .sort((a, b) => {
      // Extract first hour from time frame string
      const getHour = (timeFrame) => {
        const parts = timeFrame.split(' ');
        const hourMinute = parts[0].split(':');
        let hour = parseInt(hourMinute[0]);
        const ampm = parts[1];
        
        // Convert to 24-hour format for sorting
        if (ampm === 'PM' && hour !== 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        
        return hour;
      };
      
      return getHour(a) - getHour(b);
    })
    .reduce((acc, key) => {
      acc[key] = grouped[key];
      return acc;
    }, {});
});
</script>

<template>
  <div>
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader class="pb-2 flex items-center gap-4">
          <CalendarIcon class="w-8 h-8 text-primary" />
          <CardTitle class="text-lg font-medium">Today's Schedules</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col">
          <template v-if="loading">
            <Skeleton class="h-8 w-32" />
            <Skeleton class="h-4 w-24 mt-4" />
          </template>
          <template v-else>
            <p class="text-2xl font-bold">{{ statusCounts.total }} appointments</p>
            <div class="mt-4 pt-3 border-t text-sm text-gray-600 flex items-center gap-1">
              <CalendarIcon class="h-3.5 w-3.5" />
              <p>Tomorrow: <span class="font-medium">{{ tomorrowAppointmentsCount }} appointments</span></p>
            </div>
          </template>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2 flex items-center gap-4">
          <FileTextIcon class="w-8 h-8 text-primary" />
          <CardTitle class="text-lg font-medium">Total Appointments</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col">
          <template v-if="loading">
            <Skeleton class="h-8 w-32" />
            <Skeleton class="h-4 w-full mt-4" />
            <Skeleton class="h-4 w-2/3 mt-1" />
          </template>
          <template v-else>
            <p class="text-2xl font-bold">{{ totalAppointments }} records</p>
            <div class="mt-4 pt-3 border-t space-y-2">
              <div class="flex justify-between items-center text-sm">
                <div class="flex items-center gap-1">
                  <CheckIcon class="h-3.5 w-3.5 text-green-600" />
                  <span class="text-gray-600">Completion Rate:</span>
                </div>
                <span class="font-medium">{{ appointmentInsights.completionRate }}%</span>
              </div>
              <div class="flex flex-col gap-1">
                <div class="flex justify-between items-center text-sm">
                  <div class="flex items-center gap-1">
                    <XIcon class="h-3.5 w-3.5 text-red-600" />
                    <span class="text-gray-600">Completed/Uncompleted Ratio:</span>
                  </div>
                  <span class="font-medium">{{ appointmentInsights.completionToUncompletedRatio }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    class="bg-green-600 h-1.5 rounded-full" 
                    :style="`width: ${Math.min((appointmentInsights.statsDetail.completed / (appointmentInsights.statsDetail.completed + appointmentInsights.statsDetail.uncompleted)) * 100, 100)}%`"
                  ></div>
                </div>
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Completed: {{ appointmentInsights.statsDetail?.completed || 0 }}</span>
                  <span>Uncompleted: {{ appointmentInsights.statsDetail?.uncompleted || 0 }}</span>
                </div>
              </div>
            </div>
          </template>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2 flex items-center gap-4">
          <UserIcon class="w-8 h-8 text-primary" />
          <CardTitle class="text-lg font-medium">Appointments Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <template v-if="loading">
            <div class="space-y-2">
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-full" />
            </div>
          </template>
          <template v-else>
            <div class="grid grid-cols-2 gap-3">
              <div class="flex items-center gap-2">
                <CalendarIcon class="w-4 h-4 text-primary" />
                <p class="text-sm">Total: <span class="font-bold">{{ statusCounts.total }}</span></p>
              </div>
              <div class="flex items-center gap-2">
                <CheckIcon class="w-4 h-4 text-green-600" />
                <p class="text-sm">Completed: <span class="font-bold">{{ statusCounts.complete }}</span></p>
              </div>
              <div class="flex items-center gap-2">
                <ClockIcon class="w-4 h-4 text-yellow-600" />
                <p class="text-sm">Pending: <span class="font-bold">{{ statusCounts.pending }}</span></p>
              </div>
              <div class="flex items-center gap-2">
                <XIcon class="w-4 h-4 text-red-600" />
                <p class="text-sm">Cancelled: <span class="font-bold">{{ statusCounts.cancelled }}</span></p>
              </div>
              <div class="flex items-center gap-2">
                <UserCheckIcon class="w-4 h-4 text-blue-600" />
                <p class="text-sm">Checked In: <span class="font-bold">{{ statusCounts.checkedIn }}</span></p>
              </div>
              <div class="flex items-center gap-2">
                <StethoscopeIcon class="w-4 h-4 text-purple-600" />
                <p class="text-sm">In Consultation: <span class="font-bold">{{ statusCounts.inConsultation }}</span></p>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t text-sm text-gray-600">
              <p class="font-medium">Most Common Procedure:</p>
              <p v-if="mostCommonProcedure.count > 0" class="text-lg font-bold">
                {{ mostCommonProcedure.name }} ({{ mostCommonProcedure.count }} times)
              </p>
              <p v-else class="text-gray-500">No procedure data available</p>
            </div>
          </template>
        </CardContent>
      </Card>
    </section>
    
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CalendarCard />
      
      <Card class="w-full">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-lg font-medium">
            {{ selectedDateDisplay }} Appointments
          </CardTitle>
          <div class="flex gap-2">
            <button 
              @click="goToPreviousDay" 
              class="p-1 rounded-md hover:bg-gray-100 transition-colors"
              title="Previous Day"
            >
              <ChevronLeftIcon class="h-5 w-5" />
            </button>
            <button 
              @click="goToToday" 
              class="p-1 rounded-md hover:bg-gray-100 transition-colors"
              title="Today"
            >
              <CalendarDaysIcon class="h-5 w-5" />
            </button>
            <button 
              @click="goToNextDay" 
              class="p-1 rounded-md hover:bg-gray-100 transition-colors"
              title="Next Day"
            >
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="flex items-center py-4">
            <div class="relative w-full max-w-sm">
              <SearchIcon class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                v-model="globalFilter"
                class="pl-8"
              />
            </div>
          </div>
          
          <div v-if="loading" class="py-8">
            <div class="flex flex-col space-y-2">
              <Skeleton v-for="i in 5" :key="i" class="h-6 w-full" />
            </div>
          </div>
           
          <div v-else-if="error" class="py-8 text-center text-red-500">
            <p>{{ error }}</p>
            <button 
              @click="fetchTodaySchedule" 
              class="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
            >
              Retry
            </button>
          </div>
          
          <!-- When no appointments are found -->
          <div v-else-if="Object.keys(appointmentsByTimeFrame).length === 0" class="py-8 text-center text-gray-500">
            <p>No appointments scheduled for today.</p>
          </div>
          
          <!-- Appointments grouped by time frame with ScrollArea -->
          <div v-else>
            <ScrollArea className="h-[500px] pr-4">
              <div class="space-y-8 p-1">
                <div v-for="(appointments, timeFrame) in appointmentsByTimeFrame" :key="timeFrame" class="border rounded-lg p-4 shadow-sm">
                  <h3 class="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                    <ClockIcon class="h-5 w-5 text-primary" />
                    {{ timeFrame }}
                  </h3>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead class="w-[100px]">
                          <span class="flex items-center gap-1">
                            <ClockIcon class="h-3 w-3" />
                            Time
                          </span>
                        </TableHead>
                        <TableHead>
                          <span class="flex items-center gap-1">
                            <UserIcon class="h-3 w-3" />
                            Name
                          </span>
                        </TableHead>
                        <TableHead>
                          <span class="flex items-center gap-1">
                            <StethoscopeIcon class="h-3 w-3" />
                            Service
                          </span>
                        </TableHead>
                        <TableHead>
                          <span class="flex items-center gap-1">
                            <ClipboardListIcon class="h-3 w-3" />
                            Status
                          </span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow v-for="appointment in appointments" :key="appointment.id">
                        <TableCell>{{ appointment.time }}</TableCell>
                        <TableCell>{{ appointment.name }}</TableCell>
                        <TableCell>{{ appointment.service }}</TableCell>
                        <TableCell>
                          <span :class="`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusClasses(appointment.statusColor)}`">
                            <component
                              :is="getStatusIcon(appointment.rawStatus)"
                              class="h-3 w-3"
                            />
                            {{ appointment.status }}
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>

