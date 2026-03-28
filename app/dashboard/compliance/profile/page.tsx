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
    router.push('/dashboard/compliance/contact');
  };

  return (
    <form onSubmit={handleSaveAndNext}>
      <h2 className="page-title">Profile</h2>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div style={{ width: '60px' }}>
          <label className="input-label">Country</label>
          <input type="text" className="input-field" value="NG" disabled style={{ textAlign: 'center', opacity: 0.6, cursor: 'not-allowed' }} />
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
        <span className="help-text">Please enter at least 100 characters. Currently: {formData.description.length}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
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
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '12px', opacity: 0.5, fontSize: '13px' }}>NGN</span>
            <input 
              type="text" 
              className="input-field" 
              style={{ paddingLeft: '48px' }}
              placeholder="0.00" 
              required 
              value={formData.salesVolume}
              onChange={e => setFormData({...formData, salesVolume: e.target.value.replace(/\D/g, '')})}
            />
          </div>
          <span className="help-text">Used to tailor pricing and limits.</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
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

      <div className="input-group" style={{ marginTop: '24px' }}>
        <label className="input-label" style={{ marginBottom: '12px' }}>Business type <span className="required-star">*</span></label>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', border: '1px solid rgba(128, 128, 128, 0.3)', borderRadius: '6px', cursor: 'pointer', backgroundColor: businessType === 'STARTER' ? 'rgba(128, 128, 128, 0.05)' : 'transparent' }}>
            <input type="radio" name="businessType" checked={businessType === 'STARTER'} onChange={() => setBusinessType('STARTER')} style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Starter Business</div>
              <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '2px' }}>Submit personal info and collect up to NGN 5,000,000 without CAC documents.</div>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', border: '1px solid rgba(128, 128, 128, 0.3)', borderRadius: '6px', cursor: 'pointer', backgroundColor: businessType === 'REGISTERED' ? 'rgba(128, 128, 128, 0.05)' : 'transparent' }}>
            <input type="radio" name="businessType" checked={businessType === 'REGISTERED'} onChange={() => setBusinessType('REGISTERED')} style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Registered Business</div>
              <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '2px' }}>Upload valid CAC documents and get access to full features and uncapped limits.</div>
            </div>
          </label>
        </div>
      </div>

      {businessType === 'REGISTERED' && (
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(128, 128, 128, 0.2)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Registration Documents</h3>
          
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
            <span className="help-text">
              {formData.registrationType === 'business_name' && "A business whose name has been reserved with the CAC. Reg numbers usually begin with BN."}
              {formData.registrationType === 'private_limited' && "A standard limited liability company. Reg numbers usually begin with RC."}
            </span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn-primary">Save and Continue</button>
      </div>
    </form>
  );
}
