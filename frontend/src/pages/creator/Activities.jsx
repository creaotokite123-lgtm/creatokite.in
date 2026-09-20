import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ecosystemAPI } from '../../api';
import { PageLoader, Btn, StatusBadge, Input, Textarea, renderTextWithLinks, getFriendlyLinkInfo } from '../../components/ui';
import toast from 'react-hot-toast';
import { Target, Award, Play, AlertCircle, Calendar, LayoutGrid, RefreshCw, Trophy, ChevronDown, Check, Lightbulb } from 'lucide-react';
import CreatorShell from './CreatorShell';

const ACTIVITY_TABS = [
  { key: 'daily', label: 'Daily Activities', Icon: LayoutGrid, emoji: null, desc: 'Quick daily missions, check-ins, and quizzes' },
  { key: 'weekly', label: 'Weekly Tasks', Icon: RefreshCw, emoji: null, desc: 'Weekly milestones and continuous creator progress' },
  { key: 'monthly', label: 'Monthly Championships', Icon: Trophy, emoji: null, desc: 'Major competitions with high XP and prize pools' },
  { key: 'challenges', label: 'Special Challenges', Icon: null, emoji: '🔥', desc: 'Limited-time sponsored events and bonus challenges' },
];

function decodeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function parseDescriptionToBullets(rawText, targetUrl) {
  if (!rawText && !targetUrl) return { intro: '', bullets: [], links: [] };
  let text = decodeHTML(rawText || '');

  // Extract all URLs from text and targetUrl without destroying the original text
  const urlRegex = /(https?:\/\/[^\s<]+|mailto:[^\s<]+)/gi;
  const linksSet = new Set();

  if (targetUrl && typeof targetUrl === 'string' && targetUrl.trim()) {
    linksSet.add(targetUrl.trim());
  }

  const matches = text.match(urlRegex) || [];
  matches.forEach(m => {
    const cleanUrl = m.replace(/[.,;!?)]+$/, '').trim();
    if (cleanUrl) linksSet.add(cleanUrl);
  });

  const links = Array.from(linksSet);

  text = text.trim();

  // Split into segments by newlines or emoji bullet indicators
  let segments = text.split(/(?:\r?\n|(?=[✨🚀🎁💛🌟🔗⌛🎯⚡👇👉▪✔•\-\*\d+\.]\s))/g)
    .map(s => s.trim())
    .filter(Boolean);

  if (segments.length <= 1) {
    const block = segments[0] || text;
    segments = block.split(/(?<=[.!?—])\s+|(?=[✨🚀🎁💛🌟🔗⌛🎯⚡👇👉])/g)
      .map(s => s.trim())
      .filter(Boolean);
  }

  let intro = '';
  const bullets = [];

  segments.forEach((seg, i) => {
    let cleaned = seg.replace(/^[•\-\*\d\.\s\t]+/, '').trim();
    if (!cleaned) return;

    if (i === 0 && !seg.match(/^[✨🚀🎁💛🌟🔗⌛🎯⚡👇👉•\-]/) && cleaned.length > 15 && segments.length > 1) {
      intro = cleaned;
    } else {
      bullets.push(cleaned);
    }
  });

  if (!intro && bullets.length > 0 && bullets.length <= 2 && bullets[0].length > 30) {
    intro = bullets.shift();
  }

  return { intro, bullets, links };
}

