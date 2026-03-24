'use client';

import { useState } from 'react';

export default function DashboardPage() {
  // --- STATE MANAGEMENT ---
  const [activeMenu, setActiveMenu] = useState('overview');
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  
  // Business Switcher State
  const [businesses, setBusinesses] = useState([
    { id: 1, name: 'Quadrox Tech', isActive: true },
    { id: 2, name: 'SmartReceipt', isActive: false },
    { id: 3, name: 'FYNAX TECHNOLOGY', isActive: false },
  ]);

  const activeBusiness = businesses.find(b => b.isActive)?.name || 'Quadrox Tech';

  const handleSwitchBusiness = (id: number) => {
    setBusinesses(businesses.map(b => ({
      ...b,
      isActive: b.id === id
    })));
    // In a real app, you would also close the modal here, but we'll let the user click the button.
  };

  // --- ICONS (Clean, Flat SVGs) ---
  const Icons = {
    Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>,
    Wallet: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>,
    Transactions: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
    Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>,
    Shield: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
    Transfer: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 16l-4 4-4-4"></path><path d="M16 20V4"></path><path d="M4 8l4-4 4 4"></path><path d="M8 4v16"></path></svg>,
    Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51z"></path></svg>,
    Webhook: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    Code: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
    Support: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
    Docs: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    Logout: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    Moon: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
    Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    Menu: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
    ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
  };

  return (
    <>
      {/* --- GLOBAL STYLES (Light Mode, Flat, Crisp) --- */}
      <style dangerouslySetInnerHTML={{__html: `
        html, body { margin: 0; padding: 0; background-color: #F8FAFC; font-family: 'Segoe UI', Roboto, Helvetica, sans-serif; color: #334155; }
        * { box-sizing: border-box; }
        
        .layout { display: flex; height: 100vh; overflow: hidden; }
        
        /* Sidebar */
        .sidebar { width: 260px; background-color: #FFFFFF; border-right: 1px solid #E2E8F0; display: flex; flex-direction: column; overflow-y: auto; }
        .sidebar-logo { padding: 24px; display: flex; align-items: center; gap: 10px; position: sticky; top: 0; background: #FFFFFF; z-index: 10; border-bottom: 1px solid #F1F5F9; }
        .nav-section { margin-bottom: 24px; }
        .nav-header { font-size: 11px; color: #64748B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 0 24px; margin-bottom: 8px; }
        .nav-item { display: flex; align-items: center; gap: 14px; padding: 12px 24px; cursor: pointer; color: #475569; font-size: 14px; font-weight: 500; transition: background 0.2s; }
        .nav-item:hover { background-color: #F8FAFC; color: #0F172A; }
        .nav-item.active { background-color: #DB2777; color: #FFFFFF; border-radius: 0 24px 24px 0; margin-right: 16px; }
        .nav-item.active:hover { background-color: #BE185D; }
        
        /* New Badge */
        .badge-new { background-color: #FBCFE8; color: #BE185D; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 99px; margin-left: auto; }

        /* User Footer */
        .user-footer { margin-top: auto; padding: 24px; border-top: 1px solid #E2E8F0; display: flex; align-items: center; gap: 12px; background: #FAFAFA; }
        .user-avatar { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #CBD5E1; }
        
        /* Main Area */
        .main { flex: 1; display: flex; flex-direction: column; min-width: 0; background-color: #F8FAFC; }
        .header { height: 72px; background-color: #FFFFFF; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; }
        
        .switch-btn { border: 1px solid #CBD5E1; background: #FFFFFF; padding: 8px 16px; border-radius: 6px; font-size: 14px; color: #475569; display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .switch-btn:hover { border-color: #94A3B8; }
        
        .content { padding: 32px; overflow-y: auto; flex: 1; }
        
        /* Modal Styles */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; z-index: 999; }
        .modal-box { background: #FFFFFF; width: 100%; max-width: 400px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); padding: 24px; }
        .modal-title { color: #DB2777; font-size: 16px; font-weight: 600; text-align: center; margin-bottom: 24px; }
        
        /* Custom CSS Toggle Switch */
        .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F1F5F9; }
        .toggle-label { font-size: 14px; font-weight: 600; color: #334155; }
        .switch { position: relative; display: inline-block; width: 44px; height: 24px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #CBD5E1; transition: .3s; border-radius: 24px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
        input:checked + .slider { background-color: #DB2777; }
        input:checked + .slider:before { transform: translateX(20px); }
        
        /* Colored Metric Cards */
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .data-card { padding: 32px 24px; border-radius: 16px; text-align: center; color: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .data-card h3 { margin: 0; font-size: 15px; font-weight: 600; }
        .data-card .val { font-size: 28px; font-weight: 800; margin: 0; }
        
        .c-pink { background: linear-gradient(135deg, #BE185D 0%, #D81B60 100%); }
        .c-lightpink { background: linear-gradient(135deg, #F472B6 0%, #F9A8D4 100%); }
        .c-teal { background: linear-gradient(135deg, #0D9488 0%, #14B8A6 100%); }
        .c-orange { background: linear-gradient(135deg, #EA580C 0%, #F97316 100%); }

        /* Overview Filters & Stats */
        .overview-wrap { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px; margin-bottom: 32px; }
        .pill-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; justify-content: flex-end; }
        .pill { border: 1px solid #CBD5E1; color: #64748B; background: transparent; padding: 6px 16px; border-radius: 99px; font-size: 13px; font-weight: 500; cursor: pointer; }
        .pill.active { background: #DB2777; color: #FFFFFF; border-color: #DB2777; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
        .stat-box { background: #FDF2F8; border-radius: 8px; padding: 20px; text-align: center; }
        .stat-box h4 { margin: 0 0 8px 0; font-size: 13px; color: #475569; font-weight: 500; }
        .stat-box .amt { font-size: 20px; font-weight: 700; color: #BE185D; }
        
        /* Simple Line Chart Area */
        .chart-mock { height: 200px; border-bottom: 2px solid #E2E8F0; border-left: 2px solid #E2E8F0; position: relative; margin-bottom: 16px; }
        .grid-line { position: absolute; left: 0; right: 0; border-bottom: 1px dashed #CBD5E1; }

        @media (max-width: 1024px) { .sidebar { display: none; } }
      `}} />

      {/* --- BUSINESS SWITCHER MODAL --- */}
      {isBusinessModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBusinessModalOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Select a Business</div>
            
            <div style={{ marginBottom: '24px' }}>
              {businesses.map((biz) => (
                <div className="toggle-row" key={biz.id}>
                  <span className="toggle-label">{biz.name}</span>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={biz.isActive} 
                      onChange={() => handleSwitchBusiness(biz.id)} 
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={() => setIsBusinessModalOpen(false)}
                style={{ width: '100%', padding: '14px', background: '#DB2777', color: '#FFF', border: 'none', borderRadius: '24px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
              >
                Switch Business
              </button>
              
              {/* Added the required Add Business button */}
              {businesses.length < 3 && (
                <button 
                  style={{ width: '100%', padding: '14px', background: 'transparent', color: '#DB2777', border: '1px solid #DB2777', borderRadius: '24px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                >
                  + Add New Business
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="layout">
        
        {/* --- SIDEBAR --- */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <img src="https://paypaxa.com/logo.png" alt="PAYPAXA Logo" style={{ height: '32px', width: 'auto' }} />
            <span style={{ fontSize: '22px', fontWeight: '800', color: '#DB2777', letterSpacing: '-0.5px' }}>PAYPAXA</span>
          </div>

          <div style={{ padding: '24px 0' }}>
            <div className="nav-section">
              <div className="nav-header">Dashboard</div>
              <div className={`nav-item ${activeMenu === 'overview' ? 'active' : ''}`} onClick={() => setActiveMenu('overview')}><Icons.Home /> Overview</div>
              <div className={`nav-item ${activeMenu === 'wallet' ? 'active' : ''}`} onClick={() => setActiveMenu('wallet')}><Icons.Wallet /> Wallet</div>
            </div>

            <div className="nav-section">
              <div className="nav-header">Collections</div>
              <div className={`nav-item ${activeMenu === 'transactions' ? 'active' : ''}`} onClick={() => setActiveMenu('transactions')}><Icons.Transactions /> Transactions</div>
              <div className={`nav-item ${activeMenu === 'customers' ? 'active' : ''}`} onClick={() => setActiveMenu('customers')}><Icons.Users /> Customers</div>
              <div className={`nav-item ${activeMenu === 'reserved' ? 'active' : ''}`} onClick={() => setActiveMenu('reserved')}><Icons.Shield /> Reserved Account</div>
            </div>

            <div className="nav-section">
              <div className="nav-header">Disbursements</div>
              <div className={`nav-item ${activeMenu === 'transfer' ? 'active' : ''}`} onClick={() => setActiveMenu('transfer')}><Icons.Transfer /> Transfer</div>
            </div>

            <div className="nav-section">
              <div className="nav-header">Merchant</div>
              <div className={`nav-item ${activeMenu === 'settings' ? 'active' : ''}`} onClick={() => setActiveMenu('settings')}><Icons.Settings /> Settings</div>
              <div className={`nav-item ${activeMenu === 'webhook' ? 'active' : ''}`} onClick={() => setActiveMenu('webhook')}><Icons.Webhook /> Webhook Event <span className="badge-new">New</span></div>
              <div className={`nav-item ${activeMenu === 'api' ? 'active' : ''}`} onClick={() => setActiveMenu('api')}><Icons.Code /> Developer API</div>
              <div className={`nav-item ${activeMenu === 'support' ? 'active' : ''}`} onClick={() => setActiveMenu('support')}><Icons.Support /> Support</div>
              <div className={`nav-item ${activeMenu === 'docs' ? 'active' : ''}`} onClick={() => setActiveMenu('docs')}><Icons.Docs /> Documentation</div>
            </div>
          </div>

          {/* Bottom User Profile */}
          <div className="user-footer">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mukhtar" alt="Avatar" className="user-avatar" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>Mukhtar A.</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>{activeBusiness}</div>
            </div>
            <div style={{ cursor: 'pointer' }}><Icons.Logout /></div>
          </div>
        </aside>

        {/* --- MAIN DASHBOARD CONTENT --- */}
        <main className="main">
          
          {/* Top Header */}
          <header className="header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="sidebar-toggle" style={{ display: 'none' }}><Icons.Menu /></div>
              
              <button className="switch-btn" onClick={() => setIsBusinessModalOpen(true)}>
                Switch Business <Icons.ChevronDown />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <Icons.Moon />
              <Icons.Bell />
            </div>
          </header>

          <div className="content">
            
            {/* Greeting */}
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#0F172A', margin: '0 0 8px 0' }}>
                <span style={{ color: '#DB2777' }}>Welcome Back,</span> {activeBusiness}! 😎
              </h1>
              <p style={{ color: '#475569', margin: 0, fontSize: '15px' }}>Here's a Quick Overview of Your Account:</p>
            </div>

            {/* 4 Colored Metric Cards (Exact replica of reference) */}
            <div className="cards-grid">
              <div className="data-card c-pink">
                <div style={{ marginBottom: '8px' }}>
                   {/* Fake custom icon using basic circles */}
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="6" r="4" fill="#60A5FA"/><circle cx="6" cy="16" r="4" fill="#3B82F6"/><circle cx="18" cy="16" r="4" fill="#93C5FD"/><path d="M10 9L7 13M14 9l3 4" stroke="white" strokeWidth="2"/></svg>
                </div>
                <h3>Account Balance</h3>
                <div className="val">₦1.50</div>
              </div>

              <div className="data-card c-lightpink">
                <div style={{ marginBottom: '8px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#1E3A8A"/></svg>
                </div>
                <h3>Total Customers</h3>
                <div className="val">0</div>
              </div>

              <div className="data-card c-teal">
                <div style={{ marginBottom: '8px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#F59E0B"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
                </div>
                <h3>Total Transactions</h3>
                <div className="val">0</div>
              </div>

              <div className="data-card c-orange">
                <div style={{ marginBottom: '8px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#38BDF8"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </div>
                <h3>Total Withdrawals</h3>
                <div className="val">₦0.00</div>
              </div>
            </div>

            {/* Overview / Chart Section */}
            <div className="overview-wrap">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0F172A', margin: 0 }}>Overview</h2>
                <div className="pill-filters">
                  <button className="pill active">Today</button>
                  <button className="pill">Yesterday</button>
                  <button className="pill">Last 7 days</button>
                  <button className="pill">Last 30 days</button>
                  <button className="pill">All Time</button>
                  <button className="pill">Custom</button>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-box" style={{ background: '#FDF2F8' }}>
                  <h4>Total Revenue</h4>
                  <div className="amt" style={{ color: '#DB2777' }}>₦0.00</div>
                </div>
                <div className="stat-box" style={{ background: '#FFFBEB' }}>
                  <h4>Total Transactions</h4>
                  <div className="amt" style={{ color: '#475569' }}>0</div>
                </div>
                <div className="stat-box" style={{ background: '#FDF2F8' }}>
                  <h4>Pending Settlement</h4>
                  <div className="amt" style={{ color: '#F472B6' }}>₦0.00</div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="chart-mock">
                <div className="grid-line" style={{ bottom: '25%' }}></div>
                <div className="grid-line" style={{ bottom: '50%' }}></div>
                <div className="grid-line" style={{ bottom: '75%' }}></div>
                <div className="grid-line" style={{ bottom: '100%' }}></div>
              </div>
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8' }}>Today</div>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px', fontSize: '13px', color: '#64748B', fontWeight: '500' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#818CF8' }}></div> revenue</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399' }}></div> transactions</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }}></div> pending</div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
