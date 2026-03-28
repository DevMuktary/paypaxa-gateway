'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ComplianceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Profile', path: '/dashboard/compliance/profile' },
    { name: 'Contact', path: '/dashboard/compliance/contact' },
    { name: 'Account', path: '/dashboard/compliance/account' },
    { name: 'Owners', path: '/dashboard/compliance/owners' },
    { name: 'Documents', path: '/dashboard/compliance/documents' },
    { name: 'Service Agreement', path: '/dashboard/compliance/agreement' },
  ];

  return (
    <div className="compliance-wrapper">
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --brand-dark: #0B192C; 
          --brand-primary: #1A56DB; 
          --brand-light: #EFF6FF;
          --bg-main: #F4F7FE;
          --card-bg: #FFFFFF;
          --text-main: #111827;
          --text-muted: #64748B;
          --border-color: #E2E8F0;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --bg-main: #060D18;
            --card-bg: #0B192C;
            --text-main: #F9FAFB;
            --text-muted: #9CA3AF;
            --border-color: #1E293B;
            --brand-primary: #3B82F6;
          }
        }

        .compliance-wrapper { display: flex; min-height: 100vh; background: var(--bg-main); font-family: 'Inter', system-ui, sans-serif; padding: 40px 20px; justify-content: center; gap: 32px; }
        
        .sidebar { width: 280px; background: var(--card-bg); border-radius: 16px; padding: 32px 24px; border: 1px solid var(--border-color); height: fit-content; position: sticky; top: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        .sidebar-title { font-size: 13px; font-weight: 800; color: var(--text-muted); margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px; }
        
        .nav-item { display: block; padding: 12px 16px; border-radius: 8px; color: var(--text-main); font-weight: 600; font-size: 14px; text-decoration: none; margin-bottom: 8px; transition: 0.2s; border-left: 3px solid transparent; }
        .nav-item:hover { background: var(--bg-main); }
        .nav-item.active { background: var(--brand-light); color: var(--brand-primary); border-left-color: var(--brand-primary); }

        .main-content { flex: 1; max-width: 760px; background: var(--card-bg); border-radius: 16px; border: 1px solid var(--border-color); padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }

        /* Shared Form Styles for all child pages */
        .page-title { font-size: 24px; font-weight: 800; color: var(--text-main); margin: 0 0 32px 0; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; }
        .input-group { margin-bottom: 24px; }
        .input-label { display: block; font-size: 13px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; }
        .input-field, .input-select, .input-textarea { width: 100%; padding: 14px 16px; background-color: var(--bg-main); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-main); font-size: 14px; outline: none; transition: 0.2s; font-family: inherit; }
        .input-field:focus, .input-select:focus, .input-textarea:focus { border-color: var(--brand-primary); box-shadow: 0 0 0 3px var(--brand-light); background: var(--card-bg); }
        .input-textarea { resize: vertical; min-height: 100px; }
        .help-text { font-size: 12px; color: var(--text-muted); margin-top: 6px; display: block; }
        .required-star { color: #EF4444; }

        .btn-primary { background: var(--brand-dark); color: #FFFFFF; padding: 14px 24px; border-radius: 8px; font-weight: 700; font-size: 15px; border: none; cursor: pointer; transition: 0.2s; float: right; margin-top: 16px; }
        .btn-primary:hover { opacity: 0.9; }

        @media (max-width: 900px) {
          .compliance-wrapper { flex-direction: column; padding: 16px; }
          .sidebar { width: 100%; position: relative; top: 0; padding: 20px; }
          .main-content { width: 100%; padding: 24px 16px; }
        }
      `}} />

      <div className="sidebar">
        <div className="sidebar-title">Activation Settings</div>
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.path} 
            className={`nav-item ${pathname?.includes(item.path) ? 'active' : ''}`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
