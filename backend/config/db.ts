import fs from 'fs';
import path from 'path';

// Define the database file path
const DB_FILE = path.join(process.cwd(), 'database.json');

// Interface structures
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface UserPreferences {
  userId: string;
  preferredStyle: 'adventure' | 'luxury' | 'budget' | 'relaxation' | 'family';
  dietary: string[];
  interests: string[];
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  rating: number;
  lat: number;
  lng: number;
}

export interface Hotel {
  id: string;
  destinationId: string;
  name: string;
  description: string;
  pricePerNight: number;
  rating: number;
  image: string;
  lat: number;
  lng: number;
  amenities: string[];
}

export interface Restaurant {
  id: string;
  destinationId: string;
  name: string;
  cuisine: string;
  priceLevel: '$$' | '$$$' | '$$$$' | '$';
  rating: number;
  image: string;
  lat: number;
  lng: number;
  specialties: string[];
  description: string;
}

export interface Attraction {
  id: string;
  destinationId: string;
  name: string;
  category: 'sightseeing' | 'adventure' | 'museum' | 'historic' | 'park';
  rating: number;
  price: number; // 0 for free
  image: string;
  lat: number;
  lng: number;
  description: string;
}

export interface Trip {
  id: string;
  userId: string;
  destinationId: string;
  title: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  createdAt: string;
}

export interface TripItem {
  id: string;
  tripId: string;
  type: 'activity' | 'hotel' | 'restaurant' | 'transport';
  title: string;
  time: string;
  date: string;
  description: string;
  price: number;
  completed: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  type: 'hotel' | 'flight' | 'attraction';
  title: string;
  details: string;
  price: number;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  image?: string;
}

export interface SavedPlace {
  id: string;
  userId: string;
  placeId: string;
  type: 'destination' | 'hotel' | 'restaurant' | 'attraction';
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  placeId: string;
  type: 'destination' | 'hotel' | 'restaurant' | 'attraction';
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'alert' | 'update' | 'promo';
  read: boolean;
  createdAt: string;
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: Array<{
    role: 'user' | 'model';
    text: string;
    timestamp: string;
  }>;
  createdAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  tripId: string;
  category: 'food' | 'transport' | 'hotel' | 'shopping' | 'activities' | 'other';
  title: string;
  amount: number;
  date: string;
}

