const API_BASE_URL = 'https://wecode-backend-876t.onrender.com/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('wecode-token');
  return token || null;
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Snippet API functions
export const snippetAPI = {
  // Create a new snippet
  createSnippet: async (snippetData) => {
    return apiRequest('/snippet', {
      method: 'POST',
      body: JSON.stringify(snippetData),
    });
  },

  // Get all snippets for the logged-in user
  getUserSnippets: async () => {
    return apiRequest('/snippet');
  },

  // Get a single snippet by ID
  getSnippetById: async (id) => {
    return apiRequest(`/snippet/${id}`);
  },

  // Update a snippet
  updateSnippet: async (id, snippetData) => {
    return apiRequest(`/snippet/${id}`, {
      method: 'PUT',
      body: JSON.stringify(snippetData),
    });
  },

  // Delete a snippet (soft delete)
  deleteSnippet: async (id) => {
    return apiRequest(`/snippet/${id}`, {
      method: 'DELETE',
    });
  },
};

export default apiRequest;
