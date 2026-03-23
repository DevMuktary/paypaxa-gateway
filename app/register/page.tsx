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
      // Clear form on success
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

  // World-Class Premium Dark Blue Theme Constants
  const theme = {
    bgLight: '#F3F4F6',
    cardBg: '#FFFFFF',
    textDark: '#0A192F',
    textMuted: '#64748B',
    primaryBlue: '#1D4ED8',
    primaryHover: '#1E3A8A',
    borderLight: '#E2E8F0',
    inputBg: '#F8FAFC'
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '6px', 
    border: `1px solid ${theme.borderLight}`, backgroundColor: theme.inputBg,
    fontSize: '15px', color: theme.textDark, boxSizing: 'border-box' as const,
    outline: 'none', transition: 'border 0.2s ease'
  };

  const labelStyle = {
    display: 'block', fontSize: '14px', marginBottom: '6px', 
    fontWeight: '600', color: theme.textDark
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bgLight, fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem 1rem' }}>
      
      <div style={{ maxWidth: '600px', width: '100%', backgroundColor: theme.cardBg, borderRadius: '12px', boxShadow: '0 10px 25px rgba(10, 25, 47, 0.05)', padding: '3rem 2.5rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: theme.textDark, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            Create your PAYPAXA account
          </h1>
          <p style={{ color: theme.textMuted, fontSize: '15px', margin: 0 }}>
            Join modern businesses processing payments smoothly.
          </p>
        </div>

        {status.message && (
          <div style={{ padding: '12px 16px', marginBottom: '24px', borderRadius: '6px', backgroundColor: status.type === 'error' ? '#FEF2F2' : '#F0FDF4', color: status.type === 'error' ? '#991B1B' : '#166534', fontSize: '14px', borderLeft: `4px solid ${status.type === 'error' ? '#EF4444' : '#22C55E'}` }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Country & Business Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Country</label>
              <select style={inputStyle} value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})}>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
                <option value="South Africa">South Africa</option>
                <option value="Other">Other Countries</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Business Name</label>
              <input type="text" required style={inputStyle} placeholder="Your company name" value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} />
            </div>
          </div>

          {/* Name Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input type="text" required style={inputStyle} placeholder="Mukhtar" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input type="text" required style={inputStyle} placeholder="Abdulwaheed" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            </div>
          </div>

          {/* Contact Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" required style={inputStyle} placeholder="dev@quadroxtech.cloud" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input type="tel" required style={inputStyle} placeholder="+234..." value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
            </div>
          </div>

          {/* Password Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" required minLength={8} style={inputStyle} placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input type="password" required minLength={8} style={inputStyle} placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
            </div>
          </div>

          {/* Business Type Selection Cards */}
          <div>
            <label style={labelStyle}>What type of business do you own?</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* Starter Card */}
              <div 
                onClick={() => setFormData({...formData, businessType: 'STARTER'})}
                style={{ padding: '16px', border: `2px solid ${formData.businessType === 'STARTER' ? theme.primaryBlue : theme.borderLight}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: formData.businessType === 'STARTER' ? '#EFF6FF' : '#FFF', transition: 'all 0.2s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `5px solid ${formData.businessType === 'STARTER' ? theme.primaryBlue : theme.borderLight}`, backgroundColor: '#FFF' }}></div>
                  <strong style={{ color: theme.textDark, fontSize: '15px' }}>Starter Business</strong>
                </div>
                <p style={{ margin: '8px 0 0 26px', fontSize: '13px', color: theme.textMuted, lineHeight: '1.4' }}>
                  I'm testing my ideas with real customers, and preparing to register my company.
                </p>
              </div>

              {/* Registered Card */}
              <div 
                onClick={() => setFormData({...formData, businessType: 'REGISTERED'})}
                style={{ padding: '16px', border: `2px solid ${formData.businessType === 'REGISTERED' ? theme.primaryBlue : theme.borderLight}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: formData.businessType === 'REGISTERED' ? '#EFF6FF' : '#FFF', transition: 'all 0.2s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `5px solid ${formData.businessType === 'REGISTERED' ? theme.primaryBlue : theme.borderLight}`, backgroundColor: '#FFF' }}></div>
                  <strong style={{ color: theme.textDark, fontSize: '15px' }}>Registered Business</strong>
                </div>
                <p style={{ margin: '8px 0 0 26px', fontSize: '13px', color: theme.textMuted, lineHeight: '1.4' }}>
                  My business has the approval, documentation, and licences required to operate legally.
                </p>
              </div>
            </div>
          </div>

          {/* Developer Question */}
          <div>
            <label style={labelStyle}>Are you a software developer?</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', color: theme.textDark, cursor: 'pointer' }}>
                <input type="radio" name="developer" checked={formData.isDeveloper === 'yes'} onChange={() => setFormData({...formData, isDeveloper: 'yes'})} style={{ cursor: 'pointer' }} />
                Yes, I am
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', color: theme.textDark, cursor: 'pointer' }}>
                <input type="radio" name="developer" checked={formData.isDeveloper === 'no'} onChange={() => setFormData({...formData, isDeveloper: 'no'})} style={{ cursor: 'pointer' }} />
                No, I'm not
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ marginTop: '1rem', padding: '16px', backgroundColor: loading ? theme.textMuted : theme.primaryBlue, color: '#FFFFFF', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 'bold', width: '100%', transition: 'background-color 0.2s' }}>
            {loading ? 'Setting up workspace...' : 'Create my account'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '12px', color: theme.textMuted, marginTop: '1rem', lineHeight: '1.5' }}>
            By clicking "Create my account", you agree to PAYPAXA's terms of acceptable use.<br />
            Already have an account? <a href="/login" style={{ color: theme.primaryBlue, textDecoration: 'none', fontWeight: 'bold' }}>Sign in</a>
          </div>
        </form>
      </div>
    </div>
  );
}
