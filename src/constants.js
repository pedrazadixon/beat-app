const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const YOUTUBE_API = `${API_URL}/api/youtube`;
const STREAM_API = `${API_URL}/api/stream`;
const PROXY_URL = `${STREAM_API}/proxy?url=`;

export { YOUTUBE_API, STREAM_API, PROXY_URL };