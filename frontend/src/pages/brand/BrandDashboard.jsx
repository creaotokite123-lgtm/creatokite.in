import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { campaignsAPI } from '../../api';
import { PageLoader, StatCard, WorkflowPipeline, StatusBadge, Btn, EmptyState, ProgressBar } from '../../components/ui';
import SEO from '../../components/common/SEO';
import EditCampaignModal from '../../components/brand/EditCampaignModal';
import toast from 'react-hot-toast';
import { Target, TrendingUp, IndianRupee, Users, Plus, BarChart2, Eye, Settings, Hourglass, Bot, UserCheck, Play, Edit, Trophy, XCircle, Lightbulb, Star, Compass, Megaphone, Coins, Activity, Pencil, Trash2, Filter, ChevronDown, X } from 'lucide-react';


const WF = {
  brand_submitted: { label: 'Under Review', icon: Hourglass, color: 'var(--gold)', desc: 'Admin reviewing your brief' },
  admin_review: { label: 'AI Analyzing', icon: Bot, color: 'var(--p2)', desc: 'AI finding best creators' },
  ai_analyzing: { label: 'AI Analyzing', icon: Bot, color: 'var(--p2)', desc: 'AI matching creators' },
  creators_assigned: { label: 'Creators Assigned', icon: UserCheck, color: 'var(--acc2)', desc: 'Team has selected creators' },
  in_progress: { label: 'In Progress', icon: Play, color: 'var(--acc)', desc: 'Creators making content' },
  revision: { label: 'In Revision', icon: Edit, color: 'var(--coral)', desc: 'Content under revision' },
  completed: { label: 'Completed', icon: Trophy, color: 'var(--gold)', desc: 'Campaign delivered!' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'var(--t3)', desc: 'Campaign cancelled' },
};

