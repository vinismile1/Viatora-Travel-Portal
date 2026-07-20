import { Response } from 'express';
import { db, Trip, TripItem } from '../server/db.js';
import { AuthenticatedRequest } from '../types/index.js';
import { ai } from '../services/aiService.js';

export const getConversations = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  res.json(db.getConversations(user.id));
};

export const createConversation = (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { title } = req.body;
  const conv = db.addConversation(user.id, title || 'New Travel Plan');
  res.json(conv);
};

export const chat = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { conversationId, message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const prefs = db.getPreferences(user.id);
  const destinations = db.getDestinations();

  let targetConvId = conversationId;
  if (!targetConvId) {
    const defaultConv = db.getConversations(user.id)[0] || db.addConversation(user.id, 'Viatora Chat');
    targetConvId = defaultConv.id;
  }

  const conv = db.getConversation(targetConvId);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });

  db.addMessageToConversation(targetConvId, 'user', message);

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY' || process.env.GEMINI_API_KEY === 'MOCK_KEY') {
    const fallbackText = `I would love to help you plan your trip! [Note: Server is currently running in Preview Mode with a demo response. To unlock full real-time Gemini processing, please make sure your GEMINI_API_KEY is configured in the Secrets panel].\n\nBased on your preferences (${prefs.preferredStyle} traveler, interested in ${prefs.interests.join(', ') || 'cultural sights'}), I recommend visiting Kyoto or Bali! Both offer amazing landscapes, rich dining experiences, and custom accommodations like standard luxury resorts or traditional ryokans. Let me know if you would like me to draft an itinerary for you!`;
    db.addMessageToConversation(targetConvId, 'model', fallbackText);
    return res.json({ text: fallbackText, conversationId: targetConvId });
  }

  try {
    const systemPrompt = `You are Viatora, an expert AI Travel Companion.
Your job is to provide highly personalized, inspirational travel recommendations, answer itinerary questions, and help plan trips.
The current user is ${user.name}.
Their preferred travel style is ${prefs.preferredStyle}.
Their dining preferences / dietary needs: ${prefs.dietary.join(', ') || 'None specified'}.
Their travel interests: ${prefs.interests.join(', ') || 'None specified'}.

Below are real local destinations available in Viatora for direct reference or bookings:
${JSON.stringify(destinations)}

Be warm, conversational, professional, and clear. Suggest real-world spots. If the user asks for a daily itinerary, break it down clearly by Day 1, Day 2, etc., and offer suggestions for Hotels or Restaurants matching their preferences. Try to structure the recommendations clearly with emojis and bold highlights.`;

    const lastMessages = conv.messages.slice(-10);
    const contents = lastMessages.map(m => ({
      role: m.role === 'user' ? 'user' : ('model' as any),
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7
      }
    });

    const reply = response.text || "I'm sorry, I couldn't formulate a recommendation right now. Please try again!";
    db.addMessageToConversation(targetConvId, 'model', reply);

    res.json({ text: reply, conversationId: targetConvId });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    const errorText = `Apologies, I encountered an issue reaching my AI centers. Here is a friendly backup suggestion based on your travel profile: I highly recommend visiting Paris, France for art and gourmet food, or Kyoto, Japan for breathtaking temples and tradition. Let me know what you think! (Error details: ${err.message || 'General Connection Error'})`;
    db.addMessageToConversation(targetConvId, 'model', errorText);
    res.json({ text: errorText, conversationId: targetConvId });
  }
};

