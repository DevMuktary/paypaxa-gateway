'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// @ts-ignore: Bypasses Next.js strict TS compiler checking the internal react-webcam defaultProps
const Webcam: any = dynamic(() => import('react-webcam'), { ssr: false });
import type * as blazefaceType from '@tensorflow-models/blazeface';

const TooltipLabel = ({ label, htmlFor, required, tooltipText }: { label: string, htmlFor?: string, required?: boolean, tooltipText?: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <label htmlFor={htmlFor} className="input-label" style={{ cursor: 'pointer', margin: 0 }}>
          {label} {required && <span className="required-star">*</span>}
        </label>
        {tooltipText && (
          <button type="button" onClick={() => setShow(!show)} style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-light)', cursor: 'pointer', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', padding: 0, opacity: 0.7 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </button>
        )}
      </div>
      {show && tooltipText && (
        <div style={{ fontSize: '13px', padding: '10px 12px', backgroundColor: 'var(--bg-overlay)', borderRadius: '6px', marginTop: '6px', borderLeft: '3px solid var(--brand-primary)', opacity: 0.9, lineHeight: 1.4 }}>{tooltipText}</div>
      )}
    </div>
  );
};

export default function OwnersPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // TFJS Liveness State
  const webcamRef = useRef<any>(null); 
  const requestRef = useRef<number>();
  const modelRef = useRef<blazefaceType.BlazeFaceModel | null>(null);
  const movementHistory = useRef<{x: number, y: number}[]>([]);
  
  const [modelLoading, setModelLoading] = useState(true);
  const [faceStatus, setFaceStatus] = useState<'START' | 'NO_FACE' | 'MOVE_CLOSER' | 'CENTER_FACE' | 'HOLD_STILL' | 'STATIC_DETECTED' | 'CAPTURED'>('START');
  const [holdProgress, setHoldProgress] = useState(0); 

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    bvn: '',
    bvnConsent: false,
    livenessImage: '' as string | null
  });

  const maxDOB = new Date();
  maxDOB.setFullYear(maxDOB.getFullYear() - 18);
  const maxDateString = maxDOB.toISOString().split('T')[0];

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, field: string, maxLength: number) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, maxLength);
    setFormData({ ...formData, [field]: value });
  };

  // 1. Fetch Saved Data
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const response = await fetch('/api/compliance/owners');
        if (response.ok) {
          const data = await response.json();
          if (data.bvn) {
            setFormData({
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              dob: data.dob || '',
              bvn: data.bvn || '',
              bvnConsent: data.bvnConsent || false,
              livenessImage: data.livenessImage || null
            });
            if (data.livenessImage) setFaceStatus('CAPTURED');
          }
        }
      } catch (error) {
        console.error("Data load error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSavedData();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 2. Load AI Model in Background
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
        console.error("AI load error:", error);
      }
    };
    loadModelInBackground();
    return () => { isMounted = false; };
  }, []);

  // 3. AI Liveness Loop
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
                  setFormData(f => ({ ...f, livenessImage: imageSrc }));
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
  const retakePhoto = () => { setFormData(f => ({...f, livenessImage: null})); setHoldProgress(0); movementHistory.current = []; setFaceStatus('START'); };

  // 4. Save & Next
  const handleSaveAndNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.livenessImage || !formData.bvnConsent) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/compliance/owners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/dashboard/compliance/documents');
      } else {
        alert("Failed to save progress.");
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><svg className="animate-spin" style={{ color: 'var(--brand-primary)' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg></div>;
  }

  return (
    <form onSubmit={handleSaveAndNext}>
      <h2 className="page-title">Business Owners / Directors</h2>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.5 }}>
        Provide the details of the primary business owner. This information must strictly match the records attached to the Bank Verification Number (BVN).
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <TooltipLabel label="First name" htmlFor="firstName" required tooltipText="Legal first name exactly as it appears on your BVN." />
          <input type="text" id="firstName" name="firstName" className="input-field" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <TooltipLabel label="Last name" htmlFor="lastName" required tooltipText="Legal last name exactly as it appears on your BVN." />
          <input type="text" id="lastName" name="lastName" className="input-field" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <TooltipLabel label="Date of birth (18+)" htmlFor="dob" required tooltipText="You must be at least 18 years old to operate a business account." />
          <input type="date" id="dob" name="dob" className="input-field" max={maxDateString} required value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
        </div>

        <div className="input-group" style={{ marginBottom: 0 }}>
          <TooltipLabel label="Bank Verification Number (BVN)" htmlFor="bvn" required tooltipText="Your 11-digit BVN is securely verified with NIBSS. We do not store it permanently." />
          <input type="text" id="bvn" name="bvn" className="input-field" placeholder="Enter 11-digit BVN" required value={formData.bvn} onChange={e => handleNumberInput(e, 'bvn', 11)} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: 'var(--bg-overlay)', padding: '16px', borderRadius: '8px', border: '1px dashed var(--brand-primary)', marginTop: '24px', marginBottom: '40px' }}>
        <input type="checkbox" id="bvnConsent" name="bvnConsent" checked={formData.bvnConsent} onChange={e => setFormData({...formData, bvnConsent: e.target.checked})} style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: 'var(--brand-primary)', cursor: 'pointer' }} />
        <label htmlFor="bvnConsent" style={{ fontSize: '13px', color: 'inherit', lineHeight: 1.5, cursor: 'pointer', opacity: 0.9 }}>
          <strong>Legal Consent:</strong> I authorize PAYPAXA to securely verify my identity using my Bank Verification Number (BVN) in accordance with CBN regulations. I understand providing false identity information may result in account termination.
        </label>
      </div>

      {/* AI LIVENESS SECTION */}
      <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>Facial Liveness Verification</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-overlay)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '32px 16px' }}>
        {modelLoading && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', background: 'var(--border-light)', marginBottom: '24px' }}>Loading AI Engine...</div>}
        {!modelLoading && faceStatus === 'START' && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', background: 'var(--border-light)', marginBottom: '24px' }}>Camera Ready</div>}
        {!modelLoading && faceStatus === 'NO_FACE' && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', marginBottom: '24px' }}>No face detected in frame</div>}
        {!modelLoading && faceStatus === 'MOVE_CLOSER' && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', marginBottom: '24px' }}>Move Closer</div>}
        {!modelLoading && faceStatus === 'CENTER_FACE' && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', marginBottom: '24px' }}>Center your face</div>}
        {!modelLoading && faceStatus === 'STATIC_DETECTED' && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', marginBottom: '24px' }}>Static Photo Detected!</div>}
        {!modelLoading && faceStatus === 'HOLD_STILL' && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', background: 'var(--brand-light)', color: 'var(--brand-primary)', marginBottom: '24px' }}>Hold Still... {Math.floor(holdProgress)}%</div>}
        {!modelLoading && faceStatus === 'CAPTURED' && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', marginBottom: '24px' }}>Verification Complete</div>}

        <div style={{ width: '280px', height: '280px', borderRadius: '50%', overflow: 'hidden', position: 'relative', marginBottom: '32px', background: 'var(--border-light)', boxShadow: '0 0 0 8px var(--bg-main)' }}>
          {faceStatus === 'CAPTURED' && formData.livenessImage ? (
            <img src={formData.livenessImage} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} alt="Captured" />
          ) : (
            <>
              <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} videoConstraints={{ facingMode: "user" }} />
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '8px solid transparent', borderTopColor: '#10B981', borderRightColor: '#10B981', transition: 'transform 0.1s linear', pointerEvents: 'none', transform: `rotate(${(holdProgress / 100) * 360}deg)`, opacity: holdProgress > 0 ? 1 : 0 }}></div>
            </>
          )}
        </div>

        {faceStatus === 'START' && !modelLoading && (
          <button type="button" className="btn-primary" style={{ marginTop: 0 }} onClick={startScan}>Begin Facial Scan</button>
        )}

        {faceStatus === 'CAPTURED' && (
          <button type="button" className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--border-light)', color: 'inherit', marginTop: 0 }} onClick={retakePhoto}>Retake Scan</button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
        <button type="submit" className="btn-primary" disabled={isSaving || !formData.bvnConsent || !formData.livenessImage}>
          {isSaving ? 'Saving...' : 'Save and Continue'}
        </button>
      </div>
    </form>
  );
}
