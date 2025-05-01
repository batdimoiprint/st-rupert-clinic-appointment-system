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
import {
  createColumnHelper,
  getCoreRowModel,
  useVueTable,
  getFilteredRowModel,
} from '@tanstack/vue-table';
import CalendarCard from '@/components/admin/CalendarCard.vue';

// Define the data structure for appointments
const appointments = ref([
  {
    id: 1,
    time: '8:00 AM - 9:00 AM',
    name: 'Agapito Dimatibag',
    service: 'Hematology',
    status: 'Complete',
    statusColor: 'green',
  },
  {
    id: 2,
    time: '9:30 AM - 10:30 AM',
    name: 'Juan Dela Cruz',
    service: 'X-ray',
    status: 'Ongoing',
    statusColor: 'blue',
  },
  {
    id: 3,
    time: '11:00 AM - 12:00 PM',
    name: 'Maria Santos',
    service: 'Consultation',
    status: 'Pending',
    statusColor: 'yellow',
  },
  {
    id: 4,
    time: '1:00 PM - 2:00 PM',
    name: 'Pedro Penduko',
    service: 'Ultrasound',
    status: 'Pending',
    statusColor: 'yellow',
  },
  {
    id: 5,
    time: '2:30 PM - 3:30 PM',
    name: 'Lucia Reyes',
    service: 'Blood Test',
    status: 'Scheduled',
    statusColor: 'gray',
  }
]);

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
    return appointments.value;
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

// Function to check if a row matches the filter
function fuzzyFilter(row, columnId, value, addMeta) {
  const itemValue = row.getValue(columnId);
  return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
}

// Function to get appropriate background and text color classes based on status
const getStatusClasses = (statusColor) => {
  const classes = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  return classes[statusColor] || classes.gray;
};

// Count of filtered rows
const filteredRowsCount = computed(() => {
  return table.getFilteredRowModel().rows.length;
});

// Count of total rows
const totalRowsCount = computed(() => {
  return appointments.value.length;
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
          <p class="text-2xl font-bold">21 appointments</p>
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
          <p class="text-sm">Total Appointments: <span class="font-bold">21</span></p>
          <p class="text-sm">Completed: <span class="font-bold">15</span></p>
          <p class="text-sm">Pending: <span class="font-bold">5</span></p>
          <p class="text-sm">Cancelled: <span class="font-bold">1</span></p>
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
          
          <Table>
            <TableCaption>
              <span v-if="filteredRowsCount < totalRowsCount">
                Showing {{ filteredRowsCount }} of {{ totalRowsCount }} patients
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

