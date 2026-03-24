'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Data for the Chart
  const chartData = [
    { day: 'Mon', amount: 45000, height: '40%' },
    { day: 'Tue', amount: 120000, height: '85%' },
    { day: 'Wed', amount: 85000, height: '60%' },
    { day: 'Thu', amount: 150000, height: '100%' },
    { day: 'Fri', amount: 95000, height: '70%' },
    { day: 'Sat', amount: 30000, height: '25%' },
    { day: 'Sun', amount: 55000, height: '45%' },
  ];

  // Mock Data for Transactions
  const transactions = [
    { id: 'TRX-982374', customer: 'john.doe@example.com', amount: '₦45,000.00', status: 'Successful', date: 'Today, 2:45 PM' },
    { id: 'TRX-982373', customer: 'sarah.smith@company.co', amount: '₦12,500.00', status: 'Successful', date: 'Today, 1:15 PM' },
    { id: 'TRX-982372', customer: 'mike.jones@startup.io', amount: '₦150,000.00', status: 'Pending', date: 'Today, 11:30 AM' },
    { id: 'TRX-982371', customer: 'emily.clark@store.ng', amount: '₦8,200.00', status: 'Failed', date: 'Yesterday, 4:20 PM' },
    { id: 'TRX-982370', customer: 'david.w@enterprise.com', amount: '₦340,000.00', status: 'Successful', date: 'Yesterday, 9:10 AM' },
  ];

  // SVG Icons
  const Icons = {
    Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    Activity: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
    Link: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>,
    Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        html, body { margin: 0; padding: 0; background-color: #060B19; font-family: system-ui, -apple-system, sans-serif; color: #F8FAFC; }
        * { box-sizing: border-box; }
        
        .dash-layout { display: flex; min-height: 100vh; }
        
        /* Sidebar Styles */
        .sidebar { width: 260px; background-color: #0A1128; border-right: 1px solid #1E293B; display: flex; flex-direction: column; flex-shrink: 0; }
        .sidebar-header { padding: 24px; border-bottom: 1px solid #1E293B; display: flex; align-items: center; gap: 12px; }
        .sidebar-nav { padding: 24px 16px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 8px; cursor: pointer; transition: all 0.2s; color: #94A3B8; font-weight: 500; font-size: 15px; text-decoration: none; }
        .nav-item:hover { background-color: #1E293B; color: #F8FAFC; }
        .nav-item.active { background-color: rgba(37, 99, 235, 0.1); color: #3B82F6; border: 1px solid rgba(37, 99, 235, 0.2); }
        
        /* Main Content Styles */
        .main-content { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .top-header { height: 73px; border-bottom: 1px solid #1E293B; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; background-color: #060B19; }
        .content-area { padding: 32px; overflow-y: auto; flex: 1; }
        
        /* Cards & UI Elements */
        .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .metric-card { background-color: #0E1629; border: 1px solid #1A2642; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        
        .section-card { background-color: #0E1629; border: 1px solid #1A2642; border-radius: 12px; padding: 24px; margin-bottom: 32px; }
        
        .paypaxa-btn { background-color: #2563EB; color: #FFFFFF; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 14px; }
        .paypaxa-btn:hover { background-color: #1D4ED8; }
        
        /* Table Styles */
        .txn-table { width: 100%; border-collapse: collapse; text-align: left; }
        .txn-table th { padding: 16px; border-bottom: 1px solid #1E293B; color: #64748B; font-weight: 500; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
        .txn-table td { padding: 16px; border-bottom: 1px solid #1A2642; color: #E2E8F0; font-size: 14px; }
        .status-badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
        .status-success { background-color: rgba(34, 197, 94, 0.1); color: #4ADE80; border: 1px solid rgba(34, 197, 94, 0.2); }
        .status-pending { background-color: rgba(245, 158, 11, 0.1); color: #FBBF24; border: 1px solid rgba(245, 158, 11, 0.2); }
        .status-failed { background-color: rgba(239, 68, 68, 0.1); color: #F87171; border: 1px solid rgba(239, 68, 68, 0.2); }

        /* Chart Styles */
        .chart-container { height: 250px; display: flex; align-items: flex-end; gap: 12px; padding-top: 20px; }
        .bar-wrapper { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; height: 100%; justify-content: flex-end; }
        .chart-bar { width: 100%; max-width: 40px; background: linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%); border-radius: 4px 4px 0 0; transition: height 1s ease; position: relative; }
        .chart-bar:hover { background: linear-gradient(180deg, #60A5FA 0%, #2563EB 100%); cursor: pointer; }
        .chart-label { color: #64748B; font-size: 13px; font-weight: 500; }

        @media (max-width: 1024px) {
          .sidebar { width: 80px; }
          .sidebar-header span, .nav-item span { display: none; }
          .sidebar-header { justify-content: center; padding: 24px 0; }
          .nav-item { justify-content: center; padding: 16px; }
        }
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .top-header { padding: 0 16px; }
          .content-area { padding: 16px; }
          .metric-grid { grid-template-columns: 1fr; }
        }
      `}} />

      <div className="dash-layout">
        
        {/* --- SIDEBAR --- */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <img src="https://paypaxa.com/logo.png" alt="PAYPAXA" style={{ height: '28px', width: 'auto' }} />
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '1px' }}>PAYPAXA</span>
          </div>
          
          <nav className="sidebar-nav">
            <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <Icons.Home /> <span>Overview</span>
            </div>
            <div className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
              <Icons.Activity /> <span>Transactions</span>
            </div>
            <div className={`nav-item ${activeTab === 'links' ? 'active' : ''}`} onClick={() => setActiveTab('links')}>
              <Icons.Link /> <span>Payment Links</span>
            </div>
            <div className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
              <Icons.Users /> <span>Customers</span>
            </div>
            
            <div style={{ marginTop: 'auto' }}>
              <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                <Icons.Settings /> <span>Settings</span>
              </div>
            </div>
          </nav>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="main-content">
          
          {/* Top Header */}
          <header className="top-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {/* Test Mode Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '6px 12px', borderRadius: '999px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></div>
                <span style={{ color: '#FBBF24', fontSize: '12px', fontWeight: '600' }}>Test Mode</span>
              </div>
              
              <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}>
                <Icons.Bell />
              </button>

              {/* Profile Avatar */}
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 'bold', border: '1px solid #334155', cursor: 'pointer' }}>
                MA
              </div>
            </div>
          </header>

          {/* Scrollable Content Area */}
          <div className="content-area">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <p style={{ color: '#94A3B8', margin: 0, fontSize: '15px' }}>Here is what's happening with your business today.</p>
              <button className="paypaxa-btn">+ Accept Payment</button>
            </div>

            {/* Metrics */}
            <div className="metric-grid">
              <div className="metric-card">
                <h3 style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '500', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Available Balance</h3>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '20px', color: '#64748B', fontWeight: '500' }}>NGN</span> 0.00
                </div>
              </div>

              <div className="metric-card">
                <h3 style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '500', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ledger Balance</h3>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '20px', color: '#64748B', fontWeight: '500' }}>NGN</span> 0.00
                </div>
              </div>

              <div className="metric-card">
                <h3 style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '500', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Today's Volume</h3>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF' }}>
                  0 <span style={{ fontSize: '14px', color: '#64748B', fontWeight: '500', marginLeft: '4px' }}>Transactions</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Chart & Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
              
              {/* CSS Graph */}
              <div className="section-card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#FFFFFF' }}>Transaction Volume (Past 7 Days)</h3>
                  <select style={{ background: '#060B19', border: '1px solid #1E293B', color: '#94A3B8', padding: '6px 12px', borderRadius: '6px', outline: 'none' }}>
                    <option>Last 7 Days</option>
                    <option>This Month</option>
                  </select>
                </div>
                
                <div className="chart-container">
                  {chartData.map((data, i) => (
                    <div key={i} className="bar-wrapper">
                      <div className="chart-bar" style={{ height: data.height }} title={`₦${data.amount.toLocaleString()}`}></div>
                      <span className="chart-label">{data.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="section-card" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#FFFFFF' }}>Quick Actions</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  <button style={{ width: '100%', padding: '16px', background: '#060B19', border: '1px solid #1E293B', borderRadius: '8px', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: '0.2s' }}>
                    <div style={{ background: 'rgba(37, 99, 235, 0.1)', padding: '8px', borderRadius: '6px', color: '#3B82F6' }}><Icons.Link /></div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>Create Payment Link</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Share a link to get paid</div>
                    </div>
                  </button>

                  <button style={{ width: '100%', padding: '16px', background: '#060B19', border: '1px solid #1E293B', borderRadius: '8px', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: '0.2s' }}>
                    <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '8px', borderRadius: '6px', color: '#4ADE80' }}><Icons.Users /></div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>Add Customer</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Save customer details</div>
                    </div>
                  </button>
                </div>
              </div>

            </div>

            {/* Recent Transactions Table */}
            <div className="section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#FFFFFF' }}>Recent Transactions</h3>
                <button style={{ background: 'none', border: 'none', color: '#3B82F6', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>View All</button>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table className="txn-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn, index) => (
                      <tr key={index}>
                        <td style={{ fontWeight: '500', color: '#FFFFFF' }}>{txn.id}</td>
                        <td>{txn.customer}</td>
                        <td style={{ fontWeight: '600' }}>{txn.amount}</td>
                        <td>
                          <span className={`status-badge ${
                            txn.status === 'Successful' ? 'status-success' : 
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
