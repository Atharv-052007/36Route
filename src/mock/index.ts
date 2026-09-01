import { Employee, Driver, Vehicle, Ride, NotificationItem } from '../types';

export const MOCK_EMPLOYEE: Employee = {
  id: 'emp-101',
  name: 'Ananya Sharma',
  employeeId: 'EMP-36-8942',
  email: 'ananya.sharma@corptech.com',
  phone: '+91 98765 43210',
  department: 'Product & Technology',
  officeLocation: '36Route Tech Park, Tower B, Electronic City, Bengaluru',
  defaultPickup: 'Flat 402, Greenwoods Apartments, HSR Layout Sector 1, Bengaluru',
  defaultDrop: '36Route Tech Park, Tower B, Electronic City, Bengaluru',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  emergencyContact: {
    name: 'Rajesh Sharma',
    relationship: 'Father',
    phone: '+91 98111 22233',
  },
};

export const MOCK_DRIVER: Driver = {
  id: 'drv-501',
  name: 'Vikram Singh',
  phone: '+91 91234 56789',
  rating: 4.9,
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  totalTrips: 1420,
  vaccinated: true,
};

export const MOCK_VEHICLE: Vehicle = {
  id: 'veh-901',
  numberPlate: 'KA 01 E 4529',
  model: 'Toyota Innova Crysta',
  color: 'Midnight Black',
  type: 'Premium Cab',
  capacity: 6,
};

export const MOCK_ACTIVE_RIDE: Ride = {
  id: 'rd-8801',
  bookingId: '36R-8801-IN',
  date: 'Today, 1 Sep 2026',
  time: '06:30 PM',
  shiftType: 'DROP',
  status: 'IN_TRANSIT',
  pickup: {
    latitude: 12.8399,
    longitude: 77.677,
    address: '36Route Tech Park, Tower B, Electronic City',
    name: 'Office (Tech Park Tower B)',
  },
  drop: {
    latitude: 12.9121,
    longitude: 77.6446,
    address: 'Flat 402, Greenwoods Apartments, HSR Layout Sec 1',
    name: 'Home (HSR Layout)',
  },
  driver: MOCK_DRIVER,
  vehicle: MOCK_VEHICLE,
  eta: '12 mins (06:42 PM)',
  estimatedDistanceKm: 14.2,
  estimatedDurationMins: 32,
  coPassengersCount: 3,
  otp: '4921',
};

export const MOCK_RIDES: Ride[] = [
  MOCK_ACTIVE_RIDE,
  {
    id: 'rd-8802',
    bookingId: '36R-8802-IN',
    date: 'Tomorrow, 2 Sep 2026',
    time: '08:30 AM',
    shiftType: 'PICKUP',
    status: 'SCHEDULED',
    pickup: {
      latitude: 12.9121,
      longitude: 77.6446,
      address: 'Flat 402, Greenwoods Apartments, HSR Layout Sec 1',
      name: 'Home (HSR Layout)',
    },
    drop: {
      latitude: 12.8399,
      longitude: 77.677,
      address: '36Route Tech Park, Tower B, Electronic City',
      name: 'Office (Tech Park Tower B)',
    },
    driver: MOCK_DRIVER,
    vehicle: MOCK_VEHICLE,
    eta: 'Scheduled',
    estimatedDistanceKm: 14.2,
    estimatedDurationMins: 35,
    coPassengersCount: 2,
    otp: '8104',
  },
  {
    id: 'rd-8799',
    bookingId: '36R-8799-IN',
    date: '31 Aug 2026',
    time: '06:30 PM',
    shiftType: 'DROP',
    status: 'COMPLETED',
    pickup: {
      latitude: 12.8399,
      longitude: 77.677,
      address: '36Route Tech Park, Tower B, Electronic City',
      name: 'Office (Tech Park)',
    },
    drop: {
      latitude: 12.9121,
      longitude: 77.6446,
      address: 'Flat 402, Greenwoods Apartments, HSR Layout Sec 1',
      name: 'Home (HSR Layout)',
    },
    driver: {
      ...MOCK_DRIVER,
      name: 'Ramesh Kumar',
    },
    vehicle: {
      ...MOCK_VEHICLE,
      numberPlate: 'KA 05 M 9912',
      model: 'Maruti Ertiga',
    },
    estimatedDistanceKm: 14.5,
    estimatedDurationMins: 38,
  },
  {
    id: 'rd-8795',
    bookingId: '36R-8795-IN',
    date: '29 Aug 2026',
    time: '08:30 AM',
    shiftType: 'PICKUP',
    status: 'CANCELLED',
    pickup: {
      latitude: 12.9121,
      longitude: 77.6446,
      address: 'Flat 402, Greenwoods Apartments, HSR Layout Sec 1',
      name: 'Home (HSR Layout)',
    },
    drop: {
      latitude: 12.8399,
      longitude: 77.677,
      address: '36Route Tech Park, Tower B, Electronic City',
      name: 'Office (Tech Park)',
    },
    estimatedDistanceKm: 14.2,
    estimatedDurationMins: 35,
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Driver Arrived at Pickup',
    message: 'Vikram Singh (KA 01 E 4529) has arrived at your pickup point HSR Layout.',
    timestamp: '5 mins ago',
    read: false,
    type: 'VEHICLE_APPROACHING',
  },
  {
    id: 'notif-2',
    title: 'Cab Assigned for Evening Shift',
    message: 'Toyota Innova (KA 01 E 4529) with driver Vikram Singh assigned for 06:30 PM shift.',
    timestamp: '2 hours ago',
    read: true,
    type: 'DRIVER_ASSIGNED',
  },
  {
    id: 'notif-3',
    title: 'Ride Scheduled Successfully',
    message: 'Your morning pickup for tomorrow 08:30 AM is confirmed.',
    timestamp: 'Yesterday',
    read: true,
    type: 'RIDE_REMINDER',
  },
  {
    id: 'notif-4',
    title: 'Company Transport Notice',
    message: 'Shuttle routes will have enhanced security patrol during night shifts starting this week.',
    timestamp: '3 days ago',
    read: true,
    type: 'ANNOUNCEMENT',
  },
];
