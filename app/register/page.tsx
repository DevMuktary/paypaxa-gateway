'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: '', password: '', businessName: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus({ type: 'success', message: data.message });
      setFormData({ email: '', password: '', businessName: '' });
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Create PAYPAXA Account</h2>
        
        {status.message && (
          <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', backgroundColor: status.type === 'error' ? '#fee2e2' : '#dcfce3', color: status.type === 'error' ? '#991b1b' : '#166534', fontSize: '14px' }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: '500' }}>Business Name</label>
            <input 
              type="text" 
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
              value={formData.businessName}
              onChange={(e) => setFormData({...formData, businessName: e.target.value})}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: '500' }}>Work Email</label>
            <input 
              type="email" 
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px', fontWeight: '500' }}>Secure Password</label>
            <input 
              type="password" 
              required
              minLength={8}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ marginTop: '10px', padding: '12px', backgroundColor: loading ? '#9ca3af' : '#000000', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
