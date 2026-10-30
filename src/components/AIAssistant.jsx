import React, { useState } from 'react';
import { Send, X, Bot, Mic } from 'lucide-react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      text: 'नमस्ते! मैं रोहिक्स (Rohix) हूँ, आपका पर्सनल फाइनेंस असिस्टेंट। मेरा नाम मेरे डेवलपर (जो कि रोहित शर्मा के बहुत बड़े फैन हैं) के पसंदीदा खिलाड़ी से इंस्पायर होकर रखा गया है। बताइए, आज आपके किस खर्चे या बजट में मदद करूँ?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const showCustomToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleVoiceInput = () => {
    showCustomToast("🎙️ माइक फीचर जल्द ही एक्टिव होगा! आप बोलकर भी खर्चा दर्ज कर सकेंगे।");
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      // बैकएंड API को कॉल करना जो Groq AI और MongoDB से जुड़ा है
      const response = await fetch('http://localhost:5000/api/ai/process-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: data.message }
        ]);
        showCustomToast("✅ खर्चा सफलतापूर्व दर्ज हो गया!");
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: "माफ़ करना भाई, इसे समझ नहीं पाया। कृपया दोबारा बोलें।" }
        ]);
      }
    } catch (error) {
      console.error("AI API Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: "सर्वर से कनेक्ट करने में दिक्कत आ रही है।" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    fab: {
      position: 'fixed',
      bottom: '90px',
      left: '20px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'inherit',
      padding: '12px 20px',
      borderRadius: '9999px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      zIndex: 9999,
      fontWeight: '600',
      fontSize: '15px',
      transition: 'all 0.3s ease',
    },
    chatWindow: {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      background: 'radial-gradient(circle at 50% 30%, rgba(37, 99, 235, 0.15), transparent 70%), var(--bg-color, #000000)',
      backdropFilter: 'blur(25px)',
      WebkitBackdropFilter: 'blur(25px)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 10000,
      color: 'var(--text-color, #FFFFFF)',
    },
    header: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '18px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '18px',
      fontWeight: '700',
      margin: 0
    },
    closeBtn: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      color: 'inherit',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s'
    },
    messagesBody: {
      flex: 1,
      padding: '24px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      position: 'relative'
    },
    messageUserWrapper: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%'
    },
    messageAiWrapper: {
      display: 'flex',
      justifyContent: 'flex-start',
      width: '100%'
    },
    messageUser: {
      background: '#2563EB',
      color: '#FFFFFF',
      padding: '14px 18px',
      borderRadius: '18px 18px 0 18px',
      maxWidth: '80%',
      fontSize: '15px',
      boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
    },
    messageAi: {
      background: 'rgba(255, 255, 255, 0.07)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      color: 'inherit',
      padding: '14px 18px',
      borderRadius: '18px 18px 18px 0',
      maxWidth: '80%',
      fontSize: '15px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
    },
    loadingText: {
      fontStyle: 'italic',
      opacity: 0.6
    },
    inputFooter: {
      padding: '18px 24px',
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    input: {
      flex: 1,
      padding: '14px 18px',
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '14px',
      outline: 'none',
      fontSize: '15px',
      color: 'inherit'
    },
    actionButton: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      color: 'inherit',
      padding: '12px',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s'
    },
    sendButton: {
      background: '#2563EB',
      color: '#FFFFFF',
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
      transition: 'transform 0.2s'
    },
    toastCard: {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#FFFFFF',
      padding: '12px 24px',
      borderRadius: '9999px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      zIndex: 20000,
      fontSize: '14px',
      fontWeight: '500'
    }
  };

  return (
    <div>
      <style>
        {`
          @keyframes blink {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
          }
          @keyframes floatHair {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-4px) rotate(4deg); }
          }
          @keyframes bubbleFloat {
            0% { transform: translateY(0px) scale(1); opacity: 0.3; }
            50% { transform: translateY(-20px) scale(1.05); opacity: 0.6; }
            100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          }
          .bot-eyes {
            animation: blink 4s infinite;
            transform-origin: center;
          }
          .bot-hair {
            animation: floatHair 2s ease-in-out infinite;
            transform-origin: top center;
          }
          .liquid-bubble {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), rgba(37,99,235,0.1));
            backdrop-filter: blur(8px);
            animation: bubbleFloat 6s ease-in-out infinite;
            pointer-events: none;
          }
        `}
      </style>

      {toastMessage && (
        <div style={styles.toastCard}>
          {toastMessage}
        </div>
      )}

      {!isOpen && (
        <button style={styles.fab} onClick={() => setIsOpen(true)} title="Rohix AI खोलें">
          <div className="bot-hair" style={{ display: 'flex', alignItems: 'center' }}>
            <Bot size={22} className="bot-eyes" color="#3B82F6" />
          </div>
          <span>Rohix AI</span>
        </button>
      )}

      {isOpen && (
        <div style={styles.chatWindow}>
          <div className="liquid-bubble" style={{ width: '180px', height: '180px', top: '10%', left: '10%', animationDelay: '0s' }}></div>
          <div className="liquid-bubble" style={{ width: '250px', height: '250px', bottom: '15%', right: '10%', animationDelay: '2s' }}></div>
          <div className="liquid-bubble" style={{ width: '120px', height: '120px', top: '50%', right: '25%', animationDelay: '4s' }}></div>

          <div style={styles.header}>
            <h3 style={styles.headerTitle}>
              <div className="bot-hair">
                <Bot size={26} className="bot-eyes" color="#60A5FA" />
              </div> 
              Rohix AI असिस्टेंट
            </h3>
            <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div style={styles.messagesBody}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                style={msg.sender === 'user' ? styles.messageUserWrapper : styles.messageAiWrapper}
              >
                <div style={msg.sender === 'user' ? styles.messageUser : styles.messageAi}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={styles.messageAiWrapper}>
                <div style={{ ...styles.messageAi, ...styles.loadingText }}>
                  रोहिक्स सोच रहा है...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} style={styles.inputFooter}>
            <button type="button" style={styles.actionButton} onClick={handleVoiceInput} title="बोलकर टाइप करें">
              <Mic size={20} color="#60A5FA" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="खर्च के बारे में पूछें..."
              style={styles.input}
            />
            <button type="submit" style={styles.sendButton} title="भेजें">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}