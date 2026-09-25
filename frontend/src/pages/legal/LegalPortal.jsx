import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Shield, Lock, FileText, CheckCircle2, ArrowLeft, ExternalLink,
  ChevronRight, Sparkles, KeyRound, Server, Eye, Database,
  AlertCircle, Download, Copy, Check, Search, Globe, Award, HelpCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LegalPortal({ defaultTab = 'privacy' }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial tab from path or prop
  const getTabFromPath = () => {
    if (location.pathname.includes('/security')) return 'security';
    if (location.pathname.includes('/terms')) return 'terms';
    return defaultTab || 'privacy';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated] = useState('September 20, 2026');

  useEffect(() => {
    if (location.pathname.includes('/security')) setActiveTab('security');
    else if (location.pathname.includes('/terms')) setActiveTab('terms');
    else if (location.pathname.includes('/privacy')) setActiveTab('privacy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    navigate(`/${tabKey}`);
  };

  const copyPageUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success('Page link copied to clipboard');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="legal-portal-root" style={{
      minHeight: '100vh',
      background: '#FAF7F2',
      color: '#111827',
      fontFamily: '"Figtree", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <style>{`
        @media (max-width: 960px) {
          .legal-layout-main { grid-template-columns: 1fr !important; gap: 24px !important; padding: 0 16px 60px !important; }
          .legal-sidebar { position: static !important; width: 100% !important; }
          .legal-tab-switcher { width: 100% !important; overflow-x: auto; flex-wrap: nowrap !important; justify-content: flex-start !important; }
          .legal-tab-switcher button { flex: 1 0 auto; }
          .legal-top-bar { padding: 12px 16px !important; }
          .legal-hero { padding: 36px 16px 20px !important; }
          .legal-article-box { padding: 22px 16px !important; border-radius: 18px !important; }
        }
        @media (max-width: 480px) {
          .legal-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .legal-table-wrap table { min-width: 480px; }
        }
      `}</style>

      {/* ── Top Header Bar ───────────────────────────────── */}
      <header className="legal-top-bar" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(250, 247, 242, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(17, 24, 39, 0.08)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#FFFFFF',
              border: '1px solid rgba(17, 24, 39, 0.12)',
              borderRadius: 10,
              padding: '6px 12px',
              fontSize: 13,
              fontWeight: 700,
              color: '#111827',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#E55B2B'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(17, 24, 39, 0.12)'}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src="/logo.png"
              alt="CreatoKite Logo"
              style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'contain' }}
              onError={e => { e.currentTarget.src = '/logo.jpeg'; }}
            />
            <span style={{ fontSize: 18, fontWeight: 900, color: '#111827', letterSpacing: '-0.3px' }}>
              Creato<span style={{ color: '#E55B2B' }}>Kite</span>
            </span>
          </Link>
        </div>

        {/* Tab switcher */}
        <div className="legal-tab-switcher" style={{
          display: 'flex',
          background: '#FFFFFF',
          padding: 4,
          borderRadius: 12,
          border: '1px solid rgba(17, 24, 39, 0.08)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          gap: 4
        }}>
          {[
            { key: 'privacy', label: 'Privacy Policy', icon: Lock },
            { key: 'security', label: 'Security & Trust', icon: Shield },
            { key: 'terms', label: 'Terms of Service', icon: FileText },
          ].map(t => {
            const Icon = t.icon;
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => handleTabChange(t.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: 12.5,
                  fontWeight: active ? 800 : 600,
                  color: active ? '#FFFFFF' : '#4B5563',
                  background: active ? '#E55B2B' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={copyPageUrl}
            title="Copy document URL"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: '#FFFFFF',
              border: '1px solid rgba(17, 24, 39, 0.12)',
              borderRadius: 10,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              color: '#4B5563',
              cursor: 'pointer',
            }}
          >
            {copiedLink ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
            <span>{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </header>

      {/* ── Hero Banner Section ──────────────────────────── */}
      <section className="legal-hero" style={{
        padding: '50px 24px 36px',
        maxWidth: 1140,
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(229, 91, 43, 0.1)',
          color: '#E55B2B',
          padding: '6px 14px',
          borderRadius: 99,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          marginBottom: 16
        }}>
          <Sparkles size={13} /> CreatoKite Trust & Compliance Center
        </div>

        <h1 style={{
          fontSize: 'clamp(26px, 5vw, 42px)',
          fontWeight: 900,
          color: '#111827',
          lineHeight: 1.15,
          letterSpacing: '-0.8px',
          margin: '0 0 14px'
        }}>
          {activeTab === 'privacy' && <>CreatoKite Privacy &amp; Data Protection Policy</>}
          {activeTab === 'security' && <>CreatoKite Enterprise Security Architecture &amp; Info</>}
          {activeTab === 'terms' && <>CreatoKite Creator &amp; Brand Terms of Service</>}
        </h1>

        <p style={{
          fontSize: 'clamp(14px, 2.2vw, 16px)',
          color: '#4B5563',
          maxWidth: 720,
          margin: '0 auto 20px',
          lineHeight: 1.6
        }}>
          {activeTab === 'privacy' && 'How CreatoKite collects, processes, protects, and respects the private data of UGC creators, influencers, partner brands, and enterprise teams across India.'}
          {activeTab === 'security' && 'Our multi-layered security infrastructure, verified payout protocols, AES-256 encryption, OAuth social integrations, and zero-trust data safeguards.'}
          {activeTab === 'terms' && 'The official collaboration agreement governing campaigns, creator deliverables, UGC advertising rights, milestone approvals, and community standards on CreatoKite.'}
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
          fontSize: 12,
          color: '#6B7280',
          fontWeight: 600,
          flexWrap: 'wrap'
        }}>
          <span>📅 Effective Date: <strong>{lastUpdated}</strong></span>
          <span>•</span>
          <span>🏛️ Jurisdiction: <strong>Republic of India (DPDP Act 2023)</strong></span>
          <span>•</span>
          <span>🛡️ SSL / TLS 1.3 <strong>Encrypted</strong></span>
        </div>
      </section>

      {/* ── Main Content Layout ─────────────────────────── */}
      <main className="legal-layout-main" style={{
        maxWidth: 1140,
        margin: '0 auto',
        padding: '0 24px 80px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 280px',
        gap: 36,
        alignItems: 'flex-start'
      }}>

        {/* ── Document Body ─────────────────────────────── */}
        <article className="legal-article-box" style={{
          background: '#FFFFFF',
          border: '1px solid rgba(17, 24, 39, 0.08)',
          borderRadius: 24,
          padding: 'clamp(20px, 5vw, 44px)',
          boxShadow: '0 12px 35px -10px rgba(0, 0, 0, 0.04)',
          lineHeight: 1.75,
          color: '#374151'
        }}>

          {/* ════════════════════════════════════════════════
             TAB 1: PRIVACY POLICY
             ════════════════════════════════════════════════ */}
          {activeTab === 'privacy' && (
            <div>
              <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 24, marginBottom: 30 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111827', margin: '0 0 10px' }}>
                  1. Introduction &amp; Scope
                </h2>
                <p>
                  Welcome to <strong>CreatoKite</strong> (accessible at <a href="https://www.creatokite.in" style={{ color: '#E55B2B', fontWeight: 700 }}>www.creatokite.in</a>).
                  CreatoKite is India's leading AI-powered creator campaign platform, connecting verified digital content creators with forward-thinking consumer brands for UGC (User-Generated Content), performance video marketing, and high-engagement social promotions.
                </p>
                <p>
                  We are deeply committed to protecting your privacy. This Privacy Policy details how CreatoKite collects, utilizes, shares, and safeguards personal and commercial data when you access our web application, creator dashboard, brand portal, or public APIs.
                </p>
              </div>

              <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 24, marginBottom: 30 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: '0 0 12px' }}>
                  2. Information CreatoKite Collects
                </h2>
                <p>
                  To provide intelligent AI creator matching, automated campaign assignments, and secure milestone payments, CreatoKite collects the following categories of information:
                </p>
                <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <li>
                    <strong>Account &amp; Profile Information:</strong> Name, display handle, official email address, phone number, city/state in India, primary language proficiencies, bio, and portfolio links.
                  </li>
                  <li>
                    <strong>Social Media Analytics &amp; Public Metrics:</strong> When you connect your Instagram or YouTube profiles or supply your public handle, CreatoKite analyzes publicly available engagement metrics including follower count, average video views, engagement rate (ER), audience demographics, and niche focus to calculate your <em>Creator Authenticity Score (CAS)</em> and <em>Creator DNA</em> rank.
                  </li>
                  <li>
                    <strong>Brand Campaign Briefs &amp; Deliverables:</strong> Campaign budgets, product sample requirements, delivery guidelines, video drafts, captions, Google Drive links, and submission feedback.
                  </li>
                  <li>
                    <strong>Financial &amp; Payout Information:</strong> Bank account numbers, IFSC codes, UPI Virtual Payment Addresses (VPAs), PAN numbers, and GST credentials strictly utilized for processing campaign earnings, tax invoices, and direct payouts.
                  </li>
                  <li>
                    <strong>Technical &amp; Usage Logs:</strong> IP address, browser type, device metadata, real-time Socket.io communication in Campaign Rooms, and session timestamps for security audit compliance.
                  </li>
                </ul>
              </div>

              <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 24, marginBottom: 30 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: '0 0 12px' }}>
                  3. How CreatoKite Uses Your Information
                </h2>
                <p>
                  CreatoKite utilizes collected information strictly for legitimate platform operations:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, margin: '18px 0' }}>
                  <div style={{ background: '#FAF7F2', padding: '16px', borderRadius: 14, border: '1px solid rgba(17,24,39,0.06)' }}>
                    <div style={{ fontWeight: 800, color: '#E55B2B', fontSize: 13, marginBottom: 4 }}>🎯 AI Creator Matching</div>
                    <div style={{ fontSize: 12, color: '#4B5563' }}>Matching brands with niche creators based on performance DNA and target region suitability.</div>
                  </div>
                  <div style={{ background: '#FAF7F2', padding: '16px', borderRadius: 14, border: '1px solid rgba(17,24,39,0.06)' }}>
                    <div style={{ fontWeight: 800, color: '#E55B2B', fontSize: 13, marginBottom: 4 }}>💳 Verified Payout Release</div>
                    <div style={{ fontSize: 12, color: '#4B5563' }}>Ensuring transparent campaign compensation and automated direct disbursements to creators.</div>
                  </div>
                  <div style={{ background: '#FAF7F2', padding: '16px', borderRadius: 14, border: '1px solid rgba(17,24,39,0.06)' }}>
                    <div style={{ fontWeight: 800, color: '#E55B2B', fontSize: 13, marginBottom: 4 }}>💬 Real-Time Collaboration</div>
                    <div style={{ fontSize: 12, color: '#4B5563' }}>Powering secure Campaign Rooms, chat, deliverable reviews, and instant broadcast notifications.</div>
                  </div>
                  <div style={{ background: '#FAF7F2', padding: '16px', borderRadius: 14, border: '1px solid rgba(17,24,39,0.06)' }}>
                    <div style={{ fontWeight: 800, color: '#E55B2B', fontSize: 13, marginBottom: 4 }}>🛡️ Fraud Prevention</div>
                    <div style={{ fontSize: 12, color: '#4B5563' }}>Screening for artificial follower engagement, fake profiles, and unauthorized IP logins.</div>
                  </div>
                </div>
              </div>

              <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 24, marginBottom: 30 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: '0 0 12px' }}>
                  4. Third-Party Platform &amp; API Disclosures
                </h2>
                <p>
                  CreatoKite interfaces with third-party social APIs to synchronize public creator performance metrics:
                </p>
                <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <li>
                    <strong>Meta &amp; Instagram Graph API:</strong> CreatoKite reads public engagement metrics solely to provide creator evaluation and campaign analytics. We never store personal social passwords or post content without your direct manual action.
                  </li>
                  <li>
                    <strong>Google &amp; YouTube API Services:</strong> CreatoKite's use of information received from Google APIs adheres to the <em>Google API Services User Data Policy</em>, including Limited Use requirements.
                  </li>
                  <li>
                    <strong>Cloud Media Storage (Cloudinary):</strong> Uploaded video drafts and screenshots are encrypted and hosted in cloud-isolated environments.
                  </li>
                </ul>
              </div>

              <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 24, marginBottom: 30 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: '0 0 12px' }}>
                  5. Your Data Rights &amp; DPDP Act (India) Compliance
                </h2>
                <p>
                  In accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and global privacy standards, you maintain the following rights over your personal data:
                </p>
                <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li><strong>Right to Access:</strong> View and export your CreatoKite profile, campaign history, and wallet ledgers.</li>
                  <li><strong>Right to Correction:</strong> Update your profile, social handles, commercial rates, and contact info at any time.</li>
                  <li><strong>Right to Erasure (Right to be Forgotten):</strong> Request complete deletion of your account and personal identifiers from our database via your profile settings or by contacting our Data Protection Officer.</li>
                  <li><strong>Right to Withdraw Consent:</strong> Unlink connected social profiles or revoke marketing notifications in one click.</li>
                </ul>
              </div>

              <div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: '0 0 12px' }}>
                  6. Contact Our Privacy Office
                </h2>
                <p>
                  For privacy queries, data requests, or compliance inquiries regarding CreatoKite:
                </p>
                <div style={{ background: '#FAF7F2', padding: 20, borderRadius: 16, border: '1px solid rgba(17,24,39,0.08)' }}>
                  <div><strong>CreatoKite Data Protection Office</strong></div>
                  <div style={{ marginTop: 4 }}>Email: <a href="mailto:creaotokite123@gmail.com" style={{ color: '#E55B2B', fontWeight: 700 }}>creaotokite123@gmail.com</a> </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
             TAB 2: SECURITY INFO & ARCHITECTURE
             ════════════════════════════════════════════════ */}
          {activeTab === 'security' && (
            <div>
              <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 24, marginBottom: 30 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111827', margin: '0 0 10px' }}>
                  1. Enterprise Security Overview
                </h2>
                <p>
                  At <strong>CreatoKite</strong>, security is built into our core platform architecture. We implement bank-grade encryption, zero-trust infrastructure, and strict role segregation to safeguard brand budgets, creator earnings, and confidential campaign strategies.
                </p>
              </div>

              {/* 4 Security Pillars Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 30 }}>
                <div style={{ background: '#FAF7F2', padding: 20, borderRadius: 16, border: '1px solid rgba(17,24,39,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#E55B2B', fontWeight: 800, fontSize: 14, marginBottom: 8 }}>
                    <KeyRound size={18} /> TLS 1.3 &amp; AES-256
                  </div>
                  <div style={{ fontSize: 12.5, color: '#4B5563', lineHeight: 1.6 }}>
                    All web traffic is forced over HTTPS with TLS 1.3 encryption. Sensitive database fields including bank credentials and KYC documents are encrypted at rest with AES-256.
                  </div>
                </div>

                <div style={{ background: '#FAF7F2', padding: 20, borderRadius: 16, border: '1px solid rgba(17,24,39,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#E55B2B', fontWeight: 800, fontSize: 14, marginBottom: 8 }}>
                    <Server size={18} /> Zero-Trust Architecture
                  </div>
                  <div style={{ fontSize: 12.5, color: '#4B5563', lineHeight: 1.6 }}>
                    Role-Based Access Control (RBAC) separates SuperAdmin, Admin, Team Member, Brand, and Creator permissions with JWT token invalidation on session revocation.
                  </div>
                </div>

                <div style={{ background: '#FAF7F2', padding: 20, borderRadius: 16, border: '1px solid rgba(17,24,39,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#E55B2B', fontWeight: 800, fontSize: 14, marginBottom: 8 }}>
                    <Lock size={18} /> Payout Protection
                  </div>
                  <div style={{ fontSize: 12.5, color: '#4B5563', lineHeight: 1.6 }}>
                    Brand campaign compensation is secured and verified, disbursed directly upon deliverable approval and transaction validation.
                  </div>
                </div>

                <div style={{ background: '#FAF7F2', padding: 20, borderRadius: 16, border: '1px solid rgba(17,24,39,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#E55B2B', fontWeight: 800, fontSize: 14, marginBottom: 8 }}>
                    <Database size={18} /> Immutable Audit Logs
                  </div>
                  <div style={{ fontSize: 12.5, color: '#4B5563', lineHeight: 1.6 }}>
                    Every administrative action, creator score recalculation, and payment transfer is recorded in tamper-evident audit logs with IP addresses and user agents.
                  </div>
                </div>
              </div>

              <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 24, marginBottom: 30 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: '0 0 12px' }}>
                  2. Authentication &amp; Password Security
                </h2>
                <p>
                  CreatoKite implements industry-best authentication practices:
                </p>
                <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li><strong>Password Hashing:</strong> Passwords are salt-hashed using modern Bcrypt (12 rounds) to prevent brute-force or dictionary attacks.</li>
                  <li><strong>Session Tokens:</strong> Short-lived JWT access tokens accompanied by rotating refresh tokens stored securely to mitigate XSS and CSRF vectors.</li>
                  <li><strong>Rate Limiting &amp; DDoS Protection:</strong> Express rate limiters protect authentication endpoints against credential stuffing and automated bot attacks.</li>
                </ul>
              </div>

              <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 24, marginBottom: 30 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: '0 0 12px' }}>
                  3. Social Media OAuth &amp; Read-Only Sandboxing
                </h2>
                <p>
                  CreatoKite connects with social platforms strictly via authorized OAuth 2.0 protocols:
                </p>
                <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li>We request only minimal read scopes to compute performance metrics (views, followers, engagement rate).</li>
                  <li>CreatoKite never requests or retains write permissions for your direct messages, private stories, or social passwords.</li>
                  <li>Creators can disconnect their social accounts from their profile settings instantly, triggering token invalidation.</li>
                </ul>
              </div>

              <div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: '0 0 12px' }}>
                  4. Vulnerability Reporting &amp; Security Contact
                </h2>
                <p>
                  CreatoKite maintains a responsible disclosure program. If you discover a potential security flaw or vulnerability:
                </p>
                <div style={{ background: '#FAF7F2', padding: 20, borderRadius: 16, border: '1px solid rgba(17,24,39,0.08)' }}>
                  <div><strong>CreatoKite Security &amp; Response Team</strong></div>
                  <div style={{ marginTop: 4 }}>Security Email: <a href="mailto:creaotokite123@gmail.com" style={{ color: '#E55B2B', fontWeight: 700 }}>creaotokite123@gmail.com</a></div>
                  <div style={{ marginTop: 2, fontSize: 12, color: '#6B7280' }}>Our security engineering team acknowledges reports within 24 hours.</div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
             TAB 3: TERMS OF SERVICE
             ════════════════════════════════════════════════ */}
          {activeTab === 'terms' && (
            <div>
              <div style={{ background: '#FFF8F4', border: '1px solid rgba(229, 91, 43, 0.2)', borderRadius: 14, padding: 18, marginBottom: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#E55B2B', margin: '0 0 6px' }}>
                  Please read carefully before registering on CreatoKite
                </h3>
                <p style={{ fontSize: 13, color: '#4B5563', margin: 0, fontWeight: 500 }}>
                  Effective immediately upon registration · CreatoKite Technologies
                </p>
              </div>

              {/* Creator Terms Section */}
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: 'inline-block', background: 'rgba(229, 91, 43, 0.1)', color: '#E55B2B', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
                  Creator Terms &amp; Participation Policy
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>1. Platform Role</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      CreatoKite acts as a campaign coordination and creator participation platform connecting brands and creators for collaborative influencer campaigns. CreatoKite does not guarantee campaign allocation, fixed earnings, brand selection, or creator visibility in every campaign. Participation remains opportunity-based.
                    </p>
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>2. Creator Participation Model</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      Creators shall not be permanently assigned or exclusively mapped to any individual brand. Campaign opportunities are released on creator dashboards based on platform campaigns. Creators may voluntarily accept or reject campaigns. Acceptance does not guarantee final content selection or publishing rights.
                    </p>
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>3. Campaign Acceptance</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      Each campaign on your dashboard will contain: campaign duration, submission deadline, content requirements, platform rules, compensation model, and deliverables. Failure to respond within the campaign window may result in automatic expiration.
                    </p>
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>4. Content Submission &amp; Audit Rights</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      Upon campaign acceptance you may submit content assets. CreatoKite reserves the right to review, audit, reject, edit, shortlist and optimise content. Submission does not guarantee selection.
                    </p>
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>5. Internal Selection Mechanism</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      CreatoKite may internally shortlist top-performing creatives (e.g. Top 5 videos) for brand review. Selection criteria may include quality, hook rate, creativity, compliance, engagement potential and brand fit. Selection decisions are final.
                    </p>
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>6. Content Distribution Rights</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      Creators acknowledge that selected campaign creatives may be distributed across participating creators for campaign execution. No creator shall claim exclusive ownership over campaign execution rights after approval.
                    </p>
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>7. Creator Identity Confidentiality</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      CreatoKite may withhold your identity from brands during internal content selection. Brands may receive campaign results without disclosure of selected creator identities.
                    </p>
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>8. Earnings Policy</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      Campaign earnings depend on participation, deliverable completion, compliance and campaign rules. CreatoKite does not guarantee fixed income.
                    </p>
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>9. Prohibited Actions</h3>
                    <ul style={{ paddingLeft: 20, margin: 0, fontSize: 14, color: '#4B5563', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <li>Do not leak campaign information or contact brands directly.</li>
                      <li>Do not reveal internal workflows or manipulate analytics.</li>
                      <li>Do not submit copied content, use bots, or re-upload restricted assets.</li>
                    </ul>
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>10. Intellectual Property</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      Original content ownership remains with the creator unless campaign licensing applies. Creators grant CreatoKite limited campaign usage rights upon submission.
                    </p>
                  </div>
                </div>
              </div>

              {/* Brand Terms Section */}
              <div>
                <div style={{ display: 'inline-block', background: 'rgba(17, 24, 39, 0.08)', color: '#111827', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
                  Brand Terms &amp; Package Policy
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>1. Campaign Package Model</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      Brands purchase creator participation packages (e.g. 20 / 40 / 50 creators). Package selection determines your campaign pool size.
                    </p>
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>2. Participation-Based Delivery</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      Campaigns operate through participation pools and not fixed creator assignments. Creator availability may vary per campaign cycle.
                    </p>
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>3. Content Selection Model</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      Multiple creators may submit content. CreatoKite audits and shortlists creatives before presentation to the brand. You will receive only reviewed, shortlisted content.
                    </p>
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>4. Confidential Workflow</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      Creator identities may remain confidential during campaign processing. CreatoKite does not disclose creator personal information without consent.
                    </p>
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>5. Performance Disclaimer</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      CreatoKite provides no guarantee of sales, ROI, reach, virality or engagement outcomes. Campaign performance depends on multiple external factors.
                    </p>
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>6. Approval Rights</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      Brands may approve or reject shortlisted creatives presented for their campaign. Approved assets may be distributed within the campaign creator network.
                    </p>
                  </div>

                  <div style={{ borderBottom: '1px solid rgba(17, 24, 39, 0.08)', paddingBottom: 16 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>7. Payment Terms</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      Campaigns will only go live after full payment confirmation. Refunds are subject to CreatoKite's refund policy.
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>8. Content Usage</h3>
                    <p style={{ fontSize: 14, color: '#4B5563', margin: 0, lineHeight: 1.6 }}>
                      Approved creative assets may be distributed within the campaign creator network solely for campaign execution purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </article>

        {/* ── Sidebar Quick Navigation & Trust Badges ────── */}
        <aside className="legal-sidebar" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          position: 'sticky',
          top: 86
        }}>

          {/* Quick Legal Hub Navigation */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(17, 24, 39, 0.08)',
            borderRadius: 18,
            padding: 20,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px' }}>
              Legal Navigation
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { key: 'privacy', label: 'Privacy Policy', icon: Lock },
                { key: 'security', label: 'Security & Trust Info', icon: Shield },
                { key: 'terms', label: 'Terms of Service', icon: FileText },
              ].map(item => {
                const active = activeTab === item.key;
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleTabChange(item.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: 'none',
                      background: active ? 'rgba(229, 91, 43, 0.1)' : 'transparent',
                      color: active ? '#E55B2B' : '#374151',
                      fontWeight: active ? 800 : 600,
                      fontSize: 13,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon size={14} color={active ? '#E55B2B' : '#6B7280'} />
                      <span>{item.label}</span>
                    </div>
                    {active && <ChevronRight size={14} color="#E55B2B" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CreatoKite Trust Badges Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(229, 91, 43, 0.06), rgba(245, 166, 35, 0.03)), #FFFFFF',
            border: '1px solid rgba(229, 91, 43, 0.2)',
            borderRadius: 18,
            padding: 20,
            boxShadow: '0 4px 14px rgba(229, 91, 43, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#E55B2B', fontWeight: 800, fontSize: 13, marginBottom: 12 }}>
              <Award size={16} /> CreatoKite Certifications
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, color: '#4B5563' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} color="#16a34a" /> DPDP Act 2023 Compliant
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} color="#16a34a" /> 256-Bit SSL/TLS 1.3 Encryption
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} color="#16a34a" /> Verified Creator Payouts
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} color="#16a34a" /> Meta &amp; Google OAuth Verified
              </div>
            </div>
          </div>

          {/* Need Assistance Card */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(17, 24, 39, 0.08)',
            borderRadius: 18,
            padding: 20,
            fontSize: 12,
            color: '#6B7280',
            lineHeight: 1.5
          }}>
            <div style={{ fontWeight: 700, color: '#111827', fontSize: 13, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <HelpCircle size={14} color="#E55B2B" /> Have Questions?
            </div>
            Contact our legal team at <a href="mailto:creaotokite123@gmail.com" style={{ color: '#E55B2B', fontWeight: 700, textDecoration: 'none' }}>creaotokite123@gmail.com</a> for enterprise DPA agreements.
          </div>

        </aside>

      </main>

      {/* ── Page Footer ─────────────────────────────────── */}
      <footer style={{
        background: '#FAF7F2',
        borderTop: '1px solid rgba(17, 24, 39, 0.08)',
        padding: '30px 24px',
        textAlign: 'center',
        fontSize: 12.5,
        color: '#6B7280'
      }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            © 2026 <strong>CreatoKite Technologies</strong>. All rights reserved. Made in India.
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            <Link to="/blog" style={{ color: '#E55B2B', textDecoration: 'none', fontWeight: 600 }}>CreatoKite Blog</Link>
            <Link to="/privacy" style={{ color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
            <Link to="/security" style={{ color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>Security Info</Link>
            <Link to="/terms" style={{ color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