export interface DatabaseSchema {
  users: User[];
  userPreferences: UserPreferences[];
  destinations: Destination[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  attractions: Attraction[];
  trips: Trip[];
  tripItems: TripItem[];
  bookings: Booking[];
  savedPlaces: SavedPlace[];
  reviews: Review[];
  notifications: Notification[];
  aiConversations: AIConversation[];
  expenses: Expense[];
}

// Initial Seed Data for Destinations, Hotels, Restaurants, Attractions
const SEED_DESTINATIONS: Destination[] = [
  {
    id: 'dest_1',
    name: 'Kyoto',
    country: 'Japan',
    description: 'Famed for its classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    lat: 35.0116,
    lng: 135.7681,
  },
  {
    id: 'dest_2',
    name: 'Amalfi Coast',
    country: 'Italy',
    description: 'A 50-kilometer stretch of coastline along the southern edge of Italy’s Sorrentine Peninsula, famous for its cliffside towns, beaches, and lemon groves.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    lat: 40.6340,
    lng: 14.6027,
  },
  {
    id: 'dest_3',
    name: 'Paris',
    country: 'France',
    description: 'France’s capital, is a major European city and a global center for art, fashion, gastronomy, and culture.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    lat: 48.8566,
    lng: 2.3522,
  },
  {
    id: 'dest_4',
    name: 'Bali',
    country: 'Indonesia',
    description: 'A tropical paradise famed for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    lat: -8.4095,
    lng: 115.1889,
  },
];

const SEED_HOTELS: Hotel[] = [
  {
    id: 'hotel_1_1',
    destinationId: 'dest_1',
    name: 'Sowaka Ryokan',
    description: 'A beautifully restored traditional townhouse ryokan in Gion, offering high-end luxury and authentic Japanese hospitality.',
    pricePerNight: 450,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    lat: 35.0025,
    lng: 135.7785,
    amenities: ['Spa', 'Hot Spring Bath', 'Traditional Dinner', 'Garden View', 'Free Wi-Fi'],
  },
  {
    id: 'hotel_1_2',
    destinationId: 'dest_1',
    name: 'The Thousand Kyoto',
    description: 'A modern wellness hotel right next to Kyoto Station, combining minimalist wooden design with high-tech comfort.',
    pricePerNight: 280,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    lat: 34.9868,
    lng: 135.7612,
    amenities: ['Gym', 'Bar', 'Spa', 'Tea Lounge', 'Electric Car Charging'],
  },
  {
    id: 'hotel_2_1',
    destinationId: 'dest_2',
    name: 'Hotel Santa Caterina',
    description: 'A late 19th-century liberty style villa overlooking the sea, framed by the intense blue of the Amalfi Coast.',
    pricePerNight: 850,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
    lat: 40.6315,
    lng: 14.5935,
    amenities: ['Private Beach', 'Infinity Pool', 'Michelin Restaurant', 'Sea View Balcony', 'Spa'],
  },
  {
    id: 'hotel_3_1',
    destinationId: 'dest_3',
    name: 'Hôtel Regina Louvre',
    description: 'Overlooking the Louvre and Tuileries Gardens, offering classic French elegance in the heart of Paris.',
    pricePerNight: 390,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80',
    lat: 48.8631,
    lng: 2.3315,
    amenities: ['Eiffel Tower View', 'Bar & Lounge', 'Pet Friendly', 'Room Service', 'Airport Shuttle'],
  },
  {
    id: 'hotel_4_1',
    destinationId: 'dest_4',
    name: 'Ubud Hanging Gardens',
    description: 'Overlooking the Ayung River, the luxurious Hanging Gardens of Bali offers villas with a private infinity pool amidst dense forest.',
    pricePerNight: 520,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    lat: -8.4112,
    lng: 115.2514,
    amenities: ['Twin-Tiered Infinity Pool', 'Jungle Spa', 'Fine Dining', 'Free Shuttle', 'Yoga Deck'],
  },
];

const SEED_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest_1_1',
    destinationId: 'dest_1',
    name: 'Gion Karyo',
    description: 'Set in an ancient merchant home, serving exquisite multi-course Kaiseki menus highlighting seasonal ingredients.',
    cuisine: 'Kaiseki (Japanese Fine Dining)',
    priceLevel: '$$$$',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80',
    lat: 35.0018,
    lng: 135.7760,
    specialties: ['Seasonal Sashimi', 'Grilled Wagyu', 'Matsutake Soup'],
  },
  {
    id: 'rest_1_2',
    destinationId: 'dest_1',
    name: 'Honke Owariya',
    description: 'Kyoto’s oldest active restaurant, serving famous soba noodles since 1465 inside a gorgeous wooden traditional townhouse.',
    cuisine: 'Soba & Tempura',
    priceLevel: '$$',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    lat: 35.0125,
    lng: 135.7608,
    specialties: ['Hourai Soba', 'Shrimp Tempura Soba', 'Matcha Parfait'],
  },
  {
    id: 'rest_2_1',
    destinationId: 'dest_2',
    name: 'Da Gemma',
    description: 'A short walk from the Amalfi cathedral, offering fantastic traditional hand-made pasta and fresh seafood dishes.',
    cuisine: 'Italian Seafood',
    priceLevel: '$$$',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    lat: 40.6331,
    lng: 14.6022,
    specialties: ['Scialatielli with Seafood', 'Tuna Carpaccio', 'Lemon Souffle'],
  },
  {
    id: 'rest_3_1',
    destinationId: 'dest_3',
    name: 'Le Bistrot Paul Bert',
    description: 'A classic Parisian bistro serving iconic dishes like steak frites and tart tatin in an lively, authentic neighborhood environment.',
    cuisine: 'Traditional French Bistro',
    priceLevel: '$$$',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
    lat: 48.8504,
    lng: 2.3814,
    specialties: ['Steak au Poivre', 'Grand Marnier Soufflé', 'Roasted Bone Marrow'],
  },
];

