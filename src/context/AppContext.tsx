import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Employee, Ride, NotificationItem, Route } from '../types';
import { MOCK_EMPLOYEE, MOCK_RIDES, MOCK_NOTIFICATIONS, MOCK_ACTIVE_RIDE, MOCK_ROUTE, MOCK_ROUTE_2 } from '../mock';
import { Colors } from '../constants/theme';
import { authService, rideService, notificationService } from '../services';

interface AppContextType {
  isLoggedIn: boolean;
  employee: Employee | null;
  login: (emailOrPhone: string, code: string) => Promise<void>;
  logout: () => Promise<void>;

  rides: Ride[];
  activeRide: Ride | null;
  refreshRides: () => Promise<void>;
  cancelRide: (rideId: string) => Promise<void>;
  bookRide: (req: any) => Promise<Ride>;

  routes: Route[];
  selectedRoute: Route | null;
  setSelectedRoute: (route: Route | null) => void;

  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  isDarkMode: boolean;
  toggleDarkMode: () => void;
  themeColors: typeof Colors.light;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [employee, setEmployee] = useState<Employee | null>(MOCK_EMPLOYEE);
  const [rides, setRides] = useState<Ride[]>(MOCK_RIDES);
  const [activeRide, setActiveRide] = useState<Ride | null>(MOCK_ACTIVE_RIDE);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [routes] = useState<Route[]>([MOCK_ROUTE, MOCK_ROUTE_2]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const themeColors = isDarkMode ? Colors.dark : Colors.light;

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const login = async (identifier: string, passOrOtp: string) => {
    const emp = await authService.login(identifier, passOrOtp);
    setEmployee(emp);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await authService.logout();
    setIsLoggedIn(false);
  };

  const refreshRides = async () => {
    const all = await rideService.getAllRides();
    setRides([...all]);
    const active = await rideService.getActiveRide();
    setActiveRide(active);
  };

  const cancelRide = async (rideId: string) => {
    await rideService.cancelRide(rideId);
    await refreshRides();
  };

  const bookRide = async (req: any) => {
    const newRide = await rideService.bookRide(req);
    await refreshRides();
    return newRide;
  };

  const markNotificationRead = (id: string) => {
    notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        employee,
        login,
        logout,
        rides,
        activeRide,
        refreshRides,
        cancelRide,
        bookRide,
        routes,
        selectedRoute,
        setSelectedRoute,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        isDarkMode,
        toggleDarkMode,
        themeColors,
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
