import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Mic, Bot, User, ArrowLeft } from 'lucide-react';

export default function AIAssistant({ onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "नमस्ते! मैं रोहिक्स (Rohix) हूँ, आपका पर्सनल फाइनेंस असिस्टेंट। बताइए, आज आपके किस खर्चे या बजट में मदद करूँ?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const currentUserId = localStorage.getItem('user_id') || 'default_user_161011';
      
      const response = await fetch('https://money-tracker-backend-0bhm.onrender.com/api/ai/process-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userId: currentUserId
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessages(prev => [...prev, { sender: 'ai', text: result.message }]);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error processing your request.' }]);
      }
    } catch (error) {
      console.error('AI Request Error:', error);
      setMessages(prev => [...prev, { sender: 'ai', text: 'Network error. Please check your backend connection.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000000',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      boxSizing: 'border-box',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style>{`
        * { -webkit-tap-highlight-color: transparent !important; user-select: none !important; }
        input { user-select: text !important; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        borderBottom: '1px solid #1f2937',
        backgroundColor: '#0a0a0a',
        width: '100%',
        boxSizing: 'border-box',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#1e3a8a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#3b82f6'
          }}>
            <Bot size={20} />
          </div>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, letterSpacing: '0.02em' }}>Rohix AI असिस्टेंट</h2>
        </div>

        <button 
          onClick={onClose}
          style={{
            backgroundColor: '#121212',
            border: '1px solid #262626',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#ffffff'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem 1.25rem 7rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxSizing: 'border-box'
      }}>
        {messages.map((msg, index) => (
          <div 
            key={index}
            style={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              width: '100%'
            }}
          >
            <div style={{
              maxWidth: '82%',
              padding: '0.85rem 1rem',
              borderRadius: '1rem',
              backgroundColor: msg.sender === 'user' ? '#2563eb' : '#121212',
              color: '#ffffff',
              border: msg.sender === 'ai' ? '1px solid #1f2937' : 'none',
              fontSize: '0.9rem',
              lineHeight: '1.5',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '0.75rem 1rem', borderRadius: '1rem', backgroundColor: '#121212', border: '1px solid #1f2937', color: '#9ca3af', fontSize: '0.85rem' }}>
              Rohix is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Bottom Input Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#0a0a0a',
        borderTop: '1px solid #1f2937',
        padding: '0.85rem 1rem calc(1rem + env(safe-area-inset-bottom)) 1rem',
        boxSizing: 'border-box',
        zIndex: 1010
      }}>
        <form 
          onSubmit={handleSendMessage}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          <button 
            type="button"
            style={{
              backgroundColor: '#121212',
              border: '1px solid #262626',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#9ca3af',
              flexShrink: '0'
            }}
          >
            <Mic size={18} />
          </button>

          <input 
            type="text"
            placeholder="खर्च के बारे में पूछें..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: '#121212',
              border: '1px solid #262626',
              borderRadius: '9999px',
              padding: '0.75rem 1.15rem',
              color: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />

          <button 
            type="submit"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: '0',
              boxShadow: '0 4px 12px rgba(255,255,255,0.2)'
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
