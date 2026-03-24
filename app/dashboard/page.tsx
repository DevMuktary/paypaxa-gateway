'use client';

export default function DashboardOverview() {
  
  // Clean Data Structure
  const metrics = [
    { label: 'Available Balance', value: '₦1,500,450.00', trend: '+12.5%', isUp: true },
    { label: 'Today\'s Revenue', value: '₦125,000.00', trend: '+4.2%', isUp: true },
    { label: 'Total Transactions', value: '8,432', trend: '+1.1%', isUp: true },
    { label: 'Pending Settlement', value: '₦45,000.00', trend: '-2.4%', isUp: false },
  ];

  // Slim Bar Chart Simulation Data
  const chartData = [
    { day: 'Mon', amount: '40%' },
    { day: 'Tue', amount: '70%' },
    { day: 'Wed', amount: '45%' },
    { day: 'Thu', amount: '90%' },
    { day: 'Fri', amount: '65%' },
    { day: 'Sat', amount: '100%' },
    { day: 'Sun', amount: '30%' },
  ];

  const transactions = [
    { id: 'TRX-1f1917d753...', email: 'finance@daarulhikmah.edu', customer: 'DAARUL HIKMAH intl school', amount: '₦3,000.00', status: 'Success', date: 'Mar 16, 12:41 PM' },
    { id: 'TRX-a7e98bf4cb...', email: 'abdussamad.s@gmail.com', customer: 'Abdussamad salaudeen', amount: '₦2,000.00', status: 'Success', date: 'Mar 5, 12:47 PM' },
    { id: 'TRX-16629e3027...', email: 'abdussamad.s@gmail.com', customer: 'Abdussamad salaudeen', amount: '₦2,000.00', status: 'Failed', date: 'Feb 28, 10:41 AM' },
    { id: 'TRX-ff6ea15e13...', email: 'musa.ibrahim@yahoo.com', customer: 'Musa Ibrahim', amount: '₦15,500.00', status: 'Pending', date: 'Feb 17, 3:35 PM' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .page-wrapper { padding: 32px; max-width: 1200px; margin: 0 auto; }
        
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
        .page-title { font-size: 24px; font-weight: 700; margin: 0 0 4px 0; color: var(--text-primary); letter-spacing: -0.5px; }
        .page-subtitle { color: var(--text-secondary); font-size: 14px; margin: 0; }
        
        .action-btn { background-color: var(--accent-blue); color: #FFFFFF; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: 0.2s; box-shadow: var(--shadow-sm); }
        .action-btn:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: var(--shadow-md); }

        /* Sleek Metric Cards */
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .stat-card { background-color: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; box-shadow: var(--shadow-sm); transition: 0.2s; }
        .stat-card:hover { border-color: var(--text-muted); }
        .stat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .stat-label { font-size: 13px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-value { font-size: 28px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.5px; }
        .trend-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; padding: 4px 8px; border-radius: 999px; }
        .trend-up { background-color: rgba(16, 185, 129, 0.1); color: #10B981; }
        .trend-down { background-color: rgba(244, 63, 94, 0.1); color: #F43F5E; }

        /* Unified Performance Section */
        .performance-panel { background-color: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; margin-bottom: 32px; box-shadow: var(--shadow-sm); }
        .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .panel-title { font-size: 16px; font-weight: 600; margin: 0; }
        
        .time-filters { display: flex; background: var(--bg-body); padding: 4px; border-radius: 8px; border: 1px solid var(--border-color); }
        .time-btn { background: transparent; border: none; color: var(--text-secondary); padding: 6px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: 0.2s; }
        .time-btn.active { background-color: var(--bg-surface); color: var(--text-primary); box-shadow: var(--shadow-sm); }

        /* Ultra-Clean Bar Chart */
        .chart-wrapper { height: 220px; display: flex; align-items: flex-end; gap: 40px; padding-top: 20px; border-bottom: 1px solid var(--border-color); position: relative; }
        .chart-grid-line { position: absolute; left: 0; right: 0; border-top: 1px dashed var(--border-color); z-index: 1; }
        .chart-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; position: relative; z-index: 2; }
        .chart-bar { width: 32px; background-color: var(--accent-blue); border-radius: 4px 4px 0 0; transition: height 1s ease; opacity: 0.85; }
        .chart-bar:hover { opacity: 1; }
        .chart-label { margin-top: 12px; font-size: 12px; color: var(--text-secondary); font-weight: 500; }

        /* Enterprise Ledger Table */
        .table-container { background-color: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: var(--shadow-sm); overflow: hidden; }
        .table-header-row { padding: 20px 24px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
        
        .ledger-table { width: 100%; border-collapse: collapse; text-align: left; }
        .ledger-table th { padding: 16px 24px; font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--border-color); background-color: rgba(0,0,0,0.01); }
        .ledger-table td { padding: 16px 24px; border-bottom: 1px solid var(--border-color); font-size: 14px; }
        .ledger-table tr:last-child td { border-bottom: none; }
        .ledger-table tr:hover { background-color: var(--nav-hover); }
        
        .customer-cell { display: flex; flex-direction: column; gap: 4px; }
        .customer-name { font-weight: 600; color: var(--text-primary); }
        .customer-email { font-size: 13px; color: var(--text-secondary); }
        
        .amount-cell { font-weight: 600; font-family: monospace; font-size: 15px; }
        .ref-cell { font-family: monospace; color: var(--text-secondary); font-size: 13px; }
        
        .status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
        .status-pill::before { content: ''; width: 6px; height: 6px; border-radius: 50%; }
        .pill-success { background-color: rgba(16, 185, 129, 0.1); color: #10B981; }
        .pill-success::before { background-color: #10B981; }
        .pill-pending { background-color: rgba(245, 158, 11, 0.1); color: #F59E0B; }
        .pill-pending::before { background-color: #F59E0B; }
        .pill-failed { background-color: rgba(244, 63, 94, 0.1); color: #F43F5E; }
        .pill-failed::before { background-color: #F43F5E; }

        @media (max-width: 768px) {
          .page-wrapper { padding: 20px; }
          .chart-bar { width: 16px; }
          .chart-wrapper { gap: 10px; }
        }
      `}} />

      <div className="page-wrapper">
        
        <div className="page-header">
          <div>
            <h1 className="page-title">Overview</h1>
            <p className="page-subtitle">Your gateway performance at a glance.</p>
          </div>
          <button className="action-btn">+ New Payment Link</button>
        </div>

        <div className="metrics-grid">
          {metrics.map((metric, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-header">
                <span className="stat-label">{metric.label}</span>
                <span className={`trend-badge ${metric.isUp ? 'trend-up' : 'trend-down'}`}>
                  {metric.isUp ? '↑' : '↓'} {metric.trend}
                </span>
              </div>
              <div className="stat-value">{metric.value}</div>
            </div>
          ))}
        </div>

        <div className="performance-panel">
          <div className="panel-header">
            <h2 className="panel-title">Transaction Volume</h2>
            <div className="time-filters">
              <button className="time-btn">7D</button>
              <button className="time-btn active">30D</button>
              <button className="time-btn">3M</button>
              <button className="time-btn">1Y</button>
            </div>
          </div>
          
          <div className="chart-wrapper">
            <div className="chart-grid-line" style={{ bottom: '25%' }}></div>
            <div className="chart-grid-line" style={{ bottom: '50%' }}></div>
            <div className="chart-grid-line" style={{ bottom: '75%' }}></div>
            
            {chartData.map((data, idx) => (
              <div key={idx} className="chart-col">
                <div className="chart-bar" style={{ height: data.amount }}></div>
                <div className="chart-label">{data.day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="table-container">
          <div className="table-header-row">
            <h2 className="panel-title">Recent Transactions</h2>
            <button style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>View All →</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Reference</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="customer-cell">
                        <span className="customer-name">{txn.customer}</span>
                        <span className="customer-email">{txn.email}</span>
                      </div>
                    </td>
                    <td className="ref-cell">{txn.id}</td>
                    <td className="amount-cell">{txn.amount}</td>
                    <td>
                      <span className={`status-pill ${
                        txn.status === 'Success' ? 'pill-success' : 
                        txn.status === 'Pending' ? 'pill-pending' : 'pill-failed'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{txn.date}</td>
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
