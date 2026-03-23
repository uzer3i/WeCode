import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import CodeEditorApp from './CodeEditorApp'
import LoadingSpinner from './LoadingSpinner'
import { snippetAPI } from '../services/api'

function SnippetLoader() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const snippetId = searchParams.get('id')
  const [loadingSnippet, setLoadingSnippet] = useState(false)
  const [snippetError, setSnippetError] = useState('')
  const [preloadedSnippet, setPreloadedSnippet] = useState(null)

  useEffect(() => {
    if (snippetId) {
      loadSnippetById(snippetId)
    }
  }, [snippetId])

  const loadSnippetById = async (id) => {
    setLoadingSnippet(true)
    setSnippetError('')
    try {
      const response = await snippetAPI.getSnippetById(id)
      if (response.success) {
        setPreloadedSnippet(response.snippet)
      } else {
        setSnippetError('Snippet not found')
      }
    } catch (error) {
      console.error('Error loading snippet:', error)
      setSnippetError('Failed to load snippet')
    } finally {
      setLoadingSnippet(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('wecode-user')
    localStorage.removeItem('wecode-token')
    navigate('/login')
  }

  if (loadingSnippet) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#1a1a1a',
        zIndex: 9999
      }}>
        <LoadingSpinner message="Loading snippet..." size="large" />
      </div>
    )
  }

  if (snippetError) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#1a1a1a',
        color: '#ffffff',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h2>Error: {snippetError}</h2>
        <button 
          onClick={() => navigate('/')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#00d4ff',
            border: 'none',
            borderRadius: '6px',
            color: '#000',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Go to Editor
        </button>
      </div>
    )
  }

  return (
    <CodeEditorApp 
      preloadedSnippet={preloadedSnippet}
      onLogout={handleLogout}
    />
  )
}

export default SnippetLoader
