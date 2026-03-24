'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isBusinessMenuOpen, setIsBusinessMenuOpen] = useState(false);
  const [activeBusiness, setActiveBusiness] = useState('Quadrox Tech');

  // Multi-Business Mock Data
  const businesses = ['Quadrox Tech', 'Haramain Stream', 'GoliveNG'];

  // Mock Data for the Chart (Line Graph Simulation)
  const chartData = [
    { day: 'Mon', rev: '20%', txn: '15%' },
    { day: 'Tue', rev: '45%', txn: '30%' },
    { day: 'Wed', rev: '30%', txn: '25%' },
    { day: 'Thu', rev: '80%', txn: '60%' },
    { day: 'Fri', rev: '55%', txn: '40%' },
    { day: 'Sat', rev: '95%', txn: '75%' },
    { day: 'Sun', rev: '65%', txn: '50%' },
  ];

  // Mock Data for Transactions
  const transactions = [
    { id: '1f1917d753...', customer: 'DAARUL HIKMAH intl school', amount: '₦3,000.00', status: 'Paid', date: '16th of March, 2026 12:41 PM' },
    { id: 'a7e98bf4cb...', customer: 'Abdussamad salaudeen', amount: '₦2,000.00', status: 'Paid', date: '5th of March, 2026 12:47 PM' },
    { id: '16629e3027...', customer: 'Abdussamad salaudeen', amount: '₦2,000.00', status: 'Failed', date: '28th of February, 2026 10:41 AM' },
    { id: 'cccf5e47bd...', customer: 'Abdussamad salaudeen', amount: '₦1,000.00', status: 'Paid', date: '25th of February, 2026 12:01 PM' },
    { id: 'ff6ea15e13...', customer: 'Musa Ibrahim', amount: '₦15,500.00', status: 'Pending', date: '17th of February, 2026 3:35 PM' },
  ];

  // SVG Icons Toolkit
  const Icons = {
    Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>,
    Wallet: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>,
    Activity: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
    Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>,
    Bank: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>,
    Transfer: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>,
    Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51z"></path></svg>,
    Code: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
    Utility: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
    Copy: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
    ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        html, body { margin: 0; padding: 0; background-color: #060B19; font-family: system-ui, -apple-system, sans-serif; color: #F8FAFC; overflow-x: hidden; }
        * { box-sizing: border-box; }
        
        .dash-layout { display: flex; height: 100vh; overflow: hidden; }
        
        /* Sidebar Styling */
        .sidebar { width: 260px; background-color: #0A1128; border-right: 1px solid #1E293B; display: flex; flex-direction: column; overflow-y: auto; }
        .sidebar-header { padding: 24px; display: flex; alignItems: center; gap: 12px; position: sticky; top: 0; background: #0A1128; z-index: 10; border-bottom: 1px solid #1E293B; }
        .nav-group { margin-bottom: 24px; padding: 0 16px; }
        .nav-label { font-size: 11px; color: #64748B; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; padding-left: 12px; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s; color: #94A3B8; font-weight: 500; font-size: 14px; margin-bottom: 4px; }
        .nav-item:hover { background-color: #1E293B; color: #F8FAFC; }
        .nav-item.active { background-color: rgba(37, 99, 235, 0.15); color: #3B82F6; border-left: 3px solid #3B82F6; }
        
        /* Main Content Styling */
        .main-content { flex: 1; display: flex; flex-direction: column; min-width: 0; background-color: #060B19; }
        
        /* Header & Switch Business */
        .top-header { height: 70px; border-bottom: 1px solid #1E293B; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; background-color: #0A1128; }
        .business-switcher { display: flex; align-items: center; gap: 10px; background: #060B19; border: 1px solid #1E293B; padding: 8px 16px; border-radius: 8px; cursor: pointer; position: relative; }
        .business-switcher:hover { border-color: #334155; }
        .dropdown-menu { position: absolute; top: 110%; left: 0; width: 100%; background: #0E1629; border: 1px solid #1E293B; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5); z-index: 50; overflow: hidden; display: none; }
        .dropdown-menu.open { display: block; }
        .dropdown-item { padding: 12px 16px; font-size: 14px; color: #E2E8F0; cursor: pointer; transition: 0.2s; }
        .dropdown-item:hover { background: #1E293B; }
        
        .content-area { padding: 32px; overflow-y: auto; flex: 1; }
        
        /* Modern Cards */
        .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 32px; }
        .card-bal { background: linear-gradient(135deg, #BE185D 0%, #9D174D 100%); }
        .card-cus { background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); }
        .card-txn { background: linear-gradient(135deg, #10B981 0%, #059669 100%); }
        .card-wth { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); }
        
        .metric-card { padding: 24px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2); position: relative; overflow: hidden; }
        .metric-card h3 { font-size: 14px; color: rgba(255,255,255,0.8); font-weight: 500; margin: 0 0 8px 0; }
        .metric-card .value { font-size: 28px; font-weight: 800; color: #FFFFFF; }
        
        /* Filters & Overview */
        .overview-section { background-color: #0A1128; border: 1px solid #1E293B; border-radius: 16px; padding: 24px; margin-bottom: 32px; }
        .filter-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .time-filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .filter-btn { background: #060B19; border: 1px solid #1E293B; color: #94A3B8; padding: 6px 14px; border-radius: 999px; font-size: 13px; cursor: pointer; transition: 0.2s; }
        .filter-btn:hover { color: #F8FAFC; border-color: #334155; }
        .filter-btn.active { background: #BE185D; border-color: #BE185D; color: #FFFFFF; }
        
        /* Stats row below filters */
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
        .stat-box { background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; text-align: center; }
        .stat-box h4 { margin: 0 0 8px 0; font-size: 13px; color: #94A3B8; font-weight: 500; }
        .stat-box div { font-size: 20px; font-weight: 700; color: #F8FAFC; }
        
        /* Chart Simulation */
        .chart-area { height: 200px; display: flex; align-items: flex-end; border-bottom: 1px dashed #334155; border-left: 1px dashed #334155; padding-left: 10px; position: relative; }
        .chart-col { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%; position: relative; }
        .bar-rev { width: 8px; background: #BE185D; border-radius: 4px 4px 0 0; position: absolute; bottom: 0; left: 40%; }
        .bar-txn { width: 8px; background: #10B981; border-radius: 4px 4px 0 0; position: absolute; bottom: 0; right: 40%; }
        
        /* Table Styles */
        .table-card { background-color: #0A1128; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden; }
        .table-header { padding: 20px 24px; border-bottom: 1px solid #1E293B; display: flex; justify-content: space-between; align-items: center; }
        .txn-table { width: 100%; border-collapse: collapse; text-align: left; }
        .txn-table th { padding: 16px 24px; border-bottom: 1px solid #1E293B; color: #64748B; font-weight: 600; font-size: 12px; text-transform: uppercase; }
        .txn-table td { padding: 16px 24px; border-bottom: 1px solid #1A2642; color: #E2E8F0; font-size: 14px; }
        .txn-table tr:hover { background-color: rgba(255,255,255,0.02); }
        .status-badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
        .status-paid { background-color: rgba(16, 185, 129, 0.1); color: #10B981; }
        .status-pending { background-color: rgba(245, 158, 11, 0.1); color: #F59E0B; }
        .status-failed { background-color: rgba(239, 68, 68, 0.1); color: #EF4444; }

        @media (max-width: 1024px) { .sidebar { display: none; } }
      `}} />

      <div className="dash-layout">
        
        {/* --- SIDEBAR --- */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <img src="https://paypaxa.com/logo.png" alt="PAYPAXA" style={{ height: '32px', width: 'auto' }} />
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '1px' }}>PAYPAXA</span>
          </div>
          
          <div style={{ padding: '24px 0' }}>
            <div className="nav-group">
              <div className="nav-label">Dashboard</div>
              <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><Icons.Home /> Overview</div>
              <div className={`nav-item ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}><Icons.Wallet /> Wallet</div>
            </div>

            <div className="nav-group">
              <div className="nav-label">Collections</div>
              <div className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}><Icons.Activity /> Transactions</div>
              <div className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}><Icons.Users /> Customers</div>
              <div className={`nav-item ${activeTab === 'reserved' ? 'active' : ''}`} onClick={() => setActiveTab('reserved')}><Icons.Bank /> Reserved Account</div>
            </div>

            <div className="nav-group">
              <div className="nav-label">Disbursements</div>
              <div className={`nav-item ${activeTab === 'transfer' ? 'active' : ''}`} onClick={() => setActiveTab('transfer')}><Icons.Transfer /> Transfer</div>
            </div>

            <div className="nav-group">
              <div className="nav-label">Value Added (VTU)</div>
              <div className={`nav-item ${activeTab === 'vtu' ? 'active' : ''}`} onClick={() => setActiveTab('vtu')}><Icons.Utility /> Airtime & Data</div>
              <div className={`nav-item ${activeTab === 'identity' ? 'active' : ''}`} onClick={() => setActiveTab('identity')}><Icons.Code /> Identity (NIN/BVN)</div>
            </div>

            <div className="nav-group">
              <div className="nav-label">Merchant</div>
              <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><Icons.Settings /> Settings</div>
              <div className={`nav-item ${activeTab === 'api' ? 'active' : ''}`} onClick={() => setActiveTab('api')}><Icons.Code /> Developer API</div>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="main-content">
          
          {/* Top Header */}
          <header className="top-header">
            
            {/* Multi-Business Switcher */}
            <div className="business-switcher" onClick={() => setIsBusinessMenuOpen(!isBusinessMenuOpen)}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#E2E8F0' }}>{activeBusiness}</span>
              <Icons.ChevronDown />
              
              <div className={`dropdown-menu ${isBusinessMenuOpen ? 'open' : ''}`}>
                {businesses.map((biz) => (
                  <div key={biz} className="dropdown-item" onClick={(e) => { e.stopPropagation(); setActiveBusiness(biz); setIsBusinessMenuOpen(false); }}>
                    {biz}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid #334155' }}>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mukhtar" alt="Profile" style={{ width: '100%', height: '100%' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#F8FAFC' }}>Mukhtar Abdulwaheed</span>
                <span style={{ fontSize: '12px', color: '#94A3B8' }}>{activeBusiness}</span>
              </div>
            </div>
          </header>

          {/* Scrollable Content Area */}
          <div className="content-area">
            
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#F8FAFC', margin: '0 0 8px 0' }}>
                <span style={{ color: '#BE185D' }}>Welcome Back,</span> Mukhtar! 🚀
              </h1>
              <p style={{ color: '#94A3B8', margin: 0, fontSize: '15px' }}>Here's a Quick Overview of Your Account:</p>
            </div>

            {/* Metrics */}
            <div className="metric-grid">
              <div className="metric-card card-bal">
                <h3>Account Balance</h3>
                <div className="value">₦1,500,450.00</div>
              </div>
              <div className="metric-card card-cus">
                <h3>Total Customers</h3>
                <div className="value">1,204</div>
              </div>
              <div className="metric-card card-txn">
                <h3>Total Transactions</h3>
                <div className="value">8,432</div>
              </div>
              <div className="metric-card card-wth">
                <h3>Total Withdrawals</h3>
                <div className="value">₦540,000.00</div>
              </div>
            </div>

            {/* Overview Section */}
            <div className="overview-section">
              <div className="filter-row">
                <h2 style={{ fontSize: '16px', margin: 0, fontWeight: '600' }}>Overview</h2>
                <div className="time-filters">
                  <button className="filter-btn active">Today</button>
                  <button className="filter-btn">Yesterday</button>
                  <button className="filter-btn">Last 7 days</button>
                  <button className="filter-btn">Last 30 days</button>
                  <button className="filter-btn">All Time</button>
                </div>
              </div>

              <div className="stats-row">
                <div className="stat-box">
                  <h4>Total Revenue</h4>
                  <div style={{ color: '#BE185D' }}>₦125,000.00</div>
                </div>
                <div className="stat-box">
                  <h4>Total Transactions</h4>
                  <div style={{ color: '#10B981' }}>145</div>
                </div>
                <div className="stat-box">
                  <h4>Pending Settlement</h4>
                  <div style={{ color: '#F59E0B' }}>₦45,000.00</div>
                </div>
              </div>

              {/* CSS Bar Chart Simulation */}
              <div className="chart-area">
                {chartData.map((data, i) => (
                  <div key={i} className="chart-col">
                    <div className="bar-rev" style={{ height: data.rev }}></div>
                    <div className="bar-txn" style={{ height: data.txn }}></div>
                    <span style={{ position: 'absolute', bottom: '-25px', fontSize: '12px', color: '#64748B' }}>{data.day}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', fontSize: '12px', color: '#94A3B8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#BE185D' }}></div> Revenue</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div> Transactions</div>
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="table-card">
              <div className="table-header">
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#FFFFFF' }}>Recent Transactions</h3>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table className="txn-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Amount</th>
                      <th>Reference</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn, index) => (
                      <tr key={index}>
                        <td style={{ fontWeight: '500' }}>{txn.customer}</td>
                        <td style={{ fontWeight: '600', color: '#F8FAFC' }}>{txn.amount}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8' }}>
                            {txn.id} <span style={{ cursor: 'pointer' }}><Icons.Copy /></span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${
                            txn.status === 'Paid' ? 'status-paid' : 
                            txn.status === 'Pending' ? 'status-pending' : 'status-failed'
                          }`}>
                            {txn.status}
                          </span>
                        </td>
                        <td style={{ color: '#94A3B8', fontSize: '13px' }}>{txn.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
