'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // States
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Business States
  const [businesses, setBusinesses] = useState([
    { id: 1, name: 'Quadrox Tech', isActive: true },
    { id: 2, name: 'Haramain Stream', isActive: false },
    { id: 3, name: 'GoliveNG', isActive: false },
  ]);

  // Handle Theme Initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('paypaxa-theme') || 'light';
    setTheme(savedTheme as 'light' | 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('paypaxa-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleSwitchBusiness = (id: number) => {
    setBusinesses(businesses.map(b => ({ ...b, isActive: b.id === id })));
  };

  const activeBusiness = businesses.find(b => b.isActive)?.name || 'Select Business';

  // SVG Icons (Emulating the soft, clean style)
  const Icons = {
    Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    Wallet: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>,
    Transactions: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
    Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    Bank: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 22 7 12 2"></polygon><line x1="2" y1="22" x2="22" y2="22"></line><line x1="6" y1="18" x2="6" y2="11"></line><line x1="10" y1="18" x2="10" y2="11"></line><line x1="14" y1="18" x2="14" y2="11"></line><line x1="18" y1="18" x2="18" y2="11"></line></svg>,
    Transfer: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"></path><path d="M9 22V12h6v10M2 10.6L12 2l10 8.6"></path></svg>,
    Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51z"></path></svg>,
    Webhooks: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    Api: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
    Support: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
    Doc: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    Moon: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
    Sun: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>,
    Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    Menu: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
    Power: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* --- GLOBAL THEME ENGINE --- */
        :root {
          --bg-body: #F8FAFC;
          --bg-sidebar: #FFFFFF;
          --bg-card: #FFFFFF;
          --bg-header: #FFFFFF;
          --text-primary: #0F172A;
          --text-secondary: #64748B;
          --border-color: #E2E8F0;
          --nav-hover: #F1F5F9;
          --nav-active-bg: rgba(217, 19, 97, 0.1);
          --nav-active-text: #D91361;
          --primary-brand: #D91361; /* PAYPAXA Primary */
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
          --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.05);
          --shadow-modal: 0 20px 25px -5px rgba(0,0,0,0.1);
        }

        [data-theme="dark"] {
          --bg-body: #060B19;
          --bg-sidebar: #0A1128;
          --bg-card: #0E1629;
          --bg-header: #0A1128;
          --text-primary: #F8FAFC;
          --text-secondary: #94A3B8;
          --border-color: #1E293B;
          --nav-hover: #1E293B;
          --nav-active-bg: rgba(217, 19, 97, 0.15);
          --nav-active-text: #F43F5E;
          --primary-brand: #E11D48;
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
          --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.4);
          --shadow-modal: 0 25px 50px -12px rgba(0,0,0,0.5);
        }

        /* --- LAYOUT RESET --- */
        html, body { margin: 0; padding: 0; background-color: var(--bg-body); font-family: 'system-ui', -apple-system, sans-serif; color: var(--text-primary); transition: background-color 0.3s, color 0.3s; }
        * { box-sizing: border-box; }
        
        .layout-container { display: flex; height: 100vh; overflow: hidden; }

        /* --- SIDEBAR --- */
        .sidebar { width: 260px; background-color: var(--bg-sidebar); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; transition: 0.3s; z-index: 40; }
        .sidebar-header { height: 72px; padding: 0 24px; display: flex; align-items: center; border-bottom: 1px solid var(--border-color); flex-shrink: 0; }
        .sidebar-scroll { flex: 1; overflow-y: auto; padding: 24px 0; }
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background-color: var(--border-color); border-radius: 4px; }
        
        .nav-section { margin-bottom: 24px; }
        .nav-title { font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; padding: 0 24px; margin-bottom: 12px; }
        .nav-link { display: flex; align-items: center; gap: 14px; padding: 12px 24px; color: var(--text-secondary); text-decoration: none; font-size: 15px; font-weight: 500; transition: 0.2s; border-left: 3px solid transparent; }
        .nav-link:hover { background-color: var(--nav-hover); color: var(--text-primary); }
        .nav-link.active { background-color: var(--nav-active-bg); color: var(--nav-active-text); border-left-color: var(--primary-brand); }
        .badge-new { background-color: #F43F5E; color: white; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 12px; margin-left: auto; }

        /* Sidebar Profile Footer */
        .sidebar-footer { padding: 20px 24px; border-top: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; background-color: rgba(217, 19, 97, 0.03); margin: 0 16px 16px 16px; border-radius: 12px; border: 1px solid var(--nav-active-bg); }
        .profile-info { display: flex; align-items: center; gap: 12px; }
        .avatar { width: 36px; height: 36px; border-radius: 50%; background-color: var(--border-color); overflow: hidden; }
        
        /* --- MAIN CONTENT & HEADER --- */
        .main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; background-color: var(--bg-body); }
        .top-header { height: 72px; background-color: var(--bg-header); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; flex-shrink: 0; }
        
        /* Switch Business Button */
        .switch-btn { display: flex; align-items: center; gap: 12px; padding: 10px 16px; background-color: transparent; border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-size: 14px; font-weight: 500; cursor: pointer; transition: 0.2s; }
        .switch-btn:hover { border-color: var(--text-secondary); }
        
        /* Header Actions */
        .header-actions { display: flex; align-items: center; gap: 20px; }
        .icon-btn { background: none; border: none; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 8px; border-radius: 50%; transition: 0.2s; }
        .icon-btn:hover { background-color: var(--nav-hover); color: var(--text-primary); }

        /* --- MODAL (SWITCH BUSINESS) --- */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: 0.3s; }
        .modal-overlay.open { opacity: 1; pointer-events: auto; }
        .modal-content { background-color: var(--bg-card); width: 100%; max-width: 400px; border-radius: 20px; box-shadow: var(--shadow-modal); overflow: hidden; transform: translateY(20px); transition: 0.3s; border: 1px solid var(--border-color); }
        .modal-overlay.open .modal-content { transform: translateY(0); }
        .modal-header { padding: 24px; text-align: center; border-bottom: 1px solid var(--border-color); }
        .modal-title { margin: 0; font-size: 18px; font-weight: 700; color: var(--primary-brand); }
        .modal-body { padding: 16px 24px; }
        
        /* Custom Toggle Switch inside Modal */
        .biz-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--border-color); }
        .biz-row:last-child { border-bottom: none; }
        .biz-name { font-size: 15px; font-weight: 600; color: var(--text-primary); }
        
        .toggle-switch { position: relative; width: 44px; height: 24px; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--border-color); transition: .3s; border-radius: 24px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        input:checked + .slider { background-color: var(--primary-brand); }
        input:checked + .slider:before { transform: translateX(20px); }

        .modal-footer { padding: 24px; display: flex; flex-direction: column; gap: 12px; }
        .btn-primary { width: 100%; padding: 14px; background-color: var(--primary-brand); color: white; border: none; border-radius: 999px; font-weight: 600; font-size: 15px; cursor: pointer; transition: 0.2s; }
        .btn-primary:hover { opacity: 0.9; }
        .btn-outline { width: 100%; padding: 14px; background-color: transparent; color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 999px; font-weight: 600; font-size: 15px; cursor: pointer; transition: 0.2s; }
        .btn-outline:hover { background-color: var(--nav-hover); }

        /* Main Scroll Area */
        .main-scroll { flex: 1; overflow-y: auto; }

        @media (max-width: 1024px) {
          .sidebar { position: fixed; transform: translateX(-100%); height: 100%; }
          .sidebar.open { transform: translateX(0); box-shadow: 10px 0 20px rgba(0,0,0,0.1); }
          .menu-toggle { display: flex; }
        }
        @media (min-width: 1025px) {
          .menu-toggle { display: none; }
        }
      `}} />

      <div className="layout-container">
        
        {/* --- 1. SIDEBAR --- */}
        <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <img src="https://paypaxa.com/logo.png" alt="PAYPAXA" style={{ height: '32px', width: 'auto', marginRight: '10px' }} />
            <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '0.5px' }}>PAYPAXA</span>
          </div>

          <div className="sidebar-scroll">
            <div className="nav-section">
              <div className="nav-title">Dashboard</div>
              <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Icons.Home /> Overview
              </Link>
              <Link href="/dashboard/wallet" className={`nav-link ${pathname === '/dashboard/wallet' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Icons.Wallet /> Wallet
              </Link>
            </div>

            <div className="nav-section">
              <div className="nav-title">Collections</div>
              <Link href="/dashboard/transactions" className={`nav-link ${pathname === '/dashboard/transactions' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Icons.Transactions /> Transactions
              </Link>
              <Link href="/dashboard/customers" className={`nav-link ${pathname === '/dashboard/customers' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Icons.Users /> Customers
              </Link>
              <Link href="/dashboard/reserved-account" className={`nav-link ${pathname === '/dashboard/reserved-account' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Icons.Bank /> Reserved Account
              </Link>
            </div>

            <div className="nav-section">
              <div className="nav-title">Disbursements</div>
              <Link href="/dashboard/transfer" className={`nav-link ${pathname === '/dashboard/transfer' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Icons.Transfer /> Transfer
              </Link>
            </div>

            <div className="nav-section">
              <div className="nav-title">Merchant</div>
              <Link href="/dashboard/settings" className={`nav-link ${pathname === '/dashboard/settings' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Icons.Settings /> Settings
              </Link>
              <Link href="/dashboard/webhooks" className={`nav-link ${pathname === '/dashboard/webhooks' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Icons.Webhooks /> Webhook Event <span className="badge-new">New</span>
              </Link>
              <Link href="/dashboard/api" className={`nav-link ${pathname === '/dashboard/api' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Icons.Api /> Developer API
              </Link>
              <Link href="/dashboard/support" className={`nav-link ${pathname === '/dashboard/support' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Icons.Support /> Support
              </Link>
              <Link href="/dashboard/docs" className={`nav-link ${pathname === '/dashboard/docs' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <Icons.Doc /> Documentation
              </Link>
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="profile-info">
              <div className="avatar">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mukhtar" alt="Avatar" width="100%" height="100%" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>Mukhtar Abdulwaheed</span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{activeBusiness}</span>
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Log out">
              <Icons.Power />
            </button>
          </div>
        </aside>

        {/* --- 2. MAIN CONTENT AREA --- */}
        <div className="main-wrapper">
          
          <header className="top-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button className="icon-btn menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Icons.Menu />
              </button>
              
              <button className="switch-btn" onClick={() => setIsBusinessModalOpen(true)}>
                <span>Switch Business</span>
                <Icons.ChevronDown />
              </button>
            </div>

            <div className="header-actions">
              {/* Theme Toggle */}
              <button className="icon-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
                {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
              </button>
              
              {/* Notifications */}
              <button className="icon-btn">
                <Icons.Bell />
              </button>
            </div>
          </header>

          <main className="main-scroll">
            {children}
          </main>
        </div>

        {/* --- 3. SWITCH BUSINESS MODAL --- */}
        <div className={`modal-overlay ${isBusinessModalOpen ? 'open' : ''}`} onClick={() => setIsBusinessModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Select a Business</h3>
            </div>
            
            <div className="modal-body">
              {businesses.map((biz) => (
                <div className="biz-row" key={biz.id}>
                  <span className="biz-name">{biz.name}</span>
                  <label className="toggle-switch">
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

            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setIsBusinessModalOpen(false)}>
                Confirm Selection
              </button>
              <button className="btn-outline" onClick={() => { /* Logic to route to add business */ }}>
                + Add New Business
              </button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
