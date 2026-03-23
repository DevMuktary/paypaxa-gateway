'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function VerificationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided in the link.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        setStatus('success');
        setMessage(data.message);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Dynamic Icon based on Status */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {status === 'loading' && (
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid #1E293B', borderTopColor: '#3B82F6', animation: 'spin 1s linear infinite' }}></div>
        )}
        {status === 'success' && (
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
        {status === 'error' && (
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        )}
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#F8FAFC', marginBottom: '12px' }}>
        {status === 'loading' ? 'Verifying Account' : status === 'success' ? 'Account Verified' : 'Verification Failed'}
      </h1>
      
      <p style={{ color: '#94A3B8', fontSize: '15px', lineHeight: '1.6', marginBottom: '2rem' }}>
        {message}
      </p>

      {status === 'success' && (
        <a href="/login" style={{ display: 'inline-block', width: '100%', padding: '16px', backgroundColor: '#2563EB', color: '#FFFFFF', textDecoration: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', transition: 'background-color 0.2s' }}>
          Proceed to Login
        </a>
      )}

      {status === 'error' && (
        <a href="/register" style={{ display: 'inline-block', width: '100%', padding: '16px', backgroundColor: '#1E293B', color: '#F8FAFC', textDecoration: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', transition: 'background-color 0.2s' }}>
          Return to Registration
        </a>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        html, body { 
          margin: 0; padding: 0; background-color: #060B19; width: 100vw; max-width: 100vw; overflow-x: hidden;
        }
        * { box-sizing: border-box; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />

      <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem 1rem', background: 'radial-gradient(circle at top right, #0A1635 0%, #060B19 100%)' }}>
        <div style={{ maxWidth: '440px', width: '100%', backgroundColor: '#0E1629', border: '1px solid #1A2642', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', padding: '3rem 2rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/logo.svg" alt="PAYPAXA Logo" style={{ height: '32px', width: 'auto', borderRadius: '4px' }} 
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  (e.target as HTMLElement).nextElementSibling!.classList.remove('hidden');
                }} 
              />
              <svg className="hidden" width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
                <rect width="32" height="32" rx="8" fill="#2563EB"/>
                <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '1px' }}>PAYPAXA</span>
            </div>
          </div>

          <Suspense fallback={<div style={{ textAlign: 'center', color: '#94A3B8' }}>Loading verifier...</div>}>
            <VerificationContent />
          </Suspense>

        </div>
      </div>
    </>
  );
}
