import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Folder, File, Plus, CloudUpload, Share, Code, GitBranch, LayoutGrid, Play, X, Terminal, Settings, Maximize2, Save, Maximize } from 'lucide-react'
import CodeEditor from './CodeEditor'
import '../App.css'

function CodeEditorApp({ user, onLogout }) {
  console.log('CodeEditorApp rendering with props:', { user, onLogout })

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
  const [showConsole, setShowConsole] = useState(false)
  const [consoleLogs, setConsoleLogs] = useState([])
  const [layout, setLayout] = useState('vertical')
  const [previewHeight, setPreviewHeight] = useState(20) // percentage - now used for vh units
  const [isResizing, setIsResizing] = useState(false)
  const [resizingPanel, setResizingPanel] = useState(null) // 'preview', 'html', 'css', 'js'
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [traySizes, setTraySizes] = useState({
    html: 33,
    css: 33,
    js: 33
  }) // percentage for each tray (width now)

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

  const saveCode = () => {
    const code = {
      html,
      css,
      js,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('codepen-clone', JSON.stringify(code))
    alert('Code saved locally!')
  }

  const loadCode = () => {
    const saved = localStorage.getItem('codepen-clone')
    if (saved) {
      const code = JSON.parse(saved)
      setHtml(code.html)
      setCss(code.css)
      setJs(code.js)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Resize handlers
  const handleMouseDown = (panel, e) => {
    console.log('Resize started for panel:', panel)
    setIsResizing(true)
    setResizingPanel(panel)
    e.preventDefault()
    // Add visual feedback - set cursor based on panel type
    if (panel === 'css' || panel === 'html') {
      document.body.style.cursor = 'ew-resize'
      console.log('Set cursor to ew-resize for horizontal resize')
    } else if (panel === 'preview') {
      document.body.style.cursor = 'ns-resize'
      console.log('Set cursor to ns-resize for vertical preview resize')
    }
    document.body.style.userSelect = 'none'
  }

  const handleMouseUp = () => {
    console.log('Resize ended for panel:', resizingPanel)
    setIsResizing(false)
    setResizingPanel(null)
    // Reset visual feedback
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  const handleMouseMove = (e) => {
    if (!isResizing || !resizingPanel) return
    
    if (resizingPanel === 'preview') {
      // Handle vertical resize of bottom preview panel
      const windowHeight = window.innerHeight
      const relativeY = Math.max(0, Math.min(windowHeight, windowHeight - e.clientY))
      const percentage = (relativeY / windowHeight) * 100
      const clampedHeight = Math.max(10, Math.min(80, percentage))
      
      console.log('Preview resize - relativeY:', relativeY, 'percentage:', percentage, 'clampedHeight:', clampedHeight)
      
      setPreviewHeight(clampedHeight)
      console.log('Set preview height to:', clampedHeight)
    } else if (resizingPanel === 'css') {
      // Middle handle controls CSS vs JS split
      const editorArea = document.querySelector('.code-editors')
      if (!editorArea) return

      const rect = editorArea.getBoundingClientRect()
      const relativeX = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
      const percentage = (relativeX / rect.width) * 100

      console.log('CSS resize - relativeX:', relativeX, 'percentage:', percentage)

      setTraySizes(prev => {
        const newSizes = { ...prev }
        // CSS handle position: drag right = expand CSS, drag left = expand JS
        newSizes.css = Math.max(15, Math.min(50, percentage)) // CSS tray controlled by handle position
        const remaining = 100 - newSizes.css
        newSizes.html = remaining * 0.3 // Keep HTML smaller
        newSizes.js = remaining * 0.7 // JS gets the rest
        console.log('New tray sizes:', newSizes)
        return newSizes
      })
    } else if (resizingPanel === 'html') {
      // Left handle controls its own tray (HTML)
      const editorArea = document.querySelector('.code-editors')
      if (!editorArea) return

      const rect = editorArea.getBoundingClientRect()
      const relativeX = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
      const percentage = (relativeX / rect.width) * 100

      console.log('HTML resize - relativeX:', relativeX, 'percentage:', percentage)

      setTraySizes(prev => {
        const newSizes = { ...prev }
        newSizes.html = Math.max(15, Math.min(50, percentage))
        const remaining = 100 - newSizes.html
        newSizes.css = remaining * 0.5
        newSizes.js = remaining * 0.5
        console.log('New tray sizes:', newSizes)
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

  useEffect(() => {
    loadCode()
  }, [])

  console.log('CodeEditorApp about to return JSX')
  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="logo">
          <img src="/wecode_logo.png" alt="WeCode Logo" className="logo-image" />
        </div>
        <div className="header-actions">
          <div className="user-info">
            <span>Welcome, {user?.name || user?.email}</span>
          </div>
          <button className="header-btn" onClick={saveCode}>
            <Save size={16} />
            Save
          </button>
          <button className="header-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

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
            <button className="console-btn" onClick={() => setShowConsole(!showConsole)}>
              <Terminal size={16} />
              Console
            </button>
            <button className="fullscreen-btn" onClick={toggleFullscreen}>
              <Maximize size={16} />
              Fullscreen
            </button>
          </div>
        </div>
        <iframe
          srcDoc={srcDoc}
          title="preview"
          className="preview-frame"
          sandbox="allow-scripts"
        />
      </div>

      {/* Console Panel */}
      {showConsole && (
        <div className="console-panel">
          <div className="console-header">
            <span className="console-title">📟 Console</span>
            <div className="console-actions">
              <button className="console-btn" onClick={clearConsole}>
                Clear
              </button>
              <button className="console-btn" onClick={() => setShowConsole(false)}>
                <X size={14} />
              </button>
            </div>
          </div>
          <div className="console-content">
            {consoleLogs.map((log, index) => (
              <div
                key={index}
                className={`console-log console-${log.type}`}
              >
                [{log.type.toUpperCase()}] {log.message}
              </div>
            ))}
            {consoleLogs.length === 0 && (
              <div className="console-empty">No console output yet...</div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {isFullscreen && (
        <div className="fullscreen-modal">
          <div className="fullscreen-header">
            <span className="fullscreen-title">🌐 Fullscreen Preview</span>
            <button className="close-fullscreen-btn" onClick={toggleFullscreen}>
              <X size={20} />
            </button>
          </div>
          <iframe
            srcDoc={srcDoc}
            title="fullscreen-preview"
            className="fullscreen-frame"
            sandbox="allow-scripts"
          />
        </div>
      )}
    </div>
  )
}

export default CodeEditorApp
