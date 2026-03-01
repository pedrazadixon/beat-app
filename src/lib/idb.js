/**
 * Lightweight IndexedDB wrapper for local data storage.
 * Stores: recentlyPlayed, likedSongs, localPlaylists
 * No external dependencies.
 */

const DB_NAME = 'beat-app-db';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('recentlyPlayed')) {
        const store = db.createObjectStore('recentlyPlayed', { keyPath: 'trackId' });
        store.createIndex('playedAt', 'playedAt', { unique: false });
      }

      if (!db.objectStoreNames.contains('likedSongs')) {
        db.createObjectStore('likedSongs', { keyPath: 'trackId' });
      }

      if (!db.objectStoreNames.contains('localPlaylists')) {
        db.createObjectStore('localPlaylists', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ─── Recently Played ─────────────────────────────────

export async function addRecentPlay(track) {
  const db = await openDB();
  const tx = db.transaction('recentlyPlayed', 'readwrite');
  const store = tx.objectStore('recentlyPlayed');
  store.put({ ...track, playedAt: Date.now() });
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

export async function getRecentPlays(limit = 20) {
  const db = await openDB();
  const tx = db.transaction('recentlyPlayed', 'readonly');
  const store = tx.objectStore('recentlyPlayed');

  return new Promise((resolve, reject) => {
    const request = store.index('playedAt').openCursor(null, 'prev');
    const results = [];
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor && results.length < limit) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

// ─── Liked Songs ──────────────────────────────────────

export async function toggleLike(track) {
  const db = await openDB();
  const tx = db.transaction('likedSongs', 'readwrite');
  const store = tx.objectStore('likedSongs');

  return new Promise((resolve, reject) => {
    const getReq = store.get(track.trackId);
    getReq.onsuccess = () => {
      if (getReq.result) {
        store.delete(track.trackId);
        tx.oncomplete = () => resolve(false); // unliked
      } else {
        store.put({ ...track, likedAt: Date.now() });
        tx.oncomplete = () => resolve(true); // liked
      }
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function isLiked(trackId) {
  const db = await openDB();
  const tx = db.transaction('likedSongs', 'readonly');
  const store = tx.objectStore('likedSongs');

  return new Promise((resolve, reject) => {
    const request = store.get(trackId);
    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getLikedSongs() {
  const db = await openDB();
  const tx = db.transaction('likedSongs', 'readonly');
  const store = tx.objectStore('likedSongs');

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const songs = request.result.sort((a, b) => (b.likedAt || 0) - (a.likedAt || 0));
      resolve(songs);
    };
    request.onerror = () => reject(request.error);
  });
}

// ─── Local Playlists ──────────────────────────────────

export async function createPlaylist(name) {
  const db = await openDB();
  const tx = db.transaction('localPlaylists', 'readwrite');
  const store = tx.objectStore('localPlaylists');

  return new Promise((resolve, reject) => {
    const request = store.add({ name, tracks: [], createdAt: Date.now() });
    request.onsuccess = () => resolve(request.result);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getLocalPlaylists() {
  const db = await openDB();
  const tx = db.transaction('localPlaylists', 'readonly');
  const store = tx.objectStore('localPlaylists');

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addToPlaylist(playlistId, track) {
  const db = await openDB();
  const tx = db.transaction('localPlaylists', 'readwrite');
  const store = tx.objectStore('localPlaylists');

  return new Promise((resolve, reject) => {
    const getReq = store.get(playlistId);
    getReq.onsuccess = () => {
      const playlist = getReq.result;
      if (playlist) {
        const exists = playlist.tracks.some((t) => t.trackId === track.trackId);
        if (!exists) {
          playlist.tracks.push(track);
          store.put(playlist);
        }
      }
      tx.oncomplete = resolve;
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function removeFromPlaylist(playlistId, trackId) {
  const db = await openDB();
  const tx = db.transaction('localPlaylists', 'readwrite');
  const store = tx.objectStore('localPlaylists');

  return new Promise((resolve, reject) => {
    const getReq = store.get(playlistId);
    getReq.onsuccess = () => {
      const playlist = getReq.result;
      if (playlist) {
        playlist.tracks = playlist.tracks.filter((t) => t.trackId !== trackId);
        store.put(playlist);
      }
      tx.oncomplete = resolve;
    };
    tx.onerror = () => reject(tx.error);
  });
}

export async function deletePlaylist(playlistId) {
  const db = await openDB();
  const tx = db.transaction('localPlaylists', 'readwrite');
  const store = tx.objectStore('localPlaylists');
  store.delete(playlistId);
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}
