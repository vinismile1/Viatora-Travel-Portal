// Suppress missing type declarations for 'react' in this environment
// @ts-ignore
import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AIChat } from './components/AIChat';
import { AuthPage } from './pages/AuthPage';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { BookingsPage } from './pages/BookingsPage';
import { TripsPage } from './pages/TripsPage';
import { SavedPage } from './pages/SavedPage';
import { ProfilePage } from './pages/ProfilePage';

function AppContent() {
  const { token, activeTab } = useApp();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // If user is not logged in / authenticated, enforce beautiful LandingPage first
  if (!token) {
    if (showAuth) {
      return (
        <AuthPage 
          onBackToLanding={() => setShowAuth(false)} 
          initialMode={authMode} 
        />
      );
    }
    return (
      <LandingPage 
        onEnterPortal={(mode) => {
          setAuthMode(mode || 'login');
          setShowAuth(true);
        }} 
      />
    );
  }

  // Render tab modules dynamically
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'bookings':
        return <BookingsPage />;
      case 'trips':
        return <TripsPage />;
      case 'saved':
        return <SavedPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div id="app_viewport" className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans selection:bg-primary/30 selection:text-indigo-400">
      {/* Dynamic Header */}
      <Navbar />

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto">
        {renderActiveTab()}
      </main>

      {/* Floating AI Travel Companion drawer */}
      <AIChat />

      {/* Persistent bottom navigational rail */}
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
