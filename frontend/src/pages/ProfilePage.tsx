import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Sparkles, Sliders, DollarSign, Wallet, Plus, Trash2, PieChart, ShoppingBag, Utensils, Plane, Hotel, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Expense } from '../types';

export function ProfilePage() {
  const { user, preferences, updatePrefs, trips, expenses, addExpense, deleteExpense, logout } = useApp();
  
  // Preference state
  const [style, setStyle] = useState(preferences?.preferredStyle || 'adventure');
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState<string[]>(preferences?.interests || []);
  const [dietaryInput, setDietaryInput] = useState('');
  const [dietaries, setDietaries] = useState<string[]>(preferences?.dietary || []);

  // Expense states
  const [selectedTripId, setSelectedTripId] = useState('');
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<'food' | 'transport' | 'hotel' | 'shopping' | 'activities' | 'other'>('food');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

  // Sync preferences states
  useEffect(() => {
    if (preferences) {
      setStyle(preferences.preferredStyle);
      setInterests(preferences.interests);
      setDietaries(preferences.dietary);
    }
  }, [preferences]);

  // Sync selected trip for expenses
  useEffect(() => {
    if (trips.length > 0 && !selectedTripId) {
      setSelectedTripId(trips[0].id);
    }
  }, [trips]);

  // Filter expenses based on selected trip
  useEffect(() => {
    if (selectedTripId) {
      const tripExpenses = expenses.filter(e => e.tripId === selectedTripId);
      setFilteredExpenses(tripExpenses);
    } else {
      setFilteredExpenses(expenses);
    }
  }, [selectedTripId, expenses]);

  // Save Preferences
  const handleSavePrefs = async () => {
    await updatePrefs({
      preferredStyle: style as any,
      interests,
      dietary: dietaries
    });
    alert('Your personalized travel preferences have been updated!');
  };

  const handleAddInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (item: string) => {
    setInterests(interests.filter(x => x !== item));
  };

  const handleAddDietary = () => {
    if (dietaryInput.trim() && !dietaries.includes(dietaryInput.trim())) {
      setDietaries([...dietaries, dietaryInput.trim()]);
      setDietaryInput('');
    }
  };

  const handleRemoveDietary = (item: string) => {
    setDietaries(dietaries.filter(x => x !== item));
  };

  // Log Expense
  const handleLogExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTripId || !expenseTitle || !expenseAmount) return;

    const added = await addExpense({
      tripId: selectedTripId,
      category: expenseCategory,
      title: expenseTitle,
      amount: Number(expenseAmount),
      date: expenseDate
    });

    if (added) {
      setExpenseTitle('');
      setExpenseAmount('');
    }
  };

  // Expense calculations
  const totalTripCost = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = filteredExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryColors = {
    food: 'bg-rose-500',
    transport: 'bg-indigo-500',
    hotel: 'bg-blue-500',
    shopping: 'bg-amber-500',
    activities: 'bg-teal-500',
    other: 'bg-gray-500'
  };

  const categoryIcons = {
    food: Utensils,
    transport: Plane,
    hotel: Hotel,
    shopping: ShoppingBag,
    activities: Sparkles,
    other: HelpCircle
  };

  return (
    <div id="profile_page_wrapper" className="pb-24 pt-4 px-4 md:px-8 max-w-4xl mx-auto space-y-10 animate-in fade-in duration-200 text-theme-text">
      
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-theme-text tracking-tight">
            Account & Companion Settings
          </h1>
          <p className="text-theme-muted text-xs md:text-sm mt-1">
            Manage your personal travel styles, refine AI recommendation rules, and log trip expenditures.
          </p>
        </div>
        
        <button
          id="profile_logout_btn"
          onClick={logout}
          className="self-start sm:self-center px-4 py-2 border border-rose-500/20 hover:bg-rose-500/10 text-rose-400 text-xs font-semibold rounded-xl transition cursor-pointer"
        >
          Sign Out Session
        </button>
      </div>

      {/* User profile Identity Card */}
      {user && (
        <div className="bg-theme-card border border-theme-border rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center gap-5 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-display font-extrabold text-xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="font-display font-bold text-theme-text text-base md:text-lg flex items-center justify-center sm:justify-start gap-1.5">
              <span>{user.name}</span>
              <span className="text-emerald-400 bg-emerald-500/10 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">Verified User</span>
            </h3>
            <p className="text-theme-muted font-mono text-xs">{user.email}</p>
            <p className="text-[11px] text-theme-muted mt-1">Active since {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      {/* EXPENSE TRACKER MODULE */}
      <div id="expense_tracker_module" className="bg-theme-card border border-theme-border rounded-[2.5rem] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-theme-border pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <Wallet size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-theme-text text-base">Expense Tracking Module</h3>
              <p className="text-[11px] text-theme-muted">Track expenditures and categories per trip.</p>
            </div>
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full flex items-center gap-0.5 font-mono border border-primary/20">
            Total: ${totalTripCost}
          </span>
        </div>

        {trips.length === 0 ? (
          <div className="text-center p-6 text-theme-muted text-xs bg-theme-panel rounded-2xl border border-theme-border">
            Please plan or generate a trip first in order to activate expense logs!
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Trip selector and Visual breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Trip Select and logging form */}
              <div className="md:col-span-1 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-theme-muted mb-1">SELECT ACTIVE TRIP</label>
                  <select
                    id="expense_trip_select"
                    value={selectedTripId}
                    onChange={(e) => setSelectedTripId(e.target.value)}
                    className="w-full px-2.5 py-2 bg-theme-panel border border-theme-border rounded-xl text-xs outline-none focus:border-primary text-theme-text font-sans cursor-pointer"
                  >
                    {trips.map(t => (
                      <option key={t.id} value={t.id} className="bg-theme-panel text-theme-text">{t.title}</option>
                    ))}
                  </select>
                </div>

                <form onSubmit={handleLogExpense} className="space-y-3 p-3 bg-theme-panel border border-theme-border rounded-2xl">
                  <span className="text-[10px] font-bold text-theme-muted block">LOG TRIP EXPENDITURE</span>
                  
                  <div>
                    <input
                      id="expense_title_input"
                      type="text"
                      required
                      placeholder="Sushi lunch, Uber, Souvenir..."
                      value={expenseTitle}
                      onChange={(e) => setExpenseTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-theme-card border border-theme-border rounded-xl text-xs outline-none focus:border-primary text-theme-text placeholder-theme-muted"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative flex items-center">
                      <DollarSign size={12} className="absolute left-2.5 text-theme-muted" />
                      <input
                        id="expense_amount_input"
                        type="number"
                        required
                        placeholder="Amount"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        className="w-full pl-7 pr-2 py-1.5 bg-theme-card border border-theme-border rounded-xl text-xs outline-none focus:border-primary text-theme-text placeholder-theme-muted"
                      />
                    </div>
                    <div>
                      <select
                        id="expense_category_select"
                        value={expenseCategory}
                        onChange={(e: any) => setExpenseCategory(e.target.value)}
                        className="w-full px-2 py-1.5 bg-theme-card border border-theme-border rounded-xl text-[10px] outline-none text-theme-text focus:border-primary cursor-pointer"
                      >
                        <option value="food" className="bg-theme-card">🍱 Food</option>
                        <option value="transport" className="bg-theme-card">✈️ Transport</option>
                        <option value="hotel" className="bg-theme-card">🏨 Accommodation</option>
                        <option value="shopping" className="bg-theme-card">🛍️ Shopping</option>
                        <option value="activities" className="bg-theme-card">🎟️ Sights</option>
                        <option value="other" className="bg-theme-card">⚙️ Other</option>
                      </select>
                    </div>
                  </div>

                  <button
                    id="submit_expense_btn"
                    type="submit"
                    className="w-full py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md"
                  >
                    Add Expense
                  </button>
                </form>
              </div>

              {/* Graphical Progress charts */}
              <div className="md:col-span-2 space-y-4">
                <span className="text-[10px] font-bold text-theme-muted block uppercase tracking-wider">Expenditure Category Breakdowns</span>
                
                {filteredExpenses.length === 0 ? (
                  <div className="h-40 flex items-center justify-center border border-dashed border-theme-border rounded-2xl text-xs text-theme-muted">
                    No logged items for this trip yet. Fill out the form to log!
                  </div>
                ) : (
                  <div className="space-y-4 bg-theme-panel border border-theme-border rounded-2xl p-4">
                    {/* Render Category lines */}
                    {(['food', 'transport', 'hotel', 'shopping', 'activities', 'other'] as const).map(cat => {
                      const total = categoryTotals[cat] || 0;
                      const percentage = totalTripCost > 0 ? Math.round((total / totalTripCost) * 100) : 0;
                      if (total === 0) return null;
                      const CatIcon = categoryIcons[cat];
                      return (
                        <div key={cat} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="flex items-center gap-1.5 text-theme-text capitalize">
                              <CatIcon size={12} className="text-theme-muted" />
                              <span>{cat}</span>
                            </span>
                            <span className="text-theme-text font-semibold font-mono">${total} ({percentage}%)</span>
                          </div>
                          {/* Progress bar container */}
                          <div className="w-full bg-theme-card h-2 rounded-full overflow-hidden border border-theme-border">
                            <div className={`${categoryColors[cat]} h-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Expenses Lists */}
            {filteredExpenses.length > 0 && (
              <div className="pt-4 border-t border-theme-border">
                <span className="text-[10px] font-bold text-theme-muted block mb-3 uppercase tracking-wider">Detailed expenditures timeline</span>
                <div className="divide-y divide-theme-border max-h-52 overflow-y-auto">
                  {filteredExpenses.map(exp => {
                    const CatIcon = categoryIcons[exp.category] || HelpCircle;
                    return (
                      <div id={`expense_item_${exp.id}`} key={exp.id} className="flex items-center justify-between py-2.5">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl text-white ${categoryColors[exp.category]}`}>
                            <CatIcon size={14} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-xs text-theme-text">{exp.title}</h4>
                            <p className="text-[10px] text-theme-muted">{exp.date} • <span className="capitalize">{exp.category}</span></p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-xs text-theme-text font-mono">${exp.amount}</span>
                          <button
                            id={`delete_expense_btn_${exp.id}`}
                            onClick={() => deleteExpense(exp.id)}
                            className="p-1.5 text-theme-muted hover:text-rose-500 rounded hover:bg-rose-500/10 transition cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* TRAVEL RULE SELECTION / PERSONALIZATION RULES */}
      <div id="ai_rules_module" className="bg-theme-card border border-theme-border rounded-[2.5rem] p-6 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-theme-border pb-4 mb-6">
          <div className="p-1.5 bg-teal-500/10 text-teal-400 rounded-lg">
            <Sliders size={18} />
          </div>
          <div>
            <h3 className="font-display font-bold text-theme-text text-base">Travel Personalization Rules</h3>
            <p className="text-[11px] text-theme-muted">Instruct Gemini AI on how to tailor its itineraries.</p>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* Preferred Style */}
          <div>
            <label className="block text-[10px] font-bold text-theme-muted mb-2">PREFERRED TRAVEL STYLE</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { id: 'adventure', label: '🎒 Adventure' },
                { id: 'luxury', label: '💎 Luxury' },
                { id: 'budget', label: '💵 Budget' },
                { id: 'relaxation', label: '🏖️ Relaxation' },
                { id: 'family', label: '👨‍👩‍👧 Family' }
              ].map(opt => (
                <button
                  id={`style_opt_${opt.id}`}
                  key={opt.id}
                  onClick={() => setStyle(opt.id as any)}
                  className={`py-2 px-3 rounded-xl border text-center text-xs font-semibold transition duration-200 cursor-pointer ${
                    style === opt.id
                      ? 'bg-primary text-white border-primary shadow-lg'
                      : 'bg-theme-panel text-theme-muted border-theme-border hover:bg-theme-card hover:text-theme-text'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Interests Tag manager */}
            <div>
              <label className="block text-[10px] font-bold text-theme-muted mb-1.5">TRAVEL INTERESTS</label>
              <div className="flex gap-2 mb-3">
                <input
                  id="interest_input"
                  type="text"
                  placeholder="e.g. Museums, Hiking, Coffee..."
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                  className="flex-1 px-3 py-2 bg-theme-panel border border-theme-border rounded-xl text-xs outline-none focus:border-primary text-theme-text placeholder-theme-muted"
                />
                <button
                  id="add_interest_btn"
                  onClick={handleAddInterest}
                  className="px-3 bg-theme-panel hover:bg-theme-panel/80 text-theme-text border border-theme-border rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {interests.length === 0 ? (
                  <span className="text-[11px] text-theme-muted italic">No interests added. Type above.</span>
                ) : (
                  interests.map(item => (
                    <span key={item} className="flex items-center gap-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
                      <span>{item}</span>
                      <button id={`remove_interest_btn_${item}`} onClick={() => handleRemoveInterest(item)} className="hover:text-rose-400 text-teal-500/50 font-bold ml-0.5 cursor-pointer">×</button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Dietary Constraints Tag manager */}
            <div>
              <label className="block text-[10px] font-bold text-theme-muted mb-1.5">DIETARY & FOOD PREFERENCES</label>
              <div className="flex gap-2 mb-3">
                <input
                  id="dietary_input"
                  type="text"
                  placeholder="e.g. Vegetarian, Gluten-free..."
                  value={dietaryInput}
                  onChange={(e) => setDietaryInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddDietary()}
                  className="flex-1 px-3 py-2 bg-theme-panel border border-theme-border rounded-xl text-xs outline-none focus:border-primary text-theme-text placeholder-theme-muted"
                />
                <button
                  id="add_dietary_btn"
                  onClick={handleAddDietary}
                  className="px-3 bg-theme-panel hover:bg-theme-panel/80 text-theme-text border border-theme-border rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {dietaries.length === 0 ? (
                  <span className="text-[11px] text-theme-muted italic">No constraints added. Type above.</span>
                ) : (
                  dietaries.map(item => (
                    <span key={item} className="flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
                      <span>{item}</span>
                      <button id={`remove_dietary_btn_${item}`} onClick={() => handleRemoveDietary(item)} className="hover:text-rose-400 text-rose-500/50 font-bold ml-0.5 cursor-pointer">×</button>
                    </span>
                  ))
                )}
              </div>
            </div>

          </div>

          <div className="flex justify-end border-t border-theme-border pt-4">
            <button
              id="save_preferences_btn"
              onClick={handleSavePrefs}
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Save Traveler Rules
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
export default ProfilePage;
