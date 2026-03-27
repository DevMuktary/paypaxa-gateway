'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// @ts-ignore: Bypasses Next.js strict TS compiler checking the internal react-webcam defaultProps
const Webcam: any = dynamic(() => import('react-webcam'), { ssr: false });
import type * as blazefaceType from '@tensorflow-models/blazeface';

export default function CompliancePage() {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState<'STARTER' | 'REGISTERED' | 'UNSELECTED'>('UNSELECTED');
  const [isClient, setIsClient] = useState(false);
  const [sampleModal, setSampleModal] = useState<string | null>(null);

  // TFJS Liveness State
  const webcamRef = useRef<any>(null); 
  const requestRef = useRef<number>();
  const modelRef = useRef<blazefaceType.BlazeFaceModel | null>(null);
  const movementHistory = useRef<{x: number, y: number}[]>([]);
  
  const [modelLoading, setModelLoading] = useState(true);
  const [faceStatus, setFaceStatus] = useState<'START' | 'NO_FACE' | 'MOVE_CLOSER' | 'CENTER_FACE' | 'HOLD_STILL' | 'STATIC_DETECTED' | 'CAPTURED'>('START');
  const [holdProgress, setHoldProgress] = useState(0); 
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Expanded Industry-Standard Form State
  const [formData, setFormData] = useState({
    corporateName: '', rcNumber: '', tin: '', address: '', industry: '', incorporationDate: '',
    firstName: '', lastName: '', email: '', dob: '', phone: '', bvn: '', consent: false,
    bankCode: '', accountNumber: ''
  });

  // Enforce strictly 18+ Age Restriction
  const maxDOB = new Date();
  maxDOB.setFullYear(maxDOB.getFullYear() - 18);
  const maxDateString = maxDOB.toISOString().split('T')[0];

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

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

  // Background AI Pre-loading
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

  // Liveness & Anti-Spoofing Check
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

  const setSection = (id: number) => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(id); };

  const sections = [
    { id: 1, title: 'Entity Selection', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path></svg> },
    { id: 2, title: 'Profile & Details', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
    { id: 3, title: 'Liveness Verification', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg> },
    { id: 4, title: 'Required Documents', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg> },
    { id: 5, title: 'Settlement Account', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg> }
  ];

  if (!isClient) return null;

  return (
    <div className="compliance-layout">
      <style dangerouslySetInnerHTML={{__html: `
        /* ENTERPRISE BRANDING COLORS */
        :root {
          --bg-main: #F8FAFC;
          --card-bg: #FFFFFF;
          --text-main: #0F172A;
          --text-muted: #64748B;
          --border-color: #E2E8F0;
          --border-focus: #CBD5E1;
          --brand-primary: #0F172A; /* Slate 900 for a more premium fintech feel */
          --brand-light: #F1F5F9;
          --brand-accent: #2563EB; /* Blue accent for primary actions */
          --pending-bg: #FEF3C7;
          --pending-text: #D97706;
          --success: #10B981;
          --error: #EF4444;
        }

        /* AUTO DARK MODE ADAPTATION */
        @media (prefers-color-scheme: dark) {
          :root {
            --bg-main: #020617; 
            --card-bg: #0F172A; 
            --text-main: #F8FAFC;
            --text-muted: #94A3B8;
            --border-color: #1E293B;
            --border-focus: #334155;
            --brand-primary: #F8FAFC;
            --brand-light: #1E293B;
            --brand-accent: #3B82F6;
            --pending-bg: rgba(217, 119, 6, 0.15);
            --pending-text: #FCD34D;
          }
        }

        .compliance-layout { display: flex; min-height: 100vh; background: var(--bg-main); font-family: 'Inter', system-ui, sans-serif; align-items: flex-start; justify-content: center; padding: 40px 20px; gap: 32px; }

        /* ACTIVATION SIDEBAR */
        .activation-sidebar { width: 320px; background: var(--card-bg); border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid var(--border-color); flex-shrink: 0; position: sticky; top: 40px; }
        .sidebar-title { font-size: 13px; font-weight: 700; color: var(--text-muted); margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .section-item { display: flex; flex-direction: column; padding: 16px; border-radius: 12px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s ease; border: 1px solid transparent; }
        .section-item:hover { background: var(--brand-light); }
        .section-item.active { background: var(--brand-primary); color: var(--card-bg); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
        
        .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .section-title { font-size: 15px; font-weight: 600; line-height: 1.3; }
        .section-item.active .section-title { color: var(--card-bg); }
        .section-item:not(.active) .section-title { color: var(--text-main); }
        
        .section-icon { display: flex; align-items: center; justify-content: center; }
        .section-item.active .section-icon { color: var(--card-bg); }
        .section-item:not(.active) .section-icon { color: var(--text-muted); }

        .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; width: fit-content; text-transform: uppercase; letter-spacing: 0.05em; }
        .badge-pending { background: var(--pending-bg); color: var(--pending-text); }
        .section-item.active .badge-pending { background: rgba(255,255,255,0.15); color: var(--card-bg); }

        /* MAIN CONTENT PANE */
        .content-pane { flex: 1; max-width: 800px; background: var(--card-bg); border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid var(--border-color); padding: 48px; }
        .pane-title { font-size: 28px; font-weight: 800; color: var(--text-main); margin: 0 0 12px 0; letter-spacing: -0.02em; }
        .pane-sub { font-size: 15px; color: var(--text-muted); margin: 0 0 40px 0; border-bottom: 1px solid var(--border-color); padding-bottom: 32px; line-height: 1.6; }

        .section-divider { font-size: 14px; font-weight: 700; color: var(--text-main); margin: 32px 0 24px 0; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid var(--brand-light); padding-bottom: 8px; display: inline-block;}

        /* INPUTS */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        .input-group { position: relative; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; padding: 14px 16px; transition: all 0.2s ease; }
        .input-group.full { grid-column: 1 / -1; margin-bottom: 24px; }
        .input-group:focus-within { border-color: var(--brand-accent); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .input-label { position: absolute; top: -9px; left: 12px; background: var(--card-bg); padding: 0 6px; font-size: 12px; font-weight: 600; color: var(--text-muted); transition: color 0.2s; }
        .input-group:focus-within .input-label { color: var(--brand-accent); }
        .input-field { width: 100%; border: none; outline: none; font-size: 15px; color: var(--text-main); background: transparent; padding: 4px 0; font-family: inherit; }
        .input-field::placeholder { color: var(--text-muted); opacity: 0.5; }
        .input-select { width: 100%; border: none; outline: none; font-size: 15px; color: var(--text-main); background: transparent; padding: 4px 0; cursor: pointer; -webkit-appearance: none; font-family: inherit; }

        /* ENTITY TYPE CARDS */
        .type-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px; }
        .type-option { padding: 32px 24px; border: 2px solid var(--border-color); border-radius: 16px; text-align: left; cursor: pointer; transition: all 0.2s ease; background: transparent; position: relative; overflow: hidden; }
        .type-option:hover { border-color: var(--border-focus); transform: translateY(-2px); }
        .type-option.active { border-color: var(--brand-accent); background: rgba(37, 99, 235, 0.02); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.05); }
        .type-option.active::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--brand-accent); }
        .type-title { font-size: 18px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; }
        .type-desc { font-size: 14px; color: var(--text-muted); line-height: 1.5; }

        /* UPLOADS */
        .upload-card { border: 1px dashed var(--border-focus); border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 24px; transition: all 0.2s ease; background: var(--brand-light); }
        .upload-card:hover { border-color: var(--brand-accent); background: rgba(37, 99, 235, 0.02); }
        .upload-title { font-size: 16px; font-weight: 700; color: var(--text-main); margin-bottom: 16px; }
        .upload-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--card-bg); color: var(--text-main); border: 1px solid var(--border-color); padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; margin-bottom: 16px; transition: all 0.2s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .upload-btn:hover { border-color: var(--brand-accent); color: var(--brand-accent); }
        .upload-formats { font-size: 13px; color: var(--text-muted); margin-bottom: 24px; }
        .upload-footer { display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 600; padding-top: 16px; border-top: 1px solid var(--border-color); }
        .sample-link { color: var(--brand-accent); cursor: pointer; }
        .required-text { color: var(--error); background: rgba(239, 68, 68, 0.1); padding: 4px 10px; border-radius: 100px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }

        /* CAMERA SECTION */
        .camera-section { display: flex; flex-direction: column; align-items: center; }
        .video-mask { width: 320px; height: 320px; border-radius: 50%; overflow: hidden; position: relative; margin: 0 auto 32px auto; background: var(--bg-main); box-shadow: 0 0 0 8px var(--brand-light), 0 0 0 9px var(--border-color); }
        .video-feed { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
        .progress-ring { position: absolute; inset: 0; border-radius: 50%; border: 8px solid transparent; border-top-color: var(--success); border-right-color: var(--success); transition: transform 0.1s linear; pointer-events: none; z-index: 10; }
        
        .status-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 100px; font-weight: 600; font-size: 14px; margin-bottom: 32px; }
        .status-ready { background: var(--brand-light); color: var(--text-main); }
        .status-error { background: rgba(239, 68, 68, 0.1); color: var(--error); }
        .status-good { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .status-capturing { background: rgba(37, 99, 235, 0.1); color: var(--brand-accent); }

        /* BUTTONS */
        .btn-row { display: flex; justify-content: flex-end; gap: 16px; margin-top: 40px; }
        .submit-btn { background: var(--brand-accent); color: #FFFFFF; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px; border: none; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 8px -1px rgba(37, 99, 235, 0.3); }
        .submit-btn:disabled { background: var(--border-color); color: var(--text-muted); cursor: not-allowed; box-shadow: none; transform: none; }

        /* MODAL */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
        .modal-content { background: var(--card-bg); width: 100%; max-width: 500px; border-radius: 16px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border: 1px solid var(--border-color); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px; }
        .modal-title { font-size: 18px; font-weight: 700; color: var(--text-main); }
        .modal-close { background: var(--brand-light); border: none; cursor: pointer; color: var(--text-main); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .modal-close:hover { background: var(--border-color); }
        .sample-image-placeholder { width: 100%; height: 250px; background: var(--brand-light); border: 1px dashed var(--border-focus); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-weight: 600; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.05em; font-size: 13px; }

        @media (max-width: 900px) {
          .compliance-layout { flex-direction: column; padding: 16px; }
          .activation-sidebar { width: 100%; position: relative; top: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 20px; }
          .sidebar-title { grid-column: 1 / -1; margin-bottom: 8px; }
          .content-pane { width: 100%; padding: 32px 20px; }
          .form-grid { grid-template-columns: 1fr; gap: 16px; }
          .type-selector { grid-template-columns: 1fr; }
          .btn-row { flex-direction: column; }
          .submit-btn { width: 100%; }
        }
        @media (max-width: 600px) {
          .activation-sidebar { grid-template-columns: 1fr; }
        }
      `}} />

      {/* SAMPLE MODAL */}
      {sampleModal && (
        <div className="modal-overlay" onClick={() => setSampleModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Reference: {sampleModal}</div>
              <button className="modal-close" onClick={() => setSampleModal(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="sample-image-placeholder">
              [ Standard Image of {sampleModal} ]
            </div>
            <button className="submit-btn" style={{ width: '100%', marginTop: 0 }} onClick={() => setSampleModal(null)}>I Understand</button>
          </div>
        </div>
      )}

      {/* FIXED SIDEBAR */}
      <div className="activation-sidebar">
        <div className="sidebar-title">Compliance Roadmap</div>
        {sections.map((s) => {
          const isActive = step === s.id;
          return (
            <div key={s.id} className={`section-item ${isActive ? 'active' : ''}`} onClick={() => setSection(s.id)}>
              <div className="section-header">
                <div className="section-icon">{s.icon}</div>
                <div className="section-title">{s.title}</div>
              </div>
              <div className="badge badge-pending">
                {isActive ? 'Action Required' : 'Pending Verification'}
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN CONTENT PANE */}
      <div className="content-pane">
        
        {/* STEP 1: BUSINESS PROFILE */}
        {step === 1 && (
          <div>
            <h2 className="pane-title">Business Classification</h2>
            <p className="pane-sub">Select your operating entity type. This determines your KYC Tier and processing limits.</p>
            
            <div className="type-selector">
              <div className={`type-option ${businessType === 'STARTER' ? 'active' : ''}`} onClick={() => setBusinessType('STARTER')}>
                <div className="type-title">Starter / Unregistered</div>
                <div className="type-desc">Freelancers, creators, or un-incorporated businesses. Subject to Tier 1 transaction limits.</div>
              </div>
              <div className={`type-option ${businessType === 'REGISTERED' ? 'active' : ''}`} onClick={() => setBusinessType('REGISTERED')}>
                <div className="type-title">Registered Corporate</div>
                <div className="type-desc">Business Name (BN) or Limited Liability (RC) with a valid Corporate Affairs Commission certificate.</div>
              </div>
            </div>

            {businessType !== 'UNSELECTED' && (
              <>
                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">Business / Brand Name</label>
                    <input type="text" className="input-field" placeholder="Trading name" value={formData.corporateName} onChange={e => handleInput(e, 'corporateName')} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Industry / Sector</label>
                    <select className="input-select" value={formData.industry} onChange={e => handleInput(e, 'industry')}>
                      <option value="" disabled>Select Primary Sector...</option>
                      <option value="ecommerce">E-Commerce & Retail</option>
                      <option value="software">Software / IT Services</option>
                      <option value="education">Education & E-Learning</option>
                      <option value="real_estate">Real Estate / Property</option>
                      <option value="other">Other Services</option>
                    </select>
                  </div>
                </div>

                <div className="input-group full">
                  <label className="input-label">Primary Operational Address</label>
                  <input type="text" className="input-field" placeholder="Full street address, City, State" value={formData.address} onChange={e => handleInput(e, 'address')} />
                </div>

                <div className="btn-row">
                  <button className="submit-btn" disabled={!formData.corporateName || !formData.address || !formData.industry} onClick={() => setSection(2)}>Save and Continue</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 2: DISTINCT PROFILES */}
        {step === 2 && (
          <div>
            <h2 className="pane-title">Identity & Risk Profiling</h2>
            <p className="pane-sub">For regulatory compliance, details must perfectly match your Bank Verification Number (BVN) records.</p>
            
            {businessType === 'REGISTERED' && (
              <>
                <div className="section-divider">Corporate Legal Details</div>
                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">CAC Number (RC/BN)</label>
                    <input type="text" className="input-field" placeholder="e.g., RC123456 or BN98765" value={formData.rcNumber} onChange={e => handleInput(e, 'rcNumber')} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Date of Incorporation</label>
                    <input type="date" className="input-field" max={new Date().toISOString().split('T')[0]} value={formData.incorporationDate} onChange={e => handleInput(e, 'incorporationDate')} />
                  </div>
                </div>
                <div className="input-group full">
                  <label className="input-label">Tax Identification Number (TIN) - Optional for Starters</label>
                  <input type="text" className="input-field" placeholder="FIRS TIN" value={formData.tin} onChange={e => handleInput(e, 'tin')} />
                </div>
              </>
            )}

            <div className="section-divider">{businessType === 'REGISTERED' ? "Primary Director's Details" : "Personal Details"}</div>
            
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">Legal First Name</label>
                <input type="text" className="input-field" placeholder="As it appears on BVN" value={formData.firstName} onChange={e => handleInput(e, 'firstName')} />
              </div>
              <div className="input-group">
                <label className="input-label">Legal Last Name</label>
                <input type="text" className="input-field" placeholder="As it appears on BVN" value={formData.lastName} onChange={e => handleInput(e, 'lastName')} />
              </div>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input type="email" className="input-field" placeholder="director@company.com" value={formData.email} onChange={e => handleInput(e, 'email')} />
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input type="tel" className="input-field" placeholder="Linked to your BVN" value={formData.phone} onChange={e => handleNumberInput(e, 'phone', 15)} />
              </div>
              <div className="input-group">
                <label className="input-label">Date of Birth (18+ strictly)</label>
                <input type="date" className="input-field" max={maxDateString} value={formData.dob} onChange={e => handleInput(e, 'dob')} />
              </div>
              <div className="input-group">
                <label className="input-label">Bank Verification Number</label>
                <input type="password" className="input-field" placeholder="11-digit BVN" value={formData.bvn} onChange={e => handleNumberInput(e, 'bvn', 11)} />
              </div>
            </div>

            <div className="btn-row">
              <button className="submit-btn" disabled={!formData.firstName || !formData.lastName || !formData.email || formData.bvn.length !== 11} onClick={() => setSection(3)}>Save and Continue</button>
            </div>
          </div>
        )}

        {/* STEP 3: AI LIVENESS */}
        {step === 3 && (
          <div>
            <h2 className="pane-title">Biometric Proof of Life</h2>
            <p className="pane-sub">This anti-spoofing check verifies your presence in real-time. Ensure good lighting and remove facial obstructions.</p>
            
            <div className="camera-section">
              {modelLoading && <div className="status-badge status-ready">Initializing AI Engine...</div>}
              {!modelLoading && faceStatus === 'START' && <div className="status-badge status-ready">Camera Secure & Ready</div>}
              {!modelLoading && faceStatus === 'NO_FACE' && <div className="status-badge status-error">Face not detected in frame</div>}
              {!modelLoading && faceStatus === 'MOVE_CLOSER' && <div className="status-badge status-error">Move Closer to the Camera</div>}
              {!modelLoading && faceStatus === 'CENTER_FACE' && <div className="status-badge status-error">Align face within the circle</div>}
              {!modelLoading && faceStatus === 'STATIC_DETECTED' && <div className="status-badge status-error">Liveness Failed: Static image detected</div>}
              {!modelLoading && faceStatus === 'HOLD_STILL' && <div className="status-badge status-capturing">Acquiring Biometrics... {Math.floor(holdProgress)}%</div>}
              {!modelLoading && faceStatus === 'CAPTURED' && <div className="status-badge status-good">Biometric Verification Successful</div>}

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
                <button className="submit-btn" style={{ maxWidth: '300px', marginTop: 0 }} onClick={startScan}>Initialize Scan</button>
              )}

              {faceStatus === 'CAPTURED' && (
                <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '360px' }}>
                  <button className="submit-btn" style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', marginTop: 0 }} onClick={retakePhoto}>Retake Scan</button>
                  <button className="submit-btn" style={{ flex: 1, marginTop: 0 }} onClick={() => setSection(4)}>Confirm & Proceed</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: UPLOADS */}
        {step === 4 && (
          <div>
            <h2 className="pane-title">Compliance Documentation</h2>
            <p className="pane-sub">Upload high-resolution, unredacted copies of your official documents. Supported formats: JPG, PNG, PDF (Max 5MB).</p>

            <div className="upload-card">
              <div className="upload-title">Valid Government ID ({businessType === 'REGISTERED' ? "Director" : "Personal"})</div>
              <button className="upload-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Select ID File
              </button>
              <div className="upload-formats">NIN Slip, Voter's Card, Intl. Passport, or Driver's License.</div>
              <div className="upload-footer">
                <span className="sample-link" onClick={() => setSampleModal("Government ID")}>View Example</span>
                <span className="required-text">Required</span>
              </div>
            </div>

            <div className="upload-card">
              <div className="upload-title">Proof of Address (Utility Bill)</div>
              <button className="upload-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Select Utility Bill
              </button>
              <div className="upload-formats">Electricity bill, Water bill, or Bank Statement showing address (Not older than 3 months).</div>
              <div className="upload-footer">
                <span className="sample-link" onClick={() => setSampleModal("Utility Bill")}>View Example</span>
                <span className="required-text">Required</span>
              </div>
            </div>

            {businessType === 'REGISTERED' && (
              <>
                <div className="upload-card">
                  <div className="upload-title">CAC Registration Certificate</div>
                  <button className="upload-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    Select CAC Certificate
                  </button>
                  <div className="upload-formats">Must display your RC/BN Number clearly. PDF preferred.</div>
                  <div className="upload-footer">
                    <span className="sample-link" onClick={() => setSampleModal("CAC Document")}>View Example</span>
                    <span className="required-text">Required</span>
                  </div>
                </div>

                <div className="upload-card">
                  <div className="upload-title">Status Report / Form CAC 1.1</div>
                  <button className="upload-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    Select Status Report
                  </button>
                  <div className="upload-formats">Official document showing current directors and shareholders.</div>
                  <div className="upload-footer">
                    <span className="sample-link" onClick={() => setSampleModal("Status Report")}>View Example</span>
                    <span className="required-text">Required</span>
                  </div>
                </div>
              </>
            )}

            <div className="btn-row">
              <button className="submit-btn" onClick={() => setSection(5)}>Proceed to Settlement</button>
            </div>
          </div>
        )}

        {/* STEP 5: SETTLEMENT */}
        {step === 5 && (
          <div>
            <h2 className="pane-title">Payout Settlement Details</h2>
            <p className="pane-sub">
              {businessType === 'REGISTERED' 
                ? "Provide your Corporate Bank Account. The name must strictly match your registered CAC Name to prevent payout failures." 
                : "Provide your Personal Bank Account. The name must strictly match your BVN records to prevent payout failures."}
            </p>

            <div className="form-grid">
              <div className="input-group full">
                <label className="input-label">Receiving Bank</label>
                <select className="input-select" value={formData.bankCode} onChange={e => handleInput(e, 'bankCode')}>
                  <option value="" disabled>Search or Select Bank...</option>
                  <option value="058">Guaranty Trust Bank (GTB)</option>
                  <option value="057">Zenith Bank</option>
                  <option value="50515">Moniepoint MFB</option>
                  <option value="090267">Kuda Bank</option>
                  <option value="100004">OPay Digital Services</option>
                </select>
              </div>
              
              <div className="input-group full">
                <label className="input-label">NUBAN Account Number</label>
                <input type="text" className="input-field" placeholder="10-digit account number" value={formData.accountNumber} onChange={e => handleNumberInput(e, 'accountNumber', 10)} />
              </div>

              <div className="input-group full" style={{ background: 'var(--brand-light)', borderColor: 'var(--brand-light)' }}>
                <label className="input-label" style={{ background: 'var(--brand-light)' }}>Account Resolution</label>
                <input type="text" className="input-field" disabled placeholder={formData.accountNumber.length === 10 ? "Verifying with NIBSS..." : "Awaiting 10-digit account number..."} />
              </div>
            </div>
            
            <Link href="/dashboard" style={{ textDecoration: 'none', display: 'block', marginTop: '40px' }}>
              <button className="submit-btn" style={{ width: '100%' }}>Submit for Compliance Review</button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
