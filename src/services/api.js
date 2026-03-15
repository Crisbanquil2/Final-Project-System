const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  let authToken = null;
  try {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      authToken = parsed?.token || null;
    }
  } catch {}

  const finalOptions = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  };

  let response;
  try {
    response = await fetch(url, finalOptions);
  } catch (networkError) {
    throw new Error('Cannot connect to server. Make sure the backend is running (e.g. php artisan serve in it15-backend).');
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data?.message) {
        message = data.message;
      }
    } catch {}
    if (response.status === 401) {
      localStorage.removeItem('auth');
      window.dispatchEvent(new Event('auth:unauthorized'));
      message = 'Session expired or invalid. Please log in again.';
    }
    throw new Error(message);
  }

  return response.json();
}

export function get(path) {
  return request(path, { method: 'GET' });
}

export function post(path, body) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

