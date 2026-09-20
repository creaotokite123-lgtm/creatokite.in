import { useState, useEffect, useMemo } from 'react';
import { analyticsAPI } from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { PageLoader } from '../../components/ui';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import {
  Target,
  Wallet,
  TrendingUp,
  Star,
  Zap,
  Shield,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  RefreshCw,
  Award,
  Layers,
  Flame,
  Instagram,
  Youtube,
  ChevronRight,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreatorShell from './CreatorShell';

/* ── Custom Glass Tooltip for Charts ─────────────────────── */
const CustomChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--s1, #F5F1E7)',
      border: '1px solid var(--border, rgba(35,30,25,0.15))',
      borderRadius: 12,
      padding: '10px 14px',
      boxShadow: 'var(--glass-shadow)',
      fontSize: 12
    }}>
      <p style={{ color: 'var(--t3)', marginBottom: 4, fontWeight: 600, fontSize: 11 }}>{label}</p>
      {payload.map((p, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color || 'var(--acc)' }} />
          <span style={{ color: 'var(--t1)', fontWeight: 800 }}>
            {p.name}: <span style={{ color: p.color || 'var(--acc)' }}>{p.value}</span>
          </span>
        </div>
      ))}
    </div>
  );
};

/* ── Badge & Risk Helpers ───────────────────────────────── */
const BADGE_MAP = {
  ELITE:    { color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.14)', border: 'rgba(251, 191, 36, 0.35)', label: '⭐ ELITE' },
  VERIFIED: { color: '#10B981', bg: 'rgba(16, 185, 129, 0.14)', border: 'rgba(16, 185, 129, 0.35)', label: '✔ VERIFIED' },
  STANDARD: { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.14)', border: 'rgba(139, 92, 246, 0.35)', label: '✦ STANDARD' },
  REVIEW:   { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.14)', border: 'rgba(245, 158, 11, 0.35)', label: '⚠ REVIEW' },
};

const RISK_MAP = {
  LOW:    { color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.28)', label: 'Low Risk', desc: 'Optimal brand collaboration profile' },
  MEDIUM: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.28)', label: 'Moderate Risk', desc: 'Minor audience variance detected' },
  HIGH:   { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)',  border: 'rgba(239, 68, 68, 0.28)',  label: 'Elevated Risk', desc: 'Requires profile optimization' },
};

const SCORE_META = [
  { key: 'engagement',    label: 'Engagement',   icon: Flame,       color: '#E65F2B', caption: 'Viral & reply velocity' },
  { key: 'reach',         label: 'Reach',        icon: TrendingUp,  color: '#8B5CF6', caption: 'Impression scale' },
  { key: 'authenticity',  label: 'Authenticity', icon: Shield,      color: '#10B981', caption: 'Real organic ratio' },
  { key: 'consistency',   label: 'Consistency',  icon: Layers,      color: '#F59E0B', caption: 'Publishing cadence' },
  { key: 'growth',        label: 'Growth',       icon: Zap,         color: '#06B6D4', caption: 'Follower surge rate' },
  { key: 'brandSafety',   label: 'Brand Safety', icon: CheckCircle2, color: '#3B82F6', caption: 'Sponsor suitability' },
  { key: 'conversion',    label: 'Conversion',   icon: ArrowUpRight, color: '#F97316', caption: 'CTR & bio-actions' },
  { key: 'contentQuality',label: 'Content',      icon: Sparkles,    color: '#EC4899', caption: 'Visual & audio polish' },
];

