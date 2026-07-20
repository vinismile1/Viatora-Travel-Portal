import React, { useState } from 'react';
import { Compass, Bell, LogOut, Check, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Navbar() {
  const { user, logout, notifications, markAsRead, markAllRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header id="main_header" className="sticky top-0 z-40 w-full bg-[#050505]/80 backdrop-blur-md border-b border-white/10 py-3.5 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div id="brand_logo" className="flex items-center gap-2 select-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-emerald-500 flex items-center justify-center text-white shadow-md shadow-primary/20">
            <Compass size={20} className="animate-spin-slow" />
          </div>
          <div>
            <span className="font-display font-extrabold text-lg md:text-xl text-white tracking-tight flex items-center gap-1">
              Viatora
              <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Sparkles size={8} /> AI Active
              </span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3.5 relative">
              
              {/* Notification bell */}
              <div className="relative">
                <button
                  id="notifications_bell_btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition relative border border-white/10"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-[#050505] rounded-full animate-pulse"></span>
                  )}
                </button>

                {/* Notifications dropdown list */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-zinc-950 rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                      <span className="font-semibold text-xs text-white font-display">Notifications ({unreadCount} unread)</span>
                      {unreadCount > 0 && (
                        <button
                          id="mark_all_read_btn"
                          onClick={() => {
                            markAllRead();
                            setShowNotifications(false);
                          }}
                          className="text-[10px] font-bold text-primary hover:text-primary-hover flex items-center gap-0.5"
                        >
                          <Check size={10} /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-zinc-500 text-xs">
                          No alerts right now. Keep planning!
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            id={`notification_item_${notif.id}`}
                            key={notif.id}
                            onClick={() => {
                              markAsRead(notif.id);
                              setShowNotifications(false);
                            }}
                            className={`p-3.5 hover:bg-white/5 transition cursor-pointer text-left ${!notif.read ? 'bg-primary/10' : ''}`}
                          >
                            <h5 className="font-semibold text-xs text-zinc-100">{notif.title}</h5>
                            <p className="text-zinc-400 text-[11px] leading-relaxed mt-0.5">{notif.message}</p>
                            <span className="text-[9px] text-zinc-500 font-mono block mt-1.5">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Identity info */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-white font-display">{user.name}</span>
                <span className="text-[10px] text-zinc-400 font-mono leading-none">{user.email}</span>
              </div>

              {/* Avatar circle */}
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs select-none">
                {user.name.charAt(0).toUpperCase()}
              </div>

              {/* Logout button */}
              <button
                id="logout_btn"
                onClick={logout}
                className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl transition border border-transparent"
                title="Log Out Session"
              >
                <LogOut size={16} />
              </button>

            </div>
          ) : (
            <div className="text-xs text-zinc-400 font-sans italic flex items-center gap-1 select-none">
              <Sparkles size={12} className="text-amber-500 animate-pulse" />
              <span>Personalizing travel in real-time</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
export default Navbar;