export const generateItinerary = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { destinationId, title, startDate, endDate, style } = req.body;
  if (!destinationId || !startDate || !endDate) {
    return res.status(400).json({ error: 'destinationId, startDate, and endDate are required.' });
  }

  const destination = db.getDestinations().find(d => d.id === destinationId);
  if (!destination) return res.status(404).json({ error: 'Destination not found.' });

  const newTrip: Trip = {
    id: `trip_${Date.now()}`,
    userId: user.id,
    destinationId,
    title: title || `Trip to ${destination.name}`,
    startDate,
    endDate,
    status: 'upcoming',
    createdAt: new Date().toISOString(),
  };

  db.addTrip(newTrip);

  const hotels = db.getHotels(destinationId);
  const restaurants = db.getRestaurants(destinationId);
  const attractions = db.getAttractions(destinationId);

  let generatedItems: Array<{
    type: 'activity' | 'hotel' | 'restaurant' | 'transport';
    title: string;
    time: string;
    date: string;
    description: string;
    price: number;
  }> = [];

  const defaultTripDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)) || 2;

  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' && process.env.GEMINI_API_KEY !== 'MOCK_KEY') {
    try {
      const prompt = `Create a fully structured JSON array of trip events for a ${defaultTripDays}-day trip to ${destination.name}, ${destination.country} starting on ${startDate} for a travel style of "${style || 'adventure'}".
      Here are the official local listings you should reference or recommend:
      Hotels: ${JSON.stringify(hotels.map(h => ({ name: h.name, price: h.pricePerNight })))}
      Restaurants: ${JSON.stringify(restaurants.map(r => ({ name: r.name, cuisine: r.cuisine })))}
      Attractions: ${JSON.stringify(attractions.map(a => ({ name: a.name, category: a.category, price: a.price })))}

      Generate a JSON array matching this exact schema:
      [
        {
          "type": "hotel" | "restaurant" | "activity" | "transport",
          "title": "Short title of event",
          "time": "HH:MM",
          "dayOffset": 0,
          "description": "Short explanation of the plan.",
          "price": number
        }
      ]
      Provide ONLY the raw JSON block without markdown wrappers, backticks, or other formatting.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5
        }
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText.trim());
        if (Array.isArray(parsed)) {
          generatedItems = parsed.map(item => {
            const dateObj = new Date(startDate);
            dateObj.setDate(dateObj.getDate() + (item.dayOffset || 0));
            const formattedDate = dateObj.toISOString().split('T')[0];
            return {
              type: item.type || 'activity',
              title: item.title || 'Sightseeing Spot',
              time: item.time || '10:00',
              date: formattedDate,
              description: item.description || '',
              price: Number(item.price) || 0
            };
          });
        }
      } catch (parseErr) {
        console.error('Failed to parse Gemini JSON output, falling back to local builder', parseErr);
      }
    } catch (geminiErr) {
      console.error('Gemini error generating itinerary', geminiErr);
    }
  }

  if (!generatedItems.length) {
    for (let day = 0; day < defaultTripDays; day++) {
      const currentDateObj = new Date(startDate);
      currentDateObj.setDate(currentDateObj.getDate() + day);
      const currentDateStr = currentDateObj.toISOString().split('T')[0];

      if (day === 0 && hotels.length) {
        generatedItems.push({
          type: 'hotel',
          title: `Check-in at ${hotels[0].name}`,
          time: '14:00',
          date: currentDateStr,
          description: hotels[0].description,
          price: hotels[0].pricePerNight,
        });
      }

      const dayAttr = attractions[day % attractions.length];
      if (dayAttr) {
        generatedItems.push({
          type: 'activity',
          title: `Explore ${dayAttr.name}`,
          time: '10:00',
          date: currentDateStr,
          description: dayAttr.description,
          price: dayAttr.price,
        });
      }

      const dayRest = restaurants[day % restaurants.length];
      if (dayRest) {
        generatedItems.push({
          type: 'restaurant',
          title: `Dinner at ${dayRest.name}`,
          time: '19:30',
          date: currentDateStr,
          description: `Enjoy standard ${dayRest.cuisine} specialties: ${dayRest.specialties.join(', ')}. Rating: ${dayRest.rating} Stars.`,
          price: dayRest.priceLevel === '$$$$' ? 100 : dayRest.priceLevel === '$$$' ? 60 : dayRest.priceLevel === '$$' ? 30 : 15,
        });
      }
    }
  }

  const savedItems = generatedItems.map(item => {
    const fullItem: TripItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      tripId: newTrip.id,
      ...item,
      completed: false
    };
    db.addTripItem(fullItem);
    return fullItem;
  });

  db.addNotification(
    user.id,
    'Personalized Itinerary Ready!',
    `Your custom day-by-day travel plan for ${destination.name} is complete with ${savedItems.length} curated events! Check your Trips tab to view.`,
    'update'
  );

  res.status(201).json({
    trip: {
      ...newTrip,
      destination
    },
    items: savedItems
  });
};
