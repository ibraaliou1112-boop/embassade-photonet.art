import React, { useState, useEffect } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const BOT_PHONE = '22990129647182'; // Numéro WhatsApp de Photonet

export default function Dashboard({ session, handleLogout }) {
  const [stats, setStats] = useState({
    clicks_count: 0,
    referrals_count: 0,
    balance_xof: 0,
    total_earnings_xof: 0,
  });
  const [referrals, setReferrals] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  
  const [activeTab, setActiveTab] = useState('referrals'); // 'referrals', 'commissions', 'withdrawals'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Formulaire de retrait
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wave');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState('');

  const [copied, setCopied] = useState(false);

  // Charger les stats et données
  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/ambassador/stats`, {
        headers: {
          'Authorization': `Bearer ${session.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Impossible de récupérer les données du tableau de bord.');
      
      setStats(data.stats);
      setReferrals(data.referrals);
      setCommissions(data.commissions);
      setWithdrawals(data.withdrawals);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session.token) {
      fetchDashboardData();
    }
  }, [session]);

  // Générer le lien de parrainage (avec suivi des clics par redirection)
  const referralCode = session.ambassador?.referral_code || 'CODE';
  const whatsappLink = `${BACKEND_URL}/ref/${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(whatsappLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Soumettre une demande de retrait
  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccess('');
    setWithdrawLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/ambassador/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          amount: withdrawAmount,
          payment_method: paymentMethod,
          payment_number: paymentNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la demande de retrait.');
      }

      setWithdrawSuccess(data.message);
      setWithdrawAmount('');
      setPaymentNumber('');
      
      // Recharger les données du dashboard
      fetchDashboardData();
    } catch (err) {
      setWithdrawError(err.message);
    } finally {
      setWithdrawLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-secondary)' }}>
        Chargement de votre espace ambassadeur...
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Barre de navigation */}
      <nav className="dashboard-nav glass-panel" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
        <div className="nav-brand" style={{ fontWeight: 800 }}>
          photonet<span style={{ color: 'var(--accent-primary)' }}>.art</span>
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Affiliés</span>
        </div>
        <div className="nav-user">
          <div className="nav-user-info">
            <div className="nav-user-name">{session.ambassador?.name}</div>
            <div className="nav-user-role">Code: {session.ambassador?.referral_code}</div>
          </div>
          <button className="nav-logout" onClick={handleLogout}>Déconnexion</button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="dashboard-content">
        {error && (
          <div className="notification notification-error" style={{ marginBottom: '32px' }}>
            <span>{error}</span>
          </div>
        )}

        {/* Grille de statistiques */}
        <div className="stats-grid">
          <div className="stat-card blue-card">
            <div className="stat-label">Clics sur lien</div>
            <div className="stat-value">{stats.clicks_count}</div>
          </div>
          <div className="stat-card amber-card">
            <div className="stat-label">Inscriptions parrainées</div>
            <div className="stat-value">{stats.referrals_count}</div>
          </div>
          <div className="stat-card green-card">
            <div className="stat-label">Gains Totaux</div>
            <div className="stat-value">{stats.total_earnings_xof.toLocaleString()} F CFA</div>
          </div>
          <div className="stat-card orange-card">
            <div className="stat-label">Solde Retirable</div>
            <div className="stat-value">{stats.balance_xof.toLocaleString()} F CFA</div>
          </div>
        </div>

        {/* Section Partage de lien */}
        <div className="glass-panel share-card">
          <h3 className="share-title">Votre Lien de Parrainage WhatsApp</h3>
          <p className="share-desc">
            Partagez ce lien avec vos contacts. Lorsqu'ils cliqueront sur le lien, WhatsApp s'ouvrira avec votre code de parrainage pré-rempli. Dès qu'ils s'inscriront sur le bot et achèteront des générations, vous toucherez <strong>30% de commission</strong> sur tous leurs achats !
          </p>
          <div className="share-input-group">
            <div className="share-link">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" width="18" height="18" style={{ color: '#25D366' }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {whatsappLink}
            </div>
            <div className="share-actions">
              <button className="btn btn-primary btn-copy" onClick={handleCopyLink}>
                {copied ? 'Copié !' : 'Copier le lien'}
              </button>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-visit" title="Tester le lien de parrainage">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Section Détails (Tableaux + Formulaire) */}
        <div className="details-grid">
          {/* Tableau de bord */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div className="tabs">
              <button className={`tab-btn ${activeTab === 'referrals' ? 'active' : ''}`} onClick={() => setActiveTab('referrals')}>
                Parrainages ({referrals.length})
              </button>
              <button className={`tab-btn ${activeTab === 'commissions' ? 'active' : ''}`} onClick={() => setActiveTab('commissions')}>
                Commissions ({commissions.length})
              </button>
              <button className={`tab-btn ${activeTab === 'withdrawals' ? 'active' : ''}`} onClick={() => setActiveTab('withdrawals')}>
                Retraits ({withdrawals.length})
              </button>
            </div>

            {activeTab === 'referrals' && (
              <div className="table-container">
                {referrals.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Aucune inscription parrainée pour le moment.
                  </div>
                ) : (
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>WhatsApp</th>
                        <th>Forfait</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.map((ref) => (
                        <tr key={ref.id}>
                          <td>{new Date(ref.created_at).toLocaleDateString('fr-FR')}</td>
                          <td>+{ref.whatsapp}</td>
                          <td>
                            <span className={`badge ${ref.plan === 'free' ? 'badge-free' : 'badge-pro'}`}>
                              {ref.plan}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'commissions' && (
              <div className="table-container">
                {commissions.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Aucune commission enregistrée pour le moment.
                  </div>
                ) : (
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Utilisateur</th>
                        <th>Achat</th>
                        <th>Commission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissions.map((comm) => (
                        <tr key={comm.id}>
                          <td>{new Date(comm.created_at).toLocaleDateString('fr-FR')}</td>
                          <td>{comm.user ? comm.user.name : 'Utilisateur'}</td>
                          <td>{comm.amount_xof.toLocaleString()} F CFA</td>
                          <td style={{ color: 'var(--accent-success)', fontWeight: '600' }}>
                            +{comm.commission_xof.toLocaleString()} F CFA
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'withdrawals' && (
              <div className="table-container">
                {withdrawals.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Aucun retrait demandé pour le moment.
                  </div>
                ) : (
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Montant</th>
                        <th>Méthode / Numéro</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map((withdraw) => (
                        <tr key={withdraw.id}>
                          <td>{new Date(withdraw.created_at).toLocaleDateString('fr-FR')}</td>
                          <td style={{ fontWeight: '600' }}>{withdraw.amount.toLocaleString()} F CFA</td>
                          <td>
                            <span style={{ textTransform: 'uppercase', fontWeight: '500' }}>{withdraw.payment_method}</span>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{withdraw.payment_number}</div>
                          </td>
                          <td>
                            <span className={`badge badge-${withdraw.status.toLowerCase()}`}>
                              {withdraw.status === 'PENDING' ? 'En attente' : withdraw.status === 'APPROVED' ? 'Validé' : 'Rejeté'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          {/* Formulaire de demande de retrait */}
          <div className="glass-panel withdraw-card">
            <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Demander un Retrait</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.4' }}>
              Transférez vos gains retiraubles directement sur votre compte mobile money.
            </p>

            {withdrawError && (
              <div className="notification notification-error" style={{ padding: '10px 14px', fontSize: '13px' }}>
                <span>{withdrawError}</span>
              </div>
            )}

            {withdrawSuccess && (
              <div className="notification notification-success" style={{ padding: '10px 14px', fontSize: '13px' }}>
                <span>{withdrawSuccess}</span>
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="amount">Montant (F CFA)</label>
                <input
                  type="number"
                  id="amount"
                  className="form-input"
                  placeholder="Ex: 5000"
                  min="500"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="method">Opérateur</label>
                <div className="select-wrapper">
                  <select
                    id="method"
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="wave">Wave</option>
                    <option value="orange">Orange Money</option>
                    <option value="moov">Moov Money</option>
                    <option value="mtn">MTN Mobile Money</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="number">Numéro de Transfert</label>
                <input
                  type="tel"
                  id="number"
                  className="form-input"
                  placeholder="Ex: 221783030303"
                  value={paymentNumber}
                  onChange={(e) => setPaymentNumber(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }} disabled={withdrawLoading || stats.balance_xof < 500}>
                {withdrawLoading ? 'Traitement en cours...' : stats.balance_xof < 500 ? 'Solde trop bas (min 500 F)' : 'Demander le transfert'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
