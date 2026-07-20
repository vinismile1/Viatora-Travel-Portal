import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserPreferences, Destination, Hotel, Restaurant, Attraction, 
  Trip, TripItem, Booking, SavedPlace, Notification, Expense, AIConversation 
} from '../types';

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
  setActiveTab: (tab: 'home' | 'bookings' | 'trips' | 'saved' | 'profile') => void;
  setActiveMode: (mode: 'all' | 'travel' | 'food' | 'explore' | 'guide') => void;
  setSearchQuery: (query: string) => void;
  
  // Auth
  register: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePrefs: (prefs: Partial<UserPreferences>) => Promise<void>;
  
  // Trips
  fetchTrips: () => Promise<void>;
  createTrip: (destinationId: string, title: string, startDate: string, endDate: string) => Promise<any>;
  deleteTrip: (tripId: string) => Promise<void>;
  fetchTripItems: (tripId: string) => Promise<TripItem[]>;
  addTripItem: (tripId: string, item: Omit<TripItem, 'id' | 'tripId' | 'completed'>) => Promise<TripItem | null>;
  deleteTripItem: (itemId: string) => Promise<void>;
  toggleTripItem: (itemId: string) => Promise<void>;
  generateAIItinerary: (destinationId: string, startDate: string, endDate: string, style: string) => Promise<any>;
  
  // Bookings
  fetchBookings: () => Promise<void>;
  createBooking: (booking: Omit<Booking, 'id' | 'userId' | 'status'>) => Promise<Booking | null>;
  cancelBooking: (bookingId: string) => Promise<void>;
  
  // Saved Places
  fetchSaved: () => Promise<void>;
  toggleSave: (placeId: string, type: 'destination' | 'hotel' | 'restaurant' | 'attraction') => Promise<void>;
  
  // Notifications
  fetchNotifications: () => Promise<void>;
  markAsRead: (notifId: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  
  // Expenses
  fetchExpenses: (tripId?: string) => Promise<Expense[]>;
  addExpense: (expense: Omit<Expense, 'id' | 'userId'>) => Promise<Expense | null>;
  deleteExpense: (expenseId: string) => Promise<void>;
  
  // AI Chat
  sendAIChat: (message: string, conversationId?: string) => Promise<{ text: string; conversationId: string }>;
  getAIConversations: () => Promise<AIConversation[]>;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('viatora_token'));
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState<'home' | 'bookings' | 'trips' | 'saved' | 'profile'>('home');
  const [activeMode, setActiveMode] = useState<'all' | 'travel' | 'food' | 'explore' | 'guide'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('viatora_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('viatora_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch static directories on mount
  useEffect(() => {
    async function initData() {
      try {
        const [destRes, hotelRes, restRes, attrRes] = await Promise.all([
          fetch('/api/destinations').then(r => r.json()),
          fetch('/api/hotels').then(r => r.json()),
          fetch('/api/restaurants').then(r => r.json()),
          fetch('/api/attractions').then(r => r.json()),
        ]);
        setDestinations(destRes || []);
        setHotels(hotelRes || []);
        setRestaurants(restRes || []);
        setAttractions(attrRes || []);
      } catch (err) {
        console.error('Error fetching baseline directories:', err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // Fetch user-specific data on token change
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
      const headers = { 'Authorization': `Bearer ${token}` };
      try {
        // Fetch current profile
        const meRes = await fetch('/api/auth/me', { headers });
        if (!meRes.ok) {
          logout();
          return;
        }
        const meData = await meRes.json();
        setUser(meData.user);

        // Fetch remaining preferences and list items
        const [prefRes, tripsRes, bookRes, savedRes, notifRes, expRes] = await Promise.all([
          fetch('/api/users/preferences', { headers }).then(r => r.json()),
          fetch('/api/trips', { headers }).then(r => r.json()),
          fetch('/api/bookings', { headers }).then(r => r.json()),
          fetch('/api/saved', { headers }).then(r => r.json()),
          fetch('/api/notifications', { headers }).then(r => r.json()),
          fetch('/api/expenses', { headers }).then(r => r.json()),
        ]);

        setPreferences(prefRes);
        setTrips(tripsRes || []);
        setBookings(bookRes || []);
        setSavedPlaces(savedRes || []);
        setNotifications(notifRes || []);
        setExpenses(expRes || []);
      } catch (err) {
        console.error('Failed loading user sessions:', err);
      }
    }
    loadUserData();
  }, [token]);

  // Auth Operations
  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('viatora_token', data.token);
      return true;
    } catch (err: any) {
      alert(err.message);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('viatora_token', data.token);
      return true;
    } catch (err: any) {
      alert(err.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('viatora_token');
    setActiveTab('home');
  };

  const updatePrefs = async (prefs: Partial<UserPreferences>) => {
    if (!token) return;
    try {
      const res = await fetch('/api/users/preferences', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(prefs),
      });
      const data = await res.json();
      setPreferences(data);
    } catch (err) {
      console.error('Failed updating preferences:', err);
    }
  };

  // Trips Operations
  const fetchTrips = async () => {
    if (!token) return;
    const res = await fetch('/api/trips', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setTrips(await res.json());
  };

  const createTrip = async (destinationId: string, title: string, startDate: string, endDate: string) => {
    if (!token) return null;
    const res = await fetch('/api/trips', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ destinationId, title, startDate, endDate }),
    });
    const data = await res.json();
    if (res.ok) {
      await fetchTrips();
      await fetchNotifications();
    }
    return data;
  };

  const deleteTrip = async (tripId: string) => {
    if (!token) return;
    const res = await fetch(`/api/trips/${tripId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (res.ok) {
      setTrips(prev => prev.filter(t => t.id !== tripId));
    }
  };

  const fetchTripItems = async (tripId: string): Promise<TripItem[]> => {
    if (!token) return [];
    const res = await fetch(`/api/trips/${tripId}/items`, { headers: { 'Authorization': `Bearer ${token}` } });
    return res.ok ? await res.json() : [];
  };

  const addTripItem = async (tripId: string, item: Omit<TripItem, 'id' | 'tripId' | 'completed'>) => {
    if (!token) return null;
    const res = await fetch(`/api/trips/${tripId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(item),
    });
    return res.ok ? await res.json() : null;
  };

  const deleteTripItem = async (itemId: string) => {
    if (!token) return;
    await fetch(`/api/trips/items/${itemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  };

  const toggleTripItem = async (itemId: string) => {
    if (!token) return;
    await fetch(`/api/trips/items/${itemId}/toggle`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  };

  const generateAIItinerary = async (destinationId: string, startDate: string, endDate: string, style: string) => {
    if (!token) return null;
    const res = await fetch('/api/ai/generate-itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ destinationId, startDate, endDate, style }),
    });
    const data = await res.json();
    if (res.ok) {
      await fetchTrips();
      await fetchNotifications();
    }
    return data;
  };

  // Bookings Operations
  const fetchBookings = async () => {
    if (!token) return;
    const res = await fetch('/api/bookings', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setBookings(await res.json());
  };

  const createBooking = async (booking: Omit<Booking, 'id' | 'userId' | 'status'>) => {
    if (!token) return null;
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(booking),
    });
    if (res.ok) {
      await fetchBookings();
      await fetchNotifications();
      return await res.json();
    }
    return null;
  };

  const cancelBooking = async (bookingId: string) => {
    if (!token) return;
    const res = await fetch(`/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'cancelled' }),
    });
    if (res.ok) {
      await fetchBookings();
    }
  };

  // Saved Places
  const fetchSaved = async () => {
    if (!token) return;
    const res = await fetch('/api/saved', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setSavedPlaces(await res.json());
  };

  const toggleSave = async (placeId: string, type: 'destination' | 'hotel' | 'restaurant' | 'attraction') => {
    if (!token) {
      alert('Please log in to save places to your library.');
      return;
    }
    const res = await fetch('/api/saved', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ placeId, type }),
    });
    if (res.ok) {
      await fetchSaved();
    }
  };

  // Notifications
  const fetchNotifications = async () => {
    if (!token) return;
    const res = await fetch('/api/notifications', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setNotifications(await res.json());
  };

  const markAsRead = async (notifId: string) => {
    if (!token) return;
    const res = await fetch(`/api/notifications/${notifId}/read`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (res.ok) {
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
    }
  };

  const markAllRead = async () => {
    if (!token) return;
    const res = await fetch('/api/notifications/read-all', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (res.ok) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  // Expenses Operations
  const fetchExpenses = async (tripId?: string): Promise<Expense[]> => {
    if (!token) return [];
    const url = tripId ? `/api/expenses?tripId=${tripId}` : '/api/expenses';
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      if (!tripId) setExpenses(data);
      return data;
    }
    return [];
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'userId'>) => {
    if (!token) return null;
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(expense),
    });
    if (res.ok) {
      const newExp = await res.json();
      setExpenses(prev => [...prev, newExp]);
      return newExp;
    }
    return null;
  };

  const deleteExpense = async (expenseId: string) => {
    if (!token) return;
    const res = await fetch(`/api/expenses/${expenseId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (res.ok) {
      setExpenses(prev => prev.filter(e => e.id !== expenseId));
    }
  };

  // AI Chat Operations
  const sendAIChat = async (message: string, conversationId?: string) => {
    if (!token) return { text: 'Authentication is required.', conversationId: '' };
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message, conversationId }),
    });
    if (res.ok) {
      return await res.json();
    } else {
      throw new Error('AI Chat connection failed.');
    }
  };

  const getAIConversations = async (): Promise<AIConversation[]> => {
    if (!token) return [];
    const res = await fetch('/api/ai/conversations', { headers: { 'Authorization': `Bearer ${token}` } });
    return res.ok ? await res.json() : [];
  };

  return (
    <AppContext.Provider value={{
      user, token, preferences, destinations, hotels, restaurants, attractions,
      trips, bookings, savedPlaces, notifications, expenses, loading,
      activeTab, activeMode, searchQuery, theme,
      setActiveTab, setActiveMode, setSearchQuery, toggleTheme,
      register, login, logout, updatePrefs,
      fetchTrips, createTrip, deleteTrip, fetchTripItems, addTripItem, deleteTripItem, toggleTripItem, generateAIItinerary,
      fetchBookings, createBooking, cancelBooking,
      fetchSaved, toggleSave,
      fetchNotifications, markAsRead, markAllRead,
      fetchExpenses, addExpense, deleteExpense,
      sendAIChat, getAIConversations
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside an AppProvider');
  return context;
}
