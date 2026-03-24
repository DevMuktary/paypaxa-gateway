'use client';

import { useState } from 'react';

// ==========================================
// 1. ICONS (Flat, Non-AI style)
// ==========================================
const Icons = {
  Overview: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>,
  Wallet: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>,
  Transactions: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
  Customers: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Reserved: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Transfer: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 9l-6 6 6 6"></path><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51z"></path></svg>,
  Webhook: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
  API: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
  Support: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  Docs: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  Logout: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  Moon: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
  Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
  NodeGraph: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2"><circle cx="18" cy="5" r="3" fill="#3B82F6"></circle><circle cx="6" cy="12" r="3" fill="#3B82F6"></circle><circle cx="18" cy="19" r="3" fill="#3B82F6"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>,
  PersonFlat: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="#3B82F6"></circle><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" fill="#1E3A8A"></path></svg>,
  BriefcaseFlat: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="4" y="8" width="16" height="12" rx="2" fill="#F59E0B"></rect><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="#B45309"></path></svg>,
  MailboxFlat: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 10h16v10H4z" fill="#0EA5E9"></path><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" fill="#38BDF8"></path><rect x="18" y="6" width="4" height="6" fill="#EF4444"></rect></svg>
};


// ==========================================
// 2. SIDEBAR COMPONENT
// ==========================================
function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const NavItem = ({ id, label, icon: Icon, badge }: any) => (
    <div 
      className={`nav-item ${activeTab === id ? 'active' : ''}`} 
      onClick={() => setActiveTab(id)}
    >
      <Icon /> 
      <span style={{ flex: 1 }}>{label}</span>
      {badge && <span className="nav-badge">{badge}</span>}
    </div>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="https://paypaxa.com/logo.png" alt="PAYPAXA" style={{ height: '36px', width: 'auto' }} />
        {/* If your logo doesn't have text, uncomment below */}
        {/* <span style={{ fontSize: '22px', fontWeight: '800', color: '#D81B60' }}>PAYPAXA</span> */}
      </div>
      
      <div className="sidebar-scroll">
        <div className="nav-group">
          <div className="nav-label">DASHBOARD</div>
          <NavItem id="overview" label="Overview" icon={Icons.Overview} />
          <NavItem id="wallet" label="Wallet" icon={Icons.Wallet} />
        </div>

        <div className="nav-group">
          <div className="nav-label">COLLECTIONS</div>
          <NavItem id="transactions" label="Transactions" icon={Icons.Transactions} />
          <NavItem id="customers" label="Customers" icon={Icons.Customers} />
          <NavItem id="reserved" label="Reserved Account" icon={Icons.Reserved} />
        </div>

        <div className="nav-group">
          <div className="nav-label">DISBURSEMENTS</div>
          <NavItem id="transfer" label="Transfer" icon={Icons.Transfer} />
        </div>

        <div className="nav-group">
          <div className="nav-label">MERCHANT</div>
          <NavItem id="settings" label="Settings" icon={Icons.Settings} />
          <NavItem id="webhook" label="Webhook Event" icon={Icons.Webhook} badge="New" />
          <NavItem id="api" label="Developer API" icon={Icons.API} />
          <NavItem id="support" label="Support" icon={Icons.Support} />
          <NavItem id="docs" label="Documentation" icon={Icons.Docs} />
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="profile-box">
          <div className="avatar">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mukhtar" alt="Avatar" />
          </div>
          <div className="profile-info">
            <strong>Abdulwaheed</strong>
            <span>Smart9ja</span>
          </div>
          <button className="logout-btn">
            <Icons.Logout />
          </button>
        </div>
      </div>
    </aside>
  );
}