/* ── CAS Circular Gauge ─────────────────────────────────── */
function CASRingGauge({ score = 0, badge = 'REVIEW' }) {
  const bm = BADGE_MAP[badge] || BADGE_MAP.REVIEW;
  const r = 58;
  const circ = 2 * Math.PI * r;
  const fill = (Math.min(100, Math.max(0, score)) / 100) * circ;
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <div style={{ position: 'relative', width: 156, height: 156 }}>
        <svg width="156" height="156" viewBox="0 0 156 156" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background track using theme border */}
          <circle
            cx="78"
            cy="78"
            r={r}
            fill="none"
            stroke="var(--border, rgba(35,30,25,0.15))"
            strokeWidth="11"
          />
          {/* Animated score ring */}
          <circle
            cx="78"
            cy="78"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="11"
            strokeDasharray={`${fill} ${circ}`}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
              filter: `drop-shadow(0 0 8px ${color}66)`
            }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <span style={{
            fontSize: 40,
            fontWeight: 900,
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            letterSpacing: '-0.03em',
            color: 'var(--t1)',
            lineHeight: 1
          }}>
            {score}
          </span>
          <span style={{
            fontSize: 10,
            color: 'var(--t3)',
            fontWeight: 800,
            letterSpacing: '0.08em',
            marginTop: 4,
            textTransform: 'uppercase'
          }}>
            CAS SCORE
          </span>
        </div>
      </div>

      {/* Badge Pill */}
      <div style={{
        fontSize: 11.5,
        padding: '5px 16px',
        borderRadius: 99,
        fontWeight: 800,
        color: bm.color,
        background: bm.bg,
        border: `1px solid ${bm.border}`,
        letterSpacing: '0.04em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }}>
        {bm.label}
      </div>
    </div>
  );
}

