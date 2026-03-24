'use client';

import React, { useState, useEffect } from 'react';

export default function DashboardOverview() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We will build this exact API route in the next step!
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/merchant/dashboard');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          // If the API doesn't exist yet, we will fail silently and leave it loading 
          // so you can see the beautiful skeleton state while we build it.
          console.log("API not ready yet. Showing loading skeleton.");
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const CopyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
  );

  return (
    <div className="content-pad">
      <style dangerouslySetInnerHTML={{__html: `
        .content-pad { padding: 40px; max-width: 1400px; margin: 0 auto; }
        
        .welcome-title { font-size: 28px; font-weight: 800; margin: 0 0 8px 0; color: var(--text-high); letter-spacing: -0.5px; }
        .welcome-title span { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .welcome-sub { color: var(--text-med); font-size: 15px; margin: 0 0 40px 0; }

        .grid-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-bottom: 40px; }
        
        .premium-card { background-color: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 20px; padding: 28px; position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 16px; }
        
        .card-glow { position: absolute; top: 0; right: 0; width: 120px; height: 120px; border-radius: 50%; filter: blur(40px); opacity: 0.15; z-index: 0; }
        
        .card-icon-box { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; z-index: 1; position: relative; border: 1px solid rgba(255,255,255,0.1); }
        .card-label { font-size: 14px; font-weight: 600; color: var(--text-med); z-index: 1; position: relative; text-transform: uppercase; letter-spacing: 0.5px; }
        .card-value { font-size: 32px; font-weight: 800; color: var(--text-high); z-index: 1; position: relative; letter-spacing: -1px; }

        .chart-section { background-color: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 24px; padding: 32px; margin-bottom: 40px; }
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
        
        .ledger-panel { background-color: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 24px; overflow: hidden; }
        .ledger-header { padding: 24px 32px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
        
        .clean-table { width: 100%; border-collapse: collapse; text-align: left; }
        .clean-table th { padding: 16px 32px; font-size: 12px; font-weight: 600; color: var(--text-low); text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid var(--border-color); background: rgba(0,0,0,0.02); }
        .clean-table td { padding: 20px 32px; font-size: 14px; color: var(--text-high); border-bottom: 1px solid var(--border-color); }
        .clean-table tr:hover td { background-color: var(--nav-hover); }
        .clean-table tr:last-child td { border-bottom: none; }
        
        .status-badge { display: inline-flex; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; background-color: rgba(16, 185, 129, 0.1); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.2); }
        
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
      `}} />

      {isLoading || !data ? (
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
      ) : (
        /* --- REAL DATA STATE (Will render when API is built) --- */
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
            </div>

            <div className="svg-chart-container">
              {/* Insert actual mapped SVG points here based on data later */}
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-med)' }}>
                Live chart data will populate here.
              </div>
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
                  {data.transactions.map((txn: any, idx: number) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: '600' }}>{txn.customer}</td>
                      <td style={{ fontWeight: '700', fontFamily: 'monospace', fontSize: '15px' }}>{txn.amount}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-med)', fontFamily: 'monospace' }}>
                          {txn.id}
                          <button style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', padding: 0 }}><CopyIcon /></button>
                        </div>
                      </td>
                      <td>
                        <span className="status-badge">{txn.status}</span>
                      </td>
                      <td style={{ color: 'var(--text-med)', fontSize: '13px' }}>{txn.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
