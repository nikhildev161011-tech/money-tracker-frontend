const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://money-tracker-backend-8bhm.onrender.com'
  : 'http://localhost:5000';

export default API_BASE_URL;