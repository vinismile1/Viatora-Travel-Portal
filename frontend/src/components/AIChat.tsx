import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Sparkles, Send, X, Bot, User, CornerDownRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function AIChat() {
  const { sendAIChat, user, token } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    {
      role: 'model',
      text: "Hi there! I am Viatora, your expert AI Travel Companion. ✈️\n\nI can suggest custom flight or hotel options, discover culinary hotspots, and generate day-by-day itineraries. Ask me anything, or try one of the instant questions below!"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Click outside listener to close the chat drawer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Escape key listener to close the chat drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    if (!token) {
      alert('Please log in or create an account first to enjoy personalized AI travel companion chats!');
      return;
    }

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', text }]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const response = await sendAIChat(text, conversationId);
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'I ran into an issue connecting with my travel servers. Please check your network connection and try again!' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const shortcuts = [
    'What should I eat in Kyoto?',
    'Plan a 3-day Paris trip',
    'Best attractions in Bali'
  ];

  return (
    <div id="ai_chat_widget" className="fixed bottom-20 right-4 left-4 sm:left-auto sm:right-6 z-50 flex flex-col items-end">
      {/* Floating Action Button with toggle behavior */}
      <button
        id="toggle_ai_chat_btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-5 py-3.5 bg-primary hover:bg-primary-hover text-white rounded-full shadow-lg shadow-primary/30 transform hover:scale-105 transition duration-300 cursor-pointer"
        title={isOpen ? "Close AI Companion" : "Open AI Companion"}
      >
        {isOpen ? <X size={18} className="animate-in spin-in duration-200" /> : <Sparkles size={18} className="animate-pulse" />}
        <span className="text-xs font-bold font-display tracking-tight">
          {isOpen ? "Close Chat" : "AI Companion"}
        </span>
      </button>

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div 
          ref={panelRef}
          id="ai_chat_panel" 
          className="w-full sm:w-[380px] h-[500px] bg-theme-card rounded-3xl border border-theme-border shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 mb-3"
        >
          
          {/* Header */}
          <div className="bg-theme-panel px-5 py-4 border-b border-theme-border text-theme-text flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles size={16} className="text-primary animate-pulse" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm leading-tight text-theme-text">Viatora Assistant</h4>
                <p className="text-[10px] text-theme-muted flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span>
                  <span>Personalized Companion</span>
                </p>
              </div>
            </div>
            
            <button
              id="close_ai_chat_btn"
              onClick={() => setIsOpen(false)}
              className="p-2 bg-theme-panel hover:bg-rose-600/20 hover:text-rose-500 border border-theme-border rounded-full transition duration-150 text-theme-muted cursor-pointer flex items-center justify-center shadow-sm"
              aria-label="Close AI Companion"
              title="Close Chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-theme-bg/40">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role !== 'user' && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                    <Bot size={14} />
                  </div>
                )}
                
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs font-sans leading-relaxed shadow-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-theme-card text-theme-text border border-theme-border rounded-tl-none'
                }`}>
                  {m.text}
                </div>

                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0 text-[10px] font-bold">
                    {user ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 animate-bounce">
                  <Bot size={14} />
                </div>
                <div className="bg-theme-card border border-theme-border rounded-2xl rounded-tl-none px-4 py-3 shadow-xs">
                  <div className="flex gap-1.5 items-center justify-center py-1">
                    <span className="w-1.5 h-1.5 bg-theme-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-theme-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-theme-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Pre-seeded Shortcuts / Quick prompts */}
          {messages.length < 3 && (
            <div className="px-4 py-3 border-t border-theme-border bg-theme-panel/90">
              <span className="text-[10px] text-theme-muted block mb-1.5 font-semibold uppercase tracking-wider">Frequently Asked</span>
              <div className="flex flex-col gap-1.5">
                {shortcuts.map((sh, idx) => (
                  <button
                    id={`shortcut_chat_btn_${idx}`}
                    key={idx}
                    onClick={() => handleSendMessage(sh)}
                    className="flex items-center gap-1.5 text-left text-[11px] font-medium text-theme-text hover:text-primary hover:bg-theme-panel border border-theme-border rounded-lg py-1 px-2.5 transition bg-theme-card cursor-pointer"
                  >
                    <CornerDownRight size={10} className="text-theme-muted" />
                    <span>{sh}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Input Footer */}
          <div className="p-3 border-t border-theme-border bg-theme-panel">
            <div className="relative flex items-center bg-theme-card rounded-2xl border border-theme-border px-3.5 py-1.5">
              <input
                id="ai_chat_input"
                type="text"
                disabled={loading}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={token ? "Type your travel query..." : "Please log in first..."}
                className="w-full bg-transparent text-xs text-theme-text placeholder-theme-muted outline-none pr-8 py-1.5"
              />
              <button
                id="submit_ai_chat_btn"
                onClick={() => handleSendMessage()}
                disabled={loading || !inputText.trim()}
                className={`absolute right-2 p-1.5 rounded-xl transition cursor-pointer ${
                  inputText.trim() && !loading
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-theme-muted hover:text-theme-text bg-transparent'
                }`}
              >
                <Send size={12} />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
export default AIChat;
