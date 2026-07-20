import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, MapPin, CheckSquare, Plus, DollarSign, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Trip, TripItem } from '../types';
import { useApp } from '../context/AppContext';

interface TripCardProps {
  trip: Trip;
  key?: any;
}

export function TripCard({ trip }: TripCardProps) {
  const { deleteTrip, fetchTripItems, addTripItem, deleteTripItem, toggleTripItem } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState<TripItem[]>([]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState<'activity' | 'hotel' | 'restaurant' | 'transport'>('activity');
  const [newItemTime, setNewItemTime] = useState('10:00');
  const [newItemDate, setNewItemDate] = useState(trip.startDate);
  const [newItemPrice, setNewItemPrice] = useState('0');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Load items when expanded
  useEffect(() => {
    if (expanded) {
      loadItems();
    }
  }, [expanded]);

  const loadItems = async () => {
    const tripItems = await fetchTripItems(trip.id);
    // Sort items by date, then time
    const sorted = tripItems.sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
    setItems(sorted);
  };

  const handleToggleItem = async (itemId: string) => {
    await toggleTripItem(itemId);
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item));
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteTripItem(itemId);
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle || !newItemTime || !newItemDate) return;

    const added = await addTripItem(trip.id, {
      type: newItemType,
      title: newItemTitle,
      time: newItemTime,
      date: newItemDate,
      description: newItemDesc,
      price: Number(newItemPrice) || 0,
    });

    if (added) {
      setNewItemTitle('');
      setNewItemDesc('');
      setNewItemPrice('0');
      setShowAddForm(false);
      loadItems();
    }
  };

  const statusColors = {
    upcoming: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    completed: 'bg-zinc-800 text-zinc-500 border-zinc-700/50'
  };

  // Group items by date for beautiful daily schedules
  const groupedItems: Record<string, TripItem[]> = items.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, TripItem[]>);

  return (
    <div id={`trip_card_${trip.id}`} className="bg-theme-card rounded-[2rem] border border-theme-border shadow-2xl overflow-hidden hover:border-primary/30 transition duration-300">
      {/* Header Info */}
      <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-theme-panel flex-shrink-0 border border-theme-border">
            <img
              src={trip.destination?.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=150&q=80'}
              alt={trip.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase ${statusColors[trip.status]}`}>
                {trip.status}
              </span>
              <span className="text-xs text-theme-muted font-sans flex items-center gap-1">
                <MapPin size={11} />
                {trip.destination?.name || 'Personal Location'}
              </span>
            </div>
            <h3 className="font-display font-semibold text-theme-text text-base md:text-lg">{trip.title}</h3>
            <p className="text-theme-muted text-xs flex items-center gap-1.5 mt-0.5">
              <Calendar size={12} />
              <span>{trip.startDate} to {trip.endDate}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <button
            id={`delete_trip_btn_${trip.id}`}
            onClick={() => deleteTrip(trip.id)}
            className="p-2.5 text-theme-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
            title="Delete Trip"
          >
            <Trash2 size={16} />
          </button>
          
          <button
            id={`toggle_trip_expand_btn_${trip.id}`}
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-theme-panel hover:bg-theme-panel/85 border border-theme-border text-theme-text text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            <span>{expanded ? 'Hide Itinerary' : 'View Itinerary'}</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded Day-By-Day Itinerary Planner */}
      {expanded && (
        <div className="bg-theme-panel border-t border-theme-border p-6 animate-in slide-in-from-top-3 duration-200">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-display font-semibold text-theme-text text-sm md:text-base flex items-center gap-2">
              <CheckSquare size={16} className="text-primary" />
              <span>Daily Travel Plan & Checklist</span>
            </h4>
            <button
              id={`toggle_add_item_form_btn_${trip.id}`}
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-indigo-400 bg-theme-card border border-theme-border px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition cursor-pointer"
            >
              <Plus size={14} />
              <span>{showAddForm ? 'Close Editor' : 'Add Activity'}</span>
            </button>
          </div>

          {/* Add custom activity editor form */}
          {showAddForm && (
            <form onSubmit={handleAddItem} className="bg-theme-card border border-theme-border rounded-2xl p-4 mb-6 space-y-3.5 shadow-xl text-theme-text">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-theme-muted mb-1">ACTIVITY TITLE</label>
                  <input
                    id="new_item_title"
                    type="text"
                    required
                    placeholder="e.g. Sunrise tour, Wine tasting, Flight to..."
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-theme-panel border border-theme-border rounded-lg text-xs outline-none focus:border-primary text-theme-text"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-theme-muted mb-1">CATEGORY</label>
                  <select
                    id="new_item_type"
                    value={newItemType}
                    onChange={(e: any) => setNewItemType(e.target.value)}
                    className="w-full px-3 py-2 bg-theme-panel border border-theme-border rounded-lg text-xs outline-none focus:border-primary text-theme-text cursor-pointer"
                  >
                    <option value="activity" className="bg-theme-card text-theme-text">Activity / Tour</option>
                    <option value="hotel" className="bg-theme-card text-theme-text">Hotel / Accommodation</option>
                    <option value="restaurant" className="bg-theme-card text-theme-text">Food / Restaurant</option>
                    <option value="transport" className="bg-theme-card text-theme-text">Transit / Flight / Train</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-theme-muted mb-1">DATE</label>
                  <input
                    id="new_item_date"
                    type="date"
                    required
                    value={newItemDate}
                    onChange={(e) => setNewItemDate(e.target.value)}
                    className="w-full px-2 py-2 bg-theme-panel border border-theme-border rounded-lg text-xs outline-none text-theme-text cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-theme-muted mb-1">TIME</label>
                  <input
                    id="new_item_time"
                    type="text"
                    required
                    placeholder="e.g. 09:30"
                    value={newItemTime}
                    onChange={(e) => setNewItemTime(e.target.value)}
                    className="w-full px-2 py-2 bg-theme-panel border border-theme-border rounded-lg text-xs outline-none focus:border-primary text-theme-text"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-theme-muted mb-1">PRICE ($)</label>
                  <input
                    id="new_item_price"
                    type="number"
                    placeholder="0"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full px-2 py-2 bg-theme-panel border border-theme-border rounded-lg text-xs outline-none focus:border-primary text-theme-text"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-theme-muted mb-1">DESCRIPTION (OPTIONAL)</label>
                <textarea
                  id="new_item_desc"
                  placeholder="Additional details, tickets references or addresses..."
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-theme-panel border border-theme-border rounded-lg text-xs outline-none focus:border-primary text-theme-text h-14 resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="submit_add_item_btn"
                  type="submit"
                  className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow transition cursor-pointer"
                >
                  Save Activity
                </button>
              </div>
            </form>
          )}

          {/* Main timeline schedule */}
          {items.length === 0 ? (
            <div className="bg-theme-card border border-theme-border rounded-2xl p-6 text-center text-theme-muted text-xs">
              <p className="mb-2 font-medium text-theme-text">Your itinerary is empty.</p>
              <p>Add custom events above or let Gemini construct a daily plan instantly!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([date, dateItems]) => (
                <div key={date} className="relative pl-4 border-l-2 border-theme-border">
                  {/* Date marker */}
                  <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-primary border-2 border-theme-card"></div>
                  <h5 className="text-xs font-bold text-theme-text mb-3 ml-2 uppercase tracking-wider bg-theme-card py-0.5 px-2 inline-block rounded-md border border-theme-border">
                    {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </h5>

                  {/* Daily list */}
                  <div className="space-y-3 mt-2">
                    {dateItems.map((item) => {
                      const typeColors = {
                        activity: 'border-amber-500/20 bg-amber-500/5 text-amber-400',
                        hotel: 'border-blue-500/20 bg-blue-500/5 text-blue-400',
                        restaurant: 'border-rose-500/20 bg-rose-500/5 text-rose-400',
                        transport: 'border-indigo-500/20 bg-indigo-500/5 text-indigo-400',
                      };

                      return (
                        <div
                          id={`itinerary_item_${item.id}`}
                          key={item.id}
                          className={`flex items-start justify-between bg-theme-card border border-theme-border rounded-xl p-3.5 shadow-sm hover:border-primary/30 transition-colors ${item.completed ? 'opacity-50' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              id={`checkbox_item_${item.id}`}
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => handleToggleItem(item.id)}
                              className="mt-1 w-4 h-4 rounded border-theme-border text-primary focus:ring-primary focus:ring-1 cursor-pointer bg-theme-panel"
                            />
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${typeColors[item.type]}`}>
                                    {item.type}
                                </span>
                                <span className="text-[11px] text-theme-muted font-mono flex items-center gap-0.5">
                                  <Clock size={10} />
                                  {item.time}
                                </span>
                              </div>
                              <h6 className={`font-medium text-xs md:text-sm mt-1 text-theme-text ${item.completed ? 'line-through text-theme-muted' : ''}`}>
                                {item.title}
                              </h6>
                              {item.description && (
                                <p className="text-theme-muted text-[10px] md:text-xs mt-0.5 leading-relaxed">{item.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-center">
                            {item.price > 0 && (
                              <span className="text-xs font-semibold text-theme-text flex items-center">
                                <DollarSign size={12} className="-mr-0.5" />
                                {item.price}
                              </span>
                            )}
                            <button
                              id={`delete_item_btn_${item.id}`}
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 text-theme-muted hover:text-rose-400 rounded-md hover:bg-rose-500/10 transition cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default TripCard;
