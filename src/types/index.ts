// ─── 36Route Supervisor Operational Statuses ─────────────────────────────
export type OperationalStatus =
  | 'Available'
  | 'On Trip'
  | 'Upcoming'
  | 'Assigned'
  | 'Ongoing'
  | 'Completed'
  | 'Cancelled'
  | 'Needs Attention'
  | 'Maintenance'
  | 'Unavailable';

export type SupervisorDriverStatus = 'Available' | 'On Trip' | 'Unavailable';
export type SupervisorVehicleStatus = 'Available' | 'On Trip' | 'Maintenance';
export type TripStatus = 'Upcoming' | 'Assigned' | 'Ongoing' | 'Completed' | 'Needs Attention' | 'Cancelled';
export type PassengerStatus = 'Boarded' | 'Waiting' | 'No-show';

export type DriverResponseState =
  | 'Pending'
  | 'Accepted'
  | 'Declined'
  | 'No response'
  | 'Busy'
  | 'Vehicle unavailable';

// ─── Supervisor User ──────────────────────────────────────────────────
export interface SupervisorUser {
  id: string;
  name: string;
  email: string;
  role: string;
  hub: string;
  phone: string;
  avatarUrl?: string;
}

// ─── Passenger Item ───────────────────────────────────────────────────
export interface SupervisorPassenger {
  id: string;
  name: string;
  phone: string;
  pickupPoint: string;
  dropPoint: string;
  status: PassengerStatus;
  seatNumber?: number;
  department?: string;
}

// ─── Driver ───────────────────────────────────────────────────────────
export interface SupervisorDriver {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'Available' | 'On Trip' | 'Unavailable';
  assignedVehicleModel: string;
  assignedVehiclePlate: string;
  currentTripId?: string;
  currentTripRoute?: string;
  nextTripTime?: string;
  todayTrips: number;
  completedTrips: number;
  upcomingTrips: number;
  onTimePerformance: number; // percentage e.g. 96
  acceptanceRate: number;    // percentage e.g. 94
  rating: number;
}

// ─── Vehicle ──────────────────────────────────────────────────────────
export interface SupervisorVehicle {
  id: string;
  model: string;
  plateNumber: string;
  status: 'Available' | 'On Trip' | 'Maintenance';
  capacity: number;
  currentDriverId?: string;
  currentDriverName?: string;
  todayTrips: number;
  todayDistanceKm: number;
  documents: {
    insurance: boolean;
    permit: boolean;
    fitness: boolean;
  };
  nextServiceKm: number;
}

// ─── Stop ─────────────────────────────────────────────────────────────
export interface RouteStop {
  id: string;
  name: string;
  sequence: number;
  time?: string;
  isOrigin?: boolean;
  isDestination?: boolean;
  pickupCount?: number;
  dropCount?: number;
}

// ─── Route ────────────────────────────────────────────────────────────
export interface SupervisorRoute {
  id: string;
  name: string;
  stopsCount: number;
  distanceKm: number;
  typicalPassengers: number;
  estimatedMinutes: number;
  stops: RouteStop[];
  startingPoint?: string;
  destination?: string;
  distance?: number;
  capacity?: number;
  occupiedSeats?: number;
}


// ─── Chronological Trip Event ─────────────────────────────────────────
export interface TripTimelineEvent {
  id: string;
  time: string;
  title: string;
  detail?: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// ─── Trip ─────────────────────────────────────────────────────────────
export interface SupervisorTrip {
  id: string;
  tripNumber: string; // e.g. "#3821"
  scheduledTime: string; // e.g. "07:30"
  routeOrigin: string; // e.g. "Kothrud"
  routeDestination: string; // e.g. "Hinjewadi"
  routeSummary: string; // e.g. "Kothrud → Hinjewadi"
  routeId: string;
  passengerCount: number;
  maxCapacity: number;
  status: TripStatus;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverStatus?: string;
  vehicleId?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
  attentionReason?: string;
  stops: RouteStop[];
  passengers: SupervisorPassenger[];
  events: TripTimelineEvent[];
}

// ─── Dispatch Recommendation ──────────────────────────────────────────
export interface DriverRecommendation {
  driverId: string;
  driverName: string;
  phone: string;
  vehicleModel: string;
  vehiclePlate: string;
  matchScore: number; // e.g. 91
  reasons: string[];
  currentWorkload: string;
  distanceToPickup: string;
  rating: number;
}

// ─── Operational Alert ────────────────────────────────────────────────
export interface OperationalAlert {
  id: string;
  type: 'driver_required' | 'vehicle_unavailable' | 'passenger_noshow' | 'delayed';
  title: string;
  subtitle: string;
  time: string;
  tripId?: string;
  resolved: boolean;
  actionRoute?: string;
}

// ─── Operational KPIs ─────────────────────────────────────────────────
export interface OperationalKPIs {
  totalTripsToday: number;
  totalDrivers: number;
  totalVehicles: number;
  ongoingTrips: number;
  upcomingTrips: number;
  completedTrips: number;
  needsAttentionTrips: number;
  driversAvailable: number;
  driversOnTrip: number;
  driversUnavailable: number;
  vehiclesAvailable: number;
  vehiclesOnTrip: number;
  vehiclesMaintenance: number;
  completionRate: number;
  averageOccupancy: number;
  vehicleUtilization: number;
  onTimePerformance: number;
  averageCostPerKm: number;
}

// ─── Legacy / Backward compatibility types ────────────────────────────
export type RideStatus = 'SCHEDULED' | 'BOARDING' | 'IN_TRANSIT' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED';
export type ShiftType = 'PICKUP' | 'DROP';
export type VehicleStatus = 'AVAILABLE' | 'ON_TRIP' | 'MAINTENANCE' | 'OFFLINE';
export type VehicleType = 'SEDAN' | 'SUV' | 'HATCHBACK' | 'TEMPO' | 'BUS';
export type DriverStatus = 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'ON_LEAVE' | 'Available' | 'On Trip' | 'Unavailable';
export type RouteType = 'OFFICE_HOME' | 'HOME_OFFICE' | 'COLLEGE_HOME' | 'HOME_COLLEGE' | 'FIXED' | 'CUSTOM';
export type RouteStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
export type BookingStatus = 'BOOKED' | 'CONFIRMED' | 'BOARDING' | 'ON_TRIP' | 'COMPLETED' | 'CANCELLED';
export type SOSType = 'MEDICAL' | 'ACCIDENT' | 'VEHICLE_BREAKDOWN' | 'SAFETY' | 'DRIVER_ISSUE' | 'OTHER';
export type SOSStatus = 'TRIGGERED' | 'RESPONDING' | 'RESOLVED' | 'DISMISSED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';

export interface LocationCoordinate {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
}

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
  verificationStatus?: string;
  currentStatus: any;
}

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
  status: any;
  driverId?: string;
}

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

export interface Route {
  id: string;
  name: string;
  startingPoint: string;
  destination: string;
  stops: Stop[];
  distance: number;
  estimatedTime: number;
  capacity: number;
  occupiedSeats: number;
  status: RouteStatus;
  routeType: RouteType;
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
  route?: Route;
  eta?: string;
  estimatedDistanceKm: number;
  estimatedDurationMins: number;
  routePolyline?: string;
  coPassengersCount?: number;
  otp?: string;
}

export interface BookRideRequest {
  date: string;
  time: string;
  shiftType: ShiftType;
  pickupAddress: string;
  dropAddress: string;
  routeId?: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: any;
  actionUrl?: string;
}
