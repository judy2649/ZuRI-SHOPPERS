import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { Country, CartItem } from '../types';

interface AIAssistantProps {
  country: Country;
  cart: CartItem[];
  currencySymbol: string;
  onAddProductById: (id: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  country, 
  cart, 
  currencySymbol,
  onAddProductById 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Jambo! 👋 Welcome to **Zuri Shoppers**! I am **Zuri**, your personal East African AI shopping genius. 

I can help you:
* Recommend the best smartphones, accessories, or home appliances.
* Find delicious supermarket items or traditional fabrics like Maasai Shukas.
* Check shipping rates for towns in Kenya and Uganda.
* Apply active promo codes (like **WELCOME25**)!

What are you shopping for in **${country}** today? 🌟`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle sugested quick questions
  const handleQuickQuestion = (question: string) => {
    if (isLoading) return;
    sendMessage(question);
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setErrorStatus(null);

    // Prepare payload context
    const chatHistory = [...messages, userMsg].map(m => ({
      role: m.role,
      text: m.text
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          country,
          cart
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reach Zuri Shoppers Assistant');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: data.text,
        timestamp: new Date()
      }]);

      // Check if response contains a hint to add a product (e.g., in brackets like ADD_TO_CART:phone-infinix)
      if (data.text.includes('ADD_TO_CART:')) {
        const match = data.text.match(/ADD_TO_CART:([a-zA-Z0-9-]+)/);
        if (match && match[1]) {
          onAddProductById(match[1]);
        }
      }

    } catch (err: any) {
      console.error(err);
      setErrorStatus('Could not communicate with Zuri. Free mode has been activated.');
      
      // Fallback response
      const fallbackText = `Jambo! It looks like our network is loaded right now, but I can tell you that we have excellent **Phones**, **Tents**, and **Maasai Shukas** in stock today in ${country}! Use code **ZURI10** for 10% off. Let me know if you would like me to show any specific category! ✨`;
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: fallbackText,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage(inputValue);
    }
  };

  const suggestions = country === 'Kenya' 
    ? [
        "Show me phones under KSh 15,000",
        "Explain Zuri Shoppers Express",
        "What discount codes are active?",
        "Tell me about the Zuri Air Fryer"
      ]
    : [
        "Tell me about the street Rolex kit!",
        "Suggest electronics under USh 500,000",
        "How much is shipping to Gulu / Jinja?",
        "Are there Kampala specific deals?"
      ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gold hover:bg-gold-hover text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center animate-bounce hover:animate-none"
        style={{ 
          boxShadow: '0 0 15px rgba(197, 160, 89, 0.6), 0 0 30px rgba(30, 58, 138, 0.3)' 
        }}
        id="zuri-ai-toggle"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 z-40 w-[360px] sm:w-[400px] h-[550px] bg-[#090e16] text-white rounded-2xl shadow-2xl border border-gold/30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-200"
          id="zuri-ai-chat"
        >
          {/* Ambient blurred glowing blue-sphere backdrop behind the dark container */}
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-600/10 rounded-full blur-[60px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none"></div>

          {/* Header */}
          <div className="relative z-10 bg-gradient-to-r from-slate-950 to-[#0e1625] border-b border-gold/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-gold to-gold-light p-1.5 rounded-xl">
                <Bot size={20} className="text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm tracking-wide">ZURI</h4>
                  <span className="bg-gold/20 text-gold-light text-[10px] px-1.5 py-0.5 rounded font-mono">
                    AI Assistant
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Online • Ready to assist you</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-gold p-1 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Warning Banner block if no keys are bound */}
          {errorStatus && (
            <div className="relative z-10 bg-amber-500/10 border-b border-amber-500/20 text-xs px-3 py-1.5 text-amber-300 flex items-center gap-1.5">
              <AlertCircle size={12} />
              <span>{errorStatus}</span>
            </div>
          )}

          {/* Messages Body */}
          <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div className={`p-1.5 rounded-full flex-shrink-0 h-8 w-8 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-gold text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div className="space-y-1">
                  <div className={`rounded-2xl p-3 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-slate-800 text-slate-100 rounded-tr-none' 
                      : 'bg-slate-950 border border-slate-800 text-slate-100 rounded-tl-none'
                  }`}>
                    {/* Basic Markdown style renderer for bold, list elements, and bullet points */}
                    <div className="space-y-1 whitespace-pre-wrap">
                      {msg.text.split('\n').map((line, idx) => {
                        let content = line;
                        
                        // Bold parsing
                        if (content.includes('**')) {
                          const parts = content.split('**');
                          return (
                            <p key={idx} className="my-0.5">
                              {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-gold-light font-semibold">{p}</strong> : p)}
                            </p>
                          );
                        }

                        // Bullet list parsing
                        if (content.trim().startsWith('* ')) {
                          const listText = content.trim().slice(2);
                          // Inner bold parsing for lists
                          if (listText.includes('**')) {
                            const subparts = listText.split('**');
                            return (
                              <li key={idx} className="ml-4 list-disc text-slate-300 py-0.5">
                                {subparts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-gold-light font-semibold">{p}</strong> : p)}
                              </li>
                            );
                          }
                          return <li key={idx} className="ml-4 list-disc text-slate-300 py-0.5">{listText}</li>;
                        }

                        return <p key={idx} className="my-0.5">{content}</p>;
                      })}
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-500 block text-right px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 max-w-[85%] mr-auto">
                <div className="p-1.5 rounded-full bg-slate-800 text-slate-300 h-8 w-8 flex items-center justify-center">
                  <Bot size={14} />
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-3 text-slate-400 text-xs flex items-center gap-1.5">
                  <span className="flex gap-1 animate-pulse">
                    <span className="h-1.5 w-1.5 bg-gold rounded-full animate-bounce"></span>
                    <span className="h-1.5 w-1.5 bg-gold rounded-full animate-bounce delay-100"></span>
                    <span className="h-1.5 w-1.5 bg-gold rounded-full animate-bounce delay-200"></span>
                  </span>
                  <span>Zuri is checking inventory...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions list */}
          <div className="relative z-10 px-4 py-2 border-t border-slate-800 bg-slate-950/75 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(suggestion)}
                className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 hover:border-gold/40 border border-slate-700 text-[11px] text-gold-light px-2.5 py-1.5 rounded-full transition-all duration-150 cursor-pointer text-ellipsis overflow-hidden"
              >
                <Sparkles size={10} />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>

          {/* Action Input Bar */}
          <div className="relative z-10 p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything about stores, deals..."
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-gold outline-none rounded-xl text-xs px-3.5 py-2.5 text-slate-200 placeholder:text-slate-500 disabled:opacity-55"
              id="zuri-ai-input"
            />
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={isLoading || !inputValue.trim()}
              className="bg-gold hover:bg-gold-hover disabled:opacity-50 text-slate-950 p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer"
            >
              <Send size={14} className="text-slate-950 font-bold" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
