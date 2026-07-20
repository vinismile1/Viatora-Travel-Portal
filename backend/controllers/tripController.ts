import { Response } from 'express';
import { db, Trip, TripItem } from '../server/db.js';
import { AuthenticatedRequest } from '../types/index.js';

// --- TRIPS ---
export const getTrips = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const trips = db.getTrips(user.id);
  const enhancedTrips = trips.map(trip => {
    const dest = db.getDestinations().find(d => d.id === trip.destinationId);
    return {
      ...trip,
      destination: dest || null
    };
  });
  res.json(enhancedTrips);
};

export const createTrip = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { destinationId, title, startDate, endDate } = req.body;
  if (!destinationId || !title || !startDate || !endDate) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  const newTrip: Trip = {
    id: `trip_${Date.now()}`,
    userId: user.id,
    destinationId,
    title,
    startDate,
    endDate,
    status: 'upcoming',
    createdAt: new Date().toISOString(),
  };

  db.addTrip(newTrip);

  db.addNotification(
    user.id,
    'Trip Created!',
    `Your trip to ${title} has been scheduled from ${startDate} to ${endDate}. Start planning your activities!`,
    'update'
  );

  res.status(201).json(newTrip);
};

export const deleteTrip = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const trip = db.getTrip(req.params.id);
  if (!trip || trip.userId !== user.id) {
    return res.status(404).json({ error: 'Trip not found.' });
  }

  db.deleteTrip(req.params.id);
  res.json({ success: true, message: 'Trip deleted.' });
};

// --- TRIP ITEMS ---
export const getTripItems = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const trip = db.getTrip(req.params.id);
  if (!trip || trip.userId !== user.id) {
    return res.status(404).json({ error: 'Trip not found.' });
  }

  res.json(db.getTripItems(req.params.id));
};

export const createTripItem = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const trip = db.getTrip(req.params.id);
  if (!trip || trip.userId !== user.id) {
    return res.status(404).json({ error: 'Trip not found.' });
  }

  const { type, title, time, date, description, price } = req.body;
  if (!type || !title || !time || !date) {
    return res.status(400).json({ error: 'Please provide required item fields.' });
  }

  const newItem: TripItem = {
    id: `item_${Date.now()}`,
    tripId: req.params.id,
    type,
    title,
    time,
    date,
    description: description || '',
    price: Number(price) || 0,
    completed: false,
  };

  db.addTripItem(newItem);
  res.status(201).json(newItem);
};

export const deleteTripItem = (req: AuthenticatedRequest, res: Response) => {
  db.deleteTripItem(req.params.itemId);
  res.json({ success: true, message: 'Trip item deleted.' });
};

export const toggleTripItem = (req: AuthenticatedRequest, res: Response) => {
  const item = db.toggleTripItemCompleted(req.params.itemId);
  if (!item) return res.status(404).json({ error: 'Item not found.' });
  res.json(item);
};

// --- DISCOVERY DATA ---
export const getDestinations = (req: AuthenticatedRequest, res: Response) => {
  res.json(db.getDestinations());
};

export const getDestinationById = (req: AuthenticatedRequest, res: Response) => {
  const dest = db.getDestinations().find(d => d.id === req.params.id);
  if (!dest) return res.status(404).json({ error: 'Destination not found.' });
  res.json(dest);
};

export const getHotels = (req: AuthenticatedRequest, res: Response) => {
  const destId = req.query.destinationId as string;
  res.json(db.getHotels(destId));
};

export const getRestaurants = (req: AuthenticatedRequest, res: Response) => {
  const destId = req.query.destinationId as string;
  res.json(db.getRestaurants(destId));
};

export const getAttractions = (req: AuthenticatedRequest, res: Response) => {
  const destId = req.query.destinationId as string;
  res.json(db.getAttractions(destId));
};

// --- SAVED PLACES ---
export const getSavedPlaces = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const saved = db.getSavedPlaces(user.id);
  const enriched = saved.map(s => {
    let placeDetails: any = null;
    if (s.type === 'destination') {
      placeDetails = db.getDestinations().find(d => d.id === s.placeId);
    } else if (s.type === 'hotel') {
      placeDetails = db.getHotels().find(h => h.id === s.placeId);
    } else if (s.type === 'restaurant') {
      placeDetails = db.getRestaurants().find(r => r.id === s.placeId);
    } else if (s.type === 'attraction') {
      placeDetails = db.getAttractions().find(a => a.id === s.placeId);
    }
    return {
      ...s,
      place: placeDetails
    };
  }).filter(e => e.place !== null);

  res.json(enriched);
};

export const savePlace = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { placeId, type } = req.body;
  if (!placeId || !type) return res.status(400).json({ error: 'placeId and type are required' });

  const result = db.savePlace(user.id, placeId, type);
  res.json(result);
};
