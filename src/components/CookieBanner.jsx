import React, { useState, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';

const CookieBanner = ({ isDark }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('dcompras_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('dcompras_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      maxWidth: '500px',
      margin: '0 auto',
      background: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <ShieldCheck size={24} color="#6366f1" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: isDark ? '#fff' : '#0f172a' }}>Tu Privacidad</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5 }}>
            Utilizamos almacenamiento local (LocalStorage) para mejorar tu experiencia, como guardar tus preferencias y recordarte. No usamos cookies de rastreo invasivas de terceros. Al continuar, aceptas nuestra política.
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
        <button 
          onClick={handleAccept}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
          }}>
          Entendido
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