function FormattedBulletDescription({ text, targetUrl, isCompact = false, onShowMore }) {
  const { intro, bullets, links } = parseDescriptionToBullets(text, targetUrl);
  const displayBullets = isCompact ? bullets.slice(0, 3) : bullets;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '8px 0 12px' }}>
      {intro && (
        <p style={{
          fontSize: 13,
          color: 'var(--t1)',
          lineHeight: 1.5,
          fontWeight: 600,
          margin: 0,
          marginBottom: bullets.length > 0 ? 4 : 0
        }}>
          {renderTextWithLinks(intro)}
        </p>
      )}

      {displayBullets.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 2 }}>
          {displayBullets.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: 'var(--t2)', lineHeight: 1.45 }}>
              <span style={{
                color: 'var(--acc)',
                fontWeight: 800,
                fontSize: 14,
                lineHeight: 1,
                marginTop: 2,
                flexShrink: 0
              }}>•</span>
              <span style={{ flex: 1, wordBreak: 'break-word' }}>{renderTextWithLinks(item)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action / Target Links Button Pills */}
      {links.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, paddingTop: 4 }}>
          {links.map((link, idx) => {
            const { label, url } = getFriendlyLinkInfo(link);
            const isInternal = link.startsWith('/') && !link.startsWith('//');
            return (
              <a
                key={idx}
                href={url || link}
                target={isInternal ? '_self' : '_blank'}
                rel={isInternal ? undefined : 'noopener noreferrer'}
                onClick={e => e.stopPropagation()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 10,
                  background: 'rgba(230,95,43,0.12)',
                  border: '1px solid rgba(230,95,43,0.3)',
                  color: 'var(--acc, #E65F2B)',
                  fontSize: 12,
                  fontWeight: 750,
                  textDecoration: 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 2px 8px rgba(230,95,43,0.12)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--acc, #E65F2B)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(230,95,43,0.25)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(230,95,43,0.12)';
                  e.currentTarget.style.color = 'var(--acc, #E65F2B)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(230,95,43,0.12)';
                }}
              >
                <span>{label || '🔗 Open Link'}</span>
                <span>↗</span>
              </a>
            );
          })}
        </div>
      )}

      {isCompact && onShowMore && (
        <button
          onClick={onShowMore}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px 0 0',
            color: 'var(--acc)',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            textAlign: 'left',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          View Full Details & Guidelines →
        </button>
      )}
    </div>
  );
}


