import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles, ArrowLeft, Search, Calendar, Clock, User, ArrowRight,
  TrendingUp, Award, Zap, Shield, ChevronRight, CheckCircle2,
  Share2, Tag, BookOpen, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

const BLOG_POSTS = [
  {
    id: 'b1',
    slug: 'ai-creator-matching-roi',
    title: 'How CreatoKite AI Creator Matching Delivers 3.5x Higher Campaign ROI',
    subtitle: 'Moving beyond raw follower counts to intelligent niche alignment, engagement quality, and Creator DNA.',
    category: 'UGC Strategy',
    readTime: '4 min read',
    publishedAt: 'September 18, 2026',
    author: {
      name: 'CreatoKite Growth Team',
      role: 'Platform Intelligence',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
    },
    featured: true,
    banner: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    tags: ['AI Matching', 'Brand ROI', 'Creator DNA', 'Performance Marketing'],
    content: `
      In today's fast-moving digital ecosystem, vanity metrics like gross follower counts no longer guarantee high conversion rates. Brands across India often spend substantial budgets on influencer marketing only to encounter low engagement and mismatched audience demographics.

      ### The CreatoKite Solution: Multi-Dimensional Matching
      CreatoKite was engineered from the ground up to solve this fundamental mismatch. Rather than treating creators as static follower counts, CreatoKite analyzes:
      - **Niche Congruence:** Direct semantic alignment between brand campaign briefs and creator content history (e.g., Tech, Beauty, Fitness, Fashion).
      - **Audience Locality:** Regional language proficiency and audience distribution across Pan-India metro and Tier-2/Tier-3 cities.
      - **Engagement Consistency:** True view-to-interaction ratios screened through our automated analytics engine.

      ### Proven Results in Real Campaigns
      By routing briefs directly through CreatoKite Campaign Rooms and utilizing intelligent scoring, partner brands consistently achieve up to **3.5x higher engagement rates** and significantly lower cost-per-acquisition (CPA) compared to traditional agency outreach.
    `
  },
  {
    id: 'b2',
    slug: 'creator-monetization-blueprint',
    title: 'The UGC Creator Monetization Blueprint: Scaling Your Earnings on CreatoKite',
    subtitle: 'A step-by-step roadmap to verified creator status, high-tier campaign invitations, and instant wallet payouts.',
    category: 'Creator Growth',
    readTime: '5 min read',
    publishedAt: 'September 15, 2026',
    author: {
      name: 'Priya Sharma',
      role: 'Creator Community Lead',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    featured: false,
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    tags: ['Creator Monetization', 'UGC Portfolio', 'Badges', 'Earnings'],
    content: `
      Whether you are just starting out as a UGC creator or already produce daily content for Instagram Reels and YouTube Shorts, CreatoKite provides the structured ecosystem to turn your creative talent into sustainable, recurring income.

      ### 1. Build a High-Trust Portfolio on CreatoKite
      Completing your onboarding profile with sample video reels, commercial rates, and camera capabilities (UGC, on-camera, voiceover) allows CreatoKite AI to index your profile for relevant brand searches.

      ### 2. Boost Your Creator Authenticity Score (CAS)
      Every completed campaign and verified draft submission directly boosts your CreatoKite score and platform rank. Top-tier creators receive priority auto-invitations to high-budget brand partnerships with zero agency commission cuts.

      ### 3. Transparent Payouts
      CreatoKite ensures direct bank transfer and UPI payout dispatch once campaign deliverables are approved in the Campaign Room. No delayed checks, no opaque payment terms.
    `
  },
  {
    id: 'b3',
    slug: 'creator-authenticity-score-cas',
    title: 'Demystifying the Creator Authenticity Score (CAS) & Live Social Sync',
    subtitle: 'How CreatoKite evaluates genuine audience trust, organic view velocity, and risk levels.',
    category: 'Platform Intelligence',
    readTime: '6 min read',
    publishedAt: 'September 10, 2026',
    author: {
      name: 'Rohan Verma',
      role: 'Head of Data Science',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    featured: false,
    banner: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    tags: ['CAS Engine', 'Social Sync', 'Algorithm', 'Trust Score'],
    content: `
      Fake follower growth and artificial engagement pods cost the advertising industry millions annually. CreatoKite addresses this challenge with our proprietary **Creator Authenticity Score (CAS)**.

      ### Key Factors Behind the CAS Algorithm
      - **View-to-Follower Ratio:** Evaluates whether active followers actually view and interact with video deliverables.
      - **Comment Quality & Sentiment:** Distinguishes genuine creator-fan community dialogue from spam or automated bots.
      - **Post Velocity & Consistency:** Measures long-term publishing momentum rather than one-time viral spikes.

      With one-click live social syncing, creators on CreatoKite keep their platform scores automatically updated to win verified badges and premium brand deals.
    `
  },
  {
    id: 'b4',
    slug: 'why-brands-choose-creatokite',
    title: 'Why Indian Brands Are Transitioning from Mega-Influencers to CreatoKite UGC',
    subtitle: 'The shift toward relatable consumer testimonials, authentic unboxings, and high-converting ad whitelisting.',
    category: 'Brand Strategy',
    readTime: '4 min read',
    publishedAt: 'September 05, 2026',
    author: {
      name: 'CreatoKite Brand Solutions',
      role: 'Enterprise Team',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    featured: false,
    banner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    tags: ['UGC Ads', 'D2C Brands', 'Campaign Efficiency', 'Whitelisting'],
    content: `
      High-growth Direct-to-Consumer (D2C) brands in fashion, beauty, food, and tech are increasingly recognizing that slick studio commercials and mega-celebrity endorsements often fail to build trust with discerning buyers.

      ### The Power of Authentic UGC
      User-Generated Content created by genuine niche advocates looks natural in Instagram Reels and YouTube feeds. CreatoKite allows brands to:
      1. Launch briefs with granular requirements and target audience filters.
      2. Review and collaborate directly with assigned creators inside dedicated Campaign Rooms.
      3. Obtain whitelisting rights to scale high-performing UGC videos as Meta & Google performance ads.
    `
  },
  {
    id: 'b5',
    slug: 'campaign-rooms-collaboration-guide',
    title: 'Inside CreatoKite Campaign Rooms: Real-Time Collaboration & Approvals',
    subtitle: 'How our unified workspace replaces messy email threads and WhatsApp groups with organized video tracking.',
    category: 'Platform Updates',
    readTime: '3 min read',
    publishedAt: 'August 28, 2026',
    author: {
      name: 'Product Team',
      role: 'CreatoKite Engineering',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop'
    },
    featured: false,
    banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    tags: ['Campaign Rooms', 'Collaboration', 'Workflow', 'Product Update'],
    content: `
      Managing influencer campaigns across multiple channels often results in lost draft links, missed deadlines, and miscommunicated revisions. 

      **CreatoKite Campaign Rooms** bring the brand manager, assigned creators, and platform coordinators into a single, real-time workspace.
      - Upload and stream video drafts directly inside the room.
      - Add timestamped revision notes and approve captions.
      - Track delivery countdowns and receive instant socket notifications when deliverables are published.
    `
  },
  {
    id: 'b6',
    slug: 'creatokite-creator-playbook-video-skills',
    title: 'CreatoKite Creator Playbook: Master 3-Second Hooks, UGC Lighting & Ad Scripts',
    subtitle: 'Proven tips, frameworks, and insights to help creators produce winning, high-converting video content.',
    category: 'Creator Growth',
    readTime: '4 min read',
    publishedAt: 'August 20, 2026',
    author: {
      name: 'CreatoKite Team',
      role: 'Growth & Strategy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
    },
    featured: false,
    banner: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    tags: ['Creator Playbook', 'Video Skills', 'Lighting Tips', 'Scriptwriting'],
    content: `
      CreatoKite is more than a marketplace — it is an ecosystem designed to elevate creators at every stage. In this **CreatoKite Creator Playbook**, we share essential frameworks for:
      - Crafting thumb-stopping 3-second video hooks.
      - Budget-friendly lighting and mobile microphone setups for crisp UGC audio.
      - Structuring problem-solution product scripts that convert viewers into customers.

      Follow these best practices to increase your Creator Authenticity Score (CAS) and unlock top brand collaborations!
    `
  }
];

const CATEGORIES = ['All', 'UGC Strategy', 'Creator Growth', 'Platform Intelligence', 'Brand Strategy', 'Platform Updates'];

function renderFormattedContent(rawText) {
  if (!rawText) return null;

  const lines = rawText.trim().split('\n');
  const elements = [];
  let currentList = null;
  let listType = null; // 'ul' | 'ol'

  const parseInline = (text) => {
    const parts = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const matchText = match[0];
      if (matchText.startsWith('**') && matchText.endsWith('**')) {
        parts.push(<strong key={match.index} style={{ color: '#111827', fontWeight: 700 }}>{matchText.slice(2, -2)}</strong>);
      } else if (matchText.startsWith('*') && matchText.endsWith('*')) {
        parts.push(<em key={match.index} style={{ color: '#1F2937' }}>{matchText.slice(1, -1)}</em>);
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  };

  const flushList = () => {
    if (currentList && currentList.length > 0) {
      if (listType === 'ol') {
        elements.push(
          <ol key={`ol-${elements.length}`} style={{ paddingLeft: 22, margin: '10px 0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {currentList.map((item, idx) => (
              <li key={idx} style={{ fontSize: 15, lineHeight: 1.7, color: '#374151' }}>
                {parseInline(item)}
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} style={{ paddingLeft: 22, margin: '10px 0 16px', display: 'flex', flexDirection: 'column', gap: 8, listStyleType: 'disc' }}>
            {currentList.map((item, idx) => (
              <li key={idx} style={{ fontSize: 15, lineHeight: 1.7, color: '#374151' }}>
                {parseInline(item)}
              </li>
            ))}
          </ul>
        );
      }
      currentList = null;
      listType = null;
    }
  };

  lines.forEach((rawLine, i) => {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      return;
    }

    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={i} style={{
          fontSize: 18,
          fontWeight: 800,
          color: '#111827',
          margin: '24px 0 10px',
          letterSpacing: '-0.3px',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span style={{ width: 4, height: 18, background: '#E55B2B', borderRadius: 4, display: 'inline-block' }} />
          <span>{parseInline(line.replace('### ', ''))}</span>
        </h3>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={i} style={{
          fontSize: 21,
          fontWeight: 900,
          color: '#111827',
          margin: '28px 0 12px',
          letterSpacing: '-0.4px'
        }}>
          {parseInline(line.replace('## ', ''))}
        </h2>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
        currentList = [];
      }
      currentList.push(line.replace(/^[-*]\s+/, ''));
    } else if (/^\d+\.\s+/.test(line)) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
        currentList = [];
      }
      currentList.push(line.replace(/^\d+\.\s+/, ''));
    } else {
      flushList();
      elements.push(
        <p key={i} style={{ fontSize: 15, lineHeight: 1.75, color: '#374151', margin: '0 0 14px' }}>
          {parseInline(line)}
        </p>
      );
    }
  });

  flushList();
  return elements;
}

export default function Blog() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedArticle]);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchCat = activeCategory === 'All' || post.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q ||
        post.title.toLowerCase().includes(q) ||
        post.subtitle.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [activeCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];
  }, []);

  return (
    <div className="blog-page-root" style={{
      minHeight: '100vh',
      background: '#FAF7F2',
      color: '#111827',
      fontFamily: '"Figtree", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <style>{`
        .blog-modal-box::-webkit-scrollbar {
          width: 6px;
        }
        .blog-modal-box::-webkit-scrollbar-track {
          background: #F3EFEA;
          border-radius: 99px;
        }
        .blog-modal-box::-webkit-scrollbar-thumb {
          background: rgba(17, 24, 39, 0.25);
          border-radius: 99px;
        }
        .blog-modal-box::-webkit-scrollbar-thumb:hover {
          background: #E55B2B;
        }
        @media (max-width: 768px) {
          .blog-top-bar { padding: 12px 16px !important; }
          .blog-hero-section { padding: 36px 16px 20px !important; }
          .blog-main-grid { padding: 0 16px 60px !important; }
          .blog-featured-card { grid-template-columns: 1fr !important; }
          .blog-featured-content { padding: 22px 18px !important; }
          .blog-modal-box { border-radius: 18px !important; max-height: 92vh !important; }
          .blog-header-actions { width: 100%; justify-content: space-between; }
          .blog-header-actions button { flex: 1; text-align: center; }
        }
        @media (max-width: 480px) {
          .blog-card-grid { grid-template-columns: 1fr !important; }
          .blog-categories-wrap { overflow-x: auto; flex-wrap: nowrap !important; justify-content: flex-start !important; padding-bottom: 8px; }
        }
      `}</style>

      {/* ── Top Header ───────────────────────────────────── */}
      <header className="blog-top-bar" style={{
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
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
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
              Creato<span style={{ color: '#E55B2B' }}>Kite</span> <span style={{ fontSize: 14, fontWeight: 700, color: '#6B7280', marginLeft: 4 }}>Blog</span>
            </span>
          </Link>
        </div>

        <div className="blog-header-actions" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => navigate('/register?role=creator')}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: '1px solid rgba(229, 91, 43, 0.3)',
              background: 'rgba(229, 91, 43, 0.08)',
              color: '#E55B2B',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Join as Creator
          </button>
          <button
            onClick={() => navigate('/register?role=brand')}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: 'none',
              background: '#E55B2B',
              color: '#FFFFFF',
              fontSize: 12.5,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(229, 91, 43, 0.25)'
            }}
          >
            Launch Campaign
          </button>
        </div>
      </header>

      {/* ── Hero Banner ──────────────────────────────────── */}
      <section className="blog-hero-section" style={{
        padding: '50px 24px 30px',
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
          <Sparkles size={13} /> The Official CreatoKite Insights &amp; Growth Hub
        </div>

        <h1 style={{
          fontSize: 'clamp(30px, 5.5vw, 48px)',
          fontWeight: 900,
          color: '#111827',
          lineHeight: 1.15,
          letterSpacing: '-1px',
          margin: '0 0 16px'
        }}>
          Stories, Playbooks &amp; Intelligence for the <span style={{ color: '#E55B2B' }}>Creator Economy</span>
        </h1>

        <p style={{
          fontSize: 'clamp(14.5px, 2.2vw, 17px)',
          color: '#4B5563',
          maxWidth: 680,
          margin: '0 auto 28px',
          lineHeight: 1.6
        }}>
          Master UGC video marketing, understand CreatoKite's AI matching algorithms, and scale brand campaigns with authentic creator partnerships across India.
        </p>

        {/* Search Bar & Category Filter */}
        <div style={{
          maxWidth: 600,
          margin: '0 auto 24px',
          position: 'relative'
        }}>
          <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Search articles on UGC, AI matching, CAS score, earnings..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: 48,
              padding: '0 16px 0 46px',
              borderRadius: 14,
              border: '1px solid rgba(17, 24, 39, 0.12)',
              background: '#FFFFFF',
              color: '#111827',
              fontSize: 14,
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Categories Carousel */}
        <div className="blog-categories-wrap" style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 10
        }}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 99,
                  border: active ? '1px solid #E55B2B' : '1px solid rgba(17, 24, 39, 0.1)',
                  background: active ? '#E55B2B' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#4B5563',
                  fontWeight: active ? 800 : 600,
                  fontSize: 12.5,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Main Blog Posts Grid ──────────────────────────── */}
      <main className="blog-main-grid" style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Featured Article Banner (if no specific search query) */}
        {!searchQuery && activeCategory === 'All' && (
          <div
            className="blog-featured-card"
            onClick={() => setSelectedArticle(featuredPost)}
            style={{
              background: '#FFFFFF',
              borderRadius: 24,
              border: '1px solid rgba(17, 24, 39, 0.08)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 0,
              marginBottom: 40,
              boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 22px 45px -12px rgba(229, 91, 43, 0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 15px 35px -10px rgba(0, 0, 0, 0.05)';
            }}
          >
            <div style={{ position: 'relative', minHeight: 280, background: '#111827' }}>
              <img
                src={featuredPost.banner}
                alt={featuredPost.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
              />
              <span style={{
                position: 'absolute', top: 16, left: 16,
                background: '#E55B2B', color: '#FFFFFF', padding: '4px 12px',
                borderRadius: 99, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>
                ⭐ Featured Story
              </span>
            </div>

            <div className="blog-featured-content" style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#6B7280', marginBottom: 12 }}>
                  <span style={{ color: '#E55B2B', fontWeight: 800, background: 'rgba(229,91,43,0.1)', padding: '2px 8px', borderRadius: 6 }}>
                    {featuredPost.category}
                  </span>
                  <span>•</span>
                  <span><Clock size={12} style={{ display: 'inline', verticalAlign: '-1px' }} /> {featuredPost.readTime}</span>
                  <span>•</span>
                  <span>{featuredPost.publishedAt}</span>
                </div>

                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111827', lineHeight: 1.25, margin: '0 0 10px' }}>
                  {featuredPost.title}
                </h2>

                <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, margin: '0 0 20px' }}>
                  {featuredPost.subtitle}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(17,24,39,0.06)', paddingTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={featuredPost.author.avatar} alt={featuredPost.author.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#111827' }}>{featuredPost.author.name}</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{featuredPost.author.role}</div>
                  </div>
                </div>

                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#E55B2B', fontWeight: 800, fontSize: 13 }}>
                  Read Article <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="blog-card-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 24
        }}>
          {filteredPosts.map(post => (
            <article
              key={post.id}
              onClick={() => setSelectedArticle(post)}
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                border: '1px solid rgba(17, 24, 39, 0.08)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 25px -6px rgba(0, 0, 0, 0.04)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 18px 35px -8px rgba(229, 91, 43, 0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px -6px rgba(0, 0, 0, 0.04)';
              }}
            >
              <div>
                <div style={{ height: 180, background: '#111827', position: 'relative' }}>
                  <img
                    src={post.banner}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute', top: 12, left: 12,
                    background: 'rgba(17, 24, 39, 0.85)', backdropFilter: 'blur(8px)',
                    color: '#FFFFFF', padding: '3px 10px', borderRadius: 6, fontSize: 10.5, fontWeight: 700
                  }}>
                    {post.category}
                  </span>
                </div>

                <div style={{ padding: '22px 20px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: '#6B7280', marginBottom: 8 }}>
                    <span><Clock size={12} style={{ display: 'inline', verticalAlign: '-1px' }} /> {post.readTime}</span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                  </div>

                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', lineHeight: 1.3, margin: '0 0 8px' }}>
                    {post.title}
                  </h3>

                  <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.55, margin: 0 }}>
                    {post.subtitle}
                  </p>
                </div>
              </div>

              <div style={{ padding: '16px 20px 20px', borderTop: '1px solid rgba(17,24,39,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={post.author.avatar} alt={post.author.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{post.author.name}</span>
                </div>

                <span style={{ fontSize: 12, fontWeight: 800, color: '#E55B2B', display: 'flex', alignItems: 'center', gap: 3 }}>
                  Read <ChevronRight size={13} />
                </span>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#FFFFFF',
            borderRadius: 20,
            border: '1px solid rgba(17,24,39,0.08)'
          }}>
            <Search size={36} color="#9CA3AF" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>No matching articles found</h3>
            <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Try clearing your search query or selecting a different topic.</p>
          </div>
        )}

      </main>

      {/* ── Article Detail Modal ─────────────────────────── */}
      {selectedArticle && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 17, 23, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px'
        }} onClick={() => setSelectedArticle(null)}>
          <div className="blog-modal-box" style={{
            background: '#FFFFFF',
            border: '1px solid rgba(17, 24, 39, 0.1)',
            borderRadius: 24,
            maxWidth: 740,
            width: '100%',
            maxHeight: 'min(88vh, 820px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: 0,
            position: 'relative',
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column'
          }} onClick={e => e.stopPropagation()}>

            {/* Modal Header Banner Image */}
            <div style={{ position: 'relative', height: 200, flexShrink: 0, background: '#111827' }}>
              <img
                src={selectedArticle.banner}
                alt={selectedArticle.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => setSelectedArticle(null)}
                style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'rgba(15, 17, 23, 0.75)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  width: 32, height: 32, borderRadius: '50%',
                  fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
              <span style={{
                display: 'inline-block',
                background: 'rgba(229,91,43,0.1)',
                color: '#E55B2B',
                padding: '4px 12px',
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {selectedArticle.category}
              </span>

              <h2 style={{
                fontSize: 'clamp(22px, 3.5vw, 28px)',
                fontWeight: 900,
                color: '#111827',
                lineHeight: 1.25,
                margin: '12px 0 10px',
                letterSpacing: '-0.5px'
              }}>
                {selectedArticle.title}
              </h2>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 12.5,
                color: '#6B7280',
                paddingBottom: 18,
                borderBottom: '1px solid rgba(17,24,39,0.08)',
                marginBottom: 20,
                flexWrap: 'wrap'
              }}>
                <img src={selectedArticle.author.avatar} alt={selectedArticle.author.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <strong style={{ color: '#111827' }}>{selectedArticle.author.name}</strong> · {selectedArticle.author.role}
                </div>
                <span>•</span>
                <span>{selectedArticle.publishedAt}</span>
                <span>•</span>
                <span>{selectedArticle.readTime}</span>
              </div>

              {/* Formatted Article Body */}
              <div className="blog-modal-text-content">
                {renderFormattedContent(selectedArticle.content)}
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 28, paddingTop: 18, borderTop: '1px solid rgba(17,24,39,0.08)' }}>
                {selectedArticle.tags.map(t => (
                  <span key={t} style={{ fontSize: 11.5, padding: '4px 10px', background: '#FAF7F2', borderRadius: 8, color: '#4B5563', fontWeight: 600, border: '1px solid rgba(17,24,39,0.06)' }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ───────────────────────────────────────── */}
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
            <Link to="/blog" style={{ color: '#4B5563', textDecoration: 'none', fontWeight: 700 }}>Blog</Link>
            <Link to="/privacy" style={{ color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>
            <Link to="/security" style={{ color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>Security Info</Link>
            <Link to="/terms" style={{ color: '#4B5563', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
