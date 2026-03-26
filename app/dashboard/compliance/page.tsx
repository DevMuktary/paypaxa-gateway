'use client';

import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import Link from 'next/link';

export default function CompliancePage() {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState<'STARTER' | 'REGISTERED' | null>(null);
  const [isClient, setIsClient] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // We will wire this up to a real ML model in the next step
  const [isFaceDetected, setIsFaceDetected] = useState(false); 
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', phone: '', bvn: '', consent: false,
    industry: '', volume: '', supportEmail: '', disputeEmail: '', website: '',
    corporateName: '', rcNumber: '', tin: '', bankCode: '', accountNumber: ''
  });

  useEffect(() => { setIsClient(true); }, []);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  // Temporary capture function until we install the ML Face Tracker
  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    }
  };

  const CheckIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;

  const steps = [
    { id: 1, title: "Business Type", desc: "Select your legal entity" },
    { id: 2, title: "Profile Details", desc: "Personal and operational info" },
    { id: 3, title: "Identity Scan", desc: "Biometric face verification" },
    { id: 4, title: "Documentation", desc: "Upload required files" },
    { id: 5, title: "Settlement", desc: "Where you receive payouts" }
  ];

  if (!isClient) return null; 

  return (
    <div className="modern-layout">
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --brand-black: #0A0A0A;
          --brand-gray: #F4F4F5;
          --brand-border: #E4E4E7;
          --brand-primary: #000000;
          --text-main: #171717;
          --text-muted: #71717A;
        }
        
        html, body { margin: 0; padding: 0; background: #FFFFFF; font-family: 'Inter', system-ui, sans-serif; }
        
        .modern-layout { display: flex; height: 100vh; overflow: hidden; }
        
        /* LEFT SIDEBAR - SLEEK & DARK */
        .sidebar { width: 380px; background: var(--brand-black); color: white; padding: 48px; display: flex; flex-direction: column; justify-content: space-between; }
        .logo-area { font-size: 24px; font-weight: 800; letter-spacing: -1px; display: flex; align-items: center; gap: 12px; }
        
        .step-indicator { display: flex; flex-direction: column; gap: 32px; margin-top: 60px; }
        .step-item { display: flex; gap: 16px; opacity: 0.4; transition: 0.3s; }
        .step-item.active { opacity: 1; }
        .step-item.completed { opacity: 0.7; }
        
        .step-circle { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; flex-shrink: 0; }
        .step-item.active .step-circle { border-color: white; background: white; color: black; }
        .step-item.completed .step-circle { border-color: #10B981; background: #10B981; color: white; }
        
        .step-text h4 { margin: 0 0 4px 0; font-size: 15px; font-weight: 600; }
        .step-text p { margin: 0; font-size: 13px; color: #A1A1AA; }

        /* RIGHT CONTENT AREA - CLEAN & MINIMAL */
        .main-content { flex: 1; overflow-y: auto; padding: 60px 80px; background: #FFFFFF; display: flex; justify-content: center; }
        .form-container { width: 100%; max-width: 560px; padding-bottom: 80px; }
        
        .step-header { margin-bottom: 40px; }
        .step-header h2 { font-size: 32px; font-weight: 700; color: var(--text-main); margin: 0 0 12px 0; letter-spacing: -0.5px; }
        .step-header p { font-size: 16px; color: var(--text-muted); margin: 0; line-height: 1.5; }

        /* CLEAN INPUTS (STRIPE-LIKE) */
        .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-group.full { grid-column: 1 / -1; }
        .input-label { font-size: 13px; font-weight: 600; color: var(--text-main); }
        .modern-input { width: 100%; padding: 14px 16px; background: #FAFAFA; border: 1px solid var(--brand-border); border-radius: 12px; font-size: 15px; color: var(--text-main); outline: none; transition: 0.2s; box-sizing: border-box; }
        .modern-input:focus { background: #FFFFFF; border-color: black; box-shadow: 0 0 0 4px rgba(0,0,0,0.05); }

        /* SELECTION CARDS */
        .selection-cards { display: flex; flex-direction: column; gap: 16px; }
        .select-card { border: 2px solid var(--brand-border); border-radius: 16px; padding: 24px; cursor: pointer; transition: 0.2s; display: flex; gap: 20px; align-items: center; background: #FFFFFF; }
        .select-card:hover { border-color: #D4D4D8; }
        .select-card.active { border-color: black; background: #FAFAFA; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .card-radio { width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--brand-border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .select-card.active .card-radio::after { content: ''; width: 12px; height: 12px; background: black; border-radius: 50%; }
        .card-info h3 { margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: var(--text-main); }
        .card-info p { margin: 0; font-size: 14px; color: var(--text-muted); line-height: 1.5; }

        /* CAMERA UI */
        .camera-container { display: flex; flex-direction: column; align-items: center; }
        .camera-frame { position: relative; width: 340px; height: 440px; border-radius: 200px; overflow: hidden; background: #000; box-shadow: 0 20px 40px rgba(0,0,0,0.1); margin-bottom: 32px; border: 4px solid var(--brand-border); transition: border-color 0.3s; }
        .camera-frame.detected { border-color: #10B981; }
        .camera-video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
        .camera-overlay { position: absolute; inset: 0; box-shadow: inset 0 0 0 2000px rgba(255,255,255,0.2); pointer-events: none; z-index: 10; }
        
        .status-pill { background: #FAFAFA; border: 1px solid var(--brand-border); padding: 12px 24px; border-radius: 30px; font-size: 14px; font-weight: 600; color: var(--text-muted); margin-bottom: 24px; display: flex; align-items: center; gap: 8px; }
        .status-pill.success { background: #ECFDF5; border-color: #10B981; color: #10B981; }

        /* UPLOAD ZONE */
        .upload-zone { border: 2px dashed var(--brand-border); border-radius: 16px; padding: 40px 24px; text-align: center; cursor: pointer; transition: 0.2s; background: #FAFAFA; }
        .upload-zone:hover { border-color: black; background: #FFFFFF; }
        .upload-zone h4 { margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: var(--text-main); }
        .upload-zone p { margin: 0; font-size: 13px; color: var(--text-muted); }

        /* BOTTOM NAV */
        .nav-buttons { display: flex; justify-content: space-between; align-items: center; margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--brand-border); }
        .btn-ghost { background: transparent; border: none; font-size: 15px; font-weight: 600; color: var(--text-muted); cursor: pointer; transition: 0.2s; padding: 12px 0; }
        .btn-ghost:hover { color: var(--text-main); }
        .btn-solid { background: black; color: white; border: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .btn-solid:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.15); }
        .btn-solid:disabled { background: #E4E4E7; color: #A1A1AA; cursor: not-allowed; transform: none; box-shadow: none; }

        @media (max-width: 1024px) {
          .modern-layout { flex-direction: column; overflow: auto; }
          .sidebar { width: 100%; padding: 24px; flex-direction: row; align-items: center; }
          .step-indicator { display: none; } /* Hide steps on mobile for clean look */
          .main-content { padding: 32px 20px; }
          .input-grid { grid-template-columns: 1fr; }
        }
      `}} />

      {/* LEFT SIDEBAR */}
      <div className="sidebar">
        <div className="logo-area">
          <img src="https://paypaxa.com/logo.png" alt="" style={{ height: '32px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
          PAYPAXA
        </div>
        
        <div className="step-indicator">
          {steps.map(s => (
            <div key={s.id} className={`step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
              <div className="step-circle">
                {step > s.id ? <CheckIcon /> : s.id}
              </div>
              <div className="step-text">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '13px', color: '#71717A' }}>
          Secure, Encrypted, & CBN Compliant.
        </div>
      </div>

      {/* RIGHT MAIN CONTENT */}
      <div className="main-content">
        <div className="form-container">
          
          {/* STEP 1: BUSINESS TYPE */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="step-header">
                <h2>How is your business structured?</h2>
                <p>We need to know your legal entity type to verify you correctly.</p>
              </div>
              
              <div className="selection-cards">
                <div className={`select-card ${businessType === 'STARTER' ? 'active' : ''}`} onClick={() => setBusinessType('STARTER')}>
                  <div className="card-radio"></div>
                  <div className="card-info">
                    <h3>Starter Business (Unregistered)</h3>
                    <p>I am a freelancer, individual creator, or an unregistered business. I do not have a CAC certificate.</p>
                  </div>
                </div>
                
                <div className={`select-card ${businessType === 'REGISTERED' ? 'active' : ''}`} onClick={() => setBusinessType('REGISTERED')}>
                  <div className="card-radio"></div>
                  <div className="card-info">
                    <h3>Registered Business (Corporate)</h3>
                    <p>My business is legally registered with the Corporate Affairs Commission (CAC) and has a TIN.</p>
                  </div>
                </div>
              </div>

              <div className="nav-buttons" style={{ justifyContent: 'flex-end' }}>
                <button className="btn-solid" disabled={!businessType} onClick={handleNext}>Continue to Profile</button>
              </div>
            </div>
          )}

          {/* STEP 2: PROFILE */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="step-header">
                <h2>{businessType === 'REGISTERED' ? "Director & Corporate Details" : "Personal Details"}</h2>
                <p>Please enter your details exactly as they appear on your legal documents.</p>
              </div>

              {businessType === 'REGISTERED' && (
                <>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Company Info</h4>
                  <div className="input-grid">
                    <div className="input-group full">
                      <label className="input-label">Registered Corporate Name</label>
                      <input type="text" className="modern-input" placeholder="e.g. Quadrox Tech Limited" value={formData.corporateName} onChange={e => setFormData({...formData, corporateName: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">CAC Registration (RC)</label>
                      <input type="text" className="modern-input" placeholder="RC 1234567" value={formData.rcNumber} onChange={e => setFormData({...formData, rcNumber: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Tax ID (TIN)</label>
                      <input type="text" className="modern-input" placeholder="Enter FIRS TIN" value={formData.tin} onChange={e => setFormData({...formData, tin: e.target.value})} />
                    </div>
                  </div>
                </>
              )}

              <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Personal Info</h4>
              <div className="input-grid">
                <div className="input-group">
                  <label className="input-label">First Name</label>
                  <input type="text" className="modern-input" placeholder="Legal First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="input-group">
                  <label className="input-label">Last Name</label>
                  <input type="text" className="modern-input" placeholder="Legal Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
                <div className="input-group full">
                  <label className="input-label">Bank Verification Number (BVN)</label>
                  <input type="text" className="modern-input" placeholder="11-digit BVN" maxLength={11} value={formData.bvn} onChange={e => setFormData({...formData, bvn: e.target.value})} />
                </div>
              </div>

              <div className="nav-buttons">
                <button className="btn-ghost" onClick={handleBack}>Go Back</button>
                <button className="btn-solid" disabled={!formData.firstName || !formData.lastName || !formData.bvn} onClick={handleNext}>Continue to Verification</button>
              </div>
            </div>
          )}

          {/* STEP 3: LIVENESS (Prepared for ML implementation) */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="step-header" style={{ textAlign: 'center' }}>
                <h2>Face Verification</h2>
                <p>We need to verify that you are the true owner of this BVN.</p>
              </div>

              <div className="camera-container">
                <div className={`status-pill ${isFaceDetected ? 'success' : ''}`}>
                  {isFaceDetected ? <><div style={{width: 8, height: 8, borderRadius: '50%', background: '#10B981'}}></div> Face Detected</> : 'Waiting for face...'}
                </div>

                <div className={`camera-frame ${isFaceDetected ? 'detected' : ''}`}>
                  {capturedImage ? (
                    <div style={{ width: '100%', height: '100%', backgroundImage: `url(${capturedImage})`, backgroundSize: 'cover', transform: 'scaleX(-1)' }} />
                  ) : (
                    <>
                      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="camera-video" videoConstraints={{ facingMode: "user" }} />
                      <div className="camera-overlay"></div>
                    </>
                  )}
                </div>

                {capturedImage ? (
                  <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '340px' }}>
                    <button className="modern-input" style={{ background: 'white', cursor: 'pointer', flex: 1, textAlign: 'center' }} onClick={() => setCapturedImage(null)}>Retake</button>
                    <button className="btn-solid" style={{ flex: 1 }} onClick={handleNext}>Looks Good</button>
                  </div>
                ) : (
                  <button className="btn-solid" style={{ width: '100%', maxWidth: '340px' }} onClick={capturePhoto}>
                    Capture Photo
                  </button>
                )}
              </div>

              {capturedImage === null && (
                <div className="nav-buttons">
                  <button className="btn-ghost" onClick={handleBack}>Go Back</button>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: DOCUMENTS */}
          {step === 4 && (
            <div className="animate-fade-in">
              <div className="step-header">
                <h2>Required Documents</h2>
                <p>Please upload clear, legible copies of your documents.</p>
              </div>

              <div className="input-group" style={{ marginBottom: '24px' }}>
                <label className="input-label" style={{ marginBottom: '8px' }}>Valid Government ID</label>
                <div className="upload-zone">
                  <h4>Click to upload ID</h4>
                  <p>Passport, Driver's License, or NIN (Max 5MB)</p>
                </div>
              </div>

              {businessType === 'REGISTERED' && (
                <div className="input-group" style={{ marginBottom: '24px' }}>
                  <label className="input-label" style={{ marginBottom: '8px' }}>CAC Certificate</label>
                  <div className="upload-zone">
                    <h4>Click to upload CAC</h4>
                    <p>PDF or Image (Max 5MB)</p>
                  </div>
                </div>
              )}

              <div className="nav-buttons">
                <button className="btn-ghost" onClick={handleBack}>Go Back</button>
                <button className="btn-solid" onClick={handleNext}>Continue</button>
              </div>
            </div>
          )}

          {/* STEP 5: SETTLEMENT */}
          {step === 5 && (
            <div className="animate-fade-in">
              <div className="step-header">
                <h2>Payout Details</h2>
                <p>Where should we send your money when you withdraw?</p>
              </div>

              <div className="input-grid">
                <div className="input-group full">
                  <label className="input-label">Bank Name</label>
                  <select className="modern-input">
                    <option value="">Select a bank</option>
                    <option value="gtb">Guaranty Trust Bank</option>
                    <option value="zenith">Zenith Bank</option>
                    <option value="moniepoint">Moniepoint</option>
                  </select>
                </div>
                <div className="input-group full">
                  <label className="input-label">Account Number</label>
                  <input type="text" className="modern-input" placeholder="0000000000" maxLength={10} />
                </div>
              </div>

              <div className="nav-buttons">
                <button className="btn-ghost" onClick={handleBack}>Go Back</button>
                <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                  <button className="btn-solid">Submit Application</button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
