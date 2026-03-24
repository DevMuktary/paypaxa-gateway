'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  
  const [businesses, setBusinesses] = useState([
    { id: 1, name: 'Quadrox Tech', role: 'Owner', isActive: true },
    { id: 2, name: 'Smart9ja', role: 'Admin', isActive: false },
    { id: 3, name: 'FYNAX TECHNOLOGY', role: 'Developer', isActive: false },
  ]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('paypaxa-theme') || 'dark';
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

  // Expanded Premium Icon Set
  const Icons = {
    Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>,
    Wallet: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>,
    Transactions: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
    Link: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>,
    Invoice: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    Repeat: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>,
    Bank: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>,
    Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>,
    Alert: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
    Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
    Briefcase: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
    Chart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
    Api: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
    Team: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51z"></path></svg>,
    LifeBuoy: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>,
    BookOpen: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>,
    ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    Moon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
    Sun: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line></svg>,
    Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
  };

  return (
    <div className="dashboard-shell">
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --bg-main: #FAFAFA;
          --bg-panel: #FFFFFF;
          --border-color: #E5E7EB;
          --text-high: #111827;
          --text-med: #6B7280;
          --text-low: #9CA3AF;
          --brand-primary: #3B82F6;
          --nav-hover: #F3F4F6;
          --nav-active: #EFF6FF;
          --glass-bg: rgba(255, 255, 255, 0.8);
          --shadow-modal: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }

        [data-theme="dark"] {
          --bg-main: #030712;
          --bg-panel: #0B1121;
          --border-color: rgba(255, 255, 255, 0.06);
          --text-high: #F9FAFB;
          --text-med: #9CA3AF;
          --text-low: #4B5563;
          --brand-primary: #3B82F6;
          --nav-hover: rgba(255, 255, 255, 0.03);
          --nav-active: rgba(59, 130, 246, 0.1);
          --glass-bg: rgba(11, 17, 33, 0.8);
          --shadow-modal: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        html, body { margin: 0; padding: 0; background-color: var(--bg-main); font-family: 'Inter', system-ui, sans-serif; color: var(--text-high); transition: background-color 0.3s; }
        * { box-sizing: border-box; }
        
        .dashboard-shell { display: flex; height: 100vh; overflow: hidden; }

        /* SIDEBAR */
        .sidebar { width: 270px; background-color: var(--bg-panel); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; z-index: 40; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .brand-zone { height: 76px; padding: 0 28px; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .sidebar-content { flex: 1; overflow-y: auto; padding: 24px 20px; display: flex; flex-direction: column; gap: 32px; }
        .sidebar-content::-webkit-scrollbar { width: 0px; }
        
        .nav-group { display: flex; flex-direction: column; gap: 4px; }
        .nav-title { font-size: 11px; font-weight: 700; color: var(--text-low); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; padding-left: 12px; }
        
        .nav-link { display: flex; align-items: center; gap: 14px; padding: 10px 12px; color: var(--text-med); text-decoration: none; font-size: 14px; font-weight: 500; border-radius: 8px; transition: all 0.2s ease; position: relative; }
        .nav-link:hover { background-color: var(--nav-hover); color: var(--text-high); }
        .nav-link.active { background-color: var(--nav-active); color: var(--brand-primary); font-weight: 600; }
        .nav-link.active::before { content: ''; position: absolute; left: -20px; top: 50%; transform: translateY(-50%); height: 20px; width: 4px; background: var(--brand-primary); border-radius: 0 4px 4px 0; box-shadow: 0 0 10px var(--brand-primary); }

        /* TOP BAR */
        .main-stage { flex: 1; display: flex; flex-direction: column; min-width: 0; background-color: var(--bg-main); }
        .topbar { height: 76px; background-color: var(--glass-bg); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; padding: 0 36px; z-index: 30; }
        
        .biz-switcher { display: flex; align-items: center; gap: 12px; padding: 8px 16px; border-radius: 12px; cursor: pointer; transition: 0.2s; border: 1px solid var(--border-color); background: var(--bg-panel); }
        .biz-switcher:hover { border-color: var(--text-low); }
        
        .topbar-actions { display: flex; align-items: center; gap: 20px; }
        .action-icon { background: none; border: none; color: var(--text-med); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        .action-icon:hover { background-color: var(--nav-hover); color: var(--text-high); }
        
        .user-avatar { width: 36px; height: 36px; border-radius: 10px; background-color: var(--border-color); overflow: hidden; border: 1px solid var(--border-color); cursor: pointer; }

        /* MODAL */
        .modal-veil { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: 0.3s; }
        .modal-veil.open { opacity: 1; pointer-events: auto; }
        .modal-box { background: var(--bg-panel); width: 100%; max-width: 440px; border-radius: 24px; box-shadow: var(--shadow-modal); border: 1px solid var(--border-color); transform: translateY(20px) scale(0.95); transition: 0.3s; overflow: hidden; }
        .modal-veil.open .modal-box { transform: translateY(0) scale(1); }
        
        .modal-head { padding: 24px 32px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
        .modal-head h3 { font-size: 18px; font-weight: 700; margin: 0; color: var(--text-high); }
        
        .biz-list { padding: 12px 16px; }
        .biz-row { padding: 16px; display: flex; align-items: center; justify-content: space-between; border-radius: 12px; cursor: pointer; transition: 0.2s; border: 1px solid transparent; }
        .biz-row:hover { background-color: var(--nav-hover); }
        .biz-row.active { background-color: var(--nav-active); border-color: rgba(59, 130, 246, 0.2); }
        
        .toggle-track { position: relative; width: 44px; height: 24px; background: var(--border-color); border-radius: 24px; transition: 0.3s; cursor: pointer; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); }
        .toggle-track.on { background: var(--brand-primary); }
        .toggle-thumb { position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: #FFF; border-radius: 50%; transition: 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .toggle-track.on .toggle-thumb { transform: translateX(20px); }

        .modal-foot { padding: 24px 32px; border-top: 1px solid var(--border-color); background: rgba(0,0,0,0.02); }
        .btn-add { width: 100%; padding: 14px; background: var(--brand-primary); color: white; border: none; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; transition: 0.2s; }
        .btn-add:hover { transform: translateY(-2px); }

        .page-scroll { flex: 1; overflow-y: auto; position: relative; }
      `}} />

      <aside className="sidebar">
        <div className="brand-zone">
          <img src="https://paypaxa.com/logo.png" alt="PAYPAXA" style={{ height: '32px', width: 'auto' }} />
          <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-high)', letterSpacing: '-0.5px' }}>PAYPAXA</span>
        </div>

        <div className="sidebar-content">
          <div className="nav-group">
            <div className="nav-title">Dashboard</div>
            <Link href="/dashboard" className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}><Icons.Home /> Overview</Link>
            <Link href="/dashboard/wallet" className={`nav-link ${pathname === '/dashboard/wallet' ? 'active' : ''}`}><Icons.Wallet /> Wallet & Payouts</Link>
          </div>

          <div className="nav-group">
            <div className="nav-title">Collections</div>
            <Link href="/dashboard/transactions" className={`nav-link ${pathname === '/dashboard/transactions' ? 'active' : ''}`}><Icons.Transactions /> Transactions</Link>
            <Link href="/dashboard/links" className={`nav-link ${pathname === '/dashboard/links' ? 'active' : ''}`}><Icons.Link /> Payment Links</Link>
            <Link href="/dashboard/invoices" className={`nav-link ${pathname === '/dashboard/invoices' ? 'active' : ''}`}><Icons.Invoice /> Invoices</Link>
            <Link href="/dashboard/subscriptions" className={`nav-link ${pathname === '/dashboard/subscriptions' ? 'active' : ''}`}><Icons.Repeat /> Subscriptions</Link>
            <Link href="/dashboard/accounts" className={`nav-link ${pathname === '/dashboard/accounts' ? 'active' : ''}`}><Icons.Bank /> Virtual Accounts</Link>
            <Link href="/dashboard/customers" className={`nav-link ${pathname === '/dashboard/customers' ? 'active' : ''}`}><Icons.Users /> Customers</Link>
            <Link href="/dashboard/disputes" className={`nav-link ${pathname === '/dashboard/disputes' ? 'active' : ''}`}><Icons.Alert /> Disputes & Refunds</Link>
          </div>

          <div className="nav-group">
            <div className="nav-title">Disbursements</div>
            <Link href="/dashboard/transfers" className={`nav-link ${pathname === '/dashboard/transfers' ? 'active' : ''}`}><Icons.Send /> Transfers</Link>
            <Link href="/dashboard/beneficiaries" className={`nav-link ${pathname === '/dashboard/beneficiaries' ? 'active' : ''}`}><Icons.Users /> Beneficiaries</Link>
          </div>

          <div className="nav-group">
            <div className="nav-title">Reports & Analytics</div>
            <Link href="/dashboard/settlements" className={`nav-link ${pathname === '/dashboard/settlements' ? 'active' : ''}`}><Icons.Briefcase /> Settlements</Link>
            <Link href="/dashboard/statements" className={`nav-link ${pathname === '/dashboard/statements' ? 'active' : ''}`}><Icons.Chart /> Account Statements</Link>
          </div>

          <div className="nav-group">
            <div className="nav-title">Developers & Settings</div>
            <Link href="/dashboard/api" className={`nav-link ${pathname === '/dashboard/api' ? 'active' : ''}`}><Icons.Api /> API & Webhooks</Link>
            <Link href="/dashboard/team" className={`nav-link ${pathname === '/dashboard/team' ? 'active' : ''}`}><Icons.Team /> Team & Roles</Link>
            <Link href="/dashboard/settings" className={`nav-link ${pathname === '/dashboard/settings' ? 'active' : ''}`}><Icons.Settings /> Settings</Link>
          </div>
          
          <div className="nav-group">
             <div className="nav-title">Help</div>
             <Link href="/dashboard/support" className={`nav-link ${pathname === '/dashboard/support' ? 'active' : ''}`}><Icons.LifeBuoy /> Support</Link>
             <Link href="/dashboard/docs" className={`nav-link ${pathname === '/dashboard/docs' ? 'active' : ''}`}><Icons.BookOpen /> Documentation</Link>
          </div>
        </div>
      </aside>

      <div className="main-stage">
        <header className="topbar">
          <div className="biz-switcher" onClick={() => setIsBusinessModalOpen(true)}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-high)' }}>{activeBusiness?.name}</span>
            </div>
            <Icons.ChevronDown />
          </div>

          <div className="topbar-actions">
            <button className="action-icon" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
            </button>
            <button className="action-icon">
              <Icons.Bell />
            </button>
            <div className="user-avatar">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mukhtar" alt="Profile" width="100%" height="100%" />
            </div>
          </div>
        </header>

        <main className="page-scroll">
          {children}
        </main>
      </div>

      <div className={`modal-veil ${isBusinessModalOpen ? 'open' : ''}`} onClick={() => setIsBusinessModalOpen(false)}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="modal-head">
            <h3>Select a Business</h3>
            <button style={{ background: 'none', border: 'none', fontSize: '20px', color: 'var(--text-med)', cursor: 'pointer' }} onClick={() => setIsBusinessModalOpen(false)}>✕</button>
          </div>
          
          <div className="biz-list">
            {businesses.map((biz) => (
              <div key={biz.id} className={`biz-row ${biz.isActive ? 'active' : ''}`} onClick={() => handleSwitchBusiness(biz.id)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: biz.isActive ? 'var(--brand-primary)' : 'var(--text-high)' }}>{biz.name}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-med)' }}>{biz.role}</span>
                </div>
                <div className={`toggle-track ${biz.isActive ? 'on' : ''}`}>
                  <div className="toggle-thumb"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="modal-foot">
            <button className="btn-add">+ Add New Business</button>
          </div>
        </div>
      </div>

    </div>
  );
}
