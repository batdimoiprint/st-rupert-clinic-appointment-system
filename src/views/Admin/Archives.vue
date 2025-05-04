<template>
  <div>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0">
        <div class="flex items-center gap-4">
          <CardTitle>Past Appointments</CardTitle>
          <div class="hidden md:flex items-center gap-2">
            <div class="flex items-center gap-1.5 bg-muted/60 px-2 py-1 rounded text-xs text-muted-foreground">
              <CalendarDaysIcon class="h-3 w-3 text-primary" />
              <span>Sort by clicking headers</span>
            </div>
            <div class="flex items-center gap-1.5 bg-muted/60 px-2 py-1 rounded text-xs text-muted-foreground">
              <EyeIcon class="h-3 w-3 text-primary" />
              <span>View details</span>
            </div>
          </div>
        </div>
        <div class="relative w-full max-w-sm ml-auto flex flex-col">
          <div class="flex items-center">
            <div class="relative flex-1">
              <SearchIcon class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, date, service..."
                v-model="globalFilter"
                class="pl-8"
              />
              <div class="absolute right-2 top-2.5 flex items-center gap-1">
                <button v-if="globalFilter" @click="globalFilter = ''" class="text-muted-foreground hover:text-foreground">
                  <XCircleIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <!-- Search Results Pill - Displayed inline beside the search input -->
            <div v-if="globalFilter && !loading" class="ml-2 flex items-center text-xs bg-muted/70 px-2 py-1 rounded-full">
              <span class="font-medium text-primary">{{ filteredRowsCount }}</span>
              <span class="text-muted-foreground ml-1">results</span>
            </div>
          </div>
          
          <!-- Search Tips displayed below the search input -->
          <div v-if="globalFilter && !loading" class="mt-1 text-xs text-muted-foreground self-end">
            <span v-if="filteredRowsCount === 0" class="text-destructive">No matches found</span>
            <span v-else>Tip: Search by name, procedure, date, or status</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="flex items-center justify-between space-x-2 pb-2">
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
              :disabled="pagination.page === 1 || loading"
            >
              Previous
            </Button>
            <span class="mx-2">Page {{ pagination.page }} of {{ pagination.totalPages }}</span>
            <Button 
              variant="outline" 
              size="sm" 
              @click="goToPage(pagination.page + 1)"
              :disabled="pagination.page === pagination.totalPages || loading" 
            >
              Next
            </Button>
          </div>
        </div>
        
        <div v-if="loading" class="space-y-3">
          <div class="space-y-2">
            <!-- Skeleton for table header -->
            <div class="flex items-center">
              <Skeleton v-for="i in 5" :key="`header-${i}`" class="h-8 w-32 mx-2" />
            </div>
            <!-- Skeleton for table rows -->
            <div v-for="i in 5" :key="`row-${i}`" class="flex items-center">
              <Skeleton v-for="j in 5" :key="`cell-${i}-${j}`" class="h-6 w-32 mx-2" />
            </div>
          </div>
        </div>
        
        <Table v-else>
          <TableCaption>
            <span v-if="filteredRowsCount < totalRowsCount">
              Showing {{ filteredRowsCount }} of {{ totalRowsCount }} records
            </span>
            <span v-else>
              Archive of past appointments
            </span>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead 
                v-for="header in columns" 
                :key="header.id"
                class="cursor-pointer"
                @click="header.id !== 'actions' ? handleHeaderClick(header.id) : null"
              >
                <div class="flex items-center">
                  {{ header.header }}
                  <span v-if="sortColumn === header.id" class="ml-1">
                    <ChevronUp v-if="sortOrder === 'asc'" class="h-3 w-3" />
                    <ChevronDown v-else class="h-3 w-3" />
                  </span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="row in paginatedAppointments" :key="row.id">
              <TableCell>{{ row.date }}</TableCell>
              <TableCell>{{ row.patient }}</TableCell>
              <TableCell>{{ row.service }}</TableCell>
              <TableCell>
                <span :class="`inline-block px-2 py-1 text-xs rounded-full ${getStatusClass(row.statusColor)}`">
                  {{ row.status }}
                </span>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger>
                    <Button variant="outline" size="sm" class="flex items-center">
                      <EyeIcon class="w-3.5 h-3.5 mr-1" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent class="sm:max-w-[1280px]">
                    <DialogHeader>
                      <DialogTitle>Archived Appointment Details</DialogTitle>
                      <DialogDescription>
                        View comprehensive appointment information
                      </DialogDescription>
                    </DialogHeader>
                    <div class="grid gap-4 py-4">
                      <div class="grid grid-cols-2 gap-6">
                        <div class="rounded-lg border bg-card p-4 shadow-sm">
                          <h3 class="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                            <UserIcon class="h-5 w-5" />
                            Patient Information
                          </h3>
                          <div class="grid grid-cols-2 gap-4">
                            <div>
                              <h4 class="text-sm font-medium text-muted-foreground">Full Name</h4>
                              <p class="font-medium">{{ row.appointmentData?.basic_info?.first_name || '' }} {{ row.appointmentData?.basic_info?.last_name || '' }}</p>
                            </div>
                            <div>
                              <h4 class="text-sm font-medium text-muted-foreground">Gender</h4>
                              <p class="font-medium">{{ row.appointmentData?.basic_info?.sex || row.appointmentData?.basic_info?.gender || 'N/A' }}</p>
                            </div>
                            <div>
                              <h4 class="text-sm font-medium text-muted-foreground">Age</h4>
                              <p class="font-medium">{{ row.appointmentData?.basic_info?.age || 'N/A' }}</p>
                            </div>
                            <div>
                              <h4 class="text-sm font-medium text-muted-foreground">Email Address</h4>
                              <p class="font-medium">{{ row.appointmentData?.basic_info?.email || 'N/A' }}</p>
                            </div>
                            <div>
                              <h4 class="text-sm font-medium text-muted-foreground">Birthdate</h4>
                              <p class="font-medium">{{ formatBirthdate(row.appointmentData?.basic_info?.date_of_birth) || 'Not available in archives' }}</p>
                            </div>
                            <div>
                              <h4 class="text-sm font-medium text-muted-foreground">Contact Number</h4>
                              <p class="font-medium">{{ row.appointmentData?.basic_info?.contact_number || row.appointmentData?.basic_info?.contact_no || 'N/A' }}</p>
                            </div>
                            <div class="col-span-2">
                              <h4 class="text-sm font-medium text-muted-foreground">Address</h4>
                              <p class="font-medium">{{ row.appointmentData?.basic_info?.address || 'Not available in archives' }}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div class="rounded-lg border bg-card p-4 shadow-sm">
                          <h3 class="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                            <CalendarIcon class="h-5 w-5" />
                            Appointment Information
                          </h3>
                          <div class="grid grid-cols-2 gap-4">
                            <div>
                              <h4 class="text-sm font-medium text-muted-foreground">Service</h4>
                              <p class="font-medium">{{ row.service || 'N/A' }}</p>
                            </div>
                            <div>
                              <h4 class="text-sm font-medium text-muted-foreground">Price</h4>
                              <p class="font-medium">₱{{ row.appointmentData?.procedure?.price || 'N/A' }}</p>
                            </div>
                            <div>
                              <h4 class="text-sm font-medium text-muted-foreground">Schedule Date</h4>
                              <p class="font-medium">{{ row.date }}</p>
                            </div>
                            <div>
                              <h4 class="text-sm font-medium text-muted-foreground">Schedule Time</h4>
                              <p class="font-medium">{{ row.appointmentData?.appointment_time || 'N/A' }}</p>
                            </div>
                            <div>
                              <h4 class="text-sm font-medium text-muted-foreground">Status</h4>
                              <p class="font-medium">
                                <span :class="getStatusClass(row.originalStatus || 'expired')">
                                  {{('Expired') }}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div v-if="row.appointmentData?.medical_notes" class="rounded-lg border bg-card p-4 shadow-sm">
                          <h3 class="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                            <StethoscopeIcon class="h-5 w-5" />
                            Medical Notes
                          </h3>
                          <div class="p-3 border rounded-md bg-muted/30">
                            <p class="whitespace-pre-wrap text-foreground">{{ row.appointmentData?.medical_notes }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
            <TableRow v-if="table.getRowModel().rows.length === 0">
              <TableCell :colSpan="columns.length" class="h-24 text-center">
                No records found.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
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
import { SearchIcon, PrinterIcon, PencilIcon, ChevronDown, ChevronUp, CalendarIcon, EyeIcon, UserIcon, CheckIcon, XIcon, StethoscopeIcon, CheckCircleIcon, XCircleIcon, CalendarDaysIcon } from 'lucide-vue-next';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ref, computed, onMounted, watch } from 'vue';
import {
  createColumnHelper,
  getCoreRowModel,
  useVueTable,
  getFilteredRowModel,
} from '@tanstack/vue-table';
import axios from 'axios';

