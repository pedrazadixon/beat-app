import axios from 'axios';
import { YOUTUBE_API } from '../constants';

const HEADERS = { Authorization: `Bearer ${import.meta.env.VITE_YOUTUBE_API_TOKEN}` };

/**
 * GET /api/youtube/home
 * Returns sections with mixed content (albums, playlists, tracks, artists)
 */
export async function getHome(continuation = null) {
  try {
    const params = {};
    if (continuation) params.continuation = continuation;
    const res = await axios.get(`${YOUTUBE_API}/home`, { params, headers: HEADERS });
    return res.data.data || { sections: [] };
  } catch (e) {
    console.error('getHome error:', e);
    return { sections: [] };
  }
}

/**
 * GET /api/youtube/explore
 * Returns explore page categories
 */
export async function getExplore() {
  try {
    const res = await axios.get(`${YOUTUBE_API}/explore`, { headers: HEADERS });
    return res.data.data || {};
  } catch (e) {
    console.error('getExplore error:', e);
    return {};
  }
}

/**
 * GET /api/youtube/new-releases
 * Returns new release albums
 */
export async function getNewReleases() {
  try {
    const res = await axios.get(`${YOUTUBE_API}/new-releases`, { headers: HEADERS });
    return res.data.data?.albums || [];
  } catch (e) {
    console.error('getNewReleases error:', e);
    return [];
  }
}

/**
 * GET /api/youtube/charts
 * Returns chart data (trending tracks, top artists, top albums)
 */
export async function getCharts(continuation = null) {
  try {
    const params = {};
    if (continuation) params.continuation = continuation;
    const res = await axios.get(`${YOUTUBE_API}/charts`, { params, headers: HEADERS });
    return res.data.data || {};
  } catch (e) {
    console.error('getCharts error:', e);
    return {};
  }
}

/**
 * GET /api/youtube/mood-and-genres
 * Returns mood/genre categories
 */
export async function getMoodAndGenres() {
  try {
    const res = await axios.get(`${YOUTUBE_API}/mood-and-genres`, { headers: HEADERS });
    return res.data.data || [];
  } catch (e) {
    console.error('getMoodAndGenres error:', e);
    return [];
  }
}
