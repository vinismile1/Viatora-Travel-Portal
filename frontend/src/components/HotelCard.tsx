import React, { useState } from 'react';
import { Star, Heart, DollarSign, Bed, Calendar } from 'lucide-react';
import { Hotel } from '../types';
import { useApp } from '../context/AppContext';

interface HotelCardProps {
  hotel: Hotel;
  key?: any;
}

export function HotelCard({ hotel }: HotelCardProps) {
  const { toggleSave, savedPlaces, createBooking, token } = useApp();
  const [bookingDate, setBookingDate] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const isSaved = savedPlaces.some(s => s.placeId === hotel.id);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave(hotel.id, 'hotel');
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert('Please register or log in first to make hotel reservations!');
      return;
    }
    if (!bookingDate) return;

    const success = await createBooking({
      type: 'hotel',
      title: hotel.name,
      details: `Luxury Stay - Double Room (Includes breakfast)`,
      price: hotel.pricePerNight,
      date: bookingDate,
      image: hotel.image
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
    <div id={`hotel_card_${hotel.id}`} className="flex flex-col bg-zinc-900/40 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl hover:border-white/20 transition duration-300 relative text-zinc-200">
      {/* Save Button */}
      <button
        id={`save_hotel_btn_${hotel.id}`}
        onClick={handleSave}
        className="absolute top-4 right-4 z-10 p-2 bg-zinc-950/80 backdrop-blur-md rounded-full border border-white/10 shadow hover:bg-zinc-900 text-zinc-400 hover:text-rose-400 transition-colors"
      >
        <Heart size={18} className={isSaved ? 'fill-rose-500 text-rose-500' : ''} />
      </button>

      {/* Hotel Image */}
      <div className="h-48 overflow-hidden relative bg-zinc-950">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-3 left-3 bg-zinc-950/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-zinc-100 flex items-center border border-white/10">
          <Star size={12} className="text-amber-500 fill-amber-500 mr-1" />
          <span>{hotel.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-semibold text-white text-base md:text-lg mb-1">{hotel.name}</h3>
          <p className="text-zinc-400 text-xs md:text-sm mb-3 line-clamp-2">{hotel.description}</p>
          
          {/* Amenities tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {hotel.amenities.slice(0, 3).map((amen, idx) => (
              <span key={idx} className="bg-white/5 text-zinc-300 border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-medium">
                {amen}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="text-zinc-500 text-[10px] self-center ml-1">+{hotel.amenities.length - 3} more</span>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 pt-3 border-t border-white/10">
            <div>
              <span className="text-xs text-zinc-500 block font-sans">Price per night</span>
              <span className="text-base md:text-lg font-bold text-white flex items-center">
                <DollarSign size={16} className="-mr-0.5 text-indigo-400" />
                {hotel.pricePerNight}
              </span>
            </div>
            
            <button
              id={`book_hotel_modal_btn_${hotel.id}`}
              onClick={() => setShowBookingModal(true)}
              className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover shadow-md transition"
            >
              Book Stay
            </button>
          </div>
        </div>
      </div>

      {/* Simple Booking Modal Overlay */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="font-display font-semibold text-lg text-white mb-2">Book Stay: {hotel.name}</h3>
            <p className="text-xs text-zinc-400 mb-4">Confirm your premium reservation for ${hotel.pricePerNight}/night.</p>
            
            {bookingSuccess ? (
              <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl p-4 text-center my-6">
                <p className="font-semibold mb-1">Stay Confirmed!</p>
                <p className="text-xs">Your reservation has been added to your Bookings.</p>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Check-In Date</label>
                  <div className="relative flex items-center">
                    <Calendar size={16} className="absolute left-3 text-zinc-500" />
                    <input
                      id="hotel_booking_date_input"
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-zinc-900 border border-white/10 rounded-xl outline-none focus:border-primary text-sm text-zinc-100"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    id="cancel_hotel_booking_btn"
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="w-1/2 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-xl text-xs font-semibold transition border border-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    id="confirm_hotel_booking_btn"
                    type="submit"
                    className="w-1/2 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-semibold shadow-md transition"
                  >
                    Confirm Booking
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
export default HotelCard;
