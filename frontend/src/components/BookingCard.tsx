import React from 'react';
import { Calendar, Tag, ShieldCheck, Ticket, Plane, Hotel, Star, Ban } from 'lucide-react';
import { Booking } from '../types';
import { useApp } from '../context/AppContext';

interface BookingCardProps {
  booking: Booking;
  key?: any;
}

export function BookingCard({ booking }: BookingCardProps) {
  const { cancelBooking } = useApp();

  const statusStyles = {
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  const icons = {
    flight: Plane,
    hotel: Hotel,
    attraction: Ticket
  };

  const Icon = icons[booking.type] || Ticket;

  return (
    <div id={`booking_card_${booking.id}`} className="bg-zinc-900/40 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl hover:border-white/20 transition duration-300">
      <div className="flex flex-col sm:flex-row">
        {/* Booking Visual Side / Hero bar */}
        <div className="sm:w-32 bg-gradient-to-br from-indigo-950/20 to-zinc-950/30 px-6 py-8 flex flex-col items-center justify-center border-r border-white/10 flex-shrink-0 text-center">
          <div className="p-3 bg-zinc-950 border border-white/10 rounded-2xl shadow-md text-primary mb-2">
            <Icon size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            {booking.type}
          </span>
        </div>

        {/* Content Details */}
        <div className="p-6 flex-1 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusStyles[booking.status]}`}>
                {booking.status}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">ID: {booking.id}</span>
            </div>
            
            <h3 className="font-display font-semibold text-white text-base md:text-lg mb-1">{booking.title}</h3>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">{booking.details}</p>
 
            <div className="grid grid-cols-2 gap-4 mt-4 bg-zinc-950/40 rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-zinc-500" />
                <div>
                  <span className="text-[9px] text-zinc-500 block font-semibold uppercase">DATE / SCHEDULE</span>
                  <span className="text-xs text-zinc-300 font-medium">{booking.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-zinc-500" />
                <div>
                  <span className="text-[9px] text-zinc-500 block font-semibold uppercase">AMOUNT PAID</span>
                  <span className="text-xs text-white font-bold">${booking.price}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/5 flex-wrap gap-2">
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
              <ShieldCheck size={14} />
              <span>Verified Reservation</span>
            </div>
            
            {booking.status !== 'cancelled' && (
              <button
                id={`cancel_booking_btn_${booking.id}`}
                onClick={() => {
                  if (confirm('Are you sure you want to cancel this booking?')) {
                    cancelBooking(booking.id);
                  }
                }}
                className="flex items-center gap-1 px-3 py-1.5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 text-xs font-semibold rounded-lg border border-rose-500/20 transition cursor-pointer"
              >
                <Ban size={12} />
                <span>Cancel Booking</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default BookingCard;
