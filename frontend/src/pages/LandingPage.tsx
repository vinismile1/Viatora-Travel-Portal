import React, { useState } from 'react';
import { 
  Compass, Sparkles, Calendar, Ticket, Heart, ArrowRight, CheckCircle, 
  MapPin, Star, Plane, Hotel, Utensils, Send, CheckSquare, Square, 
  Clock, ShieldCheck, Zap, Laptop, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onEnterPortal: (mode?: 'login' | 'register') => void;
}

export function LandingPage({ onEnterPortal }: LandingPageProps) {
  const [activePreviewTab, setActivePreviewTab] = useState<'ai' | 'planner' | 'booking' | 'saved'>('ai');
  const [plannerTasks, setPlannerTasks] = useState([
    { id: 1, text: 'Hike the Path of the Gods (Sentiero degli Dei)', completed: true },
    { id: 2, text: 'Visit Villa Rufolo Gardens in Ravello', completed: false },
    { id: 3, text: 'Limoncello tasting at Piazza Duomo', completed: false },
  ]);

  const [simulatedChat, setSimulatedChat] = useState([
    { sender: 'user', text: 'Recommend a 1-day itinerary for Kyoto' },
    { sender: 'ai', text: '🇯🇵 Here is your curated 1-day Kyoto layout:\n\n🌅 **Morning (08:00)**: Beat the crowds at the stunning **Fushimi Inari-Taisha** shrine.\n\n🎋 **Midday (12:00)**: Take a peaceful stroll through the **Arashiyama Bamboo Grove** and enjoy a traditional tofu lunch nearby.\n\n⛩️ **Afternoon (15:00)**: Discover the golden reflections at the iconic **Kinkaku-ji (Golden Pavilion)**.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Toggle tasks in simulated checklist
  const toggleSimulatedTask = (id: number) => {
    setPlannerTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = plannerTasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / plannerTasks.length) * 100);

  // Handle simulated chat interaction
  const handleSimulatedSend = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim() || isTyping) return;

    setSimulatedChat(prev => [...prev, { sender: 'user', text }]);
    setChatInput('');
    setIsTyping(true);

    // Simulate AI thinking and reply
    setTimeout(() => {
      let aiReply = '';
      if (text.toLowerCase().includes('italy') || text.toLowerCase().includes('amalfi')) {
        aiReply = '🍋 **Amalfi Coast Highlight:** Be sure to catch a scenic ferry from Amalfi to Positano (25 mins). Have a seafood pasta lunch at *Da Vincenzo* and end with lemon gelato!';
      } else if (text.toLowerCase().includes('sushi') || text.toLowerCase().includes('eat')) {
        aiReply = '🍣 **Local Food Tip:** Head to the Gion district in Kyoto for authentic Kaiseki dinner, or visit *Musashi Sushi* for premium conveyor-belt plates with local green tea!';
      } else {
        aiReply = '✈️ **Viatora Advisor:** Excellent choice! I can instantly generate a detailed calendar schedule, check live restaurant tables, and coordinate your reservation vouchers for this destination!';
      }

      setSimulatedChat(prev => [...prev, { sender: 'ai', text: aiReply }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div id="landing_page_viewport" className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans overflow-x-hidden selection:bg-primary/30 selection:text-indigo-400">
      
      {/* Dynamic Navigation Header */}
      <header id="landing_header" className="sticky top-0 z-50 w-full bg-[#050505]/80 backdrop-blur-md border-b border-white/10 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-primary to-emerald-500 flex items-center justify-center text-white shadow-md shadow-primary/25">
            <Compass size={20} className="animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-lg text-white tracking-tight leading-none">
              Viatora
            </h1>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold tracking-wider uppercase block mt-0.5">
              Travel Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            id="landing_header_login_btn"
            onClick={() => onEnterPortal('login')}
            className="text-sm font-medium text-zinc-400 hover:text-white transition duration-200 cursor-pointer"
          >
            Sign In
          </button>
          <button 
            id="landing_header_register_btn"
            onClick={() => onEnterPortal('register')}
            className="px-4 py-2 bg-white/10 hover:bg-white text-zinc-200 hover:text-black text-xs font-bold rounded-full border border-white/10 transition-all duration-300 cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col gap-20">
        
        {/* Hero Section */}
        <section id="hero_section" className="text-center max-w-3xl mx-auto flex flex-col items-center gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-indigo-400 font-mono tracking-wide"
          >
            <Sparkles size={12} className="animate-pulse" />
            POWERED BY GEMINI PRO INTELLIGENCE
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.1]"
          >
            Your Intelligent <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">Gateway</span> to the World
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-base sm:text-lg max-w-2xl leading-relaxed"
          >
            Discover majestic landmarks, design custom multi-day schedules, and catalog hotel rooms & flight codes inside a beautiful dashboard. All orchestrated by an elite, real-time AI companion.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto"
          >
            <button
              id="landing_hero_cta_btn"
              onClick={() => onEnterPortal('register')}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-2xl shadow-lg shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              Begin Your Journey <ArrowRight size={16} />
            </button>
            <button
              id="landing_hero_secondary_btn"
              onClick={() => onEnterPortal('login')}
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-sm font-bold rounded-2xl border border-white/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              Sign In to Portal
            </button>
          </motion.div>
        </section>

        {/* Feature Teasers & Interactive App Mockup Preview */}
        <section id="interactive_showcase_section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-6">
          
          {/* Left panel: Custom Tab selectors */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-4">
            <div className="mb-4">
              <h3 className="font-display font-extrabold text-2xl text-white tracking-tight">
                Inspect App Capabilities
              </h3>
              <p className="text-zinc-500 text-xs mt-1">
                Click a category below to preview its state interface.
              </p>
            </div>

            <div className="space-y-3.5">
              {[
                { 
                  id: 'ai', 
                  title: 'AI Travel Companion', 
                  desc: 'Ask Viatora to draft custom routes, map dining secrets, or recommend templates.', 
                  icon: Sparkles,
                  color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' 
                },
                { 
                  id: 'planner', 
                  title: 'Intelligent Trip Planner', 
                  desc: 'Stitch locations into calendar timelines, build daily checklist schedules, and log milestones.', 
                  icon: Calendar,
                  color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' 
                },
                { 
                  id: 'booking', 
                  title: 'Instant Booking Registry', 
                  desc: 'Lock in flight cards, luxury hotel reservations, and dining vouchers in one central panel.', 
                  icon: Ticket,
                  color: 'border-amber-500/30 text-amber-400 bg-amber-500/5' 
                },
                { 
                  id: 'saved', 
                  title: 'Saved Discoveries', 
                  desc: 'Bookmark local points of interest, restaurants, or lodging suites to access later.', 
                  icon: Heart,
                  color: 'border-rose-500/30 text-rose-400 bg-rose-500/5' 
                },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isSelected = activePreviewTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`preview_tab_select_${tab.id}`}
                    onClick={() => setActivePreviewTab(tab.id as any)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                      isSelected 
                        ? 'bg-zinc-900/90 border-white/10 shadow-lg scale-[1.02]' 
                        : 'bg-zinc-950/30 border-white/5 hover:border-white/10 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-primary to-emerald-500" />
                    )}
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-xl border ${isSelected ? tab.color : 'border-white/5 bg-white/5'}`}>
                        <IconComponent size={18} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white mb-1 flex items-center gap-1.5">
                          {tab.title}
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                        </h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          {tab.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel: Live Interactive Mockup Frame */}
          <div className="lg:col-span-7 bg-zinc-950/80 rounded-4xl border border-white/10 p-4 md:p-6 shadow-2xl flex flex-col justify-between min-h-115 relative overflow-hidden">
            
            {/* Top Frame Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4 text-xs font-mono text-zinc-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/40" />
                <span className="w-3 h-3 rounded-full bg-amber-500/40" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/40" />
                <span className="ml-2 font-semibold text-[10px] text-zinc-400">viatora_companion_hub_v1.2</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={11} /> 12:40 PM
              </div>
            </div>

            {/* Simulated Live Viewport Area */}
            <div className="flex-1 flex flex-col h-full">
              <AnimatePresence mode="wait">
                
                {/* 1. Simulated AI Chat Tab */}
                {activePreviewTab === 'ai' && (
                  <motion.div
                    key="ai_preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div className="space-y-3 max-h-70 overflow-y-auto pr-1 no-scrollbar text-xs">
                      {simulatedChat.map((msg, idx) => (
                        <div 
                          key={idx} 
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
                        >
                          <div className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                            msg.sender === 'user' 
                              ? 'bg-primary text-white rounded-br-none' 
                              : 'bg-zinc-900 border border-white/5 text-zinc-200 rounded-bl-none'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-zinc-900 border border-white/5 text-zinc-400 p-3 rounded-2xl rounded-bl-none flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5">
                      {/* Live Shortcut Buttons */}
                      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-3">
                        <button 
                          onClick={() => handleSimulatedSend('What is the best time of year to visit Santorini?')}
                          className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-[10px] text-indigo-400 border border-indigo-500/20 rounded-full transition cursor-pointer whitespace-nowrap"
                        >
                          ☀️ Santorini Season
                        </button>
                        <button 
                          onClick={() => handleSimulatedSend('Recommend food spots in Rome')}
                          className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-[10px] text-emerald-400 border border-emerald-500/20 rounded-full transition cursor-pointer whitespace-nowrap"
                        >
                          🍝 Food Spots Rome
                        </button>
                      </div>

                      {/* Input Simulation */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type 'italy' or 'sushi' to try me..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSimulatedSend()}
                          className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary text-zinc-200"
                        />
                        <button
                          onClick={() => handleSimulatedSend()}
                          className="p-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl transition cursor-pointer"
                        >
                          <Send size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. Simulated Checklist Planner */}
                {activePreviewTab === 'planner' && (
                  <motion.div
                    key="planner_preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Destination Card Header */}
                      <div className="flex items-center justify-between p-3.5 bg-zinc-900/60 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-white">Amalfi Coast 3-Day Checklist</h4>
                            <span className="text-[10px] text-zinc-500">Scheduled: Sept 24 - Sept 27</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-semibold uppercase tracking-wider rounded-full border border-emerald-500/20">
                          Active Checklist
                        </span>
                      </div>

                      {/* Checklist Loop */}
                      <div className="space-y-2">
                        <p className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase mb-1">SCHEDULED MILESTONES</p>
                        {plannerTasks.map(task => (
                          <div 
                            key={task.id}
                            onClick={() => toggleSimulatedTask(task.id)}
                            className="flex items-center justify-between p-3 bg-zinc-900 hover:bg-zinc-850 rounded-xl border border-white/5 transition cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-3">
                              {task.completed ? (
                                <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                              ) : (
                                <div className="w-4 h-4 border border-zinc-600 rounded shrink-0" />
                              )}
                              <span className={`text-xs ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-200 font-medium'}`}>
                                {task.text}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono text-zinc-500">Day 1</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-white/5 mt-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-zinc-400 font-medium flex items-center gap-1">
                          <CheckSquare size={13} className="text-emerald-400" /> Milestone completion
                        </span>
                        <span className="font-mono text-emerald-400 font-bold">{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-linear-to-r from-emerald-500 to-indigo-500 h-full transition-all duration-500 rounded-full" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. Simulated Booking Vouchers */}
                {activePreviewTab === 'booking' && (
                  <motion.div
                    key="booking_preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col justify-center gap-3.5"
                  >
                    <p className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">SIMULATED VOUCHERS</p>

                    {/* Flight Pass */}
                    <div className="bg-linear-to-r from-indigo-950/40 via-purple-950/20 to-zinc-900 border border-indigo-500/20 rounded-2xl overflow-hidden flex flex-col">
                      <div className="p-3 px-4 bg-indigo-500/10 border-b border-indigo-500/20 flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                          <Plane size={13} /> FLIGHT VOUCHER
                        </span>
                        <span className="font-mono text-[10px] text-indigo-400">VIA-7492</span>
                      </div>
                      <div className="p-4 grid grid-cols-3 gap-2 text-center items-center">
                        <div>
                          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">FROM</p>
                          <h5 className="font-display font-extrabold text-base text-white">NYC</h5>
                          <span className="text-[9px] text-zinc-400">JFK Airport</span>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-[10px] text-zinc-500 font-semibold uppercase">DIRECT</span>
                          <div className="w-full border-t border-dashed border-zinc-700 relative my-1.5">
                            <Plane size={11} className="text-indigo-400 absolute left-1/2 -top-1.5 -translate-x-1/2 rotate-90" />
                          </div>
                          <span className="text-[9px] font-mono text-indigo-400">7h 45m</span>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">TO</p>
                          <h5 className="font-display font-extrabold text-base text-white">FCO</h5>
                          <span className="text-[9px] text-zinc-400">Rome, Italy</span>
                        </div>
                      </div>
                    </div>

                    {/* Hotel Pass */}
                    <div className="bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                          <Hotel size={18} />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-white">Grand Hotel Amalfi</h5>
                          <p className="text-[9px] text-zinc-500">Luxury Double Room (3 Nights)</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[9px] font-semibold uppercase rounded-full">
                          CONFIRMED
                        </span>
                        <p className="text-[8px] text-zinc-500 mt-1 font-mono">CODE: BK-8204</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. Simulated Saved Place Collections */}
                {activePreviewTab === 'saved' && (
                  <motion.div
                    key="saved_preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: 'Fushimi Inari Shrines', tag: 'Explore', rating: 4.9, loc: 'Kyoto, Japan', price: 'Free Entry' },
                        { name: 'Ristorante La Sponda', tag: 'Dine', rating: 4.8, loc: 'Positano, Italy', price: '$$$$' },
                      ].map((place, idx) => (
                        <div key={idx} className="bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden flex flex-col p-3.5 relative group">
                          <button className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-500 flex items-center justify-center">
                            <Heart size={11} fill="currentColor" />
                          </button>
                          <span className="text-[9px] font-mono text-rose-400 font-semibold uppercase tracking-wider mb-1 block">
                            {place.tag}
                          </span>
                          <h5 className="font-bold text-xs text-white leading-tight pr-6 mb-1">
                            {place.name}
                          </h5>
                          <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 mb-2">
                            <MapPin size={9} className="text-rose-400" /> {place.loc}
                          </div>
                          <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5 text-[9px] font-mono">
                            <span className="flex items-center gap-0.5 text-amber-500">
                              <Star size={9} fill="currentColor" /> {place.rating}
                            </span>
                            <span className="text-zinc-500">{place.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-zinc-900/40 rounded-xl border border-dashed border-white/10 text-center text-[10px] text-zinc-500 mt-4">
                      ⭐ Create customized bookmark sets and sync them with your dynamic daily agendas instantly!
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
            
            {/* Interactive Notice banner */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span>● SYSTEM SIMULATOR STATUS: ACTIVE</span>
              <span className="text-emerald-400">CLICK TO INTERACT</span>
            </div>

          </div>

        </section>

        {/* Feature Grid with Core Benefits */}
        <section id="why_viatora_section" className="space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight">
              A Complete Travel Ecosystem
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm">
              We replace five fragmented trip apps with one elegant, high-performance web dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Benefit 1 */}
            <div className="p-6 rounded-4xl bg-zinc-950 border border-white/5 flex flex-col justify-between hover:border-white/10 transition duration-300">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <h4 className="font-bold text-sm text-white">Private & Local Storage</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Your itineraries and flight codes are preserved locally in secure states. Total discretion, zero track files, and zero visual clutter.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 mt-6">
                <Zap size={10} className="text-indigo-400" /> SECURE CONTAINER
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="p-6 rounded-4xl bg-zinc-950 border border-white/5 flex flex-col justify-between hover:border-white/10 transition duration-300">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <h4 className="font-bold text-sm text-white">Gemini Conversational Layer</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  No generic templates here. Get unique culinary pointers, cultural guides, and custom day plans drafted instantly through our server-side LLM engine.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 mt-6">
                <Zap size={10} className="text-emerald-400" /> REAL-TIME AI LAYERS
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="p-6 rounded-4xl bg-zinc-950 border border-white/5 flex flex-col justify-between hover:border-white/10 transition duration-300">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Ticket size={20} />
                </div>
                <h4 className="font-bold text-sm text-white">Unified Voucher Wallet</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Instantly book flights, double rooms, and gourmet tables inside the platform directory. We catalog and print details cleanly for stress-free transit.
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 mt-6">
                <Zap size={10} className="text-amber-400" /> DIGITAL PASS HUB
              </div>
            </div>

          </div>
        </section>

        {/* Closing Call-To-Action Segment */}
        <section id="closing_cta_section" className="bg-zinc-950 rounded-[2.5rem] border border-white/10 p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-primary/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="max-w-xl mx-auto space-y-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 text-indigo-400 flex items-center justify-center mx-auto shadow-md">
              <Compass size={24} className="animate-pulse" />
            </div>
            
            <h3 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight">
              Unlock Your Ultimate Travel Companion
            </h3>
            
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
              Create a free account or log in now to experience personalized AI itineraries, interactive maps, and complete itinerary control in real-time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                id="landing_bottom_cta_btn"
                onClick={() => onEnterPortal('register')}
                className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-lg transition-all duration-200 cursor-pointer"
              >
                Sign Up Now
              </button>
              <button
                id="landing_bottom_secondary_btn"
                onClick={() => onEnterPortal('login')}
                className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-bold rounded-xl border border-white/10 transition-all duration-200 cursor-pointer"
              >
                Already Registered? Log In
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Footer copyright */}
      <footer className="py-6 px-12 border-t border-white/5 bg-zinc-950 text-center text-[10px] text-zinc-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <span>© 2026 VIATORA PLATFORM. ALL RIGHTS RESERVED.</span>
        <span className="flex items-center gap-1.5"><Laptop size={11} /> CLOUD RUN INGRESS ENFORCED</span>
      </footer>

    </div>
  );
}

export default LandingPage;
