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
        <div style={{ animation: 'subtle-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* We use a simple img tag without inline JS. Make sure logo.png exists in your public folder! */}
          <img src="/logo.png" alt="PAYPAXA Loading" style={{ height: '56px', width: 'auto' }} />
        </div>
      </div>
    </>
  )
}
