import { useState, useEffect, useRef } from 'react';
import { ecosystemAPI } from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { PageLoader, Btn, Avatar, Input, Textarea, renderTextWithLinks } from '../../components/ui';
import toast from 'react-hot-toast';
import { MessageSquare, ThumbsUp, Send, Share2, Plus, Sparkles, Megaphone, Filter, ChevronDown, Check } from 'lucide-react';
import CreatorShell from './CreatorShell';

const CATEGORIES = ['General', 'Knowledge Sharing', 'Q&A', 'Feedback'];

function decodeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Create post states
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postCat, setPostCat] = useState('General');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [creating, setCreating] = useState(false);

  // Comments state
  const [activePostId, setActivePostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchPosts = () => {
    ecosystemAPI.getPosts({
      category: category === 'all' ? undefined : category,
      search: search || undefined
    })
      .then(d => setPosts(d.posts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, [category, search]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Title and content are required');
      return;
    }
    setCreating(true);
    
    // Filter out blank poll options
    const activePolls = pollOptions.filter(o => o.trim() !== '');

    try {
      await ecosystemAPI.createPost({
        title,
        content,
        category: postCat,
        pollOptions: activePolls.length > 0 ? activePolls : undefined
      });
      toast.success('Post created! +10 XP awarded.');
      setShowCreate(false);
      setTitle('');
      setContent('');
      setPollOptions(['', '']);
      fetchPosts();
    } catch(err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await ecosystemAPI.likePost(id);
      setPosts(prev => prev.map(p => p._id === id ? { ...p, likes: res.likes } : p));
    } catch(e) {}
  };

  const handleVote = async (postId, optionIndex) => {
    try {
      const res = await ecosystemAPI.votePoll(postId, { optionIndex });
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, pollOptions: res.pollOptions } : p));
      toast.success('Vote counted!');
    } catch(e) {}
  };

  const toggleComments = async (postId) => {
    if (activePostId === postId) {
      setActivePostId(null);
      return;
    }
    setActivePostId(postId);
    setCommentText('');
    try {
      const res = await ecosystemAPI.getComments(postId);
      setComments(res.comments || []);
    } catch(e) {}
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await ecosystemAPI.addComment(activePostId, { text: commentText });
      setComments(prev => [...prev, res.comment]);
      setCommentText('');
      setPosts(prev => prev.map(p => p._id === activePostId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p));
      toast.success('Comment added!');
    } catch(err) {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading && posts.length === 0) return <PageLoader />;

  return (
    <CreatorShell style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* ── Top Controls & Category Filter Dropdown ───────── */}
      <div style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--glass-border)',
        borderRadius: 20,
        padding: '16px 20px',
        boxShadow: 'var(--glass-shadow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        position: 'relative',
        zIndex: dropdownOpen ? 120 : 30
      }}>
        {/* Search */}
        <div style={{ flex: '1 1 220px', minWidth: 180 }}>
          <input
            className="form-input"
            style={{
              width: '100%',
              height: 42,
              padding: '0 16px',
              borderRadius: 12,
              border: '1px solid var(--border)',
              background: 'var(--s1)',
              color: 'var(--t1)',
              fontSize: 13
            }}
            placeholder="🔍 Search posts or discussions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Right side controls: Category Filter Dropdown + Create Post Button strictly side-by-side */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'nowrap',
          flex: '1 1 auto',
          justifyContent: 'flex-end',
          position: 'relative',
          zIndex: dropdownOpen ? 130 : 35,
          minWidth: 0
        }}>
          {/* Category Dropdown Filter */}
          <div ref={dropdownRef} style={{ position: 'relative', flex: '1 1 auto', minWidth: 140, maxWidth: 260 }}>
            <button
              type="button"
              onClick={() => setDropdownOpen(o => !o)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                width: '100%',
                height: 42,
                padding: '0 12px',
                borderRadius: 12,
                background: 'var(--s1)',
                border: dropdownOpen ? '1.5px solid var(--acc, #E65F2B)' : '1px solid var(--border)',
                color: 'var(--t1)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: dropdownOpen ? '0 0 0 3px rgba(230,95,43,0.15)' : 'none',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', minWidth: 0 }}>
                <Filter size={14} style={{ color: 'var(--acc, #E65F2B)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 750, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {category === 'all' ? 'All Discussions' : category}
                </span>
              </div>
              <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--t3)', flexShrink: 0, marginLeft: 4 }} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  zIndex: 9999,
                  minWidth: 210,
                  background: 'var(--s1)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  boxShadow: '0 18px 45px rgba(0,0,0,0.5)',
                  padding: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  animation: 'fadeIn 0.15s ease-out'
                }}
              >
                <div style={{ padding: '6px 10px', fontSize: 10.5, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid var(--border)' }}>
                  Category Filters
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 }}>
                  <div
                    onClick={() => {
                      setCategory('all');
                      setDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: category === 'all' ? 'rgba(230, 95, 43, 0.12)' : 'transparent',
                      color: category === 'all' ? 'var(--acc, #E65F2B)' : 'var(--t1)',
                      fontWeight: category === 'all' ? 800 : 600,
                      fontSize: 12.5,
                      border: category === 'all' ? '1px solid rgba(230,95,43,0.3)' : '1px solid transparent',
                      transition: 'background 0.12s'
                    }}
                    onMouseEnter={e => category !== 'all' && (e.currentTarget.style.background = 'rgba(230,95,43,0.06)')}
                    onMouseLeave={e => category !== 'all' && (e.currentTarget.style.background = 'transparent')}
                  >
                    <span>🌎 All Discussions</span>
                    {category === 'all' && <Check size={14} color="var(--acc, #E65F2B)" />}
                  </div>

                  {CATEGORIES.map(c => {
                    const isSelected = category === c;
                    return (
                      <div
                        key={c}
                        onClick={() => {
                          setCategory(c);
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
                        onMouseEnter={e => !isSelected && (e.currentTarget.style.background = 'rgba(230,95,43,0.06)')}
                        onMouseLeave={e => !isSelected && (e.currentTarget.style.background = 'transparent')}
                      >
                        <span>{c}</span>
                        {isSelected && <Check size={14} color="var(--acc, #E65F2B)" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Create Post Button side-by-side with Dropdown */}
          <Btn
            variant="primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              height: 42,
              borderRadius: 12,
              padding: '0 18px',
              fontWeight: 700,
              flexShrink: 0,
              whiteSpace: 'nowrap'
            }}
            onClick={() => setShowCreate(true)}
          >
            <Plus size={16} /> Create Post
          </Btn>
        </div>
      </div>

      {/* ── Create Post Card Toggle ────────────────────────── */}
      {showCreate && (
        <div className="card" style={{ border: '1px solid rgba(230,95,43,0.22)', background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)', borderRadius: 20, padding: 24, boxShadow: 'var(--glass-shadow)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, fontFamily: 'var(--fh)', color: 'var(--t1)' }}>New Discussion</h3>
          <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="grid-2" style={{ gap: 16 }}>
              <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="What is on your mind?" />
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, fontSize: 12, marginBottom: 6, display: 'block' }}>Category</label>
                <select className="form-input" value={postCat} onChange={e => setPostCat(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--s1)', color: 'var(--t1)' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <Textarea label="Discussion Content" value={content} onChange={e => setContent(e.target.value)} placeholder="Share your experience, ask questions, or link guides..." style={{ minHeight: 100 }} />
            
            {/* Optional Poll Fields */}
            <div style={{ background: 'rgba(255,255,255,0.01)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.3 }}>📊 Create a Poll (Optional)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pollOptions.map((opt, oIdx) => (
                  <input key={oIdx} className="form-input" style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--s1)', color: 'var(--t1)', fontSize: 12 }}
                    placeholder={`Option ${oIdx+1}`} value={opt}
                    onChange={e => {
                      const copy = [...pollOptions];
                      copy[oIdx] = e.target.value;
                      setPollOptions(copy);
                    }} />
                ))}
                <button type="button" className="btn btn-ghost btn-sm" style={{ fontSize: 11, alignSelf: 'flex-start', border: '1px dashed var(--border)', padding: '4px 10px', borderRadius: 6, cursor: 'pointer' }}
                  onClick={() => setPollOptions(prev => [...prev, ''])}>
                  + Add Option
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Btn variant="secondary" type="button" onClick={() => setShowCreate(false)} style={{ height: 36, borderRadius: 8, padding: '0 16px' }}>Cancel</Btn>
              <Btn variant="primary" type="submit" disabled={creating} style={{ height: 36, borderRadius: 8, padding: '0 18px', fontWeight: 700 }}>
                {creating ? 'Posting...' : 'Publish Post'}
              </Btn>
            </div>
          </form>
        </div>
      )}

      {/* ── Posts Feed ─────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {posts.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--t3)', borderRadius: 20, fontWeight: 500 }}>
            No discussions found. Start a new conversation!
          </div>
        ) : (
          posts.map(post => {
            const hasLiked = post.likes?.includes(user?._id);
            const totalVotes = post.pollOptions?.reduce((s, o) => s + (o.votes?.length || 0), 0) || 0;
            const isCommentsOpen = activePostId === post._id;

            return (
              <div key={post._id} style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'var(--glass-blur)',
                WebkitBackdropFilter: 'var(--glass-blur)',
                border: post.isAnnouncement ? '1px solid rgba(255,107,87,0.25)' : '1px solid var(--glass-border)',
                borderRadius: 20,
                padding: 24,
                boxShadow: 'var(--glass-shadow)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
              >
                {/* Author Info */}
                {(() => {
                  const isOfficial = post.creator?.role === 'superadmin' || post.creator?.role === 'admin' || post.isAnnouncement;
                  const authorAvatar = isOfficial ? '/logo.jpeg' : post.creator?.avatar;
                  const authorName   = isOfficial ? 'CreatoKite' : post.creator?.displayName;
                  const authorHandle = isOfficial ? 'creatokite' : (post.creator?.handle || 'creator');

                  return (
                    <div className="flex-between" style={{ marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar src={authorAvatar} name={authorName} size={40} />
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--t1)', fontFamily: 'var(--fh)' }}>
                            {authorName}
                            {isOfficial ? (
                              <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 99, background: 'rgba(230,95,43,0.12)', color: 'var(--acc)', border: '1px solid rgba(230,95,43,0.25)', fontWeight: 800 }}>
                                OFFICIAL
                              </span>
                            ) : null}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500 }}>
                            @{authorHandle} {isOfficial ? '· Official Team' : `· ${post.creator?.rank || 'Bronze'}`}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {post.isAnnouncement && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9.5, padding: '3px 9px', borderRadius: 99, background: 'rgba(212,162,76,0.15)', color: 'var(--gold)', border: '1px solid rgba(212,162,76,0.25)', fontWeight: 800 }}>
                            <Megaphone size={10} /> ANNOUNCEMENT
                          </span>
                        )}
                        <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 99, background: 'rgba(74,62,61,0.06)', color: 'var(--t2)', border: '1px solid var(--border)', fontWeight: 700 }}>
                          {post.category}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Content */}
                <h3 style={{ fontSize: 15.5, fontWeight: 800, marginBottom: 10, color: 'var(--t1)', fontFamily: 'var(--fh)' }}>{decodeHTML(post.title)}</h3>
                <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: 18, fontWeight: 500, wordBreak: 'break-word' }}>
                  {renderTextWithLinks(decodeHTML(post.content))}
                </div>

                {/* Optional Poll Rendering */}
                {post.pollOptions && post.pollOptions.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', padding: 16, borderRadius: 12, marginBottom: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {post.pollOptions.map((opt, oIdx) => {
                      const voteCount = opt.votes?.length || 0;
                      const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                      const hasVoted = opt.votes?.includes(user?._id);

                      return (
                        <div key={oIdx} onClick={() => handleVote(post._id, oIdx)}
                          style={{
                            position: 'relative', display: 'flex', justifyContent: 'space-between',
                            padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 10,
                            cursor: 'pointer', background: 'var(--bg)', overflow: 'hidden', transition: 'border-color 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--p2)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                        >
                          {/* Progress bar fill background */}
                          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: 'rgba(230,95,43,0.1)', transition: 'width 0.3s' }}/>
                          <span style={{ fontSize: 12, fontWeight: hasVoted ? 700 : 500, zIndex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                            {hasVoted && '✓ '} {opt.text}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--t3)', zIndex: 1, fontWeight: 600, fontFamily: 'var(--fd)' }}>
                            {voteCount} vote{voteCount !== 1 ? 's' : ''} ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Actions Footer */}
                <div style={{ display: 'flex', gap: 20, borderTop: '1px solid var(--border)', paddingTop: 14, fontSize: 12.5, color: 'var(--t3)' }}>
                  <button onClick={() => handleLike(post._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: hasLiked ? 'var(--acc, #E65F2B)' : 'var(--t3)', fontWeight: 600 }}>
                    <ThumbsUp size={14} /> {post.likes?.length || 0} Likes
                  </button>
                  <button onClick={() => toggleComments(post._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: isCommentsOpen ? 'var(--acc, #E65F2B)' : 'var(--t3)', fontWeight: 600 }}>
                    <MessageSquare size={14} /> {post.commentsCount || 0} Comments
                  </button>
                </div>

                {/* Inline Comments Section */}
                {isCommentsOpen && (
                  <div style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: '1px solid var(--border)',
                    animation: 'fadeUp 0.2s ease'
                  }}>
                    <div className="flex-between" style={{ marginBottom: 12 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 800, fontFamily: 'var(--fh)', color: 'var(--t1)' }}>
                        Comments ({comments.length})
                      </h4>
                      <button
                        onClick={() => setActivePostId(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--t3)', fontWeight: 700 }}
                      >
                        Close
                      </button>
                    </div>
                    
                    {/* List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto', marginBottom: 14, paddingRight: 4 }}>
                      {comments.length === 0 ? (
                        <p style={{ color: 'var(--t3)', fontSize: 12, textAlign: 'center', padding: 12, fontWeight: 500 }}>
                          Be the first to leave a comment!
                        </p>
                      ) : (
                        comments.map(c => (
                          <div key={c._id} style={{ display: 'flex', gap: 10, background: 'var(--s2)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                            <Avatar src={c.sender?.avatar} name={c.sender?.displayName} size={28} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--t1)', fontFamily: 'var(--fh)' }}>{c.sender?.displayName}</div>
                              <div style={{ fontSize: 11.5, color: 'var(--t2)', marginTop: 4, wordBreak: 'break-word', lineHeight: 1.4, fontWeight: 500 }}>
                                {renderTextWithLinks(decodeHTML(c.text))}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleAddComment} style={{ display: 'flex', gap: 8 }}>
                      <input
                        className="form-input"
                        style={{ flex: 1, height: 38, fontSize: 12, padding: '0 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--s1)', color: 'var(--t1)' }}
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder="Add a reply..."
                      />
                      <button
                        type="submit"
                        disabled={submittingComment}
                        style={{ height: 38, width: 38, borderRadius: 8, border: 'none', background: 'var(--acc, #E65F2B)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </CreatorShell>
  );
}