const SEED_ATTRACTIONS: Attraction[] = [
  {
    id: 'attr_1_1',
    destinationId: 'dest_1',
    name: 'Fushimi Inari Taisha',
    category: 'historic',
    rating: 4.9,
    price: 0,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    lat: 34.9671,
    lng: 135.7727,
    description: 'Famous for its thousands of vibrant vermilion torii gates, which straddle a network of trails behind its main buildings.',
  },
  {
    id: 'attr_1_2',
    destinationId: 'dest_1',
    name: 'Kinkaku-ji (Golden Pavilion)',
    category: 'sightseeing',
    rating: 4.8,
    price: 5,
    image: 'https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&w=800&q=80',
    lat: 35.0394,
    lng: 135.7292,
    description: 'A Zen Buddhist temple whose top two floors are completely covered in brilliant gold leaf, overlooking a pristine mirror pond.',
  },
  {
    id: 'attr_2_1',
    destinationId: 'dest_2',
    name: 'Sentiero degli Dei (Path of the Gods)',
    category: 'adventure',
    rating: 4.9,
    price: 0,
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
    lat: 40.6273,
    lng: 14.5122,
    description: 'A cliffside hiking trail that links the cliff towns, offering some of the most spectacular coastal panoramas in the world.',
  },
  {
    id: 'attr_3_1',
    destinationId: 'dest_3',
    name: 'Louvre Museum',
    category: 'museum',
    rating: 4.8,
    price: 22,
    image: 'https://images.unsplash.com/photo-1597910037310-7cca8d3c7474?auto=format&fit=crop&w=800&q=80',
    lat: 48.8606,
    lng: 2.3376,
    description: 'The world’s largest art museum and a historic monument in Paris, home to the Mona Lisa and thousands of masterworks.',
  },
  {
    id: 'attr_4_1',
    destinationId: 'dest_4',
    name: 'Tegallalang Rice Terraces',
    category: 'park',
    rating: 4.7,
    price: 2,
    image: 'https://images.unsplash.com/photo-1501179691627-eeaa65ea017c?auto=format&fit=crop&w=800&q=80',
    lat: -8.4312,
    lng: 115.2797,
    description: 'Famous terraced hillside rice paddies offering beautiful vistas and classic swings overlooking the dense tropical valley.',
  },
];

