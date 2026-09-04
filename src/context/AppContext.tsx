import React, { createContext, useContext, useState } from 'react';
import {
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
  MOCK_SUPERVISOR,
  MOCK_KPIS,
  MOCK_ALERTS,
  MOCK_TRIPS,
  MOCK_DRIVERS,
  MOCK_VEHICLES,
  MOCK_ROUTES,
  MOCK_NOTIFICATIONS,
  MOCK_EMPLOYEE,
} from '../mock';
import { Colors } from '../constants/theme';

interface AppContextType {
  isLoggedIn: boolean;
  user: SupervisorUser;
  login: (emailOrId: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;

  kpis: OperationalKPIs;
  alerts: OperationalAlert[];
  trips: SupervisorTrip[];
  drivers: SupervisorDriver[];
  vehicles: SupervisorVehicle[];
  routes: SupervisorRoute[];

  // Selected entities for drill-down views
  selectedTripId: string;
  setSelectedTripId: (id: string) => void;
  selectedDriverId: string;
  setSelectedDriverId: (id: string) => void;
  selectedVehicleId: string;
  setSelectedVehicleId: (id: string) => void;
  selectedRouteId: string;
  setSelectedRouteId: (id: string) => void;

  // Operational Actions
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

  // Theme & Appearance
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  themeColors: typeof Colors.light;

  // Backward compatibility
  employee: any;
  rides: any[];
  activeRide: any;
  notifications: any[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  bookRide: (req: any) => Promise<any>;
  cancelRide: (rideId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Logged in by default for supervisor demo
  const [user, setUser] = useState<SupervisorUser>(MOCK_SUPERVISOR);

  const [kpis, setKpis] = useState<OperationalKPIs>(MOCK_KPIS);
  const [alerts, setAlerts] = useState<OperationalAlert[]>(MOCK_ALERTS);
  const [trips, setTrips] = useState<SupervisorTrip[]>(MOCK_TRIPS);
  const [drivers, setDrivers] = useState<SupervisorDriver[]>(MOCK_DRIVERS);
  const [vehicles, setVehicles] = useState<SupervisorVehicle[]>(MOCK_VEHICLES);
  const [routes, setRoutes] = useState<SupervisorRoute[]>(MOCK_ROUTES);
  const [notifications, setNotifications] = useState<any[]>(MOCK_NOTIFICATIONS);

  const [selectedTripId, setSelectedTripId] = useState<string>('trip-3821');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('drv-1');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('veh-1');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-1');

  const themeColors = isDarkMode ? Colors.dark : Colors.light;
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const login = async (emailOrId: string, pass: string) => {
    // Authenticate supervisor
    setUser({
      ...MOCK_SUPERVISOR,
      email: emailOrId.includes('@') ? emailOrId : 'govind@36route.com',
    });
    setIsLoggedIn(true);
  };

  const logout = async () => {
    setIsLoggedIn(false);
  };

  const assignDriverToTrip = async (tripId: string, driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;

    // Update trip status to Assigned and add timeline event
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

    // Update KPI & resolved alerts
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
    const route = routes.find((r) => r.id === data.routeId) || routes[0];
    const driver = drivers.find((d) => d.id === data.driverId);
    const vehicle = vehicles.find((v) => v.id === data.vehicleId);

    const tripNum = `#${3820 + trips.length + 1}`;
    const newTrip: SupervisorTrip = {
      id: `trip-${Date.now()}`,
      tripNumber: `Trip ${tripNum}`,
      scheduledTime: data.time || '08:45',
      routeOrigin: data.origin || route.name.split('→')[0].trim(),
      routeDestination: data.destination || route.name.split('→')[1].trim(),
      routeSummary: `${data.origin || route.name.split('→')[0].trim()} → ${
        data.destination || route.name.split('→')[1].trim()
      }`,
      routeId: route.id,
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
      stops: route.stops,
      passengers: [],
      events: [
        {
          id: `e-new-${Date.now()}`,
          time: data.time || '08:45',
          title: 'Trip created by supervisor',
          detail: `Route: ${route.name}`,
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

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        kpis,
        alerts,
        trips,
        drivers,
        vehicles,
        routes,
        selectedTripId,
        setSelectedTripId,
        selectedDriverId,
        setSelectedDriverId,
        selectedVehicleId,
        setSelectedVehicleId,
        selectedRouteId,
        setSelectedRouteId,
        assignDriverToTrip,
        simulateDriverResponse,
        createTrip,
        resolveAlert,
        changeVehicleForTrip,
        isDarkMode,
        toggleDarkMode,
        themeColors,

        // backward compat
        employee: MOCK_EMPLOYEE,
        rides: [],
        activeRide: null,
        notifications,
        unreadNotificationCount: notifications.filter((n) => !n.read).length,
        markNotificationRead,
        markAllNotificationsRead,
        bookRide: async () => ({ id: 'ride-1' }),
        cancelRide: async () => {},
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
