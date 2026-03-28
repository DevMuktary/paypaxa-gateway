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
          --brand-primary: #1A56DB; 
          --bg-overlay: rgba(128, 128, 128, 0.05);
          --border-light: rgba(128, 128, 128, 0.2);
          --dropdown-bg: #FFFFFF;
          --dropdown-text: #111827;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --brand-primary: #3B82F6; 
            --dropdown-bg: #0F172A;
            --dropdown-text: #F9FAFB;
          }
        }

        .compliance-wrapper { display: flex; align-items: flex-start; gap: 24px; max-width: 900px; margin: 0 auto; padding: 24px 16px; font-family: inherit; }
        .compliance-sidebar { width: 220px; flex-shrink: 0; position: sticky; top: 24px; }
        
        .nav-item { display: block; padding: 10px 12px; border-radius: 6px; color: inherit; font-weight: 500; font-size: 14px; text-decoration: none; margin-bottom: 4px; transition: 0.2s; opacity: 0.7; }
        .nav-item:hover { background-color: var(--bg-overlay); opacity: 1; }
        .nav-item.active { background-color: var(--bg-overlay); font-weight: 600; opacity: 1; border-left: 3px solid var(--brand-primary); color: var(--brand-primary); }

        .compliance-main { flex: 1; width: 100%; background-color: var(--bg-overlay); border: 1px solid var(--border-light); border-radius: 8px; padding: 32px; }

        .page-title { font-size: 18px; font-weight: 600; margin: 0 0 24px 0; padding-bottom: 12px; border-bottom: 1px solid var(--border-light); }
        .input-group { margin-bottom: 20px; }
        .input-label { font-size: 13px; font-weight: 600; opacity: 0.9; margin: 0; }
        
        .input-field, .input-select, .input-textarea { width: 100%; padding: 10px 14px; background-color: transparent; border: 1px solid var(--border-light); border-radius: 6px; color: inherit; font-size: 14px; outline: none; transition: 0.2s; font-family: inherit; }
        .input-field:focus, .input-select:focus, .input-textarea:focus { border-color: var(--brand-primary); }
        
        /* THE FIX: Forces dropdown options to be visible in all OS modes */
        option { background-color: var(--dropdown-bg); color: var(--dropdown-text); }
        
        .input-textarea { resize: vertical; min-height: 80px; }
        .help-text { font-size: 12px; opacity: 0.6; margin-top: 6px; display: block; line-height: 1.4; }
        .required-star { color: #EF4444; margin-left: 2px; }

        /* THE FIX: Button strictly locked to blue and white */
        .btn-primary { background-color: #1A56DB; color: #FFFFFF; padding: 12px 20px; border-radius: 6px; font-weight: 600; font-size: 14px; border: none; cursor: pointer; transition: 0.2s; margin-top: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .btn-primary:hover { background-color: #1E40AF; transform: translateY(-1px); }
        .btn-primary:active { transform: scale(0.98); }

        @media (max-width: 768px) {
          .compliance-wrapper { flex-direction: column; padding: 16px 12px; gap: 16px; }
          .compliance-sidebar { width: 100%; position: relative; top: 0; display: flex; overflow-x: auto; padding-bottom: 8px; border-bottom: 1px solid var(--border-light); }
          .nav-item { white-space: nowrap; margin-bottom: 0; margin-right: 8px; border-left: none; border-bottom: 2px solid transparent; border-radius: 4px; }
          .nav-item.active { border-left: none; border-bottom: 2px solid var(--brand-primary); }
          .compliance-main { padding: 20px 16px; border: none; background: transparent; }
        }
      `}} />

      <div className="compliance-sidebar">
        {navItems.map((item) => (
          <Link key={item.name} href={item.path} className={`nav-item ${pathname?.includes(item.path) ? 'active' : ''}`}>
            {item.name}
          </Link>
        ))}
      </div>
      <div className="compliance-main">
        {children}
      </div>
    </div>
  );
}
