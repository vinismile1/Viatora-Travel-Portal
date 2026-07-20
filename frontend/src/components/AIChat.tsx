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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

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
    <div id="ai_chat_widget" className="fixed bottom-20 right-6 z-50 flex flex-col items-end">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          id="toggle_ai_chat_btn"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4.5 py-3.5 bg-primary hover:bg-primary-hover text-white rounded-full shadow-lg shadow-primary/30 transform hover:scale-105 transition duration-300"
        >
          <Sparkles size={18} className="animate-pulse" />
          <span className="text-xs font-bold font-display tracking-tight">AI Companion</span>
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div id="ai_chat_panel" className="w-[340px] sm:w-[380px] h-[500px] bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-zinc-950 px-5 py-4 border-b border-white/10 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                <Sparkles size={16} className="text-primary animate-pulse" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-sm leading-tight">Viatora Assistant</h4>
                <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span>
                  <span>Personalized Companion</span>
                </p>
              </div>
            </div>
            
            <button
              id="close_ai_chat_btn"
              onClick={() => setIsOpen(false)}
              className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full transition text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#030303]">
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
                    : 'bg-zinc-900 text-zinc-100 border border-white/5 rounded-tl-none'
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
                <div className="bg-zinc-900 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs">
                  <div className="flex gap-1.5 items-center justify-center py-1">
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Pre-seeded Shortcuts / Quick prompts */}
          {messages.length < 3 && (
            <div className="px-4 py-3 border-t border-white/5 bg-zinc-950/80">
              <span className="text-[10px] text-zinc-500 block mb-1.5 font-semibold uppercase tracking-wider">Frequently Asked</span>
              <div className="flex flex-col gap-1.5">
                {shortcuts.map((sh, idx) => (
                  <button
                    id={`shortcut_chat_btn_${idx}`}
                    key={idx}
                    onClick={() => handleSendMessage(sh)}
                    className="flex items-center gap-1.5 text-left text-[11px] font-medium text-zinc-300 hover:text-primary hover:bg-zinc-900 border border-white/5 rounded-lg py-1 px-2.5 transition bg-zinc-950 cursor-pointer"
                  >
                    <CornerDownRight size={10} className="text-zinc-500" />
                    <span>{sh}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Input Footer */}
          <div className="p-3 border-t border-white/5 bg-[#0a0a0a]">
            <div className="relative flex items-center bg-zinc-900 rounded-2xl border border-white/10 px-3.5 py-1.5">
              <input
                id="ai_chat_input"
                type="text"
                disabled={loading}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={token ? "Type your travel query..." : "Please log in first..."}
                className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 outline-none pr-8 py-1.5"
              />
              <button
                id="submit_ai_chat_btn"
                onClick={() => handleSendMessage()}
                disabled={loading || !inputText.trim()}
                className={`absolute right-2 p-1.5 rounded-xl transition cursor-pointer ${
                  inputText.trim() && !loading
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-zinc-600 hover:text-zinc-500 bg-transparent'
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