export default function BrandDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState(['all']);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
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

  const toggleStatus = (k) => {
    if (k === 'all') {
      setSelectedStatuses(['all']);
      return;
    }
    setSelectedStatuses(prev => {
      const current = prev.filter(x => x !== 'all');
      if (current.includes(k)) {
        const next = current.filter(x => x !== k);
        return next.length === 0 ? ['all'] : next;
      } else {
        return [...current, k];
      }
    });
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Are you sure you want to delete campaign "${c.title}"? This cannot be undone.`)) return;
    try {
      await campaignsAPI.delete(c._id);
      toast.success('Campaign deleted successfully');
      setCampaigns(prev => prev.filter(x => x._id !== c._id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete campaign');
    }
  };

  const handleUpdated = (updated) => {
    setCampaigns(prev => prev.map(c => c._id === updated._id ? { ...c, ...updated } : c));
  };

  useEffect(() => {
    campaignsAPI.brandCampaigns().then(d => setCampaigns(d.campaigns || [])).catch(() => { }).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const active = campaigns.filter(c => ['in_progress', 'creators_assigned'].includes(c.workflowStatus));
  const pending = campaigns.filter(c => ['brand_submitted', 'admin_review', 'ai_analyzing'].includes(c.workflowStatus));
  const completed = campaigns.filter(c => c.workflowStatus === 'completed');
  const totalSpent = campaigns.reduce((s, c) => s + c.budget, 0);
  const budgetCap = totalSpent > 0 ? Math.ceil(totalSpent / 500000) * 500000 : 500000;
  const pctUsed = budgetCap > 0 ? Math.round((totalSpent / budgetCap) * 100) : 0;
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentHour = new Date().getHours();
  const STATUS_OPTIONS = [
    { key: 'all', label: 'All Statuses', count: campaigns.length },
    { key: 'brand_submitted', label: 'Pending', count: campaigns.filter(c => ['brand_submitted', 'admin_review', 'ai_analyzing'].includes(c.workflowStatus || c.status)).length },
    { key: 'creators_assigned', label: 'Assigned', count: campaigns.filter(c => (c.workflowStatus || c.status) === 'creators_assigned').length },
    { key: 'in_progress', label: 'Active', count: campaigns.filter(c => (c.workflowStatus || c.status) === 'in_progress').length },
    { key: 'completed', label: 'Done', count: campaigns.filter(c => (c.workflowStatus || c.status) === 'completed').length },
  ];

  const filtered = selectedStatuses.includes('all')
    ? campaigns
    : campaigns.filter(c => {
        const status = c.workflowStatus || c.status;
        if (selectedStatuses.includes('brand_submitted') && ['brand_submitted', 'admin_review', 'ai_analyzing'].includes(status)) {
          return true;
        }
        return selectedStatuses.includes(status);
      });

  return (
    <div className="page-enter brand-dashboard" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SEO
        title="Brand &amp; Dealer Campaign Portal | CreatoKite"
        description="Manage UGC campaigns, dealer networks, creator assignments, and live analytics."
        noindex={true}
      />
      <style>{`

        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@1,400..900&display=swap');

        /* Default Inter Font for Dashboard Layout */
        .brand-dashboard,
        .brand-dashboard button,
        .brand-dashboard input,
        .brand-dashboard select,
        .brand-dashboard textarea {
          font-family: 'Inter', sans-serif !important;
        }

        /* Poppins for headers and brand titles */
        .brand-dashboard h2,
        .brand-dashboard h3,
        .brand-dashboard h4,
        .brand-dashboard .brand-title {
          font-family: 'Poppins', sans-serif !important;
          font-weight: 800 !important;
          letter-spacing: -0.015em !important;
        }

        /* Tempting font style for verified badges and script accents */
        .brand-dashboard em,
        .brand-dashboard .badge-green,
        .brand-dashboard .tempting-highlight {
          font-family: 'Tempting', 'Playfair Display', cursive !important;
          font-style: italic !important;
          font-weight: 600 !important;
        }

        /* Poppins for statistics values to ensure normal zeros */
        .brand-dashboard .stat-value,
        .brand-dashboard .budget-value {
          font-family: 'Poppins', sans-serif !important;
          letter-spacing: -0.015em !important;
          font-weight: 700 !important;
        }

        /* Atom font style for metrics, badges, and chips */
        .brand-dashboard .metric,
        .brand-dashboard .badge {
          font-family: 'Atom', 'Space Mono', 'Courier New', monospace !important;
          letter-spacing: -0.03em !important;
          font-weight: 700 !important;
        }

        .brand-dashboard .chip {
          font-family: 'Inter', sans-serif !important;
          letter-spacing: -0.01em !important;
          font-weight: 600 !important;
          text-transform: capitalize !important;
        }
      `}</style>

      {/* Hero */}
      <div style={{
        background: 'var(--s1)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '28px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 20,
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow backdrop accent */}
        <div style={{
          position: 'absolute', top: -50, right: -50, width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(230,95,43,0.12) 0%, transparent 70%)',
          filter: 'blur(30px)', pointerEvents: 'none'
        }} />
        <div>
          <div style={{ fontSize: 10, color: 'var(--acc)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 800, marginBottom: 2 }}>
            {greeting}
          </div>
          <h2 style={{
            fontSize: 'clamp(26px, 6vw, 36px)', fontWeight: 900, color: 'var(--t1)',
            fontFamily: "'Inter', -apple-system, sans-serif", letterSpacing: '-0.03em', lineHeight: 1.15,
            margin: '4px 0 8px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap'
          }}>
            {user?.companyName || user?.displayName}
          </h2>
          <h3 style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--t2)', margin: '0 0 4px 0', lineHeight: 1.35 }}>
            Build campaigns worth <em style={{ fontStyle: 'italic', fontWeight: 700, color: 'var(--acc)', fontFamily: "'EB Garamond', Georgia, serif" }}>talking about.</em>
          </h3>
          <p style={{ color: 'var(--t3)', fontSize: 11.5, fontWeight: 500, margin: 0 }}>
            Submit campaign goals — we assign the best creators automatically.
          </p>
          <div style={{ fontSize: 9.5, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.10em', marginTop: 8, fontWeight: 600, opacity: 0.8 }}>
            {formattedDate}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, zIndex: 1, flexWrap: 'nowrap', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/brand/campaigns/create')}
            className="tactile-btn-new-campaign"
          >
            <Plus size={15} /> New Campaign
          </button>
          <button
            onClick={() => navigate('/brand/analytics')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px',
              borderRadius: 12, background: 'var(--s1)', color: 'var(--t1)',
              border: '1px solid var(--border)', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'var(--acc)';
              e.currentTarget.style.background = 'rgba(230,95,43,0.08)';
              e.currentTarget.style.color = 'var(--acc)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'var(--s1)';
              e.currentTarget.style.color = 'var(--t1)';
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.96)'; }}
            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          >
            <BarChart2 size={15} /> Analytics
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        <StatCard label="Total Campaigns" value={campaigns.length} icon={Megaphone} color="var(--p2)" />
        <StatCard label="Pending Review" value={pending.length} icon={Hourglass} color="var(--gold)" sub="Being processed" />
        <StatCard label="In Progress" value={active.length} icon={Activity} color="var(--acc2)" />
        <StatCard label="Total Budget" value={`₹${(totalSpent / 1000).toFixed(0)}K`} icon={Coins} color="var(--acc)" />
      </div>

      {/* How it works (first time) */}
      {campaigns.length < 2 && (
        <div style={{
          padding: '20px 24px',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 14,
          boxShadow: 'var(--glass-shadow)'
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--t1)' }}>
            <Lightbulb size={16} style={{ color: 'var(--gold)' }} />
            <span>How CreatoKite works for your brand</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { id: '1', icon: Plus, title: 'You Submit', desc: 'Tell us your goals & budget. No browsing creator lists.' },
              { id: '2', icon: Bot, title: 'AI Matches', desc: 'Our AI picks the best creators from all profiles.' },
              { id: '3', icon: UserCheck, title: 'Admin Assigns', desc: 'Our team finalises and bulk-assigns creators.' },
              { id: '4', icon: TrendingUp, title: 'Track Results', desc: 'Watch real-time performance — we handle creators.' },
            ].map((step) => {
              const IconComp = step.icon;
              return (
                <div key={step.id} style={{
                  padding: '16px',
                  borderRadius: 10,
                  position: 'relative'
                }}
                  className="workflow-stage"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255, 107, 87, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconComp size={14} style={{ color: 'var(--p)' }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--t3)', opacity: 0.6 }}>STEP 0{step.id}</span>
                  </div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>{step.title}</h4>
                  <p style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.5 }}>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two Column Grid */}
      <div className="dashboard-grid">
        {/* LEFT COLUMN: Campaigns */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', alignSelf: 'flex-start' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>Your Campaigns</h3>
              <p style={{ fontSize: 11, color: 'var(--t2)', marginTop: 2 }}>Track progress of your creator collaborations</p>
            </div>
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setDropdownOpen(o => !o)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 10px',
                  borderRadius: 8,
                  background: 'var(--s2, rgba(255, 255, 255, 0.05))',
                  border: dropdownOpen ? '1.5px solid var(--acc, #E65F2B)' : '1px solid var(--border)',
                  color: 'var(--t1)',
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: dropdownOpen ? '0 0 0 3px rgba(230,95,43,0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Filter size={11} style={{ color: 'var(--acc, #E65F2B)' }} />
                <span>Filter</span>
                <span style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 99,
                  background: 'rgba(230,95,43,0.18)',
                  color: 'var(--acc, #E65F2B)',
                }}>
                  {selectedStatuses.includes('all') ? 'All' : `${selectedStatuses.length}`}
                </span>
                <ChevronDown size={11} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--t3)' }} />
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    zIndex: 100,
                    width: 230,
                    background: 'var(--s1, #161822)',
                    border: '1px solid var(--border, rgba(255,255,255,0.12))',
                    borderRadius: 12,
                    boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                    overflow: 'hidden',
                    padding: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    animation: 'fadeIn 0.15s ease-out'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 8px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Filter Checklist</span>
                    {!selectedStatuses.includes('all') && (
                      <button
                        type="button"
                        onClick={() => setSelectedStatuses(['all'])}
                        style={{ background: 'none', border: 'none', color: 'var(--acc, #E65F2B)', fontSize: 10.5, fontWeight: 650, cursor: 'pointer', padding: 0 }}
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 }}>
                    {STATUS_OPTIONS.map(({ key: k, label: l, count }) => {
                      const isChecked = selectedStatuses.includes('all') ? k === 'all' : selectedStatuses.includes(k);
                      return (
                        <div
                          key={k}
                          onClick={() => toggleStatus(k)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 8px',
                            borderRadius: 6,
                            cursor: 'pointer',
                            background: isChecked ? 'rgba(230, 95, 43, 0.12)' : 'transparent',
                            color: isChecked ? 'var(--t1)' : 'var(--t2)',
                            fontSize: 11.5,
                            fontWeight: isChecked ? 650 : 500,
                            transition: 'background 0.12s'
                          }}
                          onMouseEnter={e => !isChecked && (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                          onMouseLeave={e => !isChecked && (e.currentTarget.style.background = 'transparent')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <div style={{
                              width: 13,
                              height: 13,
                              borderRadius: 3,
                              border: isChecked ? '1.5px solid var(--acc, #E65F2B)' : '1.5px solid var(--t3)',
                              background: isChecked ? 'var(--acc, #E65F2B)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: 8.5,
                              fontWeight: 900
                            }}>
                              {isChecked && '✓'}
                            </div>
                            <span>{l}</span>
                          </div>
                          <span style={{
                            fontSize: 9.5,
                            padding: '1px 5px',
                            borderRadius: 99,
                            background: isChecked ? 'rgba(230, 95, 43, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                            color: isChecked ? 'var(--acc, #E65F2B)' : 'var(--t3)',
                            fontWeight: 700
                          }}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={<Compass size={32} style={{ color: 'var(--t3)', marginBottom: 8 }} />} title="No campaigns yet"
              desc="Submit your first campaign brief and let our AI find the perfect creators!"
              action={<Btn variant="primary" onClick={() => navigate('/brand/campaigns/create')}>Submit Campaign Brief</Btn>}
            />
          ) : (
            filtered.map((c, i) => {
              const ws = c.workflowStatus || 'brand_submitted';
              const stage = WF[ws] || WF.brand_submitted;
              const assigned = c.assignedCreators?.length || 0;
              return (
                <div key={c._id} style={{
                  padding: '18px 20px', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background .15s', cursor: 'pointer'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                  onClick={() => navigate(`/brand/campaigns/${c._id}`)}>
                  <div className="flex-between" style={{ flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        {stage.icon && <stage.icon size={13} style={{ color: stage.color }} />}
                        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--t1)' }}>{c.title}</span>
                        {c.isPremium && <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Star size={9} /> Premium</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--t2)' }}>
                        {c.niche} · <span className="budget-value" style={{ color: 'var(--acc2)', fontWeight: 600 }}>₹{c.budget?.toLocaleString('en-IN')}</span>
                        {' · '}{c.daysLeft ?? '?'}d left · {assigned} creators assigned
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Btn variant="ghost" size="sm" onClick={e => { e.stopPropagation(); navigate(`/brand/campaigns/${c._id}`) }}>
                        <Eye size={12} /> View
                      </Btn>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setEditingCampaign(c);
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          padding: '5px 10px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          color: 'var(--t1)',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                      >
                        <Pencil size={11} style={{ color: 'var(--acc)' }} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleDelete(c);
                        }}
                        style={{
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          borderRadius: 8,
                          padding: '5px 10px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#f87171',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                  <WorkflowPipeline status={ws} />
                  <div style={{ marginTop: 8, fontSize: 11, color: stage.color }}>● {stage.desc}</div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: Budget, Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Budget Widget */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>Campaign Budget</h3>
                <p style={{ fontSize: 11, color: 'var(--t2)', marginTop: 2 }}>Across active campaigns</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <strong className="stat-value" style={{ fontSize: 28, color: 'var(--t1)' }}>
                ₹{(totalSpent / 100000).toFixed(2)}L
              </strong>
              <span style={{ fontSize: 11, color: 'var(--t3)' }}>
                of ₹{(budgetCap / 100000).toFixed(2)}L cap
              </span>
            </div>
            <ProgressBar value={totalSpent} max={budgetCap} color="var(--p)" height={6} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t2)', marginTop: 10 }}>
              <span>₹{((budgetCap - totalSpent) / 100000).toFixed(2)}L remaining</span>
              <span>{pctUsed}% allocated</span>
            </div>
          </div>

          {/* Quick Actions / Discovery */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 14 }}>Quick Tools</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                onClick={() => navigate('/brand/campaigns/create')}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, cursor: 'pointer' }}
                className="workflow-stage"
              >
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,107,87,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--p)' }}>
                  <Plus size={14} />
                </div>
                <div>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>Launch a Campaign</h4>
                  <p style={{ fontSize: 10, color: 'var(--t2)' }}>Set your brief, budget, requirements</p>
                </div>
              </div>

              <div
                onClick={() => navigate('/brand/reels')}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, cursor: 'pointer' }}
                className="workflow-stage"
              >
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,107,87,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--p)' }}>
                  <TrendingUp size={14} />
                </div>
                <div>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>Track Live Reels</h4>
                  <p style={{ fontSize: 10, color: 'var(--t2)' }}>Monitor real-time viewer engagement</p>
                </div>
              </div>

              <div
                onClick={() => navigate('/brand/analytics')}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, cursor: 'pointer' }}
                className="workflow-stage"
              >
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                  <BarChart2 size={14} />
                </div>
                <div>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>Measure Performance</h4>
                  <p style={{ fontSize: 10, color: 'var(--t2)' }}>View aggregated reach & conversion ROI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditCampaignModal
        campaign={editingCampaign}
        isOpen={Boolean(editingCampaign)}
        onClose={() => setEditingCampaign(null)}
        onUpdated={handleUpdated}
      />
    </div>
  );
}
