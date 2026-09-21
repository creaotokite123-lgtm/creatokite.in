import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles, ArrowLeft, Search, Calendar, Clock, User, ArrowRight,
  ChevronRight, Tag, BookOpen, Layers, Filter, CheckCircle2, Shield, Eye
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'For Creators',
  'For Brands',
  'UGC Marketing',
  'Creator Growth',
  'Creator Economy',
  'CreatoKite'
];

const BLOG_POSTS = [
  {
    id: 'b1',
    slug: 'what-is-ugc-marketing-guide-indian-brands',
    title: 'What Is UGC Marketing? A Practical Guide for Indian Brands',
    subtitle: 'Understand how user-generated content works, where it fits into a brand\'s marketing strategy, and how businesses can work with creators to produce authentic content.',
    category: 'UGC Marketing',
    targetAudience: 'brand',
    articleType: 'Guide',
    readTime: '6 min read',
    publishedAt: 'Sep 22, 2026',
    updatedAt: 'Sep 22, 2026',
    author: {
      name: 'CreatoKite Editorial Team',
      role: 'Creator Economy Hub'
    },
    featured: true,
    banner: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    tags: ['UGC Marketing', 'Brand Strategy', 'Ecommerce Ads', 'Digital Marketing'],
    content: `
      User-Generated Content (UGC) marketing has evolved from a social media trend into a core strategy for digital brands across India. Rather than relying solely on polished studio commercials or celebrity endorsements, brands work with creators to produce relatable, real-life video content.

      ### What Is UGC in Digital Marketing?
      UGC marketing refers to brand-focused content created by independent creators or everyday consumers that resembles organic social media posts. Common formats include:
      - **Product Unboxings & First Impressions:** Showing authentic packaging, texture, and immediate reactions.
      - **Problem-Solution Demonstrations:** Highlighting everyday challenges and how the product solves them.
      - **How-to Tutorials & Reviews:** Demonstrating real usage in daily routines.

      ### Why Indian Brands Are Adopting UGC
      1. **Higher Viewer Trust:** Modern consumers frequently scroll past traditional banner ads. Authentic video content shot on mobile devices feels natural in Instagram Reels and YouTube Shorts feeds.
      2. **Ad Fatigue Relief:** Performance marketing teams need a continuous supply of creative variations to fight ad fatigue on Meta Ads and Google Ads.
      3. **Cost-Effective Scale:** UGC allows brands to test multiple visual hooks and messaging angles without expensive commercial production crews.

      ### How Brands Can Get Started With UGC
      - Define clear campaign objectives (e.g., brand awareness vs. paid ad conversions).
      - Build a structured creator brief outlining core product benefits and key talking points.
      - Select creators based on content quality, niche relevance, and audience alignment rather than raw follower counts alone.
      - Use dedicated collaboration workspaces like CreatoKite to manage briefs, draft reviews, and usage rights.
    `
  },
  {
    id: 'b2',
    slug: 'how-to-build-ugc-portfolio-new-creator',
    title: 'How to Build a UGC Portfolio When You\'re a New Creator',
    subtitle: 'A step-by-step roadmap for beginner creators in India to create sample reels, set up a digital portfolio, and pitch to brands without prior brand deals.',
    category: 'Creator Growth',
    targetAudience: 'creator',
    articleType: 'Playbook',
    readTime: '5 min read',
    publishedAt: 'Sep 20, 2026',
    author: {
      name: 'CreatoKite Editorial Team',
      role: 'Creator Economy Hub'
    },
    featured: false,
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    tags: ['UGC Portfolio', 'New Creator', 'Creator Growth', 'Reels'],
    content: `
      Starting out as a UGC creator doesn't require thousands of followers or expensive camera gear. Because brands hire UGC creators for their content creation skills rather than follower reach, your portfolio is your single most important asset.

      ### 1. Create Spec (Sample) UGC Videos
      You don't need existing brand deals to showcase your skills. Take 3–4 products you already own and use daily (e.g., skincare serums, tech accessories, lifestyle products) and film sample videos:
      - **Problem/Solution Reel:** 15–30 seconds explaining a daily problem and how the product solves it.
      - **Unboxing & Aesthetic Showcase:** Clean lighting with crisp audio commentary.
      - **Voiceover Tutorial:** Step-by-step usage guide with clear voice narration.

      ### 2. Focus on Core Video Elements
      Brands look for specific technical and creative fundamentals:
      - **The 3-Second Hook:** An engaging opening visual or question that captures attention.
      - **Clean Mobile Lighting:** Natural daylight or a simple soft light setup.
      - **Clear Audio:** Crisp voice recording free from background noise.

      ### 3. Organize Your Portfolio
      Set up a clean digital portfolio (via CreatoKite Profile or Google Drive / Canva link) featuring:
      - Short bio and content niches (e.g., Beauty, Tech, Fitness).
      - Embedded video samples categorized by format.
      - Contact details and commercial rate guidelines.
    `
  },
  {
    id: 'b3',
    slug: 'how-brands-find-evaluate-ugc-creators',
    title: 'How Brands Can Find and Evaluate the Right UGC Creators',
    subtitle: 'Key criteria beyond follower counts: content quality, niche relevance, hook structure, and evaluating creator reliability for campaign execution.',
    category: 'For Brands',
    targetAudience: 'brand',
    articleType: 'Guide',
    readTime: '6 min read',
    publishedAt: 'Sep 17, 2026',
    author: {
      name: 'CreatoKite Editorial Team',
      role: 'Brand Strategy'
    },
    featured: false,
    banner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    tags: ['Creator Selection', 'Brand Strategy', 'Campaign Briefs', 'UGC Ads'],
    content: `
      Evaluating UGC creators requires a different framework than traditional influencer marketing. Since the primary goal of UGC is high-quality, authentic ad creative, follower count is rarely the primary metric.

      ### What to Look For When Evaluating Creators

      #### 1. Content Quality & Lighting
      Review the creator's past work or portfolio for clean framing, steady camera work, good natural or studio lighting, and clear audio quality.

      #### 2. Hook Variety & On-Camera Presence
      Check if the creator speaks naturally on camera. Do their video openings feel energetic and engaging, or scripted and stiff?

      #### 3. Niche & Product Fit
      A creator who regularly produces tech reviews will feel more authentic demonstrating a gadget than a creator whose entire feed is dedicated to fashion.

      #### 4. Communication & Reliability
      Timely communication, adherence to brief guidelines, and meeting revision deadlines are essential for smooth campaign execution.

      ### Streamlining Creator Discovery
      Instead of manually sending hundreds of Instagram DMs, brands can use platforms like **CreatoKite** to publish campaign briefs, filter creator applications by niche and location, and manage deliverables in dedicated Campaign Rooms.
    `
  },
  {
    id: 'b4',
    slug: 'ugc-vs-influencer-marketing-difference-indian-brands',
    title: 'UGC vs Influencer Marketing: What\'s the Difference for Indian Businesses?',
    subtitle: 'Comparing cost structures, engagement patterns, content ownership, and performance ad whitelisting between traditional influencer deals and UGC.',
    category: 'UGC Marketing',
    targetAudience: 'brand',
    articleType: 'Insight',
    readTime: '5 min read',
    publishedAt: 'Sep 14, 2026',
    author: {
      name: 'CreatoKite Editorial Team',
      role: 'Creator Economy Hub'
    },
    featured: false,
    banner: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    tags: ['UGC vs Influencer', 'Marketing Strategy', 'ROI', 'Digital Ads'],
    content: `
      While both influencer marketing and UGC rely on content creators, their objectives, pricing models, and usage rights differ significantly.

      ### Key Differences Comparison

      | Feature | Influencer Marketing | UGC Marketing |
      | :--- | :--- | :--- |
      | **Primary Goal** | Reach creator's existing audience | Acquire high-quality ad creative for brand channels |
      | **Key Metric** | Follower reach & impressions | Content quality, hook rate & ad conversions |
      | **Posting Location** | Creator's personal feed | Brand's social feeds & Meta/Google ad accounts |
      | **Usage Rights** | Often limited to organic reposts | Includes commercial ad licensing & whitelisting |
      | **Cost Structure** | Priced by follower tier & reach | Priced by video deliverables & usage rights |

      ### Which Strategy Should Your Brand Choose?
      - **Choose Influencer Marketing** when launching a major brand awareness campaign where a celebrity or macro-influencer's endorsement adds instant social proof.
      - **Choose UGC Marketing** when building performance ad campaigns on Instagram, YouTube Shorts, or Facebook where you need diverse creative variations to drive conversions.
    `
  },
  {
    id: 'b5',
    slug: 'how-much-should-ugc-creators-charge-india-pricing-guide',
    title: 'How Much Should UGC Creators Charge in India? A Realistic Pricing Guide',
    subtitle: 'Breakdown of realistic Indian market pricing factors: video length, batch packages, commercial usage rights, ad whitelisting, and revision terms.',
    category: 'Creator Growth',
    targetAudience: 'creator',
    articleType: 'Guide',
    readTime: '7 min read',
    publishedAt: 'Sep 10, 2026',
    updatedAt: 'Sep 22, 2026',
    author: {
      name: 'CreatoKite Editorial Team',
      role: 'Creator Community'
    },
    featured: false,
    banner: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    tags: ['Creator Pricing', 'UGC Rates India', 'Earnings', 'Commercial Rights'],
    content: `
      Determining commercial rates as a UGC creator in India depends on multiple factors beyond video duration. Understanding usage rights, deliverable packages, and licensing terms ensures fair pricing for both creators and brands.

      ### Factors Influencing UGC Rates in India

      #### 1. Deliverable Complexity & Format
      - **Basic Unboxing / Product Demo (15–30 sec):** Requires simple framing and background music/voiceover.
      - **Full Talking-Head Review (30–60 sec):** Requires scripted hooks, on-camera dialogue, and multi-angle B-roll cuts.

      #### 2. Usage Rights & Ad Licensing
      - **Organic Usage Only:** Brand posts video solely on their official social feeds.
      - **Paid Ad Whitelisting:** Brand runs the video as a paid sponsored ad on Meta/Google for 30, 60, or 90 days. Commercial ad usage typically commands higher rates.

      #### 3. Batch Packages & Volume Discounts
      Offering video packages (e.g., 3 videos with different hooks for 1 campaign) provides better value for brands while increasing overall creator earnings per collaboration.

      ### Best Practices for Quoting Rates
      - Clearly specify what is included (number of revisions, RAW files, delivery timeline).
      - State usage duration explicitly (e.g., 60-day digital ad usage).
      - Maintain transparent pricing on platform profiles like CreatoKite so brands can review rates upfront.
    `
  },
  {
    id: 'b6',
    slug: 'how-to-write-ugc-creator-brief-template',
    title: 'How to Write a UGC Creator Brief That Actually Works',
    subtitle: 'Includes a downloadable brief structure covering campaign goals, product highlights, 3-second hook suggestions, do\'s & don\'ts, and asset delivery specs.',
    category: 'For Brands',
    targetAudience: 'brand',
    articleType: 'Playbook',
    readTime: '5 min read',
    publishedAt: 'Sep 05, 2026',
    author: {
      name: 'CreatoKite Editorial Team',
      role: 'Brand Operations'
    },
    featured: false,
    banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    tags: ['Campaign Brief', 'Brand Playbook', 'Workflow', 'Templates'],
    content: `
      A well-crafted campaign brief is the foundation of successful UGC collaborations. Clear guidelines prevent miscommunication, minimize revision rounds, and ensure deliverables align with campaign goals.

      ### Key Elements of an Effective UGC Brief

      #### 1. Campaign Overview & Target Audience
      Provide context: Who is the ideal customer? What emotion or solution should the video convey?

      #### 2. Video Hook & Angle Suggestions
      Give creators 2–3 recommended 3-second opening hooks. For example:
      - *Visual Hook:* "Stop doing [common mistake] when applying your serum..."
      - *Question Hook:* "Struggling to find a budget-friendly wireless mic?"

      #### 3. Core Talking Points (Do\'s and Don\'ts)
      - Highlight 2–3 key product USPs.
      - List explicit restrictions (e.g., "Do not mention competitor names", "Ensure product logo is visible").

      #### 4. Technical Deliverable Requirements
      - Aspect ratio (9:16 vertical for Reels/Shorts).
      - Resolution (1080p, 60fps recommended).
      - Deadline and submission location.
    `
  },
  {
    id: 'b7',
    slug: 'why-brands-turning-to-ugc-authentic-ads',
    title: 'Why Brands Are Turning to UGC Content for Authentic Ads',
    subtitle: 'How native video reels outperform polished studio ads on Instagram Meta Ads & YouTube Shorts by building organic viewer trust.',
    category: 'Creator Economy',
    targetAudience: 'both',
    articleType: 'Insight',
    readTime: '4 min read',
    publishedAt: 'Aug 30, 2026',
    author: {
      name: 'CreatoKite Editorial Team',
      role: 'Creator Economy Hub'
    },
    featured: false,
    banner: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    tags: ['Creator Economy', 'Consumer Behavior', 'Meta Ads', 'Reels'],
    content: `
      Digital advertising is experiencing a fundamental shift in how consumers process video promotions. Overly polished television-style commercials appearing on mobile feeds are frequently skipped within the first second.

      ### The Native Feed Effect
      UGC content succeeds because it matches the visual aesthetic of the platform it appears on. When a user scrolls through Instagram Reels or YouTube Shorts, a video filmed on a smartphone with natural lighting blends seamlessly with content from friends and creators.

      ### Key Growth Drivers for UGC
      - **Relatability:** Consumers identify with everyday people demonstrating real product usage.
      - **Rapid Creative Iteration:** Marketing teams can quickly test multiple hooks and calls-to-action to identify top-performing ad assets.
      - **Diverse Demographic Representation:** Brands can collaborate with creators across different cities, age groups, and language preferences.
    `
  },
  {
    id: 'b8',
    slug: '5-things-brands-look-for-before-hiring-creator',
    title: '5 Things Brands Look For Before Hiring a Creator for a Campaign',
    subtitle: 'From lighting setup and clear audio to timely communication and compliance — what brand managers check before approving applications.',
    category: 'Creator Growth',
    targetAudience: 'creator',
    articleType: 'Guide',
    readTime: '5 min read',
    publishedAt: 'Aug 24, 2026',
    author: {
      name: 'CreatoKite Editorial Team',
      role: 'Creator Community'
    },
    featured: false,
    banner: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    tags: ['Creator Tips', 'Brand Criteria', 'Hiring', 'Profile Building'],
    content: `
      Understanding how brand managers review creator applications helps creators stand out when applying for campaigns.

      ### 1. High Audio & Video Clarity
      Muffled audio or blurry footage is the most common reason applications are rejected. Investing in a simple lapel microphone and filming in bright lighting immediately elevates your profile.

      ### 2. Natural On-Camera Confidence
      Brand managers look for creators who speak comfortably without sounding robotic or excessively scripted.

      ### 3. Clear Profile & Portfolio Structure
      A complete creator profile detailing your niche, location, sample work, and rates speeds up decision-making.

      ### 4. Attention to Brief Instructions
      Showing that you read the campaign requirements and can deliver specific video formats builds initial trust.

      ### 5. Professionalism & Deadline Adherence
      Creators who submit drafts on time and handle revision requests professionally build long-term relationships with brands and platform coordinators.
    `
  },
  {
    id: 'b9',
    slug: 'how-to-measure-performance-creator-campaign',
    title: 'How to Measure the Performance and Impact of a Creator Campaign',
    subtitle: 'Practical benchmarks for tracking video completion rate, click-through rates (CTR), ROAS, content longevity, and whitelisting ad return.',
    category: 'For Brands',
    targetAudience: 'brand',
    articleType: 'Strategy',
    readTime: '6 min read',
    publishedAt: 'Aug 18, 2026',
    author: {
      name: 'CreatoKite Editorial Team',
      role: 'Brand Analytics'
    },
    featured: false,
    banner: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    tags: ['Campaign Measurement', 'Analytics', 'Ad Metrics', 'ROAS'],
    content: `
      Measuring the success of a creator campaign requires aligning metrics with your original campaign goals.

      ### Top Metrics to Track

      #### 1. Creative Performance Metrics (Top of Funnel)
      - **3-Second Hook Retention Rate:** Percentage of viewers who watch past the opening 3 seconds.
      - **Average Watch Time & Completion Rate:** Indicates whether content holds viewer interest throughout.

      #### 2. Conversion & CTR Metrics (Middle of Funnel)
      - **Click-Through Rate (CTR):** Measures viewer intent when UGC videos are used in performance ads.
      - **Cost Per Click (CPC) & Cost Per Acquisition (CPA):** Comparing UGC ad creative cost vs standard static graphics.

      #### 3. Asset Longevity & Evergreen Value
      Approved UGC assets can be repurposed across email marketing, product landing pages, and organic social feeds, extending campaign value beyond the initial launch window.
    `
  },
  {
    id: 'b10',
    slug: 'how-creatokite-connects-brands-with-relevant-creators',
    title: 'How CreatoKite Connects Brands With Relevant Creators',
    subtitle: 'Inside CreatoKite\'s campaign workflow: how requirement matching, dedicated Campaign Rooms, and verified creator profiles streamline creator marketing.',
    category: 'CreatoKite',
    targetAudience: 'both',
    articleType: 'Product Update',
    readTime: '4 min read',
    publishedAt: 'Aug 10, 2026',
    author: {
      name: 'CreatoKite Team',
      role: 'Product & Platform'
    },
    featured: false,
    banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    tags: ['CreatoKite Platform', 'Product Overview', 'Campaign Workspace'],
    content: `
      CreatoKite is built to simplify creator marketing by replacing fragmented communication with a single unified workspace for brands and creators across India.

      ### How the Platform Works

      #### 1. Campaign Brief Creation
      Brands define campaign requirements, target niches (e.g., Tech, Beauty, Fitness), budget models, and deliverable specs.

      #### 2. Creator Matching & Opportunity Dashboard
      Relevant creator profiles receive campaign briefs on their opportunity dashboard. Creators can review brief terms and apply directly.

      #### 3. Dedicated Campaign Rooms
      Once matched, brands and creators collaborate inside dedicated Campaign Rooms to stream draft videos, review timestamped feedback, and manage final asset approvals.

      #### 4. Transparent Payouts
      Upon deliverable approval, payouts are processed directly through the platform, ensuring clear accounting for brands and reliable compensation for creators.
    `
  }
];

