

interface BossIntroProps {
  show: boolean;
  onComplete: () => void;
}

export function BossIntro({ show, onComplete }: BossIntroProps) {
  if (!show) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background:
          'radial-gradient(circle, rgba(100,0,0,0.85), rgba(0,0,0,0.97))',
        color: '#ffffff',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        animation: 'bossFadeIn 0.8s ease-out',
      }}
    >
      <style>
        {`
          @keyframes bossFadeIn {
            from { opacity: 0; transform: scale(1.15); }
            to { opacity: 1; transform: scale(1); }
          }

          @keyframes bossPulse {
            0%, 100% { text-shadow: 0 0 15px #ff0000; }
            50% { text-shadow: 0 0 35px #ff4400, 0 0 60px #ff0000; }
          }
        `}
      </style>

      <div
        style={{
          fontSize: 'clamp(28px, 8vw, 52px)',
          fontWeight: 900,
          color: '#ff3333',
          animation: 'bossPulse 1.5s infinite',
          letterSpacing: '3px',
        }}
      >
        ⚠ BOSS APPROACHING ⚠
      </div>

      <div
        style={{
          fontSize: 'clamp(20px, 5vw, 32px)',
          fontWeight: 800,
          marginTop: '25px',
          color: '#d4b483',
          letterSpacing: '4px',
        }}
      >
        FOREST GUARDIAN
      </div>

      <div
        style={{
          fontSize: '16px',
          color: '#cccccc',
          marginTop: '12px',
        }}
      >
        The ancient guardian awakens...
      </div>

      <button
        onClick={onComplete}
        style={{
          marginTop: '45px',
          padding: '15px 40px',
          borderRadius: '10px',
          border: '2px solid #ff3333',
          background: '#7f1111',
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        FIGHT!
      </button>
    </div>
  );
}

export default BossIntro;
