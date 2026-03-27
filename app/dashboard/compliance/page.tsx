'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// @ts-ignore: Bypasses Next.js strict TS compiler checking the internal react-webcam defaultProps
const Webcam: any = dynamic(() => import('react-webcam'), { ssr: false });
import type * as blazefaceType from '@tensorflow-models/blazeface';

export default function CompliancePage() {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState<'STARTER' | 'REGISTERED' | null>(null);
  const [isClient, setIsClient] = useState(false);

  // TFJS Liveness State
  const webcamRef = useRef<any>(null); 
  const requestRef = useRef<number>();
  const modelRef = useRef<blazefaceType.BlazeFaceModel | null>(null);
  const movementHistory = useRef<{x: number, y: number}[]>([]);
  
  const [modelLoading, setModelLoading] = useState(true);
  const [faceStatus, setFaceStatus] = useState<'START' | 'NO_FACE' | 'MOVE_CLOSER' | 'CENTER_FACE' | 'HOLD_STILL' | 'STATIC_DETECTED' | 'CAPTURED'>('START');
  const [holdProgress, setHoldProgress] = useState(0); 
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', phone: '', bvn: '', consent: false,
    industry: '', volume: '', corporateName: '', rcNumber: '', tin: '', bankCode: '', accountNumber: ''
  });

  // Enforce 18+ Age Restriction
  const maxDOB = new Date();
  maxDOB.setFullYear(maxDOB.getFullYear() - 18);
  const maxDateString = maxDOB.toISOString().split('T')[0];

  // Enforce Digit-Only Inputs
  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: string, maxLength: number) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, maxLength);
    setFormData({ ...formData, [field]: value });
  };

  useEffect(() => {
    setIsClient(true);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Background Pre-loading of AI Model
  useEffect(() => {
    let isMounted = true;
    const loadModelInBackground = async () => {
      try {
        const tf = await import('@tensorflow/tfjs');
        const blazeface = await import('@tensorflow-models/blazeface');
        await tf.ready();
        const loadedModel = await blazeface.load();
        if (isMounted) {
          modelRef.current = loadedModel;
          setModelLoading(false);
        }
      } catch (error) {
        console.error("Failed to load AI model", error);
      }
    };
    loadModelInBackground();
    return () => { isMounted = false; };
  }, []);

  // Anti-Spoofing Liveness Loop
  const detectFace = useCallback(async () => {
    if (!webcamRef.current || !modelRef.current || faceStatus === 'CAPTURED') return;
    
    const video = webcamRef.current.video;
    if (video && video.readyState === 4) {
      const predictions = await modelRef.current.estimateFaces(video, false);

      if (predictions.length === 0) {
        setFaceStatus('NO_FACE');
        setHoldProgress(0);
        movementHistory.current = [];
      } else {
        const face = predictions[0];
        const topLeft = face.topLeft as [number, number];
        const bottomRight = face.bottomRight as [number, number];
        
        const faceWidth = bottomRight[0] - topLeft[0];
        const faceCenterX = topLeft[0] + (faceWidth / 2);
        const faceCenterY = topLeft[1] + ((bottomRight[1] - topLeft[1]) / 2);

        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        const isCenteredX = Math.abs(faceCenterX - (videoWidth / 2)) < (videoWidth * 0.15); 
        const isCenteredY = Math.abs(faceCenterY - (videoHeight / 2)) < (videoHeight * 0.15);
        const isLargeEnough = faceWidth > (videoWidth * 0.35); 

        if (!isLargeEnough) {
          setFaceStatus('MOVE_CLOSER');
          setHoldProgress(0);
          movementHistory.current = [];
        } else if (!isCenteredX || !isCenteredY) {
          setFaceStatus('CENTER_FACE');
          setHoldProgress(0);
          movementHistory.current = [];
        } else {
          movementHistory.current.push({ x: faceCenterX, y: faceCenterY });
          if (movementHistory.current.length > 30) movementHistory.current.shift();

          let variance = 100;
          if (movementHistory.current.length === 30) {
            const xs = movementHistory.current.map(p => p.x);
            variance = Math.max(...xs) - Math.min(...xs);
          }

          if (variance < 1.5 && movementHistory.current.length === 30) {
            setFaceStatus('STATIC_DETECTED');
            setHoldProgress(0);
            movementHistory.current = [];
          } else {
            setFaceStatus('HOLD_STILL');
            setHoldProgress((prev) => {
              const next = prev + 3; 
              if (next >= 100) {
                const imageSrc = webcamRef.current?.getScreenshot();
                if (imageSrc) {
                  setCapturedImage(imageSrc);
                  setFaceStatus('CAPTURED');
                }
                return 100;
              }
              return next;
            });
          }
        }
      }
    }
    requestRef.current = requestAnimationFrame(detectFace);
  }, [faceStatus]);

  useEffect(() => {
    if (['NO_FACE', 'MOVE_CLOSER', 'CENTER_FACE', 'HOLD_STILL', 'STATIC_DETECTED'].includes(faceStatus)) {
      requestRef.current = requestAnimationFrame(detectFace);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [faceStatus, detectFace]);

  const startScan = () => { movementHistory.current = []; setFaceStatus('NO_FACE'); };
  const retakePhoto = () => { setCapturedImage(null); setHoldProgress(0); movementHistory.current = []; setFaceStatus('START'); };

  const handleNext = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(prev => prev + 1); };
  const handleBack = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(prev => prev - 1); };

  if (!isClient) return null;

  return (
    <div className="compliance-wrapper">
      <style dangerouslySetInnerHTML={{__html: `
        /* CORE THEME VARIABLES */
        :root {
          /* Light Mode Variables */
          --card-bg: #FFFFFF;
          --page-bg: transparent;
          --text-main: #111827;
          --text-muted: #6B7280;
          --border-color: #E5E7EB;
          --input-bg: #F9FAFB;
          --brand-primary: #1A56DB;
          --brand-light: #EFF6FF;
          --btn-bg: #0B192C; /* Dark Blue for buttons in light mode */
          --btn-text: #FFFFFF;
          --btn-hover: #1E293B;
          --success: #10B981;
          --error: #EF4444;
          --camera-bg: #111827;
        }

        /* Dark Mode Variables - Automatically triggers based on device/browser settings */
        @media (prefers-color-scheme: dark) {
          :root {
            --card-bg: #0B192C; /* Your Custom Dark Blue */
            --page-bg: transparent;
            --text-main: #F9FAFB;
            --text-muted: #9CA3AF;
            --border-color: #1E293B; /* Slightly lighter blue for borders */
            --input-bg: #0F172A; /* Deep slate for inputs */
            --brand-primary: #3B82F6;
            --brand-light: rgba(59, 130, 246, 0.15);
            --btn-bg: #3B82F6;
            --btn-text: #FFFFFF;
            --btn-hover: #2563EB;
            --camera-bg: #000000;
          }
        }

        /* LAYOUT & COMPATIBILITY */
        .compliance-wrapper {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 24px 16px;
          box-sizing: border-box;
          font-family: 'Inter', system-ui, sans-serif;
          background: var(--page-bg);
        }

        .compliance-card {
          background-color: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
          transition: background-color 0.3s, border-color 0.3s;
        }

        /* HORIZONTAL STEPPER */
        .stepper-container { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; position: relative; }
        .stepper-line { position: absolute; top: 16px; left: 0; right: 0; height: 3px; background: var(--border-color); z-index: 1; border-radius: 3px; }
        .stepper-line-fill { position: absolute; top: 16px; left: 0; height: 3px; background: var(--brand-primary); z-index: 2; transition: width 0.3s ease; border-radius: 3px; }
        
        .step-node { position: relative; z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 8px; width: 60px; }
        .step-circle { width: 36px; height: 36px; border-radius: 50%; background: var(--input-bg); border: 2px solid var(--border-color); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; color: var(--text-muted); transition: 0.3s; }
        .step-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-align: center; display: none; }
        
        .step-node.active .step-circle { border-color: var(--brand-primary); color: var(--brand-primary); background: var(--card-bg); box-shadow: 0 0 0 4px var(--brand-light); }
        .step-node.active .step-label { color: var(--brand-primary); display: block; position: absolute; top: 44px; white-space: nowrap; }
        
        .step-node.completed .step-circle { background: var(--brand-primary); border-color: var(--brand-primary); color: #FFF; }

        /* TYPOGRAPHY */
        .page-title { font-size: 24px; font-weight: 800; color: var(--text-main); margin: 0 0 8px 0; letter-spacing: -0.5px; }
        .page-sub { font-size: 15px; color: var(--text-muted); margin: 0 0 32px 0; line-height: 1.5; }
        .section-divider { font-size: 13px; font-weight: 700; color: var(--brand-primary); margin: 32px 0 16px 0; padding-bottom: 8px; border-bottom: 1px solid var(--border-color); text-transform: uppercase; letter-spacing: 0.5px; }

        /* INPUTS */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { margin-bottom: 20px; }
        .form-group.full { grid-column: 1 / -1; }
        .form-label { display: block; font-size: 13px; font-weight: 600; color: var(--text-main); margin-bottom: 8px; }
        .form-input, .form-select { width: 100%; padding: 14px 16px; background-color: var(--input-bg); border: 1px solid var(--border-color); border-radius: 16px; color: var(--text-main); font-size: 15px; outline: none; transition: all 0.2s ease; -webkit-appearance: none; box-sizing: border-box; }
        .form-input:focus, .form-select:focus { border-color: var(--brand-primary); background-color: var(--card-bg); box-shadow: 0 0 0 4px var(--brand-light); }
        .form-input::placeholder { color: var(--text-muted); opacity: 0.7; }
        
        /* CARDS */
        .type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .type-card { background: var(--input-bg); border: 2px solid var(--border-color); border-radius: 20px; padding: 24px; cursor: pointer; transition: 0.2s; }
        .type-card:hover { border-color: var(--brand-primary); }
        .type-card.selected { border-color: var(--brand-primary); background: var(--brand-light); }
        .type-card h3 { margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: var(--text-main); }
        .type-card p { margin: 0; font-size: 13px; color: var(--text-muted); line-height: 1.5; }

        .upload-zone { border: 2px dashed var(--border-color); border-radius: 20px; padding: 32px 20px; text-align: center; background: var(--input-bg); cursor: pointer; transition: 0.2s; }
        .upload-zone:hover { border-color: var(--brand-primary); background: var(--brand-light); }
        .upload-title { color: var(--brand-primary); font-weight: 600; font-size: 14px; margin-bottom: 4px; }
        .upload-sub { color: var(--text-muted); font-size: 13px; }
        
        .consent-box { display: flex; align-items: flex-start; gap: 12px; background: var(--brand-light); padding: 16px; border-radius: 16px; border: 1px dashed var(--brand-primary); margin-top: 12px; }
        .consent-box input { margin-top: 4px; width: 18px; height: 18px; cursor: pointer; accent-color: var(--brand-primary); }
        .consent-box label { font-size: 13px; color: var(--text-main); line-height: 1.5; cursor: pointer; }

        /* CAMERA UI */
        .camera-section { display: flex; flex-direction: column; align-items: center; background: var(--input-bg); border: 1px solid var(--border-color); border-radius: 24px; padding: 40px 20px; }
        .video-mask { width: 280px; height: 280px; border-radius: 50%; overflow: hidden; position: relative; margin: 0 auto 32px auto; background: var(--camera-bg); box-shadow: 0 0 0 8px var(--card-bg), 0 10px 25px rgba(0,0,0,0.1); transform: translateZ(0); }
        .video-feed { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
        
        .status-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 30px; font-weight: 600; font-size: 14px; margin-bottom: 24px; transition: 0.3s; text-align: center; }
        .status-ready { background: var(--card-bg); color: var(--text-muted); border: 1px solid var(--border-color); }
        .status-error { background: rgba(239, 68, 68, 0.1); color: var(--error); border: 1px solid var(--error); }
        .status-good { background: rgba(16, 185, 129, 0.1); color: var(--success); border: 1px solid var(--success); }
        .status-capturing { background: var(--brand-light); color: var(--brand-primary); border: 1px solid var(--brand-primary); }

        .progress-ring { position: absolute; inset: 0; border-radius: 50%; border: 8px solid transparent; border-top-color: var(--success); border-right-color: var(--success); transition: transform 0.1s linear; z-index: 10; pointer-events: none; }

        /* BUTTONS */
        .btn-row { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--border-color); gap: 16px; }
        .btn { padding: 16px 24px; border-radius: 16px; font-weight: 600; font-size: 15px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; white-space: nowrap; }
        .btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-main); }
        .btn-outline:hover { background: var(--input-bg); }
        .btn-solid { background: var(--btn-bg); color: var(--btn-text); border: none; flex: 1; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .btn-solid:hover { background: var(--btn-hover); transform: translateY(-1px); }
        .btn-solid:disabled { background: var(--border-color); color: var(--text-muted); cursor: not-allowed; transform: none; box-shadow: none; opacity: 0.7; }

        /* RESPONSIVE DESIGN */
        @media (max-width: 768px) {
          .compliance-wrapper { padding: 16px; }
          .compliance-card { padding: 24px 20px; border-radius: 20px; }
          .type-grid, .form-grid { grid-template-columns: 1fr; }
          .btn-row { flex-direction: column-reverse; }
          .btn { width: 100%; }
          .step-label { display: none !important; } /* Hide text labels on mobile to save space */
          .stepper-line { top: 18px; }
          .stepper-line-fill { top: 18px; }
          .step-circle { width: 36px; height: 36px; }
        }
      `}} />

      <div className="compliance-card">
        
        {/* HORIZONTAL STEPPER */}
        <div className="stepper-container">
          <div className="stepper-line"></div>
          <div className="stepper-line-fill" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
          
          {[
            { id: 1, label: 'Entity' },
            { id: 2, label: 'Profile' },
            { id: 3, label: 'Liveness' },
            { id: 4, label: 'Docs' },
            { id: 5, label: 'Payout' }
          ].map((s) => (
            <div key={s.id} className={`step-node ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
              <div className="step-circle">
                {step > s.id ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> : s.id}
              </div>
              <div className="step-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* STEP 1: BUSINESS TYPE */}
        {step === 1 && (
          <div>
            <h1 className="page-title">Entity Configuration</h1>
            <p className="page-sub">How is your business structured? This determines your KYC requirements.</p>

            <div className="type-grid">
              <div className={`type-card ${businessType === 'STARTER' ? 'selected' : ''}`} onClick={() => setBusinessType('STARTER')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ background: businessType === 'STARTER' ? 'var(--brand-primary)' : 'var(--border-color)', color: businessType === 'STARTER' ? '#FFF' : 'var(--text-muted)', padding: '10px', borderRadius: '12px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  {businessType === 'STARTER' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
                </div>
                <h3>Starter Business</h3>
                <p>I am an independent creator, freelancer, or unregistered business. I do not have a CAC certificate.</p>
              </div>

              <div className={`type-card ${businessType === 'REGISTERED' ? 'selected' : ''}`} onClick={() => setBusinessType('REGISTERED')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ background: businessType === 'REGISTERED' ? 'var(--brand-primary)' : 'var(--border-color)', color: businessType === 'REGISTERED' ? '#FFF' : 'var(--text-muted)', padding: '10px', borderRadius: '12px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
                  </div>
                  {businessType === 'REGISTERED' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
                </div>
                <h3>Registered Corporate</h3>
                <p>My business is fully registered with the Corporate Affairs Commission (CAC) and I have a TIN.</p>
              </div>
            </div>

            <div className="btn-row">
              <div style={{ flex: 1 }}></div>
              <button className="btn btn-solid" style={{ flex: 'none', minWidth: '200px' }} disabled={!businessType} onClick={handleNext}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 2: PROFILE */}
        {step === 2 && (
          <div>
            <h1 className="page-title">Identity Profile</h1>
            <p className="page-sub">Provide your legal details. This must perfectly match your IDs and BVN.</p>

            {businessType === 'REGISTERED' && (
              <>
                <div className="section-divider">Corporate Details</div>
                <div className="form-grid">
                  <div className="form-group full">
                    <label className="form-label">Registered Company Name</label>
                    <input type="text" className="form-input" placeholder="e.g. Quadrox Tech Ltd" value={formData.corporateName} onChange={e => setFormData({...formData, corporateName: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CAC Number (RC)</label>
                    <input type="text" className="form-input" placeholder="RC 123456" value={formData.rcNumber} onChange={e => setFormData({...formData, rcNumber: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tax ID Number (TIN)</label>
                    <input type="text" className="form-input" placeholder="FIRS TIN" value={formData.tin} onChange={e => setFormData({...formData, tin: e.target.value})} />
                  </div>
                </div>
              </>
            )}

            <div className="section-divider">{businessType === 'REGISTERED' ? "Director's Details" : "Your Legal Details"}</div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name (Legal)</label>
                <input type="text" className="form-input" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name (Legal)</label>
                <input type="text" className="form-input" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth (18+ Only)</label>
                {/* 🚀 Restricts selection to 18 years ago or older */}
                <input type="date" className="form-input" max={maxDateString} value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                {/* 🚀 Restricts input strictly to digits */}
                <input type="tel" className="form-input" placeholder="09033358098" value={formData.phone} onChange={e => handleNumberInput(e, 'phone', 15)} />
              </div>
              
              <div className="form-group full">
                <label className="form-label">Bank Verification Number (BVN)</label>
                {/* 🚀 Restricts input strictly to 11 digits */}
                <input type="text" className="form-input" placeholder="Enter 11-digit BVN" value={formData.bvn} onChange={e => handleNumberInput(e, 'bvn', 11)} />
              </div>
            </div>

            <div className="consent-box">
              <input type="checkbox" id="consent-check" checked={formData.consent} onChange={e => setFormData({...formData, consent: e.target.checked})} />
              <label htmlFor="consent-check"><strong>Legal Consent:</strong> I authorize PAYPAXA to verify my identity using my Bank Verification Number (BVN).</label>
            </div>

            <div className="btn-row">
              <button className="btn btn-outline" onClick={handleBack}>Back</button>
              <button className="btn btn-solid" disabled={!formData.firstName || !formData.lastName || !formData.dob || formData.bvn.length !== 11 || !formData.consent} onClick={handleNext}>Continue to Camera →</button>
            </div>
          </div>
        )}

        {/* STEP 3: AI LIVENESS SCAN */}
        {step === 3 && (
          <div>
            <h1 className="page-title">Liveness Verification</h1>
            <p className="page-sub">Remove glasses and hats. Look directly at the camera.</p>

            <div className="camera-section">
              {modelLoading && <div className="status-badge status-ready"><svg className="animate-spin" style={{ display: 'inline', marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> AI Initializing...</div>}
              
              {!modelLoading && faceStatus === 'START' && <div className="status-badge status-ready">Camera Ready</div>}
              {!modelLoading && faceStatus === 'NO_FACE' && <div className="status-badge status-error">No face detected</div>}
              {!modelLoading && faceStatus === 'MOVE_CLOSER' && <div className="status-badge status-error">Move closer</div>}
              {!modelLoading && faceStatus === 'CENTER_FACE' && <div className="status-badge status-error">Center your face</div>}
              {!modelLoading && faceStatus === 'STATIC_DETECTED' && <div className="status-badge status-error">Static Image Detected! Use a real face.</div>}
              {!modelLoading && faceStatus === 'HOLD_STILL' && <div className="status-badge status-capturing">Hold still... {Math.floor(holdProgress)}%</div>}
              {!modelLoading && faceStatus === 'CAPTURED' && <div className="status-badge status-good">Scan Complete</div>}

              <div className="video-mask">
                {faceStatus === 'CAPTURED' && capturedImage ? (
                  <img src={capturedImage} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} alt="Captured" />
                ) : (
                  <>
                    <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="video-feed" videoConstraints={{ facingMode: "user" }} />
                    <div className="progress-ring" style={{ transform: `rotate(${(holdProgress / 100) * 360}deg)`, opacity: holdProgress > 0 ? 1 : 0 }}></div>
                  </>
                )}
              </div>

              {faceStatus === 'START' && !modelLoading && (
                <button className="btn btn-solid" style={{ width: '100%', maxWidth: '280px' }} onClick={startScan}>Start Face Scan</button>
              )}

              {faceStatus === 'CAPTURED' && (
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <p style={{ color: 'var(--text-main)', fontWeight: 600, marginBottom: '16px', fontSize: '15px' }}>Is your face clear and well-lit?</p>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={retakePhoto}>Retake</button>
                    <button className="btn btn-solid" style={{ flex: 1, background: 'var(--success)' }} onClick={handleNext}>Looks Good</button>
                  </div>
                </div>
              )}
            </div>
            
            {faceStatus !== 'CAPTURED' && (
              <div className="btn-row">
                <button className="btn btn-outline" onClick={handleBack}>Back</button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: DOCUMENTS */}
        {step === 4 && (
          <div>
            <h1 className="page-title">Document Uploads</h1>
            <p className="page-sub">Upload crisp, clear copies of your official documents.</p>
            
            <div className="form-group full">
              <label className="form-label">Government Issued ID ({formData.firstName} {formData.lastName})</label>
              <div className="upload-zone">
                <div className="upload-title">Click to upload</div>
                <div className="upload-sub">Valid Passport, Driver's License, or NIN Slip</div>
              </div>
            </div>

            {businessType === 'REGISTERED' && (
              <div className="form-group full" style={{ marginTop: '24px' }}>
                <label className="form-label">CAC Registration Certificate</label>
                <div className="upload-zone">
                  <div className="upload-title">Click to upload</div>
                  <div className="upload-sub">PDF preferred</div>
                </div>
              </div>
            )}

            <div className="btn-row">
              <button className="btn btn-outline" onClick={handleBack}>Back</button>
              <button className="btn btn-solid" onClick={handleNext}>Continue to Settlement →</button>
            </div>
          </div>
        )}

        {/* STEP 5: SETTLEMENT */}
        {step === 5 && (
          <div>
            <h1 className="page-title">Payout Account</h1>
            <p className="page-sub">Where should we settle your funds? The account name must strictly match your BVN.</p>

            <div className="form-group full">
              <label className="form-label">Select Bank</label>
              <select className="form-select">
                <option value="">Choose a bank...</option>
                <option value="gtb">Guaranty Trust Bank</option>
                <option value="zenith">Zenith Bank</option>
                <option value="moniepoint">Moniepoint MFB</option>
              </select>
            </div>
            <div className="form-group full">
              <label className="form-label">Account Number</label>
              {/* 🚀 Restricts input strictly to 10 digits */}
              <input type="text" className="form-input" placeholder="0000000000" value={formData.accountNumber} onChange={e => handleNumberInput(e, 'accountNumber', 10)} />
            </div>
            
            <div className="btn-row">
              <button className="btn btn-outline" onClick={handleBack}>Back</button>
              <Link href="/dashboard" className="btn btn-solid" style={{ textDecoration: 'none' }}>
                Submit Compliance
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
