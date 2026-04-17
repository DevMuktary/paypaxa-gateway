'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TooltipLabel = ({ label, htmlFor, required, tooltipText }: { label: string, htmlFor?: string, required?: boolean, tooltipText?: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <label htmlFor={htmlFor} className="input-label" style={{ cursor: 'pointer' }}>
          {label} {required && <span className="required-star">*</span>}
        </label>
        {tooltipText && (
          <button type="button" onClick={() => setShow(!show)} style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-light)', cursor: 'pointer', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', padding: 0, opacity: 0.7 }} title="Click for more info">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </button>
        )}
      </div>
      {show && tooltipText && (
        <div style={{ fontSize: '13px', padding: '10px 12px', backgroundColor: 'var(--bg-overlay)', borderRadius: '6px', marginTop: '6px', borderLeft: '3px solid var(--brand-primary)', opacity: 0.9, lineHeight: 1.4 }}>{tooltipText}</div>
      )}
    </div>
  );
};

export default function AccountPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  const [bankList, setBankList] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    bankCode: '',
    bankName: '',
    accountNumber: '',
    accountName: ''
  });

  // 1. Fetch Banks and Saved Data on Mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch Paystack Banks
        const banksRes = await fetch('/api/paystack/banks');
        if (banksRes.ok) {
          const banksData = await banksRes.json();
          setBankList(banksData.data || []);
        }

        // Fetch Saved Database Info
        const savedRes = await fetch('/api/compliance/account');
        if (savedRes.ok) {
          const savedData = await savedRes.json();
          if (savedData.accountNumber) {
            setFormData({
              bankCode: savedData.bankCode || '',
              bankName: savedData.bankName || '',
              accountNumber: savedData.accountNumber || '',
              accountName: savedData.accountName || ''
            });
          }
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeData();
  }, []);

  // 2. Auto-Resolve Account Name when 10 digits are entered
  useEffect(() => {
    const resolveAccount = async () => {
      if (formData.accountNumber.length === 10 && formData.bankCode) {
        setIsResolving(true);
        setResolveError(null);
        setFormData(prev => ({ ...prev, accountName: '' })); // Clear previous name

        try {
          const res = await fetch(`/api/paystack/resolve?account_number=${formData.accountNumber}&bank_code=${formData.bankCode}`);
          const data = await res.json();

          if (data.status) {
            setFormData(prev => ({ ...prev, accountName: data.data.account_name }));
          } else {
            setResolveError("Invalid Account Details. Please verify the number and bank.");
          }
        } catch (error) {
          setResolveError("Network error. Could not verify account.");
        } finally {
          setIsResolving(false);
        }
      } else {
        // If they delete a number, clear the resolved name and error
        setFormData(prev => ({ ...prev, accountName: '' }));
        setResolveError(null);
      }
    };

    resolveAccount();
  }, [formData.accountNumber, formData.bankCode]);

  // Handle Input Changes
  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBank = bankList.find(b => b.code === e.target.value);
    setFormData({
      ...formData,
      bankCode: selectedBank?.code || '',
      bankName: selectedBank?.name || ''
    });
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, accountNumber: value });
  };

  // 3. Save to Database
  const handleSaveAndNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accountName) return; // Prevent saving unverified accounts

    setIsSaving(true);
    try {
      const response = await fetch('/api/compliance/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/dashboard/compliance/owners'); // Move to Liveness step next
      } else {
        alert("Failed to save progress.");
        setIsSaving(false);
      }
    } catch (error) {
      console.error("Save error:", error);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><svg className="animate-spin" style={{ color: 'var(--brand-primary)' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg></div>;
  }

  return (
    <form onSubmit={handleSaveAndNext}>
      <h2 className="page-title">Settlement Account</h2>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.5 }}>
        Enter the bank account where you want to receive your payouts. <br/>
        <strong style={{ color: 'var(--brand-primary)' }}>Important:</strong> To pass KYC, the name on this bank account must strictly match your legal business name or your BVN profile.
      </p>

      <div className="input-group">
        <TooltipLabel label="Bank name" htmlFor="bankCode" required />
        <select id="bankCode" name="bankCode" className="input-select" required value={formData.bankCode} onChange={handleBankChange}>
          <option value="">Choose bank...</option>
          {bankList.map((bank) => (
            <option key={bank.code} value={bank.code}>{bank.name}</option>
          ))}
        </select>
      </div>
      
      <div className="input-group">
        <TooltipLabel label="Account number" htmlFor="accountNumber" required />
        <input 
          type="text" 
          id="accountNumber"
          name="accountNumber"
          className="input-field" 
          placeholder="0000000000" 
          required 
          value={formData.accountNumber} 
          onChange={handleNumberInput} 
        />
        {resolveError && (
          <span style={{ fontSize: '13px', color: '#EF4444', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {resolveError}
          </span>
        )}
      </div>

      <div className="input-group" style={{ 
        background: formData.accountName ? 'var(--success-bg, rgba(16, 185, 129, 0.1))' : 'var(--bg-overlay)', 
        border: `1px solid ${formData.accountName ? 'var(--success-text, #10B981)' : 'var(--border-light)'}`,
        padding: '16px', borderRadius: '8px', transition: '0.3s', position: 'relative'
      }}>
        <label className="input-label" style={{ color: formData.accountName ? 'var(--success-text, #10B981)' : 'inherit' }}>
          Name on account <span className="required-star">*</span>
        </label>
        
        {isResolving ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '14px', color: 'var(--brand-primary)', fontWeight: 600 }}>
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
            Verifying account details with NIBSS...
          </div>
        ) : (
          <input 
            type="text" 
            className="input-field" 
            style={{ 
              border: 'none', background: 'transparent', padding: '8px 0 0 0', 
              fontWeight: 700, fontSize: '16px', color: formData.accountName ? 'var(--success-text, #10B981)' : 'var(--text-muted)' 
            }}
            disabled 
            placeholder="Account name will automatically appear here..."
            value={formData.accountName}
          />
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
        <button type="submit" className="btn-primary" disabled={isSaving || !formData.accountName || isResolving}>
          {isSaving ? 'Saving...' : 'Save and Continue'}
        </button>
      </div>
    </form>
  );
}
