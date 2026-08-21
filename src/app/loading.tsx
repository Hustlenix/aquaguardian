export default function Loading() {
  return (
    <div className="aq-loader" role="status" aria-label="Loading AquaGuardian">
      <div className="aq-loader__signal" aria-hidden="true">
        <span className="aq-loader__ping aq-loader__ping--1" />
        <span className="aq-loader__ping aq-loader__ping--2" />
        <span className="aq-loader__ping aq-loader__ping--3" />
        <span className="aq-loader__ring" />
        <span className="aq-loader__sweep" />
        <span className="aq-loader__core">
          <svg viewBox="0 0 64 64" className="aq-loader__trident">
            <path d="M32 6 L27.6 40 L29.8 51.5 L32 54.4 L34.2 51.5 L36.4 40 Z" fill="url(#aqGold)" />
            <path d="M23.2 24.5 L26.4 42 L29.2 30.6 Z" fill="url(#aqGold)" opacity="0.7" />
            <path d="M40.8 24.5 L37.6 42 L34.8 30.6 Z" fill="url(#aqGold)" opacity="0.7" />
            <circle cx="32" cy="57" r="2.2" fill="url(#aqGold)" />
            <circle cx="32" cy="14" r="1.6" fill="#00E5FF" />
            <defs>
              <linearGradient id="aqGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E8C84A" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#B8962A" />
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
      <p className="aq-loader__title">AquaGuardian</p>
      <p className="aq-loader__subtitle">Establishing sonar link&hellip;</p>
      <style>{`
        .aq-loader {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          background: radial-gradient(circle at 50% 38%, #041525 0%, #010B13 55%, #000508 100%);
          color: #F8FAFC;
          overflow: hidden;
        }

        .aq-loader__signal {
          position: relative;
          width: 112px;
          height: 112px;
        }

        .aq-loader__ping {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          border: 1px solid rgba(0, 229, 255, 0.5);
          opacity: 0;
          animation: aqPing 2.8s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
        }
        .aq-loader__ping--2 { animation-delay: 0.93s; }
        .aq-loader__ping--3 { animation-delay: 1.86s; }

        @keyframes aqPing {
          0%   { transform: scale(0.32); opacity: 0.9; }
          70%  { opacity: 0.35; }
          100% { transform: scale(1.55); opacity: 0; }
        }

        .aq-loader__ring {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          border: 1px dashed rgba(0, 229, 255, 0.18);
          animation: aqSpin 14s linear infinite;
        }

        .aq-loader__sweep {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: conic-gradient(
            from 0deg,
            rgba(0, 229, 255, 0) 0deg,
            rgba(0, 229, 255, 0.55) 28deg,
            rgba(0, 229, 255, 0) 64deg
          );
          -webkit-mask: radial-gradient(circle, transparent 66%, black 69%, black 95%, transparent 98%);
          mask: radial-gradient(circle, transparent 66%, black 69%, black 95%, transparent 98%);
          animation: aqSpin 3.2s linear infinite;
        }

        @keyframes aqSpin {
          to { transform: rotate(360deg); }
        }

        .aq-loader__core {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 52px;
          height: 52px;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: radial-gradient(circle at 50% 35%, rgba(0, 229, 255, 0.14), rgba(1, 11, 19, 0) 70%);
          filter: drop-shadow(0 0 14px rgba(212, 175, 55, 0.35));
        }

        .aq-loader__trident {
          width: 44px;
          height: 44px;
          animation: aqBreathe 2.8s ease-in-out infinite;
        }

        @keyframes aqBreathe {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50%      { transform: scale(1.06); opacity: 1; }
        }

        .aq-loader__title {
          margin: 0;
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #D4AF37;
          text-shadow: 0 0 24px rgba(212, 175, 55, 0.45);
        }

        .aq-loader__subtitle {
          margin: 0;
          font-family: var(--font-numeric);
          font-size: 0.68rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(138, 154, 160, 0.85);
        }

        @media (prefers-reduced-motion: reduce) {
          .aq-loader__ping,
          .aq-loader__ring,
          .aq-loader__sweep,
          .aq-loader__trident {
            animation: none;
          }
          .aq-loader__ping { opacity: 0.35; }
        }
      `}</style>
    </div>
  )
}
