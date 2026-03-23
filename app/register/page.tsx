'use client';

import { useState } from 'react';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    country: 'Nigeria',
    businessName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessType: 'STARTER',
    isDeveloper: 'no'
  });
  
  const [phoneDigits, setPhoneDigits] = useState('');
  const [phoneCode, setPhoneCode] = useState('+234');
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const countryCodes: Record<string, string> = {
    'Nigeria': '+234',
    'Ghana': '+233',
    'Kenya': '+254',
    'South Africa': '+27',
    'Other': ''
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    setFormData({ ...formData, country: selectedCountry });
    setPhoneCode(countryCodes[selectedCountry] || '');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); 
    if (val.startsWith('0')) {
      val = val.substring(1); 
    }
    setPhoneDigits(val);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, email: val });
    if (val === '') {
      setEmailValid(null);
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(emailRegex.test(val));
    }
  };

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; 
  };

  const strengthScore = calculateStrength(formData.password);
  const strengthColors = ['#1E293B', '#EF4444', '#F59E0B', '#3B82F6', '#22C55E'];
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    if (!emailValid) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      setLoading(false);
      return;
    }

    if (strengthScore < 2) {
      setStatus({ type: 'error', message: 'Please choose a stronger password.' });
      setLoading(false);
      return;
    }

    if (phoneDigits.length < 8) {
      setStatus({ type: 'error', message: 'Please enter a valid phone number.' });
      setLoading(false);
      return;
    }

    const fullPhoneNumber = `${phoneCode}${phoneDigits}`;
    const payload = { ...formData, phoneNumber: fullPhoneNumber };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Registration failed');

      setStatus({ type: 'success', message: data.message });
      setFormData({ country: 'Nigeria', businessName: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: '', businessType: 'STARTER', isDeveloper: 'no' });
      setPhoneDigits('');
      setEmailValid(null);
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const EyeOpen = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const EyeClosed = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        html, body { 
          margin: 0; 
          padding: 0;
          background-color: #060B19; 
          width: 100%;
          overflow-x: hidden; 
          position: relative;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-x pan-y; 
        }
        *, *::before, *::after { box-sizing: border-box; }
        .viewport-wrapper {
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: system-ui, -apple-system, sans-serif;
          padding: 2rem 1rem;
          background: radial-gradient(circle at top right, #0A1635 0%, #060B19 100%);
        }
        .paypaxa-card {
          max-width: 640px;
          width: 100%;
          background-color: #0E1629;
          border: 1px solid #1A2642;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          padding: 3rem;
          margin: 0 auto;
        }
        .paypaxa-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          width: 100%;
        }
        .paypaxa-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 8px;
          border: 1px solid #1E293B;
          background-color: #060B19;
          color: #F8FAFC;
          font-size: 16px; 
          outline: none;
          transition: all 0.2s ease;
          appearance: none;
        }
        .paypaxa-input::placeholder { color: #475569; }
        .paypaxa-input:focus, .paypaxa-input-group:focus-within {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }
        .paypaxa-input-group {
          display: flex;
          align-items: center;
          border-radius: 8px;
          border: 1px solid #1E293B;
          background-color: #060B19;
          transition: all 0.2s ease;
          overflow: hidden;
          width: 100%;
        }
        .paypaxa-input-group select, .paypaxa-input-group input {
          border: none;
          background: transparent;
          color: #F8FAFC;
          padding: 14px 16px;
          font-size: 16px; 
          outline: none;
          appearance: none;
        }
        .paypaxa-input-group input {
          flex: 1;
          min-width: 0; 
        }
        .paypaxa-btn {
          width: 100%;
          padding: 16px;
          background-color: #2563EB;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 1rem;
        }
        .paypaxa-btn:hover:not(:disabled) { background-color: #1D4ED8; }
        .paypaxa-btn:disabled { background-color: #1E293B; color: #64748B; cursor: not-allowed; }
        .paypaxa-label {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 8px;
          font-weight: 500;
          color: #94A3B8;
        }
        .selection-card {
          padding: 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          background-color: #060B19;
        }
        .selection-card:hover { border-color: #475569 !important; }
        
        @media (max-width: 640px) {
          .paypaxa-card { padding: 2rem 1.25rem; }
          .paypaxa-grid { grid-template-columns: 1fr; gap: 1rem; }
        }
      `}} />

      <div className="viewport-wrapper">
        <div className="paypaxa-card">
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Removed the inline onError handler to fix Next.js build crash */}
              <img src="/logo.png" alt="PAYPAXA Logo" style={{ height: '36px', width: 'auto', borderRadius: '4px' }} />
              <span style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '1px' }}>PAYPAXA</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#F8FAFC', margin: '0 0 8px 0' }}>
              Create your gateway account
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '15px', margin: 0 }}>
              Join modern businesses processing payments securely.
            </p>
          </div>

          {status.message && (
            <div style={{ padding: '14px 16px', marginBottom: '24px', borderRadius: '8px', backgroundColor: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', color: status.type === 'error' ? '#FCA5A5' : '#86EFAC', border: `1px solid ${status.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`, fontSize: '14px' }}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="paypaxa-grid">
              <div>
                <label className="paypaxa-label">Country</label>
                <select className="paypaxa-input" value={formData.country} onChange={handleCountryChange}>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Other">Other Countries</option>
                </select>
              </div>
              <div>
                <label className="paypaxa-label">Business Name</label>
                <input type="text" required className="paypaxa-input" placeholder="e.g. Acme Corp" value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} />
              </div>
            </div>

            <div className="paypaxa-grid">
              <div>
                <label className="paypaxa-label">First Name</label>
                <input type="text" required className="paypaxa-input" placeholder="Jane" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div>
                <label className="paypaxa-label">Last Name</label>
                <input type="text" required className="paypaxa-input" placeholder="Doe" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>

            <div className="paypaxa-grid">
              <div>
                <label className="paypaxa-label">
                  <span>Work Email</span>
                  {emailValid === true && <span style={{ color: '#22C55E' }}>✓ Valid</span>}
                  {emailValid === false && <span style={{ color: '#EF4444' }}>Invalid format</span>}
                </label>
                <input type="email" required className="paypaxa-input" placeholder="name@company.com" value={formData.email} onChange={handleEmailChange} style={{ borderColor: emailValid === false ? '#EF4444' : '' }} />
              </div>
              
              <div>
                <label className="paypaxa-label">Phone Number</label>
                <div className="paypaxa-input-group">
                  <select 
                    value={phoneCode} 
                    onChange={(e) => setPhoneCode(e.target.value)}
                    style={{ borderRight: '1px solid #1E293B', paddingRight: '4px', width: '90px', color: '#94A3B8' }}
                  >
                    <option value="+234">+234</option>
                    <option value="+233">+233</option>
                    <option value="+254">+254</option>
                    <option value="+27">+27</option>
                  </select>
                  <input 
                    type="tel" 
                    required 
                    placeholder="801 234 5678" 
                    value={phoneDigits} 
                    onChange={handlePhoneChange} 
                  />
                </div>
              </div>
            </div>

            <div className="paypaxa-grid">
              <div>
                <label className="paypaxa-label">Secure Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required minLength={8} 
                    className="paypaxa-input" 
                    placeholder="••••••••" 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
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
                
                <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                  {[1, 2, 3, 4].map(level => (
                    <div key={level} style={{
                      height: '4px', flex: 1, borderRadius: '2px',
                      backgroundColor: strengthScore >= level ? strengthColors[strengthScore] : '#1E293B',
                      transition: 'background-color 0.3s ease'
                    }}></div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '500', color: strengthScore > 0 ? strengthColors[strengthScore] : '#64748B' }}>
                    {strengthScore > 0 ? strengthLabels[strengthScore] : 'Minimum 8 characters'}
                  </span>
                </div>
              </div>

              <div>
                <label className="paypaxa-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    required minLength={8} 
                    className="paypaxa-input" 
                    placeholder="••••••••" 
                    value={formData.confirmPassword} 
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                    style={{ paddingRight: '40px' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    {showConfirmPassword ? <EyeOpen /> : <EyeClosed />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="paypaxa-label" style={{ marginBottom: '12px' }}>What type of business do you own?</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                <div 
                  className="selection-card"
                  onClick={() => setFormData({...formData, businessType: 'STARTER'})}
                  style={{ border: `2px solid ${formData.businessType === 'STARTER' ? '#3B82F6' : '#1E293B'}`, backgroundColor: formData.businessType === 'STARTER' ? 'rgba(59, 130, 246, 0.05)' : '#060B19' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `5px solid ${formData.businessType === 'STARTER' ? '#3B82F6' : '#1E293B'}`, backgroundColor: '#060B19' }}></div>
                    <strong style={{ color: '#F8FAFC', fontSize: '15px' }}>Starter Business</strong>
                  </div>
                  <p style={{ margin: '6px 0 0 30px', fontSize: '13px', color: '#94A3B8', lineHeight: '1.5' }}>
                    I'm testing my ideas with real customers, and preparing to register my company.
                  </p>
                </div>

                <div 
                  className="selection-card"
                  onClick={() => setFormData({...formData, businessType: 'REGISTERED'})}
                  style={{ border: `2px solid ${formData.businessType === 'REGISTERED' ? '#3B82F6' : '#1E293B'}`, backgroundColor: formData.businessType === 'REGISTERED' ? 'rgba(59, 130, 246, 0.05)' : '#060B19' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `5px solid ${formData.businessType === 'REGISTERED' ? '#3B82F6' : '#1E293B'}`, backgroundColor: '#060B19' }}></div>
                    <strong style={{ color: '#F8FAFC', fontSize: '15px' }}>Registered Business</strong>
                  </div>
                  <p style={{ margin: '6px 0 0 30px', fontSize: '13px', color: '#94A3B8', lineHeight: '1.5' }}>
                    My business has the approval, documentation, and licences required to operate legally.
                  </p>
                </div>

              </div>
            </div>

            <div>
              <label className="paypaxa-label">Are you a software developer?</label>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#E2E8F0', cursor: 'pointer' }}>
                  <input type="radio" name="developer" checked={formData.isDeveloper === 'yes'} onChange={() => setFormData({...formData, isDeveloper: 'yes'})} style={{ cursor: 'pointer', accentColor: '#3B82F6' }} />
                  Yes, I am
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#E2E8F0', cursor: 'pointer' }}>
                  <input type="radio" name="developer" checked={formData.isDeveloper === 'no'} onChange={() => setFormData({...formData, isDeveloper: 'no'})} style={{ cursor: 'pointer', accentColor: '#3B82F6' }} />
                  No, I'm not
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="paypaxa-btn">
              {loading ? 'Creating account...' : 'Create my account'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748B', marginTop: '0.5rem', lineHeight: '1.6' }}>
              By clicking "Create my account", you agree to PAYPAXA's Terms of Use.<br />
              Already have an account? <a href="/login" style={{ color: '#3B82F6', textDecoration: 'none', fontWeight: '600' }}>Sign in</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
