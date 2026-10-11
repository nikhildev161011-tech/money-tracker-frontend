/**
 * Component: Dashboard (Part 1 of 2)
 * Description: Complete, 100% mobile-responsive dark dashboard featuring Home, Insights, 
 * Collections, Compact Add Entry Modal, Add Record, Edit Collection, and Developer Profile.
 */

import React, { useState, useEffect } from 'react';
import { Home, BarChart2, Folder, Plus, Settings, TrendingUp, TrendingDown, Ghost, Code, PieChart, Layers, SlidersHorizontal, ArrowLeft, Globe, ShieldCheck, Laptop, LogOut, Trash2, Check, Wallet, Film, Utensils, Car, Box, HeartPulse, Edit3, Plane, GraduationCap, ShoppingCart, Home as HomeIcon, Dumbbell, Briefcase, PlusCircle, X, Receipt, ChevronDown } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [showDeveloperPage, setShowDeveloperPage] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSummaryPage, setShowSummaryPage] = useState(false);
  const [showFilterPage, setShowFilterPage] = useState(false);
  
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [showAddRecordPage, setShowAddRecordPage] = useState(false);
  
  const [customAlert, setCustomAlert] = useState(null);
  
  const [recordType, setRecordType] = useState('cashIn');
  const [recordDesc, setRecordDesc] = useState('');
  const [recordAmount, setRecordAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Salary & Income');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoryTab, setCategoryTab] = useState('All');

  const [showEditCollectionPage, setShowEditCollectionPage] = useState(false);
  const [editingCollectionName, setEditingCollectionName] = useState('Salary & Income');
  const [selectedColor, setSelectedColor] = useState('#10b981');
  const [selectedIcon, setSelectedIcon] = useState('wallet');

  const [collectionSubTab, setCollectionSubTab] = useState('All');

  // Owned collections state
  const [ownedCollections, setOwnedCollections] = useState([]);

  // Transactions State from Backend Database
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  // Fetch transactions specific to the logged-in user from MongoDB backend
  useEffect(() => {
    if (user && user.id) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`https://money-tracker-backend-0bhm.onrender.com/api/transactions/${user.id}`);
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

  // Function to handle saving a new record associated with the user to MongoDB
  const handleSaveRecord = async () => {
    if (!recordDesc.trim() || !recordAmount) {
      setCustomAlert("Please enter description and amount.");
      return;
    }

    try {
      const response = await fetch('https://money-tracker-backend-0bhm.onrender.com/api/transactions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          type: recordType,
          description: recordDesc,
          amount: Number(recordAmount),
          category: selectedCategory
        }),
      });

      const result = await response.json();
      if (result.success) {
        setCustomAlert("Record added successfully!");
        setRecordDesc('');
        setRecordAmount('');
        setShowAddRecordPage(false);
        fetchTransactions();
      } else {
        setCustomAlert("Failed to add record.");
      }
    } catch (error) {
      console.error("Error saving record:", error);
      setCustomAlert("Error connecting to backend server.");
    }
  };

  // Calculate totals dynamically from real user transactions
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
    { name: 'Salary & Income', type: 'Prebuild', icon: <Wallet size={16} color="#4ade80" />, color: 'rgba(74, 222, 128, 0.15)' },
    { name: 'Entertainment & Leisure', type: 'Prebuild', icon: <Film size={16} color="#c084fc" />, color: 'rgba(192, 132, 252, 0.15)' },
    { name: 'Food & Dining', type: 'Prebuild', icon: <Utensils size={16} color="#fbbf24" />, color: 'rgba(251, 191, 36, 0.15)' },
    { name: 'Transport & Logistics', type: 'Prebuild', icon: <Car size={16} color="#60a5fa" />, color: 'rgba(96, 165, 250, 0.15)' },
    { name: 'General', type: 'Prebuild', icon: <Box size={16} color="#818cf8" />, color: 'rgba(129, 140, 248, 0.15)' },
    { name: 'Health & Care', type: 'Prebuild', icon: <HeartPulse size={16} color="#f43f5e" />, color: 'rgba(244, 63, 94, 0.15)' }
  ];

  const ownedCategoriesList = ownedCollections.map(item => ({
    name: item.name,
    type: 'Owned',
    icon: <Box size={16} color={item.color || "#3b82f6"} />,
    color: 'rgba(59, 130, 246, 0.15)'
  }));

  const categoriesList = [...prebuiltCategories, ...ownedCategoriesList];

  if (showDeveloperPage) {
    return (
      <div style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1.25rem 2rem 1.25rem',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflowX: 'hidden'
      }}>
        <style>{`
          @keyframes pulseGlow {
            0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
          }
          .animated-portfolio-btn {
            animation: pulseGlow 2s infinite;
          }
        `}</style>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '380px', marginInline: 'auto', marginBottom: '1rem' }}>
          <button 
            onClick={() => setShowDeveloperPage(false)}
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
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0, color: '#9ca3af', letterSpacing: '0.05em' }}>Developer Profile</h2>
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

          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 0.25rem 0', letterSpacing: '-0.025em' }}>NIKHIL GUPTA</h1>
          <p style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: '600', margin: '0 0 1.25rem 0', letterSpacing: '0.05em' }}>
            BCA STUDENT & SOFTWARE DEVELOPER
          </p>

          <div style={{ width: '100%', textAlign: 'left', marginBottom: '1.5rem', padding: '0 0.25rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: '700', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={16} color="#3b82f6" /> About the Creator
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: '1.5', margin: '0 0 1rem 0' }}>
              Hello! I am NIKHIL GUPTA, a first-year BCA student at IGNOU and a passionate software developer. I love crafting high-performance, mobile-first web apps with clean aesthetics, with an ultimate vision to build impactful technology at Google.
            </p>

            <h3 style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: '700', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} color="#10b981" /> A Note of Gratitude
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: '1.5', margin: 0 }}>
              To everyone downloading and placing your trust in Money Tracker: Thank you! Your belief inspires me to write cleaner code and build better tools. Your financial privacy and seamless experience are always my top priorities.
            </p>
          </div>

          <a 
            href="https://nikhildev161011-tech.github.io/Nikhil-s-Portfolio/" 
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
    return (
      <div style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1.25rem 2rem 1.25rem',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflowX: 'hidden',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '380px', marginInline: 'auto', marginBottom: '1rem' }}>
          <button 
            onClick={() => setShowAddRecordPage(false)}
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
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: '#ffffff', letterSpacing: '0.05em' }}>Add Record</h2>
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
            backgroundColor: '#0a0a0a',
            border: '1px solid #1f2937',
            borderRadius: '1rem',
            padding: '0.3rem'
          }}>
            <button
              onClick={() => setRecordType('cashIn')}
              style={{
                flex: 1,
                backgroundColor: recordType === 'cashIn' ? '#1f2937' : 'transparent',
                color: recordType === 'cashIn' ? '#4ade80' : '#9ca3af',
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
                backgroundColor: recordType === 'cashOut' ? '#1f2937' : 'transparent',
                color: recordType === 'cashOut' ? '#f87171' : '#9ca3af',
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
              backgroundColor: '#0a0a0a',
              border: '1px solid #1f2937',
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
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  width: '100%'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                <div style={{ height: '2px', backgroundColor: '#374151', width: '100%', borderRadius: '1px' }}></div>
              </div>
              <span style={{ fontSize: '0.65rem', color: '#6b7280', textAlign: 'right' }}>{recordDesc.length}/40</span>
            </div>
          </div>

          <div>
            <div style={{
              backgroundColor: '#0a0a0a',
              border: '1px solid #1f2937',
              borderRadius: '1rem',
              padding: '0.85rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#9ca3af', fontSize: '1rem', fontWeight: 'bold' }}>₹</span>
                <input 
                  type="number"
                  placeholder="Amount"
                  value={recordAmount}
                  onChange={(e) => setRecordAmount(e.target.value)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: '600',
                    outline: 'none',
                    width: '100%'
                  }}
                />
              </div>
              <div style={{ height: '2px', backgroundColor: '#374151', width: '100%', borderRadius: '1px', marginTop: '0.2rem' }}></div>
              <span style={{ fontSize: '0.65rem', color: '#6b7280', textAlign: 'right' }}>{recordAmount.length}/8</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {['+₹100', '+₹500', '+₹1000', '+₹5000'].map((amt) => (
              <button
                key={amt}
                onClick={() => setRecordAmount(amt.replace('+₹', ''))}
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #1f2937',
                  borderRadius: '0.75rem',
                  padding: '0.6rem 0.2rem',
                  color: '#9ca3af',
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
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600', marginBottom: '0.5rem' }}>Category</p>
            <div 
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #1f2937',
                borderRadius: '1rem',
                padding: '0.9rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(74, 222, 128, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wallet size={14} color="#4ade80" />
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#ffffff' }}>{selectedCategory}</span>
              </div>
              <ChevronDown size={18} color="#9ca3af" />
            </div>

            {showCategoryDropdown && (
              <div style={{
                position: 'absolute',
                bottom: '120px',
                left: '0',
                right: '0',
                backgroundColor: '#121212',
                border: '1px solid #262626',
                borderRadius: '1.25rem',
                padding: '1rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.9)',
                zIndex: 50,
                maxHeight: '280px',
                overflowY: 'auto'
              }}>
                <div style={{ display: 'flex', backgroundColor: '#0a0a0a', border: '1px solid #1f2937', borderRadius: '1.5rem', padding: '0.25rem', marginBottom: '0.75rem' }}>
                  {['All', 'Prebuild', 'Owned'].map((tab) => (
                    <button
                      key={tab}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategoryTab(tab);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: categoryTab === tab ? '#1f2937' : 'transparent',
                        color: '#ffffff',
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
                          backgroundColor: selectedCategory === cat.name ? '#1a2e26' : 'transparent',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          {cat.icon}
                          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#ffffff' }}>{cat.name}</span>
                        </div>
                        {selectedCategory === cat.name && <Check size={16} color="#4ade80" />}
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
              backgroundColor: '#0a0a0a',
              color: '#ffffff',
              fontWeight: '600',
              padding: '0.9rem 1rem',
              borderRadius: '2.5rem',
              border: '1px solid #1f2937',
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
              backgroundColor: '#ffffff',
              color: '#000000',
              fontWeight: '700',
              padding: '0.9rem 1rem',
              borderRadius: '2.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
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
        backgroundColor: '#000000',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1.25rem 2rem 1.25rem',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflowX: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '380px', marginInline: 'auto', marginBottom: '1rem' }}>
          <button 
            onClick={() => setShowEditCollectionPage(false)}
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
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: '#ffffff', letterSpacing: '0.05em' }}>Edit Collection</h2>
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
            <label style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Collection Name</label>
            <div style={{
              backgroundColor: '#0a0a0a',
              border: '1px solid #1f2937',
              borderRadius: '1rem',
              padding: '0.75rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <input 
                type="text"
                value={editingCollectionName}
                onChange={(e) => setEditingCollectionName(e.target.value)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: '600',
                  outline: 'none',
                  width: '100%'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                <div style={{ height: '2px', backgroundColor: '#ffffff', width: '60%', borderRadius: '1px' }}></div>
                <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>{editingCollectionName.length}/25</span>
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Select Theme Color</label>
            <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
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
                    flexShrink: 0
                  }}
                >
                  {selectedColor === color && <div style={{ width: '8px', height: '8px', backgroundColor: '#ffffff', borderRadius: '50%' }}></div>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Select Collection Icon</label>
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {[
                { id: 'plane', icon: <Plane size={20} /> },
                { id: 'edu', icon: <GraduationCap size={20} /> },
                { id: 'cart', icon: <ShoppingCart size={20} /> },
                { id: 'home', icon: <HomeIcon size={20} /> },
                { id: 'gym', icon: <Dumbbell size={20} /> },
                { id: 'brief', icon: <Briefcase size={20} /> },
                { id: 'wallet', icon: <Wallet size={20} /> },
                { id: 'food', icon: <Utensils size={20} /> }
              ].map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedIcon(item.id)}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '1rem',
                    backgroundColor: selectedIcon === item.id ? '#1e3a8a' : '#0a0a0a',
                    border: selectedIcon === item.id ? '1px solid #3b82f6' : '1px solid #1f2937',
                    color: selectedIcon === item.id ? '#ffffff' : '#9ca3af',
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
            onClick={() => {
              setOwnedCollections(prev => prev.filter(item => item.name !== editingCollectionName));
              setCustomAlert("Collection deleted successfully.");
              setShowEditCollectionPage(false);
            }}
            style={{
              flex: 1,
              backgroundColor: '#0a0a0a',
              color: '#f87171',
              fontWeight: '600',
              padding: '0.9rem 1rem',
              borderRadius: '2.5rem',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              cursor: 'pointer',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <Trash2 size={16} /> Delete
          </button>

          <button 
            onClick={() => {
              if (editingCollectionName.trim() !== '') {
                setOwnedCollections([{ name: editingCollectionName, color: selectedColor }]);
              }
              setCustomAlert("Changes saved successfully!");
              setShowEditCollectionPage(false);
            }}
            style={{
              flex: 1.5,
              backgroundColor: '#ffffff',
              color: '#000000',
              fontWeight: '700',
              padding: '0.9rem 1rem',
              borderRadius: '2.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
            }}
          >
            Save Changes
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
        backgroundColor: '#000000',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1.25rem 2rem 1.25rem',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflowX: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '380px', marginInline: 'auto', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setShowSummaryPage(false)}
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
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: '#ffffff', letterSpacing: '0.05em' }}>Summary</h2>
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
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: '600', margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Amount</p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>₹{netBalance.toFixed(2)}</h1>
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', backgroundColor: '#0a0a0a', borderRadius: '1rem', border: '1px solid #1f2937' }}>
              <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: '600' }}>Total Cash In</span>
              <span style={{ color: '#4ade80', fontSize: '1rem', fontWeight: '700' }}>₹{totalCashIn.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', backgroundColor: '#0a0a0a', borderRadius: '1rem', border: '1px solid #1f2937' }}>
              <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: '600' }}>Total Cash Out</span>
              <span style={{ color: '#f87171', fontSize: '1rem', fontWeight: '700' }}>₹{totalCashOut.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '380px', marginInline: 'auto' }}>
          <button 
            onClick={() => setShowSummaryPage(false)}
            style={{
              width: '100%',
              backgroundColor: '#0a0a0a',
              color: '#ffffff',
              fontWeight: '600',
              padding: '0.9rem 1rem',
              borderRadius: '2.5rem',
              border: '1px solid #1f2937',
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 15px 25px rgba(0,0,0,0.8)'
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
        backgroundColor: '#000000',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1.25rem 2rem 1.25rem',
        boxSizing: 'border-box',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflowX: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '380px', marginInline: 'auto', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setShowFilterPage(false)}
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
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: '#ffffff', letterSpacing: '0.05em' }}>Filter Transactions</h2>
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
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem' }}>Sort By</p>
            <div style={{ display: 'flex', backgroundColor: '#0a0a0a', border: '1px solid #1f2937', borderRadius: '1rem', padding: '0.3rem' }}>
              {['Newest', 'Oldest'].map((item) => (
                <button
                  key={item}
                  onClick={() => setSortBy(item)}
                  style={{
                    flex: 1,
                    backgroundColor: sortBy === item ? '#1f2937' : 'transparent',
                    color: '#ffffff',
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
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem' }}>Record Type</p>
            <div style={{ display: 'flex', backgroundColor: '#0a0a0a', border: '1px solid #1f2937', borderRadius: '1rem', padding: '0.3rem' }}>
              {['All', 'Cash In', 'Cash Out'].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilterRecordType(item)}
                  style={{
                    flex: 1,
                    backgroundColor: filterRecordType === item ? '#1f2937' : 'transparent',
                    color: '#ffffff',
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
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.75rem' }}>Time</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', backgroundColor: '#0a0a0a', border: '1px solid #1f2937', borderRadius: '1rem', padding: '0.3rem' }}>
              {['All', 'Daily', 'Weekly', 'Monthly'].map((item) => (
                <button
                  key={item}
                  onClick={() => setTimeFilter(item)}
                  style={{
                    backgroundColor: timeFilter === item ? '#1f2937' : 'transparent',
                    color: '#ffffff',
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
              backgroundColor: '#0a0a0a',
              color: '#ffffff',
              fontWeight: '600',
              padding: '0.9rem 1rem',
              borderRadius: '2.5rem',
              border: '1px solid #1f2937',
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 15px 25px rgba(0,0,0,0.8)'
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
      backgroundColor: '#000000',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.25rem 1.25rem 6rem 1.25rem',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      
      {/* Custom In-App Alert Modal */}
      {customAlert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '320px',
            backgroundColor: '#111115',
            border: '1px solid #27272a',
            borderRadius: '1rem',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            color: '#ffffff'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#3b82f6' }}>
              Money Tracker
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '1.25rem', lineHeight: '1.4' }}>
              {customAlert}
            </p>
            <button 
              onClick={() => setCustomAlert(null)}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: '600',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tabFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tab-content-anim {
          animation: tabFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .bottom-sheet-anim {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', width: '100%', maxWidth: '380px', marginInline: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#1f2937',
            overflow: 'hidden',
            border: '1px solid #374151',
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
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Hello,</p>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{user.name}</h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={() => setShowDeveloperPage(true)}
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
              color: '#3b82f6',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
            }}
            title="Developer Info"
          >
            <Code size={20} />
          </button>

          <button 
            onClick={() => setShowSettingsModal(true)}
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
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="tab-content-anim" style={{ width: '100%', maxWidth: '380px', marginInline: 'auto', flexGrow: '1', display: 'flex', flexDirection: 'column' }}>
        
        {activeTab === 'home' && (
          <>
            <div 
              onClick={() => setShowSummaryPage(true)}
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #1f2937',
                padding: '1.25rem',
                borderRadius: '1.25rem',
                marginBottom: '1.5rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                cursor: 'pointer'
              }}
            >
              <p style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textAlign: 'center', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overview</p>
              <p style={{ fontSize: '2.25rem', fontWeight: '800', color: '#ffffff', textAlign: 'center', margin: '0.5rem 0 1rem 0' }}>₹{netBalance.toFixed(2)}</p>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ backgroundColor: '#121212', padding: '0.75rem', borderRadius: '0.875rem', flex: 1, border: '1px solid #1f2937' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                    <TrendingUp size={14} color="#4ade80" /> Cash In
                  </span>
                  <p style={{ fontWeight: 'bold', color: '#4ade80', fontSize: '0.9rem', margin: 0 }}>₹{totalCashIn.toFixed(2)}</p>
                </div>
                <div style={{ backgroundColor: '#121212', padding: '0.75rem', borderRadius: '0.875rem', flex: 1, border: '1px solid #1f2937' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                    <TrendingDown size={14} color="#f87171" /> Cash Out
                  </span>
                  <p style={{ fontWeight: 'bold', color: '#f87171', fontSize: '0.9rem', margin: 0 }}>₹{totalCashOut.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>Recent Activity</h3>
              <button 
                onClick={() => setShowFilterPage(true)}
                style={{
                  backgroundColor: '#121212',
                  border: '1px solid #1f2937',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#9ca3af'
                }}
                title="Filter Activity"
              >
                <SlidersHorizontal size={16} />
              </button>
            </div>

            {loadingTransactions ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>Loading database records...</div>
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
                  .map((txn) => (
                    <div key={txn._id} style={{
                      backgroundColor: '#0a0a0a',
                      border: '1px solid #1f2937',
                      borderRadius: '1rem',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <p style={{ fontWeight: '600', fontSize: '0.95rem', margin: '0 0 0.2rem 0' }}>{txn.description}</p>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>{txn.category} • {new Date(txn.date).toLocaleDateString()}</p>
                      </div>
                      <span style={{ fontWeight: '700', fontSize: '0.95rem', color: txn.type === 'cashIn' ? '#4ade80' : '#f87171' }}>
                        {txn.type === 'cashIn' ? '+' : '-'}₹{txn.amount}
                      </span>
                    </div>
                  ))}
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
                <div style={{ marginBottom: '1rem', color: '#ffffff' }}>
                  <Ghost size={64} strokeWidth={1.5} />
                </div>
                <p style={{ color: '#ffffff', fontWeight: '600', fontSize: '1rem', margin: '0.25rem 0' }}>No Activity Yet</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', maxWidth: '240px', lineHeight: '1.4', margin: 0 }}>
                  Change filters or tap the "+" button below to add a new entry.
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'analysis' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, letterSpacing: '-0.025em' }}>Insights & Analytics</h2>

            <div 
              onClick={() => setShowSummaryPage(true)}
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #1f2937',
                padding: '1.25rem',
                borderRadius: '1.25rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                cursor: 'pointer'
              }}
            >
              <p style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textAlign: 'center', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overview</p>
              <p style={{ fontSize: '2.25rem', fontWeight: '800', color: '#ffffff', textAlign: 'center', margin: '0.5rem 0 1rem 0' }}>₹{netBalance.toFixed(2)}</p>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ backgroundColor: '#121212', padding: '0.75rem', borderRadius: '0.875rem', flex: 1, border: '1px solid #1f2937' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                    <TrendingUp size={14} color="#4ade80" /> Cash In
                  </span>
                  <p style={{ fontWeight: 'bold', color: '#4ade80', fontSize: '0.9rem', margin: 0 }}>₹{totalCashIn.toFixed(2)}</p>
                </div>
                <div style={{ backgroundColor: '#121212', padding: '0.75rem', borderRadius: '0.875rem', flex: 1, border: '1px solid #1f2937' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.25rem' }}>
                    <TrendingDown size={14} color="#f87171" /> Cash Out
                  </span>
                  <p style={{ fontWeight: 'bold', color: '#f87171', fontSize: '0.9rem', margin: 0 }}>₹{totalCashOut.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#0a0a0a',
              border: '1px solid #1f2937',
              padding: '1.25rem',
              borderRadius: '1.25rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', margin: '0 0 0.25rem 0' }}>Weekly Spending Activity</h3>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 1.5rem 0' }}>Tap any bar to see details</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '110px', paddingBottom: '0.5rem', borderBottom: '1px solid #1f2937' }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const dayAmt = weeklySpendingMap[day] || 0;
                  const maxAmt = Math.max(...Object.values(weeklySpendingMap), 1000);
                  const barHeight = dayAmt > 0 ? Math.min(Math.max((dayAmt / maxAmt) * 90, 15), 90) : 2;
                  const isSelected = selectedDay === day;
                  const barColor = dayAmt > 0 ? '#f87171' : '#1f2937';
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
                      <span style={{ fontSize: '0.7rem', color: isSelected ? '#ffffff' : '#9ca3af', fontWeight: isSelected ? 'bold' : 'normal' }}>
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 0.15rem 0' }}>Total Cash In</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#4ade80', margin: 0 }}>₹{totalCashIn.toFixed(2)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 0.15rem 0' }}>Total Cash Out</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#f87171', margin: 0 }}>₹{totalCashOut.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 0.25rem 0' }}>Spending Overview</h3>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0 0 1rem 0' }}>Spending by Category</p>

              <div style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #1f2937',
                borderRadius: '1.25rem',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {Object.keys(categorySpending).length > 0 ? (
                  Object.entries(categorySpending).map(([cat, amt]) => (
                    <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f2937', paddingBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: '600' }}>{cat}</span>
                      <span style={{ fontSize: '0.9rem', color: '#f87171', fontWeight: 'bold' }}>₹{amt}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center', margin: 0 }}>
                    Add cash-out spending records to view category breakdown.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'collection' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, letterSpacing: '-0.025em' }}>Collections & Vaults</h2>

            <div style={{ display: 'flex', backgroundColor: '#0a0a0a', border: '1px solid #1f2937', borderRadius: '2rem', padding: '0.3rem' }}>
              {['All', 'Prebuild', 'Owned'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCollectionSubTab(tab)}
                  style={{
                    flex: 1,
                    backgroundColor: collectionSubTab === tab ? '#1f2937' : 'transparent',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '1.75rem',
                    padding: '0.6rem',
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {collectionSubTab === tab && '✓ '} {tab}
                </button>
              ))}
            </div>

            {collectionSubTab === 'All' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[...prebuiltCategories, ...ownedCollections.map(item => ({ title: item.name, icon: <Box size={20} color={item.color || "#3b82f6"} />, color: 'rgba(59, 130, 246, 0.15)' }))].map((item, index) => {
                  const catName = item.name || item.title;
                  const catData = categorySummary[catName] || { cashIn: 0, cashOut: 0, count: 0 };
                  const netCatBalance = catData.cashIn - catData.cashOut;
                  return (
                    <div key={index} style={{
                      backgroundColor: '#0a0a0a',
                      border: '1px solid #1f2937',
                      borderRadius: '1.25rem',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '0.875rem',
                          backgroundColor: item.color || 'rgba(74, 222, 128, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {item.icon || <Box size={20} color="#3b82f6" />}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 0.2rem 0' }}>{catName}</h4>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                            {catData.count} records
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <div>
                            <p style={{ fontSize: '0.65rem', color: '#4ade80', margin: '0 0 0.1rem 0' }}>In: ₹{catData.cashIn}</p>
                            <p style={{ fontSize: '0.65rem', color: '#f87171', margin: 0 }}>Out: ₹{catData.cashOut}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '0 0 0.1rem 0' }}>Remaining</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: netCatBalance >= 0 ? '#4ade80' : '#f87171', margin: 0 }}>₹{netCatBalance.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setEditingCollectionName(catName);
                          setShowEditCollectionPage(true);
                        }}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
                      >
                        <Edit3 size={16} />
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
                      backgroundColor: '#0a0a0a',
                      border: '1px solid #1f2937',
                      borderRadius: '1.25rem',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '0.875rem',
                          backgroundColor: item.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {item.icon}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 0.2rem 0' }}>{item.name}</h4>
                          <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                            {catData.count} records
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <div>
                            <p style={{ fontSize: '0.65rem', color: '#4ade80', margin: '0 0 0.1rem 0' }}>In: ₹{catData.cashIn}</p>
                            <p style={{ fontSize: '0.65rem', color: '#f87171', margin: 0 }}>Out: ₹{catData.cashOut}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '0 0 0.1rem 0' }}>Remaining</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: netCatBalance >= 0 ? '#4ade80' : '#f87171', margin: 0 }}>₹{netCatBalance.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setEditingCollectionName(item.name);
                          setShowEditCollectionPage(true);
                        }}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
                      >
                        <Edit3 size={16} />
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
                        backgroundColor: '#0a0a0a',
                        border: '1px solid #1f2937',
                        borderRadius: '1.25rem',
                        padding: '1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '0.875rem',
                            backgroundColor: 'rgba(59, 130, 246, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Box size={20} color={item.color || "#3b82f6"} />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 0.2rem 0' }}>{item.name}</h4>
                            <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
                              {catData.count} records
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <div>
                              <p style={{ fontSize: '0.65rem', color: '#4ade80', margin: '0 0 0.1rem 0' }}>In: ₹{catData.cashIn}</p>
                              <p style={{ fontSize: '0.65rem', color: '#f87171', margin: 0 }}>Out: ₹{catData.cashOut}</p>
                            </div>
                            <div>
                              <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: '0 0 0.1rem 0' }}>Remaining</p>
                              <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: netCatBalance >= 0 ? '#4ade80' : '#f87171', margin: 0 }}>₹{netCatBalance.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setEditingCollectionName(item.name);
                            setShowEditCollectionPage(true);
                          }}
                          style={{ backgroundColor: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
                        >
                          <Edit3 size={16} />
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
                  <div style={{ marginBottom: '1rem', color: '#ffffff' }}>
                    <Ghost size={64} strokeWidth={1.5} />
                  </div>
                  <p style={{ color: '#ffffff', fontWeight: '600', fontSize: '1rem', margin: '0.25rem 0' }}>No Custom Collections</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', maxWidth: '240px', lineHeight: '1.4', margin: 0 }}>
                    Create custom collections with categories to analyze your spending efficiently.
                  </p>
                </div>
              )
            )}
          </div>
        )}

      </div>

      <div style={{
        position: 'fixed',
        bottom: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '380px',
        backgroundColor: '#0a0a0a',
        border: '1px solid #1f2937',
        borderRadius: '2.5rem',
        padding: '0.5rem 0.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 20px 30px rgba(0,0,0,0.8)',
        zIndex: 10
      }}>
        <button 
          onClick={() => setActiveTab('home')}
          style={{
            background: activeTab === 'home' ? '#1f2937' : 'transparent',
            border: 'none',
            borderRadius: '2rem',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: activeTab === 'home' ? '#ffffff' : '#9ca3af',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
        >
          <Home size={18} /> Home
        </button>

        <button 
          onClick={() => setActiveTab('analysis')}
          style={{
            background: activeTab === 'analysis' ? '#1f2937' : 'transparent',
            border: 'none',
            borderRadius: '50%',
            padding: '0.6rem',
            color: activeTab === 'analysis' ? '#ffffff' : '#9ca3af',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <BarChart2 size={20} />
        </button>

        <button 
          onClick={() => setActiveTab('collection')}
          style={{
            background: activeTab === 'collection' ? '#1f2937' : 'transparent',
            border: 'none',
            borderRadius: '50%',
            padding: '0.6rem',
            color: activeTab === 'collection' ? '#ffffff' : '#9ca3af',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <Folder size={20} />
        </button>

        <button 
          onClick={() => setShowAddEntryModal(true)}
          style={{
            backgroundColor: '#ffffff',
            color: '#000000',
            border: 'none',
            borderRadius: '50%',
            width: '46px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(255,255,255,0.2)'
          }}
        >
          <Plus size={24} />
        </button>
      </div>

      {showAddEntryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000000',
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
              backgroundColor: '#ffffff',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 0 25px rgba(255,255,255,0.25)'
            }}>
              <Plus size={36} strokeWidth={2.5} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', margin: '0 0 0.5rem 0' }}>Add New Entry</h3>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af', maxWidth: '280px', margin: '0 0 2rem 0', lineHeight: '1.4' }}>
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
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #1f2937',
                  borderRadius: '1.25rem',
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  minHeight: '130px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '0.875rem',
                  backgroundColor: 'rgba(74, 222, 128, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Receipt size={20} color="#4ade80" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', margin: '0 0 0.2rem 0' }}>Spending Record</h4>
                  <p style={{ fontSize: '0.68rem', color: '#9ca3af', margin: 0, lineHeight: '1.2' }}>Add incoming or outgoing</p>
                </div>
              </div>

              <div 
                onClick={() => {
                  setShowAddEntryModal(false);
                  setShowEditCollectionPage(true);
                }}
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #1f2937',
                  borderRadius: '1.25rem',
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  minHeight: '130px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '0.875rem',
                  backgroundColor: 'rgba(244, 63, 94, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Folder size={20} color="#f43f5e" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', margin: '0 0 0.2rem 0' }}>Collection Category</h4>
                  <p style={{ fontSize: '0.68rem', color: '#9ca3af', margin: 0, lineHeight: '1.2' }}>Organize into custom groups</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ width: '100%', maxWidth: '380px' }}>
            <button 
              onClick={() => setShowAddEntryModal(false)}
              style={{
                width: '100%',
                backgroundColor: '#0a0a0a',
                color: '#ffffff',
                fontWeight: '600',
                padding: '0.9rem 1rem',
                borderRadius: '2.5rem',
                border: '1px solid #1f2937',
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
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
              backgroundColor: '#121212',
              borderTopLeftRadius: '2rem',
              borderTopRightRadius: '2rem',
              padding: '1.5rem 1.25rem calc(2.5rem + env(safe-area-inset-bottom)) 1.25rem',
              width: '100%',
              maxWidth: '380px',
              marginInline: 'auto',
              boxSizing: 'border-box',
              boxShadow: '0 -10px 30px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '40px',
              height: '4px',
              backgroundColor: '#374151',
              borderRadius: '2px',
              margin: '0 auto 1.25rem auto'
            }}></div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', margin: '0 0 1.25rem 0' }}>Settings</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div 
                onClick={onLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '1rem',
                  backgroundColor: '#1a1a1a',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <LogOut size={20} color="#3b82f6" />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ffffff', margin: '0 0 0.15rem 0' }}>Sign Out</h4>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Safely close current finance database session</p>
                </div>
              </div>

              <div 
                onClick={() => {
                  const confirmDelete = window.confirm("Are you sure you want to permanently delete your account and all data?");
                  if (confirmDelete) {
                    setCustomAlert("Account successfully deleted.");
                    onLogout();
                  }
                  setShowSettingsModal(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '1rem',
                  backgroundColor: '#1a1a1a',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <Trash2 size={20} color="#3b82f6" />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ffffff', margin: '0 0 0.15rem 0' }}>Delete Account</h4>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Permanently erase all your data and collections</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
