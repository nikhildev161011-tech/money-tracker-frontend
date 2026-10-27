// Component: Dashboard
// Description: Ultra-polished fintech dashboard with native app feel, smooth pill animations, custom toasts, and clean professional icons.

import React, { useState, useEffect } from 'react';
import { 
  Home, BarChart2, Folder, Plus, Settings, TrendingUp, TrendingDown, 
  Ghost, Code, SlidersHorizontal, ArrowLeft, Globe, ShieldCheck, 
  Laptop, LogOut, Trash2, Check, Wallet, Edit3, Plane, 
  GraduationCap, ShoppingCart, Home as HomeIcon, Dumbbell, Briefcase, 
  X, Receipt, ChevronDown, Sun, Moon, Landmark, Gamepad2, 
  UtensilsCrossed, CarFront, Sparkles, HeartPulse, Box
} from 'lucide-react';

function AnimatedCounter({ value, duration = 1100, prefix = "₹", decimals = 2 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const endVal = Number(value) || 0;
    const startTime = performance.now();
    let frameId;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = endVal * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endVal);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  const isNeg = displayValue < 0;
  const absFormatted = Math.abs(displayValue).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span>
      {isNeg ? `-${prefix}${absFormatted}` : `${prefix}${absFormatted}`}
    </span>
  );
}

