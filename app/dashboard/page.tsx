'use client';

export default function DashboardOverview() {
  
  // Mock Data for the Chart Simulation
  const chartData = [
    { day: 'Mon', rev: '10%', txn: '5%' },
    { day: 'Tue', rev: '30%', txn: '20%' },
    { day: 'Wed', rev: '20%', txn: '15%' },
    { day: 'Thu', rev: '60%', txn: '45%' },
    { day: 'Fri', rev: '40%', txn: '30%' },
    { day: 'Sat', rev: '80%', txn: '65%' },
    { day: 'Sun', rev: '50%', txn: '35%' },
  ];

  // Mock Data for Transactions (Matching Reference)
  const transactions = [
    { id: '1f1917d7530b375c...', customer: 'DAARUL HIKMAH intl school', amount: '₦3,000.00', status: 'Paid', date: '16th of March, 2026 12:41:53PM' },
    { id: 'a7e98bf4cbe2b60f...', customer: 'Abdussamad salaudeen', amount: '₦2,000.00', status: 'Paid', date: '5th of March, 2026 12:47:55PM' },
    { id: '16629e302742ec97...', customer: 'Abdussamad salaudeen', amount: '₦2,000.00', status: 'Paid', date: '28th of February, 2026 10:41:39PM' },
    { id: 'cccf5e47bd139929...', customer: 'Abdussamad salaudeen', amount: '₦1,000.00', status: 'Paid', date: '25th of February, 2026 12:01:10PM' },
    { id: 'ff6ea15e13030bae...', customer: 'Abdussamad salaudeen', amount: '₦2,000.00', status: 'Paid', date: '17th of February, 2026 3:35:03PM' },
  ];

  const CopyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .page-padding { padding: 32px; max-width: 1400px; margin: 0 auto; }
        
        .welcome-text { font-size: 24px; font-weight: 700; margin: 0 0 8px 0; color: var(--text-primary); }
        .welcome-text span { color: var(--primary-brand); }
        .subtitle { color: var(--text-secondary); font-size: 15px; margin: 0 0 32px 0; }

        /* The 4 Main Metric Cards (Matching Screenshot Colors) */
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 40px; }
        .stat-card { padding: 32px 24px; border-radius: 16px; color: white; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; overflow: hidden; box-shadow: var(--shadow-md); transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-4px); }
        .card-1 { background: linear-gradient(135deg, #D91361 0%, #A80D47 100%); } /* PAYPAXA Magenta */
        .card-2 { background: linear-gradient(135deg, #F8A5C2 0%, #F188AD 100%); color: #6A1039; } /* Light Pink */
        .card-3 { background: linear-gradient(135deg, #12B8A6 0%, #0D9488 100%); } /* Teal */
        .card-4 { background: linear-gradient(135deg, #F9825F 0%, #E25C38 100%); } /* Orange */
        
        .card-icon { width: 32px; height: 32px; margin-bottom: 16px; opacity: 0.9; }
        .card-label { font-size: 14px; font-weight: 600; margin-bottom: 8px; }
        .card-value { font-size: 28px; font-weight: 800; }

        /* Overview & Graph Section */
        .overview-panel { background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; padding: 32px; margin-bottom: 40px; }
        .overview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
        .overview-title { font-size: 18px; font-weight: 700; margin: 0; color: var(--text-primary); }
        
        .time-filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .time-btn { background-color: transparent; border: 1px solid var(--border-color); color: var(--text-secondary); padding: 6px 16px; border-radius: 999px; font-size: 13px; font-weight: 500; cursor: pointer; transition: 0.2s; }
        .time-btn.active { background-color: var(--primary-brand); color: white; border-color: var(--primary-brand); }
        .time-btn:hover:not(.active) { border-color: var(--text-secondary); }

        .sub-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 40px; }
        .sub-stat-box { background-color: rgba(217, 19, 97, 0.04); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid var(--border-color); }
        .sub-stat-label { font-size: 13px; color: var(--text-secondary); font-weight: 600; margin-bottom: 8px; }
        .sub-stat-value { font-size: 22px; font-weight: 800; }

        /* Line Graph Simulation */
        .graph-area { height: 240px; border-bottom: 1px dashed var(--border-color); border-left: 1px dashed var(--border-color); display: flex; align-items: flex-end; padding-left: 10px; position: relative; margin-top: 20px; }
        .graph-col { flex: 1; display: flex; justify-content: center; position: relative; height: 100%; }
        .graph-line-rev { position: absolute; bottom: 0; width: 8px; background-color: #D91361; border-radius: 4px 4px 0 0; }
        .graph-line-txn { position: absolute; bottom: 0; width: 8px; background-color: #12B8A6; border-radius: 4px 4px 0 0; margin-left: 14px; }
        .graph-day { position: absolute; bottom: -25px; font-size: 12px; color: var(--text-secondary); font-weight: 500; }

        .graph-legend { display: flex; justify-content: center; gap: 24px; margin-top: 40px; }
        .legend-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary); font-weight: 500; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }

        /* Table Section */
        .table-section { background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; overflow: hidden; }
        .table-header { padding: 24px 32px; border-bottom: 1px solid var(--border-color); }
        .table-title { font-size: 18px; font-weight: 700; margin: 0; color: var(--text-primary); }
        
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { padding: 16px 32px; color: var(--text-secondary); font-size: 13px; font-weight: 600; border-bottom: 1px solid var(--border-color); }
        .data-table td { padding: 20px 32px; font-size: 14px; color: var(--text-primary); border-bottom: 1px solid var(--border-color); }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover { background-color: var(--nav-hover); }

        .status-pill { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; background-color: rgba(18, 184, 166, 0.1); color: #0D9488; }
        .ref-cell { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); font-family: monospace; font-size: 13px; }
        .copy-btn { background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 0; display: flex; align-items: center; transition: 0.2s; }
        .copy-btn:hover { color: var(--primary-brand); }

        @media (max-width: 768px) {
          .page-padding { padding: 20px; }
          .sub-stats-grid { grid-template-columns: 1fr; gap: 16px; }
        }
      `}} />

      <div className="page-padding">
        <h1 className="welcome-text"><span>Welcome Back,</span> Mukhtar! 😎</h1>
        <p className="subtitle">Here's a Quick Overview of Your Account:</p>

        <div className="cards-grid">
          <div className="stat-card card-1">
            <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
            <div className="card-label">Account Balance</div>
            <div className="card-value">₦1.50</div>
          </div>
          <div className="stat-card card-2">
            <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
            <div className="card-label">Total Customers</div>
            <div className="card-value">0</div>
          </div>
          <div className="stat-card card-3">
            <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            <div className="card-label">Total Transactions</div>
            <div className="card-value">0</div>
          </div>
          <div className="stat-card card-4">
            <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <div className="card-label">Total Withdrawals</div>
            <div className="card-value">₦0.00</div>
          </div>
        </div>

        <div className="overview-panel">
          <div className="overview-header">
            <h2 className="overview-title">Overview</h2>
            <div className="time-filters">
              <button className="time-btn active">Today</button>
              <button className="time-btn">Yesterday</button>
              <button className="time-btn">Last 7 days</button>
              <button className="time-btn">Last 30 days</button>
              <button className="time-btn">All Time</button>
              <button className="time-btn">Custom Date</button>
            </div>
          </div>

          <div className="sub-stats-grid">
            <div className="sub-stat-box">
              <div className="sub-stat-label">Total Revenue</div>
              <div className="sub-stat-value" style={{ color: '#D91361' }}>₦0.00</div>
            </div>
            <div className="sub-stat-box">
              <div className="sub-stat-label">Total Transactions</div>
              <div className="sub-stat-value" style={{ color: 'var(--text-primary)' }}>0</div>
            </div>
            <div className="sub-stat-box">
              <div className="sub-stat-label">Pending Settlement</div>
              <div className="sub-stat-value" style={{ color: '#F9825F' }}>₦0.00</div>
            </div>
          </div>

          <div className="graph-area">
            {chartData.map((data, i) => (
              <div key={i} className="graph-col">
                <div className="graph-line-rev" style={{ height: data.rev }}></div>
                <div className="graph-line-txn" style={{ height: data.txn }}></div>
                <div className="graph-day">{data.day}</div>
              </div>
            ))}
          </div>
          
          <div className="graph-legend">
            <div className="legend-item"><div className="dot" style={{ backgroundColor: '#D91361' }}></div> revenue</div>
            <div className="legend-item"><div className="dot" style={{ backgroundColor: '#12B8A6' }}></div> transactions</div>
            <div className="legend-item"><div className="dot" style={{ backgroundColor: '#F9825F' }}></div> pending</div>
          </div>
        </div>

        <div className="table-section">
          <div className="table-header">
            <h2 className="table-title">Recent Transactions</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
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
                {transactions.map((txn, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '500' }}>{txn.customer}</td>
                    <td style={{ fontWeight: '600' }}>{txn.amount}</td>
                    <td>
                      <div className="ref-cell">
                        {txn.id}
                        <button className="copy-btn" title="Copy Reference"><CopyIcon /></button>
                      </div>
                    </td>
                    <td><span className="status-pill">{txn.status}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{txn.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}
