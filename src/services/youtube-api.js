import axios from 'axios';
import { YOUTUBE_API } from '../constants';

const HEADERS = { Authorization: `Bearer ${import.meta.env.VITE_YOUTUBE_API_TOKEN}` };

const mapSong = (item) => ({
  trackId: item.videoId || item.id || item.browseId,
  title: item.title,
  artists: item.artists || [],
  album: item.album ? { title: item.album.name, albumId: item.album.id || item.album.browseId } : null,
  thumbnailUrl: item.thumbnail,
  duration: { label: item.duration || "0:00" },
  isExplicit: item.explicit || false
});

const mapAlbum = (item) => ({
  albumId: item.browseId || item.id,
  title: item.title,
  year: item.year || '',
  isExplicit: item.explicit || false,
  artist: item.artists?.[0] || { name: 'Unknown Artist' },
  thumbnailUrl: item.thumbnail
});

const mapArtist = (item) => ({
  artistId: item.browseId || item.id,
  name: item.title || item.name || '',
  subscribers: item.subscribers || '',
  thumbnailUrl: item.thumbnail
});

const mapPlaylist = (item) => ({
  playlistId: item.browseId || item.id,
  title: item.title,
  itemCount: item.songCountText || '',
  author: item.author ? [item.author] : [],
  thumbnailUrl: item.thumbnail
});

export async function searchTracks(query) {
  try {
    const res = await axios.get(`${YOUTUBE_API}/search`, { params: { q: query, filter: 'SONG' }, headers: HEADERS });
    return { tracks: (res.data.data?.items || []).map(mapSong), continuation: res.data.data?.continuation };
  } catch (e) { return { tracks: [] }; }
}

export async function searchTracksContinuations(continuation) {
  try {
    const res = await axios.get(`${YOUTUBE_API}/search/continuation`, { params: { token: continuation }, headers: HEADERS });
    return { tracks: (res.data.data?.items || []).map(mapSong), continuation: res.data.data?.continuation };
  } catch (e) { return { tracks: [] }; }
}

export async function searchAlbums(query) {
  try {
    const res = await axios.get(`${YOUTUBE_API}/search`, { params: { q: query, filter: 'ALBUM' }, headers: HEADERS });
    return { albums: (res.data.data?.items || []).map(mapAlbum), continuation: res.data.data?.continuation };
  } catch (e) { return { albums: [] }; }
}

export async function searchAlbumsContinuations(continuation) {
  try {
    const res = await axios.get(`${YOUTUBE_API}/search/continuation`, { params: { token: continuation }, headers: HEADERS });
    return { albums: (res.data.data?.items || []).map(mapAlbum), continuation: res.data.data?.continuation };
  } catch (e) { return { albums: [] }; }
}

export async function searchArtists(query) {
  try {
    const res = await axios.get(`${YOUTUBE_API}/search`, { params: { q: query, filter: 'ARTIST' }, headers: HEADERS });
    return { artists: (res.data.data?.items || []).map(mapArtist), continuation: res.data.data?.continuation };
  } catch (e) { return { artists: [] }; }
}

export async function searchArtistsContinuations(continuation) {
  try {
    const res = await axios.get(`${YOUTUBE_API}/search/continuation`, { params: { token: continuation }, headers: HEADERS });
    return { artists: (res.data.data?.items || []).map(mapArtist), continuation: res.data.data?.continuation };
  } catch (e) { return { artists: [] }; }
}

export async function searchPlaylists(query) {
  try {
    const res = await axios.get(`${YOUTUBE_API}/search`, { params: { q: query, filter: 'COMMUNITY_PLAYLIST' }, headers: HEADERS });
    return { playlists: (res.data.data?.items || []).map(mapPlaylist), continuation: res.data.data?.continuation };
  } catch (e) { return { playlists: [] }; }
}

export async function searchPlaylistsContinuations(continuation) {
  try {
    const res = await axios.get(`${YOUTUBE_API}/search/continuation`, { params: { token: continuation }, headers: HEADERS });
    return { playlists: (res.data.data?.items || []).map(mapPlaylist), continuation: res.data.data?.continuation };
  } catch (e) { return { playlists: [] }; }
}

export async function getPlaylistTracks(playlistId) {
  try {
    const res = await axios.get(`${YOUTUBE_API}/playlist/${playlistId}`, { headers: HEADERS });
    return { tracks: (res.data.data?.songs || []).map(mapSong), continuation: res.data.data?.songsContinuation };
  } catch (e) { return { tracks: [] }; }
}

export async function getPlaylistTracksContinuations(continuation, visitorData) {
  try {
    const res = await axios.get(`${YOUTUBE_API}/playlist/continuation`, { params: { token: continuation }, headers: HEADERS });
    return { tracks: (res.data.data?.songs || []).map(mapSong), continuation: res.data.data?.continuation };
  } catch (e) { return { tracks: [] }; }
}

export async function getArtistAlbums(artistId) {
  try {
    const res = await axios.get(`${YOUTUBE_API}/artist/${artistId}/albums`, { headers: HEADERS });
    const data = res.data?.data || {};
    const albums = (data.albums || []).map(mapAlbum);
    return { albums, continuation: data.continuation || null, vd: data.visitorData || null };
  } catch (e) { return { albums: [] }; }
}

export async function getArtistAlbumsContinuations(continuation, visitorData) {
  try {
    const res = await axios.get(`${YOUTUBE_API}/artist/albums/continuation`, { params: { token: continuation, visitorData }, headers: HEADERS });
    const data = res.data?.data || {};
    return { albums: (data.albums || []).map(mapAlbum), continuation: data.continuation || null, vd: data.visitorData || null };
  } catch (e) { return { albums: [] }; }
}

export async function getAlbum(albumId) {
  try {
    const res = await axios.get(`${YOUTUBE_API}/album/${albumId}`, { headers: HEADERS });
    const album = res.data.data?.album || {};
    const songs = res.data.data?.songs || [];
    return {
      albumId: album.playlistId || album.browseId,
      title: album.title,
      artist: album.artists?.[0] || { name: 'Unknown Artist' },
      thumbnailUrl: album.thumbnail,
      tracks: songs.map(s => ({ ...mapSong(s), album: { title: album.title, albumId: album.browseId } }))
    };
  } catch (e) { return { tracks: [] }; }
}

export async function getArtist(artistId) {
  try {
    const res = await axios.get(`${YOUTUBE_API}/artist/${artistId}`, { headers: HEADERS });
    const data = res.data.data;
    if (!data || !data.artist) return {};
    return {
      artistId: data.artist.id,
      name: data.artist.title,
      description: data.description,
      thumbnailUrl: data.artist.thumbnail,
      subscribers: data.subscriberCountText,
      albums: [],
      singles: [],
      tracksPlaylistId: (() => {
        const songsSec = data.sections?.find(s => ['Songs', 'Top songs', 'Videos'].includes(s.title));
        if (songsSec?.browseId) return songsSec.browseId.replace('VL', '');
        return null;
      })()
    };
  } catch (e) { return {}; }
}

export async function getRankingsFromCountry(countryCode) {
  return { tracks: [] };
}

export async function getSuggestions(query) {
  try {
    const res = await axios.get(`${YOUTUBE_API}/search/suggestions`, { params: { q: query }, headers: HEADERS });
    return res.data.data?.queries || [];
  } catch (e) { return []; }
}