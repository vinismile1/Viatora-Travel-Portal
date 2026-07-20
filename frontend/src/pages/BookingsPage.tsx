import React from 'react';
import { Calendar, Ticket, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookingCard } from '../components/BookingCard';

export function BookingsPage() {
  const { bookings } = useApp();

  const activeBookings = bookings.filter(b => b.status !== 'cancelled');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

  return (
    <div id="bookings_page_wrapper" className="pb-24 pt-4 px-4 md:px-8 max-w-4xl mx-auto">
      
      {/* Intro Header */}
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight">
          Reservations & Bookings
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm mt-1">
          Review details for your active flights, secure hotel bookings, and confirmed sightseeing admission tickets.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-12 text-center text-zinc-500 shadow-2xl">
          <div className="w-14 h-14 bg-zinc-950 rounded-2xl flex items-center justify-center text-zinc-400 mx-auto mb-4 border border-white/10">
            <Calendar size={24} />
          </div>
          <h3 className="font-display font-bold text-zinc-300 text-sm md:text-base mb-1">No Active Reservations</h3>
          <p className="text-xs max-w-xs mx-auto leading-relaxed text-zinc-400">
            Discover Kyoto traditional ryokans, secure table slots in Amalfi, or book Louvre entrance passes in our Home feeds!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Active Reservations */}
          {activeBookings.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-zinc-500 mb-4 uppercase tracking-wider">Active Reservations ({activeBookings.length})</h2>
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          )}

          {/* Cancelled History */}
          {cancelledBookings.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <h2 className="text-xs font-bold text-zinc-500 mb-4 uppercase tracking-wider">Cancellation History ({cancelledBookings.length})</h2>
              <div className="space-y-4 opacity-60">
                {cancelledBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
export default BookingsPage;
