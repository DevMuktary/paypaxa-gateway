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
        /* Inherits your global layout colors, no hardcoded #hex backgrounds */
        .compliance-wrapper { 
          display: flex; 
          align-items: flex-start;
          gap: 24px; 
          max-width: 900px; 
          margin: 0 auto; 
          padding: 24px 16px;
          font-family: inherit;
        }
        
        .compliance-sidebar { 
          width: 220px; 
          flex-shrink: 0; 
          position: sticky; 
          top: 24px; 
        }
        
        .nav-item { 
          display: block; 
          padding: 10px 12px; 
          border-radius: 6px; 
          color: inherit; 
          font-weight: 500; 
          font-size: 14px; 
          text-decoration: none; 
          margin-bottom: 4px; 
          transition: background-color 0.2s;
          opacity: 0.7;
        }
        
        .nav-item:hover { 
          background-color: rgba(128, 128, 128, 0.1); 
          opacity: 1;
        }
        
        .nav-item.active { 
          background-color: rgba(128, 128, 128, 0.15); 
          font-weight: 600; 
          opacity: 1;
          border-left: 3px solid currentColor;
        }

        .compliance-main { 
          flex: 1; 
          width: 100%;
          background-color: rgba(128, 128, 128, 0.03);
          border: 1px solid rgba(128, 128, 128, 0.2);
          border-radius: 8px; 
          padding: 24px; 
        }

        /* Global Form Styles for all steps */
        .page-title { font-size: 18px; font-weight: 600; margin: 0 0 24px 0; padding-bottom: 12px; border-bottom: 1px solid rgba(128, 128, 128, 0.2); }
        .input-group { margin-bottom: 16px; }
        .input-label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; opacity: 0.9; }
        .input-field, .input-select, .input-textarea { 
          width: 100%; 
          padding: 8px 12px; 
          background-color: transparent; 
          border: 1px solid rgba(128, 128, 128, 0.3); 
          border-radius: 6px; 
          color: inherit; 
          font-size: 14px; 
          outline: none; 
          transition: border-color 0.2s; 
          font-family: inherit; 
        }
        .input-field:focus, .input-select:focus, .input-textarea:focus { border-color: currentColor; }
        .input-textarea { resize: vertical; min-height: 80px; }
        .help-text { font-size: 12px; opacity: 0.6; margin-top: 4px; display: block; }
        .required-star { color: #EF4444; }

        .btn-primary { 
          background-color: currentColor; 
          color: var(--background, #FFF); /* Inverts text color based on current mode */
          padding: 10px 16px; 
          border-radius: 6px; 
          font-weight: 500; 
          font-size: 14px; 
          border: none; 
          cursor: pointer; 
          transition: opacity 0.2s; 
          margin-top: 16px; 
        }
        .btn-primary:hover { opacity: 0.8; }
        .btn-primary:active { transform: scale(0.98); } /* Replaces the ugly white blur with a simple press effect */

        @media (max-width: 768px) {
          .compliance-wrapper { flex-direction: column; padding: 16px 12px; gap: 16px; }
          .compliance-sidebar { width: 100%; position: relative; top: 0; display: flex; overflow-x: auto; padding-bottom: 8px; border-bottom: 1px solid rgba(128, 128, 128, 0.2); }
          .nav-item { white-space: nowrap; margin-bottom: 0; margin-right: 8px; border-left: none; border-bottom: 2px solid transparent; border-radius: 4px; }
          .nav-item.active { border-left: none; border-bottom: 2px solid currentColor; }
          .compliance-main { padding: 16px; border: none; background: transparent; }
        }
      `}} />

      <div className="compliance-sidebar">
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

      <div className="compliance-main">
        {children}
      </div>
    </div>
  );
}
