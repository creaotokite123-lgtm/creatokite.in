import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Trophy, TrendingUp, Zap, Heart, CheckCircle2, Star,
  Search, RefreshCw, Crown, Users, Filter, ChevronDown, Check
} from 'lucide-react';
import { adminAPI } from '../../api';
import { Avatar, PageLoader, EmptyState } from '../../components/ui';
import toast from 'react-hot-toast';

/* ── Leaderboard types ──────────────────────────────── */
const TYPES = [
  { key:'overall',    label:'Overall',     icon:Crown,      color:'var(--gold)',  desc:'Combined creator score across all metrics' },
  { key:'activity',   label:'Activity',    icon:Zap,        color:'var(--p)',     desc:'Most active creators by XP and logins' },
  { key:'engagement', label:'Engagement',  icon:Heart,      color:'#e11d48',      desc:'Highest engagement rates across platforms' },
  { key:'reliability',label:'Reliability', icon:CheckCircle2,color:'var(--acc2)', desc:'Most dependable creators by delivery rate' },
  { key:'completion', label:'Campaign Completion', icon:Star, color:'var(--gold)', desc:'Highest campaign completion rates' },
  { key:'growth',     label:'Growth',      icon:TrendingUp, color:'#10b981',      desc:'Fastest growing creators this season' },
];

/* ── Rank medal ─────────────────────────────────────── */
function RankBadge({ rank }) {
  if (rank === 1) return (
    <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#FFD700,#FFA500)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, flexShrink:0, boxShadow:'0 2px 8px rgba(255,200,0,0.4)' }}>
      🥇
    </div>
  );
  if (rank === 2) return (
    <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#C0C0C0,#A8A8A8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, flexShrink:0 }}>
      🥈
    </div>
  );
  if (rank === 3) return (
    <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#CD7F32,#A0522D)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, flexShrink:0 }}>
      🥉
    </div>
  );
  return (
    <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'var(--t3)', flexShrink:0 }}>
      {rank}
    </div>
  );
}

/* ── Recommendation badges ──────────────────────────── */
function RecBadges({ creator, type }) {
  const badges = [];
  const ts = creator.trustScore || {};
  const plat = creator.platforms || {};

  if (type === 'overall' && creator.creatorScore >= 800) badges.push({ cls:'rec-badge-top-perf', label:'🏆 Top Performer' });
  if (type === 'activity' || creator.xp >= 5000)         badges.push({ cls:'rec-badge-activity',  label:'⚡ High Activity' });
  if (type === 'engagement' || (plat.instagram?.engagement >= 5)) badges.push({ cls:'rec-badge-top-eng', label:'❤️ Top Engagement' });
  if (type === 'reliability' || (ts.campaignCompletion >= 90)) badges.push({ cls:'rec-badge-reliable', label:`✅ Reliability ${ts.campaignCompletion || 0}%` });
  if (type === 'growth')     badges.push({ cls:'rec-badge-growing',  label:'📈 Fastest Growing' });
  if (creator.rank === 'Diamond' || creator.rank === 'Legend') badges.push({ cls:'rec-badge-ai', label:`💎 ${creator.rank}` });

  return (
    <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:4 }}>
      {badges.slice(0, 3).map((b, i) => (
        <span key={i} className={`rec-badge ${b.cls}`}>{b.label}</span>
      ))}
    </div>
  );
}

