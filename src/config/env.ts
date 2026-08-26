const rawApiUrl = import.meta.env.VITE_API_URL || '/api';
const backendBaseUrl = rawApiUrl.replace(/\/api$/, '');

export const config = {
  apiUrl: rawApiUrl,
  cdnUrl: import.meta.env.VITE_CDN_URL || backendBaseUrl,
};
