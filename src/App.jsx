import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import EmailVerify from './components/EmailVerify';
import Dashboard from './components/Dashboard';

export default function App() {
  const [page, setPage] = useState('login');
  const [session, setSession] = useState({ token: null, ambassador: null });
  const [regDetails, setRegDetails] = useState(null);

  // Charger la session stockée au démarrage
  useEffect(() => {
    const token = localStorage.getItem('ambassador_token');
    const ambassadorData = localStorage.getItem('ambassador_data');

    if (token && ambassadorData) {
      setSession({
        token,
        ambassador: JSON.parse(ambassadorData),
      });
      setPage('dashboard');
    }
  }, []);

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('ambassador_token');
    localStorage.removeItem('ambassador_data');
    setSession({ token: null, ambassador: null });
    setPage('login');
  };

  // Rendu conditionnel des pages
  const renderPage = () => {
    switch (page) {
      case 'login':
        return (
          <div className="auth-container">
            <div className="landing-layout">
              <Login setPage={setPage} setSession={setSession} />
              <AffiliateInfoCard />
            </div>
          </div>
        );
      case 'register':
        return (
          <div className="auth-container">
            <div className="landing-layout">
              <Register setPage={setPage} setRegDetails={setRegDetails} />
              <AffiliateInfoCard />
            </div>
          </div>
        );
      case 'verify_email':
        return <EmailVerify setPage={setPage} regDetails={regDetails} setSession={setSession} />;
      case 'dashboard':
        return <Dashboard session={session} handleLogout={handleLogout} />;
      default:
        return (
          <div className="auth-container">
            <div className="landing-layout">
              <Login setPage={setPage} setSession={setSession} />
              <AffiliateInfoCard />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-root">
      {renderPage()}
    </div>
  );
}

// Composant explicatif du Programme d'Affiliation (Conditions & Fonctionnement)
function AffiliateInfoCard() {
  return (
    <div className="info-card">
      <h3 className="info-title">Programme Ambassadeurs</h3>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>
        Rejoignez notre réseau de parrainage et gagnez des revenus en recommandant <strong style={{ color: 'var(--accent-primary)' }}>photonet.art</strong> à des commerçants, restaurateurs et créateurs de contenus.
      </p>

      <div className="info-section">
        <h4 className="info-section-title">Comment ça fonctionne ?</h4>
        <ul className="info-list">
          <li className="info-item">
            <strong>1. Obtenez votre lien</strong> : Récupérez votre lien de parrainage personnalisé depuis votre tableau de bord.
          </li>
          <li className="info-item">
            <strong>2. Partagez votre lien</strong> : Envoyez-le à vos contacts ou mettez-le dans votre statut. Dès qu'ils l'ouvrent, leur visite est immédiatement enregistrée et ils sont identifiés comme vos filleuls.
          </li>
          <li className="info-item">
            <strong>3. Inscription automatique</strong> : Qu'ils s'inscrivent sur la page web ou rejoignent directement le bot WhatsApp, ils sont automatiquement reliés à votre compte.
          </li>
          <li className="info-item">
            <strong>4. Gagnez 30% de commission</strong> : Vous touchez <strong>30% de commission cash</strong> sur chacun des <strong>3 premiers achats (recharges)</strong> de vos filleuls.
          </li>
        </ul>
      </div>

      <div className="info-section" style={{ marginBottom: 0 }}>
        <h4 className="info-section-title">Conditions du programme</h4>
        <ul className="info-list">
          <li className="info-item">
            <strong>Seuil de retrait minimum</strong> : Vous pouvez demander un retrait dès que votre solde atteint <strong>1 000 F CFA</strong>.
          </li>
          <li className="info-item">
            <strong>Méthodes de retrait supportées</strong> : Transfert direct sur votre compte Mobile Money (Wave, Orange Money, Moov Money, MTN).
          </li>
          <li className="info-item">
            <strong>Délais de versement</strong> : Les demandes sont traitées et payées sous 72h (3 jours ouvrés) via nos agrégateurs réglementés.
          </li>
        </ul>
      </div>

      <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', textAlign: 'center' }}>
        <a href="https://photonet.art/recharge" target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          🏷️ Voir nos tarifs et forfaits
        </a>
      </div>
    </div>
  );
}
