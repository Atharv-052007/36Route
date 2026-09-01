import { MOCK_EMPLOYEE, MOCK_RIDES, MOCK_NOTIFICATIONS, MOCK_ACTIVE_RIDE } from '../mock';
import { Employee, Ride, NotificationItem, BookRideRequest, RideStatus } from '../types';

export const authService = {
  login: async (identifier: string, passOrOtp: string): Promise<Employee> => {
    await new Promise((res) => setTimeout(res, 800)); // Simulate network latency
    if (!identifier || !passOrOtp) {
      throw new Error('Please provide valid credentials or OTP');
    }
    return MOCK_EMPLOYEE;
  },
  logout: async (): Promise<void> => {
    await new Promise((res) => setTimeout(res, 300));
  },
  getEmployeeProfile: async (): Promise<Employee> => {
    await new Promise((res) => setTimeout(res, 400));
    return MOCK_EMPLOYEE;
  },
};

export const rideService = {
  getActiveRide: async (): Promise<Ride | null> => {
    await new Promise((res) => setTimeout(res, 500));
    return MOCK_ACTIVE_RIDE;
  },
  getAllRides: async (): Promise<Ride[]> => {
    await new Promise((res) => setTimeout(res, 600));
    return MOCK_RIDES;
  },
  getRideById: async (rideId: string): Promise<Ride | undefined> => {
    await new Promise((res) => setTimeout(res, 400));
    return MOCK_RIDES.find((r) => r.id === rideId) || MOCK_ACTIVE_RIDE;
  },
  bookRide: async (req: BookRideRequest): Promise<Ride> => {
    await new Promise((res) => setTimeout(res, 1000));
    const newRide: Ride = {
      id: `rd-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: `36R-${Math.floor(1000 + Math.random() * 9000)}-IN`,
      date: req.date,
      time: req.time,
      shiftType: req.shiftType,
      status: 'SCHEDULED',
      pickup: {
        latitude: 12.9121,
        longitude: 77.6446,
        address: req.pickupAddress,
        name: 'Pickup Location',
      },
      drop: {
        latitude: 12.8399,
        longitude: 77.677,
        address: req.dropAddress,
        name: 'Drop Location',
      },
      estimatedDistanceKm: 14.5,
      estimatedDurationMins: 35,
      otp: `${Math.floor(1000 + Math.random() * 9000)}`,
    };
    MOCK_RIDES.unshift(newRide);
    return newRide;
  },
  cancelRide: async (rideId: string): Promise<boolean> => {
    await new Promise((res) => setTimeout(res, 600));
    const target = MOCK_RIDES.find((r) => r.id === rideId);
    if (target) {
      target.status = 'CANCELLED';
    }
    return true;
  },
};

export const notificationService = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    await new Promise((res) => setTimeout(res, 400));
    return MOCK_NOTIFICATIONS;
  },
  markAsRead: async (id: string): Promise<void> => {
    const item = MOCK_NOTIFICATIONS.find((n) => n.id === id);
    if (item) item.read = true;
  },
  markAllAsRead: async (): Promise<void> => {
    MOCK_NOTIFICATIONS.forEach((n) => (n.read = true));
  },
};

export const locationService = {
  getCurrentVehicleLocation: async () => {
    return {
      latitude: 12.875,
      longitude: 77.658,
      speedKmH: 42,
      heading: 140,
    };
  },
};
