export type RideStatus = 'SCHEDULED' | 'BOARDING' | 'IN_TRANSIT' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED';

export type ShiftType = 'PICKUP' | 'DROP';

export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  department: string;
  officeLocation: string;
  defaultPickup: string;
  defaultDrop: string;
  avatarUrl?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  photoUrl: string;
  totalTrips: number;
  vaccinated: boolean;
}

export interface Vehicle {
  id: string;
  numberPlate: string;
  model: string;
  color: string;
  type: string;
  capacity: number;
}

export interface LocationCoordinate {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
}

export interface Ride {
  id: string;
  bookingId: string;
  date: string;
  time: string;
  shiftType: ShiftType;
  status: RideStatus;
  pickup: LocationCoordinate;
  drop: LocationCoordinate;
  driver?: Driver;
  vehicle?: Vehicle;
  eta?: string;
  estimatedDistanceKm: number;
  estimatedDurationMins: number;
  routePolyline?: string;
  coPassengersCount?: number;
  otp?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'RIDE_REMINDER' | 'DRIVER_ASSIGNED' | 'VEHICLE_APPROACHING' | 'RIDE_STARTED' | 'RIDE_COMPLETED' | 'SCHEDULE_CHANGE' | 'ANNOUNCEMENT';
  actionUrl?: string;
}

export interface BookRideRequest {
  date: string;
  time: string;
  shiftType: ShiftType;
  pickupAddress: string;
  dropAddress: string;
  notes?: string;
}
