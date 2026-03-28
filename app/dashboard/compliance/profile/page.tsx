'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Tooltip Component
const TooltipLabel = ({ label, required, tooltipText }: { label: string, required?: boolean, tooltipText?: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <label className="input-label">
          {label} {required && <span className="required-star">*</span>}
        </label>
        {tooltipText && (
          <button 
            type="button" 
            onClick={() => setShow(!show)} 
            style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-light)', cursor: 'pointer', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', padding: 0, opacity: 0.7 }}
            title="Click for more info"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </button>
        )}
      </div>
      {show && tooltipText && (
        <div style={{ fontSize: '13px', padding: '10px 12px', backgroundColor: 'var(--bg-overlay)', borderRadius: '6px', marginTop: '6px', borderLeft: '3px solid var(--brand-primary)', opacity: 0.9, lineHeight: 1.4 }}>
          {tooltipText}
        </div>
      )}
    </div>
  );
};

// Legally refined, distinct industry list
const INDUSTRIES = [
  { id: 'agriculture', name: 'Agriculture', desc: 'Farming, livestock, fisheries, logging, and forestry operations.' },
  { id: 'automotive', name: 'Automotive', desc: 'Vehicle manufacturing, sales, repairs, and auto parts distribution.' },
  { id: 'clothing', name: 'Clothing & Accessories', desc: 'Apparel, footwear, jewelry, and wearable fashion accessories.' },
  { id: 'digital_goods', name: 'Digital Goods', desc: 'Intangible retail products like software, digital art, and subscriptions.' },
  { id: 'digital_services', name: 'Digital Services', desc: 'Cloud software, online marketing, web hosting, and virtual consulting.' },
  { id: 'education', name: 'Education', desc: 'Public and private institutions offering training, schooling, and academic programs.' },
  { id: 'electronics', name: 'Electronics', desc: 'Consumer tech, gadgets, computers, and home appliances.' },
  { id: 'financial_services', name: 'Financial Services', desc: 'Banks, lenders, brokers, insurers, and investment agencies.' },
  { id: 'gaming', name: 'Gaming', desc: 'Betting, wagering, lotteries, and prediction platforms.' },
  { id: 'general_services', name: 'General Services', desc: 'Miscellaneous business operations including cleaning, maintenance, and trade work.' },
  { id: 'groceries', name: 'Grocery & Supermarket', desc: 'Daily consumables, fresh produce, and household supplies.' },
  { id: 'hardware', name: 'Hardware', desc: 'Physical tools, construction materials, and mechanical equipment.' },
  { id: 'healthcare', name: 'Health', desc: 'Medical, rehabilitative, and preventive care providers and facilities.' },
  { id: 'hospitality', name: 'Hospitality', desc: 'Lodging, restaurants, event management, and tourism services.' },
  { id: 'legal', name: 'Legal Services', desc: 'Law firms, attorneys, and professional dispute resolution services.' },
  { id: 'leisure', name: 'Leisure & Entertainment', desc: 'Sports, recreation, events, and digital media entertainment.' },
  { id: 'logistics', name: 'Logistics', desc: 'Supply chain, warehousing, freight, and delivery services.' },
  { id: 'non_profit', name: 'Non-profits', desc: 'Charities, NGOs, religious bodies, and social advocacy groups.' },
  { id: 'physical_goods', name: 'Physical Goods', desc: 'Tangible retail products purchased and transported physically.' },
  { id: 'professional_services', name: 'Professional Services', desc: 'B2B consulting, accounting, auditing, and corporate services.' },
  { id: 'real_estate', name: 'Real Estate', desc: 'Property sales, leasing, management, and development.' },
  { id: 'sports', name: 'Sports & Recreation', desc: 'Gyms, athletic gear, personal training, and outdoor activities.' },
  { id: 'transportation', name: 'Transport', desc: 'Transit networks, ride-hailing, shipping lines, and commercial transit.' },
  { id: 'travel', name: 'Travel', desc: 'Airlines, booking agencies, tourism operations, and vehicle rentals.' },
  { id: 'utilities', name: 'Utilities', desc: 'Essential public services like power, water, waste, and telecommunications.' }
];

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

  const selectedIndustryObj = INDUSTRIES.find(ind => ind.id === formData.industry);

  return (
    <form onSubmit={handleSaveAndNext}>
      <h2 className="page-title">Profile</h2>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ width: '60px' }}>
          <TooltipLabel label="Country" />
          <input type="text" className="input-field" value="NG" disabled style={{ textAlign: 'center', opacity: 0.5, cursor: 'not-allowed' }} />
        </div>
        <div style={{ flex: 1 }}>
          <TooltipLabel label="Trading name" required tooltipText="The name your customers know you by. This will appear on your receipts, emails, and checkout pages." />
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
        <TooltipLabel label="Description" required tooltipText="A clear, detailed explanation of the products or services you offer. We use this to understand your business model." />
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div>
          <TooltipLabel label="Staff size" required tooltipText="The total number of employees currently working at your business." />
          <select className="input-select" value={formData.staffSize} onChange={e => setFormData({...formData, staffSize: e.target.value})}>
            <option value="1 - 5 people">1 - 5 people</option>
            <option value="6 - 50 people">6 - 50 people</option>
            <option value="50+ people">50+ people</option>
          </select>
        </div>

        <div>
          <TooltipLabel label="Annual projected sales volume" required tooltipText="Your estimated total processing volume in a year. We use your projected sales to tailor pricing, limits, and support for your business." />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '12px', opacity: 0.5, fontSize: '13px', fontWeight: 600 }}>NGN</span>
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
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div>
          <TooltipLabel label="Industry" required tooltipText="The broad industry that best fits your business operations." />
          <select className="input-select" required value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}>
            <option value="">Select Industry...</option>
            {INDUSTRIES.map(ind => (
              <option key={ind.id} value={ind.id}>{ind.name}</option>
            ))}
          </select>
          {selectedIndustryObj && (
            <span className="help-text" style={{ color: 'var(--brand-primary)', opacity: 0.9 }}>
              {selectedIndustryObj.desc}
            </span>
          )}
        </div>

        <div>
          <TooltipLabel label="Category" required tooltipText="A more specific category within your industry." />
          <select className="input-select" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option value="">Select Category...</option>
            <option value="software">Digital - software applications</option>
            <option value="ebooks">Digital - ebooks and courses</option>
            <option value="physical_retail">Physical Retail</option>
            <option value="services">Professional Consulting</option>
          </select>
        </div>
      </div>

      <div className="input-group">
        <TooltipLabel label="Business type" required tooltipText="Select whether you are legally registered with the Corporate Affairs Commission (CAC) or operating as an individual." />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px', border: '1px solid var(--border-light)', borderRadius: '6px', cursor: 'pointer', backgroundColor: businessType === 'STARTER' ? 'var(--bg-overlay)' : 'transparent', borderColor: businessType === 'STARTER' ? 'var(--brand-primary)' : 'var(--border-light)' }}>
            <input type="radio" name="businessType" checked={businessType === 'STARTER'} onChange={() => setBusinessType('STARTER')} style={{ marginTop: '2px', accentColor: 'var(--brand-primary)' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Starter Business</div>
              <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '4px', lineHeight: 1.4 }}>Submit your personal information and collect up to NGN 5,000,000 without registration documents.</div>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px', border: '1px solid var(--border-light)', borderRadius: '6px', cursor: 'pointer', backgroundColor: businessType === 'REGISTERED' ? 'var(--bg-overlay)' : 'transparent', borderColor: businessType === 'REGISTERED' ? 'var(--brand-primary)' : 'var(--border-light)' }}>
            <input type="radio" name="businessType" checked={businessType === 'REGISTERED'} onChange={() => setBusinessType('REGISTERED')} style={{ marginTop: '2px', accentColor: 'var(--brand-primary)' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Registered Business</div>
              <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '4px', lineHeight: 1.4 }}>Upload valid business registration documents and get access to full features.</div>
            </div>
          </label>
        </div>
      </div>

      {/* DYNAMIC REGISTRATION BLOCK FOR REGISTERED BUSINESSES */}
      {businessType === 'REGISTERED' && (
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Registration Details</h3>
          
          <div className="input-group">
            <TooltipLabel label="Legal business name" required tooltipText="The exact company name written on your CAC certificate." />
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
            <TooltipLabel label="Registration type" required tooltipText="The specific legal structure of your business as registered with the Corporate Affairs Commission." />
            <select 
              className="input-select" 
              required={businessType === 'REGISTERED'}
              value={formData.registrationType}
              onChange={e => setFormData({...formData, registrationType: e.target.value})}
            >
              <option value="">Select Registration Type...</option>
              <option value="incorporated_trustees">Incorporated Trustees</option>
              <option value="business_name">Business Name Registration</option>
              <option value="free_zone">Free Zone Entity</option>
              <option value="government">Government Entity</option>
              <option value="private_gov_approval">Private entity created by Government Approval</option>
              <option value="cooperative">Cooperative Society</option>
              <option value="public_plc">Public Incorporated Company</option>
              <option value="private_ltd">Private Incorporated Company</option>
            </select>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn-primary">Save and Continue</button>
      </div>
    </form>
  );
}