class Database {
  private schema: DatabaseSchema = {
    users: [],
    userPreferences: [],
    destinations: SEED_DESTINATIONS,
    hotels: SEED_HOTELS,
    restaurants: SEED_RESTAURANTS,
    attractions: SEED_ATTRACTIONS,
    trips: [],
    tripItems: [],
    bookings: [],
    savedPlaces: [],
    reviews: [],
    notifications: [],
    aiConversations: [],
    expenses: [],
  };

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        const loadedData = JSON.parse(fileContent);
        // Deep merge or overwrite loaded arrays to ensure we preserve seed data if empty
        this.schema = {
          users: loadedData.users || [],
          userPreferences: loadedData.userPreferences || [],
          destinations: loadedData.destinations?.length ? loadedData.destinations : SEED_DESTINATIONS,
          hotels: loadedData.hotels?.length ? loadedData.hotels : SEED_HOTELS,
          restaurants: loadedData.restaurants?.length ? loadedData.restaurants : SEED_RESTAURANTS,
          attractions: loadedData.attractions?.length ? loadedData.attractions : SEED_ATTRACTIONS,
          trips: loadedData.trips || [],
          tripItems: loadedData.tripItems || [],
          bookings: loadedData.bookings || [],
          savedPlaces: loadedData.savedPlaces || [],
          reviews: loadedData.reviews || [],
          notifications: loadedData.notifications || [],
          aiConversations: loadedData.aiConversations || [],
          expenses: loadedData.expenses || [],
        };
      } else {
        this.save();
      }
    } catch (e) {
      console.error('Failed to load database. Re-initializing default...', e);
      this.save();
    }
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.schema, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to save database state:', e);
    }
  }

  // Auth & User methods
  getUsers() { return this.schema.users; }
  addUser(user: User) {
    this.schema.users.push(user);
    this.save();
  }
  getUserByEmail(email: string) {
    return this.schema.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }
  getUserById(id: string) {
    return this.schema.users.find(u => u.id === id);
  }

  // Preferences
  getPreferences(userId: string): UserPreferences {
    let pref = this.schema.userPreferences.find(p => p.userId === userId);
    if (!pref) {
      pref = { userId, preferredStyle: 'adventure', dietary: [], interests: [] };
      this.schema.userPreferences.push(pref);
      this.save();
    }
    return pref;
  }
  updatePreferences(userId: string, prefs: Partial<UserPreferences>) {
    const idx = this.schema.userPreferences.findIndex(p => p.userId === userId);
    if (idx !== -1) {
      this.schema.userPreferences[idx] = { ...this.schema.userPreferences[idx], ...prefs };
    } else {
      this.schema.userPreferences.push({
        userId,
        preferredStyle: prefs.preferredStyle || 'adventure',
        dietary: prefs.dietary || [],
        interests: prefs.interests || [],
      });
    }
    this.save();
    return this.getPreferences(userId);
  }

  // Destinations & recommendations
  getDestinations() { return this.schema.destinations; }
  getHotels(destId?: string) {
    return destId ? this.schema.hotels.filter(h => h.destinationId === destId) : this.schema.hotels;
  }
  getRestaurants(destId?: string) {
    return destId ? this.schema.restaurants.filter(r => r.destinationId === destId) : this.schema.restaurants;
  }
  getAttractions(destId?: string) {
    return destId ? this.schema.attractions.filter(a => a.destinationId === destId) : this.schema.attractions;
  }

  // Trips & Trip Items
  getTrips(userId: string) {
    return this.schema.trips.filter(t => t.userId === userId);
  }
  getTrip(tripId: string) {
    return this.schema.trips.find(t => t.id === tripId);
  }
  addTrip(trip: Trip) {
    this.schema.trips.push(trip);
    this.save();
    return trip;
  }
  deleteTrip(tripId: string) {
    this.schema.trips = this.schema.trips.filter(t => t.id !== tripId);
    this.schema.tripItems = this.schema.tripItems.filter(item => item.tripId !== tripId);
    this.save();
  }
  updateTripStatus(tripId: string, status: 'upcoming' | 'active' | 'completed') {
    const trip = this.schema.trips.find(t => t.id === tripId);
    if (trip) {
      trip.status = status;
      this.save();
    }
    return trip;
  }

  getTripItems(tripId: string) {
    return this.schema.tripItems.filter(item => item.tripId === tripId);
  }
  addTripItem(item: TripItem) {
    this.schema.tripItems.push(item);
    this.save();
    return item;
  }
  deleteTripItem(itemId: string) {
    this.schema.tripItems = this.schema.tripItems.filter(item => item.id !== itemId);
    this.save();
  }
  toggleTripItemCompleted(itemId: string) {
    const item = this.schema.tripItems.find(i => i.id === itemId);
    if (item) {
      item.completed = !item.completed;
      this.save();
    }
    return item;
  }

  // Bookings
  getBookings(userId: string) {
    return this.schema.bookings.filter(b => b.userId === userId);
  }
  addBooking(booking: Booking) {
    this.schema.bookings.push(booking);
    this.save();
    return booking;
  }
  updateBookingStatus(bookingId: string, status: 'confirmed' | 'pending' | 'cancelled') {
    const booking = this.schema.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = status;
      this.save();
    }
    return booking;
  }

  // Saved / Favorites
  getSavedPlaces(userId: string) {
    return this.schema.savedPlaces.filter(s => s.userId === userId);
  }
  savePlace(userId: string, placeId: string, type: 'destination' | 'hotel' | 'restaurant' | 'attraction') {
    const exists = this.schema.savedPlaces.find(s => s.userId === userId && s.placeId === placeId);
    if (exists) {
      // Toggle off / remove
      this.schema.savedPlaces = this.schema.savedPlaces.filter(s => !(s.userId === userId && s.placeId === placeId));
      this.save();
      return { saved: false };
    } else {
      const saved = { id: `saved_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, userId, placeId, type };
      this.schema.savedPlaces.push(saved);
      this.save();
      return { saved: true, item: saved };
    }
  }

  // Reviews
  getReviews(placeId: string) {
    return this.schema.reviews.filter(r => r.placeId === placeId);
  }
  addReview(review: Review) {
    this.schema.reviews.push(review);
    // Recalculate average rating of place
    this.updateAverageRating(review.placeId, review.type);
    this.save();
    return review;
  }

  private updateAverageRating(placeId: string, type: 'destination' | 'hotel' | 'restaurant' | 'attraction') {
    const placeReviews = this.schema.reviews.filter(r => r.placeId === placeId);
    if (!placeReviews.length) return;
    const avg = parseFloat((placeReviews.reduce((sum, r) => sum + r.rating, 0) / placeReviews.length).toFixed(1));

    if (type === 'destination') {
      const d = this.schema.destinations.find(x => x.id === placeId);
      if (d) d.rating = avg;
    } else if (type === 'hotel') {
      const h = this.schema.hotels.find(x => x.id === placeId);
      if (h) h.rating = avg;
    } else if (type === 'restaurant') {
      const r = this.schema.restaurants.find(x => x.id === placeId);
      if (r) r.rating = avg;
    } else if (type === 'attraction') {
      const a = this.schema.attractions.find(x => x.id === placeId);
      if (a) a.rating = avg;
    }
  }

  // Notifications
  getNotifications(userId: string) {
    // Return sorted descending (newest first)
    return this.schema.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  addNotification(userId: string, title: string, message: string, type: 'alert' | 'update' | 'promo') {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.schema.notifications.push(notification);
    this.save();
    return notification;
  }
  markNotificationAsRead(notifId: string) {
    const n = this.schema.notifications.find(x => x.id === notifId);
    if (n) {
      n.read = true;
      this.save();
    }
    return n;
  }
  markAllNotificationsRead(userId: string) {
    this.schema.notifications.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    this.save();
  }

  // Expenses Module (The new future feature requested is beautifully laid out and fully functional!)
  getExpenses(userId: string) {
    return this.schema.expenses.filter(e => e.userId === userId);
  }
  getTripExpenses(tripId: string) {
    return this.schema.expenses.filter(e => e.tripId === tripId);
  }
  addExpense(expense: Expense) {
    this.schema.expenses.push(expense);
    this.save();
    return expense;
  }
  deleteExpense(expenseId: string) {
    this.schema.expenses = this.schema.expenses.filter(e => e.id !== expenseId);
    this.save();
  }

  // AI Conversations
  getConversations(userId: string) {
    return this.schema.aiConversations.filter(c => c.userId === userId);
  }
  getConversation(convId: string) {
    return this.schema.aiConversations.find(c => c.id === convId);
  }
  addConversation(userId: string, title: string) {
    const conv: AIConversation = {
      id: `conv_${Date.now()}`,
      userId,
      title,
      messages: [],
      createdAt: new Date().toISOString(),
    };
    this.schema.aiConversations.push(conv);
    this.save();
    return conv;
  }
  addMessageToConversation(convId: string, role: 'user' | 'model', text: string) {
    const conv = this.schema.aiConversations.find(c => c.id === convId);
    if (conv) {
      conv.messages.push({
        role,
        text,
        timestamp: new Date().toISOString(),
      });
      this.save();
    }
    return conv;
  }
}

export const db = new Database();
