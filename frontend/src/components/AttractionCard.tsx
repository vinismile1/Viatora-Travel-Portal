import React, { useState } from 'react';
import { Star, Heart, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Attraction } from '../types';
import { useApp } from '../context/AppContext';

interface AttractionCardProps {
  attraction: Attraction;
  key?: any;
}

export function AttractionCard({ attraction }: AttractionCardProps) {
  const { toggleSave, savedPlaces, createBooking, token } = useApp();
  const [bookingDate, setBookingDate] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const isSaved = savedPlaces.some(s => s.placeId === attraction.id);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave(attraction.id, 'attraction');
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in first to book tour tickets!');
      return;
    }
    if (!bookingDate) return;

    const success = await createBooking({
      type: 'attraction',
      title: `${attraction.name} Admission Pass`,
      details: `Full-access day pass. Category: ${attraction.category}`,
      price: attraction.price || 0,
      date: bookingDate,
      image: attraction.image
    });

    if (success) {
      setBookingSuccess(true);
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess(false);
        setBookingDate('');
      }, 2000);
    }
  };

  return (
    <div id={`attraction_card_${attraction.id}`} className="flex flex-col bg-zinc-900/40 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl hover:border-white/20 transition duration-300 relative text-zinc-200">
      {/* Save Button */}
      <button
        id={`save_attraction_btn_${attraction.id}`}
        onClick={handleSave}
        className="absolute top-4 right-4 z-10 p-2 bg-zinc-950/80 backdrop-blur-md rounded-full border border-white/10 shadow hover:bg-zinc-900 text-zinc-400 hover:text-rose-400 transition-colors"
      >
        <Heart size={18} className={isSaved ? 'fill-rose-500 text-rose-500' : ''} />
      </button>

      {/* Attraction Image */}
      <div className="h-48 overflow-hidden relative bg-zinc-950">
        <img
          src={attraction.image}
          alt={attraction.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 bg-[#4f46e5] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize border border-white/10">
          {attraction.category}
        </div>
        <div className="absolute bottom-3 left-3 bg-zinc-950/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-zinc-100 flex items-center border border-white/10">
          <Star size={12} className="text-amber-500 fill-amber-500 mr-1" />
          <span>{attraction.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-semibold text-white text-base md:text-lg mb-1">{attraction.name}</h3>
          <p className="text-zinc-400 text-xs md:text-sm mb-4 line-clamp-2">{attraction.description}</p>
        </div>

        <div>
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div>
              <span className="text-xs text-zinc-500 block">Admission</span>
              <span className="text-sm md:text-base font-bold text-white flex items-center">
                {attraction.price === 0 ? (
                  <span className="text-emerald-400 font-semibold">Free Entry</span>
                ) : (
                  <>
                    <DollarSign size={14} className="-mr-0.5 text-zinc-400" />
                    <span>{attraction.price}</span>
                  </>
                )}
              </span>
            </div>
            
            <button
              id={`book_attraction_modal_btn_${attraction.id}`}
              onClick={() => setShowBookingModal(true)}
              className="px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-xl hover:bg-amber-600 shadow-md transition"
            >
              Get Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Simple Booking Modal Overlay */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="font-display font-semibold text-lg text-white mb-1">Get Tickets: {attraction.name}</h3>
            <p className="text-xs text-zinc-400 mb-4">Confirm booking passes. Price: {attraction.price === 0 ? 'Free' : `$${attraction.price}`}.</p>
            
            {bookingSuccess ? (
              <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl p-4 text-center my-6">
                <p className="font-semibold mb-1">Tickets Booked!</p>
                <p className="text-xs">Your entry passes have been added to your Bookings profile.</p>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Target Date</label>
                  <div className="relative flex items-center">
                    <Calendar size={16} className="absolute left-3 text-zinc-500" />
                    <input
                      id="attraction_booking_date_input"
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-zinc-900 border border-white/10 rounded-xl outline-none focus:border-amber-500 text-sm text-zinc-100"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    id="cancel_attraction_booking_btn"
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="w-1/2 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-xl text-xs font-semibold transition border border-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    id="confirm_attraction_booking_btn"
                    type="submit"
                    className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-md transition"
                  >
                    Get Pass
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default AttractionCard;
