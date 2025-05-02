<script setup>
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarIcon, FileTextIcon, UserIcon, SearchIcon } from 'lucide-vue-next';
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
const loading = ref(true);
const error = ref(null);

// Backend URL from environment variable
const API_URL = import.meta.env.VITE_BACKEND_URL || '';

// Fetch today's schedule from backend
const fetchTodaySchedule = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await axios.get(`${API_URL}/api/admin/today-schedule`);
    
    if (response.data.success) {
      todaySchedule.value = response.data.todaySchedule.map(appointment => ({
        id: appointment.id,
        time: `${appointment.appointment_time}`,
        name: `${appointment.basic_info?.first_name || ''} ${appointment.basic_info?.last_name || ''}`,
        service: appointment.procedure?.name || 'N/A',
        status: formatStatus(appointment.status),
        statusColor: getStatusColor(appointment.status),
        rawStatus: appointment.status
      }));
      statusCounts.value = response.data.statusCounts;
    } else {
      error.value = 'Failed to fetch today\'s schedule';
    }
  } catch (err) {
    console.error('Error fetching today\'s schedule:', err);
    error.value = err.message || 'An error occurred while fetching today\'s schedule';
  } finally {
    loading.value = false;
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

// Fetch data on component mount
onMounted(() => {
  fetchTodaySchedule();
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
</script>

<template>
  <div>
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader class="pb-2 flex items-center gap-4">
          <CalendarIcon class="w-8 h-8 text-primary" />
          <CardTitle class="text-lg font-medium">Today's Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-2xl font-bold">{{ statusCounts.total }} appointments</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2 flex items-center gap-4">
          <FileTextIcon class="w-8 h-8 text-primary" />
          <CardTitle class="text-lg font-medium">Total Medical Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-2xl font-bold">7,213 patients</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2 flex items-center gap-4">
          <UserIcon class="w-8 h-8 text-primary" />
          <CardTitle class="text-lg font-medium">Appointments Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm">Total Appointments: <span class="font-bold">{{ statusCounts.total }}</span></p>
          <p class="text-sm">Completed: <span class="font-bold">{{ statusCounts.complete }}</span></p>
          <p class="text-sm">Pending: <span class="font-bold">{{ statusCounts.pending }}</span></p>
          <p class="text-sm">Cancelled: <span class="font-bold">{{ statusCounts.cancelled }}</span></p>
          <p class="text-sm">Checked In: <span class="font-bold">{{ statusCounts.checkedIn }}</span></p>
          <p class="text-sm">In Consultation: <span class="font-bold">{{ statusCounts.inConsultation }}</span></p>
        </CardContent>
      </Card>
    </section>
    
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CalendarCard />
      
      <Card class="w-full">
        <CardHeader>
          <CardTitle>Incoming Patients</CardTitle>
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
          
          <div v-if="loading" class="py-8 text-center">
            <p>Loading today's schedule...</p>
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
          
          <Table v-else>
            <TableCaption>
              <span v-if="filteredRowsCount < totalRowsCount">
                Showing {{ filteredRowsCount }} of {{ totalRowsCount }} patients
              </span>
              <span v-else-if="totalRowsCount === 0">
                No appointments scheduled for today.
              </span>
              <span v-else>
                List of today's scheduled patient appointments.
              </span>
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead v-for="header in table.getHeaderGroups()[0].headers" :key="header.id">
                  {{ header.column.columnDef.header }}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <template v-if="cell.column.id === 'status'">
                    <span :class="`inline-block px-2 py-1 text-xs rounded-full ${getStatusClasses(row.original.statusColor)}`">
                      {{ row.original.status }}
                    </span>
                  </template>
                  <template v-else>
                    {{ cell.getValue() }}
                  </template>
                </TableCell>
              </TableRow>
              <TableRow v-if="table.getRowModel().rows.length === 0">
                <TableCell :colSpan="columns.length" class="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  </div>
</template>

