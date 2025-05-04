<template>
  <div>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 ">
        <div class="flex items-center gap-4">
          <CardTitle>Upcoming Appointments</CardTitle>
          <div class="hidden md:flex items-center gap-2">
            <div class="flex items-center gap-1.5 bg-muted/60 px-2 py-1 rounded text-xs text-muted-foreground">
              <UserCheckIcon class="h-3 w-3 text-primary" />
              <span>Click status to update</span>
            </div>
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
            <div v-if="globalFilter && !isLoading" class="ml-2 flex items-center text-xs bg-muted/70 px-2 py-1 rounded-full">
              <span class="font-medium text-primary">{{ filteredRowsCount }}</span>
              <span class="text-muted-foreground ml-1">results</span>
            </div>
          </div>
          
          <!-- Search Tips displayed below the search input -->
          <div v-if="globalFilter && !isLoading" class="mt-1 text-xs text-muted-foreground self-end">
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
        <div v-if="isLoading" class="space-y-3">
          <div class="space-y-2">
            <!-- Skeleton for table header -->
            <div class="flex items-center">
              <Skeleton v-for="i in 6" :key="`header-${i}`" class="h-8 w-32 mx-2" />
            </div>
            <!-- Skeleton for table rows -->
            <div v-for="i in 5" :key="`row-${i}`" class="flex items-center">
              <Skeleton v-for="j in 6" :key="`cell-${i}-${j}`" class="h-6 w-32 mx-2" />
            </div>
          </div>
        </div>
        
        <Table v-else>

          <TableHeader>
            <TableRow class="bg-muted/50">
              <TableHead 
                v-for="header in table.getHeaderGroups()[0].headers" 
                :key="header.id"
                :class="{ 'cursor-pointer hover:bg-muted transition-colors': header.column.id !== 'actions' }"
                @click="header.column.id !== 'actions' ? handleHeaderClick(header.column) : null"
              >
                <div class="flex items-center">
                  <component 
                    :is="getHeaderIcon(header.column.id)" 
                    class="mr-2 h-4 w-4 text-primary" 
                    v-if="getHeaderIcon(header.column.id)"
                  />
                  {{ header.column.columnDef.header }}
                  <ChevronDown v-if="sorting[0]?.id === header.column.id && sorting[0]?.desc" class="ml-2 h-4 w-4 text-muted-foreground" />
                  <ChevronUp v-else-if="sorting[0]?.id === header.column.id && !sorting[0]?.desc" class="ml-2 h-4 w-4 text-muted-foreground" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow 
              v-for="row in table.getRowModel().rows" 
              :key="row.id"
              class="hover:bg-muted/30 transition-colors"
            >
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                <template v-if="cell.column.id === 'status'">
                  <span :class="getStatusClass(row.original.status)">
                    <component :is="getStatusIcon(row.original.status)" class="inline-block w-3 h-3 mr-1" />
                    {{ formatStatus(row.original.status) }}
                  </span>
                </template>
                <template v-else-if="cell.column.id === 'actions'">
                  <div class="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" class="flex items-center">
                          <EyeIcon class="w-3.5 h-3.5 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent class="sm:max-w-[1280px]">
                        <DialogHeader>
                          <DialogTitle>Appointment Details</DialogTitle>
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
                                  <p class="font-medium">{{ row.original.basic_info?.first_name || '' }} {{ row.original.basic_info?.last_name || '' }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium text-muted-foreground">Gender</h4>
                                  <p class="font-medium">{{ row.original.basic_info?.sex || row.original.basic_info?.gender || 'N/A' }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium text-muted-foreground">Age</h4>
                                  <p class="font-medium">{{ row.original.basic_info?.age || 'N/A' }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium text-muted-foreground">Email Address</h4>
                                  <p class="font-medium">{{ row.original.basic_info?.email || 'N/A' }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium text-muted-foreground">Birthdate</h4>
                                  <p class="font-medium">{{ formatBirthdate(row.original.basic_info?.date_of_birth) || 'N/A' }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium text-muted-foreground">Contact Number</h4>
                                  <p class="font-medium">{{ row.original.basic_info?.contact_number || row.original.basic_info?.contact_no || 'N/A' }}</p>
                                </div>
                                <div class="col-span-2">
                                  <h4 class="text-sm font-medium text-muted-foreground">Address</h4>
                                  <p class="font-medium">{{ row.original.basic_info?.address || 'N/A' }}</p>
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
                                  <p class="font-medium">{{ row.original.procedure?.name || 'N/A' }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium text-muted-foreground">Price</h4>
                                  <p class="font-medium">₱{{ row.original.procedure?.price || 'N/A' }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium text-muted-foreground">Schedule Date</h4>
                                  <p class="font-medium">{{ row.original.date }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium text-muted-foreground">Schedule Time</h4>
                                  <p class="font-medium">{{ row.original.time }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium text-muted-foreground">Status</h4>
                                  <div class="w-full max-w-[200px]">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="outline" class="w-full text-left">
                                          {{ formatStatus(row.original.status || 'pending') }}
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent class="w-full">
                                        <DropdownMenuItem @click="updateStatus(row.original.id, 'pending')">
                                          <CalendarIcon class="w-4 h-4 mr-2 text-amber-500" />
                                          <span class="text-amber-700 font-medium">Pending</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="updateStatus(row.original.id, 'checked-in')">
                                          <UserCheckIcon class="w-4 h-4 mr-2 text-blue-500" />
                                          <span class="text-blue-700 font-medium">Checked In</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="updateStatus(row.original.id, 'in_consultation')">
                                          <StethoscopeIcon class="w-4 h-4 mr-2 text-purple-500" />
                                          <span class="text-purple-700 font-medium">In Consultation</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="updateStatus(row.original.id, 'complete')">
                                          <CheckIcon class="w-4 h-4 mr-2 text-emerald-500" /> 
                                          <span class="text-emerald-700 font-medium">Completed</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="updateStatus(row.original.id, 'cancelled')">
                                          <XIcon class="w-4 h-4 mr-2 text-red-500" />
                                          <span class="text-red-700 font-medium">Cancelled</span>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                                <div v-if="row.original.payment_status === 'succeeded'" class="col-span-2">
                                  <div class="flex items-center gap-2 mb-2">
                                    <CheckCircleIcon class="w-5 h-5 text-green-500" />
                                    <h4 class="text-sm font-medium text-green-600">Payment Completed</h4>
                                  </div>
                                  <div class="bg-green-50 border border-green-100 rounded-md p-3 flex justify-between items-center">
                                    <div>
                                      <p class="text-xs text-muted-foreground">Payment ID</p>
                                      <p class="font-medium">{{ row.original.payment_id }}</p>
                                    </div>
                                    <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                                      {{ row.original.payment_status }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div v-if="row.original.medical_notes" class="rounded-lg border bg-card p-4 shadow-sm">
                              <h3 class="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
                                <StethoscopeIcon class="h-5 w-5" />
                                Medical Notes
                              </h3>
                              <div class="p-3 border rounded-md bg-muted/30">
                                <p class="whitespace-pre-wrap text-foreground">{{ row.original.medical_notes }}</p>
                              </div>
                            </div>

                          </div>
                        </div>
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
 

        <!-- Search Results Indicator -->
        <div v-if="globalFilter && !isLoading" class="mt-2 mb-4 flex items-center justify-between bg-muted/30 p-2 rounded-md border border-border/50">
          <div class="flex items-center gap-2">
            <SearchIcon class="h-4 w-4 text-primary" />
            <p class="text-sm">
              Search results for: <span class="font-medium">{{ globalFilter }}</span>
              <span v-if="filteredRowsCount === 0" class="text-destructive ml-2">(No matches found)</span>
            </p>
          </div>
          <div class="text-xs text-muted-foreground">
            Tip: Search by patient name, procedure, date or status
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
import { SearchIcon, PrinterIcon, ChevronDown, ChevronUp, CalendarIcon, EyeIcon, ClockIcon, UserIcon, CheckIcon, XIcon, UserCheckIcon, StethoscopeIcon, ActivityIcon, SettingsIcon, CalendarDaysIcon, UserXIcon, CheckCircleIcon, XCircleIcon } from 'lucide-vue-next';
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

// Sort state - initially sort by date in ascending order (earliest first)
const sorting = ref([{ id: 'date', desc: false }]);

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
  // Reset to first page when searching
  pagination.value.page = 1;
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

// Handle header click for sorting
function handleHeaderClick(column) {
  const isDesc = sorting.value[0]?.id === column.id && sorting.value[0]?.desc;
  setSorting([{ id: column.id, desc: !isDesc }]);
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
  };
  return classes[status] || classes.pending;
};

// Format time to show as range in 12-hour format
function formatTimeRange(time) {
  if (!time) return '';
  
  // If it's already in the format "8:00 AM - 9:00 AM", return as is
  if (time.includes('-')) return time;
  
  // Parse the time (assuming it's in 24hr format like "08:00:00" or "8:00")
  let hour = 0;
  let minute = 0;
  let amPm = 'AM';
  
  // Handle different time formats
  if (time.includes(':')) {
    const parts = time.split(':');
    hour = parseInt(parts[0], 10);
    minute = parts.length > 1 ? parseInt(parts[1], 10) : 0;
  } else {
    hour = parseInt(time, 10);
  }
  
  // Convert to 12-hour format for display
  if (hour >= 12) {
    amPm = 'PM';
    if (hour > 12) hour -= 12;
  } else if (hour === 0) {
    hour = 12;
  }
  
  // Format start time
  const startTime = `${hour}:${minute.toString().padStart(2, '0')} ${amPm}`;
  
  // Calculate end time (1 hour later)
  let endHour = hour + 1;
  let endAmPm = amPm;
  
  if (hour === 11) {
    endHour = 12;
    endAmPm = amPm === 'AM' ? 'PM' : 'AM';
  } else if (hour === 12) {
    endHour = 1;
  }
  
  const endTime = `${endHour}:${minute.toString().padStart(2, '0')} ${endAmPm}`;
  
  return `${startTime} - ${endTime}`;
}

// Format date and time for display
function formatDateTime(dateTime) {
  if (!dateTime) return 'N/A';
  const date = new Date(dateTime);
  return date.toLocaleString();
}

// Get icons for different statuses
function getStatusIcon(status) {
  switch(status) {
    case 'pending': return CalendarIcon;
    case 'checked-in': return UserCheckIcon;
    case 'in_consultation': return StethoscopeIcon;
    case 'complete': return CheckIcon;
    case 'cancelled': return XIcon;
    default: return CalendarIcon;
  }
}

// Get icons for table header columns
function getHeaderIcon(columnId) {
  switch(columnId) {
    case 'date': return CalendarDaysIcon;
    case 'time': return ClockIcon;
    case 'patient': return UserIcon;
    case 'service': return StethoscopeIcon;
    case 'status': return ActivityIcon;
    case 'actions': return SettingsIcon;
    default: return null;
  }
}

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
    // Requesting data sorted by appointment_date in ascending order
    const response = await axios.get(`${API_URL}/api/admin/appointments`, {
      params: {
        sort: 'appointment_date',
        order: 'asc'
      }
    });
    
    if (response.data.success) {
      // Transform the data to match our table structure
      allAppointments.value = response.data.appointments.map(appointment => ({
        id: appointment.id,
        date: appointment.appointment_date,
        time: formatTimeRange(appointment.appointment_time),
        patient: `${appointment.basic_info?.first_name || ''} ${appointment.basic_info?.last_name || ''}`,
        service: appointment.procedure?.name || 'N/A',
        status: appointment.status || 'pending',
        // Store complete objects for detailed view
        basic_info: appointment.basic_info,
        procedure: appointment.procedure,
        raw_time: appointment.appointment_time, // Store the original time for API calls
        payment_id: appointment.payment_id,
        payment_status: appointment.payment_status,
        medical_notes: appointment.medical_notes,
        created_at: appointment.created_at,
        updated_at: appointment.updated_at
      }));
      
      // Apply pagination, sorting and filtering - ensuring earliest dates first
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

// Watch for changes to the globalFilter and update results immediately
watch(globalFilter, (newValue) => {
  // Reset to first page when searching
  pagination.value.page = 1;
  // Apply pagination to update the view with filtered results
  applyPagination();
});

// Format birthdate for display
function formatBirthdate(date) {
  if (!date) return null;
  
  // Check if date is already formatted or is a Date object
  if (date instanceof Date) {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  
  // If it's a string in ISO format (YYYY-MM-DD)
  try {
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  } catch (e) {
    console.error('Error formatting birthdate:', e);
  }
  
  // Return the original value if we can't format it
  return date;
}

// Fetch data on component mount
onMounted(() => {
  fetchAppointments();
});
</script>