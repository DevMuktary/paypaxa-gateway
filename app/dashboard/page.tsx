'use client';

import React, { useState, useEffect } from 'react';

export default function DashboardOverview() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/merchant/dashboard');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error("API returned an error.");
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchDashboardData();
  }, []);

  const handleCopy = (reference: string) => {
    navigator.clipboard.writeText(reference);
    setCopiedRef(reference);
    setTimeout(() => setCopiedRef(null), 2000); // Reset after 2 seconds
  };

  const CopyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
  );

  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  );

  return (
    <div className="content-pad">
      <style dangerouslySetInnerHTML={{__html: `
        .content-pad { padding: 40px; max-width: 1400px; margin: 0 auto; }
        
        .welcome-title { font-size: 28px; font-weight: 800; margin: 0 0 8px 0; color: var(--text-high); letter-spacing: -0.5px; }
        .welcome-title span { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .welcome-sub { color: var(--text-med); font-size: 15px; margin: 0 0 40px 0; }

        .grid-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-bottom: 40px; }
        
        .premium-card { background-color: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 20px; padding: 28px; position: relative; overflow: hidden; box-shadow: var(--shadow-soft); transition: transform 0.3s, box-shadow 0.3s; display: flex; flex-direction: column; gap: 16px; }
        .premium-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-modal); border-color: rgba(255,255,255,0.1); }
        
        .card-glow { position: absolute; top: 0; right: 0; width: 120px; height: 120px; border-radius: 50%; filter: blur(40px); opacity: 0.15; z-index: 0; }
        
        .card-icon-box { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; z-index: 1; position: relative; border: 1px solid rgba(255,255,255,0.1); }
        .card-label { font-size: 14px; font-weight: 600; color: var(--text-med); z-index: 1; position: relative; text-transform: uppercase; letter-spacing: 0.5px; }
        .card-value { font-size: 32px; font-weight: 800; color: var(--text-high); z-index: 1; position: relative; letter-spacing: -1px; }

        .chart-section { background-color: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 24px; padding: 32px; margin-bottom: 40px; box-shadow: var(--shadow-soft); }
        .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
        .chart-title { font-size: 18px; font-weight: 700; margin: 0; }
        
        .time-pills { display: flex; background: var(--bg-main); padding: 4px; border-radius: 10px; border: 1px solid var(--border-color); }
        .time-pill { background: transparent; border: none; color: var(--text-med); padding: 8px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .time-pill.active { background-color: var(--bg-panel); color: var(--text-high); box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid var(--border-color); }

        .stat-banner { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 40px; padding: 24px; background: rgba(59, 130, 246, 0.03); border-radius: 16px; border: 1px dashed var(--border-color); }
        .banner-item { text-align: center; }
        .banner-label { font-size: 13px; color: var(--text-med); font-weight: 600; margin-bottom: 8px; }
        .banner-value { font-size: 24px; font-weight: 800; color: var(--text-high); }

        .svg-chart-container { width: 100%; height: 260px; position: relative; }
        .svg-chart { width: 100%; height: 100%; overflow: visible; }
        .chart-grid { stroke: var(--border-color); stroke-dasharray: 4 4; stroke-width: 1; }
        .chart-line { fill: none; stroke: var(--brand-primary); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; filter: drop-shadow(0 4px 6px rgba(59,130,246,0.3)); }
        
        .ledger-panel { background-color: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 24px; overflow: hidden; box-shadow: var(--shadow-soft); }
        .ledger-header { padding: 24px 32px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
        
        .clean-table { width: 100%; border-collapse: collapse; text-align: left; }
        .clean-table th { padding: 16px 32px; font-size: 12px; font-weight: 600; color: var(--text-low); text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid var(--border-color); background: rgba(0,0,0,0.02); white-space: nowrap; }
        .clean-table td { padding: 20px 32px; font-size: 14px; color: var(--text-high); border-bottom: 1px solid var(--border-color); }
        .clean-table tr:hover td { background-color: var(--nav-hover); }
        .clean-table tr:last-child td { border-bottom: none; }
        
        /* Ensuring reference cells don't truncate on desktop, but allow horizontal scroll on mobile */
        .ref-cell { display: flex; align-items: center; gap: 8px; color: var(--text-med); font-family: monospace; font-size: 13px; white-space: nowrap; }
        
        .status-badge { display: inline-flex; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; background-color: rgba(16, 185, 129, 0.1); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.2); }
        .pill-pending { background-color: rgba(245, 158, 11, 0.1); color: #F59E0B; border-color: rgba(245, 158, 11, 0.2); }
        .pill-failed { background-color: rgba(244, 63, 94, 0.1); color: #F43F5E; border-color: rgba(244, 63, 94, 0.2); }

        /* SKELETON ANIMATIONS */
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .skeleton { 
          background: linear-gradient(90deg, var(--border-color) 25%, var(--bg-main) 50%, var(--border-color) 75%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
          border-radius: 8px;
        }
        .sk-title { width: 300px; height: 32px; margin-bottom: 12px; }
        .sk-sub { width: 400px; height: 16px; margin-bottom: 40px; }
        .sk-card-icon { width: 44px; height: 44px; border-radius: 12px; }
        .sk-card-label { width: 120px; height: 14px; margin-top: 16px; }
        .sk-card-val { width: 180px; height: 32px; margin-top: 12px; }
        .sk-chart { width: 100%; height: 260px; border-radius: 16px; }

        @media (max-width: 768px) {
          .content-pad { padding: 16px; }
          .stat-banner { grid-template-columns: 1fr; gap: 16px; }
          .welcome-title { font-size: 24px; }
        }
      `}} />

      {isLoading ? (
        /* --- SKELETON LOADING STATE --- */
        <div>
          <div className="skeleton sk-title"></div>
          <div className="skeleton sk-sub"></div>
          
          <div className="grid-metrics">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="premium-card">
                <div className="skeleton sk-card-icon"></div>
                <div className="skeleton sk-card-label"></div>
                <div className="skeleton sk-card-val"></div>
              </div>
            ))}
          </div>

          <div className="chart-section">
            <div className="skeleton sk-chart"></div>
          </div>
        </div>
      ) : !data ? (
        /* --- EMPTY / NO DATA STATE --- */
        <div style={{ textAlign: 'center', padding: '100px 20px', backgroundColor: 'var(--bg-panel)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ color: 'var(--text-high)', marginBottom: '8px' }}>No Data Found</h2>
          <p style={{ color: 'var(--text-med)' }}>Connect your database to start tracking your revenue.</p>
        </div>
      ) : (
        /* --- REAL DATA STATE --- */
        <>
          <h1 className="welcome-title"><span>Welcome Back,</span> {data.merchantName}! 🚀</h1>
          <p className="welcome-sub">Here is a clear overview of your business infrastructure today.</p>

          <div className="grid-metrics">
            {data.metrics.map((metric: any, i: number) => (
              <div key={i} className="premium-card">
                <div className="card-glow" style={{ backgroundColor: metric.iconColor }}></div>
                <div className="card-icon-box" style={{ backgroundColor: metric.iconColor + '20', color: metric.iconColor }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
                </div>
                <div>
                  <div className="card-label">{metric.label}</div>
                  <div className="card-value">{metric.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="chart-section">
            <div className="chart-header">
              <h2 className="chart-title">Revenue Analytics</h2>
              <div className="time-pills">
                <button className="time-pill active">Last 7 Days</button>
              </div>
            </div>

            <div className="stat-banner">
              <div className="banner-item">
                <div className="banner-label">Total Revenue</div>
                <div className="banner-value" style={{ color: 'var(--brand-primary)' }}>{data.totalRevenue}</div>
              </div>
              <div className="banner-item">
                <div className="banner-label">Total Transactions</div>
                <div className="banner-value" style={{ color: 'var(--text-high)' }}>{data.totalTransactionsCount}</div>
              </div>
              <div className="banner-item">
                <div className="banner-label">Pending Settlement</div>
                <div className="banner-value" style={{ color: '#F59E0B' }}>₦0.00</div>
              </div>
            </div>

            <div className="svg-chart-container">
              <svg className="svg-chart" viewBox="0 0 1000 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                
                <line x1="0" y1="50" x2="1000" y2="50" className="chart-grid" />
                <line x1="0" y1="100" x2="1000" y2="100" className="chart-grid" />
                <line x1="0" y1="150" x2="1000" y2="150" className="chart-grid" />
                <line x1="0" y1="200" x2="1000" y2="200" className="chart-grid" />

                <path d="M0,200 L0,150 C 150,150 250,50 400,80 C 550,110 650,20 800,60 C 900,90 950,140 1000,120 L1000,200 Z" fill="url(#areaGradient)" />
                <path d="M0,150 C 150,150 250,50 400,80 C 550,110 650,20 800,60 C 900,90 950,140 1000,120" className="chart-line" />
                
                <text x="0" y="230" fill="var(--text-med)" fontSize="13" fontWeight="500">Mon</text>
                <text x="166" y="230" fill="var(--text-med)" fontSize="13" fontWeight="500">Tue</text>
                <text x="333" y="230" fill="var(--text-med)" fontSize="13" fontWeight="500">Wed</text>
                <text x="500" y="230" fill="var(--text-med)" fontSize="13" fontWeight="500">Thu</text>
                <text x="666" y="230" fill="var(--text-med)" fontSize="13" fontWeight="500">Fri</text>
                <text x="833" y="230" fill="var(--text-med)" fontSize="13" fontWeight="500">Sat</text>
                <text x="980" y="230" fill="var(--text-med)" fontSize="13" fontWeight="500">Sun</text>
              </svg>
            </div>
          </div>

          <div className="ledger-panel">
            <div className="ledger-header">
              <h2 className="chart-title">Recent Transactions</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Amount</th>
                    <th>Reference</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions && data.transactions.length > 0 ? (
                    data.transactions.map((txn: any, idx: number) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: '600' }}>{txn.customerName}</td>
                        <td style={{ fontWeight: '700', fontFamily: 'monospace', fontSize: '15px' }}>
                          ₦{txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td>
                          <div className="ref-cell">
                            {txn.reference}
                            <button 
                              style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', padding: 0 }} 
                              onClick={() => handleCopy(txn.reference)}
                              title="Copy Reference"
                            >
                              {copiedRef === txn.reference ? <CheckIcon /> : <CopyIcon />}
                            </button>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge ${
                            txn.status === 'PENDING' ? 'pill-pending' : 
                            txn.status === 'FAILED' ? 'pill-failed' : ''
                          }`}>
                            {txn.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-med)', fontSize: '13px', whiteSpace: 'nowrap' }}>
                          {new Date(txn.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-med)' }}>
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
