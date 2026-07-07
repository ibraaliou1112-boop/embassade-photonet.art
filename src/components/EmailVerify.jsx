import React, { useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function EmailVerify({ setPage, regDetails, setSession }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/ambassador/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...regDetails,
          code: code.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Code de vérification incorrect ou expiré.');
      }

      // Enregistrer la session
      localStorage.setItem('ambassador_token', data.token);
      localStorage.setItem('ambassador_data', JSON.stringify(data.ambassador));

      setSession({
        token: data.token,
        ambassador: data.ambassador
      });

      setPage('dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResendMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/ambassador/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(regDetails),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors du renvoi du code.");
      }

      setResendMessage('Un nouveau code de vérification a été envoyé à votre adresse e-mail.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <div className="auth-header">
          <div className="auth-logo" style={{ fontWeight: 800 }}>
            photonet<span style={{ color: 'var(--accent-primary)' }}>.art</span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Affiliés</span>
          </div>
          <p className="auth-subtitle">
            Un code OTP a été envoyé à <strong style={{ color: 'var(--text-primary)' }}>{regDetails?.email}</strong>.
          </p>
        </div>

        {error && (
          <div className="notification notification-error">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {resendMessage && (
          <div className="notification notification-success">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{resendMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="code">Code de vérification (OTP)</label>
            <input
              type="text"
              id="code"
              className="form-input"
              style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '20px', fontWeight: 'bold' }}
              placeholder="123456"
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Validation en cours...' : 'Vérifier & Finaliser'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Vous n'avez pas reçu le code ?{' '}
          <a href="#resend" onClick={(e) => { e.preventDefault(); handleResend(); }} style={{ fontWeight: '500' }}>
            Renvoyer le code
          </a>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
          <a href="#back" onClick={(e) => { e.preventDefault(); setPage('register'); }} style={{ color: 'var(--text-secondary)' }}>
            Retour à l'inscription
          </a>
        </div>
      </div>
    </div>
  );
}
