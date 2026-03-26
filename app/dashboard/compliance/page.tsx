'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import Link from 'next/link';

export default function CompliancePage() {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState<'STARTER' | 'REGISTERED' | null>(null);
  const [isClient, setIsClient] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const [livenessState, setLivenessState] = useState<'READY' | 'SCANNING' | 'REVIEW'>('READY');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', phone: '', bvn: '', consent: false,
    industry: '', volume: '', supportEmail: '', disputeEmail: '',
    corporateName: '', rcNumber: '', tin: '', bankCode: '', accountNumber: ''
  });

  useEffect(() => setIsClient(true), []);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setLivenessState('REVIEW');
    }
  }, [webcamRef]);

  const retakePhoto = () => {
    setCapturedImage(null);
    setLivenessState('READY');
  };

  const stepsList = [
    { id: 1, title: 'Business Type', desc: 'Select your entity' },
    { id: 2, title: 'Profile & BVN', desc: 'Basic information' },
    { id: 3, title: 'Identity Scan', desc: 'Facial verification' },
    { id: 4, title: 'Documents', desc: 'Required uploads' },
    { id: 5, title: 'Settlement', desc: 'Bank details' }
  ];

  if (!isClient) return null; 

  return (
    <div className="compliance-layout">
      <style dangerouslySetInnerHTML={{__html: `
        /* ENTERPRISE SPLIT-SCREEN LAYOUT */
        .compliance-layout { display: flex; min-height: 100vh; background-color: var(--bg-main); font-family: 'Inter', sans-serif; }
        
        /* LEFT SIDEBAR */
        .sidebar { width: 340px; background-color: var(--bg-panel); border-right: 1px solid var(--border-color); padding: 40px 32px; display: flex; flex-direction: column; position: fixed; height: 100vh; overflow-y: auto; }
        .brand-logo { font-size: 20px; font-weight: 800; color: var(--text-high); letter-spacing: -0.5px; margin-bottom: 60px; display: flex; align-items: center; gap: 8px; }
        
        .step-item { display: flex; gap: 16px; position: relative; padding-bottom: 32px; opacity: 0.5; transition: 0.3s; }
        .step-item.active { opacity: 1; }
        .step-item.completed { opacity: 1; }
        .step-item:last-child { padding-bottom: 0; }
        
        .step-line { position: absolute; left: 11px; top: 32px; bottom: 0; width: 2px; background: var(--border-color); }
        .step-item.completed .step-line { background: var(--brand-primary); }
        
        .step-indicator { width: 24px; height: 24px; border-radius: 50%; background: var(--bg-main); border: 2px solid var(--border-color); display: flex; align-items: center; justify-content: center; z-index: 1; font-size: 10px; font-weight: 700; color: var(--text-med); transition: 0.3s; }
        .step-item.active .step-indicator { border-color: var(--brand-primary); box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15); color: var(--brand-primary); }
        .step-item.completed .step-indicator { background: var(--brand-primary); border-color: var(--brand-primary); color: white; }
        
        .step-text h4 { margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: var(--text-high); }
        .step-text p { margin: 0; font-size: 12px; color: var(--text-med); }

        /* RIGHT CONTENT */
        .content-area { flex: 1; margin-left: 340px; padding: 60px 80px; max-width: 800px; }
        .form-header { margin-bottom: 48px; }
        .form-title { font-size: 32px; font-weight: 700; color: var(--text-high); letter-spacing: -1px; margin: 0 0 12px 0; }
        .form-subtitle { font-size: 16px; color: var(--text-med); line-height: 1.6; margin: 0; }

        /* MODERN INPUTS */
        .input-group { margin-bottom: 24px; }
        .input-group.half { width: calc(50% - 12px); display: inline-block; vertical-align: top; }
        .input-group.half:nth-child(even) { margin-left: 24px; }
        
        .label { display: block; font-size: 13px; font-weight: 500; color: var(--text-med); margin-bottom: 8px; }
        .input { width: 100%; padding: 16px 20px; background: transparent; border: 1px solid var(--border-color); border-radius: 12px; font-size: 15px; color: var(--text-high); transition: all 0.2s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
        .input:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(59,130,246,0.1); background: var(--bg-panel); }
        
        /* SELECTION CARDS */
        .selection-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 32px; }
        .select-card { border: 1px solid var(--border-color); border-radius: 16px; padding: 32px 24px; cursor: pointer; transition: all 0.2s ease; background: var(--bg-panel); }
        .select-card:hover { border-color: var(--text-med); }
        .select-card.active { border-color: var(--brand-primary); background: rgba(59, 130, 246, 0.03); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08); }
        .card-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(59, 130, 246, 0.1); color: var(--brand-primary); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .card-title { font-size: 18px; font-weight: 600; color: var(--text-high); margin-bottom: 8px; }
        .card-desc { font-size: 14px; color: var(--text-med); line-height: 1.5; }

        /* STRICT LIVENESS CAMERA */
        .biometric-frame { position: relative; width: 100%; max-width: 400px; aspect-ratio: 3/4; border-radius: 24px; overflow: hidden; background: #000; margin: 0 auto 32px auto; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .biometric-video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
        .biometric-mask { position: absolute; inset: 0; background: radial-gradient(ellipse 70% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 45%); z-index: 10; pointer-events: none; }
        .biometric-guide { position: absolute; inset: 40px 60px 80px 60px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; z-index: 11; pointer-events: none; border-style: dashed; }
        
        .camera-action-box { text-align: center; }
        .instruction-text { font-size: 16px; font-weight: 500; color: var(--text-high); margin-bottom: 24px; }

        /* BUTTONS */
        .action-bar { display: flex; align-items: center; justify-content: space-between; margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--border-color); }
        .btn-text { background: none; border: none; color: var(--text-med); font-size: 15px; font-weight: 500; cursor: pointer; transition: 0.2s; padding: 12px 0; }
        .btn-text:hover { color: var(--text-high); }
        .btn-solid { background: var(--text-high); color: var(--bg-panel); border: none; padding: 16px 32px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-solid:hover { transform: translateY(-1px); box-shadow: 0 8px 16px rgba(0,0,0,0.1); }
        .btn-solid:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }

        /* FILE UPLOAD */
        .upload-area { border: 1px dashed var(--text-low); border-radius: 16px; padding: 40px; text-align: center; cursor: pointer; transition: 0.2s; background: var(--bg-main); }
        .upload-area:hover { border-color: var(--brand-primary); background: var(--bg-panel); }

        @media (max-width: 1024px) {
          .compliance-layout { flex-direction: column; }
          .sidebar { position: relative; width: 100%; height: auto; border-right: none; border-bottom: 1px solid var(--border-color); padding: 24px; flex-direction: row; overflow-x: auto; }
          .brand-logo { margin-bottom: 0; margin-right: 40px; }
          .step-item { padding-bottom: 0; margin-right: 32px; }
          .step-line { display: none; }
          .step-text { display: none; }
          .content-area { margin-left: 0; padding: 40px 24px; max-width: 100%; }
          .input-group.half { width: 100%; margin-left: 0 !important; }
          .selection-grid { grid-template-columns: 1fr; }
        }
      `}} />

      {/* LEFT SIDEBAR (Progress) */}
      <aside className="sidebar">
        <div className="brand-logo">
          <img src="https://paypaxa.com/logo.png" alt="PAYPAXA" style={{ height: '24px' }} />
          PAYPAXA
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {stepsList.map((s, idx) => (
            <div key={s.id} className={`step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
              {idx !== stepsList.length - 1 && <div className="step-line"></div>}
              <div className="step-indicator">
                {step > s.id ? '✓' : s.id}
              </div>
              <div className="step-text">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="content-area">
        
        {step === 1 && (
          <div className="form-section">
            <div className="form-header">
              <h1 className="form-title">Business Classification</h1>
              <p className="form-subtitle">Select the legal structure of the business you are verifying. This determines your compliance requirements.</p>
            </div>

            <div className="selection-grid">
              <div className={`select-card ${businessType === 'STARTER' ? 'active' : ''}`} onClick={() => setBusinessType('STARTER')}>
                <div className="card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div className="card-title">Starter / Freelance</div>
                <div className="card-desc">Operating as an individual. No Corporate Affairs Commission (CAC) registration.</div>
              </div>
              
              <div className={`select-card ${businessType === 'REGISTERED' ? 'active' : ''}`} onClick={() => setBusinessType('REGISTERED')}>
                <div className="card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path></svg>
                </div>
                <div className="card-title">Registered Corporate</div>
                <div className="card-desc">A legally registered entity with the CAC and a valid Tax Identification Number (TIN).</div>
              </div>
            </div>

            <div className="action-bar" style={{ justifyContent: 'flex-end' }}>
              <button className="btn-solid" disabled={!businessType} onClick={handleNext}>Continue to Profile</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <div className="form-header">
              <h1 className="form-title">Identity Profile</h1>
              <p className="form-subtitle">Provide exact legal details matching your government-issued documents.</p>
            </div>
            
            {businessType === 'REGISTERED' && (
              <>
                <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-med)', letterSpacing: '1px', marginBottom: '24px' }}>Corporate Data</h3>
                <div className="input-group">
                  <label className="label">Registered Business Name</label>
                  <input type="text" className="input" value={formData.corporateName} onChange={e => setFormData({...formData, corporateName: e.target.value})} />
                </div>
                <div className="input-group half">
                  <label className="label">CAC Number (RC/BN)</label>
                  <input type="text" className="input" value={formData.rcNumber} onChange={e => setFormData({...formData, rcNumber: e.target.value})} />
                </div>
                <div className="input-group half">
                  <label className="label">Tax ID (TIN)</label>
                  <input type="text" className="input" value={formData.tin} onChange={e => setFormData({...formData, tin: e.target.value})} />
                </div>
                <div style={{ height: '32px' }}></div>
              </>
            )}

            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-med)', letterSpacing: '1px', marginBottom: '24px' }}>{businessType === 'REGISTERED' ? "Director's Data" : "Personal Data"}</h3>
            
            <div className="input-group half">
              <label className="label">Legal First Name</label>
              <input type="text" className="input" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div className="input-group half">
              <label className="label">Legal Last Name</label>
              <input type="text" className="input" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
            
            <div className="input-group half">
              <label className="label">Date of Birth</label>
              <input type="date" className="input" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
            </div>
            <div className="input-group half">
              <label className="label">Phone Number</label>
              <input type="tel" className="input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>

            <div className="input-group">
              <label className="label">Bank Verification Number (BVN)</label>
              <input type="text" className="input" maxLength={11} value={formData.bvn} onChange={e => setFormData({...formData, bvn: e.target.value})} />
            </div>

            <div className="action-bar">
              <button className="btn-text" onClick={handleBack}>Go Back</button>
              <button className="btn-solid" disabled={!formData.firstName || !formData.lastName || formData.bvn.length !== 11} onClick={handleNext}>Proceed to Scan</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-section">
            <div className="form-header" style={{ textAlign: 'center' }}>
              <h1 className="form-title">Facial Verification</h1>
              <p className="form-subtitle">We need a clear picture of your face to match against your BVN database.</p>
            </div>

            <div className="biometric-frame">
              {livenessState === 'REVIEW' && capturedImage ? (
                <div style={{ width: '100%', height: '100%', backgroundImage: `url(${capturedImage})`, backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scaleX(-1)' }} />
              ) : (
                <>
                  <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="biometric-video" videoConstraints={{ facingMode: "user" }} />
                  <div className="biometric-mask"></div>
                  <div className="biometric-guide"></div>
                </>
              )}
            </div>

            <div className="camera-action-box">
              {livenessState === 'READY' && (
                <>
                  <div className="instruction-text">Center your face inside the oval frame. Ensure you are in a well-lit room.</div>
                  <button className="btn-solid" onClick={capturePhoto} style={{ width: '100%', maxWidth: '300px' }}>Capture Photo</button>
                </>
              )}
              
              {livenessState === 'REVIEW' && (
                <>
                  <div className="instruction-text" style={{ color: '#10B981' }}>Photo Captured. Is your face clear?</div>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button className="btn-text" onClick={retakePhoto} style={{ border: '1px solid var(--border-color)', padding: '16px 24px', borderRadius: '12px' }}>Retake</button>
                    <button className="btn-solid" onClick={handleNext} style={{ background: '#10B981', color: 'white' }}>Looks Good, Continue</button>
                  </div>
                </>
              )}
            </div>
            
            {livenessState === 'READY' && (
              <div className="action-bar">
                <button className="btn-text" onClick={handleBack}>Go Back</button>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="form-section">
            <div className="form-header">
              <h1 className="form-title">Upload Documents</h1>
              <p className="form-subtitle">Upload high-quality scans or photos of the required legal documents.</p>
            </div>

            <div className="input-group">
              <label className="label">Government Issued ID ({businessType === 'REGISTERED' ? "Director" : "Personal"})</label>
              <div className="upload-area">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2" style={{ marginBottom: '12px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <div style={{ fontWeight: '600', color: 'var(--text-high)', marginBottom: '4px' }}>Click to upload ID</div>
                <div style={{ fontSize: '12px', color: 'var(--text-med)' }}>Passport, Driver's License, or NIN (Max 5MB)</div>
              </div>
            </div>

            <div className="input-group">
              <label className="label">Proof of Address</label>
              <div className="upload-area">
                <div style={{ fontWeight: '600', color: 'var(--text-high)', marginBottom: '4px' }}>Click to upload Utility Bill</div>
                <div style={{ fontSize: '12px', color: 'var(--text-med)' }}>Must be issued within the last 3 months</div>
              </div>
            </div>

            {businessType === 'REGISTERED' && (
              <div className="input-group">
                <label className="label">CAC Certificate</label>
                <div className="upload-area">
                  <div style={{ fontWeight: '600', color: 'var(--text-high)' }}>Click to upload Corporate Certificate</div>
                </div>
              </div>
            )}

            <div className="action-bar">
              <button className="btn-text" onClick={handleBack}>Go Back</button>
              <button className="btn-solid" onClick={handleNext}>Proceed to Bank Details</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="form-section">
            <div className="form-header">
              <h1 className="form-title">Settlement Account</h1>
              <p className="form-subtitle">Where should we send your money? The account name must match your legal business or personal profile.</p>
            </div>

            <div className="input-group">
              <label className="label">Select Bank</label>
              <select className="input">
                <option value="">Choose a bank...</option>
                <option value="gtb">Guaranty Trust Bank</option>
                <option value="zenith">Zenith Bank</option>
                <option value="moniepoint">Moniepoint MFB</option>
              </select>
            </div>
            
            <div className="input-group">
              <label className="label">Account Number</label>
              <input type="text" className="input" maxLength={10} />
            </div>

            <div className="action-bar">
              <button className="btn-text" onClick={handleBack}>Go Back</button>
              <Link href="/dashboard" className="btn-solid" style={{ textDecoration: 'none' }}>Submit Application</Link>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
