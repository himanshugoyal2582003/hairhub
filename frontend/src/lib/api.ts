const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetcher(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Something went wrong');
  }

  return response.json();
}

export const api = {
  auth: {
    login: async (data: any) => {
      const res = await fetcher('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.token) {
        localStorage.setItem('token', res.token);
      }
      return res;
    },
    register: async (data: any) => {
      const res = await fetcher('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.token) {
        localStorage.setItem('token', res.token);
      }
      return res;
    },
    logout: () => {
      localStorage.removeItem('token');
    },
    getMe: async () => {
      return fetcher('/auth/me');
    },
    updateProfile: async (data: { name?: string; image?: string }) => {
      return fetcher('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    updatePassword: async (data: { currentPassword?: string; newPassword?: string }) => {
      return fetcher('/auth/password', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    adminLogin: async (data: { email: string; password: string }) => {
      const res = await fetcher('/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.token) {
        localStorage.setItem('token', res.token);
      }
      return res;
    },
    adminRegister: async (data: { name: string; email: string; password: string; adminSecret?: string; adminCode?: string }) => {
      const res = await fetcher('/auth/admin-register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.token) {
        localStorage.setItem('token', res.token);
      }
      return res;
    },
  },
  listings: {
    list: async (filters: Record<string, string | number | boolean>) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          params.append(key, String(val));
        }
      });
      return fetcher(`/listings?${params.toString()}`);
    },
    get: async (id: string) => {
      return fetcher(`/listings/${id}`);
    },
    create: async (data: any) => {
      return fetcher('/listings', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: any) => {
      return fetcher(`/listings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string) => {
      return fetcher(`/listings/${id}`, {
        method: 'DELETE',
      });
    },
    updateStatus: async (id: string, status: 'active' | 'sold') => {
      return fetcher(`/listings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
    getMyListings: async () => {
      return fetcher('/listings/my');
    },
    getPublicStats: async () => {
      return fetcher('/listings/stats');
    },
  },
  admin: {
    getStats: async () => {
      return fetcher('/admin/stats');
    },
    getListings: async (params: { status?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams();
      if (params.status) query.append('status', params.status);
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit));
      return fetcher(`/admin/listings?${query.toString()}`);
    },
    moderateListing: async (id: string, action: 'approve' | 'reject' | 'delete') => {
      return fetcher(`/admin/listings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      });
    },
    getUsers: async () => {
      return fetcher('/admin/users');
    },
    updateUserRole: async (id: string, role: 'user' | 'admin') => {
      return fetcher(`/admin/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
    },
    removeListingImage: async (id: string, imageUrl: string) => {
      return fetcher(`/admin/listings/${id}/remove-image`, {
        method: 'PATCH',
        body: JSON.stringify({ imageUrl }),
      });
    },
    deleteUser: async (id: string) => {
      return fetcher(`/admin/users/${id}`, {
        method: 'DELETE',
      });
    },
  },
  upload: {
    single: async (file: File) => {
      // We can upload to backend API /api/upload
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      return response.json();
    },
  },
};
