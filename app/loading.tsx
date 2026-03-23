export default function Loading() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtle-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.98); }
        }
      `}} />
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
        backgroundColor: '#060B19', display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 9999
      }}>
        <div style={{ animation: 'subtle-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
          <img src="/logo.png" alt="PAYPAXA Loading" style={{ height: '56px', width: 'auto' }} 
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
              (e.target as HTMLElement).nextElementSibling!.classList.remove('hidden');
            }} 
          />
          {/* Fallback SVG if logo.png is missing */}
          <svg className="hidden" width="56" height="56" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
            <rect width="32" height="32" rx="8" fill="#2563EB"/>
            <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </>
  )
}
