'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [businessType, setBusinessType] = useState<'STARTER' | 'REGISTERED'>('STARTER');
  
  const [formData, setFormData] = useState({
    tradingName: '',
    description: '',
    staffSize: '1 - 5 people',
    salesVolume: '',
    industry: '',
    category: '',
    legalBusinessName: '',
    registrationType: ''
  });

  const handleSaveAndNext = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we will eventually save formData to the database via API
    router.push('/dashboard/compliance/contact');
  };

  return (
    <form onSubmit={handleSaveAndNext}>
      <h2 className="page-title">Profile</h2>

      <div className="input-group" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ width: '80px' }}>
          <label className="input-label">Country</label>
          <input type="text" className="input-field" value="NG" disabled style={{ textAlign: 'center', fontWeight: 'bold', background: 'var(--border-color)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label className="input-label">Trading name <span className="required-star">*</span></label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Please enter a trading name" 
            required 
            value={formData.tradingName}
            onChange={e => setFormData({...formData, tradingName: e.target.value})}
          />
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">Description <span className="required-star">*</span></label>
        <textarea 
          className="input-textarea" 
          placeholder="Describe your business"
          required
          minLength={100}
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        ></textarea>
        <span className="help-text">Please enter at least 100 characters. Currently: {formData.description.length} chars.</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="input-group">
          <label className="input-label">Staff size <span className="required-star">*</span></label>
          <select className="input-select" value={formData.staffSize} onChange={e => setFormData({...formData, staffSize: e.target.value})}>
            <option value="1 - 5 people">1 - 5 people</option>
            <option value="6 - 50 people">6 - 50 people</option>
            <option value="50+ people">50+ people</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Annual projected sales volume <span className="required-star">*</span></label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>NGN</span>
            <input 
              type="text" 
              className="input-field" 
              style={{ paddingLeft: '56px' }}
              placeholder="0.00" 
              required 
              value={formData.salesVolume}
              onChange={e => setFormData({...formData, salesVolume: e.target.value.replace(/\D/g, '')})}
            />
          </div>
          <span className="help-text">We use your projected sales to tailor pricing, limits, and support for your business</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="input-group">
          <label className="input-label">Industry <span className="required-star">*</span></label>
          <select className="input-select" required value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}>
            <option value="">Select Industry...</option>
            <option value="digital_goods">Digital goods</option>
            <option value="ecommerce">E-commerce</option>
            <option value="education">Education</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Category <span className="required-star">*</span></label>
          <select className="input-select" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option value="">Select Category...</option>
            <option value="software">Digital - software applications</option>
            <option value="ebooks">Digital - ebooks and courses</option>
          </select>
        </div>
      </div>

      <div className="input-group">
        <label className="input-label" style={{ fontSize: '15px', marginBottom: '16px' }}>Business type <span className="required-star">*</span></label>
        
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', marginBottom: '12px', background: businessType === 'STARTER' ? 'var(--brand-light)' : 'transparent', borderColor: businessType === 'STARTER' ? 'var(--brand-primary)' : 'var(--border-color)', cursor: 'pointer' }} onClick={() => setBusinessType('STARTER')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input type="radio" checked={businessType === 'STARTER'} readOnly style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }} />
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Starter Business</div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', paddingLeft: '30px' }}>
            Submit your personal information and collect up to NGN 5,000,000 without registration documents.
          </div>
        </div>

        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', background: businessType === 'REGISTERED' ? 'var(--brand-light)' : 'transparent', borderColor: businessType === 'REGISTERED' ? 'var(--brand-primary)' : 'var(--border-color)', cursor: 'pointer' }} onClick={() => setBusinessType('REGISTERED')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input type="radio" checked={businessType === 'REGISTERED'} readOnly style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }} />
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Registered Business</div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', paddingLeft: '30px' }}>
            Upload valid business registration documents and get access to full features.
          </div>
        </div>
      </div>

      {/* DYNAMIC REGISTRATION BLOCK FOR REGISTERED BUSINESSES */}
      {businessType === 'REGISTERED' && (
        <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '24px' }}>Registration</h3>
          
          <div className="input-group">
            <label className="input-label">Legal business name <span className="required-star">*</span></label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Please enter a legal business name" 
              required={businessType === 'REGISTERED'}
              value={formData.legalBusinessName}
              onChange={e => setFormData({...formData, legalBusinessName: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Registration type <span className="required-star">*</span></label>
            <select 
              className="input-select" 
              required={businessType === 'REGISTERED'}
              value={formData.registrationType}
              onChange={e => setFormData({...formData, registrationType: e.target.value})}
            >
              <option value="">Select Registration Type...</option>
              <option value="business_name">Business Name Registration (BN)</option>
              <option value="private_limited">Private Limited Company (LTD)</option>
              <option value="public_limited">Public Limited Company (PLC)</option>
              <option value="ngo">Non-Governmental Organization (NGO)</option>
              <option value="incorporated_trustee">Incorporated Trustee</option>
            </select>
            <span className="help-text" style={{ marginTop: '8px' }}>
              {formData.registrationType === 'business_name' && "A business whose name has been reserved with the CAC. Registration numbers usually begin with BN."}
              {formData.registrationType === 'private_limited' && "A standard limited liability company. Registration numbers usually begin with RC."}
              {!formData.registrationType && "Select the exact structure listed on your CAC certificate."}
            </span>
          </div>
        </div>
      )}

      <button type="submit" className="btn-primary">Save and Continue</button>
    </form>
  );
}
