export default function Loading() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at top, #041525 0%, #010B13 55%, #000508 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#F9FAFB',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '999px',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderTopColor: '#D4AF37',
            borderRightColor: '#E8C84A',
            animation: 'spin 0.9s linear infinite',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.18)',
          }}
        />
        <p
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '1.1rem',
            letterSpacing: '0.26em',
            color: '#D4AF37',
            textTransform: 'uppercase',
            opacity: 0.95,
          }}
        >
          Submerging into AquaGuardian
        </p>
      </div>
    </div>
  )
}
