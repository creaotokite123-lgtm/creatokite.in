import { useState, useEffect, useRef } from 'react';
import { PageLoader, EmptyState, Spinner, renderTextWithLinks } from '../../components/ui';
import { Search, ExternalLink, Calendar, Award, Briefcase, Sparkles, Zap, ChevronDown, Check } from 'lucide-react';
import SEO from '../../components/common/SEO';
import api from '../../api';

const CATEGORY_LABELS = {
  ugc_hiring: 'UGC Hiring',
  campus_ambassador: 'Campus Ambassador',
  product_seeding: 'Product Seeding',
  affiliate: 'Affiliate Program',
  event: 'Event Registration',
  survey: 'Survey / Research',
  creator_hunt: 'Creator Hunt',
};

const CATEGORY_COLORS = {
  ugc_hiring: 'rgba(99,102,241,0.15)',
  campus_ambassador: 'rgba(59,130,246,0.15)',
  product_seeding: 'rgba(16,185,129,0.15)',
  affiliate: 'rgba(212,162,76,0.15)',
  event: 'rgba(236,72,153,0.15)',
  survey: 'rgba(6,182,212,0.15)',
  creator_hunt: 'rgba(245,158,11,0.15)',
};

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  useEffect(() => {
    fetchOpportunities();
  }, [categoryFilter]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await api.get('/opportunities', {
        params: { category: categoryFilter || undefined }
      });
      if (res.data?.success) {
        setOpportunities(res.data.opportunities || []);
      }
    } catch (e) {
      console.error('Failed to load opportunities:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SEO
        title="Creator Opportunities & UGC Brand Gigs | CreatoKite"
        description="Browse active UGC creator opportunities, brand deals, sponsored challenges, and high-payout video campaigns on CreatoKite."
        keywords="UGC Deals, Creator Opportunities, Sponsored Video Gigs, Brand Collaborations, CreatoKite Jobs"
        canonical="/opportunities"
      />
      {/* Header Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(212,162,76,0.12), rgba(99,102,241,0.12))',
        border: '1px solid rgba(212,162,76,0.25)',
        padding: '26px 30px',
        borderRadius: 24,
      }}>
        <div style={{ maxWidth: 650 }}>
          <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 36, color: 'var(--t1)', marginBottom: 8, fontWeight: 900, letterSpacing: '-0.02em' }}>
            Creator Opportunities
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'var(--t2)', fontSize: 13.5, lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
            Discover brand seeding applications, UGC creator roles, campus ambassador programs, and affiliate form links curated by CreatoKite.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} color="var(--acc)" />
          <span>Active Opportunities</span>
          <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'rgba(230,95,43,0.15)', color: 'var(--acc)', fontWeight: 800 }}>
            {opportunities.length}
          </span>
        </div>

        {/* Category Dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative', width: '100%', maxWidth: 260 }}>
            <button
              type="button"
              onClick={() => setDropdownOpen(o => !o)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                width: '100%',
                height: 42,
                padding: '0 14px',
                borderRadius: 10,
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                <span style={{ fontSize: 12, color: 'var(--t3)', fontWeight: 600 }}>Type:</span>
                <span style={{ fontSize: 13, fontWeight: 750, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {categoryFilter ? (CATEGORY_LABELS[categoryFilter] || categoryFilter) : 'All Types'}
                </span>
              </div>
              <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--t3)', flexShrink: 0 }} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  zIndex: 100,
                  width: '100%',
                  minWidth: 260,
                  maxHeight: 360,
                  overflowY: 'auto',
                  background: 'var(--s1, #161822)',
                  border: '1px solid var(--border, rgba(255,255,255,0.12))',
                  borderRadius: 12,
                  boxShadow: '0 16px 36px rgba(0,0,0,0.45)',
                  padding: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  animation: 'fadeIn 0.15s ease-out'
                }}
              >
                <div style={{ padding: '6px 10px', fontSize: 10.5, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid var(--border)' }}>
                  Filter By Type
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 }}>
                  <div
                    onClick={() => {
                      setCategoryFilter('');
                      setDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: categoryFilter === '' ? 'rgba(230, 95, 43, 0.12)' : 'transparent',
                      color: categoryFilter === '' ? 'var(--acc, #E65F2B)' : 'var(--t1)',
                      fontWeight: categoryFilter === '' ? 800 : 600,
                      fontSize: 12.5,
                      border: categoryFilter === '' ? '1px solid rgba(230,95,43,0.3)' : '1px solid transparent',
                      transition: 'background 0.12s'
                    }}
                    onMouseEnter={e => categoryFilter !== '' && (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={e => categoryFilter !== '' && (e.currentTarget.style.background = 'transparent')}
                  >
                    <span>All Types</span>
                    {categoryFilter === '' && (
                      <span style={{ color: 'var(--acc, #E65F2B)', fontWeight: 900, fontSize: 13 }}>✓</span>
                    )}
                  </div>
                  {Object.entries(CATEGORY_LABELS).map(([catKey, catLabel]) => {
                    const isSelected = categoryFilter === catKey;
                    return (
                      <div
                        key={catKey}
                        onClick={() => {
                          setCategoryFilter(catKey);
                          setDropdownOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(230, 95, 43, 0.12)' : 'transparent',
                          color: isSelected ? 'var(--acc, #E65F2B)' : 'var(--t1)',
                          fontWeight: isSelected ? 800 : 600,
                          fontSize: 12.5,
                          border: isSelected ? '1px solid rgba(230,95,43,0.3)' : '1px solid transparent',
                          transition: 'background 0.12s'
                        }}
                        onMouseEnter={e => !isSelected && (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                        onMouseLeave={e => !isSelected && (e.currentTarget.style.background = 'transparent')}
                      >
                        <span>{catLabel}</span>
                        {isSelected && (
                          <span style={{ color: 'var(--acc, #E65F2B)', fontWeight: 900, fontSize: 13 }}>✓</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

      {/* Grid */}
      {loading ? (
        <PageLoader />
      ) : opportunities.length === 0 ? (
        <EmptyState
          icon="⚡"
          title="No opportunities found"
          desc="Check back soon! New ambassador programs, UGC forms, and brand seeding applications are added daily."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 18 }}>
          {opportunities.map((opp) => (
            <div key={opp._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {opp.banner && (
                  <div style={{ height: 140, borderRadius: 'var(--r)', overflow: 'hidden', background: '#000' }}>
                    <img src={opp.banner} alt={opp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99,
                    background: CATEGORY_COLORS[opp.category] || 'rgba(255,255,255,0.08)',
                    color: 'var(--t1)', textTransform: 'uppercase', letterSpacing: 0.4
                  }}>
                    {CATEGORY_LABELS[opp.category] || opp.category}
                  </span>
                  {opp.brandName && (
                    <span style={{ fontSize: 11, color: 'var(--t3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Briefcase size={12} /> {opp.brandName}
                    </span>
                  )}
                </div>

                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', marginBottom: 4, fontFamily: 'var(--fd)' }}>
                    {opp.title}
                  </h3>
                  {opp.description && (
                    <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', wordBreak: 'break-word' }}>
                      {renderTextWithLinks(opp.description)}
                    </div>
                  )}
                </div>

                <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
                  {opp.requiresAdsRights && (
                    <div style={{ color: '#E65F2B', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(230, 95, 43, 0.1)', border: '1px solid rgba(230, 95, 43, 0.25)', padding: '3px 8px', borderRadius: 6, width: 'fit-content' }}>
                      <Zap size={12} />
                      <span>Ready for Usage Rights / Ad Rights</span>
                    </div>
                  )}
                  {opp.reward && (
                    <div style={{ color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Award size={13} />
                      <span>Reward: {opp.reward}</span>
                    </div>
                  )}
                  {opp.deadline && (
                    <div style={{ color: 'var(--t3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={13} />
                      <span>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <a
                  href={opp.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '8px 14px' }}
                >
                  <span>Apply Now</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
