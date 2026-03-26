'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ApiKeysPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI States
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [webhookSaving, setWebhookSaving] = useState<string | null>(null);
  const [webhookInputs, setWebhookInputs] = useState<Record<string, string>>({});
  
  // NEW: Status state for inline success/error messages
  const [webhookStatus, setWebhookStatus] = useState<Record<string, { type: 'success' | 'error', message: string } | null>>({});

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const response = await fetch('/api/merchant/api-keys');
        if (response.ok) {
          const result = await response.json();
          setData(result);
          
          const initialWebhooks: Record<string, string> = {};
          result.keys.forEach((k: any) => {
            initialWebhooks[k.id] = k.webhookUrl || '';
          });
          setWebhookInputs(initialWebhooks);
        }
      } catch (error) {
        console.error("Failed to fetch keys");
      } finally {
        setIsLoading(false);
      }
    };
    fetchKeys();
  }, []);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleReveal = (keyId: string) => {
    setRevealedKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const handleWebhookChange = (keyId: string, value: string) => {
    setWebhookInputs(prev => ({ ...prev, [keyId]: value }));
    // Clear any existing errors when the user starts typing again
    if (webhookStatus[keyId]) {
      setWebhookStatus(prev => ({ ...prev, [keyId]: null }));
    }
  };

  // NEW: Strict URL Validator
  const isValidUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (e) {
      return false;
    }
  };

  const saveWebhook = async (keyId: string) => {
    const urlToSave = webhookInputs[keyId]?.trim();

    // 1. Validate the URL (allow empty string if they want to delete their webhook)
    if (urlToSave && !isValidUrl(urlToSave)) {
      setWebhookStatus(prev => ({ 
        ...prev, 
        [keyId]: { type: 'error', message: 'Please enter a valid URL including https://' } 
      }));
      return;
    }

    setWebhookSaving(keyId);
    setWebhookStatus(prev => ({ ...prev, [keyId]: null })); // Clear old status

    try {
      const response = await fetch('/api/merchant/api-keys', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyId, webhookUrl: urlToSave })
      });
      
      if (response.ok) {
        setWebhookStatus(prev => ({ 
          ...prev, 
          [keyId]: { type: 'success', message: 'Webhook saved successfully!' } 
        }));
        
        // Auto-hide the success message after 3 seconds for a clean UI
        setTimeout(() => {
          setWebhookStatus(prev => ({ ...prev, [keyId]: null }));
        }, 3000);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setWebhookStatus(prev => ({ 
        ...prev, 
        [keyId]: { type: 'error', message: 'Failed to save webhook. Please try again.' } 
      }));
    } finally {
      setWebhookSaving(null);
    }
  };

  const sandboxKey = data?.keys.find((k: any) => k.environment === 'SANDBOX');
  const liveKey = data?.keys.find((k: any) => k.environment === 'LIVE');

  // Icons
  const CopyIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
  const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
  const EyeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
  const EyeOffIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
  const LockIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

  return (
    <div className="content-pad">
      <style dangerouslySetInnerHTML={{__html: `
        .content-pad { padding: 40px; max-width: 1000px; margin: 0 auto; }
        .page-title { font-size: 28px; font-weight: 800; margin: 0 0 8px 0; color: var(--text-high); letter-spacing: -0.5px; }
        .page-sub { color: var(--text-med); font-size: 15px; margin: 0 0 40px 0; line-height: 1.5; }

        .key-section { background-color: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 20px; padding: 32px; margin-bottom: 32px; box-shadow: var(--shadow-soft); position: relative; overflow: hidden; }
        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; }
        .section-title { font-size: 18px; font-weight: 700; color: var(--text-high); margin: 0; display: flex; align-items: center; gap: 8px; }
        .badge-test { background: rgba(245, 158, 11, 0.1); color: #F59E0B; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid rgba(245, 158, 11, 0.2); }
        .badge-live { background: rgba(16, 185, 129, 0.1); color: #10B981; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid rgba(16, 185, 129, 0.2); }

        .key-row { margin-bottom: 24px; }
        .key-label { font-size: 13px; font-weight: 600; color: var(--text-med); margin-bottom: 8px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
        .key-input-group { display: flex; align-items: center; background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 12px; padding: 4px 4px 4px 16px; transition: 0.2s; }
        .key-input-group:hover { border-color: var(--brand-primary); }
        .key-value { flex: 1; font-family: monospace; font-size: 15px; color: var(--text-high); letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 8px 0; }
        
        .btn-icon { background: transparent; border: none; color: var(--text-med); padding: 10px; border-radius: 8px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .btn-icon:hover { background: var(--nav-hover); color: var(--text-high); }
        .btn-copy { display: flex; align-items: center; gap: 6px; background: var(--bg-panel); border: 1px solid var(--border-color); color: var(--text-high); font-size: 13px; font-weight: 600; padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .btn-copy:hover { background: var(--nav-hover); border-color: var(--text-med); }

        .webhook-group { display: flex; gap: 12px; }
        .webhook-input { flex: 1; padding: 12px 16px; background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-high); font-size: 14px; outline: none; transition: 0.2s; }
        .webhook-input:focus { border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        .btn-save { background: var(--text-high); color: var(--bg-panel); border: none; padding: 0 24px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; transition: 0.2s; white-space: nowrap; }
        .btn-save:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* NEW: Inline Status Messages */
        .status-msg { font-size: 13px; font-weight: 500; margin-top: 8px; display: block; animation: fadeIn 0.3s ease; }
        .status-success { color: #10B981; }
        .status-error { color: #EF4444; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

        /* LOCKED STATE */
        .locked-overlay { position: absolute; inset: 0; background: rgba(var(--bg-panel-rgb), 0.6); backdrop-filter: blur(8px); z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 32px; border-radius: 20px; }
        .locked-content { max-width: 400px; display: flex; flex-direction: column; align-items: center; }
        .locked-icon { color: var(--text-med); margin-bottom: 16px; background: var(--bg-main); padding: 16px; border-radius: 50%; border: 1px solid var(--border-color); }
        
        /* Updated KYC Link styling */
        .btn-kyc { margin-top: 24px; background: var(--brand-primary); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: 0.2s; text-decoration: none; display: inline-block; }
        .btn-kyc:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4); color: white; }

        @media (max-width: 768px) {
          .content-pad { padding: 20px 16px; }
          .key-section { padding: 24px 20px; }
          .webhook-group { flex-direction: column; }
          .btn-save { padding: 14px; }
        }
      `}} />

      <div>
        <h1 className="page-title">API Keys & Webhooks</h1>
        <p className="page-sub">Use these keys to authenticate API requests from your application. Never share your secret keys or expose them in client-side code.</p>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-med)' }}>Loading API Configuration...</div>
      ) : (
        <>
          {/* SANDBOX SECTION */}
          {sandboxKey && (
            <div className="key-section" style={{ borderTop: '4px solid #F59E0B' }}>
              <div className="section-header">
                <h2 className="section-title">Test Environment <span className="badge-test">Sandbox</span></h2>
              </div>

              <div className="key-row">
                <label className="key-label">Public Key</label>
                <div className="key-input-group">
                  <div className="key-value">{sandboxKey.publicKey}</div>
                  <button className="btn-copy" onClick={() => handleCopy(sandboxKey.publicKey, 'test_pub')}>
                    {copiedKey === 'test_pub' ? <><CheckIcon /> Copied</> : <><CopyIcon /> Copy</>}
                  </button>
                </div>
              </div>

              <div className="key-row">
                <label className="key-label">Secret Key</label>
                <div className="key-input-group">
                  <div className="key-value">
                    {revealedKeys[sandboxKey.id] ? sandboxKey.secretKey : 'sk_test_••••••••••••••••••••••••••••••••••••••••'}
                  </div>
                  <button className="btn-icon" onClick={() => toggleReveal(sandboxKey.id)} title="Reveal Key">
                    {revealedKeys[sandboxKey.id] ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                  <button className="btn-copy" onClick={() => handleCopy(sandboxKey.secretKey, 'test_sec')}>
                    {copiedKey === 'test_sec' ? <><CheckIcon /> Copied</> : <><CopyIcon /> Copy</>}
                  </button>
                </div>
              </div>

              <div className="key-row" style={{ marginTop: '40px' }}>
                <label className="key-label">Test Webhook URL</label>
                <p style={{ fontSize: '13px', color: 'var(--text-med)', marginBottom: '12px' }}>We will send POST requests to this URL when test events occur (e.g. successful payment).</p>
                <div className="webhook-group">
                  <input 
                    type="url" 
                    className="webhook-input" 
                    placeholder="https://your-website.com/api/webhook" 
                    value={webhookInputs[sandboxKey.id] || ''}
                    onChange={(e) => handleWebhookChange(sandboxKey.id, e.target.value)}
                  />
                  <button 
                    className="btn-save" 
                    onClick={() => saveWebhook(sandboxKey.id)}
                    disabled={webhookSaving === sandboxKey.id}
                  >
                    {webhookSaving === sandboxKey.id ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
                
                {/* NEW: Inline Status Display */}
                {webhookStatus[sandboxKey.id] && (
                  <span className={`status-msg ${webhookStatus[sandboxKey.id]?.type === 'error' ? 'status-error' : 'status-success'}`}>
                    {webhookStatus[sandboxKey.id]?.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* LIVE SECTION (Locked if unverified) */}
          <div className="key-section" style={{ borderTop: '4px solid #10B981', opacity: data.isLiveEnabled ? 1 : 0.8 }}>
            
            {!data.isLiveEnabled && (
              <div className="locked-overlay">
                <div className="locked-content">
                  <div className="locked-icon"><LockIcon /></div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: 'var(--text-high)' }}>Live Keys Locked</h3>
                  <p style={{ margin: 0, color: 'var(--text-med)', fontSize: '14px', lineHeight: '1.6' }}>
                    You must verify your business identity before accessing live API keys to process real money.
                  </p>
                  
                  {/* NEW: Routing directly to the Compliance page */}
                  <Link href="/dashboard/compliance" className="btn-kyc">
                    Complete Verification
                  </Link>
                </div>
              </div>
            )}

            <div className="section-header">
              <h2 className="section-title">Production Environment <span className="badge-live">Live</span></h2>
            </div>

            {liveKey ? (
              <>
                <div className="key-row">
                  <label className="key-label">Public Key</label>
                  <div className="key-input-group">
                    <div className="key-value">{liveKey.publicKey}</div>
                    <button className="btn-copy" onClick={() => handleCopy(liveKey.publicKey, 'live_pub')}>
                      {copiedKey === 'live_pub' ? <><CheckIcon /> Copied</> : <><CopyIcon /> Copy</>}
                    </button>
                  </div>
                </div>

                <div className="key-row">
                  <label className="key-label">Secret Key</label>
                  <div className="key-input-group">
                    <div className="key-value">
                      {revealedKeys[liveKey.id] ? liveKey.secretKey : 'sk_live_••••••••••••••••••••••••••••••••••••••••'}
                    </div>
                    <button className="btn-icon" onClick={() => toggleReveal(liveKey.id)} title="Reveal Key">
                      {revealedKeys[liveKey.id] ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                    <button className="btn-copy" onClick={() => handleCopy(liveKey.secretKey, 'live_sec')}>
                      {copiedKey === 'live_sec' ? <><CheckIcon /> Copied</> : <><CopyIcon /> Copy</>}
                    </button>
                  </div>
                </div>

                <div className="key-row" style={{ marginTop: '40px' }}>
                  <label className="key-label">Live Webhook URL</label>
                  <p style={{ fontSize: '13px', color: 'var(--text-med)', marginBottom: '12px' }}>We will send POST requests to this URL for live production events.</p>
                  <div className="webhook-group">
                    <input 
                      type="url" 
                      className="webhook-input" 
                      placeholder="https://your-website.com/api/webhook" 
                      value={webhookInputs[liveKey.id] || ''}
                      onChange={(e) => handleWebhookChange(liveKey.id, e.target.value)}
                    />
                    <button 
                      className="btn-save" 
                      onClick={() => saveWebhook(liveKey.id)}
                      disabled={webhookSaving === liveKey.id}
                    >
                      {webhookSaving === liveKey.id ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>

                  {webhookStatus[liveKey.id] && (
                    <span className={`status-msg ${webhookStatus[liveKey.id]?.type === 'error' ? 'status-error' : 'status-success'}`}>
                      {webhookStatus[liveKey.id]?.message}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div style={{ filter: data.isLiveEnabled ? 'none' : 'blur(4px)' }}>
                <div className="key-row">
                  <label className="key-label">Public Key</label>
                  <div className="key-input-group">
                    <div className="key-value" style={{ color: 'var(--text-med)' }}>pk_live_••••••••••••••••••••••••••••••••••••••••</div>
                  </div>
                </div>
                <div className="key-row">
                  <label className="key-label">Secret Key</label>
                  <div className="key-input-group">
                    <div className="key-value" style={{ color: 'var(--text-med)' }}>sk_live_••••••••••••••••••••••••••••••••••••••••</div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </>
      )}
    </div>
  );
}
