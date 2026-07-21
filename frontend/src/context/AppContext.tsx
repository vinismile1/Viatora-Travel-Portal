import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserPreferences,
  Destination,
  Hotel,
  Restaurant,
  Attraction,
  Trip,
  TripItem,
  Booking,
  Notification,
  Expense,
  AIConversation
} from '../types';

import { api } from '../services/api';

// ============================================================
// API CONFIGURATION
// ============================================================

const API_URL = (import.meta.env as { readonly VITE_API_URL?: string }).VITE_API_URL || 'http://localhost:3000';

// Helper function to build API URLs
const apiUrl = (endpoint: string) => `${API_URL}${endpoint}`;

// ============================================================
// CONTEXT TYPES
// ============================================================

interface AppContextType {
  user: User | null;
  token: string | null;
  preferences: UserPreferences | null;
  destinations: Destination[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  attractions: Attraction[];
  trips: Trip[];
  bookings: Booking[];
  savedPlaces: any[];
  notifications: Notification[];
  expenses: Expense[];
  loading: boolean;

  activeTab: 'home' | 'bookings' | 'trips' | 'saved' | 'profile';
  activeMode: 'all' | 'travel' | 'food' | 'explore' | 'guide';
  searchQuery: string;

  setActiveTab: (
    tab: 'home' | 'bookings' | 'trips' | 'saved' | 'profile'
  ) => void;

  setActiveMode: (
    mode: 'all' | 'travel' | 'food' | 'explore' | 'guide'
  ) => void;

  setSearchQuery: (query: string) => void;

  // Auth
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<boolean>;

  login: (
    email: string,
    password: string
  ) => Promise<boolean>;

  logout: () => void;

  updatePrefs: (
    prefs: Partial<UserPreferences>
  ) => Promise<void>;

  // Trips
  fetchTrips: () => Promise<void>;

  createTrip: (
    destinationId: string,
    title: string,
    startDate: string,
    endDate: string
  ) => Promise<any>;

  deleteTrip: (
    tripId: string
  ) => Promise<void>;

  fetchTripItems: (
    tripId: string
  ) => Promise<TripItem[]>;

  addTripItem: (
    tripId: string,
    item: Omit<TripItem, 'id' | 'tripId' | 'completed'>
  ) => Promise<TripItem | null>;

  deleteTripItem: (
    itemId: string
  ) => Promise<void>;

  toggleTripItem: (
    itemId: string
  ) => Promise<void>;

  generateAIItinerary: (
    destinationId: string,
    startDate: string,
    endDate: string,
    style: string
  ) => Promise<any>;

  // Bookings
  fetchBookings: () => Promise<void>;

  createBooking: (
    booking: Omit<Booking, 'id' | 'userId' | 'status'>
  ) => Promise<Booking | null>;

  cancelBooking: (
    bookingId: string
  ) => Promise<void>;

  // Saved Places
  fetchSaved: () => Promise<void>;

  toggleSave: (
    placeId: string,
    type: 'destination' | 'hotel' | 'restaurant' | 'attraction'
  ) => Promise<void>;

  // Notifications
  fetchNotifications: () => Promise<void>;

  markAsRead: (
    notifId: string
  ) => Promise<void>;

  markAllRead: () => Promise<void>;

  // Expenses
  fetchExpenses: (
    tripId?: string
  ) => Promise<Expense[]>;

  addExpense: (
    expense: Omit<Expense, 'id' | 'userId'>
  ) => Promise<Expense | null>;

  deleteExpense: (
    expenseId: string
  ) => Promise<void>;

  // AI Chat
  sendAIChat: (
    message: string,
    conversationId?: string
  ) => Promise<{
    text: string;
    conversationId: string;
  }>;

  getAIConversations: () => Promise<AIConversation[]>;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

// ============================================================
// CONTEXT
// ============================================================

const AppContext = createContext<AppContextType | undefined>(
  undefined
);

// ============================================================
// APP PROVIDER
// ============================================================

export function AppProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem('viatora_token')
  );

  const [preferences, setPreferences] =
    useState<UserPreferences | null>(null);

  const [destinations, setDestinations] =
    useState<Destination[]>([]);

  const [hotels, setHotels] =
    useState<Hotel[]>([]);

  const [restaurants, setRestaurants] =
    useState<Restaurant[]>([]);

  const [attractions, setAttractions] =
    useState<Attraction[]>([]);

  const [trips, setTrips] =
    useState<Trip[]>([]);

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [savedPlaces, setSavedPlaces] =
    useState<any[]>([]);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [loading, setLoading] =
    useState(true);