/* ── Creator row ────────────────────────────────────── */
function CreatorRow({ creator, rank, type, scoreKey, scoreLabel, color }) {
  const score = creator[scoreKey] ?? creator.creatorScore ?? 0;
  const max   = scoreKey === 'creatorScore' ? 1000 : scoreKey === 'reliabilityScore' ? 100 : scoreKey === 'xp' ? 10000 : 100;
  const pct   = Math.min(100, (score / max) * 100);
  const ts    = creator.trustScore || {};

  return (
    <div
      className="card"
      style={{
        padding:'12px 16px', display:'flex', alignItems:'center', gap:12,
        border: rank <= 3 ? `1px solid ${color}25` : undefined,
        background: rank === 1 ? `${color}06` : undefined,
      }}
    >
      <RankBadge rank={rank} />
      <Avatar src={creator.avatar} name={creator.displayName} size={38} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <span style={{ fontSize:13, fontWeight:700, color:'var(--t1)' }}>{creator.displayName}</span>
          <span style={{ fontSize:10, padding:'2px 7px', borderRadius:99, background:`${color}12`, color, border:`1px solid ${color}25`, fontWeight:600 }}>
            {creator.rank || 'Bronze'}
          </span>
        </div>
        <div style={{ fontSize:11, color:'var(--t3)', marginBottom:4 }}>
          {creator.niche || 'Creator'} · {creator.handle ? `@${creator.handle}` : ''}
        </div>
        <RecBadges creator={creator} type={type} />
        <div style={{ marginTop:6 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
            <span style={{ fontSize:10, color:'var(--t3)' }}>{scoreLabel}</span>
            <span style={{ fontSize:11, fontWeight:700, color, fontFamily:'var(--fd)' }}>{score}</span>
          </div>
          <div style={{ height:4, background:'var(--border)', borderRadius:4, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg, ${color}, ${color}99)`, borderRadius:4, transition:'width 0.6s ease' }}/>
          </div>
        </div>
      </div>
      <div style={{ textAlign:'right', flexShrink:0, minWidth:70 }}>
        {type === 'engagement' && (
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--t1)' }}>
              {((creator.platforms?.instagram?.engagement || creator.platforms?.youtube?.engagement || 0)).toFixed(1)}%
            </div>
            <div style={{ fontSize:10, color:'var(--t3)' }}>Engagement</div>
          </div>
        )}
        {type === 'reliability' && (
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--acc2)' }}>
              {ts.campaignCompletion || 0}%
            </div>
            <div style={{ fontSize:10, color:'var(--t3)' }}>Completion</div>
          </div>
        )}
        {type === 'activity' && (
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'var(--p)' }}>
              {creator.xp || 0}
            </div>
            <div style={{ fontSize:10, color:'var(--t3)' }}>XP</div>
          </div>
        )}
        {(type === 'overall' || type === 'completion' || type === 'growth') && (
          <div>
            <div style={{ fontSize:14, fontWeight:800, color, fontFamily:'var(--fd)' }}>
              {score}
            </div>
            <div style={{ fontSize:10, color:'var(--t3)' }}>
              {type === 'completion' ? 'Campaigns' : type === 'growth' ? 'Season XP' : 'Score'}
            </div>
          </div>
        )}
        <div style={{ fontSize:10, color:'var(--t3)', marginTop:2 }}>
          {creator.totalCampaigns || 0} campaigns
        </div>
      </div>
    </div>
  );
}

/* ── Score key mapping ──────────────────────────────── */
const SCORE_MAP = {
  overall:    { key:'creatorScore',      label:'Creator Score (0–1000)' },
  activity:   { key:'xp',               label:'Total XP Earned'        },
  engagement: { key:'engagementScore',   label:'Engagement Rate %'      },
  reliability:{ key:'reliabilityScore',  label:'Reliability Score'      },
  completion: { key:'completedCampaigns',label:'Campaigns Completed'    },
  growth:     { key:'seasonXP',          label:'Season XP'              },
};

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════ */
export default function AdminLeaderboard() {
  const [activeType, setActiveType] = useState('overall');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [creators,   setCreators]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [page,       setPage]       = useState(1);
  const [total,      setTotal]      = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeTypeMeta  = TYPES.find(t => t.key === activeType);
  const { key: scoreKey, label: scoreLabel } = SCORE_MAP[activeType];

  const load = useCallback(async (pg = 1, q = '') => {
    setLoading(true);
    try {
      const d = await adminAPI.leaderboard({ type: activeType, page: pg, limit: 20, search: q || undefined });
      setCreators(d.creators || []);
      setTotal(d.total || 0);
    } catch(e) {
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [activeType]);

  useEffect(() => {
    setPage(1);
    setSearch('');
    load(1, '');
  }, [activeType, load]);

  useEffect(() => {
    if (!search) return;
    const t = setTimeout(() => { setPage(1); load(1, search); }, 350);
    return () => clearTimeout(t);
  }, [search, load]);

  const Icon = activeTypeMeta?.icon || Trophy;
  const color = activeTypeMeta?.color || 'var(--gold)';

  return (
    <div className="page-enter">
      <div className="page-header">
        <div>
          <h1 style={{ fontFamily:'var(--fd)', fontSize:'clamp(18px,4vw,24px)', fontWeight:800, display:'flex', alignItems:'center', gap:10 }}>
            <Trophy size={22} style={{ color:'var(--gold)' }}/>
            Creator Leaderboards
          </h1>
          <p style={{ color:'var(--t2)', fontSize:13, marginTop:4 }}>
            Rank creators by performance, engagement, and reliability
          </p>
        </div>
      </div>

      {/* ── Type filter dropdown ─────────────────────── */}
      <div style={{ marginBottom: 18 }}>
        <div ref={dropdownRef} style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
          <button
            type="button"
            onClick={() => setDropdownOpen(o => !o)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              width: '100%',
              padding: '9px 14px',
              borderRadius: 12,
              background: 'var(--s1, #161822)',
              border: dropdownOpen ? `1.5px solid ${color}` : '1px solid var(--border)',
              color: 'var(--t1)',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: dropdownOpen ? `0 0 0 3px ${color}20` : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: `${color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color
              }}>
                <Icon size={15} />
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 750 }}>{activeTypeMeta?.label}</span>
            </div>
            <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--t3)' }} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                zIndex: 100,
                width: '100%',
                minWidth: 280,
                maxHeight: 360,
                overflowY: 'auto',
                background: 'var(--s1, #161822)',
                border: '1px solid var(--border, rgba(255,255,255,0.12))',
                borderRadius: 14,
                boxShadow: '0 16px 36px rgba(0,0,0,0.45)',
                padding: 6,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                animation: 'fadeIn 0.15s ease-out'
              }}
            >
              <div style={{ padding: '6px 10px', fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid var(--border)' }}>
                Leaderboard Category
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 }}>
                {TYPES.map(t => {
                  const isSelected = activeType === t.key;
                  const TIcon = t.icon;
                  return (
                    <div
                      key={t.key}
                      onClick={() => {
                        setActiveType(t.key);
                        setDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: 10,
                        cursor: 'pointer',
                        background: isSelected ? `${t.color}15` : 'transparent',
                        color: isSelected ? 'var(--t1)' : 'var(--t2)',
                        border: isSelected ? `1px solid ${t.color}35` : '1px solid transparent',
                        transition: 'background 0.12s'
                      }}
                      onMouseEnter={e => !isSelected && (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={e => !isSelected && (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 26,
                          height: 26,
                          borderRadius: 7,
                          background: isSelected ? `${t.color}25` : 'rgba(255,255,255,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isSelected ? t.color : 'var(--t3)',
                          flexShrink: 0
                        }}>
                          <TIcon size={14} />
                        </div>
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: isSelected ? 800 : 600, color: isSelected ? t.color : 'var(--t1)' }}>
                            {t.label}
                          </div>
                          <div style={{ fontSize: 10.5, color: 'var(--t3)', lineHeight: 1.2, marginTop: 1 }}>
                            {t.desc}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <span style={{ color: t.color, fontWeight: 900, fontSize: 13 }}>✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Active type description ──────────────────── */}
      <div
        className="card"
        style={{
          padding:'12px 16px', marginBottom:20,
          background:`${color}08`, border:`1px solid ${color}22`,
          display:'flex', alignItems:'center', gap:12,
        }}
      >
        <div style={{ width:36, height:36, borderRadius:'var(--r)', background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon size={18} style={{ color }}/>
        </div>
        <div>
          <div style={{ fontWeight:700, fontSize:13, color:'var(--t1)' }}>
            {activeTypeMeta?.label} Leaderboard
          </div>
          <div style={{ fontSize:12, color:'var(--t2)', marginTop:1 }}>
            {activeTypeMeta?.desc} · {total} creators ranked
          </div>
        </div>
      </div>

      {/* ── Search ──────────────────────────────────── */}
      <div style={{ position:'relative', marginBottom:16, maxWidth:360 }}>
        <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--t3)' }}/>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search creators…"
          className="form-input"
          style={{ paddingLeft:30, height:36, fontSize:12 }}
        />
      </div>

      {/* ── Leaderboard list ─────────────────────────── */}
      {loading
        ? <PageLoader/>
        : creators.length === 0
          ? <EmptyState icon="🏆" title="No creators found" desc="Creators will appear here once they have scores"/>
          : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {creators.map((c, idx) => (
                <CreatorRow
                  key={c._id}
                  creator={c}
                  rank={(page - 1) * 20 + idx + 1}
                  type={activeType}
                  scoreKey={scoreKey}
                  scoreLabel={scoreLabel}
                  color={color}
                />
              ))}

              {total > 20 && (
                <div style={{ display:'flex', gap:8, justifyContent:'center', padding:'8px 0' }}>
                  <button
                    onClick={() => { const p = Math.max(1, page - 1); setPage(p); load(p, search); }}
                    disabled={page === 1}
                    className="btn btn-secondary btn-sm"
                  >← Prev</button>
                  <span style={{ padding:'6px 12px', fontSize:12, color:'var(--t2)' }}>
                    {page} / {Math.ceil(total / 20)}
                  </span>
                  <button
                    onClick={() => { const p = page + 1; setPage(p); load(p, search); }}
                    disabled={creators.length < 20}
                    className="btn btn-secondary btn-sm"
                  >Next →</button>
                </div>
              )}
            </div>
          )
      }
    </div>
  );
}
