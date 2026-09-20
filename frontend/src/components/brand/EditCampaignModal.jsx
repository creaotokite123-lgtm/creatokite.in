import { useState, useEffect } from 'react';
import { Btn, Input, Textarea, Select } from '../ui';
import { X, Save, Calendar, Target, Users, Layers, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { campaignsAPI } from '../../api';

const NICHES = ['Tech', 'Beauty', 'Fashion', 'Fitness', 'Food', 'Travel', 'Gaming', 'Education', 'Finance', 'Lifestyle', 'Music', 'Art', 'Other'];
const PLATFORMS = ['instagram', 'youtube', 'twitter', 'tiktok'];
const DELIVERABLES = ['Instagram Reel', 'Instagram Post', 'Instagram Story', 'YouTube Video', 'YouTube Shorts', 'Twitter Post'];
const GOALS = ['Brand Awareness', 'Product Launch', 'App Downloads', 'Website Traffic', 'Lead Generation', 'Sales Conversion', 'Community Growth', 'Event Promotion'];

export default function EditCampaignModal({ campaign, isOpen, onClose, onUpdated }) {
  const minDate = new Date().toISOString().split('T')[0];
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    niche: '',
    campaignGoal: '',
    targetAudience: '',
    platforms: [],
    deliverables: [],
    budget: '',
    totalSlots: 5,
    deadline: '',
    contentGuidelines: '',
    dealType: 'paid',
    barterProduct: '',
    barterValue: '',
  });

  useEffect(() => {
    if (campaign) {
      setForm({
        title: campaign.title || '',
        description: campaign.description || '',
        niche: campaign.niche || '',
        campaignGoal: campaign.campaignGoal || '',
        targetAudience: campaign.targetAudience || '',
        platforms: campaign.platforms || [],
        deliverables: campaign.deliverables || [],
        budget: campaign.budget || '',
        totalSlots: campaign.totalSlots || 5,
        deadline: campaign.deadline ? new Date(campaign.deadline).toISOString().split('T')[0] : '',
        contentGuidelines: campaign.contentGuidelines || '',
        dealType: campaign.dealType || 'paid',
        barterProduct: campaign.barterProduct || '',
        barterValue: campaign.barterValue || '',
      });
    }
  }, [campaign]);

  if (!isOpen || !campaign) return null;

  const toggleArr = (key, val) => {
    setForm(p => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val]
    }));
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    if (!form.title.trim()) return toast.error('Campaign title is required');
    if (!form.description.trim()) return toast.error('Description is required');
    if (!form.deadline) return toast.error('Deadline is required');
    if (form.deadline < minDate) return toast.error('Deadline must be today or a future date');

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        niche: form.niche,
        campaignGoal: form.campaignGoal,
        targetAudience: form.targetAudience,
        platforms: form.platforms,
        deliverables: form.deliverables,
        budget: +form.budget || 0,
        totalSlots: +form.totalSlots || 1,
        deadline: form.deadline,
        contentGuidelines: form.contentGuidelines,
        dealType: form.dealType,
        barterProduct: form.barterProduct,
        barterValue: +form.barterValue || 0,
      };

      const res = await campaignsAPI.update(campaign._id, payload);
      toast.success('Campaign updated successfully!');
      if (onUpdated) onUpdated(res.campaign || { ...campaign, ...payload });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update campaign');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--s1, #12141C)',
          border: '1px solid var(--border, rgba(255,255,255,0.12))',
          borderRadius: 18,
          width: '100%',
          maxWidth: 680,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--s2, rgba(255,255,255,0.02))'
        }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>
              Edit Campaign Details
            </h3>
            <p style={{ fontSize: 12, color: 'var(--t3)', margin: '4px 0 0' }}>
              Update brief, budget, slots, and requirements
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: 8,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--t2)',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--t2)'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Title */}
          <Input
            label="Campaign Title *"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Summer Fitness Challenge"
          />

          {/* Description */}
          <Textarea
            label="Campaign Description *"
            rows={3}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your campaign goals and creator instructions..."
          />

          {/* Niche & Goal in 2 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Primary Niche</label>
              <select
                className="form-input"
                value={form.niche}
                onChange={e => setForm({ ...form, niche: e.target.value })}
                style={{ cursor: 'pointer' }}
              >
                <option value="">Select Niche</option>
                {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Campaign Goal</label>
              <select
                className="form-input"
                value={form.campaignGoal}
                onChange={e => setForm({ ...form, campaignGoal: e.target.value })}
                style={{ cursor: 'pointer' }}
              >
                <option value="">Select Goal</option>
                {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Budget, Slots & Deadline */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
            <Input
              label="Budget (₹)"
              type="number"
              value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })}
              placeholder="25000"
            />
            <Input
              label="Total Creator Slots"
              type="number"
              min="1"
              value={form.totalSlots}
              onChange={e => setForm({ ...form, totalSlots: e.target.value })}
            />
            <Input
              label="Campaign Deadline *"
              type="date"
              min={minDate}
              value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
            />
          </div>

          {/* Platforms */}
          <div>
            <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>Target Platforms</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PLATFORMS.map(p => {
                const active = form.platforms.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleArr('platforms', p)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 100,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: active ? '1.5px solid var(--acc, #E65F2B)' : '1px solid var(--border)',
                      background: active ? 'rgba(230, 95, 43, 0.15)' : 'var(--s2, rgba(255,255,255,0.05))',
                      color: active ? 'var(--acc, #E65F2B)' : 'var(--t2)',
                      textTransform: 'capitalize',
                      transition: 'all 0.15s'
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deliverables */}
          <div>
            <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>Deliverables</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {DELIVERABLES.map(d => {
                const active = form.deliverables.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleArr('deliverables', d)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 100,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: active ? '1.5px solid var(--acc, #E65F2B)' : '1px solid var(--border)',
                      background: active ? 'rgba(230, 95, 43, 0.15)' : 'var(--s2, rgba(255,255,255,0.05))',
                      color: active ? 'var(--acc, #E65F2B)' : 'var(--t2)',
                      transition: 'all 0.15s'
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Guidelines */}
          <Textarea
            label="Content Guidelines / Creative Brief"
            rows={3}
            value={form.contentGuidelines}
            onChange={e => setForm({ ...form, contentGuidelines: e.target.value })}
            placeholder="Include dos & don'ts, hashtags, talking points..."
          />
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          background: 'var(--s2, rgba(255,255,255,0.02))'
        }}>
          <Btn variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Btn>
          <Btn variant="primary" onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
          </Btn>
        </div>
      </div>
    </div>
  );
}