  // ============================================================
  // NAVIGATION & FILTER STATES
  // ============================================================

  const [activeTab, setActiveTab] =
    useState<
      'home' | 'bookings' | 'trips' | 'saved' | 'profile'
    >('home');

  const [activeMode, setActiveMode] =
    useState<
      'all' | 'travel' | 'food' | 'explore' | 'guide'
    >('all');

  const [searchQuery, setSearchQuery] =
    useState('');

  // ============================================================
  // THEME
  // ============================================================

  const [theme, setTheme] =
    useState<'dark' | 'light'>(() => {
      return (
        (localStorage.getItem(
          'viatora_theme'
        ) as 'dark' | 'light') || 'dark'
      );
    });

  useEffect(() => {
    const root =
      window.document.documentElement;

    root.classList.remove('light', 'dark');

    root.classList.add(theme);

    localStorage.setItem(
      'viatora_theme',
      theme
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev =>
      prev === 'dark'
        ? 'light'
        : 'dark'
    );
  };


 // ============================================================
// FETCH STATIC DIRECTORY DATA
// ============================================================

useEffect(() => {
  async function initData() {
    try {
      const [
        destData,
        hotelData,
        restData,
        attrData
      ] = await Promise.all([
        api.get<Destination[]>('/api/destinations'),
        api.get<Hotel[]>('/api/hotels'),
        api.get<Restaurant[]>('/api/restaurants'),
        api.get<Attraction[]>('/api/attractions')
      ]);

      setDestinations(
        Array.isArray(destData) ? destData : []
      );

      setHotels(
        Array.isArray(hotelData) ? hotelData : []
      );

      setRestaurants(
        Array.isArray(restData) ? restData : []
      );

      setAttractions(
        Array.isArray(attrData) ? attrData : []
      );

    } catch (error) {
      console.error(
        'Error fetching directory data:',
        error
      );
    } finally {
      setLoading(false);
    }
  }

  initData();
}, []);

  // ============================================================
// FETCH USER DATA WHEN TOKEN CHANGES
// ============================================================

useEffect(() => {
  if (!token) {
    setUser(null);
    setPreferences(null);
    setTrips([]);
    setBookings([]);
    setSavedPlaces([]);
    setNotifications([]);
    setExpenses([]);

    return;
  }

  async function loadUserData() {
    try {
      // ========================================================
      // CURRENT USER
      // ========================================================

      const meData = await api.get<{
        user: User;
      }>('/api/auth/me', token);

      setUser(meData.user);

      // ========================================================
      // USER DATA
      // ========================================================

      const [
        prefData,
        tripsData,
        bookingsData,
        savedData,
        notificationsData,
        expensesData
      ] = await Promise.all([
        api.get<UserPreferences>(
          '/api/users/preferences',
          token
        ),

        api.get<Trip[]>(
          '/api/trips',
          token
        ),

        api.get<Booking[]>(
          '/api/bookings',
          token
        ),

        api.get<any[]>(
          '/api/saved',
          token
        ),

        api.get<Notification[]>(
          '/api/notifications',
          token
        ),

        api.get<Expense[]>(
          '/api/expenses',
          token
        )
      ]);

      // ========================================================
      // UPDATE STATE
      // ========================================================

      setPreferences(prefData || null);

      setTrips(
        Array.isArray(tripsData)
          ? tripsData
          : []
      );

      setBookings(
        Array.isArray(bookingsData)
          ? bookingsData
          : []
      );

      setSavedPlaces(
        Array.isArray(savedData)
          ? savedData
          : []
      );

      setNotifications(
        Array.isArray(notificationsData)
          ? notificationsData
          : []
      );

      setExpenses(
        Array.isArray(expensesData)
          ? expensesData
          : []
      );

    } catch (error) {
      console.error(
        'Failed loading user data:',
        error
      );
    }
  }

  loadUserData();

}, [token]);

  // ============================================================
  // AUTH OPERATIONS
  // ============================================================

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      const res = await fetch(
        apiUrl('/api/auth/register'),
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
          'Registration failed'
        );
      }

      setUser(data.user);
      setToken(data.token);

      localStorage.setItem(
        'viatora_token',
        data.token
      );

