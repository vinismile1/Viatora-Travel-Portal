export interface User {
  id: string;
  name: string;
  email: string;
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
  price: number;
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
  destination?: Destination | null;
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
  place?: Destination | Hotel | Restaurant | Attraction;
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
