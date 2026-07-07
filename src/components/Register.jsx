import React, { useState } from 'react';
import { BACKEND_URL } from '../config';

export default function Register({ setPage, setRegDetails }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/ambassador/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, whatsapp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription.");
      }

      // Enregistrer les détails temporairement pour la phase de vérification
      setRegDetails({ name, email, password, whatsapp });
      
      // Rediriger vers l'écran de vérification OTP
      setPage('verify_email');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-logo" style={{ fontWeight: 800 }}>
          photonet<span style={{ color: 'var(--accent-primary)' }}>.art</span>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Affiliés</span>
        </div>
        <p className="auth-subtitle">Gagnez 30% de commission sur chaque achat</p>
      </div>

      {error && (
        <div className="notification notification-error">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Nom Complet</label>
          <input
            type="text"
            id="name"
            className="form-input"
            placeholder="Aliou Ibra"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Adresse E-mail</label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="whatsapp">Numéro WhatsApp (avec indicatif)</label>
          <input
            type="tel"
            id="whatsapp"
            className="form-input"
            placeholder="221783030303"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Min. 8 caractères"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Envoi du code de vérification..." : 'Devenir Ambassadeur'}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
        Déjà un compte ?{' '}
        <a href="#login" onClick={(e) => { e.preventDefault(); setPage('login'); }}>
          Se connecter
        </a>
      </div>
    </div>
  );
}
