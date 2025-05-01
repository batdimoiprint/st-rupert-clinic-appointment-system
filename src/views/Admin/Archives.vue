<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Archives</h1>
    <Card>
      <CardHeader>
        <CardTitle>Past Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex items-center justify-between py-4">
          <div class="relative w-full max-w-sm">
            <SearchIcon class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              v-model="globalFilter"
              class="pl-8"
            />
          </div>
          <Button variant="outline">Export to CSV</Button>
        </div>
        
        <Table>
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
                <template v-else-if="cell.column.id === 'actions'">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">View Details</Button>
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
                                <p>9:00 AM - 10:00 AM</p>
                              </div>
                              <div>
                                <h4 class="text-sm font-medium">Status</h4>
                                <p>{{ appointmentStatus }}</p>
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
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </template>
                <template v-else>
                  {{ cell.getValue() }}
                </template>
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

// Define the data structure for archived appointments
const archivedAppointments = ref([
  {
    id: 1,
    date: 'April 28, 2025',
    patient: 'Agapito Dimatibag',
    service: 'Hematology',
    status: 'Completed',
    statusColor: 'green',
  },
  {
    id: 2,
    date: 'April 25, 2025',
    patient: 'Juan Dela Cruz',
    service: 'Consultation',
    status: 'Cancelled',
    statusColor: 'red',
  },
  {
    id: 3,
    date: 'April 20, 2025',
    patient: 'Maria Santos',
    service: 'X-ray',
    status: 'Completed',
    statusColor: 'green',
  },
]);

// Global search filter
const globalFilter = ref('');

// Status combobox value - set to default based on the first record's status
const appointmentStatus = ref('Completed');

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

// Count of filtered rows
const filteredRowsCount = computed(() => {
  return table.getFilteredRowModel().rows.length;
});

// Count of total rows
const totalRowsCount = computed(() => {
  return archivedAppointments.value.length;
});
</script>