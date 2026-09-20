// BrandCampaigns.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignsAPI } from '../../api';
import { PageLoader, StatusBadge, WorkflowPipeline, Btn, EmptyState } from '../../components/ui';
import EditCampaignModal from '../../components/brand/EditCampaignModal';
import toast from 'react-hot-toast';
import { Plus, Eye, ClipboardList, Pencil, Trash2, Filter, ChevronDown, X } from 'lucide-react';

export default function BrandCampaigns() {
  const nav = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState(['all']);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    campaignsAPI.brandCampaigns()
      .then(d => setCampaigns(d.campaigns || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) return <PageLoader />;

  const STATUS_OPTIONS = [
    { key: 'all', label: 'All Statuses', count: campaigns.length },
    { key: 'brand_submitted', label: 'Pending Review', count: campaigns.filter(c => ['brand_submitted', 'admin_review', 'ai_analyzing'].includes(c.workflowStatus || c.status)).length },
    { key: 'creators_assigned', label: 'Creators Assigned', count: campaigns.filter(c => (c.workflowStatus || c.status) === 'creators_assigned').length },
    { key: 'in_progress', label: 'Active / In Progress', count: campaigns.filter(c => (c.workflowStatus || c.status) === 'in_progress').length },
    { key: 'completed', label: 'Done / Completed', count: campaigns.filter(c => (c.workflowStatus || c.status) === 'completed').length },
    { key: 'cancelled', label: 'Cancelled', count: campaigns.filter(c => (c.workflowStatus || c.status) === 'cancelled').length },
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
    <div className="page-enter brand-campaigns" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Banner */}
      <div className="card" style={{
        padding: '24px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow backdrop accent */}
        <div style={{
          position: 'absolute', top: -50, right: -50, width: 150, height: 150,
          background: 'radial-gradient(circle, rgba(255,107,87,0.12) 0%, transparent 70%)',
          filter: 'blur(30px)', pointerEvents: 'none'
        }} />
        <div>
          <h2 className="brand-title" style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'var(--t1)' }}>
            My Campaigns
          </h2>
          <p style={{ color: 'var(--t2)', fontSize: 13, fontWeight: 500, marginTop: 4 }}>
            {campaigns.length} total campaigns submitted
          </p>
        </div>
        <button
          onClick={() => nav('/brand/campaigns/create')}
          className="tactile-btn-new-campaign"
        >
          <Plus size={14} /> New Campaign
        </button>
      </div>

      {/* Dropdown Checklist Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setDropdownOpen(o => !o)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 10,
              background: 'var(--s2, rgba(255, 255, 255, 0.05))',
              border: dropdownOpen ? '1.5px solid var(--acc, #E65F2B)' : '1px solid var(--border)',
              color: 'var(--t1)',
              fontSize: 12.5,
              fontWeight: 650,
              cursor: 'pointer',
              boxShadow: dropdownOpen ? '0 0 0 3px rgba(230,95,43,0.15)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Filter size={13} style={{ color: 'var(--acc, #E65F2B)' }} />
            <span>Filter Status</span>
            <span style={{
              fontSize: 10.5,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 99,
              background: 'rgba(230,95,43,0.18)',
              color: 'var(--acc, #E65F2B)',
            }}>
              {selectedStatuses.includes('all') ? `All (${campaigns.length})` : `${selectedStatuses.length} selected (${filtered.length})`}
            </span>
            <ChevronDown size={13} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--t3)' }} />
          </button>

          {/* Dropdown Popover */}
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                zIndex: 100,
                width: 250,
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Filter Checklist</span>
                {!selectedStatuses.includes('all') && (
                  <button
                    type="button"
                    onClick={() => setSelectedStatuses(['all'])}
                    style={{ background: 'none', border: 'none', color: 'var(--acc, #E65F2B)', fontSize: 11, fontWeight: 650, cursor: 'pointer', padding: 0 }}
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
                        padding: '7px 10px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: isChecked ? 'rgba(230, 95, 43, 0.12)' : 'transparent',
                        color: isChecked ? 'var(--t1)' : 'var(--t2)',
                        fontSize: 12,
                        fontWeight: isChecked ? 650 : 500,
                        transition: 'background 0.12s'
                      }}
                      onMouseEnter={e => !isChecked && (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                      onMouseLeave={e => !isChecked && (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 14,
                          height: 14,
                          borderRadius: 3.5,
                          border: isChecked ? '1.5px solid var(--acc, #E65F2B)' : '1.5px solid var(--t3)',
                          background: isChecked ? 'var(--acc, #E65F2B)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 9,
                          fontWeight: 900
                        }}>
                          {isChecked && '✓'}
                        </div>
                        <span>{l}</span>
                      </div>
                      <span style={{
                        fontSize: 10,
                        padding: '1px 6px',
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

        {/* Active Filter Tags */}
        {!selectedStatuses.includes('all') && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {selectedStatuses.map(s => {
              const item = STATUS_OPTIONS.find(x => x.key === s);
              return (
                <span
                  key={s}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '4px 10px',
                    borderRadius: 8,
                    background: 'rgba(230, 95, 43, 0.15)',
                    border: '1px solid rgba(230, 95, 43, 0.3)',
                    color: 'var(--acc, #E65F2B)',
                    fontSize: 11.5,
                    fontWeight: 650
                  }}
                >
                  {item?.label || s}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => toggleStatus(s)} />
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Campaigns list card container */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <EmptyState icon={<ClipboardList size={32} style={{ color: 'var(--t3)', marginBottom: 8 }} />} title="No campaigns found" desc={selectedStatuses.includes('all') ? "Create your first campaign brief!" : "No campaigns matching this status."}
            action={selectedStatuses.includes('all') && <Btn variant="primary" onClick={() => nav('/brand/campaigns/create')}>Create Campaign</Btn>}
          />
        ) : (
          filtered.map((c, i) => (
            <div key={c._id} onClick={() => nav(`/brand/campaigns/${c._id}`)}
              style={{
                padding: '18px 20px', borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer', transition: 'background .15s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}>
              <div className="flex-between" style={{ flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: 'var(--t1)' }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--t2)' }}>
                    {c.niche} · <span className="budget-value" style={{ color: 'var(--acc2)', fontWeight: 650 }}>₹{c.budget?.toLocaleString('en-IN')}</span> · {c.assignedCreators?.length || 0} creators · {c.daysLeft ?? '?'}d left
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <StatusBadge status={c.workflowStatus || c.status} />
                  <Btn variant="ghost" size="sm" onClick={e => { e.stopPropagation(); nav(`/brand/campaigns/${c._id}`); }}><Eye size={12} /> View</Btn>
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
              <WorkflowPipeline status={c.workflowStatus || 'brand_submitted'} />
            </div>
          ))
        )}
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