// ==========================================
// 3. SWITCH BUSINESS MODAL
// ==========================================
function BusinessModal({ isOpen, onClose, businesses, activeBiz, onSwitch, onAdd }: any) {
  if (!isOpen) return null;
  
  // Local state to handle the simulated radio toggles
  const [selected, setSelected] = useState(activeBiz);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ textAlign: 'center', color: '#D81B60', margin: '0 0 20px 0', fontSize: '18px' }}>Select a Business</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {businesses.map((biz: string) => (
            <div 
              key={biz} 
              className={`biz-row ${selected === biz ? 'selected' : ''}`}
              onClick={() => setSelected(biz)}
            >
              <span style={{ fontWeight: '500', color: '#1F2937' }}>{biz}</span>
              {/* CSS Toggle Switch */}
              <div className={`toggle-switch ${selected === biz ? 'on' : 'off'}`}>
                <div className="toggle-knob"></div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            className="btn-primary" 
            onClick={() => { onSwitch(selected); onClose(); }}
          >
            Switch Business
          </button>
          
          {businesses.length < 3 && (
            <button className="btn-secondary" onClick={onAdd}>
              + Add Business
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 4. MAIN DASHBOARD PAGE
// ==========================================
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Business State
  const [businesses, setBusinesses] = useState(['Smart9ja', 'SmartReceipt', 'FYNAX TECHNOLOGY']);
  const [activeBusiness, setActiveBusiness] = useState('Smart9ja');

  const handleAddBusiness = () => {
    alert("In a real app, this would route to an 'Add Business' form.");
    setIsModalOpen(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        html, body { margin: 0; padding: 0; background-color: #F9FAFB; font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1F2937; overflow-x: hidden; }
        * { box-sizing: border-box; }
        
        .dash-layout { display: flex; height: 100vh; overflow: hidden; }
        
        /* Sidebar Styling (Light Theme) */
        .sidebar { width: 260px; background-color: #FFFFFF; border-right: 1px solid #E5E7EB; display: flex; flex-direction: column; flex-shrink: 0; }
        .sidebar-header { padding: 24px; border-bottom: 1px solid #F3F4F6; display: flex; align-items: center; justify-content: center; }
        .sidebar-scroll { flex: 1; overflow-y: auto; padding: 24px 0; }
        .nav-group { margin-bottom: 24px; padding: 0 16px; }
        .nav-label { font-size: 11px; color: #6B7280; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; padding-left: 12px; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 8px; cursor: pointer; color: #4B5563; font-weight: 500; font-size: 14px; margin-bottom: 4px; transition: 0.2s; }
        .nav-item:hover { background-color: #F3F4F6; color: #111827; }
        .nav-item.active { background-color: #D81B60; color: #FFFFFF; box-shadow: 0 4px 6px rgba(216, 27, 96, 0.2); }
        .nav-badge { background-color: #FCA5A5; color: #991B1B; font-size: 10px; padding: 2px 6px; border-radius: 99px; font-weight: bold; }
        
        .sidebar-footer { padding: 16px; border-top: 1px solid #F3F4F6; }
        .profile-box { background-color: #FFF1F2; padding: 12px; border-radius: 12px; display: flex; align-items: center; gap: 12px; }
        .avatar { width: 36px; height: 36px; border-radius: 50%; background: #E5E7EB; overflow: hidden; }
        .profile-info { display: flex; flex-direction: column; flex: 1; }
        .profile-info strong { font-size: 14px; color: #1F2937; }
        .profile-info span { font-size: 12px; color: #6B7280; }
        .logout-btn { background: none; border: none; cursor: pointer; padding: 4px; }

        /* Main Content */
        .main-content { flex: 1; display: flex; flex-direction: column; min-width: 0; background-color: #F9FAFB; }
        
        /* Top Header */
        .top-header { height: 72px; background-color: #FFFFFF; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; }
        .btn-switch-outline { background: #FFFFFF; border: 1px solid #D1D5DB; color: #4B5563; padding: 8px 16px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
        .btn-switch-outline:hover { border-color: #9CA3AF; color: #1F2937; }
        .header-actions { display: flex; align-items: center; gap: 20px; }
        
        .content-area { padding: 32px; overflow-y: auto; flex: 1; }

        /* Colored Flat Cards */
        .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 32px; }
        .colored-card { padding: 24px; border-radius: 16px; color: #FFFFFF; text-align: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .card-magenta { background-color: #C2185B; }
        .card-pink { background-color: #F48FB1; }
        .card-teal { background-color: #00BFA5; }
        .card-orange { background-color: #FF8A65; }
        .colored-card h3 { font-size: 15px; font-weight: 600; margin: 16px 0 8px 0; }
        .colored-card .value { font-size: 28px; font-weight: 700; margin: 0; }

        /* Overview Filters & Stats */
        .overview-panel { background: #FFFFFF; border-radius: 16px; border: 1px solid #E5E7EB; padding: 24px; margin-bottom: 32px; }
        .filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .filter-pills { display: flex; gap: 8px; flex-wrap: wrap; }
        .pill { border: 1px solid #D1D5DB; background: transparent; color: #6B7280; padding: 6px 16px; border-radius: 99px; font-size: 13px; cursor: pointer; }
        .pill.active { background: #D81B60; color: #FFFFFF; border-color: #D81B60; }
        
        .stat-banner { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
        .stat-box { padding: 20px; border-radius: 8px; text-align: center; }
        .stat-box.bg-pink { background: #FCE4EC; color: #C2185B; }
        .stat-box.bg-yellow { background: #FFF8E1; color: #1F2937; }
        .stat-box h4 { font-size: 13px; font-weight: 500; margin: 0 0 8px 0; }
        .stat-box .amount { font-size: 20px; font-weight: 700; margin: 0; }

        /* Modal Styles */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: #FFFFFF; width: 100%; max-width: 400px; padding: 32px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .biz-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #F9FAFB; border-radius: 8px; cursor: pointer; }
        .biz-row.selected { background: #FCE4EC; }
        
        .toggle-switch { width: 44px; height: 24px; border-radius: 24px; position: relative; transition: 0.3s; }
        .toggle-switch.on { background: #D81B60; }
        .toggle-switch.off { background: #D1D5DB; }
        .toggle-knob { width: 20px; height: 20px; background: #FFFFFF; border-radius: 50%; position: absolute; top: 2px; transition: 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .toggle-switch.on .toggle-knob { left: 22px; }
        .toggle-switch.off .toggle-knob { left: 2px; }

        .btn-primary { width: 100%; background: #D81B60; color: #FFFFFF; border: none; padding: 14px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-primary:hover { background: #C2185B; }
        .btn-secondary { width: 100%; background: #FFFFFF; color: #D81B60; border: 1px solid #D81B60; padding: 14px; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-secondary:hover { background: #FFF1F2; }

        /* Empty Chart Area */
        .chart-placeholder { height: 200px; border-left: 2px dashed #E5E7EB; border-bottom: 2px dashed #E5E7EB; display: flex; align-items: center; justify-content: center; color: #9CA3AF; font-size: 14px; }
      `}} />

      {/* RENDER MODAL */}
      <BusinessModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        businesses={businesses}
        activeBiz={activeBusiness}
        onSwitch={(biz: string) => setActiveBusiness(biz)}
        onAdd={handleAddBusiness}
      />

      <div className="dash-layout">
        {/* RENDER SIDEBAR */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* MAIN CONTENT AREA */}
        <main className="main-content">
          <header className="top-header">
            <div>
              <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', marginRight: '16px' }}>☰</button>
              <button className="btn-switch-outline" onClick={() => setIsModalOpen(true)}>
                Switch Business <Icons.ChevronDown />
              </button>
            </div>
            <div className="header-actions">
              <Icons.Moon />
              <Icons.Bell />
            </div>
          </header>

          <div className="content-area">
            {/* Greeting */}
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                <span style={{ color: '#D81B60' }}>Welcome Back, {activeBusiness}!</span> 😎
              </h1>
              <p style={{ color: '#4B5563', margin: 0, fontSize: '15px' }}>Here's a Quick Overview of Your Account:</p>
            </div>

            {/* 4 Colored Flat Cards */}
            <div className="metric-grid">
              <div className="colored-card card-magenta">
                <Icons.NodeGraph />
                <h3>Account Balance</h3>
                <p className="value">₦1.50</p>
              </div>
              <div className="colored-card card-pink">
                <Icons.PersonFlat />
                <h3>Total Customers</h3>
                <p className="value">0</p>
              </div>
              <div className="colored-card card-teal">
                <Icons.BriefcaseFlat />
                <h3>Total Transactions</h3>
                <p className="value">0</p>
              </div>
              <div className="colored-card card-orange">
                <Icons.MailboxFlat />
                <h3>Total Withdrawals</h3>
                <p className="value">₦0.00</p>
              </div>
            </div>

            {/* Bottom Overview Section */}
            <div className="overview-panel">
              <div className="filter-header">
                <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Overview</h2>
                <div className="filter-pills">
                  <button className="pill active">Today</button>
                  <button className="pill">Yesterday</button>
                  <button className="pill">Last 7 days</button>
                  <button className="pill">Last 30 days</button>
                  <button className="pill">All Time</button>
                  <button className="pill">Custom</button>
                </div>
              </div>

              <div className="stat-banner">
                <div className="stat-box bg-pink">
                  <h4>Total Revenue</h4>
                  <p className="amount">₦0.00</p>
                </div>
                <div className="stat-box bg-yellow">
                  <h4>Total Transactions</h4>
                  <p className="amount">0</p>
                </div>
                <div className="stat-box bg-pink">
                  <h4>Pending Settlement</h4>
                  <p className="amount">₦0.00</p>
                </div>
              </div>

              {/* Chart Placeholder (To be replaced with Recharts/Chart.js later) */}
              <div className="chart-placeholder">
                [ Chart Graph Area ]
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
