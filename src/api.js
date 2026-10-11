const API_BASE_URL = import.meta.env.PROD
  ? 'https://money-tracker-backend-8bhm.onrender.com'
  : 'http://localhost:5000';

export default API_BASE_URL;
