'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ComplianceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { id: 1, name: 'Profile', path: '/dashboard/compliance/profile' },
    { id: 2, name: 'Contact', path: '/dashboard/compliance/contact' },
    { id: 3, name: 'Account', path: '/dashboard/compliance/account' },
    { id: 4, name: 'Owners', path: '/dashboard/compliance/owners' },
    { id: 5, name: 'Documents', path: '/dashboard/compliance/documents' },
    { id: 6, name: 'Service Agreement', path: '/dashboard/compliance/agreement' },
  ];

  // Determine current step index based on the URL
  const currentStepIndex = navItems.findIndex(item => pathname?.includes(item.path));
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* LIGHT MODE VARIABLES */
        :root {
          --brand-primary: #1A56DB; 
          --bg-overlay: rgba(0, 0, 0, 0.03);
          --border-light: rgba(0, 0, 0, 0.1);
          --dropdown-bg: #FFFFFF;
          --dropdown-text: #111827;
          --success-bg: #D1FAE5;
          --success-text: #065F46;
          --progress-bg: #DBEAFE;
          --progress-text: #1E40AF;
        }

        /* INSTANT DARK MODE INHERITANCE (Catches OS, .dark class, and data-theme) */
        @media (prefers-color-scheme: dark) {
          :root { --brand-primary: #3B82F6; --bg-overlay: rgba(255, 255, 255, 0.05); --border-light: rgba(255, 255, 255, 0.1); --dropdown-bg: #0F172A; --dropdown-text: #F9FAFB; --success-bg: rgba(16, 185, 129, 0.15); --success-text: #34D399; --progress-bg: rgba(59, 130, 246, 0.15); --progress-text: #60A5FA; }
        }
        html.dark, body.dark, [data-theme="dark"] {
          --brand-primary: #3B82F6 !important; 
          --bg-overlay: rgba(255, 255, 255, 0.05) !important; 
          --border-light: rgba(255, 255, 255, 0.1) !important; 
          --dropdown-bg: #0F172A !important; 
          --dropdown-text: #F9FAFB !important; 
          --success-bg: rgba(16, 185, 129, 0.15) !important; 
          --success-text: #34D399 !important; 
          --progress-bg: rgba(59, 130, 246, 0.15) !important; 
          --progress-text: #60A5FA !important; 
        }

        /* WRAPPER SET TO TRANSPARENT TO INHERIT GLOBAL APP BACKGROUND INSTANTLY */
        .compliance-wrapper { display: flex; align-items: flex-start; gap: 24px; max-width: 1000px; margin: 0 auto; padding: 24px 16px; font-family: inherit; background: transparent; }
        
        .compliance-sidebar { width: 280px; flex-shrink: 0; position: sticky; top: 24px; background: transparent; }
        .sidebar-title { font-size: 13px; font-weight: 800; opacity: 0.6; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; padding-left: 12px; }
        
        .nav-item { display: flex; flex-direction: column; padding: 12px; border-radius: 8px; color: inherit; text-decoration: none; margin-bottom: 4px; transition: 0.2s; border: 1px solid transparent; }
        .nav-item:hover { background-color: var(--bg-overlay); }
        .nav-item.active { background-color: var(--bg-overlay); border-color: var(--border-light); }
        
        .nav-name { font-weight: 600; font-size: 14px; margin-bottom: 6px; }
        
        /* STATUS BADGES */
        .status-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: fit-content; }
        .badge-completed { background-color: var(--success-bg); color: var(--success-text); }
        .badge-progress { background-color: var(--progress-bg); color: var(--progress-text); }
        .badge-waiting { background-color: var(--bg-overlay); opacity: 0.7; }

        .compliance-main { flex: 1; width: 100%; background-color: transparent; border: 1px solid var(--border-light); border-radius: 12px; padding: 32px; }

        /* FORM STYLES */
        .page-title { font-size: 20px; font-weight: 700; margin: 0 0 24px 0; padding-bottom: 16px; border-bottom: 1px solid var(--border-light); color: inherit; }
        .input-group { margin-bottom: 20px; }
        .input-label { font-size: 13px; font-weight: 600; opacity: 0.9; margin: 0; color: inherit; }
        
        .input-field, .input-select, .input-textarea { width: 100%; padding: 12px 16px; background-color: var(--bg-overlay); border: 1px solid var(--border-light); border-radius: 8px; color: inherit; font-size: 14px; outline: none; transition: 0.2s; font-family: inherit; }
        .input-field:focus, .input-select:focus, .input-textarea:focus { border-color: var(--brand-primary); background-color: transparent; }
        
        option { background-color: var(--dropdown-bg); color: var(--dropdown-text); }
        
        .input-textarea { resize: vertical; min-height: 100px; }
        .help-text { font-size: 12px; opacity: 0.6; margin-top: 6px; display: block; line-height: 1.4; color: inherit; }
        .required-star { color: #EF4444; margin-left: 2px; }

        /* BUTTONS */
        .btn-primary { background-color: #1A56DB; color: #FFFFFF; padding: 14px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; border: none; cursor: pointer; transition: 0.2s; margin-top: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .btn-primary:hover { background-color: #1E40AF; transform: translateY(-1px); }
        .btn-primary:active { transform: scale(0.98); }

        @media (max-width: 768px) {
          .compliance-wrapper { flex-direction: column; padding: 16px 12px; gap: 16px; }
          .compliance-sidebar { width: 100%; position: relative; top: 0; display: flex; overflow-x: auto; padding-bottom: 12px; border-bottom: 1px solid var(--border-light); }
          .sidebar-title { display: none; }
          .nav-item { min-width: 140px; margin-right: 8px; border: 1px solid var(--border-light); }
          .compliance-main { padding: 20px 16px; border: none; background: transparent; }
        }
      `}} />

      <div className="compliance-wrapper">
        
        {/* SIDEBAR WITH SMART STATUS BADGES */}
        <div className="compliance-sidebar">
          <div className="sidebar-title">Activation Progress</div>
          {navItems.map((item, index) => {
            const isCompleted = index < activeIndex;
            const isActive = index === activeIndex;
            
            return (
              <Link key={item.name} href={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
                <div className="nav-name">{item.name}</div>
                {mounted && (
                  <div className={`status-badge ${isCompleted ? 'badge-completed' : isActive ? 'badge-progress' : 'badge-waiting'}`}>
                    {isCompleted && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Not Started'}
                  </div>
                )}
              </Link>
            )
          })}
        </div>

        <div className="compliance-main">
          {children}
        </div>
      </div>
    </>
  );
}
