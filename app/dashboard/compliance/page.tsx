'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import Link from 'next/link';

export default function CompliancePage() {
  // Wizard State
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState<'STARTER' | 'REGISTERED' | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Liveness Camera State
  const webcamRef = useRef<Webcam>(null);
  const [livenessPhase, setLivenessPhase] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    bvn: '',
    consent: false,
    industry: '',
    volume: '',
    supportEmail: '',
    disputeEmail: '',
    phone: '',
    website: '',
    rcNumber: '',
    tin: '',
    bankCode: '',
    accountNumber: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  // --- LIVENESS CAPTURE SEQUENCE ---
  const livenessInstructions = [
    "Position your face inside the oval.",
    "Slowly turn your head to the LEFT.",
    "Now, turn your head to the RIGHT.",
    "Look straight, smile and open your mouth.",
    "Hold still... Capturing your identity."
  ];

  const startLivenessSequence = () => {
    setLivenessPhase(1);
    
    // Simulate the liveness checks with timeouts
    setTimeout(() => setLivenessPhase(2), 3000);
    setTimeout(() => setLivenessPhase(3), 6000);
    setTimeout(() => setLivenessPhase(4), 9000);
    
    setTimeout(() => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        setLivenessPhase(5); // Capture complete
      }
    }, 11000);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setLivenessPhase(0);
  };

  // --- ICONS ---
  const CheckIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
  const BuildingIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>;
  const UserIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

  if (!isClient) return null; // Prevent hydration errors with the Webcam

  return (
    <div className="kyc-container">
      <style dangerouslySetInnerHTML={{__html: `
        .kyc-container { padding: 40px; max-width: 900px; margin: 0 auto; min-height: 100vh; }
        .page-title { font-size: 28px; font-weight: 800; margin: 0 0 8px 0; color: var(--text-high); letter-spacing: -0.5px; }
        .page-sub { color: var(--text-med); font-size: 15px; margin: 0 0 40px 0; line-height: 1.5; }

        /* PROGRESS BAR */
        .progress-container { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; position: relative; }
        .progress-line { position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: var(--border-color); z-index: 1; transform: translateY(-50%); }
        .progress-line-fill { position: absolute; top: 50%; left: 0; height: 2px; background: var(--brand-primary); z-index: 2; transform: translateY(-50%); transition: width 0.3s ease; }
        .progress-step { position: relative; z-index: 3; background: var(--bg-main); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; border: 2px solid var(--border-color); color: var(--text-med); transition: 0.3s; }
        .progress-step.active { border-color: var(--brand-primary); color: var(--brand-primary); box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        .progress-step.completed { background: var(--brand-primary); border-color: var(--brand-primary); color: white; }

        /* MAIN CARD */
        .kyc-card { background-color: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 24px; padding: 40px; box-shadow: var(--shadow-soft); }
        .section-title { font-size: 20px; font-weight: 700; color: var(--text-high); margin: 0 0 24px 0; padding-bottom: 16px; border-bottom: 1px solid var(--border-color); }

        /* SELECTION BOXES */
        .type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .type-box { border: 2px solid var(--border-color); border-radius: 16px; padding: 32px 24px; text-align: center; cursor: pointer; transition: 0.2s; background: transparent; }
        .type-box:hover { border-color: var(--text-med); background: var(--nav-hover); }
        .type-box.selected { border-color: var(--brand-primary); background: var(--nav-active); }
        .type-icon { color: var(--brand-primary); margin-bottom: 16px; display: flex; justify-content: center; }
        .type-title { font-size: 18px; font-weight: 700; color: var(--text-high); margin-bottom: 8px; }
        .type-desc { font-size: 13px; color: var(--text-med); line-height: 1.5; }

        /* FORM ELEMENTS */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { margin-bottom: 20px; }
        .form-group.full { grid-column: 1 / -1; }
        .form-label { display: block; font-size: 13px; font-weight: 600; color: var(--text-high); margin-bottom: 8px; }
        .form-input, .form-select { width: 100%; padding: 14px 16px; background-color: var(--bg-main); border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-high); font-size: 15px; outline: none; transition: 0.2s; }
        .form-input:focus, .form-select:focus { border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        
        .consent-box { display: flex; align-items: flex-start; gap: 12px; background: rgba(59, 130, 246, 0.05); padding: 16px; border-radius: 12px; border: 1px dashed var(--brand-primary); margin-top: 8px; }
        .consent-box input { margin-top: 4px; width: 18px; height: 18px; cursor: pointer; }
        .consent-box label { font-size: 13px; color: var(--text-high); line-height: 1.5; cursor: pointer; }

        /* FILE UPLOAD */
        .file-upload-zone { border: 2px dashed var(--border-color); border-radius: 12px; padding: 32px; text-align: center; background: var(--bg-main); transition: 0.2s; cursor: pointer; }
        .file-upload-zone:hover { border-color: var(--brand-primary); background: var(--nav-active); }
        .file-upload-text { font-size: 14px; font-weight: 600; color: var(--brand-primary); margin-bottom: 4px; }
        .file-upload-sub { font-size: 12px; color: var(--text-med); }

        /* LIVENESS CAMERA */
        .liveness-container { display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .camera-wrapper { position: relative; width: 320px; height: 420px; border-radius: 200px; overflow: hidden; margin: 0 auto 32px auto; box-shadow: 0 0 0 8px var(--bg-main), 0 0 0 10px var(--brand-primary); background: #000; }
        .camera-video { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); } /* Mirror effect */
        .camera-overlay { position: absolute; inset: 0; box-shadow: inset 0 0 0 2000px rgba(0,0,0,0.4); border-radius: 200px; z-index: 10; pointer-events: none; }
        .camera-mask { position: absolute; inset: 20px; border-radius: 200px; border: 2px dashed rgba(255,255,255,0.8); z-index: 11; box-shadow: 0 0 0 2000px rgba(0,0,0,0.5); }
        .camera-instruction { font-size: 20px; font-weight: 700; color: var(--text-high); text-align: center; margin-bottom: 24px; min-height: 60px; display: flex; align-items: center; justify-content: center; }
        .camera-instruction.active { color: var(--brand-primary); animation: pulseText 1s infinite alternate; }
        
        @keyframes pulseText { from { opacity: 0.8; transform: scale(0.98); } to { opacity: 1; transform: scale(1.02); } }

        /* BUTTONS */
        .btn-row { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--border-color); }
        .btn-back { padding: 14px 24px; background: transparent; border: 1px solid var(--border-color); color: var(--text-high); border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; transition: 0.2s; }
        .btn-back:hover { background: var(--bg-main); }
        .btn-primary { padding: 14px 32px; background: var(--brand-primary); color: white; border: none; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

        @media (max-width: 768px) {
          .content-pad { padding: 20px 16px; }
          .type-grid, .form-grid { grid-template-columns: 1fr; }
          .kyc-card { padding: 24px 20px; }
          .camera-wrapper { width: 260px; height: 340px; }
        }
      `}} />

      <div>
        <h1 className="page-title">Compliance Setup</h1>
        <p className="page-sub">Verify your identity to unlock live API keys and withdraw funds to your bank.</p>
      </div>

      <div className="progress-container">
        <div className="progress-line"></div>
        <div className="progress-line-fill" style={{ width: \`\${(step - 1) * 25}%\` }}></div>
        {[1, 2, 3, 4, 5].map(num => (
          <div key={num} className={\`progress-step \${step === num ? 'active' : ''} \${step > num ? 'completed' : ''}\`}>
            {step > num ? <CheckIcon /> : num}
          </div>
        ))}
      </div>

      <div className="kyc-card">
        
        {/* STEP 1: BUSINESS TYPE */}
        {step === 1 && (
          <div>
            <h2 className="section-title">Select your business type</h2>
            <div className="type-grid">
              <div className={\`type-box \${businessType === 'STARTER' ? 'selected' : ''}\`} onClick={() => setBusinessType('STARTER')}>
                <div className="type-icon"><UserIcon /></div>
                <div className="type-title">Starter Business</div>
                <div className="type-desc">I am a freelancer, creator, or unregistered business. I don't have a CAC certificate yet.</div>
              </div>
              
              <div className={\`type-box \${businessType === 'REGISTERED' ? 'selected' : ''}\`} onClick={() => setBusinessType('REGISTERED')}>
                <div className="type-icon"><BuildingIcon /></div>
                <div className="type-title">Registered Business</div>
                <div className="type-desc">I have a registered Corporate Affairs Commission (CAC) certificate and TIN.</div>
              </div>
            </div>

            <div className="btn-row" style={{ justifyContent: 'flex-end' }}>
              <button className="btn-primary" disabled={!businessType} onClick={handleNext}>Continue to Profile →</button>
            </div>
          </div>
        )}

        {/* STEP 2: PROFILE & BVN */}
        {step === 2 && (
          <div>
            <h2 className="section-title">Business & Identity Profile</h2>
            
            <div className="form-grid">
              {businessType === 'REGISTERED' && (
                <>
                  <div className="form-group full">
                    <label className="form-label">CAC Registration Number (RC)</label>
                    <input type="text" className="form-input" placeholder="e.g. RC 1234567" />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Tax Identification Number (TIN)</label>
                    <input type="text" className="form-input" placeholder="Enter your corporate FIRS TIN" />
                  </div>
                </>
              )}

              <div className="form-group full">
                <label className="form-label">Director's Bank Verification Number (BVN)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter 11-digit BVN" 
                  maxLength={11}
                  value={formData.bvn}
                  onChange={e => setFormData({...formData, bvn: e.target.value})}
                />
                
                <div className="consent-box">
                  <input 
                    type="checkbox" 
                    id="bvn-consent" 
                    checked={formData.consent}
                    onChange={e => setFormData({...formData, consent: e.target.checked})}
                  />
                  <label htmlFor="bvn-consent">
                    <strong>Legal Consent:</strong> I authorize PAYPAXA to verify my identity using my Bank Verification Number (BVN) in accordance with CBN regulations.
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Industry / Category</label>
                <select className="form-select">
                  <option value="">Select an industry...</option>
                  <option value="ecommerce">E-Commerce & Retail</option>
                  <option value="education">Education</option>
                  <option value="digital">Digital Services & Software</option>
                  <option value="freelance">Freelance & Consulting</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Expected Monthly Volume</label>
                <select className="form-select">
                  <option value="">Select expected volume...</option>
                  <option value="tier1">Under ₦1,000,000</option>
                  <option value="tier2">₦1,000,000 - ₦5,000,000</option>
                  <option value="tier3">Over ₦5,000,000</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">General Support Email</label>
                <input type="email" className="form-input" placeholder="support@yourbusiness.com" />
              </div>

              <div className="form-group">
                <label className="form-label">Chargeback / Dispute Email</label>
                <input type="email" className="form-input" placeholder="disputes@yourbusiness.com" />
              </div>
            </div>

            <div className="btn-row">
              <button className="btn-back" onClick={handleBack}>← Back</button>
              <button className="btn-primary" disabled={!formData.bvn || !formData.consent} onClick={handleNext}>Proceed to Liveness →</button>
            </div>
          </div>
        )}

        {/* STEP 3: LIVENESS CAMERA (The Custom Biometric UI) */}
        {step === 3 && (
          <div>
            <h2 className="section-title">Identity Verification</h2>
            
            <div className="liveness-container">
              <div className={\`camera-instruction \${livenessPhase > 0 && livenessPhase < 5 ? 'active' : ''}\`}>
                {livenessPhase === 0 ? "Ready for Liveness Check" : livenessInstructions[livenessPhase - 1]}
              </div>

              <div className="camera-wrapper">
                {capturedImage ? (
                  <img src={capturedImage} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="camera-video"
                      videoConstraints={{ facingMode: "user" }}
                    />
                    <div className="camera-mask"></div>
                  </>
                )}
              </div>

              {livenessPhase === 0 && (
                <button className="btn-primary" onClick={startLivenessSequence} style={{ width: '320px', padding: '16px', fontSize: '16px' }}>
                  Start Camera Capture
                </button>
              )}
              
              {livenessPhase === 5 && (
                <div style={{ display: 'flex', gap: '16px', width: '320px' }}>
                  <button className="btn-back" onClick={retakePhoto} style={{ flex: 1 }}>Retake</button>
                  <button className="btn-primary" onClick={handleNext} style={{ flex: 1 }}>Submit & Continue</button>
                </div>
              )}
            </div>
            
            {livenessPhase === 0 && (
              <div className="btn-row">
                <button className="btn-back" onClick={handleBack}>← Back</button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: DOCUMENT UPLOADS */}
        {step === 4 && (
          <div>
            <h2 className="section-title">Document Uploads</h2>
            <div className="form-grid" style={{ gap: '32px' }}>
              
              <div className="form-group full">
                <label className="form-label">Valid Government ID (Director)</label>
                <div className="file-upload-zone">
                  <div className="file-upload-text">Click to upload Passport, Driver's License, or NIN</div>
                  <div className="file-upload-sub">PDF, JPG, or PNG (Max 5MB)</div>
                </div>
              </div>

              <div className="form-group full">
                <label className="form-label">Proof of Address (Utility Bill)</label>
                <div className="file-upload-zone">
                  <div className="file-upload-text">Click to upload NEPA/Utility Bill</div>
                  <div className="file-upload-sub">Must be issued within the last 3 months</div>
                </div>
              </div>

              {businessType === 'REGISTERED' && (
                <>
                  <div className="form-group full">
                    <label className="form-label">CAC Registration Certificate</label>
                    <div className="file-upload-zone">
                      <div className="file-upload-text">Click to upload CAC Certificate</div>
                    </div>
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Status Report / Form CAC 1.1</label>
                    <div className="file-upload-zone">
                      <div className="file-upload-text">Click to upload Status Report</div>
                    </div>
                  </div>
                </>
              )}

            </div>
            <div className="btn-row">
              <button className="btn-back" onClick={handleBack}>← Back</button>
              <button className="btn-primary" onClick={handleNext}>Proceed to Payouts →</button>
            </div>
          </div>
        )}

        {/* STEP 5: SETTLEMENT ACCOUNT */}
        {step === 5 && (
          <div>
            <h2 className="section-title">Settlement Bank Account</h2>
            <p style={{ color: 'var(--text-med)', marginBottom: '24px', fontSize: '14px' }}>
              Where should we send your money? For registered businesses, this must be a corporate account matching your CAC name.
            </p>

            <div className="form-group">
              <label className="form-label">Select Bank</label>
              <select className="form-select">
                <option value="">Choose a bank...</option>
                <option value="gtb">Guaranty Trust Bank (GTB)</option>
                <option value="zenith">Zenith Bank</option>
                <option value="access">Access Bank</option>
                <option value="moniepoint">Moniepoint MFB</option>
                <option value="opay">OPay</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Account Number</label>
              <input type="text" className="form-input" placeholder="Enter 10-digit account number" maxLength={10} />
            </div>

            <div style={{ padding: '16px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: '12px', marginTop: '24px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-med)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Account Name Resolved:</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-high)' }}>MUKHTAR ABDULWAHEED</div>
            </div>

            <div className="btn-row">
              <button className="btn-back" onClick={handleBack}>← Back</button>
              <Link href="/dashboard" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Submit for Compliance Review
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
