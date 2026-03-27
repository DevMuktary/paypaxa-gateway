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

  const [formData, setFormData] = useState({
    corporateName: '', rcNumber: '', tin: '', address: '', website: '',
    firstName: '', lastName: '', dob: '', phone: '', bvn: '', consent: false,
    bankCode: '', accountNumber: ''
  });

  // Enforce strictly 18+ Age Restriction
  const maxDOB = new Date();
  maxDOB.setFullYear(maxDOB.getFullYear() - 18);
  const maxDateString = maxDOB.toISOString().split('T')[0];

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
    { id: 1, title: 'Entity Selection', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path></svg> },
    { id: 2, title: 'Profile & Details', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
    { id: 3, title: 'Liveness Verification', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg> },
    { id: 4, title: 'Required Documents', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
    { id: 5, title: 'Settlement Account', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg> }
  ];

  if (!isClient) return null;

  return (
    <div className="compliance-layout">
      <style dangerouslySetInnerHTML={{__html: `
        /* BRANDING COLORS */
        :root {
          --bg-main: #F4F7FE;
          --card-bg: #FFFFFF;
          --text-main: #111827;
          --text-muted: #64748B;
          --border-color: #E2E8F0;
          --brand-dark: #0B192C; 
          --brand-primary: #1A56DB; 
          --brand-light: #EFF6FF;
          --pending-bg: #FEF3C7;
          --pending-text: #D97706;
          --success: #10B981;
          --error: #EF4444;
        }

        /* AUTO DARK MODE ADAPTATION */
        @media (prefers-color-scheme: dark) {
          :root {
            --bg-main: #060D18; /* Deepest dark blue for background */
            --card-bg: #0B192C; /* Corporate Dark Blue for cards */
            --text-main: #F9FAFB;
            --text-muted: #9CA3AF;
            --border-color: #1E293B;
            --brand-dark: #0B192C; 
            --brand-primary: #3B82F6;
            --brand-light: rgba(59, 130, 246, 0.15);
            --pending-bg: rgba(217, 119, 6, 0.15);
            --pending-text: #FCD34D;
          }
        }

        .compliance-layout { display: flex; min-height: 100vh; background: var(--bg-main); font-family: 'Inter', system-ui, sans-serif; align-items: flex-start; justify-content: center; padding: 40px 20px; gap: 32px; }

        /* ACTIVATION SIDEBAR */
        .activation-sidebar { width: 320px; background: var(--card-bg); border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid var(--border-color); flex-shrink: 0; position: sticky; top: 40px; }
        .sidebar-title { font-size: 16px; font-weight: 800; color: var(--text-main); margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .section-item { display: flex; flex-direction: column; padding: 16px; border-radius: 12px; margin-bottom: 8px; cursor: pointer; transition: 0.2s; border: 1px solid transparent; }
        .section-item:hover { background: var(--bg-main); }
        .section-item.active { background: var(--brand-primary); color: #FFFFFF; box-shadow: 0 4px 12px rgba(26, 86, 219, 0.2); }
        
        .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .section-title { font-size: 15px; font-weight: 700; line-height: 1.3; }
        .section-item.active .section-title { color: #FFFFFF; }
        .section-item:not(.active) .section-title { color: var(--text-main); }
        
        .section-icon { display: flex; align-items: center; justify-content: center; }
        .section-item.active .section-icon { color: #FFFFFF; }
        .section-item:not(.active) .section-icon { color: var(--text-muted); }

        /* ALL BADGES SET TO PENDING BY DEFAULT */
        .badge { display: inline-block; padding: 6px 12px; border-radius: 100px; font-size: 11px; font-weight: 800; width: fit-content; text-transform: uppercase; letter-spacing: 0.5px; }
        .badge-pending { background: var(--pending-bg); color: var(--pending-text); }
        .section-item.active .badge-pending { background: rgba(255,255,255,0.2); color: #FFFFFF; }

        /* MAIN CONTENT PANE */
        .content-pane { flex: 1; max-width: 760px; background: var(--card-bg); border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid var(--border-color); padding: 40px; }
        .pane-title { font-size: 24px; font-weight: 800; color: var(--text-main); margin: 0 0 8px 0; }
        .pane-sub { font-size: 14px; color: var(--text-muted); margin: 0 0 32px 0; border-bottom: 1px solid var(--border-color); padding-bottom: 24px; line-height: 1.5; }

        /* INPUTS */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
        .input-group { position: relative; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px 16px; transition: 0.2s; }
        .input-group.full { grid-column: 1 / -1; margin-bottom: 24px; }
        .input-group:focus-within { border-color: var(--brand-primary); box-shadow: 0 0 0 3px var(--brand-light); }
        .input-label { position: absolute; top: -10px; left: 12px; background: var(--card-bg); padding: 0 4px; font-size: 12px; font-weight: 700; color: var(--brand-primary); }
        .input-field { width: 100%; border: none; outline: none; font-size: 15px; color: var(--text-main); background: transparent; padding: 4px 0; }
        .input-field::placeholder { color: var(--text-muted); opacity: 0.5; }
        .input-select { width: 100%; border: none; outline: none; font-size: 15px; color: var(--text-main); background: transparent; padding: 4px 0; cursor: pointer; -webkit-appearance: none; }

        /* ENTITY TYPE CARDS */
        .type-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
        .type-option { padding: 24px; border: 2px solid var(--border-color); border-radius: 16px; text-align: center; cursor: pointer; transition: 0.2s; background: transparent; }
        .type-option:hover { border-color: var(--text-muted); }
        .type-option.active { border-color: var(--brand-primary); background: var(--brand-light); }
        .type-title { font-size: 16px; font-weight: 800; color: var(--text-main); margin-bottom: 8px; }
        .type-desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; }

        /* UPLOADS */
        .upload-card { border: 2px dashed var(--border-color); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px; transition: 0.2s; background: transparent; }
        .upload-card:hover { border-color: var(--brand-primary); background: var(--brand-light); }
        .upload-title { font-size: 16px; font-weight: 800; color: var(--text-main); margin-bottom: 16px; }
        .upload-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--brand-light); color: var(--brand-primary); border: 1px solid var(--brand-primary); padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; margin-bottom: 16px; transition: 0.2s; }
        .upload-btn:hover { background: var(--brand-primary); color: #FFFFFF; }
        .upload-formats { font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }
        .upload-footer { display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 600; padding-top: 16px; border-top: 1px dashed var(--border-color); }
        .sample-link { color: var(--brand-primary); cursor: pointer; text-decoration: underline; text-underline-offset: 4px; }
        .required-text { color: var(--error); }

        /* CAMERA SECTION */
        .camera-section { display: flex; flex-direction: column; align-items: center; }
        .video-mask { width: 300px; height: 300px; border-radius: 50%; overflow: hidden; position: relative; margin: 0 auto 32px auto; background: var(--bg-main); box-shadow: 0 0 0 8px var(--border-color); }
        .video-feed { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
        .progress-ring { position: absolute; inset: 0; border-radius: 50%; border: 8px solid transparent; border-top-color: var(--success); border-right-color: var(--success); transition: transform 0.1s linear; pointer-events: none; z-index: 10; }
        
        .status-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 100px; font-weight: 700; font-size: 14px; margin-bottom: 24px; }
        .status-ready { background: var(--border-color); color: var(--text-main); }
        .status-error { background: rgba(239, 68, 68, 0.1); color: var(--error); }
        .status-good { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .status-capturing { background: var(--brand-light); color: var(--brand-primary); }

        /* BUTTONS */
        .btn-row { display: flex; justify-content: flex-end; gap: 16px; margin-top: 32px; }
        .submit-btn { background: var(--brand-primary); color: #FFFFFF; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 15px; border: none; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(26, 86, 219, 0.2); }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(26, 86, 219, 0.3); }
        .submit-btn:disabled { background: var(--border-color); color: var(--text-muted); cursor: not-allowed; box-shadow: none; transform: none; }

        /* MODAL */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
        .modal-content { background: var(--card-bg); width: 100%; max-width: 500px; border-radius: 20px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 1px solid var(--border-color); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px; }
        .modal-title { font-size: 18px; font-weight: 800; color: var(--text-main); }
        .modal-close { background: var(--bg-main); border: none; cursor: pointer; color: var(--text-main); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .sample-image-placeholder { width: 100%; height: 250px; background: var(--bg-main); border: 2px dashed var(--border-color); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-weight: 600; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px; }

        @media (max-width: 900px) {
          .compliance-layout { flex-direction: column; padding: 16px; }
          .activation-sidebar { width: 100%; position: relative; top: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 20px; }
          .sidebar-title { grid-column: 1 / -1; margin-bottom: 8px; }
          .content-pane { width: 100%; padding: 32px 20px; }
          .form-grid { grid-template-columns: 1fr; }
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
              <div className="modal-title">{sampleModal} Sample</div>
              <button className="modal-close" onClick={() => setSampleModal(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="sample-image-placeholder">
              [ Reference Image of {sampleModal} ]
            </div>
            <button className="submit-btn" style={{ width: '100%', marginTop: 0 }} onClick={() => setSampleModal(null)}>I Understand</button>
          </div>
        </div>
      )}

      {/* FIXED SIDEBAR - ALL BADGES PENDING */}
      <div className="activation-sidebar">
        <div className="sidebar-title">Activation Sections</div>
        {sections.map((s) => {
          const isActive = step === s.id;
          return (
            <div key={s.id} className={`section-item ${isActive ? 'active' : ''}`} onClick={() => setSection(s.id)}>
              <div className="section-header">
                <div className="section-icon">{s.icon}</div>
                <div className="section-title">{s.title}</div>
              </div>
              <div className={`badge ${isActive ? 'badge-pending' : 'badge-pending'}`}>
                {isActive ? 'In Progress' : 'Pending Verification'}
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
            <h2 className="pane-title">Business Information</h2>
            <p className="pane-sub">How is your business structured? This directly determines the documents required for your KYC approval.</p>
            
            <div className="type-selector">
              <div className={`type-option ${businessType === 'STARTER' ? 'active' : ''}`} onClick={() => setBusinessType('STARTER')}>
                <div className="type-title">Starter Business</div>
                <div className="type-desc">I am an unregistered business, freelancer, or creator.</div>
              </div>
              <div className={`type-option ${businessType === 'REGISTERED' ? 'active' : ''}`} onClick={() => setBusinessType('REGISTERED')}>
                <div className="type-title">Registered Corporate</div>
                <div className="type-desc">I have a registered Corporate Affairs Commission (CAC) certificate.</div>
              </div>
            </div>

            {businessType !== 'UNSELECTED' && (
              <>
                <div className="input-group full">
                  <label className="input-label">Business Name / Brand Name</label>
                  <input type="text" className="input-field" placeholder="What do your customers know you as?" value={formData.corporateName} onChange={e => setFormData({...formData, corporateName: e.target.value})} />
                </div>

                <div className="input-group full">
                  <label className="input-label">Operational Address</label>
                  <input type="text" className="input-field" placeholder="Full business address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>

                <div className="btn-row">
                  <button className="submit-btn" disabled={!formData.corporateName || !formData.address} onClick={() => setSection(2)}>Save and Continue</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 2: DISTINCT PROFILES (STARTER vs REGISTERED) */}
        {step === 2 && (
          <div>
            <h2 className="pane-title">BVN & Identity Information</h2>
            <p className="pane-sub">These details must strictly match the information tied to your Bank Verification Number.</p>
            
            {businessType === 'REGISTERED' && (
              <>
                <div className="section-divider">Corporate Registration Details</div>
                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">CAC Number (RC)</label>
                    <input type="text" className="input-field" placeholder="E.g. RC 123456" value={formData.rcNumber} onChange={e => setFormData({...formData, rcNumber: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Tax ID Number (TIN)</label>
                    <input type="text" className="input-field" placeholder="FIRS TIN" value={formData.tin} onChange={e => setFormData({...formData, tin: e.target.value})} />
                  </div>
                </div>
              </>
            )}

            <div className="section-divider">{businessType === 'REGISTERED' ? "Director's Details" : "Your Personal Details"}</div>
            
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">First Name</label>
                <input type="text" className="input-field" placeholder="As it appears on BVN" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Last Name</label>
                <input type="text" className="input-field" placeholder="As it appears on BVN" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Date of Birth (18+)</label>
                <input type="date" className="input-field" max={maxDateString} value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number (Linked to BVN)</label>
                <input type="tel" className="input-field" placeholder="0800 000 0000" value={formData.phone} onChange={e => handleNumberInput(e, 'phone', 15)} />
              </div>
            </div>

            <div className="input-group full">
              <label className="input-label">Bank Verification Number (BVN)</label>
              <input type="text" className="input-field" placeholder="Enter 11-digit BVN" value={formData.bvn} onChange={e => handleNumberInput(e, 'bvn', 11)} />
            </div>

            <div className="btn-row">
              <button className="submit-btn" disabled={!formData.firstName || !formData.lastName || !formData.dob || formData.bvn.length !== 11} onClick={() => setSection(3)}>Save and Continue</button>
            </div>
          </div>
        )}

        {/* STEP 3: AI LIVENESS */}
        {step === 3 && (
          <div>
            <h2 className="pane-title">Facial Liveness Check</h2>
            <p className="pane-sub">Ensure you are in a well-lit environment. Remove any glasses, hats, or face masks.</p>
            
            <div className="camera-section">
              {modelLoading && <div className="status-badge status-ready">Loading AI Engine...</div>}
              {!modelLoading && faceStatus === 'START' && <div className="status-badge status-ready">Camera Ready</div>}
              {!modelLoading && faceStatus === 'NO_FACE' && <div className="status-badge status-error">No face detected in frame</div>}
              {!modelLoading && faceStatus === 'MOVE_CLOSER' && <div className="status-badge status-error">Move Closer to the Camera</div>}
              {!modelLoading && faceStatus === 'CENTER_FACE' && <div className="status-badge status-error">Center your face</div>}
              {!modelLoading && faceStatus === 'STATIC_DETECTED' && <div className="status-badge status-error">Static Photo Detected. Use a real face.</div>}
              {!modelLoading && faceStatus === 'HOLD_STILL' && <div className="status-badge status-capturing">Hold Still... {Math.floor(holdProgress)}%</div>}
              {!modelLoading && faceStatus === 'CAPTURED' && <div className="status-badge status-good">Verification Complete</div>}

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
                <button className="submit-btn" style={{ maxWidth: '300px', marginTop: 0 }} onClick={startScan}>Begin Facial Scan</button>
              )}

              {faceStatus === 'CAPTURED' && (
                <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '340px' }}>
                  <button className="submit-btn" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', marginTop: 0 }} onClick={retakePhoto}>Retake Scan</button>
                  <button className="submit-btn" style={{ marginTop: 0 }} onClick={() => setSection(4)}>Confirm & Proceed</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: DISTINCT UPLOADS (STARTER vs REGISTERED) */}
        {step === 4 && (
          <div>
            <h2 className="pane-title">Registration Documents</h2>
            <p className="pane-sub">Upload crisp, clear copies of your documents. Blurry uploads will result in compliance rejection.</p>

            <div className="upload-card">
              <div className="upload-title">Valid Government ID ({businessType === 'REGISTERED' ? "Director" : "Personal"})</div>
              <button className="upload-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Choose a File
              </button>
              <div className="upload-formats">NIN Slip, Voter's Card, Intl. Passport, or Driver's License. Max 5MB.</div>
              <div className="upload-footer">
                <span className="sample-link" onClick={() => setSampleModal("Government ID")}>See A Sample</span>
                <span className="required-text">ID Document is required</span>
              </div>
            </div>

            {businessType === 'REGISTERED' && (
              <>
                <div className="upload-card">
                  <div className="upload-title">CAC Registration Certificate</div>
                  <button className="upload-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    Choose a File
                  </button>
                  <div className="upload-formats">Must display your RC Number clearly. PDF preferred. Max 5MB.</div>
                  <div className="upload-footer">
                    <span className="sample-link" onClick={() => setSampleModal("CAC Document")}>See A Sample</span>
                    <span className="required-text">CAC Document is required</span>
                  </div>
                </div>

                <div className="upload-card">
                  <div className="upload-title">Board Resolution / Status Report</div>
                  <button className="upload-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    Choose a File
                  </button>
                  <div className="upload-formats">Form CAC 1.1 showing directors and shareholders. PDF preferred.</div>
                  <div className="upload-footer">
                    <span className="sample-link" onClick={() => setSampleModal("Board Resolution")}>See A Sample</span>
                    <span className="required-text">Status Report is required</span>
                  </div>
                </div>
              </>
            )}

            <div className="btn-row">
              <button className="submit-btn" onClick={() => setSection(5)}>Proceed to Payouts</button>
            </div>
          </div>
        )}

        {/* STEP 5: DISTINCT PAYOUTS (STARTER vs REGISTERED) */}
        {step === 5 && (
          <div>
            <h2 className="pane-title">Settlement Information</h2>
            <p className="pane-sub">
              {businessType === 'REGISTERED' 
                ? "Provide your Corporate Bank Account. The name must strictly match your registered CAC Name." 
                : "Provide your Personal Bank Account. The name must strictly match your BVN records."}
            </p>

            <div className="input-group full">
              <label className="input-label">Bank</label>
              <select className="input-select">
                <option value="">Select a Bank...</option>
                <option value="gtb">Guaranty Trust Bank</option>
                <option value="zenith">Zenith Bank</option>
                <option value="moniepoint">Moniepoint MFB</option>
                <option value="opay">OPay Digital Services</option>
              </select>
            </div>
            
            <div className="input-group full">
              <label className="input-label">Account Number</label>
              {/* 🚀 Restricts input strictly to 10 digits */}
              <input type="text" className="input-field" placeholder="0000000000" value={formData.accountNumber} onChange={e => handleNumberInput(e, 'accountNumber', 10)} />
            </div>

            <div className="input-group full" style={{ background: 'var(--bg-main)', borderColor: 'var(--bg-main)' }}>
              <label className="input-label" style={{ background: 'var(--bg-main)' }}>Account Name Verification</label>
              <input type="text" className="input-field" disabled placeholder="Name will appear after typing 10 digits..." />
            </div>
            
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <button className="submit-btn" style={{ marginTop: '32px' }}>Submit Compliance Data</button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
