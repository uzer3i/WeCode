import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Folder, Save, X, Code, Users } from 'lucide-react'
import CodeEditor from './CodeEditor'
import LoadingSpinner from './LoadingSpinner'
import { snippetAPI } from '../services/api'
import '../App.css'

function CodeEditorApp({ user, onLogout, preloadedSnippet }) {
  const navigate = useNavigate()

  const [html, setHtml] = useState(`<!-- WeCode - Professional Web Development Environment -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WeCode Project</title>
    <meta name="description" content="Built with WeCode - Professional Code Editor">
</head>
<body>
    <!-- Welcome to WeCode! -->
    <header class="wecode-header">
        <h1>🚀 Welcome to <code>WeCode</code></h1>
        <p>Professional Web Development Environment</p>
    </header>
    
    <main class="wecode-main">
        <section class="hero">
            <h2>Build Something Amazing</h2>
            <p>Start coding in the panels above to see your creation come to life!</p>
            <button class="wecode-btn" onclick="window.location.reload()">Get Started</button>
        </section>
    </main>
    
    <footer class="wecode-footer">
        <p>Powered by WeCode © 2026</p>
    </footer>
</body>
</html>`)

  const [css, setCss] = useState(`/* WeCode - Professional Styling */
/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

/* WeCode Branding */
.wecode-header {
    text-align: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    margin: 2rem;
    color: white;
}

.wecode-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.wecode-main {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.hero {
    text-align: center;
    padding: 3rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    color: white;
}

.hero h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.wecode-btn {
    background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
    margin-top: 1rem;
}

.wecode-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
}

.wecode-footer {
    text-align: center;
    padding: 2rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
}`)

  const [js, setJs] = useState(`// WeCode - Professional JavaScript
// Welcome to the most intuitive code editor!

// Professional WeCode App Class
class WeCodeApp {
    constructor() {
        this.version = '1.0.0';
        this.features = ['Live Preview', 'Auto-refresh', 'Professional UI'];
        this.init();
    }
    
    init() {
        console.log('🚀 WeCode Initialized v' + this.version);
        console.log('✨ Features:', this.features.join(', '));
        this.setupEventListeners();
        this.showWelcomeMessage();
    }
    
    setupEventListeners() {
        // Setup professional event handling
        document.addEventListener('DOMContentLoaded', () => {
            this.onPageLoad();
        });
    }
    
    showWelcomeMessage() {
        const message = 'Welcome to WeCode - Where Code Comes to Life!';
        this.displayNotification(message, 'success');
    }
    
    displayNotification(message, type = 'info') {
        // Professional notification system
        const notification = document.createElement('div');
        notification.className = \`wecode-notification wecode-notification-\${type}\`;
        notification.textContent = message;
        notification.style.cssText = \`
            position: fixed;
            top: 20px;
            right: 20px;
            background: \${type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        \`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    onPageLoad() {
        console.log('📱 WeCode Page Loaded Successfully');
        console.log('🎨 Ready for creative development!');
    }
}

// Initialize WeCode App
const app = new WeCodeApp();

// Modern ES6+ Features
const wecodeUtils = {
    // Professional utility functions
    formatCode: (code) => {
        return code.trim().replace(/\\s+/g, ' ');
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Export for global use
window.WeCodeApp = WeCodeApp;
window.wecodeUtils = wecodeUtils;

console.log('🎯 WeCode JavaScript Environment Ready!');`)

  const [srcDoc, setSrcDoc] = useState('')
  const [consoleLogs, setConsoleLogs] = useState([])
  const [previewHeight, setPreviewHeight] = useState(20) // percentage - now used for vh units
  const [isResizing, setIsResizing] = useState(false)
  const [resizingPanel, setResizingPanel] = useState(null) // 'preview', 'html', 'css', 'js'
  const [traySizes, setTraySizes] = useState({
    html: 33,
    css: 33,
    js: 33
  }) // percentage for each tray (width now)
  const [snippetTitle, setSnippetTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [showSnippets, setShowSnippets] = useState(false)
  const [userSnippets, setUserSnippets] = useState([])
  const [isLoadingSnippets, setIsLoadingSnippets] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            // Execute user code
            try {
              ${js}
            } catch (error) {
              console.error(error.message);
            }
          <\/script>
        </body>
        </html>
      `)
    }, 1000) // Changed to 1 second

    return () => clearTimeout(timeout)
  }, [html, css, js])

  const clearConsole = () => {
    setConsoleLogs([])
  }

  const loadUserSnippets = async () => {
    setIsLoadingSnippets(true)
    try {
      const response = await snippetAPI.getUserSnippets()
      if (response.success) {
        setUserSnippets(response.snippets)
      }
    } catch (error) {
      console.error('Error loading snippets:', error)
    } finally {
      setIsLoadingSnippets(false)
    }
  }

  const loadSnippetById = async (snippetId) => {
    navigate(`/snippet?id=${snippetId}`)
  }

  const saveCode = async () => {
    if (!snippetTitle.trim()) {
      setSaveMessage('Please enter a title for your snippet')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }

    setIsSaving(true)
    setSaveMessage('')

    try {
      const snippetData = {
        title: snippetTitle.trim(),
        html,
        css,
        js,
        language: 'html',
        isPublic: true
      }

      const response = await snippetAPI.createSnippet(snippetData)
      
      if (response.success) {
        setSaveMessage('Snippet saved successfully!')
        setSnippetTitle('')
        localStorage.setItem('lastSavedSnippet', JSON.stringify({
          id: response.snippet._id,
          title: response.snippet.title,
          timestamp: new Date().toISOString()
        }))
      } else {
        setSaveMessage('Failed to save snippet')
      }
    } catch (error) {
      console.error('Error saving snippet:', error)
      setSaveMessage(error.message || 'Failed to save snippet')
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(''), 5000)
    }
  }

  
  // Resize handlers
  const handleMouseDown = (panel, e) => {
    setIsResizing(true)
    setResizingPanel(panel)
    e.preventDefault()
    if (panel === 'css' || panel === 'html') {
      document.body.style.cursor = 'ew-resize'
    } else if (panel === 'preview') {
      document.body.style.cursor = 'ns-resize'
    }
    document.body.style.userSelect = 'none'
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    setResizingPanel(null)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  const handleMouseMove = (e) => {
    if (!isResizing || !resizingPanel) return
    
    if (resizingPanel === 'preview') {
      const windowHeight = window.innerHeight
      const relativeY = Math.max(0, Math.min(windowHeight, windowHeight - e.clientY))
      const percentage = (relativeY / windowHeight) * 100
      const clampedHeight = Math.max(10, Math.min(80, percentage))
      
      setPreviewHeight(clampedHeight)
    } else if (resizingPanel === 'css') {
      const editorArea = document.querySelector('.code-editors')
      if (!editorArea) return

      const rect = editorArea.getBoundingClientRect()
      const relativeX = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
      const percentage = (relativeX / rect.width) * 100

      setTraySizes(prev => {
        const newSizes = { ...prev }
        newSizes.css = Math.max(15, Math.min(50, percentage))
        const remaining = 100 - newSizes.css
        newSizes.html = remaining * 0.3
        newSizes.js = remaining * 0.7
        return newSizes
      })
    } else if (resizingPanel === 'html') {
      const editorArea = document.querySelector('.code-editors')
      if (!editorArea) return

      const rect = editorArea.getBoundingClientRect()
      const relativeX = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
      const percentage = (relativeX / rect.width) * 100

      setTraySizes(prev => {
        const newSizes = { ...prev }
        newSizes.html = Math.max(15, Math.min(50, percentage))
        const remaining = 100 - newSizes.html
        newSizes.css = remaining * 0.5
        newSizes.js = remaining * 0.5
        return newSizes
      })
    }
  }

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing, resizingPanel])

  // Load preloaded snippet if available
  useEffect(() => {
    if (preloadedSnippet) {
      setHtml(preloadedSnippet.html || '')
      setCss(preloadedSnippet.css || '')
      setJs(preloadedSnippet.js || '')
      setSnippetTitle(preloadedSnippet.title || '')
    }
  }, [preloadedSnippet])

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="logo">
          <img src="/wecode_logo.png" alt="WeCode Logo" className="logo-image" />
        </div>
        <div className="header-center">
          <input
            type="text"
            placeholder="Enter snippet title..."
            value={snippetTitle}
            onChange={(e) => setSnippetTitle(e.target.value)}
            className="snippet-title-input"
            disabled={isSaving}
          />
          {saveMessage && (
            <div className={`save-message ${saveMessage.includes('success') ? 'success' : 'error'}`}>
              {saveMessage}
            </div>
          )}
        </div>
        <div className="header-actions">
          <div className="user-info">
            <span>Welcome, {user?.name || user?.email}</span>
          </div>
          <button 
            className="header-btn" 
            onClick={() => {
              setShowSnippets(!showSnippets)
              if (!showSnippets) {
                loadUserSnippets()
              }
            }}
          >
            <Folder size={16} />
            {showSnippets ? 'Hide Snippets' : 'My Snippets'}
          </button>
          <button 
            className="header-btn" 
            onClick={() => navigate('/feed')}
          >
            <Users size={16} />
            Community Feed
          </button>
          <button 
            className="header-btn" 
            onClick={saveCode}
            disabled={isSaving || !snippetTitle.trim()}
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button className="header-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* User Snippets Panel */}
      {showSnippets && (
        <div className="snippets-panel">
          <div className="snippets-header">
            <span className="snippets-title">📁 My Snippets</span>
            <button className="close-snippets-btn" onClick={() => setShowSnippets(false)}>
              <X size={14} />
            </button>
          </div>
          <div className="snippets-content">
            {isLoadingSnippets ? (
              <LoadingSpinner message="Loading your snippets..." size="small" />
            ) : userSnippets.length === 0 ? (
              <div className="snippets-empty">No snippets found. Save your first snippet!</div>
            ) : (
              <div className="snippets-list">
                {userSnippets.map((snippet) => (
                  <div key={snippet._id} className="snippet-item">
                    <div className="snippet-info">
                      <h4 className="snippet-title">{snippet.title}</h4>
                      <p className="snippet-date">
                        {new Date(snippet.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="snippet-actions">
                      <button 
                        className="snippet-btn load-btn"
                        onClick={() => loadSnippetById(snippet._id)}
                      >
                        <Code size={14} />
                        Load
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="editor-area">
        {/* Code Editors */}
        <div className="code-editors">
          <div
            className="editor-tray"
            style={{ width: `${traySizes.html}%` }}
          >
            <CodeEditor
              language="html"
              value={html}
              onChange={setHtml}
              placeholder="Write HTML here..."
              isActive={true}
            />
            <div
              className="tray-resize-handle tray-resize-handle-vertical"
              onMouseDown={(e) => handleMouseDown('html', e)}
              style={{ cursor: resizingPanel === 'html' ? 'ew-resize' : 'ew-resize' }}
            />
          </div>

          <div
            className="editor-tray"
            style={{ width: `${traySizes.css}%` }}
          >
            <CodeEditor
              language="css"
              value={css}
              onChange={setCss}
              placeholder="Write CSS here..."
              isActive={true}
            />
            <div
              className="tray-resize-handle tray-resize-handle-vertical"
              onMouseDown={(e) => handleMouseDown('css', e)}
              style={{ cursor: resizingPanel === 'css' ? 'ew-resize' : 'ew-resize' }}
            />
          </div>

          <div
            className="editor-tray"
            style={{ width: `${traySizes.js}%` }}
          >
            <CodeEditor
              language="js"
              value={js}
              onChange={setJs}
              placeholder="Write JavaScript here..."
              isActive={true}
            />
          </div>
        </div>
      </div>

      {/* Bottom Preview Panel */}
      <div className="bottom-preview-panel" style={{ height: `${previewHeight}vh` }}>
        <div 
          className="preview-resize-handle"
          onMouseDown={(e) => handleMouseDown('preview', e)}
          style={{ cursor: isResizing ? 'ns-resize' : 'ns-resize' }}
        />
        <div className="preview-header">
          <span className="preview-title">🌐 Live Preview (Auto-refreshing )</span>
          <div className="preview-actions">
            <button className="refresh-btn" onClick={() => {
              // Force refresh by clearing and resetting srcDoc
              setSrcDoc('')
              setTimeout(() => setSrcDoc(srcDoc), 100)
            }}>
              🔄 Refresh Now
            </button>
            <button className="console-btn">
              🔄 Refresh Now
            </button>
            <button className="console-btn">
              Console
            </button>
            <button className="fullscreen-btn">
              Fullscreen
            </button>
          </div>
        </div>
        <iframe
          srcDoc={srcDoc}
          title="preview"
          className="preview-frame"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  )
}

export default CodeEditorApp
