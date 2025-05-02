<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Appointments</h1>
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex items-center justify-between py-4">
          <div class="relative w-full max-w-sm">
            <SearchIcon class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search appointments..."
              v-model="globalFilter"
              class="pl-8"
            />
          </div>
        </div>
        
        <Table>
          <TableCaption>
            <span v-if="filteredRowsCount < totalRowsCount">
              Showing {{ filteredRowsCount }} of {{ totalRowsCount }} appointments
            </span>
            <span v-else>
              List of upcoming patient appointments.
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
                  <span :class="getStatusClass(row.original.status)">
                    {{ formatStatus(row.original.status) }}
                  </span>
                </template>
                <template v-else-if="cell.column.id === 'actions'">
                  <div class="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">View</Button>
                      </DialogTrigger>
                      <DialogContent class="sm:max-w-[625px]">
                        <DialogHeader>
                          <DialogTitle>Appointment Details</DialogTitle>
                          <DialogDescription>
                            View comprehensive appointment information
                          </DialogDescription>
                        </DialogHeader>
                        <div class="grid gap-4 py-4">
                          <div class="grid grid-cols-1 gap-6">
                            <div>
                              <h3 class="text-lg font-semibold mb-2">Patient Information</h3>
                              <div class="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 class="text-sm font-medium">Full Name</h4>
                                  <p>{{ row.original.basic_info?.first_name || '' }} {{ row.original.basic_info?.last_name || '' }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium">Gender</h4>
                                  <p>{{ row.original.basic_info?.gender || 'N/A' }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium">Email Address</h4>
                                  <p>{{ row.original.basic_info?.email || 'N/A' }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium">Birthdate</h4>
                                  <p>{{ row.original.basic_info?.birthdate || 'N/A' }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium">Contact Number</h4>
                                  <p>{{ row.original.basic_info?.contact_number || 'N/A' }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium">Address</h4>
                                  <p>{{ row.original.basic_info?.address || 'N/A' }}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 class="text-lg font-semibold mb-2">Appointment Information</h3>
                              <div class="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 class="text-sm font-medium">Service</h4>
                                  <p>{{ row.original.procedure?.name || 'N/A' }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium">Schedule Date</h4>
                                  <p>{{ row.original.date }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium">Schedule Time</h4>
                                  <p>{{ row.original.time }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium">Status</h4>
                                  <div class="w-full max-w-[200px]">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="outline" class="w-full text-left">
                                          {{ formatStatus(row.original.status || 'pending') }}
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent class="w-full">
                                        <DropdownMenuItem @click="updateStatus(row.original.id, 'pending')">
                                          <span class="text-gray-600 font-medium">Pending</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="updateStatus(row.original.id, 'checked-in')">
                                          <span class="text-blue-600 font-medium">Checked In</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="updateStatus(row.original.id, 'in_consultation')">
                                          <span class="text-purple-600 font-medium">In Consultation</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="updateStatus(row.original.id, 'complete')">
                                          <span class="text-emerald-600 font-medium">Completed</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="updateStatus(row.original.id, 'cancelled')">
                                          <span class="text-red-600 font-medium">Cancelled</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="updateStatus(row.original.id, 'no-show')">
                                          <span class="text-gray-600 font-medium">No Show</span>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline">
                            <PrinterIcon class="h-4 w-4 mr-2" />
                            Print
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </template>
                <template v-else>
                  {{ cell.getValue() }}
                </template>
              </TableCell>
            </TableRow>
            <TableRow v-if="table.getRowModel().rows.length === 0">
              <TableCell :colSpan="columns.length" class="h-24 text-center">
                No appointments found.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Pagination Controls -->
        <div class="flex items-center justify-between space-x-2 py-4">
          <div class="flex-1 text-sm text-muted-foreground">
            Showing <span class="font-medium">{{ pagination.startIndex + 1 }}</span> to 
            <span class="font-medium">{{ Math.min(pagination.endIndex, totalItems) }}</span> of 
            <span class="font-medium">{{ totalItems }}</span> results
          </div>
          <div class="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              @click="goToPage(pagination.page - 1)"
              :disabled="pagination.page === 1 || isLoading"
            >
              Previous
            </Button>
            <span class="mx-2">Page {{ pagination.page }} of {{ pagination.totalPages }}</span>
            <Button 
              variant="outline" 
              size="sm" 
              @click="goToPage(pagination.page + 1)"
              :disabled="pagination.page === pagination.totalPages || isLoading" 
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { SearchIcon, PrinterIcon } from 'lucide-vue-next';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ref, computed, onMounted } from 'vue';
import {
  createColumnHelper,
  getCoreRowModel,
  useVueTable,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/vue-table';
import axios from 'axios';

// API URL from environment variable
const API_URL = import.meta.env.VITE_BACKEND_URL || '';

// Store all appointments data
const allAppointments = ref([]);
// Paginated appointments data to display
const paginatedAppointments = ref([]);

// Loading state for API operations
const isLoading = ref(false);

// Global search filter
const globalFilter = ref('');

// Pagination state
const pagination = ref({
  page: 1,
  limit: 10,
  totalPages: 1,
  startIndex: 0,
  endIndex: 0,
});

// Total items count from all available data
const totalItems = ref(0);

// Sort state
const sorting = ref([{ id: 'date', desc: true }]); // Default sort by date descending

// Create a column helper
const columnHelper = createColumnHelper();

// Define columns with sortable headers
const columns = [
  columnHelper.accessor('date', {
    header: 'Date',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('time', {
    header: 'Time',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('patient', {
    header: 'Patient',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('service', {
    header: 'Service',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('actions', {
    header: 'Actions',
    cell: () => null, // We'll handle this in the template
  }),
];

// Create table instance with filtering and sorting
const table = useVueTable({
  get data() {
    return paginatedAppointments.value;
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  state: {
    get globalFilter() {
      return globalFilter.value;
    },
    get sorting() {
      return sorting.value;
    }
  },
  onGlobalFilterChange: setGlobalFilter,
  onSortingChange: setSorting,
});

function setGlobalFilter(value) {
  globalFilter.value = value;
  applyPagination();
}

function setSorting(updater) {
  if (typeof updater === 'function') {
    sorting.value = updater(sorting.value);
  } else {
    sorting.value = updater;
  }
  applyPagination();
}

// Format status for display
function formatStatus(status) {
  if (!status) return 'Pending';
  
  switch(status) {
    case 'pending': return 'Pending';
    case 'checked-in': return 'Checked In';
    case 'in_consultation': return 'In Consultation';
    case 'complete': return 'Complete';
    case 'cancelled': return 'Cancelled';
    case 'no-show': return 'No Show';
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

// Get status color class based on status
function getStatusClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs',
    'checked-in': 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs',
    'in_consultation': 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs',
    complete: 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs',
    cancelled: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs',
    'no-show': 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs',
  };
  return classes[status] || classes.pending;
};

// Apply client-side pagination, sorting and filtering
function applyPagination() {
  const sortColumn = sorting.value.length > 0 ? sorting.value[0].id : 'date';
  const sortOrder = sorting.value.length > 0 && sorting.value[0].desc ? 'desc' : 'asc';
  
  // First, filter the data based on globalFilter if it exists
  let filteredData = [...allAppointments.value];
  if (globalFilter.value) {
    const search = globalFilter.value.toLowerCase();
    filteredData = filteredData.filter(item => {
      // Search in all text fields
      return item.patient.toLowerCase().includes(search) ||
             item.service.toLowerCase().includes(search) ||
             item.date.toLowerCase().includes(search) ||
             item.time.toLowerCase().includes(search) ||
             formatStatus(item.status).toLowerCase().includes(search);
    });
  }
  
  // Next, sort the filtered data
  filteredData.sort((a, b) => {
    let valueA = a[sortColumn];
    let valueB = b[sortColumn];
    
    // Custom sort for date field
    if (sortColumn === 'date') {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }
    
    if (valueA < valueB) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // Update total items count
  totalItems.value = filteredData.length;
  
  // Calculate pagination values
  const totalPages = Math.ceil(filteredData.length / pagination.value.limit);
  pagination.value.totalPages = totalPages;
  
  // Adjust current page if it's beyond the available pages
  if (pagination.value.page > totalPages) {
    pagination.value.page = Math.max(1, totalPages);
  }
  
  // Calculate indices for the current page
  const startIndex = (pagination.value.page - 1) * pagination.value.limit;
  const endIndex = Math.min(startIndex + pagination.value.limit, filteredData.length);
  
  pagination.value.startIndex = startIndex;
  pagination.value.endIndex = endIndex;
  
  // Get the slice of data for the current page
  paginatedAppointments.value = filteredData.slice(startIndex, endIndex);
}

// Count of filtered rows (for the current page)
const filteredRowsCount = computed(() => {
  return table.getFilteredRowModel().rows.length;
});

// Count of total rows (all data)
const totalRowsCount = computed(() => {
  return allAppointments.value.length;
});

// Go to a specific page
function goToPage(page) {
  if (page < 1 || page > pagination.value.totalPages || isLoading.value) return;
  pagination.value.page = page;
  applyPagination();
}

// Fetch all appointments data
async function fetchAppointments() {
  isLoading.value = true;
  try {
    const response = await axios.get(`${API_URL}/api/admin/appointments`);
    if (response.data.success) {
      // Transform the data to match our table structure
      allAppointments.value = response.data.appointments.map(appointment => ({
        id: appointment.id,
        date: appointment.appointment_date,
        time: appointment.appointment_time,
        patient: `${appointment.basic_info?.first_name || ''} ${appointment.basic_info?.last_name || ''}`,
        service: appointment.procedure?.name || 'N/A',
        status: appointment.status || 'pending',
        // Store complete objects for detailed view
        basic_info: appointment.basic_info,
        procedure: appointment.procedure
      }));
      
      // Apply pagination, sorting and filtering
      applyPagination();
    } else {
      console.error('Failed to fetch appointments:', response.data.message);
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
  } finally {
    isLoading.value = false;
  }
}

// Update appointment status
async function updateStatus(appointmentId, newStatus) {
  isLoading.value = true;
  try {
    const response = await axios.patch(`${API_URL}/api/admin/appointments/${appointmentId}/status`, {
      status: newStatus
    });
    
    if (response.data.success) {
      // Update the appointment in the allAppointments array
      const appointmentIndex = allAppointments.value.findIndex(a => a.id === appointmentId);
      if (appointmentIndex !== -1) {
        allAppointments.value[appointmentIndex].status = newStatus;
        // Re-apply pagination to update the current view
        applyPagination();
      }
    } else {
      console.error('Failed to update appointment status:', response.data.message);
    }
  } catch (error) {
    console.error('Error updating appointment status:', error);
  } finally {
    isLoading.value = false;
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchAppointments();
});
</script>