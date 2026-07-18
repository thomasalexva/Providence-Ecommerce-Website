const API_BASE = 'http://localhost:5000/api';

const getHeaders = (isFormData = false) => {
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    // If unauthorized (401) or suspended (403), we can clear token/user
    if (response.status === 401 || response.status === 403) {
      if (response.status === 403 && data.message && data.message.includes('suspended')) {
        // User suspended - notify event or clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  
  return data;
};

export const api = {
  // Auth endpoints
  auth: {
    register: async (username, email, password) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, email, password }),
      });
      return handleResponse(res);
    },
    login: async (email, password) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },
    getProfile: async () => {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    updateProfile: async (profileData) => {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profileData),
      });
      return handleResponse(res);
    },
  },

  // Product endpoints
  products: {
    getAll: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.sellerId) params.append('sellerId', filters.sellerId);

      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`${API_BASE}/products${queryStr}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (productData) => {
      const isFormData = productData instanceof FormData;
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: getHeaders(isFormData),
        body: isFormData ? productData : JSON.stringify(productData),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Order endpoints
  orders: {
    create: async (orderData) => {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData),
      });
      return handleResponse(res);
    },
    getMyOrders: async () => {
      const res = await fetch(`${API_BASE}/orders/myorders`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Admin endpoints
  admin: {
    getStats: async () => {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getUsers: async () => {
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    getOrders: async () => {
      const res = await fetch(`${API_BASE}/admin/orders`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    toggleSuspension: async (userId) => {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/suspend`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

};
