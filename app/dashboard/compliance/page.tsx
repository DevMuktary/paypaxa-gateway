'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// 🚀 CRITICAL FIX: Forces webcam to load only in browser AND bypasses strict TS prop checking
const Webcam = dynamic(() => import('react-webcam').then((mod) => mod.default as any), { ssr: false });

import type * as blazefaceType from '@tensorflow-models/blazeface';

export default function CompliancePage() {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState<'STARTER' | 'REGISTERED' | null>(null);
  const [isClient, setIsClient] = useState(false);

  // TFJS Liveness State
  const webcamRef = useRef<any>(null); 
  const requestRef = useRef<number>();
  const modelRef = useRef<blazefaceType.BlazeFaceModel | null>(null);
  
  const [modelLoading, setModelLoading] = useState(false);
  const [faceStatus, setFaceStatus] = useState<'START' | 'NO_FACE' | 'MOVE_CLOSER' | 'CENTER_FACE' | 'HOLD_STILL' | 'CAPTURED'>('START');
  const [holdProgress, setHoldProgress] = useState(0); 
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', phone: '', bvn: '', consent: false,
    industry: '', volume: '', corporateName: '', rcNumber: '', tin: '', bankCode: '', accountNumber: ''
  });

  useEffect(() => {
    setIsClient(true);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    if (step === 3 && !modelRef.current) {
      const loadModel = async () => {
        setModelLoading(true);
        try {
          const tf = await import('@tensorflow/tfjs');
          const blazeface = await import('@tensorflow-models/blazeface');
          await tf.ready();
          modelRef.current = await blazeface.load();
        } catch (error) {
          console.error("Failed to load AI model", error);
        } finally {
          setModelLoading(false);
        }
      };
      loadModel();
    }
  }, [step]);

  const detectFace = useCallback(async () => {
    if (!webcamRef.current || !modelRef.current || faceStatus === 'CAPTURED') return;
    
    const video = webcamRef.current.video;
    if (video && video.readyState === 4) {
      const predictions = await modelRef.current.estimateFaces(video, false);

      if (predictions.length === 0) {
        setFaceStatus('NO_FACE');
        setHoldProgress(0);
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
        } else if (!isCenteredX || !isCenteredY) {
          setFaceStatus('CENTER_FACE');
          setHoldProgress(0);
        } else {
          setFaceStatus('HOLD_STILL');
          setHoldProgress((prev) => {
            const next = prev + 4; 
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
    
    requestRef.current = requestAnimationFrame(detectFace);
  }, [faceStatus]);

  useEffect(() => {
    if (['NO_FACE', 'MOVE_CLOSER', 'CENTER_FACE', 'HOLD_STILL'].includes(faceStatus)) {
      requestRef.current = requestAnimationFrame(detectFace);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [faceStatus, detectFace]);

  const startScan = () => setFaceStatus('NO_FACE');
  const retakePhoto = () => {
    setCapturedImage(null);
    setHoldProgress(0);
    setFaceStatus('START');
  };

  const handleNext = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(prev => prev + 1); };
  const handleBack = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(prev => prev - 1); };

  const steps = [
    { id: 1, title: 'Business Type', desc: 'Select entity structure' },
    { id: 2, title: 'Identity Profile', desc: 'Personal details' },
    { id: 3, title: 'Liveness Scan', desc: 'Facial verification' },
    { id: 4, title: 'Documents', desc: 'Upload paperwork' },
    { id: 5, title: 'Settlement', desc: 'Payout account' }
  ];

  if (!isClient) return null;

  return (
    <div className="compliance-layout">
      <style dangerouslySetInnerHTML={{__html: `
        .compliance-layout { display: flex; min-height: 100vh; background: #F9FAFB; font-family: 'Inter', system-ui, sans-serif; }
        
        /* SIDEBAR (DESKTOP ONLY) */
        .sidebar { width: 340px; background: #FFFFFF; border-right: 1px solid #E5E7EB; padding: 40px; display: flex; flex-direction: column; position: fixed; height: 100vh; overflow-y: auto; z-index: 10; }
        .brand-logo { font-size: 24px; font-weight: 900; color: #111827; margin-bottom: 48px; letter-spacing: -0.5px; }
        
        .step-item { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 32px; position: relative; }
        .step-item:not(:last-child)::after { content: ''; position: absolute; left: 14px; top: 32px; bottom: -24px; width: 2px; background: #F3F4F6; }
        .step-item.active:not(:last-child)::after { background: #E0E7FF; }
        .step-item.completed:not(:last-child)::after { background: #3B82F6; }
        
        .step-circle { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; z-index: 2; transition: 0.3s; background: #FFFFFF; border: 2px solid #E5E7EB; color: #9CA3AF; }
        .step-item.active .step-circle { border-color: #3B82F6; color: #3B82F6; box-shadow: 0 0 0 4px #EFF6FF; }
        .step-item.completed .step-circle { background: #3B82F6; border-color: #3B82F6; color: #FFFFFF; }
        
        .step-text h4 { margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #111827; }
        .step-text p { margin: 0; font-size: 13px; color: #6B7280; }
        .step-item:not(.active):not(.completed) .step-text h4 { color: #9CA3AF; }

        /* MOBILE HEADER (APP-LIKE) */
        .mobile-header { display: none; background: #FFFFFF; padding: 20px; border-bottom: 1px solid #E5E7EB; position: sticky; top: 0; z-index: 20; }
        .mobile-header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .mobile-brand { font-size: 18px; font-weight: 800; color: #111827; }
        .mobile-step-count { font-size: 13px; font-weight: 600; color: #3B82F6; background: #EFF6FF; padding: 4px 10px; border-radius: 12px; }
        .mobile-progress-bar { height: 4px; background: #F3F4F6; border-radius: 4px; overflow: hidden; }
        .mobile-progress-fill { height: 100%; background: #3B82F6; transition: width 0.3s ease; }

        /* MAIN CONTENT PANE */
        .main-content { flex: 1; margin-left: 340px; padding: 60px 40px; display: flex; justify-content: center; }
        .form-container { width: 100%; max-width: 600px; }
        
        .page-title { font-size: 28px; font-weight: 800; color: #111827; margin: 0 0 8px 0; letter-spacing: -0.5px; }
        .page-sub { font-size: 15px; color: #6B7280; margin: 0 0 40px 0; line-height: 1.5; }
        .section-divider { font-size: 14px; font-weight: 700; color: #111827; margin: 32px 0 16px 0; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }

        /* FORM INPUTS */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { margin-bottom: 20px; }
        .form-group.full { grid-column: 1 / -1; }
        .form-label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 8px; }
        .form-input, .form-select { width: 100%; padding: 14px 16px; background-color: #FFFFFF; border: 1px solid #D1D5DB; border-radius: 12px; color: #111827; font-size: 15px; outline: none; transition: all 0.2s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.02); -webkit-appearance: none; }
        .form-input:focus, .form-select:focus { border-color: #3B82F6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        .form-input::placeholder { color: #9CA3AF; }

        /* CARDS & ZONES */
        .type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .type-card { background: #FFFFFF; border: 2px solid #E5E7EB; border-radius: 16px; padding: 24px; cursor: pointer; transition: 0.2s; text-align: left; }
        .type-card:hover { border-color: #D1D5DB; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .type-card.selected { border-color: #3B82F6; background: #EFF6FF; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1); }
        .type-card h3 { margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #111827; }
        .type-card p { margin: 0; font-size: 13px; color: #6B7280; line-height: 1.5; }

        .upload-zone { border: 2px dashed #D1D5DB; border-radius: 16px; padding: 32px 20px; text-align: center; background: #FFFFFF; cursor: pointer; transition: 0.2s; }
        .upload-zone:hover { border-color: #3B82F6; background: #EFF6FF; }
        .upload-title { color: #3B82F6; font-weight: 600; font-size: 14px; margin-bottom: 4px; }
        .upload-sub { color: #6B7280; font-size: 13px; }
        
        .consent-box { display: flex; align-items: flex-start; gap: 12px; background: rgba(59, 130, 246, 0.05); padding: 16px; border-radius: 12px; border: 1px dashed #3B82F6; margin-top: 8px; }
        .consent-box input { margin-top: 4px; width: 18px; height: 18px; cursor: pointer; accent-color: #3B82F6; }
        .consent-box label { font-size: 13px; color: #111827; line-height: 1.5; cursor: pointer; }

        /* CAMERA UI */
        .camera-section { display: flex; flex-direction: column; align-items: center; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 24px; padding: 40px 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
        .video-mask { width: 280px; height: 280px; border-radius: 50%; overflow: hidden; position: relative; margin: 0 auto 32px auto; background: #111827; box-shadow: 0 0 0 8px #F3F4F6, 0 10px 25px rgba(0,0,0,0.1); transform: translateZ(0); }
        .video-feed { width: 100%; height: 100%; object-fit: cover; transform: scaleX(-1); }
        
        .status-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 30px; font-weight: 600; font-size: 14px; margin-bottom: 24px; transition: 0.3s; text-align: center; }
        .status-ready { background: #F3F4F6; color: #4B5563; }
        .status-error { background: #FEF2F2; color: #EF4444; }
        .status-good { background: #ECFDF5; color: #10B981; }
        .status-capturing { background: #EFF6FF; color: #3B82F6; }

        .progress-ring { position: absolute; inset: 0; border-radius: 50%; border: 8px solid transparent; border-top-color: #10B981; border-right-color: #10B981; transition: transform 0.1s linear; z-index: 10; pointer-events: none; }

        /* BUTTONS */
        .btn-row { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 24px; border-top: 1px solid #E5E7EB; gap: 16px; }
        .btn { padding: 16px 24px; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; white-space: nowrap; }
        .btn-outline { background: transparent; border: 1px solid #D1D5DB; color: #374151; }
        .btn-outline:hover { background: #F9FAFB; }
        .btn-solid { background: #111827; color: #FFFFFF; border: none; flex: 1; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .btn-solid:hover { background: #374151; transform: translateY(-1px); box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
        .btn-solid:disabled { background: #D1D5DB; color: #9CA3AF; cursor: not-allowed; transform: none; box-shadow: none; }

        @media (max-width: 1024px) {
          .compliance-layout { flex-direction: column; }
          .sidebar { display: none; }
          .mobile-header { display: block; }
          .main-content { margin-left: 0; padding: 32px 20px; }
        }
        @media (max-width: 600px) {
          .type-grid, .form-grid { grid-template-columns: 1fr; }
          .btn-row { flex-direction: column-reverse; }
          .btn { width: 100%; }
        }
      `}} />

      {/* MOBILE HEADER */}
      <div className="mobile-header">
        <div className="mobile-header-top">
          <div className="mobile-brand">PAYPAXA</div>
          <div className="mobile-step-count">Step {step} of 5</div>
        </div>
        <div className="mobile-progress-bar">
          <div className="mobile-progress-fill" style={{ width: `${(step / 5) * 100}%` }}></div>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="sidebar">
        <div className="brand-logo">PAYPAXA</div>
        <div className="steps-container">
          {steps.map((s) => (
            <div key={s.id} className={`step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
              <div className="step-circle">
                {step > s.id ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> : s.id}
              </div>
              <div className="step-text">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="form-container">
          
          {step === 1 && (
            <div>
              <h1 className="page-title">Entity Configuration</h1>
              <p className="page-sub">How is your business structured? This determines your KYC requirements.</p>

              <div className="type-grid">
                <div className={`type-card ${businessType === 'STARTER' ? 'selected' : ''}`} onClick={() => setBusinessType('STARTER')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ background: businessType === 'STARTER' ? '#3B82F6' : '#F3F4F6', color: businessType === 'STARTER' ? '#FFF' : '#6B7280', padding: '8px', borderRadius: '8px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    {businessType === 'STARTER' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
                  </div>
                  <h3>Starter Business</h3>
                  <p>I am an independent creator, freelancer, or unregistered business. I do not have a CAC certificate.</p>
                </div>

                <div className={`type-card ${businessType === 'REGISTERED' ? 'selected' : ''}`} onClick={() => setBusinessType('REGISTERED')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ background: businessType === 'REGISTERED' ? '#3B82F6' : '#F3F4F6', color: businessType === 'REGISTERED' ? '#FFF' : '#6B7280', padding: '8px', borderRadius: '8px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
                    </div>
                    {businessType === 'REGISTERED' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
                  </div>
                  <h3>Registered Corporate</h3>
                  <p>My business is fully registered with the Corporate Affairs Commission (CAC) and I have a TIN.</p>
                </div>
              </div>

              <div className="btn-row">
                <div className="btn-spacer" style={{ flex: 1 }}></div>
                <button className="btn btn-solid" style={{ flex: 'none', minWidth: '200px' }} disabled={!businessType} onClick={handleNext}>Continue →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="page-title">Identity Profile</h1>
              <p className="page-sub">Provide your legal details. This information must perfectly match your government IDs and BVN records.</p>

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

              <div className="section-divider">{businessType === 'REGISTERED' ? "Director's Personal Details" : "Your Legal Details"}</div>
              
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
                  <label className="form-label">Date of Birth</label>
                  <input type="date" className="form-input" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-input" placeholder="+234 000 000 0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                
                <div className="form-group full">
                  <label className="form-label">Bank Verification Number (BVN)</label>
                  <input type="text" className="form-input" placeholder="Enter 11-digit BVN" maxLength={11} value={formData.bvn} onChange={e => setFormData({...formData, bvn: e.target.value})} />
                </div>
              </div>

              <div className="consent-box">
                <input type="checkbox" id="consent-check" checked={formData.consent} onChange={e => setFormData({...formData, consent: e.target.checked})} />
                <label htmlFor="consent-check"><strong>Legal Consent:</strong> I authorize PAYPAXA to verify my identity using my Bank Verification Number (BVN) in accordance with CBN regulations.</label>
              </div>

              <div className="btn-row">
                <button className="btn btn-outline" onClick={handleBack}>Back</button>
                <button className="btn btn-solid" disabled={!formData.firstName || !formData.lastName || !formData.bvn || formData.bvn.length !== 11 || !formData.consent} onClick={handleNext}>Continue to Camera →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="page-title">Liveness Verification</h1>
              <p className="page-sub">We need to ensure you are a real person matching the submitted identity. Please remove glasses and hats.</p>

              <div className="camera-section">
                {modelLoading && <div className="status-badge status-ready"><svg className="animate-spin" style={{ display: 'inline', marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Loading AI Model...</div>}
                
                {!modelLoading && faceStatus === 'START' && <div className="status-badge status-ready">Camera Ready</div>}
                {!modelLoading && faceStatus === 'NO_FACE' && <div className="status-badge status-error">No face detected</div>}
                {!modelLoading && faceStatus === 'MOVE_CLOSER' && <div className="status-badge status-error">Move closer to camera</div>}
                {!modelLoading && faceStatus === 'CENTER_FACE' && <div className="status-badge status-error">Center your face in the circle</div>}
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
                    <p style={{ color: '#111827', fontWeight: 600, marginBottom: '16px', fontSize: '15px' }}>Is your face clear and well-lit?</p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                      <button className="btn btn-outline" style={{ flex: 1 }} onClick={retakePhoto}>Retake</button>
                      <button className="btn btn-solid" style={{ flex: 1, background: '#10B981' }} onClick={handleNext}>Yes, Looks Good</button>
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

          {step === 4 && (
            <div>
              <h1 className="page-title">Document Uploads</h1>
              <p className="page-sub">Upload crisp, clear copies of your official documents. Blurry uploads will be rejected during manual review.</p>
              
              <div className="form-group full">
                <label className="form-label">Government Issued ID ({formData.firstName} {formData.lastName})</label>
                <div className="upload-zone">
                  <div className="upload-title">Click or drag file to upload</div>
                  <div className="upload-sub">Valid Passport, Driver's License, or NIN Slip (PDF, JPG, PNG)</div>
                </div>
              </div>

              {businessType === 'REGISTERED' && (
                <div className="form-group full" style={{ marginTop: '24px' }}>
                  <label className="form-label">CAC Registration Certificate</label>
                  <div className="upload-zone">
                    <div className="upload-title">Click or drag CAC Certificate</div>
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

          {step === 5 && (
            <div>
              <h1 className="page-title">Payout Account</h1>
              <p className="page-sub">Where should we settle your funds? The account name must strictly match your BVN or Corporate Name.</p>

              <div className="form-group">
                <label className="form-label">Select Bank</label>
                <select className="form-select">
                  <option value="">Choose a bank...</option>
                  <option value="gtb">Guaranty Trust Bank</option>
                  <option value="zenith">Zenith Bank</option>
                  <option value="moniepoint">Moniepoint MFB</option>
                  <option value="opay">OPay Digital Services</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Account Number</label>
                <input type="text" className="form-input" placeholder="0000000000" maxLength={10} />
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
    </div>
  );
}