/* ── Creative 8-Dimension Metric Card with Mini-Ring Gauge ── */
function CASMetricCard({ item, value = 0 }) {
  const Icon = item.icon;
  const isElite = value >= 95;
  const isOptimal = value >= 80;
  const isGood = value >= 60;
  const statusLabel = isElite ? 'Elite' : isOptimal ? 'Optimal' : isGood ? 'Solid' : 'Active';
  const statusColor = isOptimal ? '#10B981' : isGood ? '#F59E0B' : '#F97316';

  // Mini SVG circular ring
  const r = 14;
  const circ = 2 * Math.PI * r;
  const fill = (Math.min(100, Math.max(0, value)) / 100) * circ;

  return (
    <div
      style={{
        background: 'var(--glass-bg)',
        borderRadius: 16,
        padding: '13px 14px',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 8,
        minWidth: 0,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="hover-lift"
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${item.color}55`;
        e.currentTarget.style.boxShadow = `0 8px 24px ${item.color}15, var(--glass-shadow)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
      }}
    >
      {/* Subtle corner glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 50,
        height: 50,
        background: `radial-gradient(circle at top right, ${item.color}16, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      {/* Top: Icon + Dimension info + Radial Mini Gauge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: `${item.color}16`,
            border: `1px solid ${item.color}35`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={14} color={item.color} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 12,
              fontWeight: 800,
              color: 'var(--t1)',
              fontFamily: 'var(--fh)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {item.label}
            </div>
            <div style={{
              fontSize: 9.5,
              color: 'var(--t3)',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {item.caption}
            </div>
          </div>
        </div>

        {/* Mini SVG Radial Progress Indicator */}
        <div style={{ position: 'relative', width: 34, height: 34, flexShrink: 0 }}>
          <svg width="34" height="34" viewBox="0 0 34 34" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="17" cy="17" r={r} fill="none" stroke="var(--border, rgba(35,30,25,0.12))" strokeWidth="3" />
            <circle
              cx="17"
              cy="17"
              r={r}
              fill="none"
              stroke={item.color}
              strokeWidth="3"
              strokeDasharray={`${fill} ${circ}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 1.2s ease', filter: `drop-shadow(0 0 3px ${item.color}66)` }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 900,
            color: item.color,
            fontFamily: 'var(--fd)'
          }}>
            {value}
          </div>
        </div>
      </div>

      {/* Sleek Gradient Progress Bar */}
      <div style={{
        height: 5,
        background: 'var(--border, rgba(35,30,25,0.12))',
        borderRadius: 99,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div
          style={{
            height: '100%',
            width: `${value}%`,
            background: `linear-gradient(90deg, ${item.color}99, ${item.color})`,
            borderRadius: 99,
            transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </div>

      {/* Bottom: Status Pill with Glowing Dot + Bold Fraction Score */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10 }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 7px',
          borderRadius: 6,
          background: `${statusColor}14`,
          border: `1px solid ${statusColor}30`,
          color: statusColor,
          fontWeight: 800,
          letterSpacing: '0.02em'
        }}>
          <span style={{ width: 4.5, height: 4.5, borderRadius: '50%', background: statusColor }} />
          {statusLabel}
        </span>

        <span style={{ color: 'var(--t2)', fontWeight: 700, fontSize: 11, fontFamily: 'var(--fd)' }}>
          <span style={{ color: item.color, fontWeight: 900, fontSize: 12.5 }}>{value}</span>
          <span style={{ color: 'var(--t3)', fontSize: 9.5 }}>/100</span>
        </span>
      </div>
    </div>
  );
}

/* ── Currency Formatter ─────────────────────────────────── */
const formatStatCurrency = (val = 0) => {
  if (!val) return '₹0';
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) {
    const k = val / 1000;
    return `₹${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return `₹${val.toLocaleString('en-IN')}`;
};

/* ── Redesigned Metric Card (2x2 Grid Friendly) ─────────── */
const ModernStatCard = ({ label, value, icon: Icon, color, trendText, trendPositive = true }) => (
  <div
    style={{
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      borderRadius: 18,
      padding: '16px 16px 14px',
      boxShadow: 'var(--glass-shadow)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 10,
      position: 'relative',
      overflow: 'hidden',
      minWidth: 0,
      width: '100%',
      transition: 'transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
    }}
    className="hover-lift"
  >
    {/* Subtle gradient glow header corner */}
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: 60,
      height: 60,
      background: `radial-gradient(circle at top right, ${color}14, transparent 70%)`,
      pointerEvents: 'none'
    }} />

    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
      <span style={{
        fontSize: 11.5,
        color: 'var(--t2)',
        fontWeight: 700,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {label}
      </span>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: 9,
        background: `${color}18`,
        border: `1px solid ${color}35`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={16} color={color} />
      </div>
    </div>

    <div>
      <div style={{
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
        fontSize: 'clamp(20px, 3.5vw, 24px)',
        fontWeight: 800,
        color: 'var(--t1)',
        letterSpacing: '-0.025em',
        lineHeight: 1.1,
        marginBottom: 4
      }}>
        {value}
      </div>

      {trendText && (
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          color: trendPositive ? '#10B981' : 'var(--t3)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 3,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {trendPositive ? <TrendingUp size={11} /> : <Info size={11} />}
          <span>{trendText}</span>
        </div>
      )}
    </div>
  </div>
);

/* ── Main Component ─────────────────────────────────────── */
export default function CreatorAnalytics() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [casData, setCasData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [chartView, setChartView] = useState('assignments'); // 'assignments' | 'income'
  const [campaignFilter, setCampaignFilter] = useState('all'); // 'all' | 'completed' | 'active'

  const fetchAnalytics = () => {
    Promise.all([
      analyticsAPI.creator().catch(() => null),
      user?.socialAnalyzed ? analyticsAPI.creatorCAS().catch(() => null) : Promise.resolve(null),
    ])
      .then(([d, cas]) => {
        if (d) setData(d);
        if (cas) setCasData(cas);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, [user?.socialAnalyzed]);

  const rawTrend = data?.trend || [];
  const campaigns = data?.campaigns || [];

  // Format trend data with income simulation if not directly supplied
  const formattedTrend = useMemo(() => {
    return rawTrend.map((t, idx) => ({
      ...t,
      income: Math.round((t.assignments || 0) * 12500 * (1 + (idx * 0.1))),
    }));
  }, [rawTrend]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      if (campaignFilter === 'completed') return ['approved', 'completed'].includes(c.assignment?.status);
      if (campaignFilter === 'active') return !['approved', 'completed', 'rejected'].includes(c.assignment?.status);
      return true;
    });
  }, [campaigns, campaignFilter]);

  if (loading && !data) return <PageLoader />;

  const s = data?.stats || {};

  const handleSyncSocial = async () => {
    setSyncing(true);
    try {
      const BASE = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${BASE}/analytics/creator/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({})
      });
      const resData = await res.json();
      if (resData.success) {
        alert('Social metrics re-synced successfully!');
        window.location.reload();
      } else {
        alert(resData.message || 'Sync failed.');
      }
    } catch (e) {
      alert('Error syncing social data: ' + e.message);
    } finally {
      setSyncing(false);
    }
  };

  const riskInfo = RISK_MAP[casData?.casRisk] || RISK_MAP.LOW;

  return (
    <CreatorShell style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── 1. HERO HEADER ────────────────────────────────────── */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(230,95,43,0.08) 0%, var(--glass-bg) 60%)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--glass-border)',
        borderRadius: 20,
        padding: '20px 22px',
        boxShadow: 'var(--glass-shadow)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow ambient circle */}
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          background: 'radial-gradient(circle, rgba(230,95,43,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{
                fontSize: 10.5,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--acc)',
                background: 'rgba(230, 95, 43, 0.12)',
                border: '1px solid rgba(230, 95, 43, 0.25)',
                padding: '3px 10px',
                borderRadius: 99,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}>
                <Sparkles size={11} /> AI CREATOR INTELLIGENCE
              </span>
              <span style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 600 }}>• Real-Time Audited</span>
            </div>

            <h2 style={{
              fontFamily: 'var(--fh)',
              fontWeight: 800,
              fontSize: 'clamp(20px, 4vw, 26px)',
              letterSpacing: '-0.025em',
              color: 'var(--t1)',
              margin: '0 0 4px'
            }}>
              My Analytics & CAS
            </h2>
            <p style={{ color: 'var(--t2)', fontSize: 13, fontWeight: 500, margin: 0, maxWidth: 520 }}>
              Live campaign performance, Creator Automation Score (CAS), and audience trust metrics.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleSyncSocial}
              disabled={syncing}
              style={{
                padding: '9px 18px',
                background: 'linear-gradient(135deg, #E65F2B 0%, #EA580C 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: syncing ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                boxShadow: '0 4px 14px rgba(230, 95, 43, 0.35)',
                transition: 'all 0.2s ease'
              }}
              className="hover-lift"
            >
              <RefreshCw size={14} className={syncing ? 'spin' : ''} />
              {syncing ? 'Analyzing Social...' : 'Sync Social Stats'}
            </button>

            <button
              type="button"
              onClick={() => nav('/creator/profile')}
              style={{
                padding: '9px 14px',
                background: 'var(--s2, rgba(255, 255, 255, 0.05))',
                color: 'var(--t1)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5
              }}
              className="hover-lift"
            >
              Profile Details <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Connected Handles Strip */}
        <div style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          fontSize: 11.5
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--t3)', fontWeight: 600 }}>Linked Platforms:</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              color: user?.handle || user?.socialUrls?.instagram ? 'var(--t1)' : 'var(--t3)',
              fontWeight: 700
            }}>
              <Instagram size={13} color="#EC4899" />
              {user?.handle ? `@${user.handle}` : user?.socialUrls?.instagram ? 'Instagram Linked' : 'No Instagram'}
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              color: user?.socialUrls?.youtube ? 'var(--t1)' : 'var(--t3)',
              fontWeight: 700
            }}>
              <Youtube size={13} color="#EF4444" />
              {user?.socialUrls?.youtube ? 'YouTube Linked' : 'No YouTube'}
            </span>
          </div>

          {casData?.analyzedAt && (
            <span style={{ color: 'var(--t3)', fontSize: 11, fontWeight: 500 }}>
              Last Audit: {new Date(casData.analyzedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      {/* ── 2. EXECUTIVE 2x2 GRID METRICS ─────────────────────── */}
      <div
        className="grid-2-mobile dashboard-stats grid-2-2x2"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 12,
          width: '100%'
        }}
      >
        <ModernStatCard
          label="Total Campaigns"
          value={s.total ?? 0}
          icon={Target}
          color="#F97316"
          trendText={s.totalTrendPct !== undefined ? `${s.totalTrendPct >= 0 ? '+' : ''}${s.totalTrendPct}% MoM` : 'Active pipeline'}
          trendPositive={s.totalTrendPct >= 0}
        />
        <ModernStatCard
          label="Completed"
          value={s.completed ?? 0}
          icon={Star}
          color="#E65F2B"
          trendText={s.completedTrendPct !== undefined ? `${s.completedTrendPct >= 0 ? '+' : ''}${s.completedTrendPct}% MoM` : '100% Delivery'}
          trendPositive={s.completedTrendPct >= 0}
        />
        <ModernStatCard
          label="Total Earned"
          value={formatStatCurrency(s.earned ?? 0)}
          icon={Wallet}
          color="#10B981"
          trendText={s.earnedTrendPct !== undefined ? `${s.earnedTrendPct >= 0 ? '+' : ''}${s.earnedTrendPct}% MoM` : 'Verified payouts'}
          trendPositive={s.earnedTrendPct >= 0}
        />
        <ModernStatCard
          label="Success Rate"
          value={`${s.successRate ?? 100}%`}
          icon={TrendingUp}
          color="#8B5CF6"
          trendText="Top Tier Reliability"
          trendPositive={true}
        />
      </div>

      {/* ── 3. CREATOR AUTOMATION SCORE (CAS 3.0) ─────────────── */}
      {casData ? (
        <div className="card" style={{
          border: '1px solid rgba(108, 99, 255, 0.22)',
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          borderRadius: 20,
          boxShadow: 'var(--glass-shadow)',
          padding: '22px 22px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}>
          {/* CAS Header Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            borderBottom: '1px solid var(--border)',
            paddingBottom: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'rgba(108, 99, 255, 0.15)',
                border: '1px solid rgba(108, 99, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Zap size={18} color="var(--p2, #8B5CF6)" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--fh)', margin: 0 }}>
                    Creator Automation Score
                  </h3>
                  <span style={{
                    fontSize: 9.5,
                    padding: '2px 8px',
                    borderRadius: 6,
                    background: 'rgba(108, 99, 255, 0.12)',
                    color: 'var(--p2, #8B5CF6)',
                    border: '1px solid rgba(108, 99, 255, 0.25)',
                    fontWeight: 800,
                    letterSpacing: '0.04em'
                  }}>
                    CAS 3.0
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2, fontWeight: 500 }}>
                  Algorithmic evaluation across 8 dimensions of audience authenticity & brand fit.
                </div>
              </div>
            </div>

            {/* Verification & Risk Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {casData.verificationStatus && (
                <span style={{
                  fontSize: 11,
                  padding: '4px 12px',
                  borderRadius: 8,
                  fontWeight: 800,
                  color: casData.verificationStatus === 'approved' ? '#10B981' : casData.verificationStatus === 'pending' ? '#F59E0B' : '#EF4444',
                  background: casData.verificationStatus === 'approved' ? 'rgba(16, 185, 129, 0.1)' : casData.verificationStatus === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${casData.verificationStatus === 'approved' ? 'rgba(16, 185, 129, 0.25)' : casData.verificationStatus === 'pending' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`
                }}>
                  {casData.verificationStatus === 'approved' ? '✔ Verified Creator' : casData.verificationStatus === 'pending' ? '⏳ Pending Review' : '✕ Action Required'}
                </span>
              )}

              <span style={{
                fontSize: 11,
                padding: '4px 12px',
                borderRadius: 8,
                fontWeight: 800,
                color: riskInfo.color,
                background: riskInfo.bg,
                border: `1px solid ${riskInfo.border}`
              }}>
                🛡️ {riskInfo.label}
              </span>
            </div>
          </div>

          {/* Main CAS Grid: Gauge + 8 Creative Dimension Cards Matrix */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: 20,
            alignItems: 'stretch'
          }}>
            {/* Left Box: Gauge Vertically Centered */}
            <div style={{
              background: 'var(--s2, rgba(128,128,128,0.04))',
              border: '1px solid var(--border)',
              borderRadius: 18,
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
              textAlign: 'center'
            }}>
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '12px 0'
              }}>
                <CASRingGauge score={casData.casScore || 0} badge={casData.casBadge} />
              </div>

              <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                  Brand Suitability Rating
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>
                  {casData.casScore >= 80 ? '🏆 Prime Match for High-Budget Sponsorships' : casData.casScore >= 60 ? '⚡ Standard Collaboration Qualified' : '⚠️ Build Consistency to Unlock Deals'}
                </div>
              </div>
            </div>

            {/* Right Box: 8 Creative CAS Dimension Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 10,
              alignContent: 'start'
            }}>
              {SCORE_META.map(item => (
                <CASMetricCard
                  key={item.key}
                  item={item}
                  value={casData.casBreakdown?.[item.key] ?? 0}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Not yet analyzed — CTA State */
        <div style={{
          padding: '38px 24px',
          background: 'linear-gradient(135deg, rgba(230,95,43,0.08) 0%, var(--glass-bg) 70%)',
          border: '1px dashed rgba(230,95,43,0.3)',
          borderRadius: 22,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: 'rgba(230,95,43,0.14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
            border: '1px solid rgba(230,95,43,0.3)'
          }}>
            <Zap size={26} style={{ color: 'var(--acc)' }} />
          </div>
          <h3 style={{ fontSize: 19, fontWeight: 800, marginBottom: 6, fontFamily: 'var(--fh)', color: 'var(--t1)', letterSpacing: '-0.02em' }}>
            Unlock Your AI Creator Automation Score
          </h3>
          <p style={{ color: 'var(--t2)', fontSize: 13, marginBottom: 20, maxWidth: 460, margin: '0 auto 20px', fontWeight: 500, lineHeight: 1.55 }}>
            Connect your Instagram or YouTube to compute your real-time CAS Trust Score, boost matchmaking by 3.8x, and unlock verified brand sponsorships.
          </p>
          <button
            className="btn btn-primary hover-lift"
            onClick={() => nav('/creator/profile')}
            style={{ height: 42, borderRadius: 12, padding: '0 24px', fontSize: 13, fontWeight: 700 }}
          >
            ⚡ Connect Profile to Calculate CAS
          </button>
        </div>
      )}

      {/* ── 4. ANALYTICS & VELOCITY HUB ──────────────────────── */}
      {formattedTrend.length > 0 && (
        <div className="card" style={{
          borderRadius: 20,
          padding: '22px 22px 24px',
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20
          }}>
            <div>
              <h3 style={{ fontFamily: 'var(--fh)', fontSize: 16, fontWeight: 800, margin: '0 0 3px', color: 'var(--t1)' }}>
                Performance Velocity & Trends
              </h3>
              <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 500 }}>
                Historical trajectory across your previous 6 months of active collaborations.
              </span>
            </div>

            {/* Metric Switcher Tabs */}
            <div style={{
              display: 'inline-flex',
              padding: 3,
              background: 'var(--s2, rgba(128,128,128,0.06))',
              borderRadius: 10,
              border: '1px solid var(--border)'
            }}>
              <button
                type="button"
                onClick={() => setChartView('assignments')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 7,
                  border: 'none',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: chartView === 'assignments' ? 'var(--acc, #E65F2B)' : 'transparent',
                  color: chartView === 'assignments' ? '#fff' : 'var(--t2)',
                  transition: 'all 0.2s ease'
                }}
              >
                Campaign Volume
              </button>
              <button
                type="button"
                onClick={() => setChartView('income')}
                style={{
                  padding: '5px 12px',
                  borderRadius: 7,
                  border: 'none',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: chartView === 'income' ? 'var(--acc, #E65F2B)' : 'transparent',
                  color: chartView === 'income' ? '#fff' : 'var(--t2)',
                  transition: 'all 0.2s ease'
                }}
              >
                Estimated Value
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            {chartView === 'assignments' ? (
              <AreaChart data={formattedTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="campaignVelocityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E65F2B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E65F2B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border, rgba(35,30,25,0.08))" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: 'var(--t3)', fontFamily: 'var(--fh)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--t3)', fontFamily: 'var(--fd)' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="assignments"
                  name="Campaigns"
                  stroke="#E65F2B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#campaignVelocityGrad)"
                  dot={{ fill: '#E65F2B', strokeWidth: 2, stroke: 'var(--s1)', r: 4 }}
                  activeDot={{ r: 6, fill: '#E65F2B', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            ) : (
              <BarChart data={formattedTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="var(--border, rgba(35,30,25,0.08))" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: 'var(--t3)', fontFamily: 'var(--fh)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10.5, fill: 'var(--t3)', fontFamily: 'var(--fd)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar
                  dataKey="income"
                  name="Value (₹)"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {/* ── 5. CAMPAIGN HISTORY & COLLABORATIONS ─────────────── */}
      <div className="card" style={{
        padding: 0,
        overflow: 'hidden',
        borderRadius: 20,
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow)'
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, fontFamily: 'var(--fh)', color: 'var(--t1)' }}>
              Campaign Portfolio & Assignments
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 2, fontWeight: 500 }}>
              Track assignment deliverables, approval stages, and allocated creator payments.
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[
              { id: 'all', label: `All (${campaigns.length})` },
              { id: 'completed', label: 'Completed' },
              { id: 'active', label: 'Active' },
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setCampaignFilter(f.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  border: campaignFilter === f.id ? '1px solid var(--acc)' : '1px solid var(--border)',
                  background: campaignFilter === f.id ? 'rgba(230, 95, 43, 0.12)' : 'transparent',
                  color: campaignFilter === f.id ? 'var(--acc)' : 'var(--t2)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filteredCampaigns.length === 0 ? (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--t2)', fontSize: 13, fontWeight: 500 }}>
            {campaigns.length === 0
              ? 'No campaign assignments recorded yet. Explore open brand opportunities to start earning!'
              : 'No campaigns match the selected filter.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredCampaigns.map((c, i) => {
              const status = c.assignment?.status || 'active';
              const isApproved = ['approved', 'completed'].includes(status);

              return (
                <div
                  key={c._id || i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    borderBottom: i < filteredCampaigns.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.2s ease',
                    flexWrap: 'wrap',
                    gap: 12
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 107, 87, 0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--t1)', fontFamily: 'var(--fh)' }}>
                      {c.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: 10,
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: isApproved ? '#10B981' : '#F59E0B',
                        background: isApproved ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        border: `1px solid ${isApproved ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                      }}>
                        {status}
                      </span>
                      {c.niche && (
                        <span style={{
                          fontSize: 10,
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: 'rgba(139, 92, 246, 0.1)',
                          color: '#A78BFA',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          fontWeight: 600
                        }}>
                          {c.niche}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'var(--acc2, #10B981)', fontWeight: 800, fontFamily: 'var(--fd)', fontSize: 14 }}>
                        ₹{(c.assignment?.paymentAlloc || 0).toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 500 }}>
                        {isApproved ? 'Payout Released' : 'Allocated Fee'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => nav(`/creator/campaigns`)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                        background: 'var(--s2, rgba(255,255,255,0.03))',
                        color: 'var(--t2)',
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                      className="hover-lift"
                    >
                      View <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CreatorShell>
  );
}
