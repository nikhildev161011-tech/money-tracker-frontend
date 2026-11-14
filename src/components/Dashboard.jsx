import React, { useState, useEffect } from 'react';
import AIAssistant from './AIAssistant';
import { 
  Home, BarChart2, Folder, Plus, Settings as SettingsIcon, TrendingUp, TrendingDown, 
  Ghost, Code, SlidersHorizontal, ArrowLeft, Globe, ShieldCheck, 
  Laptop, LogOut, Trash2, Check, Wallet, Edit3, Plane, 
  GraduationCap, ShoppingCart, Home as HomeIcon, Dumbbell, Briefcase, 
  X, Receipt, ChevronDown, Sun, Moon, Landmark, Gamepad2, 
  UtensilsCrossed, CarFront, Sparkles, HeartPulse, Box, Bell, Bot, User, Send, Download, CreditCard
} from 'lucide-react';

function AnimatedCounter({ value, duration = 1100, prefix = "₹", decimals = 2 }) {
  const [displayValue, setDisplayValue] = useState(() => {
    const hasAnimated = sessionStorage.getItem('has_animated_counter');
    return hasAnimated === 'true' ? Number(value) || 0 : 0;
  });

  useEffect(() => {
    const endVal = Number(value) || 0;
    const hasAnimated = sessionStorage.getItem('has_animated_counter');

    if (hasAnimated === 'true') {
      setDisplayValue(endVal);
      return;
    }

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
        sessionStorage.setItem('has_animated_counter', 'true');
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
    <span className="font-sans tabular-nums tracking-tight">
      {isNeg ? `-${prefix}${absFormatted}` : `${prefix}${absFormatted}`}
    </span>
  );
}

export default function Dashboard({ user, onLogout }) {
  const isDark = true; // Fixed premium dark/black theme

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
  const [showAiChat, setShowAiChat] = useState(false);
  const [successAnimType, setSuccessAnimType] = useState(null); // 'cashIn' or 'cashOut'
  
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

  // 3D Tilt state for card
  const [tiltStyle, setTiltStyle] = useState({});

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = (x - xc) / 10;
    const dy = (yc - y) / 10;
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${dy}deg) rotateY(${dx}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'none'
    });
  };

  const handleCardMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease'
    });
  };

  const tabList = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'analysis', label: 'Analysis', icon: BarChart2 },
    { id: 'collection', label: 'Vaults', icon: Folder },
    { id: 'settings', label: 'Profile', icon: User }
  ];

  const handleTabSwitch = (newTabId) => {
    if (newTabId === 'settings') {
      setShowSettingsModal(true);
      return;
    }
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
    const currentType = recordType;

    try {
      const response = await fetch('https://money-tracker-backend-0bhm.onrender.com/api/transactions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUserId,
          type: currentType,
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
        
        // Show success animation screen like video reference
        setSuccessAnimType(currentType);
        setTimeout(() => {
          setSuccessAnimType(null);
        }, 2200);

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
    { name: 'Salary & Income', type: 'Prebuild', icon: <Landmark size={18} className="text-emerald-400" /> },
    { name: 'Entertainment & Leisure', type: 'Prebuild', icon: <Gamepad2 size={18} className="text-purple-400" /> },
    { name: 'Food & Dining', type: 'Prebuild', icon: <UtensilsCrossed size={18} className="text-amber-400" /> },
    { name: 'Transport & Logistics', type: 'Prebuild', icon: <CarFront size={18} className="text-blue-400" /> },
    { name: 'General', type: 'Prebuild', icon: <Sparkles size={18} className="text-indigo-400" /> },
    { name: 'Health & Care', type: 'Prebuild', icon: <HeartPulse size={18} className="text-rose-400" /> }
  ];

  const ownedCategoriesList = ownedCollections.map(item => ({
    name: item.name,
    type: 'Owned',
    icon: <Box size={18} style={{ color: item.color || "#3b82f6" }} />
  }));

  const categoriesList = [...prebuiltCategories, ...ownedCategoriesList];
  const activeTabIndex = Math.max(0, tabList.findIndex(t => t.id === activeTab));
  const collectionTabs = ['All', 'Prebuild', 'Owned'];
  const activeCollectionIndex = Math.max(0, collectionTabs.indexOf(collectionSubTab));

  // Dynamic Greeting based on current time
  const currentHour = new Date().getHours();
  const greetingText = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Night';
  const loggedUserName = user?.name || 'Nikhil Gupta';
  if (successAnimType) {
    return (
      <div className="w-screen min-h-screen bg-emerald-600 text-white flex flex-col items-center justify-center p-5 select-none animate-fadeIn">
        <div className="w-24 h-24 rounded-full bg-white text-emerald-600 flex items-center justify-center mb-6 shadow-2xl animate-bounce">
          <Check size={56} strokeWidth={3} />
        </div>
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
          {successAnimType === 'cashIn' ? 'Cash In Successful' : 'Cash Out Successful'}
        </h1>
        <p className="text-sm text-emerald-100 font-medium">Your record has been added to vault</p>
      </div>
    );
  }

  if (showAddRecordPage) {
    const activeSelectedCat = categoriesList.find(c => c.name === selectedCategory) || prebuiltCategories[0];

    return (
      <div className="w-screen min-h-screen bg-black text-white flex flex-col justify-between p-5 box-border select-none relative">
        <div className="flex items-center justify-between w-full max-w-[380px] mx-auto mb-4">
          <button 
            onClick={() => setShowAddRecordPage(false)}
            className="bg-neutral-900 border border-neutral-800 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-base font-bold m-0 tracking-wider">Add Record</h2>
          <div className="w-10"></div>
        </div>

        <div className="w-full max-w-[380px] mx-auto flex flex-col gap-5 flex-grow justify-center relative">
          <div className="flex bg-neutral-900 border border-neutral-800 rounded-2xl p-1">
            <button
              onClick={() => setRecordType('cashIn')}
              className={`flex-1 rounded-xl p-3 font-bold text-xs cursor-pointer transition-all ${recordType === 'cashIn' ? 'bg-neutral-800 text-emerald-400' : 'text-neutral-400'}`}
            >
              Cash In (+)
            </button>
            <button
              onClick={() => setRecordType('cashOut')}
              className={`flex-1 rounded-xl p-3 font-bold text-xs cursor-pointer transition-all ${recordType === 'cashOut' ? 'bg-neutral-800 text-rose-500' : 'text-neutral-400'}`}
            >
              Cash Out (-)
            </button>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 flex flex-col gap-1">
            <input 
              type="text"
              placeholder="Description (e.g. Uber Ride)"
              value={recordDesc}
              onChange={(e) => setRecordDesc(e.target.value)}
              maxLength={40}
              className="bg-transparent border-none text-white text-sm outline-none w-full"
            />
            <div className="h-0.5 bg-neutral-800 w-full rounded"></div>
            <span className="text-[10px] text-neutral-500 text-right">{recordDesc.length}/40</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-base font-bold">₹</span>
              <input 
                type="number"
                placeholder="Amount"
                value={recordAmount}
                onChange={(e) => setRecordAmount(e.target.value)}
                className="bg-transparent border-none text-white text-base font-semibold outline-none w-full"
              />
            </div>
            <div className="h-0.5 bg-neutral-800 w-full rounded mt-1"></div>
            <span className="text-[10px] text-neutral-500 text-right">{recordAmount.length}/8</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {['+₹100', '+₹500', '+₹1000', '+₹5000'].map((amt) => (
              <button
                key={amt}
                onClick={() => setRecordAmount(amt.replace('+₹', ''))}
                className="bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-1 text-neutral-400 text-xs font-semibold cursor-pointer"
              >
                {amt}
              </button>
            ))}
          </div>

          <div>
            <p className="text-xs text-neutral-400 font-semibold mb-2">Category</p>
            <div 
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 flex justify-between items-center cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                  {activeSelectedCat.icon}
                </div>
                <span className="text-sm font-semibold text-white">{selectedCategory}</span>
              </div>
              <ChevronDown size={18} className="text-neutral-400" />
            </div>

            {showCategoryDropdown && (
              <div className="absolute bottom-28 left-0 right-0 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow-2xl z-50 max-h-72 overflow-y-auto">
                <div className="flex bg-black border border-neutral-800 rounded-2xl p-1 mb-3">
                  {['All', 'Prebuild', 'Owned'].map((tab) => (
                    <button
                      key={tab}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCategoryTab(tab);
                      }}
                      className={`flex-1 rounded-xl p-1.5 text-xs font-semibold cursor-pointer ${categoryTab === tab ? 'bg-neutral-800 text-white' : 'text-neutral-400'}`}
                    >
                      {categoryTab === tab && '✓ '} {tab}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5">
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
                        className={`flex justify-between items-center p-2.5 rounded-xl cursor-pointer ${selectedCategory === cat.name ? 'bg-emerald-950/40' : 'hover:bg-neutral-800/50'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center">
                            {cat.icon}
                          </div>
                          <span className="text-xs font-semibold text-white">{cat.name}</span>
                        </div>
                        {selectedCategory === cat.name && <Check size={16} className="text-emerald-400" />}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 w-full max-w-[380px] mx-auto pt-4">
          <button 
            onClick={() => setShowAddRecordPage(false)}
            className="flex-1 bg-neutral-900 text-white font-semibold py-3.5 px-4 rounded-full border border-neutral-800 cursor-pointer text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveRecord}
            className="flex-[1.5] bg-white text-black font-bold py-3.5 px-4 rounded-full border-none cursor-pointer text-sm shadow-lg"
          >
            Add
          </button>
        </div>
      </div>
    );
  }

  if (showEditCollectionPage) {
    return (
      <div className="w-screen min-h-screen bg-black text-white flex flex-col justify-between p-5 box-border select-none">
        <div className="flex items-center justify-between w-full max-w-[380px] mx-auto mb-4">
          <button 
            onClick={() => setShowEditCollectionPage(false)}
            className="bg-neutral-900 border border-neutral-800 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-base font-bold m-0 tracking-wider">Create Collection</h2>
          <div className="w-10"></div>
        </div>

        <div className="w-full max-w-[380px] mx-auto flex flex-col gap-6 flex-grow justify-center">
          <div>
            <label className="text-xs text-neutral-400 block mb-2 font-semibold">Collection Name</label>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 flex flex-col gap-1">
              <input 
                type="text"
                placeholder="Enter Collection Name"
                value={editingCollectionName}
                onChange={(e) => setEditingCollectionName(e.target.value)}
                maxLength={25}
                className="bg-transparent border-none text-white text-base font-semibold outline-none w-full"
              />
              <div className="flex justify-between items-center mt-1">
                <div className="h-0.5 bg-blue-500 w-3/5 rounded"></div>
                <span className="text-[10px] text-neutral-500">{editingCollectionName.length}/25</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-3 font-semibold">Select Theme Color</label>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {['#3b82f6', '#0d9488', '#10b981', '#f59e0b', '#ec4899', '#a855f7', '#facc15', '#06b6d4', '#6366f1'].map((color) => (
                <div 
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2 shrink-0 ${selectedColor === color ? 'border-white shadow-lg' : 'border-transparent'}`}
                >
                  {selectedColor === color && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-neutral-400 block mb-3 font-semibold">Select Collection Icon</label>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
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
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer shrink-0 border ${selectedIcon === item.id ? 'bg-blue-950/60 border-blue-500 text-blue-500' : 'bg-neutral-900 border-neutral-800 text-neutral-400'}`}
                >
                  {item.icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 w-full max-w-[380px] mx-auto pt-4">
          <button 
            onClick={() => setShowEditCollectionPage(false)}
            className="flex-1 bg-neutral-900 text-white font-semibold py-3.5 px-4 rounded-full border border-neutral-800 cursor-pointer text-sm"
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
            className="flex-[1.5] bg-white text-black font-bold py-3.5 px-4 rounded-full border-none cursor-pointer text-sm shadow-lg"
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  if (showSummaryPage) {
    return (
      <div className="w-screen min-h-screen bg-black text-white flex flex-col justify-between p-5 box-border select-none">
        <div className="flex items-center justify-between w-full max-w-[380px] mx-auto mb-6">
          <button 
            onClick={() => setShowSummaryPage(false)}
            className="bg-neutral-900 border border-neutral-800 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-base font-bold m-0 tracking-wider">Summary</h2>
          <div className="w-10"></div>
        </div>

        <div className="w-full max-w-[380px] mx-auto flex flex-col items-center flex-grow justify-center gap-8">
          <div className="text-center w-full">
            <p className="text-neutral-400 text-xs font-semibold mb-2 uppercase tracking-wider">Net Amount</p>
            <h1 className="text-4xl font-extrabold m-0">
              <AnimatedCounter value={netBalance} />
            </h1>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center p-4 bg-neutral-900 rounded-2xl border border-neutral-800">
              <span className="text-neutral-400 text-sm font-semibold">Total Cash In</span>
              <span className="text-emerald-400 text-base font-bold">
                +<AnimatedCounter value={totalCashIn} />
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-neutral-900 rounded-2xl border border-neutral-800">
              <span className="text-neutral-400 text-sm font-semibold">Total Cash Out</span>
              <span className="text-rose-500 text-base font-bold">
                -<AnimatedCounter value={totalCashOut} />
              </span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[380px] mx-auto">
          <button 
            onClick={() => setShowSummaryPage(false)}
            className="w-full bg-neutral-900 text-white font-semibold py-3.5 px-4 rounded-full border border-neutral-800 cursor-pointer text-sm shadow-md"
          >
            Got it
          </button>
        </div>
      </div>
    );
  }

  if (showFilterPage) {
    return (
      <div className="w-screen min-h-screen bg-black text-white flex flex-col justify-between p-5 box-border select-none">
        <div className="flex items-center justify-between w-full max-w-[380px] mx-auto mb-6">
          <button 
            onClick={() => setShowFilterPage(false)}
            className="bg-neutral-900 border border-neutral-800 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-base font-bold m-0 tracking-wider">Filter Transactions</h2>
          <div className="w-10"></div>
        </div>

        <div className="w-full max-w-[380px] mx-auto flex flex-col flex-grow gap-6 pt-2">
          <div>
            <p className="text-neutral-400 text-xs font-semibold mb-3">Sort By</p>
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-2xl p-1">
              {['Newest', 'Oldest'].map((item) => (
                <button
                  key={item}
                  onClick={() => setSortBy(item)}
                  className={`flex-1 rounded-xl p-3 font-semibold text-xs cursor-pointer flex items-center justify-center gap-1.5 ${sortBy === item ? 'bg-neutral-800 text-white' : 'text-neutral-400'}`}
                >
                  {sortBy === item && <Check size={14} className="text-blue-500" />} {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-neutral-400 text-xs font-semibold mb-3">Record Type</p>
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-2xl p-1">
              {['All', 'Cash In', 'Cash Out'].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilterRecordType(item)}
                  className={`flex-1 rounded-xl p-3 font-semibold text-xs cursor-pointer flex items-center justify-center gap-1 ${filterRecordType === item ? 'bg-neutral-800 text-white' : 'text-neutral-400'}`}
                >
                  {filterRecordType === item && <Check size={14} className="text-blue-500" />} {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-neutral-400 text-xs font-semibold mb-3">Time</p>
            <div className="grid grid-cols-2 gap-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-1">
              {['All', 'Daily', 'Weekly', 'Monthly'].map((item) => (
                <button
                  key={item}
                  onClick={() => setTimeFilter(item)}
                  className={`rounded-xl p-3 font-semibold text-xs cursor-pointer flex items-center justify-center gap-1 ${timeFilter === item ? 'bg-neutral-800 text-white' : 'text-neutral-400'}`}
                >
                  {timeFilter === item && <Check size={14} className="text-blue-500" />} {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-[380px] mx-auto pt-4">
          <button 
            onClick={() => setShowFilterPage(false)}
            className="w-full bg-neutral-900 text-white font-semibold py-3.5 px-4 rounded-full border border-neutral-800 cursor-pointer text-sm shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="w-screen min-h-screen bg-black text-white flex flex-col justify-between p-5 pb-28 box-border select-none relative">
      
      {toastMessage && (
        <div className="fixed bottom-22 left-1/2 -translate-x-1/2 bg-neutral-900 text-white border border-neutral-800 py-3 px-5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-2xl z-50 whitespace-nowrap animate-bounce">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          {toastMessage}
        </div>
      )}

      {/* Header Bar with Greeting & Notification Icon */}
      <div className="flex justify-between items-center mb-6 w-full max-w-[380px] mx-auto">
        <div>
          <p className="text-xs text-neutral-400 m-0">{greetingText},</p>
          <h1 className="text-[1.1rem] font-bold m-0 text-white">{loggedUserName}</h1>
        </div>

        <div className="flex gap-2.5 items-center">
          <button 
            onClick={() => showToast("Notifications")}
            className="bg-neutral-900 border border-neutral-800 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer text-white shadow-md active:scale-95 transition-transform relative"
            title="Notifications"
          >
            <Bell size={18} />
          </button>
        </div>
      </div>

      <div 
        key={activeTab} 
        className={`w-full max-w-[380px] mx-auto flex-grow flex flex-col ${slideDirection === 'right' ? 'animate-fadeIn' : 'animate-fadeIn'}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        {activeTab === 'home' && (
          <>
            {/* My Wallet Section title */}
            <h2 className="text-sm font-bold text-neutral-400 mb-3 tracking-wide">My Wallet</h2>

            {/* 3D Tilt Debit Card Style Overview */}
            <div 
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              onClick={() => setShowSummaryPage(true)}
              style={tiltStyle}
              className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border border-neutral-800 p-6 rounded-3xl mb-6 shadow-2xl cursor-pointer relative overflow-hidden transition-all duration-200"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs text-neutral-400 font-medium tracking-wider m-0">Finsight Vault</p>
                </div>
                <CreditCard size={22} className="text-white/80" />
              </div>

              <p className="text-xs text-neutral-400 font-semibold m-0 uppercase tracking-wider">Overview</p>
              <p className="text-3xl font-extrabold text-white my-1.5 tracking-tight">
                <AnimatedCounter value={netBalance} />
              </p>
              
              <div className="flex justify-between items-end mt-6 pt-4 border-t border-neutral-800/80">
                <div>
                  <p className="text-[10px] text-emerald-400 uppercase m-0 font-semibold">Cash In</p>
                  <p className="text-xs text-emerald-300 font-bold m-0">+₹{totalCashIn}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-rose-400 uppercase m-0 font-semibold">Cash Out</p>
                  <p className="text-xs text-rose-300 font-bold m-0">-₹{totalCashOut}</p>
                </div>
              </div>
            </div>

            {/* Spending and Collection Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button 
                onClick={() => setShowAddRecordPage(true)}
                className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 p-4 rounded-2xl flex items-center gap-3 cursor-pointer transition-transform active:scale-95 shadow-md text-white"
              >
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white border border-neutral-800">
                  <Send size={18} />
                </div>
                <div className="text-left">
                  <span className="text-xs font-semibold block text-white">Spending</span>
                  <span className="text-[10px] text-neutral-400 block">Record expense</span>
                </div>
              </button>

              <button 
                onClick={() => setShowEditCollectionPage(true)}
                className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 p-4 rounded-2xl flex items-center gap-3 cursor-pointer transition-transform active:scale-95 shadow-md text-white"
              >
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white border border-neutral-800">
                  <Folder size={18} />
                </div>
                <div className="text-left">
                  <span className="text-xs font-semibold block text-white">Collection</span>
                  <span className="text-[10px] text-neutral-400 block">Group vault</span>
                </div>
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold m-0 text-white">Transaction History</h3>
              <button 
                onClick={() => setShowFilterPage(true)}
                className="bg-transparent border-none text-xs text-neutral-400 hover:text-white cursor-pointer font-semibold"
              >
                View All
              </button>
            </div>

            {loadingTransactions ? (
              <div className="text-center py-8 text-neutral-500 text-sm">Loading database records...</div>
            ) : transactions.length > 0 ? (
              <div className="flex flex-col gap-3">
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
                      <div key={txn._id} className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-3.5 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-black border border-neutral-800 flex items-center justify-center text-neutral-300">
                            {matchedCategory.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-sm m-0 mb-0.5 text-white">{txn.description}</p>
                            <p className="text-[11px] text-neutral-400 m-0">{txn.category} • {new Date(txn.date).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`font-bold text-sm ${txn.type === 'cashIn' ? 'text-emerald-400' : 'text-white'}`}>
                            {txn.type === 'cashIn' ? '+' : '-'}₹{txn.amount}
                          </span>
                          <button 
                            onClick={() => handleDeleteTransaction(txn._id)}
                            className="bg-transparent border-none text-neutral-500 hover:text-rose-400 cursor-pointer p-1"
                            title="Delete Record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-12 flex flex-col items-center justify-center flex-grow">
                <Ghost size={64} strokeWidth={1.5} className="text-neutral-600 mb-3" />
                <p className="text-white font-semibold text-base m-0 mb-1">No Activity Yet</p>
                <p className="text-xs text-neutral-500 max-w-[240px] leading-relaxed m-0">
                  Change filters or tap buttons above to add a new entry.
                </p>
              </div>
            )}
          </>
        )}
        {activeTab === 'analysis' && (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-extrabold m-0 tracking-tight text-white">Insights & Analytics</h2>

            <div 
              onClick={() => setShowSummaryPage(true)}
              className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl shadow-xl cursor-pointer"
            >
              <p className="text-neutral-400 text-xs font-semibold text-center m-0 uppercase tracking-wider">Overview</p>
              <p className="text-4xl font-extrabold text-center my-2 text-white">
                <AnimatedCounter value={netBalance} />
              </p>
              
              <div className="flex gap-3 mt-4">
                <div className="bg-black/40 p-3 rounded-2xl flex-1 border border-neutral-800">
                  <span className="text-xs text-neutral-400 flex items-center gap-1.5 mb-1">
                    <TrendingUp size={14} className="text-emerald-400" /> Cash In
                  </span>
                  <p className="font-bold text-emerald-400 text-sm m-0">
                    <AnimatedCounter value={totalCashIn} />
                  </p>
                </div>
                <div className="bg-black/40 p-3 rounded-2xl flex-1 border border-neutral-800">
                  <span className="text-xs text-neutral-400 flex items-center gap-1.5 mb-1">
                    <TrendingDown size={14} className="text-rose-500" /> Cash Out
                  </span>
                  <p className="font-bold text-rose-500 text-sm m-0">
                    <AnimatedCounter value={totalCashOut} />
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-3xl shadow-xl">
              <h3 className="text-base font-bold m-0 mb-1 text-white">Weekly Spending Activity</h3>
              <p className="text-xs text-neutral-400 m-0 mb-6">Tap any bar to see details</p>

              <div className="flex justify-between items-end h-28 pb-2 border-b border-neutral-800">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const dayAmt = weeklySpendingMap[day] || 0;
                  const maxAmt = Math.max(...Object.values(weeklySpendingMap), 1000);
                  const barHeight = dayAmt > 0 ? Math.min(Math.max((dayAmt / maxAmt) * 90, 15), 90) : 3;
                  const isSelected = selectedDay === day;
                  return (
                    <div 
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className="flex flex-col items-center gap-2 cursor-pointer flex-1"
                    >
                      <div 
                        style={{ height: `${barHeight}px` }}
                        className={`w-4 rounded-md transition-all ${dayAmt > 0 ? 'bg-rose-500' : 'bg-neutral-800'}`}
                      ></div>
                      <span className={`text-[11px] ${isSelected ? 'text-white font-bold' : 'text-neutral-500'}`}>
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between mt-4 pt-2">
                <div>
                  <p className="text-xs text-neutral-400 m-0 mb-1">Total Cash In</p>
                  <p className="text-sm font-bold text-emerald-400 m-0">
                    <AnimatedCounter value={totalCashIn} />
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-400 m-0 mb-1">Total Cash Out</p>
                  <p className="text-sm font-bold text-rose-500 m-0">
                    <AnimatedCounter value={totalCashOut} />
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold m-0 mb-1 text-white">Spending Overview</h3>
              <p className="text-xs text-neutral-400 m-0 mb-4">Spending by Category</p>

              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 flex flex-col gap-3 shadow-xl">
                {Object.keys(categorySpending).length > 0 ? (
                  Object.entries(categorySpending).map(([cat, amt]) => (
                    <div key={cat} className="flex justify-between items-center border-b border-neutral-800/80 pb-2.5 last:border-none">
                      <span className="text-sm text-white font-semibold">{cat}</span>
                      <span className="text-sm text-rose-500 font-bold">₹{amt}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500 text-center m-0 py-2">
                    Add cash-out spending records to view category breakdown.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'collection' && (
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-extrabold m-0 tracking-tight text-white">Collections & Vaults</h2>

            <div className="relative flex bg-neutral-900 border border-neutral-800 rounded-full p-1 items-center">
              <div
                style={{ transform: `translateX(${activeCollectionIndex * 100}%)` }}
                className="absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/3)] bg-white/10 border border-neutral-700 rounded-full transition-transform duration-300 pointer-events-none z-10"
              />

              {collectionTabs.map((tab) => {
                const isActive = collectionSubTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setCollectionSubTab(tab)}
                    className={`relative z-20 flex-1 bg-transparent border-none rounded-full py-2.5 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-colors ${isActive ? 'text-white font-bold' : 'text-neutral-400'}`}
                  >
                    {isActive && <Check size={14} className="text-blue-500" />}
                    {tab}
                  </button>
                );
              })}
            </div>

            {collectionSubTab === 'All' && (
              <div className="flex flex-col gap-4">
                {[...prebuiltCategories, ...ownedCollections.map(item => ({ 
                  title: item.name, 
                  icon: <Box size={18} style={{ color: item.color || "#3b82f6" }} /> 
                }))].map((item, index) => {
                  const catName = item.name || item.title;
                  const catData = categorySummary[catName] || { cashIn: 0, cashOut: 0, count: 0 };
                  const netCatBalance = catData.cashIn - catData.cashOut;
                  return (
                    <div key={index} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 flex justify-between items-start shadow-xl">
                      <div className="flex flex-col gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-black border border-neutral-800 flex items-center justify-center">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="text-base font-bold m-0 mb-0.5 text-white">{catName}</h4>
                          <p className="text-xs text-neutral-400 m-0">{catData.count} records</p>
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <p className="text-[11px] text-emerald-400 m-0 mb-0.5">In: ₹{catData.cashIn}</p>
                            <p className="text-[11px] text-rose-500 m-0">Out: ₹{catData.cashOut}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-neutral-400 m-0 mb-0.5">Remaining</p>
                            <p className={`text-sm font-bold m-0 ${netCatBalance >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
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
                        className="bg-transparent border-none text-neutral-400 hover:text-white cursor-pointer p-1"
                      >
                        <Edit3 size={17} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {collectionSubTab === 'Prebuild' && (
              <div className="flex flex-col gap-4">
                {prebuiltCategories.map((item, index) => {
                  const catData = categorySummary[item.name] || { cashIn: 0, cashOut: 0, count: 0 };
                  const netCatBalance = catData.cashIn - catData.cashOut;
                  return (
                    <div key={index} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 flex justify-between items-start shadow-xl">
                      <div className="flex flex-col gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-black border border-neutral-800 flex items-center justify-center">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="text-base font-bold m-0 mb-0.5 text-white">{item.name}</h4>
                          <p className="text-xs text-neutral-400 m-0">{catData.count} records</p>
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <p className="text-[11px] text-emerald-400 m-0 mb-0.5">In: ₹{catData.cashIn}</p>
                            <p className="text-[11px] text-rose-500 m-0">Out: ₹{catData.cashOut}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-neutral-400 m-0 mb-0.5">Remaining</p>
                            <p className={`text-sm font-bold m-0 ${netCatBalance >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
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
                        className="bg-transparent border-none text-neutral-400 hover:text-white cursor-pointer p-1"
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
                <div className="flex flex-col gap-4">
                  {ownedCollections.map((item, index) => {
                    const catData = categorySummary[item.name] || { cashIn: 0, cashOut: 0, count: 0 };
                    const netCatBalance = catData.cashIn - catData.cashOut;
                    return (
                      <div key={index} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 flex justify-between items-start shadow-xl">
                        <div className="flex flex-col gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-black border border-neutral-800 flex items-center justify-center">
                            <Box size={18} style={{ color: item.color || "#3b82f6" }} />
                          </div>
                          <div>
                            <h4 className="text-base font-bold m-0 mb-0.5 text-white">{item.name}</h4>
                            <p className="text-xs text-neutral-400 m-0">{catData.count} records</p>
                          </div>
                          <div className="flex gap-4">
                            <div>
                              <p className="text-[11px] text-emerald-400 m-0 mb-0.5">In: ₹{catData.cashIn}</p>
                              <p className="text-[11px] text-rose-500 m-0">Out: ₹{catData.cashOut}</p>
                            </div>
                            <div>
                              <p className="text-[11px] text-neutral-400 m-0 mb-0.5">Remaining</p>
                              <p className={`text-sm font-bold m-0 ${netCatBalance >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
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
                          className="bg-transparent border-none text-neutral-400 hover:text-white cursor-pointer p-1"
                        >
                          <Edit3 size={17} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 flex flex-col items-center justify-center flex-grow">
                  <Ghost size={64} strokeWidth={1.5} className="text-neutral-600 mb-3" />
                  <p className="text-white font-semibold text-base m-0 mb-1">No Custom Collections</p>
                  <p className="text-xs text-neutral-500 max-w-[240px] leading-relaxed m-0">
                    Create custom collections with categories to analyze your spending efficiently.
                  </p>
                </div>
              )
            )}
          </div>
        )}

      </div>

      {/* Rohix AI Assistant Floating Button with Robot Icon placed above Home tab */}
      <div className="fixed bottom-22 right-5 z-40">
        <button 
          onClick={() => setShowAiChat(true)}
          className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 rounded-full py-2.5 px-4 flex items-center gap-2 cursor-pointer shadow-2xl transition-transform active:scale-95 backdrop-blur-md"
          title="Rohix AI Assistant"
        >
          <Bot size={18} className="text-blue-400 animate-bounce" />
          <span className="text-xs font-bold tracking-wide">Rohix AI</span>
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] bg-neutral-900 border border-neutral-800 rounded-full p-2 flex items-center justify-between shadow-2xl z-30 backdrop-blur-md">
        {tabList.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id)}
              className={`relative z-20 flex-1 flex flex-col items-center justify-center gap-1 py-1.5 px-2 bg-transparent border-none rounded-full cursor-pointer text-xs transition-all ${isActive ? 'bg-black text-white font-bold shadow-md border border-neutral-800' : 'text-neutral-400 hover:text-white'}`}
            >
              <IconComponent size={18} className={isActive ? 'text-white' : 'text-neutral-400'} />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile & Settings Modal */}
      {showSettingsModal && (
        <div 
          onClick={() => setShowSettingsModal(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm flex flex-col justify-end z-50"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-900 border-t border-neutral-800 rounded-t-3xl p-6 w-full max-w-[380px] mx-auto box-border shadow-2xl animate-slideUp"
          >
            <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mb-5"></div>

            <h2 className="text-xl font-bold text-white m-0 mb-5">Profile & Settings</h2>

            <div className="flex flex-col gap-3">
              <div 
                onClick={onLogout}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-black border border-neutral-800/80 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400">
                  <LogOut size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white m-0 mb-0.5">Sign Out</h4>
                  <p className="text-xs text-neutral-400 m-0">Safely close current session</p>
                </div>
              </div>

              <div 
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowDeleteConfirmModal(true);
                }}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-black border border-neutral-800/80 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-500">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-rose-500 m-0 mb-0.5">Delete Account</h4>
                  <p className="text-xs text-neutral-400 m-0">Permanently erase all data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-rose-500/40 rounded-3xl p-6 w-full max-w-[320px] text-center shadow-2xl">
            <div className="text-rose-500 text-lg font-bold mb-2">Delete Account?</div>
            <p className="text-neutral-400 text-xs leading-relaxed mb-5">
              Are you sure you want to permanently delete your account and all financial records? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirmModal(false)}
                className="flex-1 bg-black text-white border border-neutral-800 rounded-full py-2.5 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  handleDeleteAccount();
                }}
                className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 text-white border-none rounded-full py-2.5 font-semibold text-xs cursor-pointer shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAiChat && <AIAssistant onClose={() => setShowAiChat(false)} />}

    </div>
  );
}
