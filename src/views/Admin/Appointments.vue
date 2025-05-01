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
                <template v-if="cell.column.id === 'actions'">
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
                                  <p>{{ row.original.patient }}</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium">Gender</h4>
                                  <p>Male</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium">Email Address</h4>
                                  <p>patient@example.com</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium">Birthdate</h4>
                                  <p>January 15, 1985</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium">Contact Number</h4>
                                  <p>+63 912 345 6789</p>
                                </div>
                                <div>
                                  <h4 class="text-sm font-medium">Address</h4>
                                  <p>123 Main Street, Quezon City</p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 class="text-lg font-semibold mb-2">Appointment Information</h3>
                              <div class="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 class="text-sm font-medium">Service</h4>
                                  <p>{{ row.original.service }}</p>
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
                                          {{ appointmentStatus }}
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent class="w-full">
                                        <DropdownMenuItem @click="appointmentStatus = 'Confirmed'">
                                          <span class="text-green-600 font-medium">Confirmed</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="appointmentStatus = 'Checked In'">
                                          <span class="text-blue-600 font-medium">Checked In</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="appointmentStatus = 'In Consultation'">
                                          <span class="text-purple-600 font-medium">In Consultation</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="appointmentStatus = 'Billing'">
                                          <span class="text-amber-600 font-medium">Billing</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="appointmentStatus = 'Completed'">
                                          <span class="text-emerald-600 font-medium">Completed</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="appointmentStatus = 'Cancelled'">
                                          <span class="text-red-600 font-medium">Cancelled</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="appointmentStatus = 'No Show'">
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
                          <Button variant="outline" class="mr-2">
                            <PrinterIcon class="h-4 w-4 mr-2" />
                            Print
                          </Button>
                          <Button>
                            <PencilIcon class="h-4 w-4 mr-2" />
                            Edit
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
import { SearchIcon, PrinterIcon, PencilIcon } from 'lucide-vue-next';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ref, computed } from 'vue';
import {
  createColumnHelper,
  getCoreRowModel,
  useVueTable,
  getFilteredRowModel,
} from '@tanstack/vue-table';

// Define the data structure for appointments
const appointments = ref([
  {
    id: 1,
    date: 'May 2, 2025',
    time: '8:00 AM - 9:00 AM',
    patient: 'Juan Dela Cruz',
    service: 'Hematology',
  },
  {
    id: 2,
    date: 'May 3, 2025',
    time: '10:00 AM - 11:00 AM',
    patient: 'Maria Santos',
    service: 'X-ray',
  },
  {
    id: 3,
    date: 'May 4, 2025',
    time: '1:00 PM - 2:00 PM',
    patient: 'Pedro Penduko',
    service: 'Consultation',
  },
  {
    id: 4,
    date: 'May 5, 2025',
    time: '9:30 AM - 10:30 AM',
    patient: 'Lucia Reyes',
    service: 'Blood Test',
  },
]);

// Global search filter
const globalFilter = ref('');

// Status combobox value
const appointmentStatus = ref('Confirmed');

// Create a column helper
const columnHelper = createColumnHelper();

// Define columns
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
  columnHelper.accessor('actions', {
    header: 'Actions',
    cell: () => null, // We'll handle this in the template
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

// Count of filtered rows
const filteredRowsCount = computed(() => {
  return table.getFilteredRowModel().rows.length;
});

// Count of total rows
const totalRowsCount = computed(() => {
  return appointments.value.length;
});
</script>