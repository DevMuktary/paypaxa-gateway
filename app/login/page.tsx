'use client';

import { useState, useEffect } from 'react';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function LoginPage() {
  // Step 1: Login Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Step 2: 2FA OTP & Resend Logic
  const [otp, setOtp] = useState('');
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Handle the 30-second countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpStep && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (isOtpStep && countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [isOtpStep, countdown]);

  // Handle Initial Login (Checks Password, Triggers OTP)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error(`Network block (Status ${response.status}). Check your domain firewall settings.`);
      }

      if (!response.ok) throw new Error(data.error || 'Invalid credentials');

      // Move to OTP Step and start countdown
      setStatus({ type: 'success', message: 'A 6-digit code has been sent to your email.' });
      setIsOtpStep(true);
      setCountdown(30);
      setCanResend(false);
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle Resending the OTP
  const handleResendOtp = async () => {
    setCanResend(false);
    setCountdown(30);
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error(`Network block (Status ${response.status}). Check your domain firewall settings.`);
      }

      if (!response.ok) throw new Error(data.error || 'Failed to resend code');

      setStatus({ type: 'success', message: 'A new 6-digit code has been sent to your email.' });
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
      setCanResend(true); 
      setCountdown(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error(`Network block (Status ${response.status}). Check your domain firewall settings.`);
      }

      if (!response.ok) throw new Error(data.error || 'Invalid verification code');

      setStatus({ type: 'success', message: 'Login successful. Redirecting...' });
      
      // Redirect to Dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);

    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
      setLoading(false);
    }
  };

  const EyeOpen = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
  );

  const EyeClosed = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
  );

  // --- STATE 2: THE LOADING OVERLAY ---
  if (loading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{__html: `
          html, body { margin: 0; padding: 0; background-color: #060B19; width: 100%; height: 100%; overflow: hidden; }
          @keyframes subtle-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.97); }
          }
        `}} />
        <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#060B19' }}>
          <div style={{ animation: 'subtle-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="https://paypaxa.com/logo.png" alt="PAYPAXA Loading" style={{ height: '64px', width: 'auto' }} />
          </div>
        </div>
      </>
    );
  }

  // --- MAIN RENDER (STATES 1 & 3) ---
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        html, body { 
          margin: 0; padding: 0; background-color: #060B19; width: 100%; overflow-x: hidden; position: relative;
          -webkit-overflow-scrolling: touch; touch-action: pan-x pan-y; 
        }
        *, *::before, *::after { box-sizing: border-box; }
        .viewport-wrapper {
          min-height: 100vh; width: 100%; overflow-x: hidden; display: flex; align-items: center; justify-content: center;
          font-family: system-ui, -apple-system, sans-serif; padding: 2rem 1rem;
          background: radial-gradient(circle at top right, #0A1635 0%, #060B19 100%);
        }
        .paypaxa-card {
          max-width: 440px; width: 100%; background-color: #0E1629; border: 1px solid #1A2642; border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); padding: 3rem 2.5rem; margin: 0 auto;
        }
        .paypaxa-input {
          width: 100%; padding: 14px 16px; border-radius: 8px; border: 1px solid #1E293B; background-color: #060B19; color: #F8FAFC;
          font-size: 16px; outline: none; transition: all 0.2s ease; appearance: none;
        }
        .paypaxa-input::placeholder { color: #475569; letter-spacing: normal; }
        .paypaxa-input:focus { border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }
        .paypaxa-btn {
          width: 100%; padding: 16px; background-color: #2563EB; color: #FFFFFF; border: none; border-radius: 8px;
          font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; margin-top: 1rem; text-align: center;
        }
        .paypaxa-btn:hover:not(:disabled) { background-color: #1D4ED8; }
        .paypaxa-btn:disabled { background-color: #1E293B; color: #64748B; cursor: not-allowed; }
        .paypaxa-label { display: block; font-size: 14px; margin-bottom: 8px; font-weight: 500; color: #94A3B8; }
        @media (max-width: 640px) { .paypaxa-card { padding: 2rem 1.5rem; } }
      `}} />

      <div className="viewport-wrapper">
        <div className="paypaxa-card">
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="https://paypaxa.com/logo.png" alt="PAYPAXA Logo" style={{ height: '36px', width: 'auto', borderRadius: '4px' }} />
              <span style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '1px' }}>PAYPAXA</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#F8FAFC', margin: '0 0 8px 0' }}>
              {isOtpStep ? 'Two-Factor Authentication' : 'Welcome back'}
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '15px', margin: 0 }}>
              {isOtpStep ? 'Enter the 6-digit code sent to your email.' : 'Sign in to your PAYPAXA account.'}
            </p>
          </div>

          {status.message && (
            <div style={{ padding: '14px 16px', marginBottom: '24px', borderRadius: '8px', backgroundColor: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: status.type === 'error' ? '#FCA5A5' : '#86EFAC', border: `1px solid ${status.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`, fontSize: '14px', textAlign: 'center' }}>
              {status.message}
            </div>
          )}

          {!isOtpStep ? (
            /* --- STEP 1: LOGIN FORM --- */
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="paypaxa-label">Work Email</label>
                <input 
                  type="email" 
                  required 
                  className="paypaxa-input" 
                  placeholder="name@company.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="paypaxa-label" style={{ marginBottom: 0 }}>Secure Password</label>
                  <a href="/forgot-password" style={{ fontSize: '13px', color: '#3B82F6', textDecoration: 'none', fontWeight: '500' }}>Forgot?</a>
                </div>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="paypaxa-input" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={{ paddingRight: '40px' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    {showPassword ? <EyeOpen /> : <EyeClosed />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="paypaxa-btn">
                Sign In
              </button>
            </form>
          ) : (
            /* --- STEP 2: OTP FORM --- */
            <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="paypaxa-label" style={{ textAlign: 'center', marginBottom: '12px' }}>Authentication Code</label>
                <input 
                  type="text" 
                  required 
                  maxLength={6}
                  className="paypaxa-input" 
                  placeholder="000000" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                  style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px', fontWeight: 'bold', padding: '16px' }}
                />
              </div>

              <button type="submit" disabled={loading || otp.length < 6} className="paypaxa-btn">
                Verify & Continue
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <div style={{ fontSize: '14px', color: '#64748B' }}>
                  {canResend ? (
                    <button 
                      type="button" 
                      onClick={handleResendOtp}
                      style={{ background: 'none', border: 'none', color: '#3B82F6', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                    >
                      Resend Code
                    </button>
                  ) : (
                    <span>Resend code in <strong style={{ color: '#E2E8F0' }}>{countdown}s</strong></span>
                  )}
                </div>

                <button 
                  type="button" 
                  onClick={() => {
                    setIsOtpStep(false);
                    setStatus({ type: '', message: '' });
                    setOtp('');
                  }}
                  style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {!isOtpStep && (
            <div style={{ textAlign: 'center', fontSize: '14px', color: '#64748B', marginTop: '2rem' }}>
              New to PAYPAXA? <a href="/register" style={{ color: '#3B82F6', textDecoration: 'none', fontWeight: '600' }}>Create an account</a>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