export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('daily');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAct, setSelectedAct] = useState(null);
  const [detailAct, setDetailAct] = useState(null);
  const dropdownRef = useRef(null);

  const [url, setUrl] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (detailAct || showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [detailAct, showModal]);

  const fetchActivities = () => {
    setLoading(true);
    ecosystemAPI.getActivities()
      .then(d => setActivities(d.activities || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const openSubmitModal = (act) => {
    setSelectedAct(act);
    setUrl('');
    setNote('');
    setShowModal(true);
  };

  const submitActivity = async (e) => {
    e.preventDefault();
    if (!note && !url) {
      toast.error('Please provide a URL or note for submission');
      return;
    }
    setSubmitting(true);
    try {
      await ecosystemAPI.submitActivity(selectedAct._id, { submissionUrl: url, submissionNote: note });
      toast.success('Activity submitted successfully for review!');
      setShowModal(false);
      fetchActivities(); // reload statuses
    } catch (e) {
      toast.error(e.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  const filtered = activities.filter(a => {
    if (filter === 'challenges') return a.isChallenge;
    return a.type === filter && !a.isChallenge;
  });

  const currentTab = ACTIVITY_TABS.find(t => t.key === filter) || ACTIVITY_TABS[0];
  const CurrentIcon = currentTab.Icon;

  return (
    <CreatorShell style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header Banner */}
      <div style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--glass-border)',
        borderRadius: 20,
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        boxShadow: 'var(--glass-shadow)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background light */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '50%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(124, 139, 90, 0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <h2 style={{ fontFamily: 'var(--fh)', fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--t1)' }}>Activity Hub</h2>
            <span className="badge badge-purple" style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontFamily: 'var(--fh)' }}>GAMIFIED</span>
          </div>
          <p style={{ color: 'var(--t2)', fontSize: 13, fontWeight: 500 }}>Complete daily tasks, learning quizzes, and monthly challenges to level up and earn Creator Coins!</p>
        </div>
      </div>

      {/* Activity Category Dropdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
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
                border: dropdownOpen ? '1.5px solid var(--acc, #E65F2B)' : '1px solid var(--border)',
                color: 'var(--t1)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: dropdownOpen ? '0 0 0 3px rgba(230,95,43,0.15)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: 'rgba(230, 95, 43, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--acc, #E65F2B)'
                }}>
                  {currentTab.emoji ? (
                    <span style={{ fontSize: 14 }}>{currentTab.emoji}</span>
                  ) : (
                    <CurrentIcon size={14} />
                  )}
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 750 }}>{currentTab.label}</span>
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
                  Activity Category
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 }}>
                  {ACTIVITY_TABS.map(t => {
                    const isSelected = filter === t.key;
                    const TabIcon = t.Icon;
                    const count = activities.filter(a => (t.key === 'challenges' ? a.isChallenge : (a.type === t.key && !a.isChallenge))).length;
                    return (
                      <div
                        key={t.key}
                        onClick={() => {
                          setFilter(t.key);
                          setDropdownOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          borderRadius: 10,
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(230, 95, 43, 0.12)' : 'transparent',
                          color: isSelected ? 'var(--t1)' : 'var(--t2)',
                          border: isSelected ? '1px solid rgba(230,95,43,0.3)' : '1px solid transparent',
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
                            background: isSelected ? 'rgba(230,95,43,0.2)' : 'rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isSelected ? 'var(--acc, #E65F2B)' : 'var(--t3)',
                            flexShrink: 0
                          }}>
                            {t.emoji ? (
                              <span style={{ fontSize: 13 }}>{t.emoji}</span>
                            ) : (
                              <TabIcon size={13} />
                            )}
                          </div>
                          <div>
                            <div style={{ fontSize: 12.5, fontWeight: isSelected ? 800 : 600, color: isSelected ? 'var(--acc, #E65F2B)' : 'var(--t1)' }}>
                              {t.label}
                            </div>
                            <div style={{ fontSize: 10.5, color: 'var(--t3)', lineHeight: 1.2, marginTop: 1 }}>
                              {t.desc}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{
                            fontSize: 10,
                            padding: '1px 6px',
                            borderRadius: 99,
                            background: isSelected ? 'var(--acc)' : 'rgba(255,255,255,0.06)',
                            color: isSelected ? '#ffffff' : 'var(--t3)',
                            fontWeight: 700
                          }}>
                            {count}
                          </span>
                          {isSelected && (
                            <span style={{ color: 'var(--acc, #E65F2B)', fontWeight: 900, fontSize: 13 }}>✓</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <p style={{ color: 'var(--t2)', fontSize: 12, margin: 0, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Lightbulb size={13} color="var(--gold)" />
          {currentTab?.desc}
        </p>
      </div>

      {/* Activities Grid */}
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--t3)', borderRadius: 20 }}>
          <AlertCircle size={28} style={{ margin: '0 auto 12px', opacity: 0.6 }} />
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--t2)' }}>No activities active in this category currently. Check back later!</div>
        </div>
      ) : (
        <div className="grid-2" style={{ gap: 20 }}>
          {filtered.map(act => (
            <div
              key={act._id}
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'var(--glass-blur)',
                WebkitBackdropFilter: 'var(--glass-blur)',
                border: act.isChallenge ? '1px solid rgba(108,99,255,0.25)' : '1px solid var(--glass-border)',
                borderRadius: 16,
                padding: 24,
                boxShadow: 'var(--glass-shadow)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.24s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 12px 30px rgba(108,99,255,0.05), var(--glass-shadow)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
              }}
            >
              <div>
                <div className="flex-between" style={{ marginBottom: 12 }}>
                  <span style={{
                    textTransform: 'uppercase', fontSize: 10, fontWeight: 700,
                    padding: '3px 10px', borderRadius: 99,
                    background: 'rgba(230,95,43,0.1)', color: 'var(--acc)',
                    border: '1px solid rgba(230,95,43,0.2)',
                    letterSpacing: '0.04em'
                  }}>{act.type}</span>
                  {act.status !== 'none' && (
                    <span style={{
                      fontSize: 10, padding: '3px 10px', borderRadius: 99, fontWeight: 700,
                      background: act.status === 'approved' ? 'rgba(34,197,94,0.1)' : act.status === 'pending' ? 'rgba(212,162,76,0.15)' : 'rgba(239,68,68,0.1)',
                      color: act.status === 'approved' ? '#16a34a' : act.status === 'pending' ? 'var(--gold)' : '#dc2626',
                      border: act.status === 'approved' ? '1px solid rgba(34,197,94,0.2)' : act.status === 'pending' ? '1px solid rgba(212,162,76,0.3)' : '1px solid rgba(239,68,68,0.2)',
                    }}>
                      {act.status === 'approved' ? '✓ Approved' : act.status === 'pending' ? '⏳ Pending Review' : '✕ Rejected'}
                    </span>
                  )}
                </div>
                <h3
                  onClick={() => setDetailAct(act)}
                  style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, color: 'var(--t1)', fontFamily: 'var(--fh)', lineHeight: 1.3, cursor: 'pointer' }}
                >
                  {act.title}
                </h3>

                {/* Formatted description with bullet points */}
                <FormattedBulletDescription
                  text={act.description}
                  targetUrl={act.targetUrl}
                  isCompact={true}
                  onShowMore={() => setDetailAct(act)}
                />

                {act.status !== 'none' && act.submission && (
                  <div style={{
                    marginTop: 12,
                    marginBottom: 16,
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: 'rgba(74,62,61,0.04)',
                    border: '1px solid var(--border)',
                    fontSize: 11,
                    fontWeight: 500
                  }}>
                    {act.submission.rating !== undefined && act.status === 'approved' && (
                      <div style={{ fontWeight: 700, color: 'var(--gold)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                        ⭐ {act.submission.rating}/5 Rating
                      </div>
                    )}
                    {act.submission.adminFeedback && (
                      <div style={{ color: 'var(--t2)', lineHeight: 1.4 }}>
                        <span style={{ fontWeight: 700, color: 'var(--t1)' }}>Feedback: </span>
                        "{act.submission.adminFeedback}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--t1)', background: 'rgba(74,62,61,0.06)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 4 }}>⚡ {act.xpReward} XP</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)', background: 'rgba(212,162,76,0.1)', border: '1px solid rgba(212,162,76,0.22)', padding: '4px 10px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 4 }}>🪙 {act.coinReward} Coins</div>
                </div>

                {act.status === 'approved' ? (
                  <button disabled style={{ background: 'transparent', border: 'none', color: '#16a34a', fontWeight: 700, fontSize: 12 }}>✓ Completed</button>
                ) : act.status === 'pending' ? (
                  <button disabled style={{ background: 'transparent', border: 'none', color: 'var(--gold)', fontWeight: 700, fontSize: 12 }}>⏳ Under Review</button>
                ) : (
                  <Btn variant="primary" size="sm" onClick={() => openSubmitModal(act)} style={{ height: 34, borderRadius: 10, padding: '0 14px', fontSize: 11, fontWeight: 700 }}>
                    {act.status === 'rejected' ? 'Re-Submit' : 'Submit Activity'}
                  </Btn>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── FULL ACTIVITY DETAIL POPUP MODAL ────────────────── */}
      {detailAct && createPortal(
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 99999, padding: 16, backdropFilter: 'blur(8px)',
          overflowY: 'auto'
        }} onClick={() => setDetailAct(null)}>
          <div
            className="glass-modal"
            style={{
              width: '100%', maxWidth: 540, animation: 'fadeUp 0.18s ease-out',
              padding: 28, borderRadius: 24, background: 'var(--s1)',
              border: '1px solid var(--border)', boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
              maxHeight: '90vh', overflowY: 'auto', margin: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex-between" style={{ marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
              <div>
                <span style={{
                  textTransform: 'uppercase', fontSize: 10, fontWeight: 700,
                  padding: '3px 10px', borderRadius: 99,
                  background: 'rgba(230,95,43,0.1)', color: 'var(--acc)',
                  border: '1px solid rgba(230,95,43,0.2)', letterSpacing: '0.04em'
                }}>{detailAct.type}</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--fh)', color: 'var(--t1)', marginTop: 8 }}>{detailAct.title}</h3>
              </div>
              <button onClick={() => setDetailAct(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 24, padding: 0 }}>×</button>
            </div>

            {/* Rewards Pill */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--t1)', background: 'rgba(74,62,61,0.06)', border: '1px solid var(--border)', padding: '5px 12px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 5 }}>⚡ {detailAct.xpReward} XP</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--gold)', background: 'rgba(212,162,76,0.1)', border: '1px solid rgba(212,162,76,0.22)', padding: '5px 12px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 5 }}>🪙 {detailAct.coinReward} Coins</div>
            </div>

            {/* Formatted Full Description */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Guidelines & Requirements</h4>
              <div style={{ background: 'rgba(74,62,61,0.03)', padding: 18, borderRadius: 16, border: '1px solid var(--border)' }}>
                <FormattedBulletDescription text={detailAct.description} targetUrl={detailAct.targetUrl} isCompact={false} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Btn variant="secondary" onClick={() => setDetailAct(null)} style={{ height: 38, borderRadius: 10, padding: '0 18px' }}>Close</Btn>
              {detailAct.status !== 'approved' && detailAct.status !== 'pending' && (
                <Btn variant="primary" onClick={() => { setDetailAct(null); openSubmitModal(detailAct); }} style={{ height: 38, borderRadius: 10, padding: '0 20px', fontWeight: 700 }}>
                  {detailAct.status === 'rejected' ? 'Re-Submit Activity' : 'Submit Activity'}
                </Btn>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Submission Modal */}
      {showModal && selectedAct && createPortal(
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 99999, padding: 16, backdropFilter: 'blur(8px)',
          overflowY: 'auto'
        }}>
          <div className="glass-modal" style={{
            width: '100%', maxWidth: 540, animation: 'fadeUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            padding: '24px 28px', borderRadius: 24, margin: 'auto',
            background: 'var(--s1, #12141C)', border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span style={{
                    textTransform: 'uppercase', fontSize: 10, fontWeight: 700,
                    padding: '3px 10px', borderRadius: 99,
                    background: 'rgba(230,95,43,0.12)', color: 'var(--acc)',
                    border: '1px solid rgba(230,95,43,0.25)', letterSpacing: '0.04em'
                  }}>{selectedAct.type || 'Activity'}</span>
                  
                  {selectedAct.xpReward > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--t1)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 99 }}>
                      ⚡ {selectedAct.xpReward} XP
                    </span>
                  )}
                  {selectedAct.coinReward > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold, #D4A24C)', background: 'rgba(212,162,76,0.1)', border: '1px solid rgba(212,162,76,0.25)', padding: '2px 8px', borderRadius: 99 }}>
                      🪙 {selectedAct.coinReward} Coins
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--fh)', color: 'var(--t1)', margin: 0, lineHeight: 1.3 }}>
                  Submit Activity: {selectedAct.title}
                </h3>
              </div>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                  color: 'var(--t3)', fontSize: 20, width: 32, height: 32, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                ×
              </button>
            </div>

            <form onSubmit={submitActivity} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Guidelines & Requirements Section */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, padding: '14px 16px'
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: 'var(--t3)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <AlertCircle size={13} color="var(--acc)" />
                  Requirements & Guidelines
                </div>
                <FormattedBulletDescription text={selectedAct.description} targetUrl={selectedAct.targetUrl} isCompact={false} />
              </div>

              {/* Submission URL Field */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: 12.5, marginBottom: 6, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  🔗 Submission Link (e.g. Instagram Reel, Drive Link, TikTok)
                </label>
                <input
                  className="form-input"
                  placeholder="https://instagram.com/reel/... or https://drive.google.com/..."
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 12,
                    border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)',
                    color: 'var(--t1)', fontSize: 13, transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--acc)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              {/* Submission Note Field */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: 12.5, marginBottom: 6, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  📝 Submission Details / Notes
                </label>
                <textarea
                  className="form-input form-textarea"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Include mandatory details (e.g., Phone Number, Email, Address, or submission notes)..."
                  style={{
                    minHeight: 100, width: '100%', padding: '12px 14px', borderRadius: 12,
                    border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)',
                    color: 'var(--t1)', fontSize: 13, lineHeight: 1.5,
                    resize: 'vertical', outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--acc)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              {/* Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 6, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                <Btn variant="secondary" type="button" onClick={() => setShowModal(false)} style={{ height: 38, borderRadius: 10, padding: '0 20px', fontWeight: 600 }}>
                  Cancel
                </Btn>
                <Btn variant="primary" type="submit" disabled={submitting} style={{ height: 38, borderRadius: 10, padding: '0 22px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {submitting ? 'Submitting Work...' : '🚀 Submit Deliverable'}
                </Btn>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </CreatorShell>
  );
}
