import React, { createContext, useContext, useState } from 'react';
import {
  Employee,
  Ride,
  NotificationItem,
  Route,
  SupervisorUser,
  SupervisorTrip,
  SupervisorDriver,
  SupervisorVehicle,
  SupervisorRoute,
  OperationalAlert,
  OperationalKPIs,
  DriverResponseState,
  TripStatus,
} from '../types';
import {
  MOCK_EMPLOYEE,
  MOCK_RIDES,
  MOCK_NOTIFICATIONS,
  MOCK_ACTIVE_RIDE,
  MOCK_ROUTE,
  MOCK_ROUTE_2,
  MOCK_SUPERVISOR,
  MOCK_KPIS,
  MOCK_ALERTS,
  MOCK_TRIPS,
  MOCK_DRIVERS,
  MOCK_VEHICLES,
  MOCK_ROUTES,
} from '../mock';
import { Colors } from '../constants/theme';
import { authService, rideService, notificationService } from '../services';

interface AppContextType {
  // Common / Employee
  isLoggedIn: boolean;
  employee: Employee | null;
  login: (emailOrPhone: string, code: string) => Promise<void>;
  logout: () => Promise<void>;

  rides: Ride[];
  activeRide: Ride | null;
  refreshRides: () => Promise<void>;
  cancelRide: (rideId: string) => Promise<void>;
  bookRide: (req: any) => Promise<Ride>;

  routes: any[];
  selectedRoute: Route | null;
  setSelectedRoute: (route: Route | null) => void;
  selectedRouteId: string;
  setSelectedRouteId: (id: string) => void;

  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  isDarkMode: boolean;
  toggleDarkMode: () => void;
  themeColors: typeof Colors.light;

  // Supervisor / Admin Panel State
  user: SupervisorUser;
  kpis: OperationalKPIs;
  alerts: OperationalAlert[];
  trips: SupervisorTrip[];
  drivers: SupervisorDriver[];
  vehicles: SupervisorVehicle[];

  selectedTripId: string;
  setSelectedTripId: (id: string) => void;
  selectedDriverId: string;
  setSelectedDriverId: (id: string) => void;
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;

