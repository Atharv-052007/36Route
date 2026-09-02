// ─── Enums & Status Types ────────────────────────────────────────

export type RideStatus = 'SCHEDULED' | 'BOARDING' | 'IN_TRANSIT' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED';

export type ShiftType = 'PICKUP' | 'DROP';

export type VehicleStatus = 'AVAILABLE' | 'ON_TRIP' | 'MAINTENANCE' | 'OFFLINE';

export type VehicleType = 'SEDAN' | 'SUV' | 'HATCHBACK' | 'TEMPO' | 'BUS';

export type DriverStatus = 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'ON_LEAVE';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type RouteType = 'OFFICE_HOME' | 'HOME_OFFICE' | 'COLLEGE_HOME' | 'HOME_COLLEGE' | 'FIXED' | 'CUSTOM';

export type RouteStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export type TripStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'DELAYED' | 'COMPLETED' | 'CANCELLED';

export type BookingStatus = 'BOOKED' | 'CONFIRMED' | 'BOARDING' | 'ON_TRIP' | 'COMPLETED' | 'CANCELLED';

export type SOSType = 'MEDICAL' | 'ACCIDENT' | 'VEHICLE_BREAKDOWN' | 'SAFETY' | 'DRIVER_ISSUE' | 'OTHER';

export type SOSStatus = 'TRIGGERED' | 'RESPONDING' | 'RESOLVED' | 'DISMISSED';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';

// ─── User / Employee ─────────────────────────────────────────────

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  gender?: Gender;
  avatarUrl?: string;
  department?: string;
  designation?: string;
  building?: string;
  officeLocation: string;
  defaultPickup: string;
  defaultDrop: string;
  pickupLandmark?: string;
  dropLandmark?: string;
  locality?: string;
  shift: string;
  preferredRoute?: string;
  transportEligible: boolean;
  preferredVehicle?: VehicleType;
  accessibilityRequirements?: string;
  emergencyContact: EmergencyContact;
  accountStatus: AccountStatus;
}

// ─── Driver ──────────────────────────────────────────────────────

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenceNumber: string;
  licenceExpiry: string;
  assignedVehicle?: string;
  experience?: number;
  photoUrl?: string;
  rating?: number;
  totalTrips?: number;
  verificationStatus: VerificationStatus;
  currentStatus: DriverStatus;
}

// ─── Vehicle ─────────────────────────────────────────────────────

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  capacity: number;
  model: string;
  color?: string;
  registrationNumber: string;
  insuranceExpiry: string;
  fitnessCertificate: string;
  pollutionCertificate?: string;
  gpsDeviceId?: string;
  currentLocation?: LocationCoordinate;
  status: VehicleStatus;
  driverId?: string;
}

// ─── Location ────────────────────────────────────────────────────

export interface LocationCoordinate {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
}

// ─── Stop ────────────────────────────────────────────────────────

export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  sequenceNumber: number;
  expectedArrivalTime: string;
  passengerCount: number;
  type: 'PICKUP' | 'DROP';
}

// ─── Route ───────────────────────────────────────────────────────

export interface Route {
  id: string;
  name: string;
  startingPoint: string;
  destination: string;
  stops: Stop[];
  distance: number;
  estimatedTime: number;
  assignedVehicle?: string;
  assignedDriver?: string;
  capacity: number;
  occupiedSeats: number;
  status: RouteStatus;
  routeType: RouteType;
}

// ─── Trip ────────────────────────────────────────────────────────

export interface Trip {
  id: string;
  routeId: string;
  route?: Route;
  driverId: string;
  driver?: Driver;
  vehicleId: string;
  vehicle?: Vehicle;
  startTime: string;
  expectedArrival: string;
  actualArrival?: string;
  passengerCount: number;
  status: TripStatus;
  currentLocation?: LocationCoordinate;
  distanceTravelled: number;
  eta?: string;
}

// ─── Ride (Legacy - kept for backward compat) ────────────────────

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
  route?: Route;
  eta?: string;
  estimatedDistanceKm: number;
  estimatedDurationMins: number;
  routePolyline?: string;
  coPassengersCount?: number;
  otp?: string;
}

// ─── Booking ─────────────────────────────────────────────────────

export interface Booking {
  id: string;
  passengerId: string;
  passenger?: Employee;
  date: string;
  shift: ShiftType;
  pickupPoint: string;
  dropPoint: string;
  routeId: string;
  route?: Route;
  vehicleId?: string;
  vehicle?: Vehicle;
  seatNumber?: number;
  status: BookingStatus;
  checkInStatus: boolean;
  checkOutStatus: boolean;
  createdAt: string;
}

// ─── SOS ─────────────────────────────────────────────────────────

export interface SOSAlert {
  id: string;
  userId: string;
  tripId: string;
  location: LocationCoordinate;
  time: string;
  emergencyType: SOSType;
  description?: string;
  contactedPerson?: string;
  responseStatus: SOSStatus;
  resolutionTime?: string;
}

// ─── Feedback ────────────────────────────────────────────────────

export interface Feedback {
  id: string;
  tripId: string;
  passengerId: string;
  driverId: string;
  rating: number;
  comment?: string;
  safetyRating: number;
  vehicleRating: number;
  submittedDate: string;
}

// ─── Notification ────────────────────────────────────────────────

export type NotificationType =
  | 'RIDE_REMINDER'
  | 'DRIVER_ASSIGNED'
  | 'VEHICLE_APPROACHING'
  | 'RIDE_STARTED'
  | 'RIDE_COMPLETED'
  | 'SCHEDULE_CHANGE'
  | 'ANNOUNCEMENT'
  | 'ROUTE_DELAYED'
  | 'SOS_ALERT'
  | 'BOOKING_CONFIRMED'
  | 'CHECK_IN_REMINDER';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
  actionUrl?: string;
}

// ─── Booking Request ─────────────────────────────────────────────

export interface BookRideRequest {
  date: string;
  time: string;
  shiftType: ShiftType;
  pickupAddress: string;
  dropAddress: string;
  routeId?: string;
  notes?: string;
}
