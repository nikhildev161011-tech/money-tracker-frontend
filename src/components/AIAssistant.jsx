import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, Bot } from 'lucide-react';

export default function AIAssistant({ onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "नमस्ते! मैं रोहिक्स (Rohix) हूँ, आपका अपना पर्सनल फाइनेंस असिस्टेंट। मेरे डेवलपर क्रिकेट के महान खिलाड़ी 'रोहित शर्मा' के बहुत बड़े फैन हैं, इसलिए उन्होंने प्यार से मेरा नाम 'रोहिक्स' रखा है।\n\nफिलहाल, मैं आपके खर्चों को समझना, बजट मैनेज करना और स्मार्ट ऑटोमेशन जैसे फीचर्स के साथ तैयार हो रहा हूँ—यह सिस्टम अभी अंडर-डेवलपमेंट (Under Development) है और बहुत जल्द आपके लिए लाइव होने वाला है!\n\nतब तक आप अपने ट्रांजैक्शन मैन्युअल रूप से जोड़ सकते हैं। आपका दिन शुभ हो, आपका अपना रोहिक्स!"
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

    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: "जी भाई! इस एडवांस्ड स्मार्ट फीचर पर अभी तेजी से काम चल रहा है, और यह बहुत जल्द नए अपडेट के साथ लाइव हो जाएगा। तब तक रोहिक्स आपके साथ है!" 
        }
      ]);
      setLoading(false);
    }, 600);
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
      zIndex: 99999,
      boxSizing: 'border-box',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style>{`
        * { -webkit-tap-highlight-color: transparent !important; user-select: none !important; }
        input { user-select: text !important; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header with Liquid Glass effect */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        width: '100%',
        boxSizing: 'border-box',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 0 15px rgba(37, 99, 235, 0.5)'
          }}>
            <Bot size={20} />
          </div>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, letterSpacing: '0.02em' }}>Rohix AI Assistant</h2>
        </div>

        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onClose) onClose();
          }}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#ffffff',
            zIndex: 100000
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Chat Messages Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem 1.25rem 6rem 1.25rem',
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
              maxWidth: '85%',
              padding: '0.9rem 1.1rem',
              borderRadius: '1.25rem',
              backgroundColor: msg.sender === 'user' ? '#2563eb' : 'rgba(255, 255, 255, 0.06)',
              backdropFilter: msg.sender === 'ai' ? 'blur(12px)' : 'none',
              WebkitBackdropFilter: msg.sender === 'ai' ? 'blur(12px)' : 'none',
              color: '#ffffff',
              border: msg.sender === 'ai' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              whiteSpace: 'pre-line',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: '1rem', 
              backgroundColor: 'rgba(255, 255, 255, 0.06)', 
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              color: '#9ca3af', 
              fontSize: '0.85rem' 
            }}>
              रोहिक्स सोच रहा है...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Liquid Glass Input Bar */}
      <div style={{
        position: 'fixed',
        bottom: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '92%',
        maxWidth: '420px',
        backgroundColor: 'rgba(18, 18, 18, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '2rem',
        padding: '0.5rem 0.75rem',
        boxSizing: 'border-box',
        zIndex: 10100,
        boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
      }}>
        <form 
          onSubmit={handleSendMessage}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            width: '100%'
          }}
        >
          <button 
            type="button"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#9ca3af',
              flexShrink: 0
            }}
          >
            <Mic size={16} />
          </button>

          <input 
            type="text"
            placeholder="रोहिक्स से कुछ पूछें..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.9rem',
              outline: 'none',
              padding: '0.2rem 0.5rem'
            }}
          />

          <button 
            type="submit"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 2px 10px rgba(255,255,255,0.3)'
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