  assignDriverToTrip: (tripId: string, driverId: string) => Promise<void>;
  simulateDriverResponse: (tripId: string, driverId: string, response: DriverResponseState) => Promise<void>;
  createTrip: (tripData: {
    origin: string;
    destination: string;
    date: string;
    time: string;
    passengersCount: number;
    routeId: string;
    vehicleId: string;
    driverId: string;
  }) => Promise<SupervisorTrip>;
  resolveAlert: (alertId: string) => void;
  changeVehicleForTrip: (tripId: string, vehicleId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [employee, setEmployee] = useState<Employee | null>(MOCK_EMPLOYEE);
  const [user, setUser] = useState<SupervisorUser>(MOCK_SUPERVISOR);

  const [rides, setRides] = useState<Ride[]>(MOCK_RIDES);
  const [activeRide, setActiveRide] = useState<Ride | null>(MOCK_ACTIVE_RIDE);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // Supervisor state
  const [kpis, setKpis] = useState<OperationalKPIs>(MOCK_KPIS);
  const [alerts, setAlerts] = useState<OperationalAlert[]>(MOCK_ALERTS);
  const [trips, setTrips] = useState<SupervisorTrip[]>(MOCK_TRIPS);
  const [drivers, setDrivers] = useState<SupervisorDriver[]>(MOCK_DRIVERS);
  const [vehicles, setVehicles] = useState<SupervisorVehicle[]>(MOCK_VEHICLES);
  const [routesList, setRoutesList] = useState<any[]>([MOCK_ROUTE, MOCK_ROUTE_2, ...MOCK_ROUTES]);

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-1');
  const [selectedTripId, setSelectedTripId] = useState<string>('trip-3821');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('drv-1');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('veh-1');

  const themeColors = isDarkMode ? Colors.dark : Colors.light;

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const login = async (identifier: string, passOrOtp: string) => {
    try {
      const emp = await authService.login(identifier, passOrOtp);
      setEmployee(emp);
    } catch {
      setEmployee(MOCK_EMPLOYEE);
    }
    setUser({
      ...MOCK_SUPERVISOR,
      email: identifier.includes('@') ? identifier : 'govind@36route.com',
    });
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {}
    setIsLoggedIn(false);
  };

  const refreshRides = async () => {
    try {
      const all = await rideService.getAllRides();
      setRides([...all]);
      const active = await rideService.getActiveRide();
      setActiveRide(active);
    } catch {
      setRides(MOCK_RIDES);
      setActiveRide(MOCK_ACTIVE_RIDE);
    }
  };

  const cancelRide = async (rideId: string) => {
    try {
      await rideService.cancelRide(rideId);
      await refreshRides();
    } catch {
      setRides((prev) => prev.filter((r) => r.id !== rideId));
    }
  };

  const bookRide = async (req: any) => {
    try {
      const newRide = await rideService.bookRide(req);
      await refreshRides();
      return newRide;
    } catch {
      const fallbackRide = MOCK_RIDES[0];
      return fallbackRide;
    }
  };

  const markNotificationRead = (id: string) => {
    try {
      notificationService.markAsRead(id);
    } catch {}
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    try {
      notificationService.markAllAsRead();
    } catch {}
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const assignDriverToTrip = async (tripId: string, driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;

    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id === tripId) {
          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes()
          ).padStart(2, '0')}`;
          return {
            ...t,
            driverId: driver.id,
            driverName: driver.name,
            driverPhone: driver.phone,
            driverStatus: 'Assigned',
            vehicleModel: driver.assignedVehicleModel,
            vehiclePlate: driver.assignedVehiclePlate,
            status: 'Assigned' as TripStatus,
            attentionReason: undefined,
            events: [
              ...t.events,
              {
                id: `e-assign-${Date.now()}`,
                time: timeStr,
                title: 'Driver assigned',
                detail: `${driver.name} assigned by supervisor`,
                type: 'info' as const,
              },
            ],
          };
        }
        return t;
      })
    );

    setAlerts((prevAlerts) =>
      prevAlerts.map((a) => (a.tripId === tripId ? { ...a, resolved: true } : a))
    );
  };

  const simulateDriverResponse = async (
    tripId: string,
    driverId: string,
    response: DriverResponseState
  ) => {
    const driver = drivers.find((d) => d.id === driverId);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    if (response === 'Accepted') {
      setTrips((prev) =>
        prev.map((t) => {
          if (t.id === tripId) {
            return {
              ...t,
              status: 'Assigned' as TripStatus,
              driverStatus: 'Accepted',
              events: [
                ...t.events,
                {
                  id: `e-resp-${Date.now()}`,
                  time: timeStr,
                  title: 'Driver accepted',
                  detail: `${driver?.name || 'Driver'} accepted trip assignment`,
                  type: 'success' as const,
                },
              ],
            };
          }
          return t;
        })
      );
    } else if (response === 'Declined') {
      setTrips((prev) =>
        prev.map((t) => {
          if (t.id === tripId) {
            return {
              ...t,
              status: 'Needs Attention' as TripStatus,
              driverId: undefined,
              driverName: undefined,
              driverStatus: undefined,
              attentionReason: 'Driver declined (reassignment recommended)',
              events: [
                ...t.events,
                {
                  id: `e-resp-${Date.now()}`,
                  time: timeStr,
                  title: 'Driver declined assignment',
                  detail: `${driver?.name || 'Driver'} declined. Recommending next best driver.`,
                  type: 'error' as const,
                },
              ],
            };
          }
          return t;
        })
      );
    }
  };

  const createTrip = async (data: {
    origin: string;
    destination: string;
    date: string;
    time: string;
    passengersCount: number;
    routeId: string;
    vehicleId: string;
    driverId: string;
  }) => {
    const route = routesList.find((r) => r.id === data.routeId) || routesList[0];
    const driver = drivers.find((d) => d.id === data.driverId);
    const vehicle = vehicles.find((v) => v.id === data.vehicleId);

    const tripNum = `#${3820 + trips.length + 1}`;
    const newTrip: SupervisorTrip = {
      id: `trip-${Date.now()}`,
      tripNumber: `Trip ${tripNum}`,
      scheduledTime: data.time || '08:45',
      routeOrigin: data.origin || (route?.name ? route.name.split('→')[0].trim() : 'Origin'),
      routeDestination: data.destination || (route?.name ? route.name.split('→')[1]?.trim() || 'Destination' : 'Destination'),
      routeSummary: `${data.origin || (route?.name ? route.name.split('→')[0].trim() : 'Origin')} → ${
        data.destination || (route?.name ? route.name.split('→')[1]?.trim() || 'Destination' : 'Destination')
      }`,
      routeId: route?.id || 'route-1',
      passengerCount: data.passengersCount || 10,
      maxCapacity: vehicle?.capacity || 14,
      status: driver ? 'Assigned' : 'Needs Attention',
      driverId: driver?.id,
      driverName: driver?.name,
      driverPhone: driver?.phone,
      driverStatus: driver ? 'Assigned' : undefined,
      vehicleId: vehicle?.id,
      vehicleModel: vehicle?.model || driver?.assignedVehicleModel,
      vehiclePlate: vehicle?.plateNumber || driver?.assignedVehiclePlate,
      attentionReason: driver ? undefined : 'Driver required',
      stops: route?.stops || [],
      passengers: [],
      events: [
        {
          id: `e-new-${Date.now()}`,
          time: data.time || '08:45',
          title: 'Trip created by supervisor',
          detail: `Route: ${route?.name || 'Custom'}`,
          type: 'info',
        },
      ],
    };

    setTrips((prev) => [newTrip, ...prev]);
    setKpis((prev) => ({
      ...prev,
      totalTripsToday: prev.totalTripsToday + 1,
      upcomingTrips: prev.upcomingTrips + 1,
    }));

    return newTrip;
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a)));
  };

  const changeVehicleForTrip = (tripId: string, vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return;
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? {
              ...t,
              vehicleId: vehicle.id,
              vehicleModel: vehicle.model,
              vehiclePlate: vehicle.plateNumber,
              events: [
                ...t.events,
                {
                  id: `e-veh-${Date.now()}`,
                  time: 'Just now',
                  title: 'Vehicle updated',
                  detail: `Changed to ${vehicle.model} (${vehicle.plateNumber})`,
                  type: 'info',
                },
              ],
            }
          : t
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        employee,
        user,
        login,
        logout,
        rides,
        activeRide,
        refreshRides,
        cancelRide,
        bookRide,
        routes: routesList,
        selectedRoute,
        setSelectedRoute,
        selectedRouteId,
        setSelectedRouteId,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        isDarkMode,
        toggleDarkMode,
        themeColors,

        // Supervisor / Admin Panel
        kpis,
        alerts,
        trips,
        drivers,
        vehicles,
        selectedTripId,
        setSelectedTripId,
        selectedDriverId,
        setSelectedDriverId,
        selectedVehicleId,
        setSelectedVehicleId,
        assignDriverToTrip,
        simulateDriverResponse,
        createTrip,
        resolveAlert,
        changeVehicleForTrip,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
