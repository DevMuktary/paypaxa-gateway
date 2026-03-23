'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    country: 'Nigeria',
    businessName: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    businessType: 'STARTER',
    isDeveloper: 'no'
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setStatus({ type: 'success', message: data.message });
      setFormData({
        country: 'Nigeria', businessName: '', firstName: '', lastName: '', 
        email: '', phoneNumber: '', password: '', confirmPassword: '', 
        businessType: 'STARTER', isDeveloper: 'no'
      });
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Custom CSS for mobile responsiveness and premium hover/focus states. 
        This guarantees "International Standard" UI without needing Tailwind.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        body { margin: 0; background-color: #060B19; }
        .paypaxa-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: 3rem 1rem;
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
          box-sizing: border-box;
        }
        .paypaxa-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .paypaxa-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 8px;
          border: 1px solid #1E293B;
          background-color: #060B19;
          color: #F8FAFC;
          font-size: 15px;
          box-sizing: border-box;
          outline: none;
          transition: all 0.2s ease;
        }
        .paypaxa-input::placeholder {
          color: #475569;
        }
        .paypaxa-input:focus {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
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
        .paypaxa-btn:hover:not(:disabled) {
          background-color: #1D4ED8;
        }
        .paypaxa-btn:disabled {
          background-color: #1E293B;
          color: #64748B;
          cursor: not-allowed;
        }
        .paypaxa-label {
          display: block;
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
        .selection-card:hover {
          border-color: #475569 !important;
        }
        /* Mobile Optimization */
        @media (max-width: 640px) {
          .paypaxa-card { padding: 2rem 1.5rem; }
          .paypaxa-grid { grid-template-columns: 1fr; gap: 1rem; }
        }
      `}} />

      <div className="paypaxa-container">
        <div className="paypaxa-card">
          
          {/* Premium SVG Logo Placeholder */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#2563EB"/>
                <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
                <select className="paypaxa-input" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})}>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Other">Other Countries</option>
                </select>
              </div>
              <div>
                <label className="paypaxa-label">Business Name</label>
                <input type="text" required className="paypaxa-input" placeholder="e.g. Quadrox Tech" value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} />
              </div>
            </div>

            <div className="paypaxa-grid">
              <div>
                <label className="paypaxa-label">First Name</label>
                <input type="text" required className="paypaxa-input" placeholder="Mukhtar" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div>
                <label className="paypaxa-label">Last Name</label>
                <input type="text" required className="paypaxa-input" placeholder="Abdulwaheed" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>

            <div className="paypaxa-grid">
              <div>
                <label className="paypaxa-label">Work Email</label>
                <input type="email" required className="paypaxa-input" placeholder="dev@quadroxtech.cloud" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="paypaxa-label">Phone Number</label>
                <input type="tel" required className="paypaxa-input" placeholder="+234..." value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
              </div>
            </div>

            <div className="paypaxa-grid">
              <div>
                <label className="paypaxa-label">Secure Password</label>
                <input type="password" required minLength={8} className="paypaxa-input" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
              </div>
              <div>
                <label className="paypaxa-label">Confirm Password</label>
                <input type="password" required minLength={8} className="paypaxa-input" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
              </div>
            </div>

            {/* Business Type Cards */}
            <div>
              <label className="paypaxa-label" style={{ marginBottom: '12px' }}>What type of business do you own?</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                <div 
                  className="selection-card"
                  onClick={() => setFormData({...formData, businessType: 'STARTER'})}
                  style={{ border: `2px solid ${formData.businessType === 'STARTER' ? '#3B82F6' : '#1E293B'}`, backgroundColor: formData.businessType === 'STARTER' ? 'rgba(59, 130, 246, 0.05)' : '#060B19' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `5px solid ${formData.businessType === 'STARTER' ? '#3B82F6' : '#1E293B'}`, backgroundColor: '#060B19', boxSizing: 'border-box' }}></div>
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
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `5px solid ${formData.businessType === 'REGISTERED' ? '#3B82F6' : '#1E293B'}`, backgroundColor: '#060B19', boxSizing: 'border-box' }}></div>
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
              {loading ? 'Securing workspace...' : 'Create my account'}
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
