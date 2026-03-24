'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [businesses, setBusinesses] = useState([
    { id: 1, name: 'Quadrox Tech', role: 'Owner', isActive: true },
    { id: 2, name: 'Haramain Stream', role: 'Admin', isActive: false },
    { id: 3, name: 'GoliveNG', role: 'Developer', isActive: false },
  ]);

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
    setIsBusinessModalOpen(false);
  };

  const activeBusiness = businesses.find(b => b.isActive);

  // Sleek, minimal icons
  const Icons = {
    Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    Wallet: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>,
    Activity: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>,
    Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    Bank: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
    Transfer: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"></path></svg>,
    Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51z"></path></svg>,
    Api: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
    Utility: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
    ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    Moon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
    Sun: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line></svg>,
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --bg-body: #F8FAFC;
          --bg-surface: #FFFFFF;
          --border-color: #E2E8F0;
          --text-primary: #0F172A;
          --text-secondary: #64748B;
          --text-muted: #94A3B8;
          --nav-hover: #F1F5F9;
          --nav-active-bg: #EFF6FF;
          --nav-active-text: #2563EB;
          --accent-blue: #2563EB;
          --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
          --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        [data-theme="dark"] {
          --bg-body: #060B19;
          --bg-surface: #0B1120;
          --border-color: #1E293B;
          --text-primary: #F8FAFC;
          --text-secondary: #94A3B8;
          --text-muted: #475569;
          --nav-hover: #1E293B;
          --nav-active-bg: rgba(37, 99, 235, 0.1);
          --nav-active-text: #3B82F6;
          --accent-blue: #3B82F6;
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
          --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.4);
        }

        html, body { margin: 0; padding: 0; background-color: var(--bg-body); font-family: 'system-ui', -apple-system, sans-serif; color: var(--text-primary); transition: 0.2s; }
        * { box-sizing: border-box; }
        
        .layout-app { display: flex; height: 100vh; overflow: hidden; }

        /* --- MODERN SIDEBAR --- */
        .sidebar { width: 260px; background-color: var(--bg-surface); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; z-index: 40; transition: 0.2s; }
        .brand-header { height: 72px; padding: 0 24px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--border-color); }
        .sidebar-menu { flex: 1; overflow-y: auto; padding: 24px 16px; display: flex; flex-direction: column; gap: 24px; }
        
        .nav-group-title { font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; padding-left: 8px; }
        .nav-link { display: flex; align-items: center; gap: 12px; padding: 8px 12px; color: var(--text-secondary); text-decoration: none; font-size: 14px; font-weight: 500; border-radius: 8px; transition: 0.2s; margin-bottom: 4px; }
        .nav-link:hover { background-color: var(--nav-hover); color: var(--text-primary); }
        .nav-link.active { background-color: var(--nav-active-bg); color: var(--nav-active-text); font-weight: 600; }

        /* --- TOP HEADER & CONTEXT SWITCHER --- */
        .main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .topbar { height: 72px; background-color: var(--bg-surface); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; }
        
        .context-switcher { display: flex; align-items: center; gap: 12px; padding: 8px 12px; border-radius: 8px; cursor: pointer; transition: 0.2s; border: 1px solid transparent; }
        .context-switcher:hover { background-color: var(--nav-hover); border-color: var(--border-color); }
        .biz-avatar { width: 32px; height: 32px; border-radius: 6px; background-color: var(--accent-blue); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; }
        .biz-info { display: flex; flex-direction: column; }
        .biz-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }
        .biz-role { font-size: 12px; color: var(--text-secondary); }

        .top-actions { display: flex; align-items: center; gap: 16px; }
        .icon-btn { background: none; border: 1px solid var(--border-color); color: var(--text-secondary); width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        .icon-btn:hover { background-color: var(--nav-hover); color: var(--text-primary); }

        /* --- MODAL --- */
        .modal-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); z-index: 100; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: 0.2s; }
        .modal-bg.open { opacity: 1; pointer-events: auto; }
        .modal-card { background: var(--bg-surface); width: 100%; max-width: 420px; border-radius: 16px; box-shadow: var(--shadow-modal); border: 1px solid var(--border-color); transform: scale(0.95); transition: 0.2s; overflow: hidden; }
        .modal-bg.open .modal-card { transform: scale(1); }
        
        .modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
        .modal-title { font-size: 16px; font-weight: 600; margin: 0; }
        
        .modal-list { padding: 12px 0; max-height: 300px; overflow-y: auto; }
        .modal-biz-item { padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: 0.2s; }
        .modal-biz-item:hover { background-color: var(--nav-hover); }
        
        .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border-color); background-color: var(--nav-hover); }
        .add-biz-btn { width: 100%; padding: 12px; background: none; border: 1px dashed var(--text-muted); border-radius: 8px; color: var(--text-primary); font-weight: 500; font-size: 14px; cursor: pointer; transition: 0.2s; }
        .add-biz-btn:hover { border-color: var(--accent-blue); color: var(--accent-blue); background: var(--nav-active-bg); }

        .main-scroll { flex: 1; overflow-y: auto; }
      `}} />

      <div className="layout-app">
        
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="brand-header">
            <img src="https://paypaxa.com/logo.png" alt="PAYPAXA" style={{ height: '28px', width: 'auto' }} />
            <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '0.5px' }}>PAYPAXA</span>
          </div>

          <div className="sidebar-menu">
            <div>
              <div className="nav-group-title">Dashboard</div>
              <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}><Icons.Home /> Overview</Link>
              <Link href="/dashboard/wallet" className={`nav-link ${pathname === '/dashboard/wallet' ? 'active' : ''}`}><Icons.Wallet /> Balance & Payouts</Link>
            </div>

            <div>
              <div className="nav-group-title">Payments</div>
              <Link href="/dashboard/transactions" className={`nav-link ${pathname === '/dashboard/transactions' ? 'active' : ''}`}><Icons.Activity /> Transactions</Link>
              <Link href="/dashboard/customers" className={`nav-link ${pathname === '/dashboard/customers' ? 'active' : ''}`}><Icons.Users /> Customers</Link>
              <Link href="/dashboard/accounts" className={`nav-link ${pathname === '/dashboard/accounts' ? 'active' : ''}`}><Icons.Bank /> Virtual Accounts</Link>
            </div>

            <div>
              <div className="nav-group-title">Services</div>
              <Link href="/dashboard/transfers" className={`nav-link ${pathname === '/dashboard/transfers' ? 'active' : ''}`}><Icons.Transfer /> Transfers</Link>
              <Link href="/dashboard/vtu" className={`nav-link ${pathname === '/dashboard/vtu' ? 'active' : ''}`}><Icons.Utility /> Bills & VTU</Link>
              <Link href="/dashboard/identity" className={`nav-link ${pathname === '/dashboard/identity' ? 'active' : ''}`}><Icons.Api /> Identity (NIN/BVN)</Link>
            </div>

            <div>
              <div className="nav-group-title">Developers & Settings</div>
              <Link href="/dashboard/api" className={`nav-link ${pathname === '/dashboard/api' ? 'active' : ''}`}><Icons.Api /> API Keys & Webhooks</Link>
              <Link href="/dashboard/settings" className={`nav-link ${pathname === '/dashboard/settings' ? 'active' : ''}`}><Icons.Settings /> Settings</Link>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="main-wrapper">
          <header className="topbar">
            
            <div className="context-switcher" onClick={() => setIsBusinessModalOpen(true)}>
              <div className="biz-avatar">{activeBusiness?.name.charAt(0)}</div>
              <div className="biz-info">
                <span className="biz-name">{activeBusiness?.name}</span>
                <span className="biz-role">{activeBusiness?.role}</span>
              </div>
              <Icons.ChevronDown />
            </div>

            <div className="top-actions">
              <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
                {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
              </button>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--border-color)', overflow: 'hidden', cursor: 'pointer' }}>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mukhtar" alt="Avatar" width="100%" height="100%" />
              </div>
            </div>
          </header>

          <main className="main-scroll">
            {children}
          </main>
        </div>

        {/* BUSINESS SWITCHER MODAL */}
        <div className={`modal-bg ${isBusinessModalOpen ? 'open' : ''}`} onClick={() => setIsBusinessModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Switch Business</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setIsBusinessModalOpen(false)}>✕</button>
            </div>
            
            <div className="modal-list">
              {businesses.map((biz) => (
                <div key={biz.id} className="modal-biz-item" onClick={() => handleSwitchBusiness(biz.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="biz-avatar" style={{ width: '32px', height: '32px', fontSize: '14px' }}>{biz.name.charAt(0)}</div>
                    <div className="biz-info">
                      <span className="biz-name" style={{ color: biz.isActive ? 'var(--accent-blue)' : 'var(--text-primary)' }}>{biz.name}</span>
                      <span className="biz-role">{biz.role}</span>
                    </div>
                  </div>
                  {biz.isActive && <Icons.Check />}
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button className="add-biz-btn">+ Create New Business</button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
