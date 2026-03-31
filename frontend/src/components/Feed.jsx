import { useState, useEffect } from 'react'
import { User, Clock, Eye, Heart, ExternalLink, Search, Grid, List, TrendingUp, Star, Play } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'
import './Feed.css'

function Feed() {
  const [snippets, setSnippets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [hoveredSnippet, setHoveredSnippet] = useState(null)
  const navigate = useNavigate()

  const fetchCommunitySnippets = async (pageNum = 1, searchTerm = '') => {
    try {
      setLoading(true)
      const response = await fetch(`https://wecode-backend-876t.onrender.com/api/community?page=${pageNum}&limit=12&search=${searchTerm}`)
      const data = await response.json()

      if (data.success) {
        setSnippets(data.snippets)
        setTotalPages(data.pages)
        setPage(data.page)
      } else {
        setError('Failed to load community snippets')
      }
    } catch (err) {
      setError('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommunitySnippets()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchCommunitySnippets(1, search)
  }

  const handleSnippetClick = (snippetId) => {
    navigate(`/snippet?id=${snippetId}`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  const createPreviewHtml = (snippet) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 8px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: white;
              transform: scale(0.3);
              transform-origin: top left;
              width: 333.33%;
              height: 333.33%;
              overflow: hidden;
            }
            * {
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          ${snippet.html || ''}
          ${snippet.css ? `<style>${snippet.css}</style>` : ''}
          ${snippet.js ? `<script>${snippet.js}</script>` : ''}
        </body>
      </html>
    `
  }

  const getStatsInfo = () => {
    const total = snippets.length
    const thisWeek = snippets.filter(s => {
      const created = new Date(s.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return created > weekAgo
    }).length
    return { total, thisWeek }
  }

  const stats = getStatsInfo()

  if (loading && snippets.length === 0) {
    return (
      <div className="feed-container fullscreen">
        <div className="feed-loading">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="feed-container fullscreen">
        <div className="feed-header">
          <Link to="/" className="home-link">🛖</Link>
          <div className="header-content">
            <div className="header-title">
              <h1>🌟 Community Feed</h1>
              <p>Discover amazing code snippets from WeCode community</p>
            </div>
          </div>
        </div>
        <div className="feed-error">
          <div className="error-card">
            <h3>❌ Unable to Load Feed</h3>
            <p>{error}</p>
            <button onClick={() => fetchCommunitySnippets()} className="retry-btn">
              <ExternalLink size={16} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="feed-container fullscreen">
      <Link to="/" className="home-link"></Link>
      {/* Header */}
      <div className="feed-header">
        {/* Controls Bar */}
        <div className="feed-controls">
          <div className="controls-right">
            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
                Grid
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
                List
              </button>
            </div>
          </div>
          <div className="header-title">
            <h1>🌟 Community Feed</h1>
            <p>Discover amazing code snippets from the WeCode community</p>
          </div>
          <div className="controls-left">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search snippets by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="feed-main">
        {/* Snippets Container */}
        <div className={`snippets-container ${viewMode}`}>
          {snippets.map((snippet, index) => (
            <div key={snippet._id} className="snippet-card" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Visual Preview Thumbnail */}
              <div className="snippet-preview">
                <div
                  className="preview-container"
                  onMouseEnter={() => setHoveredSnippet(snippet._id)}
                  onMouseLeave={() => setHoveredSnippet(null)}
                >
                  <iframe
                    srcDoc={createPreviewHtml(snippet)}
                    className="preview-iframe"
                    title={`${snippet.title} preview`}
                    sandbox="allow-scripts allow-same-origin"
                    loading="lazy"
                  />
                  {hoveredSnippet === snippet._id && (
                    <div className="preview-overlay">
                      <div className="overlay-content">
                        <Play size={24} />
                        <span>Click to view full snippet</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-header">
                <div className="snippet-meta" onClick={() => handleSnippetClick(snippet._id)}>
                  <h3 className="snippet-title">{snippet.title}</h3>
                  <div className="author-info">
                    <User size={14} />
                    <span>{snippet.author.email.split('@')[0]}</span>
                    <span className="separator">•</span>
                    <Clock size={14} />
                    <span>{formatDate(snippet.createdAt)}</span>
                  </div>
                </div>
                <div className="card-actions">
                  <button
                    onClick={() => handleSnippetClick(snippet._id)}
                    className="view-snippet-btn"
                  >
                    <ExternalLink size={14} />
                    View Full
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination">
              <button
                onClick={() => fetchCommunitySnippets(page - 1, search)}
                disabled={page === 1}
                className="pagination-btn"
              >
                ← Previous
              </button>

              <div className="page-info">
                <span className="current-page">{page}</span>
                <span className="page-separator">of</span>
                <span className="total-pages">{totalPages}</span>
              </div>

              <button
                onClick={() => fetchCommunitySnippets(page + 1, search)}
                disabled={page === totalPages}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {snippets.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-icon">🔍</div>
              <h3>No Snippets Found</h3>
              <p>Try adjusting your search or be the first to share a snippet with the community!</p>
              <button
                onClick={() => navigate('/')}
                className="create-snippet-btn"
              >
                Create Snippet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Feed