export default function Dashboard({ user, onLogout }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'dark';
  });

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('app_theme', nextTheme);
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
  };

  const t = {
    bg: isDark ? '#000000' : '#f8fafc',
    cardBg: isDark ? '#0a0a0a' : '#ffffff',
    secondaryCardBg: isDark ? '#121212' : '#f1f5f9',
    border: isDark ? '#1f2937' : '#e2e8f0',
    borderSecondary: isDark ? '#262626' : '#cbd5e1',
    text: isDark ? '#ffffff' : '#0f172a',
    textSecondary: isDark ? '#9ca3af' : '#64748b',
    textMuted: isDark ? '#6b7280' : '#94a3b8',
    pillContainer: isDark ? '#121212' : '#e2e8f0',
    pillActive: isDark ? '#1f2937' : '#ffffff',
    pillBorder: isDark ? '#374151' : '#cbd5e1',
    bottomNavBg: isDark ? '#0a0a0a' : '#ffffff',
    bottomNavBorder: isDark ? '#1f2937' : '#e2e8f0',
    bottomNavShadow: isDark ? '0 20px 30px rgba(0,0,0,0.85)' : '0 20px 35px rgba(0,0,0,0.12)',
    actionBtnBg: isDark ? '#ffffff' : '#0f172a',
    actionBtnColor: isDark ? '#000000' : '#ffffff',
    shadow: isDark ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)' : '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
  };

  const [activeTab, setActiveTab] = useState('home');
  const [slideDirection, setSlideDirection] = useState('right');
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);

  const [showDeveloperPage, setShowDeveloperPage] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSummaryPage, setShowSummaryPage] = useState(false);
  const [showFilterPage, setShowFilterPage] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [showAddRecordPage, setShowAddRecordPage] = useState(false);
  
  const [recordType, setRecordType] = useState('cashIn');
  const [recordDesc, setRecordDesc] = useState('');
  const [recordAmount, setRecordAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Salary & Income');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoryTab, setCategoryTab] = useState('All');

  const [showEditCollectionPage, setShowEditCollectionPage] = useState(false);
  const [editingCollectionName, setEditingCollectionName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#10b981');
  const [selectedIcon, setSelectedIcon] = useState('wallet');

  const [collectionSubTab, setCollectionSubTab] = useState('All');

  const [ownedCollections, setOwnedCollections] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const tabList = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'analysis', label: 'Analysis', icon: BarChart2 },
    { id: 'collection', label: 'Vaults', icon: Folder }
  ];

  const handleTabSwitch = (newTabId) => {
    const tabOrder = ['home', 'analysis', 'collection'];
    const currentIndex = tabOrder.indexOf(activeTab);
    const nextIndex = tabOrder.indexOf(newTabId);

    if (nextIndex > currentIndex) {
      setSlideDirection('right');
    } else if (nextIndex < currentIndex) {
      setSlideDirection('left');
    }
    setActiveTab(newTabId);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null || touchStartY === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      const tabOrder = ['home', 'analysis', 'collection'];
      const currentIndex = tabOrder.indexOf(activeTab);

      if (deltaX > 0 && currentIndex < tabOrder.length - 1) {
        setSlideDirection('right');
        setActiveTab(tabOrder[currentIndex + 1]);
      } else if (deltaX < 0 && currentIndex > 0) {
        setSlideDirection('left');
        setActiveTab(tabOrder[currentIndex - 1]);
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  useEffect(() => {
    const currentUserId = (user && user.id) ? user.id : 'default_user_161011';
    fetchTransactions(currentUserId);
  }, [user]);

  const fetchTransactions = async (userId) => {
    try {
      const response = await fetch(`https://money-tracker-backend-0bhm.onrender.com/api/transactions/${userId}`);
      const result = await response.json();
      if (result.success) {
        setTransactions(result.data);
      }
      setLoadingTransactions(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoadingTransactions(false);
    }
  };

  const handleSaveRecord = async () => {
    if (!recordDesc.trim() || !recordAmount) {
      showToast("Please enter description and amount.");
      return;
    }

    const currentUserId = (user && user.id) ? user.id : 'default_user_161011';

    try {
      const response = await fetch('https://money-tracker-backend-0bhm.onrender.com/api/transactions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          type: recordType,
          description: recordDesc,
          amount: Number(recordAmount),
          category: selectedCategory
        }),
      });

      const result = await response.json();
      if (result.success) {
        setRecordDesc('');
        setRecordAmount('');
        setShowAddRecordPage(false);
        showToast("Record added successfully");
        fetchTransactions(currentUserId);
      } else {
        showToast(result.message || "Failed to add record.");
      }
    } catch (error) {
      console.error("Error saving record:", error);
      showToast("Error connecting to backend server.");
    }
  };

  const handleDeleteTransaction = async (txnId) => {
    const currentUserId = (user && user.id) ? user.id : 'default_user_161011';
    try {
      const response = await fetch(`https://money-tracker-backend-0bhm.onrender.com/api/transactions/${txnId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        showToast("Record deleted successfully");
        fetchTransactions(currentUserId);
      } else {
        showToast("Failed to delete transaction.");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleDeleteAccount = async () => {
    const currentUserId = (user && user.id) ? user.id : 'default_user_161011';
    try {
      const response = await fetch(`https://money-tracker-backend-0bhm.onrender.com/api/users/delete/${currentUserId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        showToast("Account permanently deleted");
        setTimeout(() => {
          onLogout();
        }, 1500);
      } else {
        showToast("Account signed out securely.");
        setTimeout(() => {
          onLogout();
        }, 1000);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      onLogout();
    }
  };

  const totalCashIn = transactions
    .filter(t => t.type === 'cashIn')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalCashOut = transactions
    .filter(t => t.type === 'cashOut')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalCashIn - totalCashOut;

  const categorySpending = transactions.reduce((acc, curr) => {
    if (curr.type === 'cashOut') {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    }
    return acc;
  }, {});

  const categorySummary = transactions.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = { cashIn: 0, cashOut: 0, count: 0 };
    }
    acc[curr.category].count += 1;
    if (curr.type === 'cashIn') {
      acc[curr.category].cashIn += curr.amount;
    } else {
      acc[curr.category].cashOut += curr.amount;
    }
    return acc;
  }, {});

  const weeklySpendingMap = transactions.reduce((acc, curr) => {
    if (curr.type === 'cashOut') {
      const dateObj = new Date(curr.date);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      acc[dayName] = (acc[dayName] || 0) + curr.amount;
    }
    return acc;
  }, {});

  const [sortBy, setSortBy] = useState('Newest');
  const [filterRecordType, setFilterRecordType] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  const [selectedDay, setSelectedDay] = useState('Sun');

  const prebuiltCategories = [
    { name: 'Salary & Income', type: 'Prebuild', icon: <Landmark size={18} color="#10b981" />, color: 'rgba(16, 185, 129, 0.16)', borderColor: 'rgba(16, 185, 129, 0.35)' },
    { name: 'Entertainment & Leisure', type: 'Prebuild', icon: <Gamepad2 size={18} color="#a855f7" />, color: 'rgba(168, 85, 247, 0.16)', borderColor: 'rgba(168, 85, 247, 0.35)' },
    { name: 'Food & Dining', type: 'Prebuild', icon: <UtensilsCrossed size={18} color="#f59e0b" />, color: 'rgba(245, 158, 11, 0.16)', borderColor: 'rgba(245, 158, 11, 0.35)' },
    { name: 'Transport & Logistics', type: 'Prebuild', icon: <CarFront size={18} color="#3b82f6" />, color: 'rgba(59, 130, 246, 0.16)', borderColor: 'rgba(59, 130, 246, 0.35)' },
    { name: 'General', type: 'Prebuild', icon: <Sparkles size={18} color="#6366f1" />, color: 'rgba(99, 102, 241, 0.16)', borderColor: 'rgba(99, 102, 241, 0.35)' },
    { name: 'Health & Care', type: 'Prebuild', icon: <HeartPulse size={18} color="#f43f5e" />, color: 'rgba(244, 63, 94, 0.16)', borderColor: 'rgba(244, 63, 94, 0.35)' }
  ];

  const ownedCategoriesList = ownedCollections.map(item => ({
    name: item.name,
    type: 'Owned',
    icon: <Box size={18} color={item.color || "#3b82f6"} />,
    color: 'rgba(59, 130, 246, 0.16)',
    borderColor: 'rgba(59, 130, 246, 0.35)'
  }));

  const categoriesList = [...prebuiltCategories, ...ownedCategoriesList];
  const activeTabIndex = Math.max(0, tabList.findIndex(t => t.id === activeTab));
  const collectionTabs = ['All', 'Prebuild', 'Owned'];
  const activeCollectionIndex = Math.max(0, collectionTabs.indexOf(collectionSubTab));
  if (showDeveloperPage) {
    return (
      <div style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: t.bg,
        color: t.text,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1.25rem 2rem 1.25rem',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflowX: 'hidden',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}>
        <style>{`
          * { -webkit-tap-highlight-color: transparent !important; -webkit-user-select: none !important; user-select: none !important; }
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
          }
          .animated-portfolio-btn { animation: pulseGlow 2s infinite; }
          ::-webkit-scrollbar { display: none; }
        `}</style>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '380px', marginInline: 'auto', marginBottom: '1rem' }}>
          <button 
            onClick={() => setShowDeveloperPage(false)}
            style={{
              backgroundColor: t.secondaryCardBg,
              border: `1px solid ${t.borderSecondary}`,
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: t.text
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0, color: t.textSecondary, letterSpacing: '0.05em' }}>Developer Profile</h2>
          <div style={{ width: '40px' }}></div>
        </div>

        <div style={{
          width: '100%',
          maxWidth: '380px',
          marginInline: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          flexGrow: 1,
          justifyContent: 'center'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '220px',
            height: '130px',
            margin: '0 0 1rem 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 15px 25px rgba(37, 99, 235, 0.25))'
          }}>
            <Laptop size={84} color="#3b82f6" strokeWidth={1.5} />
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 0.25rem 0', letterSpacing: '-0.025em', color: t.text }}>NIKHIL GUPTA</h1>
          <p style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: '600', margin: '0 0 1.25rem 0', letterSpacing: '0.05em' }}>
            BCA STUDENT & SOFTWARE DEVELOPER
          </p>

          <div style={{ width: '100%', textAlign: 'left', marginBottom: '1.5rem', padding: '0 0.25rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: t.text, fontWeight: '700', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={16} color="#3b82f6" /> About the Creator
            </h3>
            <p style={{ fontSize: '0.8rem', color: t.textSecondary, lineHeight: '1.5', margin: '0 0 1rem 0' }}>
              Hello! I am NIKHIL GUPTA, a first-year BCA student at IGNOU and a passionate software developer. I love crafting high-performance, mobile-first web apps with clean aesthetics, with an ultimate vision to build impactful technology at Google.
            </p>

            <h3 style={{ fontSize: '0.9rem', color: t.text, fontWeight: '700', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} color="#10b981" /> A Note of Gratitude
            </h3>
            <p style={{ fontSize: '0.8rem', color: t.textSecondary, lineHeight: '1.5', margin: 0 }}>
              To everyone downloading and placing your trust in Money Tracker: Thank you! Your belief inspires me to write cleaner code and build better tools. Your financial privacy and seamless experience are always my top priorities.
            </p>
          </div>

          <a 
            href="https://my-portfolio-omega-self-73.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="animated-portfolio-btn"
            style={{
              backgroundColor: '#1e3a8a',
              color: '#ffffff',
              fontWeight: '600',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.875rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              fontSize: '0.85rem',
              border: '1px solid #3b82f6',
              cursor: 'pointer',
              margin: '0.5rem auto'
            }}
          >
            <Globe size={16} /> Explore Portfolio
          </a>
        </div>
        <div style={{ height: '1rem' }}></div>
      </div>
    );
  }

  if (showAddRecordPage) {
    const activeSelectedCat = categoriesList.find(c => c.name === selectedCategory) || prebuiltCategories[0];

    return (
      <div style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: t.bg,
        color: t.text,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1.25rem 2rem 1.25rem',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflowX: 'hidden',
        position: 'relative',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}>
        <style>{`
          * { -webkit-tap-highlight-color: transparent !important; -webkit-user-select: none !important; user-select: none !important; }
          input[type=number]::-webkit-inner-spin-button, 
          input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
          input[type=number] { -moz-appearance: textfield; }
          ::-webkit-scrollbar { display: none; }
        `}</style>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '380px', marginInline: 'auto', marginBottom: '1rem' }}>
          <button 
            onClick={() => setShowAddRecordPage(false)}
            style={{
              backgroundColor: t.secondaryCardBg,
              border: `1px solid ${t.borderSecondary}`,
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: t.text
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: t.text, letterSpacing: '0.05em' }}>Add Record</h2>
          <div style={{ width: '40px' }}></div>
        </div>

        <div style={{
          width: '100%',
          maxWidth: '380px',
          marginInline: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          flexGrow: 1,
          justifyContent: 'center',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            backgroundColor: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: '1rem',
            padding: '0.3rem'
          }}>
            <button
              onClick={() => setRecordType('cashIn')}
              style={{
                flex: 1,
                backgroundColor: recordType === 'cashIn' ? (isDark ? '#1f2937' : '#e2e8f0') : 'transparent',
                color: recordType === 'cashIn' ? '#10b981' : t.textSecondary,
                border: 'none',
                borderRadius: '0.75rem',
                padding: '0.75rem',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Cash In (+)
            </button>
            <button
              onClick={() => setRecordType('cashOut')}
              style={{
                flex: 1,
                backgroundColor: recordType === 'cashOut' ? (isDark ? '#1f2937' : '#e2e8f0') : 'transparent',
                color: recordType === 'cashOut' ? '#ef4444' : t.textSecondary,
                border: 'none',
                borderRadius: '0.75rem',
                padding: '0.75rem',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Cash Out (-)
            </button>
          </div>

          <div>
            <div style={{
              backgroundColor: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: '1rem',
              padding: '0.85rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <input 
                type="text"
                placeholder="Description"
                value={recordDesc}
                onChange={(e) => setRecordDesc(e.target.value)}
                maxLength={40}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: t.text,
                  fontSize: '0.95rem',
                  outline: 'none',
                  width: '100%'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                <div style={{ height: '2px', backgroundColor: t.border, width: '100%', borderRadius: '1px' }}></div>
              </div>
              <span style={{ fontSize: '0.65rem', color: t.textMuted, textAlign: 'right' }}>{recordDesc.length}/40</span>
            </div>
          </div>

          <div>
            <div style={{
              backgroundColor: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: '1rem',
              padding: '0.85rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: t.textSecondary, fontSize: '1rem', fontWeight: 'bold' }}>₹</span>
                <input 
                  type="number"
                  placeholder="Amount"
                  value={recordAmount}
                  onChange={(e) => setRecordAmount(e.target.value)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: t.text,
                    fontSize: '1rem',
                    fontWeight: '600',
                    outline: 'none',
                    width: '100%'
                  }}
                />
              </div>
              <div style={{ height: '2px', backgroundColor: t.border, width: '100%', borderRadius: '1px', marginTop: '0.2rem' }}></div>
              <span style={{ fontSize: '0.65rem', color: t.textMuted, textAlign: 'right' }}>{recordAmount.length}/8</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {['+₹100', '+₹500', '+₹1000', '+₹5000'].map((amt) => (
              <button
                key={amt}
                onClick={() => setRecordAmount(amt.replace('+₹', ''))}
                style={{
                  backgroundColor: t.cardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: '0.75rem',
                  padding: '0.6rem 0.2rem',
                  color: t.textSecondary,
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {amt}
              </button>
            ))}
          </div>

          <div>
            <p style={{ fontSize: '0.75rem', color: t.textSecondary, fontWeight: '600', marginBottom: '0.5rem' }}>Category</p>
            <div 
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              style={{
                backgroundColor: t.cardBg,
                border: `1px solid ${t.border}`,
                borderRadius: '1rem',
                padding: '0.9rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '0.65rem', 
                  backgroundColor: activeSelectedCat.color, 
                  border: `1px solid ${activeSelectedCat.borderColor}`,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  {activeSelectedCat.icon}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: t.text }}>{selectedCategory}</span>
              </div>
              <ChevronDown size={18} color={t.textSecondary} />
            </div>

            {showCategoryDropdown && (
              <div style={{
                position: 'absolute',
                bottom: '120px',
                left: '0',
                right: '0',
                backgroundColor: t.secondaryCardBg,
                border: `1px solid ${t.borderSecondary}`,
                borderRadius: '1.25rem',
                padding: '1rem',
                boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.9)' : '0 20px 40px rgba(0,0,0,0.15)',
                zIndex: 50,
                maxHeight: '280px',
                overflowY: 'auto'
              }}>
                <div style={{ display: 'flex', backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '1.5rem', padding: '0.25rem', marginBottom: '0.75rem' }}>
                  {['All', 'Prebuild', 'Owned'].map((tab) => (
                    <button
                      key={tab}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategoryTab(tab);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: categoryTab === tab ? (isDark ? '#1f2937' : '#e2e8f0') : 'transparent',
                        color: t.text,
                        border: 'none',
                        borderRadius: '1.25rem',
                        padding: '0.4rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {categoryTab === tab && '✓ '} {tab}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {categoriesList
                    .filter(cat => categoryTab === 'All' || cat.type === categoryTab)
                    .map((cat) => (
                      <div 
                        key={cat.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(cat.name);
                          setShowCategoryDropdown(false);
                        }}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.65rem 0.75rem',
                          borderRadius: '0.75rem',
                          backgroundColor: selectedCategory === cat.name ? (isDark ? '#1a2e26' : '#dcfce7') : 'transparent',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '0.5rem',
                            backgroundColor: cat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {cat.icon}
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: t.text }}>{cat.name}</span>
                        </div>
                        {selectedCategory === cat.name && <Check size={16} color="#10b981" />}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '380px', marginInline: 'auto', paddingTop: '1rem' }}>
          <button 
            onClick={() => setShowAddRecordPage(false)}
            style={{
              flex: 1,
              backgroundColor: t.cardBg,
              color: t.text,
              fontWeight: '600',
              padding: '0.9rem 1rem',
              borderRadius: '2.5rem',
              border: `1px solid ${t.border}`,
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            Cancel
          </button>

          <button 
            onClick={handleSaveRecord}
            style={{
              flex: 1.5,
              backgroundColor: t.actionBtnBg,
              color: t.actionBtnColor,
              fontWeight: '700',
              padding: '0.9rem 1rem',
              borderRadius: '2.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: isDark ? '0 4px 15px rgba(255,255,255,0.2)' : '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            Add
          </button>
        </div>
      </div>
    );
  }
  if (showEditCollectionPage) {
    return (
      <div style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: t.bg,
        color: t.text,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1.25rem 2rem 1.25rem',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflowX: 'hidden',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}>
        <style>{`
          * { -webkit-tap-highlight-color: transparent !important; -webkit-user-select: none !important; user-select: none !important; }
          ::-webkit-scrollbar { display: none; }
        `}</style>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '380px', marginInline: 'auto', marginBottom: '1rem' }}>
          <button 
            onClick={() => setShowEditCollectionPage(false)}
            style={{
              backgroundColor: t.secondaryCardBg,
              border: `1px solid ${t.borderSecondary}`,
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: t.text
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: t.text, letterSpacing: '0.05em' }}>Create Collection</h2>
          <div style={{ width: '40px' }}></div>
        </div>

        <div style={{
          width: '100%',
          maxWidth: '380px',
          marginInline: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          flexGrow: 1,
          justifyContent: 'center'
        }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: t.textSecondary, display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Collection Name</label>
            <div style={{
              backgroundColor: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: '1rem',
              padding: '0.75rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <input 
                type="text"
                placeholder="Enter Collection Name"
                value={editingCollectionName}
                onChange={(e) => setEditingCollectionName(e.target.value)}
                maxLength={25}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: t.text,
                  fontSize: '1rem',
                  fontWeight: '600',
                  outline: 'none',
                  width: '100%'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                <div style={{ height: '2px', backgroundColor: '#3b82f6', width: '60%', borderRadius: '1px' }}></div>
                <span style={{ fontSize: '0.7rem', color: t.textMuted }}>{editingCollectionName.length}/25</span>
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: t.textSecondary, display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Select Theme Color</label>
            <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.25rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {['#3b82f6', '#0d9488', '#10b981', '#f59e0b', '#ec4899', '#a855f7', '#facc15', '#06b6d4', '#6366f1'].map((color) => (
                <div 
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: selectedColor === color ? '2px solid #ffffff' : '2px solid transparent',
                    boxShadow: selectedColor === color ? '0 0 10px rgba(0,0,0,0.4)' : 'none',
                    flexShrink: 0
                  }}
                >
                  {selectedColor === color && <div style={{ width: '8px', height: '8px', backgroundColor: '#ffffff', borderRadius: '50%' }}></div>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: t.textSecondary, display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Select Collection Icon</label>
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {[
                { id: 'plane', icon: <Plane size={20} /> },
                { id: 'edu', icon: <GraduationCap size={20} /> },
                { id: 'cart', icon: <ShoppingCart size={20} /> },
                { id: 'home', icon: <HomeIcon size={20} /> },
                { id: 'gym', icon: <Dumbbell size={20} /> },
                { id: 'brief', icon: <Briefcase size={20} /> },
                { id: 'wallet', icon: <Wallet size={20} /> },
                { id: 'food', icon: <UtensilsCrossed size={20} /> }
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedIcon(item.id)}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '1rem',
                    backgroundColor: selectedIcon === item.id ? (isDark ? '#1e3a8a' : '#dbeafe') : t.cardBg,
                    border: selectedIcon === item.id ? '1px solid #3b82f6' : `1px solid ${t.border}`,
                    color: selectedIcon === item.id ? '#3b82f6' : t.textSecondary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  {item.icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '380px', marginInline: 'auto', paddingTop: '1rem' }}>
          <button 
            onClick={() => setShowEditCollectionPage(false)}
            style={{
              flex: 1,
              backgroundColor: t.cardBg,
              color: t.text,
              fontWeight: '600',
              padding: '0.9rem 1rem',
              borderRadius: '2.5rem',
              border: `1px solid ${t.border}`,
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            Cancel
          </button>

          <button 
            onClick={() => {
              if (editingCollectionName.trim() !== '') {
                setOwnedCollections(prev => [...prev, { name: editingCollectionName, color: selectedColor, icon: selectedIcon }]);
                showToast("Collection created successfully");
              }
              setShowEditCollectionPage(false);
            }}
            style={{
              flex: 1.5,
              backgroundColor: t.actionBtnBg,
              color: t.actionBtnColor,
              fontWeight: '700',
              padding: '0.9rem 1rem',
              borderRadius: '2.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: isDark ? '0 4px 15px rgba(255,255,255,0.2)' : '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  if (showSummaryPage) {
    return (
      <div style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: t.bg,
        color: t.text,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1.25rem 2rem 1.25rem',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflowX: 'hidden',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}>
        <style>{`* { -webkit-tap-highlight-color: transparent !important; -webkit-user-select: none !important; user-select: none !important; }`}</style>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '380px', marginInline: 'auto', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setShowSummaryPage(false)}
            style={{
              backgroundColor: t.secondaryCardBg,
              border: `1px solid ${t.borderSecondary}`,
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: t.text
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: t.text, letterSpacing: '0.05em' }}>Summary</h2>
          <div style={{ width: '40px' }}></div>
        </div>

        <div style={{
          width: '100%',
          maxWidth: '380px',
          marginInline: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexGrow: 1,
          justifyContent: 'center',
          gap: '2rem'
        }}>
          <div style={{ textAlign: 'center', width: '100%' }}>
            <p style={{ color: t.textSecondary, fontSize: '0.85rem', fontWeight: '600', margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Amount</p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: t.text, margin: 0 }}>
              <AnimatedCounter value={netBalance} />
            </h1>
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', backgroundColor: t.cardBg, borderRadius: '1rem', border: `1px solid ${t.border}` }}>
              <span style={{ color: t.textSecondary, fontSize: '0.9rem', fontWeight: '600' }}>Total Cash In</span>
              <span style={{ color: '#10b981', fontSize: '1rem', fontWeight: '700' }}>
                +<AnimatedCounter value={totalCashIn} />
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', backgroundColor: t.cardBg, borderRadius: '1rem', border: `1px solid ${t.border}` }}>
              <span style={{ color: t.textSecondary, fontSize: '0.9rem', fontWeight: '600' }}>Total Cash Out</span>
              <span style={{ color: '#ef4444', fontSize: '1rem', fontWeight: '700' }}>
                -<AnimatedCounter value={totalCashOut} />
              </span>
            </div>
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '380px', marginInline: 'auto' }}>
          <button 
            onClick={() => setShowSummaryPage(false)}
            style={{
              width: '100%',
              backgroundColor: t.cardBg,
              color: t.text,
              fontWeight: '600',
              padding: '0.9rem 1rem',
              borderRadius: '2.5rem',
              border: `1px solid ${t.border}`,
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: t.shadow
            }}
          >
            Got it
          </button>
        </div>
      </div>
    );
  }

  if (showFilterPage) {
    return (
      <div style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: t.bg,
        color: t.text,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1.25rem 2rem 1.25rem',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflowX: 'hidden',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}>
        <style>{`* { -webkit-tap-highlight-color: transparent !important; -webkit-user-select: none !important; user-select: none !important; }`}</style>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '380px', marginInline: 'auto', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setShowFilterPage(false)}
            style={{
              backgroundColor: t.secondaryCardBg,
              border: `1px solid ${t.borderSecondary}`,
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: t.text
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: t.text, letterSpacing: '0.05em' }}>Filter Transactions</h2>
          <div style={{ width: '40px' }}></div>
        </div>

        <div style={{
          width: '100%',
          maxWidth: '380px',
          marginInline: 'auto',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          gap: '1.5rem',
          paddingTop: '0.5rem'
        }}>
          <div>
            <p style={{ color: t.textSecondary, fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem' }}>Sort By</p>
            <div style={{ display: 'flex', backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '1rem', padding: '0.3rem' }}>
              {['Newest', 'Oldest'].map((item) => (
                <button
                  key={item}
                  onClick={() => setSortBy(item)}
                  style={{
                    flex: 1,
                    backgroundColor: sortBy === item ? (isDark ? '#1f2937' : '#e2e8f0') : 'transparent',
                    color: t.text,
                    border: 'none',
                    borderRadius: '0.75rem',
                    padding: '0.75rem',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  {sortBy === item && <Check size={14} color="#3b82f6" />} {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ color: t.textSecondary, fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem' }}>Record Type</p>
            <div style={{ display: 'flex', backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '1rem', padding: '0.3rem' }}>
              {['All', 'Cash In', 'Cash Out'].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilterRecordType(item)}
                  style={{
                    flex: 1,
                    backgroundColor: filterRecordType === item ? (isDark ? '#1f2937' : '#e2e8f0') : 'transparent',
                    color: t.text,
                    border: 'none',
                    borderRadius: '0.75rem',
                    padding: '0.75rem',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem'
                  }}
                >
                  {filterRecordType === item && <Check size={14} color="#3b82f6" />} {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ color: t.textSecondary, fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem' }}>Time</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '1rem', padding: '0.3rem' }}>
              {['All', 'Daily', 'Weekly', 'Monthly'].map((item) => (
                <button
                  key={item}
                  onClick={() => setTimeFilter(item)}
                  style={{
                    backgroundColor: timeFilter === item ? (isDark ? '#1f2937' : '#e2e8f0') : 'transparent',
                    color: t.text,
                    border: 'none',
                    borderRadius: '0.75rem',
                    padding: '0.75rem',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem'
                  }}
                >
                  {timeFilter === item && <Check size={14} color="#3b82f6" />} {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '380px', marginInline: 'auto', paddingTop: '1rem' }}>
          <button 
            onClick={() => setShowFilterPage(false)}
            style={{
              width: '100%',
              backgroundColor: t.cardBg,
              color: t.text,
              fontWeight: '600',
              padding: '0.9rem 1rem',
              borderRadius: '2.5rem',
              border: `1px solid ${t.border}`,
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: t.shadow
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    );
  }
  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: t.bg,
      color: t.text,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.25rem 1.25rem 6.5rem 1.25rem',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflowX: 'hidden',
      position: 'relative',
      WebkitUserSelect: 'none',
      userSelect: 'none'
    }}>
      <style>{`
        * {
          -webkit-tap-highlight-color: transparent !important;
          -webkit-touch-callout: none;
          -webkit-user-select: none !important;
          user-select: none !important;
        }
        button, a, input {
          -webkit-tap-highlight-color: transparent !important;
          outline: none !important;
          -webkit-user-select: none !important;
          user-select: none !important;
        }
        button:focus, button:focus-visible, button:active {
          outline: none !important;
          box-shadow: none;
        }

        @keyframes slideFromRight {
          0% { opacity: 0; transform: translateX(24px) scale(0.98); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes slideFromLeft {
          0% { opacity: 0; transform: translateX(-24px) scale(0.98); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        .tab-slide-right {
          animation: slideFromRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .tab-slide-left {
          animation: slideFromLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .nav-tab-btn:active {
          transform: scale(0.94);
        }
        .plus-action-btn:active {
          transform: scale(0.9);
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .bottom-sheet-anim {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes toastFade {
          0% { opacity: 0; transform: translateY(20px) translateX(-50%); }
          15% { opacity: 1; transform: translateY(0) translateX(-50%); }
          85% { opacity: 1; transform: translateY(0) translateX(-50%); }
          100% { opacity: 0; transform: translateY(20px) translateX(-50%); }
        }
        .toast-popup {
          animation: toastFade 3s ease-in-out forwards;
        }
      `}</style>

      {toastMessage && (
        <div className="toast-popup" style={{
          position: 'fixed',
          bottom: '5.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: t.secondaryCardBg,
          color: t.text,
          border: `1px solid ${t.borderSecondary}`,
          padding: '0.75rem 1.25rem',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: isDark ? '0 10px 25px rgba(0,0,0,0.8)' : '0 10px 25px rgba(0,0,0,0.15)',
          zIndex: 1000,
          whiteSpace: 'nowrap'
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
          {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', width: '100%', maxWidth: '380px', marginInline: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: isDark ? '#1f2937' : '#e0e7ff',
            overflow: 'hidden',
            border: `1px solid ${isDark ? '#374151' : '#c7d2fe'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#3b82f6',
            fontSize: '1rem'
          }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: t.textSecondary, margin: 0 }}>Hello,</p>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: t.text, margin: 0 }}>{user.name}</h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
          <button 
            onClick={() => setShowSettingsModal(true)}
            style={{
              backgroundColor: t.secondaryCardBg,
              border: `1px solid ${t.borderSecondary}`,
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: t.text,
              boxShadow: isDark ? '0 4px 10px rgba(0,0,0,0.5)' : '0 4px 10px rgba(0,0,0,0.06)'
            }}
            title="Settings"
          >
            <Settings size={19} />
          </button>
        </div>
      </div>

      <div 
        key={activeTab} 
        className={slideDirection === 'right' ? 'tab-slide-right' : 'tab-slide-left'}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ width: '100%', maxWidth: '380px', marginInline: 'auto', flexGrow: '1', display: 'flex', flexDirection: 'column' }}
      >
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <>
            <div 
              onClick={() => setShowSummaryPage(true)}
              style={{
                backgroundColor: t.cardBg,
                border: `1px solid ${t.border}`,
                padding: '1.25rem',
                borderRadius: '1.25rem',
                marginBottom: '1.5rem',
                boxShadow: t.shadow,
                cursor: 'pointer',
                transform: activeTab === 'home' ? 'scale(1)' : 'scale(0.98)',
                transition: 'transform 0.3s ease'
              }}
            >
              <p style={{ color: t.textSecondary, fontSize: '0.75rem', fontWeight: '600', textAlign: 'center', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overview</p>
              <p style={{ fontSize: '2.25rem', fontWeight: '800', color: t.text, textAlign: 'center', margin: '0.5rem 0 1rem 0' }}>
                <AnimatedCounter value={netBalance} />
              </p>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ backgroundColor: t.secondaryCardBg, padding: '0.75rem', borderRadius: '0.875rem', flex: 1, border: `1px solid ${t.border}` }}>
                  <span style={{ fontSize: '0.75rem', color: t.textSecondary, display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                    <TrendingUp size={14} color="#10b981" /> Cash In
                  </span>
                  <p style={{ fontWeight: 'bold', color: '#10b981', fontSize: '0.9rem', margin: 0 }}>
                    <AnimatedCounter value={totalCashIn} />
                  </p>
                </div>
                <div style={{ backgroundColor: t.secondaryCardBg, padding: '0.75rem', borderRadius: '0.875rem', flex: 1, border: `1px solid ${t.border}` }}>
                  <span style={{ fontSize: '0.75rem', color: t.textSecondary, display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                    <TrendingDown size={14} color="#ef4444" /> Cash Out
                  </span>
                  <p style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '0.9rem', margin: 0 }}>
                    <AnimatedCounter value={totalCashOut} />
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: t.text }}>Recent Activity</h3>
              <button 
                onClick={() => setShowFilterPage(true)}
                style={{
                  backgroundColor: t.secondaryCardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: t.textSecondary
                }}
                title="Filter Activity"
              >
                <SlidersHorizontal size={16} />
              </button>
            </div>

            {loadingTransactions ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: t.textSecondary }}>Loading database records...</div>
            ) : transactions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {transactions
                  .filter(txn => {
                    if (filterRecordType === 'Cash In') return txn.type === 'cashIn';
                    if (filterRecordType === 'Cash Out') return txn.type === 'cashOut';
                    return true;
                  })
                  .filter(txn => {
                    if (timeFilter === 'Daily') {
                      const txnDate = new Date(txn.date).toDateString();
                      return txnDate === new Date().toDateString();
                    }
                    if (timeFilter === 'Weekly') {
                      const txnDate = new Date(txn.date);
                      const now = new Date();
                      const weekAgo = new Date(now.setDate(now.getDate() - 7));
                      return txnDate >= weekAgo;
                    }
                    if (timeFilter === 'Monthly') {
                      const txnDate = new Date(txn.date);
                      const now = new Date();
                      return txnDate.getMonth() === now.getMonth() && txnDate.getFullYear() === now.getFullYear();
                    }
                    return true;
                  })
                  .sort((a, b) => {
                    if (sortBy === 'Oldest') {
                      return new Date(a.date) - new Date(b.date);
                    } else {
                      return new Date(b.date) - new Date(a.date);
                    }
                  })
                  .map((txn) => {
                    const matchedCategory = categoriesList.find(c => c.name === txn.category) || prebuiltCategories[0];

                    return (
                      <div key={txn._id} style={{
                        backgroundColor: t.cardBg,
                        border: `1px solid ${t.border}`,
                        borderRadius: '1rem',
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.05)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '0.75rem',
                            backgroundColor: matchedCategory.color,
                            border: `1px solid ${matchedCategory.borderColor}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {matchedCategory.icon}
                          </div>
                          <div>
                            <p style={{ fontWeight: '600', fontSize: '0.95rem', margin: '0 0 0.2rem 0', color: t.text }}>{txn.description}</p>
                            <p style={{ fontSize: '0.7rem', color: t.textSecondary, margin: 0 }}>{txn.category} • {new Date(txn.date).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.95rem', color: txn.type === 'cashIn' ? '#10b981' : '#ef4444' }}>
                            {txn.type === 'cashIn' ? '+' : '-'}₹{txn.amount}
                          </span>
                          <button 
                            onClick={() => handleDeleteTransaction(txn._id)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: t.textMuted,
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                            title="Delete Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexGrow: 1
              }}>
                <div style={{ marginBottom: '1rem', color: t.text }}>
                  <Ghost size={64} strokeWidth={1.5} />
                </div>
                <p style={{ color: t.text, fontWeight: '600', fontSize: '1rem', margin: '0.25rem 0' }}>No Activity Yet</p>
                <p style={{ fontSize: '0.75rem', color: t.textMuted, maxWidth: '240px', lineHeight: '1.4', margin: 0 }}>
                  Change filters or tap the "+" button below to add a new entry.
                </p>
              </div>
            )}
          </>
        )}

        {/* ANALYSIS TAB */}
        {activeTab === 'analysis' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, letterSpacing: '-0.025em', color: t.text }}>Insights & Analytics</h2>

            <div 
              onClick={() => setShowSummaryPage(true)}
              style={{
                backgroundColor: t.cardBg,
                border: `1px solid ${t.border}`,
                padding: '1.25rem',
                borderRadius: '1.25rem',
                boxShadow: t.shadow,
                cursor: 'pointer'
              }}
            >
              <p style={{ color: t.textSecondary, fontSize: '0.75rem', fontWeight: '600', textAlign: 'center', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overview</p>
              <p style={{ fontSize: '2.25rem', fontWeight: '800', color: t.text, textAlign: 'center', margin: '0.5rem 0 1rem 0' }}>
                <AnimatedCounter value={netBalance} />
              </p>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ backgroundColor: t.secondaryCardBg, padding: '0.75rem', borderRadius: '0.875rem', flex: 1, border: `1px solid ${t.border}` }}>
                  <span style={{ fontSize: '0.75rem', color: t.textSecondary, display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                    <TrendingUp size={14} color="#10b981" /> Cash In
                  </span>
                  <p style={{ fontWeight: 'bold', color: '#10b981', fontSize: '0.9rem', margin: 0 }}>
                    <AnimatedCounter value={totalCashIn} />
                  </p>
                </div>
                <div style={{ backgroundColor: t.secondaryCardBg, padding: '0.75rem', borderRadius: '0.875rem', flex: 1, border: `1px solid ${t.border}` }}>
                  <span style={{ fontSize: '0.75rem', color: t.textSecondary, display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                    <TrendingDown size={14} color="#ef4444" /> Cash Out
                  </span>
                  <p style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '0.9rem', margin: 0 }}>
                    <AnimatedCounter value={totalCashOut} />
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: t.cardBg,
              border: `1px solid ${t.border}`,
              padding: '1.25rem',
              borderRadius: '1.25rem',
              boxShadow: t.shadow
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0 0 0.25rem 0', color: t.text }}>Weekly Spending Activity</h3>
              <p style={{ fontSize: '0.75rem', color: t.textSecondary, margin: '0 0 1.5rem 0' }}>Tap any bar to see details</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '110px', paddingBottom: '0.5rem', borderBottom: `1px solid ${t.border}` }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const dayAmt = weeklySpendingMap[day] || 0;
                  const maxAmt = Math.max(...Object.values(weeklySpendingMap), 1000);
                  const barHeight = dayAmt > 0 ? Math.min(Math.max((dayAmt / maxAmt) * 90, 15), 90) : 3;
                  const isSelected = selectedDay === day;
                  const barColor = dayAmt > 0 ? '#ef4444' : (isDark ? '#1f2937' : '#e2e8f0');
                  return (
                    <div 
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      <div style={{
                        width: '16px',
                        height: `${barHeight}px`,
                        backgroundColor: barColor,
                        borderRadius: '4px',
                        transition: 'height 0.2s ease'
                      }}></div>
                      <span style={{ fontSize: '0.7rem', color: isSelected ? t.text : t.textSecondary, fontWeight: isSelected ? 'bold' : 'normal' }}>
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: t.textSecondary, margin: '0 0 0.15rem 0' }}>Total Cash In</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>
                    <AnimatedCounter value={totalCashIn} />
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: t.textSecondary, margin: '0 0 0.15rem 0' }}>Total Cash Out</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#ef4444', margin: 0 }}>
                    <AnimatedCounter value={totalCashOut} />
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 0.25rem 0', color: t.text }}>Spending Overview</h3>
              <p style={{ fontSize: '0.75rem', color: t.textSecondary, margin: '0 0 1rem 0' }}>Spending by Category</p>

              <div style={{
                backgroundColor: t.cardBg,
                border: `1px solid ${t.border}`,
                borderRadius: '1.25rem',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                boxShadow: t.shadow
              }}>
                {Object.keys(categorySpending).length > 0 ? (
                  Object.entries(categorySpending).map(([cat, amt]) => (
                    <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${t.border}`, paddingBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', color: t.text, fontWeight: '600' }}>{cat}</span>
                      <span style={{ fontSize: '0.9rem', color: '#ef4444', fontWeight: 'bold' }}>₹{amt}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.8rem', color: t.textMuted, textAlign: 'center', margin: 0 }}>
                    Add cash-out spending records to view category breakdown.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VAULTS / COLLECTIONS TAB */}
        {activeTab === 'collection' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, letterSpacing: '-0.025em', color: t.text }}>Collections & Vaults</h2>

            <div style={{
              position: 'relative',
              display: 'flex',
              backgroundColor: t.cardBg,
              border: `1px solid ${t.border}`,
              borderRadius: '2rem',
              padding: '4px',
              alignItems: 'center'
            }}>
              <div
                style={{
                  position: 'absolute',
                  top: '4px',
                  bottom: '4px',
                  left: '4px',
                  width: 'calc((100% - 8px) / 3)',
                  transform: `translateX(${activeCollectionIndex * 100}%)`,
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDark ? '#374151' : '#cbd5e1'}`,
                  borderRadius: '1.75rem',
                  transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                  pointerEvents: 'none',
                  zIndex: 1,
                  boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.08)'
                }}
              />

              {collectionTabs.map((tab) => {
                const isActive = collectionSubTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setCollectionSubTab(tab)}
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      flex: 1,
                      backgroundColor: 'transparent',
                      color: isActive ? t.text : t.textSecondary,
                      border: 'none',
                      borderRadius: '1.75rem',
                      padding: '0.65rem 0.2rem',
                      fontWeight: isActive ? '700' : '600',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'color 0.25s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem',
                      userSelect: 'none'
                    }}
                  >
                    {isActive && <Check size={14} color="#3b82f6" />}
                    {tab}
                  </button>
                );
              })}
            </div>

            {collectionSubTab === 'All' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[...prebuiltCategories, ...ownedCollections.map(item => ({ 
                  title: item.name, 
                  icon: <Box size={18} color={item.color || "#3b82f6"} />, 
                  color: 'rgba(59, 130, 246, 0.16)',
                  borderColor: 'rgba(59, 130, 246, 0.35)'
                }))].map((item, index) => {
                  const catName = item.name || item.title;
                  const catData = categorySummary[catName] || { cashIn: 0, cashOut: 0, count: 0 };
                  const netCatBalance = catData.cashIn - catData.cashOut;
                  return (
                    <div key={index} style={{
                      backgroundColor: t.cardBg,
                      border: `1px solid ${t.border}`,
                      borderRadius: '1.25rem',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      boxShadow: t.shadow
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '0.875rem',
                          backgroundColor: item.color,
                          border: `1px solid ${item.borderColor}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {item.icon}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 0.2rem 0', color: t.text }}>{catName}</h4>
                          <p style={{ fontSize: '0.75rem', color: t.textSecondary, margin: 0 }}>
                            {catData.count} records
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <div>
                            <p style={{ fontSize: '0.65rem', color: '#10b981', margin: '0 0 0.1rem 0' }}>In: ₹{catData.cashIn}</p>
                            <p style={{ fontSize: '0.65rem', color: '#ef4444', margin: 0 }}>Out: ₹{catData.cashOut}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.7rem', color: t.textSecondary, margin: '0 0 0.1rem 0' }}>Remaining</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: netCatBalance >= 0 ? '#10b981' : '#ef4444', margin: 0 }}>
                              <AnimatedCounter value={netCatBalance} />
                            </p>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setEditingCollectionName(catName);
                          setShowEditCollectionPage(true);
                        }}
                        style={{ backgroundColor: 'transparent', border: 'none', color: t.textSecondary, cursor: 'pointer', padding: '4px' }}
                      >
                        <Edit3 size={17} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {collectionSubTab === 'Prebuild' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {prebuiltCategories.map((item, index) => {
                  const catData = categorySummary[item.name] || { cashIn: 0, cashOut: 0, count: 0 };
                  const netCatBalance = catData.cashIn - catData.cashOut;
                  return (
                    <div key={index} style={{
                      backgroundColor: t.cardBg,
                      border: `1px solid ${t.border}`,
                      borderRadius: '1.25rem',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      boxShadow: t.shadow
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '0.875rem',
                          backgroundColor: item.color,
                          border: `1px solid ${item.borderColor}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {item.icon}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 0.2rem 0', color: t.text }}>{item.name}</h4>
                          <p style={{ fontSize: '0.75rem', color: t.textSecondary, margin: 0 }}>
                            {catData.count} records
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <div>
                            <p style={{ fontSize: '0.65rem', color: '#10b981', margin: '0 0 0.1rem 0' }}>In: ₹{catData.cashIn}</p>
                            <p style={{ fontSize: '0.65rem', color: '#ef4444', margin: 0 }}>Out: ₹{catData.cashOut}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.7rem', color: t.textSecondary, margin: '0 0 0.1rem 0' }}>Remaining</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: netCatBalance >= 0 ? '#10b981' : '#ef4444', margin: 0 }}>
                              <AnimatedCounter value={netCatBalance} />
                            </p>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setEditingCollectionName(item.name);
                          setShowEditCollectionPage(true);
                        }}
                        style={{ backgroundColor: 'transparent', border: 'none', color: t.textSecondary, cursor: 'pointer', padding: '4px' }}
                      >
                        <Edit3 size={17} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {collectionSubTab === 'Owned' && (
              ownedCollections.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {ownedCollections.map((item, index) => {
                    const catData = categorySummary[item.name] || { cashIn: 0, cashOut: 0, count: 0 };
                    const netCatBalance = catData.cashIn - catData.cashOut;
                    return (
                      <div key={index} style={{
                        backgroundColor: t.cardBg,
                        border: `1px solid ${t.border}`,
                        borderRadius: '1.25rem',
                        padding: '1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        boxShadow: t.shadow
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '0.875rem',
                            backgroundColor: 'rgba(59, 130, 246, 0.16)',
                            border: '1px solid rgba(59, 130, 246, 0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Box size={18} color={item.color || "#3b82f6"} />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 0.2rem 0', color: t.text }}>{item.name}</h4>
                            <p style={{ fontSize: '0.75rem', color: t.textSecondary, margin: 0 }}>
                              {catData.count} records
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <div>
                              <p style={{ fontSize: '0.65rem', color: '#10b981', margin: '0 0 0.1rem 0' }}>In: ₹{catData.cashIn}</p>
                              <p style={{ fontSize: '0.65rem', color: '#ef4444', margin: 0 }}>Out: ₹{catData.cashOut}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '0.7rem', color: t.textSecondary, margin: '0 0 0.1rem 0' }}>Remaining</p>
                              <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: netCatBalance >= 0 ? '#10b981' : '#ef4444', margin: 0 }}>
                                <AnimatedCounter value={netCatBalance} />
                              </p>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setEditingCollectionName(item.name);
                            setShowEditCollectionPage(true);
                          }}
                          style={{ backgroundColor: 'transparent', border: 'none', color: t.textSecondary, cursor: 'pointer', padding: '4px' }}
                        >
                          <Edit3 size={17} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '4rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexGrow: 1
                }}>
                  <div style={{ marginBottom: '1rem', color: t.text }}>
                    <Ghost size={64} strokeWidth={1.5} />
                  </div>
                  <p style={{ color: t.text, fontWeight: '600', fontSize: '1rem', margin: '0.25rem 0' }}>No Custom Collections</p>
                  <p style={{ fontSize: '0.75rem', color: t.textMuted, maxWidth: '240px', lineHeight: '1.4', margin: 0 }}>
                    Create custom collections with categories to analyze your spending efficiently.
                  </p>
                </div>
              )
            )}
          </div>
        )}

      </div>

      {/* Floating Animated Bottom Navigation Bar */}
      <div style={{
        position: 'fixed',
        bottom: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '380px',
        backgroundColor: t.bottomNavBg,
        border: `1px solid ${t.bottomNavBorder}`,
        borderRadius: '2.5rem',
        padding: '0.35rem 0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: t.bottomNavShadow,
        zIndex: 10,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          flex: 1,
          backgroundColor: t.pillContainer,
          borderRadius: '2rem',
          padding: '3px',
          marginRight: '0.5rem',
          border: `1px solid ${t.border}`,
          alignItems: 'center'
        }}>
          <div
            style={{
              position: 'absolute',
              top: '3px',
              bottom: '3px',
              left: '3px',
              width: 'calc((100% - 6px) / 3)',
              transform: `translateX(${activeTabIndex * 100}%)`,
              backgroundColor: t.pillActive,
              border: `1px solid ${t.pillBorder}`,
              borderRadius: '1.75rem',
              transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              pointerEvents: 'none',
              zIndex: 1,
              boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 6px rgba(0,0,0,0.08)'
            }}
          />

          {tabList.map((tab) => {
            const isActive = activeTab === tab.id;
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabSwitch(tab.id)}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.55rem 0.2rem',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '1.75rem',
                  color: isActive ? t.text : t.textSecondary,
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? '700' : '500',
                  transition: 'color 0.25s ease, transform 0.15s ease',
                  WebkitTapHighlightColor: 'transparent',
                  outline: 'none',
                  userSelect: 'none'
                }}
                className="nav-tab-btn"
              >
                <IconComponent size={17} color={isActive ? t.text : t.textSecondary} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button 
          onClick={() => setShowAddEntryModal(true)}
          style={{
            backgroundColor: t.actionBtnBg,
            color: t.actionBtnColor,
            border: 'none',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isDark ? '0 4px 14px rgba(255,255,255,0.25)' : '0 4px 14px rgba(0,0,0,0.25)',
            flexShrink: 0,
            transition: 'transform 0.15s ease',
            WebkitTapHighlightColor: 'transparent',
            outline: 'none'
          }}
          className="plus-action-btn"
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>
      </div>

      {showAddEntryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: t.bg,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2rem 1.25rem 2.5rem 1.25rem',
          boxSizing: 'border-box',
          zIndex: 100,
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', maxWidth: '380px' }}>
            <button 
              onClick={() => setShowAddEntryModal(false)}
              style={{
                backgroundColor: t.secondaryCardBg,
                border: `1px solid ${t.borderSecondary}`,
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: t.text
              }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{
            width: '100%',
            maxWidth: '380px',
            margin: 'auto 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '1rem 0'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: t.actionBtnBg,
              color: t.actionBtnColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: isDark ? '0 0 25px rgba(255,255,255,0.25)' : '0 0 25px rgba(0,0,0,0.15)'
            }}>
              <Plus size={36} strokeWidth={2.5} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: t.text, margin: '0 0 0.5rem 0' }}>Add New Entry</h3>
            <p style={{ fontSize: '0.85rem', color: t.textSecondary, maxWidth: '280px', margin: '0 0 2rem 0', lineHeight: '1.4' }}>
              Create a new collection or add a spending entry.
            </p>

            <div style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.85rem',
              marginBottom: '1rem'
            }}>
              <div 
                onClick={() => {
                  setShowAddEntryModal(false);
                  setShowAddRecordPage(true);
                }}
                style={{
                  backgroundColor: t.cardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: '1.25rem',
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  minHeight: '130px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: t.shadow
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '0.875rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.16)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Receipt size={20} color="#10b981" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: t.text, margin: '0 0 0.2rem 0' }}>Spending Record</h4>
                  <p style={{ fontSize: '0.68rem', color: t.textSecondary, margin: 0, lineHeight: '1.2' }}>Add incoming or outgoing</p>
                </div>
              </div>

              <div 
                onClick={() => {
                  setShowAddEntryModal(false);
                  setShowEditCollectionPage(true);
                }}
                style={{
                  backgroundColor: t.cardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: '1.25rem',
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  minHeight: '130px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  boxShadow: t.shadow
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '0.875rem',
                  backgroundColor: 'rgba(244, 63, 94, 0.16)',
                  border: '1px solid rgba(244, 63, 94, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Folder size={20} color="#f43f5e" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: t.text, margin: '0 0 0.2rem 0' }}>Collection Category</h4>
                  <p style={{ fontSize: '0.68rem', color: t.textSecondary, margin: 0, lineHeight: '1.2' }}>Organize into custom groups</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ width: '100%', maxWidth: '380px' }}>
            <button 
              onClick={() => setShowAddEntryModal(false)}
              style={{
                width: '100%',
                backgroundColor: t.cardBg,
                color: t.text,
                fontWeight: '600',
                padding: '0.9rem 1rem',
                borderRadius: '2.5rem',
                border: `1px solid ${t.border}`,
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: '0',
          width: '100vw',
          height: '100vh',
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          zIndex: 100
        }}
        onClick={() => setShowSettingsModal(false)}
        >
          <div 
            className="bottom-sheet-anim"
            style={{
              backgroundColor: t.secondaryCardBg,
              borderTopLeftRadius: '2rem',
              borderTopRightRadius: '2rem',
              padding: '1.5rem 1.25rem 2.5rem 1.25rem',
              width: '100%',
              maxWidth: '380px',
              marginInline: 'auto',
              boxSizing: 'border-box',
              boxShadow: isDark ? '0 -10px 30px rgba(0,0,0,0.8)' : '0 -10px 30px rgba(0,0,0,0.15)',
              borderTop: `1px solid ${t.borderSecondary}`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '40px',
              height: '4px',
              backgroundColor: t.borderSecondary,
              borderRadius: '2px',
              margin: '0 auto 1.25rem auto'
            }}></div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: t.text, margin: '0 0 1.25rem 0' }}>Settings</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              
              <div 
                onClick={toggleTheme}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '1rem',
                  backgroundColor: t.cardBg,
                  border: `1px solid ${t.border}`,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '0.75rem',
                    backgroundColor: isDark ? 'rgba(250, 204, 21, 0.15)' : 'rgba(79, 70, 229, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDark ? '#facc15' : '#4f46e5'
                  }}>
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: t.text, margin: '0 0 0.15rem 0' }}>
                      Switch Theme
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: t.textSecondary, margin: 0 }}>
                      Current: <strong style={{ color: isDark ? '#facc15' : '#4f46e5' }}>{isDark ? 'Dark Mode' : 'Light Mode'}</strong>
                    </p>
                  </div>
                </div>

                <div style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '1rem',
                  backgroundColor: isDark ? '#1f2937' : '#e2e8f0',
                  color: t.text,
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  {isDark ? 'Dark 🌙' : 'Light ☀️'}
                </div>
              </div>

              <div 
                onClick={onLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '1rem',
                  backgroundColor: t.cardBg,
                  border: `1px solid ${t.border}`,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3b82f6'
                }}>
                  <LogOut size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: t.text, margin: '0 0 0.15rem 0' }}>Sign Out</h4>
                  <p style={{ fontSize: '0.75rem', color: t.textSecondary, margin: 0 }}>Safely close current finance database session</p>
                </div>
              </div>

              <div 
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowDeleteConfirmModal(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '1rem',
                  backgroundColor: t.cardBg,
                  border: `1px solid ${t.border}`,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444'
                }}>
                  <Trash2 size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ef4444', margin: '0 0 0.15rem 0' }}>Delete Account</h4>
                  <p style={{ fontSize: '0.75rem', color: t.textSecondary, margin: 0 }}>Permanently erase all your data and collections</p>
                </div>
              </div>

              <div 
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowDeveloperPage(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '1rem',
                  backgroundColor: t.cardBg,
                  border: `1px solid ${t.border}`,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981'
                }}>
                  <Code size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: t.text, margin: '0 0 0.15rem 0' }}>About Developer</h4>
                  <p style={{ fontSize: '0.75rem', color: t.textSecondary, margin: 0 }}>Meet Nikhil Gupta & explore portfolio</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {showDeleteConfirmModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: t.cardBg,
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '20px',
            padding: '24px',
            width: '100%',
            maxWidth: '320px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(239, 68, 68, 0.15)'
          }}>
            <div style={{ color: '#ef4444', fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px', letterSpacing: '-0.02em' }}>
              Delete Account?
            </div>
            <p style={{ color: t.textSecondary, fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px' }}>
              Are you sure you want to permanently delete your account and all financial records? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setShowDeleteConfirmModal(false)}
                style={{
                  flex: 1,
                  background: t.secondaryCardBg,
                  color: t.text,
                  border: `1px solid ${t.border}`,
                  borderRadius: '9999px',
                  padding: '10px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  handleDeleteAccount();
                }}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '10px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
  
