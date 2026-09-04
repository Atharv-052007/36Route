// ─── Enums & Status Types ────────────────────────────────────────

export type RideStatus = 'SCHEDULED' | 'BOARDING' | 'IN_TRANSIT' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED';

export type ShiftType = 'PICKUP' | 'DROP';

export type VehicleStatus = 'AVAILABLE' | 'ON_TRIP' | 'MAINTENANCE' | 'OFFLINE';

export type VehicleType = 'SEDAN' | 'SUV' | 'HATCHBACK' | 'TEMPO' | 'BUS';

export type DriverStatus = 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'ON_LEAVE';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type RouteType = 'OFFICE_HOME' | 'HOME_OFFICE' | 'COLLEGE_HOME' | 'HOME_COLLEGE' | 'FIXED' | 'CUSTOM';

export type RouteStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export type TripStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'DELAYED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'Upcoming'
  | 'Assigned'
  | 'Ongoing'
  | 'Needs Attention'
  | 'Completed';

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

// ─── Supervisor Passenger ─────────────────────────────────────────────
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

// ─── Supervisor Driver ────────────────────────────────────────────────
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
  onTimePerformance: number;
  acceptanceRate: number;
  rating: number;
}

// ─── Supervisor Vehicle ───────────────────────────────────────────────
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

// ─── Route Stop ───────────────────────────────────────────────────────
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

// ─── Supervisor Route ─────────────────────────────────────────────────
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

// ─── Supervisor Trip ──────────────────────────────────────────────────
export interface SupervisorTrip {
  id: string;
  tripNumber: string;
  scheduledTime: string;
  routeOrigin: string;
  routeDestination: string;
  routeSummary: string;
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
  matchScore: number;
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