function renderFormattedContent(rawText) {
  if (!rawText) return null;

  const lines = rawText.trim().split('\n');
  const elements = [];
  let currentList = null;
  let listType = null;

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

    if (line.startsWith('#### ')) {
      flushList();
      elements.push(
        <h4 key={i} style={{
          fontSize: 16,
          fontWeight: 800,
          color: '#111827',
          margin: '20px 0 8px',
          letterSpacing: '-0.2px'
        }}>
          {parseInline(line.replace('#### ', ''))}
        </h4>
      );
    } else if (line.startsWith('### ')) {
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
  const [audienceFilter, setAudienceFilter] = useState('all'); // 'all' | 'creator' | 'brand'
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
      let matchCat = activeCategory === 'All';
      if (activeCategory === 'For Creators') {
        matchCat = post.targetAudience === 'creator' || post.targetAudience === 'both' || post.category === 'Creator Growth';
      } else if (activeCategory === 'For Brands') {
        matchCat = post.targetAudience === 'brand' || post.targetAudience === 'both' || post.category === 'For Brands';
      } else if (!matchCat) {
        matchCat = post.category === activeCategory;
      }

      let matchAudience = audienceFilter === 'all';
      if (audienceFilter === 'creator') {
        matchAudience = post.targetAudience === 'creator' || post.targetAudience === 'both' || post.category === 'Creator Growth';
      } else if (audienceFilter === 'brand') {
        matchAudience = post.targetAudience === 'brand' || post.targetAudience === 'both' || post.category === 'For Brands' || post.category === 'UGC Marketing';
      }

      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q ||
        post.title.toLowerCase().includes(q) ||
        post.subtitle.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q));

      return matchCat && matchAudience && matchQuery;
    });
  }, [activeCategory, audienceFilter, searchQuery]);

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
          .blog-audience-cards { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .blog-card-grid { grid-template-columns: 1fr !important; }
          .blog-categories-wrap { overflow-x: auto; flex-wrap: nowrap !important; justify-content: flex-start !important; padding-bottom: 8px; }
        }
      `}</style>

      {/* ── Top Header Bar ───────────────────────────────── */}
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

      {/* ── Hero Banner Section ──────────────────────────── */}
      <section className="blog-hero-section" style={{
        padding: '50px 24px 28px',
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
          <Sparkles size={13} /> CreatoKite Creator Economy Knowledge Hub
        </div>

        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 46px)',
          fontWeight: 900,
          color: '#111827',
          lineHeight: 1.18,
          letterSpacing: '-1px',
          margin: '0 0 14px'
        }}>
          Practical Knowledge for the <span style={{ color: '#E55B2B' }}>Creator Economy</span>
        </h1>

        <p style={{
          fontSize: 'clamp(14.5px, 2.2vw, 16.5px)',
          color: '#4B5563',
          maxWidth: 680,
          margin: '0 auto 26px',
          lineHeight: 1.6,
          fontWeight: 500
        }}>
          Guides, strategies, and insights for creators and brands building better collaborations across India.
        </p>

        {/* Search Bar */}
        <div style={{
          maxWidth: 580,
          margin: '0 auto 20px',
          position: 'relative'
        }}>
          <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Search articles on UGC, pricing, briefs, portfolios..."
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
          marginBottom: 20
        }}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  if (cat === 'For Creators') setAudienceFilter('creator');
                  else if (cat === 'For Brands') setAudienceFilter('brand');
                  else setAudienceFilter('all');
                }}
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

        {/* ── Audience Quick Cards (For Creators / For Brands) ── */}
        <div className="blog-audience-cards" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 14,
          maxWidth: 620,
          margin: '0 auto'
        }}>
          <div
            onClick={() => {
              setAudienceFilter(audienceFilter === 'creator' ? 'all' : 'creator');
              setActiveCategory(audienceFilter === 'creator' ? 'All' : 'For Creators');
            }}
            style={{
              background: audienceFilter === 'creator' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
              border: audienceFilter === 'creator' ? '2px solid #E55B2B' : '1px solid rgba(17, 24, 39, 0.08)',
              borderRadius: 16,
              padding: '14px 18px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: audienceFilter === 'creator' ? '0 6px 20px rgba(229, 91, 43, 0.12)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
                👤 For Creators
              </span>
              <ChevronRight size={14} color={audienceFilter === 'creator' ? '#E55B2B' : '#9CA3AF'} />
            </div>
            <p style={{ fontSize: 11.5, color: '#6B7280', margin: 0, fontWeight: 500 }}>
              Guides to help creators build portfolios, price content &amp; grow.
            </p>
          </div>

          <div
            onClick={() => {
              setAudienceFilter(audienceFilter === 'brand' ? 'all' : 'brand');
              setActiveCategory(audienceFilter === 'brand' ? 'All' : 'For Brands');
            }}
            style={{
              background: audienceFilter === 'brand' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
              border: audienceFilter === 'brand' ? '2px solid #E55B2B' : '1px solid rgba(17, 24, 39, 0.08)',
              borderRadius: 16,
              padding: '14px 18px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: audienceFilter === 'brand' ? '0 6px 20px rgba(229, 91, 43, 0.12)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
                🏢 For Brands
              </span>
              <ChevronRight size={14} color={audienceFilter === 'brand' ? '#E55B2B' : '#9CA3AF'} />
            </div>
            <p style={{ fontSize: 11.5, color: '#6B7280', margin: 0, fontWeight: 500 }}>
              Practical strategies for creator briefs, evaluation &amp; campaigns.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Blog Posts Grid ──────────────────────────── */}
      <main className="blog-main-grid" style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Featured Article Banner (when no search query and All category) */}
        {!searchQuery && activeCategory === 'All' && audienceFilter === 'all' && (
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
              <div style={{
                position: 'absolute', top: 16, left: 16, display: 'flex', gap: 6, flexWrap: 'wrap'
              }}>
                <span style={{
                  background: '#E55B2B', color: '#FFFFFF', padding: '4px 12px',
                  borderRadius: 99, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  ⭐ Featured Guide
                </span>
                {featuredPost.articleType && (
                  <span style={{
                    background: 'rgba(17, 24, 39, 0.85)', backdropFilter: 'blur(8px)',
                    color: '#FFFFFF', padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700
                  }}>
                    {featuredPost.articleType}
                  </span>
                )}
              </div>
            </div>

            <div className="blog-featured-content" style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#6B7280', marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{ color: '#E55B2B', fontWeight: 800, background: 'rgba(229,91,43,0.1)', padding: '2px 8px', borderRadius: 6 }}>
                    {featuredPost.category}
                  </span>
                  <span>•</span>
                  <span><Clock size={12} style={{ display: 'inline', verticalAlign: '-1px' }} /> {featuredPost.readTime}</span>
                  <span>•</span>
                  <span>{featuredPost.publishedAt}</span>
                </div>

                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111827', lineHeight: 1.28, margin: '0 0 10px', letterSpacing: '-0.4px' }}>
                  {featuredPost.title}
                </h2>

                <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, margin: '0 0 20px' }}>
                  {featuredPost.subtitle}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(17,24,39,0.06)', paddingTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, background: 'rgba(229, 91, 43, 0.12)',
                    color: '#E55B2B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800
                  }}>
                    CK
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#111827' }}>{featuredPost.author.name}</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{featuredPost.author.role}</div>
                  </div>
                </div>

                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#E55B2B', fontWeight: 800, fontSize: 13 }}>
                  Read Guide <ArrowRight size={14} />
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
                  <div style={{
                    position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap'
                  }}>
                    <span style={{
                      background: 'rgba(17, 24, 39, 0.88)', backdropFilter: 'blur(8px)',
                      color: '#FFFFFF', padding: '3px 10px', borderRadius: 6, fontSize: 10.5, fontWeight: 700
                    }}>
                      {post.category}
                    </span>
                    {post.articleType && (
                      <span style={{
                        background: '#E55B2B',
                        color: '#FFFFFF', padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800,
                        textTransform: 'uppercase', letterSpacing: '0.03em'
                      }}>
                        {post.articleType}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ padding: '22px 20px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: '#6B7280', marginBottom: 8, flexWrap: 'wrap' }}>
                    <span><Clock size={12} style={{ display: 'inline', verticalAlign: '-1px' }} /> {post.readTime}</span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                    {post.updatedAt && post.updatedAt !== post.publishedAt && (
                      <>
                        <span>•</span>
                        <span style={{ color: '#E55B2B', fontWeight: 600 }}>Updated</span>
                      </>
                    )}
                  </div>

                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111827', lineHeight: 1.3, margin: '0 0 8px', letterSpacing: '-0.2px' }}>
                    {post.title}
                  </h3>

                  <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.55, margin: 0 }}>
                    {post.subtitle}
                  </p>
                </div>
              </div>

              <div style={{ padding: '16px 20px 20px', borderTop: '1px solid rgba(17,24,39,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6, background: 'rgba(229, 91, 43, 0.1)',
                    color: '#E55B2B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800
                  }}>
                    CK
                  </div>
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
            <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Try clearing your search query or selecting a different category filter.</p>
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
            <div style={{ position: 'relative', height: 220, flexShrink: 0, background: '#111827' }}>
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
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{
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

                {selectedArticle.articleType && (
                  <span style={{
                    background: '#111827',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: 99,
                    fontSize: 11,
                    fontWeight: 700
                  }}>
                    {selectedArticle.articleType}
                  </span>
                )}
              </div>

              <h2 style={{
                fontSize: 'clamp(22px, 3.5vw, 28px)',
                fontWeight: 900,
                color: '#111827',
                lineHeight: 1.25,
                margin: '0 0 12px',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, background: 'rgba(229, 91, 43, 0.12)',
                    color: '#E55B2B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800
                  }}>
                    CK
                  </div>
                  <div>
                    <strong style={{ color: '#111827' }}>{selectedArticle.author.name}</strong> · {selectedArticle.author.role}
                  </div>
                </div>
                <span>•</span>
                <span>{selectedArticle.publishedAt}</span>
                {selectedArticle.updatedAt && (
                  <>
                    <span>•</span>
                    <span style={{ color: '#E55B2B', fontWeight: 600 }}>Updated {selectedArticle.updatedAt}</span>
                  </>
                )}
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