// Import environment variables
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Define the data structure for archived appointments
const archivedAppointments = ref([]);
const loading = ref(false);
const error = ref(null);

// Global search filter
const globalFilter = ref('');

// Status combobox value - set to default based on the first record's status
const appointmentStatus = ref('Completed');

// Add pagination state
const pagination = ref({
  page: 1,
  limit: 10,
  totalPages: 1,
  startIndex: 0,
  endIndex: 0
});

// All appointments data and paginated data for display
const allArchivedAppointments = ref([]);
const paginatedAppointments = ref([]);

// Total items count
const totalItems = ref(0);

// Sort state
const sorting = ref([]);
const sortColumn = ref('date');
const sortOrder = ref('desc');

// Create a column helper
const columnHelper = createColumnHelper();

// Define columns
const columns = [
  columnHelper.accessor('date', {
    header: 'Date',
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

// Fetch archived appointments from API
const fetchArchivedAppointments = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`${backendUrl}/api/admin/archived-appointments`);
    if (response.data.success) {
      // Transform the data to match our table structure
      archivedAppointments.value = response.data.archived.map(appointment => {
        const patient = appointment.basic_info;
        const fullName = patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';
        
        // For archived appointments, always set status to "Expired" regardless of actual status
        const statusColor = 'gray'; // Use gray color for expired status
        
        return {
          id: appointment.id,
          date: new Date(appointment.appointment_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          patient: fullName,
          service: appointment.procedure ? appointment.procedure.name : 'Unknown Service',
          status: 'Expired', // Override status to always show "Expired"
          statusColor: statusColor,
          // Store the full appointment data for the dialog
          appointmentData: appointment,
          // Store original status for reference if needed
          originalStatus: appointment.status
        };
      });
    }
  } catch (err) {
    console.error('Failed to fetch archived appointments:', err);
    error.value = 'Failed to load archived appointments. Please try again later.';
  } finally {
    loading.value = false;
  }
};

// Load data when component mounts
onMounted(async () => {
  await fetchArchivedAppointments();
  // Initialize pagination after data is loaded
  applyPagination();
});

// Watch for changes in the global filter
watch(globalFilter, () => {
  // Reset to first page when search changes
  pagination.value.page = 1;
  applyPagination();
});

// Create table instance with filtering
const table = useVueTable({
  get data() {
    return archivedAppointments.value;
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

// Apply pagination to the filtered and sorted data
function applyPagination() {
  // First, filter the data based on globalFilter if it exists
  let filteredData = [...archivedAppointments.value];
  if (globalFilter.value) {
    const search = globalFilter.value.toLowerCase();
    filteredData = filteredData.filter(item => {
      // Search in all text fields
      return item.patient.toLowerCase().includes(search) ||
             item.service.toLowerCase().includes(search) ||
             item.date.toLowerCase().includes(search) ||
             item.status.toLowerCase().includes(search);
    });
  }
  
  // Next, sort the filtered data
  filteredData.sort((a, b) => {
    let valueA = a[sortColumn.value];
    let valueB = b[sortColumn.value];
    
    // Custom sort for date field
    if (sortColumn.value === 'date') {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }
    
    if (valueA < valueB) {
      return sortOrder.value === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortOrder.value === 'asc' ? 1 : -1;
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

// Go to a specific page
function goToPage(page) {
  if (page < 1 || page > pagination.value.totalPages || loading.value) return;
  pagination.value.page = page;
  applyPagination();
}

// Handle header click for sorting
function handleHeaderClick(column) {
  if (sortColumn.value === column) {
    // Toggle sort order if same column is clicked
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Set new sort column and default to ascending
    sortColumn.value = column;
    sortOrder.value = 'asc';
  }
  applyPagination();
}

// Create table instance with pagination
const tableWithPagination = useVueTable({
  get data() {
    return paginatedAppointments.value;
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  state: {
    get globalFilter() {
      return globalFilter.value;
    }
  },
  onGlobalFilterChange: setGlobalFilter,
});

// Count of filtered rows
const filteredRowsCount = computed(() => {
  return table.getFilteredRowModel().rows.length;
});

// Count of total rows
const totalRowsCount = computed(() => {
  return archivedAppointments.value.length;
});

// Format birthdate to a more readable form
const formatBirthdate = (date) => {
  if (!date) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

// Function to format status for display
function formatStatus(status) {
  if (!status) return 'Expired';
  
  switch(status) {
    case 'pending': return 'Pending';
    case 'checked-in': return 'Checked In';
    case 'in_consultation': return 'In Consultation';
    case 'complete': return 'Complete';
    case 'cancelled': return 'Cancelled';
    case 'no-show': return 'No Show';
    case 'expired': return 'Expired';
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

// Function to get status class for styling
function getStatusClass(status) {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs',
    'checked-in': 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs',
    'in_consultation': 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs',
    complete: 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs',
    cancelled: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs',
    'no-show': 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs',
    expired: 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs',
  };
  return classes[status] || classes.expired;
}

// Function to get appropriate background and text color classes based on status
const getStatusClasses = (statusColor) => {
  const classes = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  return classes[statusColor] || classes.gray;
};
</script>