      return true;

    } catch (err: any) {
      alert(err.message);
      return false;
    }
  };

  const login = async (
    email: string,
    password: string
  ) => {
    try {
      const res = await fetch(
        apiUrl('/api/auth/login'),
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
          'Login failed'
        );
      }

      setUser(data.user);
      setToken(data.token);

      localStorage.setItem(
        'viatora_token',
        data.token
      );

      return true;

    } catch (err: any) {
      alert(err.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem(
      'viatora_token'
    );

    setActiveTab('home');
  };

  // ============================================================
  // USER PREFERENCES
  // ============================================================

  const updatePrefs = async (
    prefs: Partial<UserPreferences>
  ) => {
    if (!token) return;

    try {
      const res = await fetch(
        apiUrl('/api/users/preferences'),
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify(prefs)
        }
      );

      const data =
        await res.json();

      setPreferences(data);

    } catch (err) {
      console.error(
        'Failed updating preferences:',
        err
      );
    }
  };

  // ============================================================
  // TRIPS
  // ============================================================

  const fetchTrips = async () => {
  if (!token) return;

  try {
    const data =
      await api.get<Trip[]>(
        '/api/trips',
        token
      );

    setTrips(data);

  } catch (error) {
    console.error(
      'Failed to fetch trips:',
      error
    );
  }
};

  const createTrip = async (
    destinationId: string,
    title: string,
    startDate: string,
    endDate: string
  ) => {
    if (!token) return null;

    const res = await fetch(
      apiUrl('/api/trips'),
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${token}`
        },

        body: JSON.stringify({
          destinationId,
          title,
          startDate,
          endDate
        })
      }
    );

    const data =
      await res.json();

    if (res.ok) {
      await fetchTrips();
      await fetchNotifications();
    }

    return data;
  };

  const deleteTrip = async (
    tripId: string
  ) => {
    if (!token) return;

    const res = await fetch(
      apiUrl(`/api/trips/${tripId}`),
      {
        method: 'DELETE',

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    if (res.ok) {
      setTrips(prev =>
        prev.filter(
          t => t.id !== tripId
        )
      );
    }
  };

  const fetchTripItems = async (
    tripId: string
  ): Promise<TripItem[]> => {
    if (!token) return [];

    const res = await fetch(
      apiUrl(
        `/api/trips/${tripId}/items`
      ),
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    return res.ok
      ? await res.json()
      : [];
  };

  const addTripItem = async (
    tripId: string,
    item: Omit<
      TripItem,
      'id' | 'tripId' | 'completed'
    >
  ) => {
    if (!token) return null;

    const res = await fetch(
      apiUrl(
        `/api/trips/${tripId}/items`
      ),
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${token}`
        },

        body: JSON.stringify(item)
      }
    );

    return res.ok
      ? await res.json()
      : null;
  };

  const deleteTripItem = async (
    itemId: string
  ) => {
    if (!token) return;

    await fetch(
      apiUrl(
        `/api/trips/items/${itemId}`
      ),
      {
        method: 'DELETE',

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );
  };

  const toggleTripItem = async (
    itemId: string
  ) => {
    if (!token) return;

    await fetch(
      apiUrl(
        `/api/trips/items/${itemId}/toggle`
      ),
      {
        method: 'PATCH',

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );
  };

  const generateAIItinerary = async (
    destinationId: string,
    startDate: string,
    endDate: string,
    style: string
  ) => {
    if (!token) return null;

    const res = await fetch(
      apiUrl('/api/ai/generate-itinerary'),
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${token}`
        },

        body: JSON.stringify({
          destinationId,
          startDate,
          endDate,
          style
        })
      }
    );

    const data =
      await res.json();

    if (res.ok) {
      await fetchTrips();
      await fetchNotifications();
    }

    return data;
  };

  // ============================================================
  // BOOKINGS
  // ============================================================

  const fetchBookings = async () => {
    if (!token) return;

    const res = await fetch(
      apiUrl('/api/bookings'),
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    if (res.ok) {
      setBookings(
        await res.json()
      );
    }
  };

  const createBooking = async (
    booking: Omit<
      Booking,
      'id' | 'userId' | 'status'
    >
  ) => {
    if (!token) return null;

    const res = await fetch(
      apiUrl('/api/bookings'),
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${token}`
        },

        body: JSON.stringify(booking)
      }
    );

    if (res.ok) {
      await fetchBookings();
      await fetchNotifications();

      return await res.json();
    }

    return null;
  };

  const cancelBooking = async (
    bookingId: string
  ) => {
    if (!token) return;

    const res = await fetch(
      apiUrl(
        `/api/bookings/${bookingId}/status`
      ),
      {
        method: 'PATCH',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${token}`
        },

        body: JSON.stringify({
          status: 'cancelled'
        })
      }
    );

    if (res.ok) {
      await fetchBookings();
    }
  };

  // ============================================================
  // SAVED PLACES
  // ============================================================

  const fetchSaved = async () => {
    if (!token) return;

    const res = await fetch(
      apiUrl('/api/saved'),
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    if (res.ok) {
      setSavedPlaces(
        await res.json()
      );
    }
  };

  const toggleSave = async (
    placeId: string,
    type:
      | 'destination'
      | 'hotel'
      | 'restaurant'
      | 'attraction'
  ) => {
    if (!token) {
      alert(
        'Please log in to save places to your library.'
      );
      return;
    }

    const res = await fetch(
      apiUrl('/api/saved'),
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${token}`
        },

        body: JSON.stringify({
          placeId,
          type
        })
      }
    );

    if (res.ok) {
      await fetchSaved();
    }
  };

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  const fetchNotifications = async () => {
    if (!token) return;

    const res = await fetch(
      apiUrl('/api/notifications'),
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    if (res.ok) {
      setNotifications(
        await res.json()
      );
    }
  };

  const markAsRead = async (
    notifId: string
  ) => {
    if (!token) return;

    const res = await fetch(
      apiUrl(
        `/api/notifications/${notifId}/read`
      ),
      {
        method: 'PATCH',

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    if (res.ok) {
      setNotifications(prev =>
        prev.map(n =>
          n.id === notifId
            ? {
                ...n,
                read: true
              }
            : n
        )
      );
    }
  };

  const markAllRead = async () => {
    if (!token) return;

    const res = await fetch(
      apiUrl(
        '/api/notifications/read-all'
      ),
      {
        method: 'POST',

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    if (res.ok) {
      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          read: true
        }))
      );
    }
  };

  // ============================================================
  // EXPENSES
  // ============================================================

  const fetchExpenses = async (
    tripId?: string
  ): Promise<Expense[]> => {
    if (!token) return [];

    const url = tripId
      ? `/api/expenses?tripId=${tripId}`
      : '/api/expenses';

    const res = await fetch(
      apiUrl(url),
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    if (res.ok) {
      const data =
        await res.json();

      if (!tripId) {
        setExpenses(data);
      }

      return data;
    }

    return [];
  };

  const addExpense = async (
    expense: Omit<
      Expense,
      'id' | 'userId'
    >
  ) => {
    if (!token) return null;

    const res = await fetch(
      apiUrl('/api/expenses'),
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${token}`
        },

        body: JSON.stringify(expense)
      }
    );

    if (res.ok) {
      const newExp =
        await res.json();

      setExpenses(prev => [
        ...prev,
        newExp
      ]);

      return newExp;
    }

    return null;
  };

  const deleteExpense = async (
    expenseId: string
  ) => {
    if (!token) return;

    const res = await fetch(
      apiUrl(
        `/api/expenses/${expenseId}`
      ),
      {
        method: 'DELETE',

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    if (res.ok) {
      setExpenses(prev =>
        prev.filter(
          e => e.id !== expenseId
        )
      );
    }
  };

  // ============================================================
  // AI CHAT
  // ============================================================

  const sendAIChat = async (
    message: string,
    conversationId?: string
  ) => {
    if (!token) {
      return {
        text: 'Authentication is required.',
        conversationId: ''
      };
    }

    const res = await fetch(
      apiUrl('/api/ai/chat'),
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          Authorization:
            `Bearer ${token}`
        },

        body: JSON.stringify({
          message,
          conversationId
        })
      }
    );

    if (res.ok) {
      return await res.json();
    }

    throw new Error(
      'AI Chat connection failed.'
    );
  };

  const getAIConversations =
    async (): Promise<
      AIConversation[]
    > => {
      if (!token) return [];

      const res = await fetch(
        apiUrl(
          '/api/ai/conversations'
        ),
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      return res.ok
        ? await res.json()
        : [];
    };

  // ============================================================
  // PROVIDER
  // ============================================================

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        preferences,
        destinations,
        hotels,
        restaurants,
        attractions,
        trips,
        bookings,
        savedPlaces,
        notifications,
        expenses,
        loading,

        activeTab,
        activeMode,
        searchQuery,
        theme,

        setActiveTab,
        setActiveMode,
        setSearchQuery,
        toggleTheme,

        register,
        login,
        logout,
        updatePrefs,

        fetchTrips,
        createTrip,
        deleteTrip,
        fetchTripItems,
        addTripItem,
        deleteTripItem,
        toggleTripItem,
        generateAIItinerary,

        fetchBookings,
        createBooking,
        cancelBooking,

        fetchSaved,
        toggleSave,

        fetchNotifications,
        markAsRead,
        markAllRead,

        fetchExpenses,
        addExpense,
        deleteExpense,

        sendAIChat,
        getAIConversations
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ============================================================
// CUSTOM HOOK
// ============================================================

export function useApp() {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used inside an AppProvider'
    );
  }

  return context;
}