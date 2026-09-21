import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../../contexts/AuthContext';
import { authAPI } from '../../api';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import {
  Phone, CheckCircle2, ArrowRight, X,
  User, Mail, Lock, Globe, ShieldCheck,
  Eye, EyeOff, Sparkles, Grid
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   TermsModal — Full CreatoKite Registration Legal Terms
 ───────────────────────────────────────────────────────────── */
function TermsModal({ onClose, role = 'creator' }) {
  const [tab, setTab] = useState(role === 'brand' ? 'brand' : 'creator');

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'rgba(15, 14, 12, 0.78)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        width: '100%', maxWidth: 640, background: '#FFFFFF',
        borderRadius: 20, border: '1px solid #E2DDD3',
        boxShadow: '0 24px 70px rgba(0,0,0,0.3)', position: 'relative',
        maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        overflow: 'hidden', fontFamily: 'Inter, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #ECE7DE',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAF8F5'
        }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1F1C18', margin: 0 }}>
              CreatoKite Terms of Service
            </h3>
            <p style={{ fontSize: 12, color: '#6E6B65', margin: '2px 0 0' }}>
              Please read carefully before registering on CreatoKite
            </p>
          </div>
          <button
            type="button" onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9C968B', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', padding: '12px 24px 0', gap: 10, background: '#FAF8F5', borderBottom: '1px solid #ECE7DE' }}>
          <button
            type="button"
            onClick={() => setTab('creator')}
            style={{
              padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none',
              background: tab === 'creator' ? '#FFFFFF' : 'transparent',
              borderBottom: tab === 'creator' ? '2px solid #E65F2B' : '2px solid transparent',
              color: tab === 'creator' ? '#E65F2B' : '#6E6B65',
              fontWeight: 700, fontSize: 13, cursor: 'pointer'
            }}
          >
            Creator Terms (10 Points)
          </button>
          <button
            type="button"
            onClick={() => setTab('brand')}
            style={{
              padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none',
              background: tab === 'brand' ? '#FFFFFF' : 'transparent',
              borderBottom: tab === 'brand' ? '2px solid #E65F2B' : '2px solid transparent',
              color: tab === 'brand' ? '#E65F2B' : '#6E6B65',
              fontWeight: 700, fontSize: 13, cursor: 'pointer'
            }}
          >
            Brand Terms (8 Points)
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, fontSize: 13, color: '#3A3630', lineHeight: 1.6 }}>
          {tab === 'creator' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: '#FFF8F4', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(230,95,43,0.15)', color: '#E65F2B', fontWeight: 700, fontSize: 12 }}>
                Effective immediately upon registration · CreatoKite Technologies
              </div>
              <div>
                <strong>1. Platform Role:</strong> CreatoKite acts as a campaign coordination and creator participation platform connecting brands and creators for collaborative influencer campaigns. CreatoKite does not guarantee campaign allocation, fixed earnings, brand selection, or creator visibility in every campaign. Participation remains opportunity-based.
              </div>
              <div>
                <strong>2. Creator Participation Model:</strong> Creators shall not be permanently assigned or exclusively mapped to any individual brand. Campaign opportunities are released on creator dashboards based on platform campaigns. Creators may voluntarily accept or reject campaigns. Acceptance does not guarantee final content selection or publishing rights.
              </div>
              <div>
                <strong>3. Campaign Acceptance:</strong> Each campaign on your dashboard will contain: campaign duration, submission deadline, content requirements, platform rules, compensation model, and deliverables. Failure to respond within the campaign window may result in automatic expiration.
              </div>
              <div>
                <strong>4. Content Submission &amp; Audit Rights:</strong> Upon campaign acceptance you may submit content assets. CreatoKite reserves the right to review, audit, reject, edit, shortlist and optimise content. Submission does not guarantee selection.
              </div>
              <div>
                <strong>5. Internal Selection Mechanism:</strong> CreatoKite may internally shortlist top-performing creatives (e.g. Top 5 videos) for brand review. Selection criteria may include quality, hook rate, creativity, compliance, engagement potential and brand fit. Selection decisions are final.
              </div>
              <div>
                <strong>6. Content Distribution Rights:</strong> Creators acknowledge that selected campaign creatives may be distributed across participating creators for campaign execution. No creator shall claim exclusive ownership over campaign execution rights after approval.
              </div>
              <div>
                <strong>7. Creator Identity Confidentiality:</strong> CreatoKite may withhold your identity from brands during internal content selection. Brands may receive campaign results without disclosure of selected creator identities.
              </div>
              <div>
                <strong>8. Earnings Policy:</strong> Campaign earnings depend on participation, deliverable completion, compliance and campaign rules. CreatoKite does not guarantee fixed income.
              </div>
              <div>
                <strong>9. Prohibited Actions:</strong> Do not leak campaign information or contact brands directly. Do not reveal internal workflows or manipulate analytics. Do not submit copied content, use bots, or re-upload restricted assets.
              </div>
              <div>
                <strong>10. Intellectual Property:</strong> Original content ownership remains with the creator unless campaign licensing applies. Creators grant CreatoKite limited campaign usage rights upon submission.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <strong>1. Campaign Package Model:</strong> Brands purchase creator participation packages (e.g. 20 / 40 / 50 creators). Package selection determines your campaign pool size.
              </div>
              <div>
                <strong>2. Participation-Based Delivery:</strong> Campaigns operate through participation pools and not fixed creator assignments. Creator availability may vary per campaign cycle.
              </div>
              <div>
                <strong>3. Confidential Workflow:</strong> Creator identities may remain confidential during campaign processing. CreatoKite does not disclose creator personal information without consent.
              </div>
              <div>
                <strong>4. Content Selection Model:</strong> Multiple creators may submit content. CreatoKite audits and shortlists creatives before presentation to the brand. You will receive only reviewed, shortlisted content.
              </div>
              <div>
                <strong>5. Performance Disclaimer:</strong> CreatoKite provides no guarantee of sales, ROI, reach, virality or engagement outcomes. Campaign performance depends on multiple external factors.
              </div>
              <div>
                <strong>6. Approval Rights:</strong> Brands may approve or reject shortlisted creatives presented for their campaign. Approved assets may be distributed within the campaign creator network.
              </div>
              <div>
                <strong>7. Payment Terms:</strong> Campaigns will only go live after full payment confirmation. Refunds are subject to CreatoKite's refund policy.
              </div>
              <div>
                <strong>8. Content Usage:</strong> Approved creative assets may be distributed within the campaign creator network solely for campaign execution purposes.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #ECE7DE', background: '#FAF8F5', textAlign: 'right' }}>
          <button
            type="button" onClick={onClose}
            style={{
              padding: '8px 20px', background: '#E65F2B', color: '#FFF', border: 'none',
              borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer'
            }}
          >
            I Understand &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   OtpModal — 6-digit OTP Email Verification Dialog
 ───────────────────────────────────────────────────────────── */
function OtpModal({ email, onVerified, onClose }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    if (timer > 0 || sending) return;
    setSending(true);
    try {
      const res = await authAPI.sendSignupOtp({ email });
      toast.success(res.message || `New verification code sent to ${email}`);
      setTimer(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code.');
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) return toast.error('Please enter all 6 digits of the OTP code');

    setVerifying(true);
    try {
      const res = await authAPI.verifySignupOtp({ email, otp: otpCode });
      toast.success('Email verified successfully! 🎉');
      onVerified(res.verificationToken);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(15, 14, 12, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #ECE7DE',
        borderRadius: 24,
        width: '100%', maxWidth: 460,
        padding: '32px 28px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        fontFamily: 'Inter, sans-serif',
        textAlign: 'center',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(230, 95, 43, 0.1)',
          color: '#E65F2B',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <Mail size={26} />
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1F1C18', margin: '0 0 6px' }}>
          Verify Your Email
        </h2>
        <p style={{ fontSize: 13, color: '#6E6B65', margin: '0 0 24px', lineHeight: 1.5 }}>
          We've sent a 6-digit verification code to <br />
          <strong style={{ color: '#1F1C18' }}>{email}</strong>
        </p>

        <form onSubmit={handleVerify}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }} onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => inputRefs.current[idx] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                style={{
                  width: 46, height: 54, borderRadius: 12,
                  border: digit ? '2px solid #E65F2B' : '1px solid #D6D1C7',
                  background: digit ? 'rgba(230, 95, 43, 0.04)' : '#F9F8F5',
                  textAlign: 'center', fontSize: 22, fontWeight: 800,
                  color: '#1F1C18', outline: 'none',
                  transition: 'all 0.15s ease',
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={verifying || otp.join('').length < 6}
            style={{
              width: '100%', padding: '14px', borderRadius: 12,
              background: otp.join('').length === 6 ? '#E65F2B' : '#CCC',
              color: '#FFF', border: 'none', fontWeight: 700, fontSize: 14,
              cursor: otp.join('').length === 6 ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.2s',
            }}
          >
            {verifying ? 'Verifying Code...' : 'Verify & Continue →'}
          </button>
        </form>

        <div style={{ marginTop: 20, fontSize: 13, color: '#6E6B65' }}>
          Didn't receive the code?{' '}
          {timer > 0 ? (
            <span style={{ fontWeight: 600, color: '#888' }}>
              Resend in {timer}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={sending}
              style={{
                background: 'none', border: 'none', color: '#E65F2B',
                fontWeight: 700, cursor: 'pointer', padding: 0,
                textDecoration: 'underline',
              }}
            >
              {sending ? 'Sending...' : 'Resend OTP'}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: 16, background: 'none', border: 'none',
            color: '#888278', fontSize: 12, cursor: 'pointer',
          }}
        >
          ← Change Email Address
        </button>
      </div>
    </div>
  );
}




function TC({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 13.5, fontWeight: 700, color: '#1F1C18', marginBottom: 5 }}>
        {title}
      </h3>
      <div style={{ color: '#555047', fontSize: 13 }}>{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   NicheMultiSelect — Search, Pick Multiple, & Write Custom Niche
 ───────────────────────────────────────────────────────────── */
function NicheMultiSelect({ selectedNiches = [], onChange }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const ALL_PRESETS = [
    'Tech', 'Beauty', 'Fashion', 'Fitness', 'Food', 'Travel', 'Gaming',
    'Education', 'Finance', 'Lifestyle', 'Music', 'Art', 'Automotive',
    'AI & Software', 'Crypto & Web3', 'Parenting & Family', 'Health & Wellness',
    'Business & Entrepreneurship', 'Photography & Video', 'Comedy & Entertainment'
  ];

  const filteredPresets = ALL_PRESETS.filter(n =>
    n.toLowerCase().includes(query.toLowerCase()) && !selectedNiches.includes(n)
  );

  const isExactMatch = ALL_PRESETS.some(n => n.toLowerCase() === query.trim().toLowerCase()) ||
    selectedNiches.some(n => n.toLowerCase() === query.trim().toLowerCase());

  const addNiche = (nicheToAdd) => {
    const trimmed = nicheToAdd.trim();
    if (!trimmed) return;
    if (!selectedNiches.includes(trimmed)) {
      onChange([...selectedNiches, trimmed]);
    }
    setQuery('');
    setIsOpen(false);
  };

  const removeNiche = (nicheToRemove) => {
    onChange(selectedNiches.filter(n => n !== nicheToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        addNiche(query.trim());
      }
    }
  };

  useEffect(() => {
    const fn = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <div className="login-field-group" style={{ position: 'relative' }} ref={dropdownRef}>
      <div className="login-field-header-row">
        <label className="login-field-label">Creator Niche(s) *</label>
        <span style={{ fontSize: 10.5, color: '#888278', fontWeight: 500 }}>Select multiple or write custom</span>
      </div>

      {/* Selected Tag Pills */}
      {selectedNiches.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 2 }}>
          {selectedNiches.map(n => (
            <span
              key={n}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 8px', borderRadius: 16,
                background: 'rgba(230, 95, 43, 0.1)', color: '#E65F2B',
                border: '1px solid rgba(230, 95, 43, 0.25)',
                fontSize: 11.5, fontWeight: 700,
              }}
            >
              {n}
              <button
                type="button"
                onClick={() => removeNiche(n)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#E65F2B', padding: 0, display: 'flex', alignItems: 'center',
                  fontSize: 13, lineHeight: 1, fontWeight: 800
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input container */}
      <div className="login-input-wrap">
        <Grid size={16} className="login-input-icon" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedNiches.length === 0 ? "Search or type your niche..." : "Add another niche..."}
          className="login-input"
        />
        {query.trim() && (
          <button
            type="button"
            onClick={() => addNiche(query)}
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: '#E65F2B', color: '#fff', border: 'none', borderRadius: 6,
              padding: '4px 8px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer'
            }}
          >
            Add
          </button>
        )}
      </div>

      {/* Dropdown popup */}
      {isOpen && (
        <div
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
            background: '#FFFFFF', border: '1px solid #ECE7DE', borderRadius: 12,
            boxShadow: '0 12px 32px rgba(0,0,0,0.12)', maxHeight: 180, overflowY: 'auto',
            zIndex: 100, padding: 4, display: 'flex', flexDirection: 'column', gap: 2
          }}
        >
          {query.trim() && !isExactMatch && (
            <button
              type="button"
              onClick={() => addNiche(query)}
              style={{
                width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 6,
                background: 'rgba(230,95,43,0.08)', border: '1px dashed #E65F2B',
                color: '#E65F2B', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2
              }}
            >
              <span>➕ Add custom niche:</span> <strong>"{query.trim()}"</strong>
            </button>
          )}

          {filteredPresets.map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => addNiche(preset)}
              style={{
                width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 6,
                background: 'transparent', border: 'none', color: '#1F1C18',
                fontSize: 12.5, cursor: 'pointer', transition: 'background 0.12s',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(230, 95, 43, 0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span>{preset}</span>
              <span style={{ fontSize: 10.5, color: '#E65F2B', fontWeight: 700 }}>+ Add</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Register component
 ───────────────────────────────────────────────────────────── */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedNiches, setSelectedNiches] = useState([]);

  // OTP Email Verification State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');

  const handleNichesChange = (newNiches) => {
    setSelectedNiches(newNiches);
    setForm(p => ({
      ...p,
      niche: newNiches[0] || '',
      subNiches: newNiches,
    }));
  };

  const [form, setForm] = useState({
    displayName: '', email: '', password: '', role: params.get('role') || 'creator',
    niche: '', subNiches: [], companyName: '', handle: '',
    instagramUrl: '', youtubeUrl: '',
  });
  const upd = k => e => {
    if (k === 'email') {
      setIsEmailVerified(false);
      setVerificationToken('');
    }
    setForm(p => ({ ...p, [k]: e.target.value }));
  };

  const handleStep1Submit = async e => {
    e.preventDefault();
    if (!form.displayName.trim() || !form.email.trim() || !form.password) return toast.error('Fill all required fields');
    if (form.password.length < 6) return toast.error('Password min 6 characters');
    if (!termsAccepted) return toast.error('Please accept the Terms & Conditions to continue');
    if (form.role === 'creator' && selectedNiches.length === 0) return toast.error('Please select or write at least one niche');

    // Trigger OTP Email Verification if not verified yet
    if (!isEmailVerified) {
      setLoading(true);
      try {
        const res = await authAPI.sendSignupOtp({ email: form.email.trim() });
        toast.success(res.message || `Verification code sent to ${form.email}`);
        setShowOtpModal(true);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to send verification code.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (form.role === 'brand') {
      handleFinalRegister(null, verificationToken);
    } else {
      setStep(2);
    }
  };

  const handleOtpVerified = (token) => {
    setVerificationToken(token);
    setIsEmailVerified(true);
    setShowOtpModal(false);
    if (form.role === 'brand') {
      handleFinalRegister(null, token);
    } else {
      setStep(2);
    }
  };

  const handleFinalRegister = async (e, tokenOverride) => {
    if (e) e.preventDefault();

    const currentToken = tokenOverride || verificationToken;
    if (!isEmailVerified && !currentToken) {
      toast.error('Please verify your email address first.');
      return;
    }

    if (form.role === 'creator') {
      const handleValue = form.handle.trim() || form.instagramUrl.trim();
      if (!handleValue) {
        return toast.error('Instagram handle or profile URL is required to register as a creator.');
      }
    }

    setLoading(true);
    try {
      const cleanHandle = form.handle.trim().startsWith('@')
        ? form.handle.trim().slice(1)
        : form.handle.trim();

      const payload = {
        ...form,
        verificationToken: currentToken,
        handle: cleanHandle,
        instagramUrl: form.instagramUrl.trim() || (cleanHandle ? `https://instagram.com/${cleanHandle}` : ''),
        termsAccepted: true
      };

      const { user } = await register(payload);
      toast.success(`Welcome to CreatoKite, ${user.displayName}! 🚀`);
      navigate(getDashboardPath(user.role), { replace: true });
    } catch (err) {
      let errMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || err.message || 'Registration failed';
      if (typeof errMsg === 'string' && (errMsg.includes('ECONNRESET') || errMsg.includes('ECONNREFUSED') || errMsg.includes('ETIMEDOUT') || errMsg.includes('Network Error'))) {
        errMsg = 'Connection reset or network interruption. Please try again.';
      }
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root-container">
      <SEO
        title="Join CreatoKite | UGC Creator & Brand Platform Registration"
        description="Create your account on CreatoKite. Join top UGC creators, launch brand campaigns, and scale video content production seamlessly."
        canonical="/register"
      />

      {showTerms && <TermsModal role={form.role} onClose={() => setShowTerms(false)} />}
      {showOtpModal && (
        <OtpModal
          email={form.email.trim()}
          onVerified={handleOtpVerified}
          onClose={() => setShowOtpModal(false)}
        />
      )}

      {/* ── LEFT PANEL (DARK HERO WITH REAL MOUNTAINS & REALISTIC 3D KITE) ── */}
      <div className="reg-left-panel">
        {/* Background Hero Image: Real Mountain & Orange Horizon Glow Visual */}
        <div className="reg-bg-image-wrap">
          <img
            src="/login_backdrop.png"
            alt="CreatoKite Hero Backdrop"
            className="reg-bg-hero-img"
          />
          <div className="reg-hero-overlay" />
        </div>



        {/* Top Brand Logo */}
        <div className="login-brand-header" onClick={() => navigate('/')}>
          <div className="login-logo-icon">
            <img src="/logo.jpeg" alt="CreatoKite" onError={e => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <span className="login-brand-name">
            Creato<span className="login-brand-italic">Kite</span>
          </span>
        </div>

        {/* Main Hero Copy */}
        <div className="login-hero-copy">
          <h1 className="login-hero-heading">
            Scale your brand. <br />
            Empower your <br />
            <span className="login-hero-serif">creativity.</span>
          </h1>
          <div className="reg-title-underline" />

          <p className="login-hero-subtext">
            India's first campaign execution platform connecting high-growth teams with verified, audited creator talent.
          </p>
        </div>



        {/* Organic Curved SVG Divider */}
        <div className="login-curved-svg-divider">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
            <path d="M100,0 C50,28 65,72 100,100 L100,100 L100,0 Z" fill="#F6F4EF" />
          </svg>
        </div>
      </div>

      {/* ── RIGHT PANEL (LIGHT CANVAS WITH FORM CARD & FOOTER) ── */}
      <div className="login-right-panel">
        {/* Top Right Home Navigation */}
        <div className="login-top-nav">
          <button onClick={() => navigate('/')} className="login-return-btn">
            ← Return to Home
          </button>
        </div>

        {/* Center Floating Form Card */}
        <div className="login-card-wrapper">
          {/* Card Header */}
          <div className="login-card-header">
            {/* Mobile Brand Logo */}
            <div className="login-mobile-logo" onClick={() => navigate('/')}>
              <img src="/logo.jpeg" alt="CreatoKite" onError={e => { e.currentTarget.style.display = 'none'; }} />
              <span className="login-brand-name">
                Creato<span className="login-brand-italic">Kite</span>
              </span>
            </div>

            <h2 className="login-card-title">
              Create <span className="login-hero-serif">Account</span>
            </h2>
            <div className="reg-card-title-line" />
            <p className="login-card-subtitle">
              {step === 1
                ? "Let's set up your profile to get started."
                : 'Step 2 of 2: Connect your Instagram profile to verify creator status.'}
            </p>
          </div>

          {/* White Card Container */}
          <div className="login-white-card">
            {step === 1 ? (
              <form onSubmit={handleStep1Submit} className="login-form">
                {/* Full Name */}
                <div className="login-field-group">
                  <label className="login-field-label">Full Name *</label>
                  <div className="login-input-wrap">
                    <User size={16} className="login-input-icon" />
                    <input
                      type="text"
                      value={form.displayName}
                      onChange={upd('displayName')}
                      placeholder="Enter your full name"
                      required
                      className="login-input"
                    />
                  </div>
                </div>

                {/* Email address */}
                <div className="login-field-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label className="login-field-label" style={{ margin: 0 }}>Email address *</label>
                    {isEmailVerified ? (
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={13} /> Email Verified
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#E65F2B' }}>
                        OTP Verification Required
                      </span>
                    )}
                  </div>
                  <div className="login-input-wrap">
                    <Mail size={16} className="login-input-icon" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={upd('email')}
                      placeholder="you@example.com"
                      required
                      className="login-input"
                      disabled={isEmailVerified}
                    />
                    {isEmailVerified && (
                      <button
                        type="button"
                        onClick={() => { setIsEmailVerified(false); setVerificationToken(''); }}
                        style={{
                          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', color: '#888278', fontSize: 11, cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="login-field-group">
                  <label className="login-field-label">Password *</label>
                  <div className="login-input-wrap">
                    <Lock size={16} className="login-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={upd('password')}
                      placeholder="Min 6 characters"
                      required
                      minLength={6}
                      className="login-input login-input-pwd"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="login-pwd-toggle"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Creator Niche */}
                {form.role === 'creator' && (
                  <NicheMultiSelect
                    selectedNiches={selectedNiches}
                    onChange={handleNichesChange}
                  />
                )}

                {/* Terms Checkbox Banner Box */}
                <div className="reg-terms-box">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={e => setTermsAccepted(e.target.checked)}
                    className="login-custom-checkbox"
                    style={{ shrink: 0 }}
                  />
                  <span>
                    I agree to the{' '}
                    <strong onClick={() => setShowTerms(true)} className="reg-terms-link">
                      Terms & Conditions
                    </strong>{' '}
                    for {form.role === 'brand' ? 'Brands' : 'Creators'} on CreatoKite.
                  </span>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="login-submit-btn"
                >
                  <Sparkles size={16} />
                  <span>
                    {isEmailVerified
                      ? (form.role === 'brand' ? 'Complete Registration' : 'Next: Connect Social Profile')
                      : 'Verify Email & Continue'}
                  </span>
                  <ArrowRight size={16} />
                </button>
              </form>

            ) : (
              <form onSubmit={handleFinalRegister} className="login-form">
                {/* Phone Number */}
                <div className="login-field-group">
                  <label className="login-field-label">Phone Number *</label>
                  <div className="login-input-wrap">
                    <Phone size={16} className="login-input-icon" />
                    <input
                      type="tel"
                      value={form.phone || ''}
                      onChange={upd('phone')}
                      placeholder="+91 98765 43210"
                      required
                      className="login-input"
                    />
                  </div>
                </div>

                {/* Instagram Handle or URL */}
                <div className="login-field-group">
                  <label className="login-field-label">Instagram Handle or Profile URL *</label>
                  <div className="login-input-wrap">
                    <User size={16} className="login-input-icon" />
                    <input
                      type="text"
                      value={form.handle || form.instagramUrl}
                      onChange={e => {
                        const val = e.target.value;
                        setForm(p => ({
                          ...p,
                          handle: val,
                          instagramUrl: val.includes('instagram.com') ? val : `https://instagram.com/${val.replace('@', '')}`
                        }));
                      }}
                      placeholder="@yourhandle or instagram.com/yourhandle"
                      required
                      className="login-input"
                    />
                  </div>
                  <span style={{ fontSize: 11, color: '#6E6B65', marginTop: 4 }}>
                    Required to verify creator profile and pull engagement statistics.
                  </span>
                </div>

                {/* YouTube Channel URL (Optional) */}
                <div className="login-field-group">
                  <label className="login-field-label">YouTube Channel URL (Optional)</label>
                  <div className="login-input-wrap">
                    <Globe size={16} className="login-input-icon" />
                    <input
                      type="text"
                      value={form.youtubeUrl}
                      onChange={upd('youtubeUrl')}
                      placeholder="youtube.com/@yourchannel"
                      className="login-input"
                    />
                  </div>
                </div>

                {/* Step 2 Buttons Row */}
                <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      padding: '10px 14px',
                      background: '#F4F1E9',
                      border: '1px solid #ECE7DE',
                      borderRadius: 10,
                      fontWeight: 600,
                      fontSize: 13,
                      color: '#4A463F',
                      cursor: 'pointer'
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="login-submit-btn"
                    style={{ flex: 1 }}
                  >
                    <Sparkles size={16} />
                    <span>{loading ? 'Verifying Profile…' : 'Complete Registration 🚀'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* OR Divider */}
            <div className="login-divider">
              <span className="login-divider-line" />
              <span className="login-divider-text">OR</span>
              <span className="login-divider-line" />
            </div>

            {/* Google SSO Button */}
            <button
              onClick={() => {
                const rawApi = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
                const apiBase = !rawApi ? '/api' : rawApi.endsWith('/api') ? rawApi : `${rawApi}/api`;
                window.location.href = `${apiBase}/auth/google`;
              }}
              className="login-google-btn"
            >
              <svg viewBox="0 0 24 24" width="17" height="17" style={{ shrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign up with Google</span>
            </button>

            {/* Already have account */}
            <p className="login-card-footer-text">
              Already have an account?{' '}
              <Link to="/login" className="login-signup-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>



        {/* Terms Modal */}
        {showTerms && <TermsModal onClose={() => setShowTerms(false)} role={form.role} />}

        {/* Background Ambient Glow Circle at Bottom Right */}
        <div className="reg-bg-glow-circle" />
      </div>

      {/* ── STYLES ── */}
      <style>{`
        .login-root-container {
          height: 100vh;
          max-height: 100vh;
          width: 100vw;
          background: #F6F4EF;
          display: flex;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: #1F1C18;
        }

        /* ── LEFT PANEL (DARK THEME) ── */
        .reg-left-panel {
          width: 44%;
          min-width: 420px;
          height: 100vh;
          max-height: 100vh;
          position: relative;
          background-color: #0C0D11;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 36px 48px 36px 44px;
          z-index: 2;
          overflow: hidden;
          box-sizing: border-box;
        }

        .reg-bg-image-wrap {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
          background: #050608;
        }

        .reg-bg-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 60%;
          filter: brightness(0.92) contrast(1.05);
        }

        .reg-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(12, 13, 17, 0.4) 0%, rgba(12, 13, 17, 0.1) 45%, rgba(12, 13, 17, 0.6) 100%);
          pointer-events: none;
        }

        .reg-vector-bg-wrap {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          overflow: hidden;
        }

        .reg-vector-svg {
          width: 100%;
          height: 100%;
        }

        .reg-floating-kite {
          animation: floatKiteReg 6s ease-in-out infinite;
        }

        @keyframes floatKiteReg {
          0%, 100% { transform: translate(190px, 40px) scale(0.62) rotate(-24deg); }
          50% { transform: translate(195px, 28px) scale(0.62) rotate(-21deg); }
        }

        .login-brand-header {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 5;
          cursor: pointer;
          width: fit-content;
        }

        .login-logo-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          overflow: hidden;
          background: #E65F2B;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(230, 95, 43, 0.35);
        }

        .login-logo-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .login-brand-name {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: #FFFFFF;
          letter-spacing: -0.03em;
          line-height: 1;
        }

        .login-brand-italic {
          font-family: 'EB Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 600;
          color: #E65F2B;
          margin-left: 2px;
        }

        .login-hero-copy {
          max-width: 380px;
          margin-top: auto;
          margin-bottom: 75px;
          position: relative;
          z-index: 5;
        }

        .login-sparkle-icon {
          color: #E65F2B;
        }

        .login-hero-heading {
          font-family: 'Inter', sans-serif;
          font-size: clamp(28px, 3.1vw, 40px);
          font-weight: 800;
          line-height: 1.15;
          color: #FFFFFF;
          letter-spacing: -1.2px;
          margin: 0;
        }

        .login-hero-serif {
          font-family: 'EB Garamond', Georgia, serif;
          font-style: italic;
          font-weight: 500;
          color: #E65F2B;
          font-size: 1.1em;
        }

        .reg-title-underline {
          width: 32px;
          height: 3px;
          border-radius: 2px;
          background: #E65F2B;
          margin: 12px 0 14px 0;
        }

        .login-hero-subtext {
          font-size: 13.5px;
          color: rgba(255, 255, 255, 0.68);
          line-height: 1.6;
          margin: 0;
          font-weight: 400;
        }

        .login-left-footer {
          position: relative;
          z-index: 5;
        }

        .login-security-card {
          background: rgba(18, 19, 24, 0.78);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .login-security-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: rgba(230, 95, 43, 0.15);
          border: 1px solid rgba(230, 95, 43, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E65F2B;
          shrink: 0;
        }

        .login-security-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 2px;
        }

        .login-security-desc {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.55);
        }

        .login-curved-svg-divider {
          position: absolute;
          top: 0;
          right: -1px;
          bottom: 0;
          width: 70px;
          pointer-events: none;
          z-index: 10;
        }

        /* ── RIGHT PANEL ── */
        .login-right-panel {
          flex: 1;
          height: 100vh;
          max-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 20px 36px 16px 36px;
          z-index: 2;
          position: relative;
          box-sizing: border-box;
          overflow-x: hidden;
          overflow-y: auto;
        }

        .login-right-panel::-webkit-scrollbar {
          width: 5px;
        }

        .login-right-panel::-webkit-scrollbar-track {
          background: transparent;
        }

        .login-right-panel::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.12);
          border-radius: 4px;
        }

        .login-top-nav {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .login-return-btn {
          background: transparent;
          border: none;
          color: #555047;
          cursor: pointer;
          font-size: 12.5px;
          font-weight: 600;
          font-family: inherit;
          padding: 4px 10px;
          border-radius: 8px;
          transition: all 0.2s;
          opacity: 0.85;
        }

        .login-return-btn:hover {
          opacity: 1;
          color: #E65F2B;
          background: rgba(230, 95, 43, 0.05);
        }

        .login-card-wrapper {
          width: 100%;
          max-width: 420px;
          margin: auto 0;
        }

        .login-card-header {
          text-align: left;
          margin-bottom: 12px;
        }

        .login-mobile-logo {
          display: none;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          cursor: pointer;
        }

        .login-mobile-logo img {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          object-fit: cover;
        }

        .login-mobile-logo .login-brand-name {
          color: #1F1C18;
          font-size: 21px;
        }

        .login-card-title {
          font-family: 'Inter', sans-serif;
          font-size: clamp(28px, 2.8vw, 34px);
          font-weight: 800;
          color: #1F1C18;
          letter-spacing: -0.8px;
          margin: 0 0 2px 0;
        }

        .reg-card-title-line {
          width: 28px;
          height: 3px;
          border-radius: 2px;
          background: #E65F2B;
          margin: 6px 0 8px 0;
        }

        .login-card-subtitle {
          color: #6E6B65;
          font-size: 13.5px;
          margin: 0;
          font-weight: 400;
        }

        .login-white-card {
          background: #FFFFFF;
          border: 1px solid #ECE7DE;
          border-radius: 22px;
          padding: 22px 26px 18px 26px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.03), 0 2px 5px rgba(0, 0, 0, 0.015);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .login-field-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .login-field-label {
          font-size: 12px;
          font-weight: 600;
          color: #38342E;
        }

        .login-field-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .login-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .login-input-icon {
          position: absolute;
          left: 14px;
          color: #9C968B;
          pointer-events: none;
        }

        .login-input {
          width: 100%;
          padding: 10px 14px 10px 40px;
          background: #F8F7F3;
          border: 1px solid #E6E1D7;
          border-radius: 11px;
          color: #1F1C18;
          font-size: 13.5px;
          font-family: inherit;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .login-input-pwd {
          padding-right: 40px;
        }

        .login-input:focus {
          border-color: #E65F2B;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(230, 95, 43, 0.12);
        }

        .login-pwd-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9C968B;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: color 0.2s;
        }

        .login-pwd-toggle:hover {
          color: #1F1C18;
        }

        .reg-terms-box {
          background: #FFF9F5;
          border: 1px solid rgba(230, 95, 43, 0.16);
          border-radius: 11px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          color: #555047;
          line-height: 1.45;
        }

        .reg-terms-link {
          color: #E65F2B;
          cursor: pointer;
          text-decoration: underline;
        }

        .reg-terms-link:hover {
          color: #D14D1A;
        }

        .login-custom-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #E65F2B;
          border-radius: 4px;
          cursor: pointer;
        }

        .reg-terms-link {
          color: #E65F2B;
          cursor: pointer;
          text-decoration: underline;
        }

        .login-submit-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #E65F2B 0%, #D94E1F 100%);
          border: none;
          border-radius: 11px;
          color: #FFFFFF;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          font-family: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 5px 16px rgba(230, 95, 43, 0.28);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          margin-top: 2px;
        }

        .login-submit-btn:hover {
          background: linear-gradient(135deg, #F06A37 0%, #E25425 100%);
          box-shadow: 0 7px 22px rgba(230, 95, 43, 0.38);
          transform: translateY(-1px);
        }

        .login-submit-btn:active {
          transform: translateY(0);
        }

        .login-divider {
          display: flex;
          align-items: center;
          margin: 11px 0;
        }

        .login-divider-line {
          flex: 1;
          height: 1px;
          background: #ECE7DE;
        }

        .login-divider-text {
          padding: 0 12px;
          font-size: 10.5px;
          font-weight: 700;
          color: #A09A8E;
          letter-spacing: 0.1em;
        }

        .login-google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 10.5px;
          border-radius: 11px;
          border: 1px solid #E2DDD3;
          background: #FFFFFF;
          color: #2C2823;
          font-weight: 600;
          font-size: 13.5px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .login-google-btn:hover {
          background: #FDFBF7;
          border-color: #D6CFBF;
        }

        .login-card-footer-text {
          text-align: center;
          font-size: 13px;
          color: #6E6B65;
          margin: 14px 0 0 0;
        }

        .login-signup-link {
          color: #E65F2B;
          font-weight: 700;
          text-decoration: none;
        }

        .login-signup-link:hover {
          text-decoration: underline;
        }

        .reg-bottom-security-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 0;
          padding-top: 6px;
        }

        .reg-sec-icon-wrap {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(230, 95, 43, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          shrink: 0;
        }

        .reg-sec-title {
          font-size: 12px;
          font-weight: 700;
          color: #1F1C18;
        }

        .reg-sec-desc {
          font-size: 11px;
          color: #6E6B65;
        }

        .reg-bg-glow-circle {
          position: absolute;
          bottom: -80px;
          right: -80px;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(230, 95, 43, 0.14) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }

        /* ── RESPONSIVE BREAKPOINTS ── */
        @media (max-width: 900px) {
          .login-root-container {
            height: auto;
            min-height: 100vh;
            max-height: none;
            overflow-y: auto;
          }
          .reg-left-panel {
            display: none !important;
          }
          .login-right-panel {
            height: auto;
            min-height: 100vh;
            max-height: none;
            overflow-y: auto;
            padding: 24px 20px;
            justify-content: center;
          }
          .login-top-nav {
            position: absolute;
            top: 20px;
            right: 20px;
            width: auto;
          }
          .login-mobile-logo {
            display: flex;
          }
          .login-white-card {
            padding: 24px 20px 20px 20px;
            border-radius: 20px;
          }
          .login-card-wrapper {
            margin: 40px auto 20px auto;
          }
          .reg-bottom-security-footer {
            margin-top: 20px;
            padding-top: 0;
          }
        }
      `}</style>
    </div>
  );
}
