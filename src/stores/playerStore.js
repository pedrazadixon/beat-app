import { map, onMount } from "nanostores";
import audioEl from "../audioEl";
import { STREAM_API } from "../constants";

const getAudioUrl = async (trackId) => {
  return `${STREAM_API}/play?videoId=${trackId}`;
};

// Inicializamos el estado del reproductor
const initialState = {
  isPlaying: false,
  currentTrackIndex: -1,
  currentTrack: null,
  queue: [],
  isLoading: false,
  currentTime: 0,
  duration: 0,
  isQueueOpen: false,
  queueDrawerWidth: 0,
};

// Creamos el store con el estado inicial
export const playerStore = map(initialState);

// Definimos las acciones que modifican el estado del store
export const playerActions = {
  toggleQueue: () => {
    const state = playerStore.get();
    playerStore.setKey("isQueueOpen", !state.isQueueOpen);
    playerStore.setKey("queueDrawerWidth", state.isQueueOpen ? 0 : 300);
  },

  togglePause: () => {
    if (audioEl.paused) audioEl.play();
    else audioEl.pause();
  },

  playTrack: async (track, newQueue = null) => {
    playerStore.setKey("currentTrack", track);
    playerStore.setKey("isLoading", true);

    if (newQueue) {
      playerStore.setKey("queue", newQueue);
    }

    const state = playerStore.get();
    const trackIndex = state.queue.findIndex(
      (t) => t.trackId === track.trackId
    );

    if (trackIndex !== -1) {
      playerStore.setKey("currentTrackIndex", trackIndex);
      const audioUrl = await getAudioUrl(track.trackId);
      audioEl.src = audioUrl;
      audioEl.play();
    } else {
      const audioUrl = await getAudioUrl(track.trackId);
      audioEl.src = audioUrl;
      playerStore.setKey("currentTrackIndex", 0);
      playerStore.setKey("queue", [track]);
      audioEl.play();
    }
  },

  playNext: async () => {
    const state = playerStore.get();
    if (state.currentTrackIndex < state.queue.length - 1) {
      const nextIndex = state.currentTrackIndex + 1;
      const nextTrack = state.queue[nextIndex];
      playerStore.setKey("currentTrackIndex", nextIndex);
      playerStore.setKey("currentTrack", nextTrack);
      playerStore.setKey("isLoading", true);
      const audioUrl = await getAudioUrl(nextTrack.trackId);
      audioEl.src = audioUrl;
      audioEl.play();
    } else {
      playerStore.setKey("isPlaying", false);
    }
  },

  playPrevious: async () => {
    const state = playerStore.get();
    if (state.currentTrackIndex > 0) {
      const prevIndex = state.currentTrackIndex - 1;
      const prevTrack = state.queue[prevIndex];
      playerStore.setKey("currentTrackIndex", prevIndex);
      playerStore.setKey("currentTrack", prevTrack);
      playerStore.setKey("isLoading", true);
      const audioUrl = await getAudioUrl(prevTrack.trackId);
      audioEl.src = audioUrl;
      audioEl.play();
    } else {
      audioEl.currentTime = 0;
    }
  },

  addToQueueMultiple: (tracks) => {
    const state = playerStore.get();
    playerStore.setKey("queue", [...state.queue, ...tracks]);
  },

  addToQueue: (track) => {
    const state = playerStore.get();
    playerStore.setKey("queue", [...state.queue, track]);
  },

  addToQueueNext: (track) => {
    const state = playerStore.get();
    playerStore.setKey("queue", [
      ...state.queue.slice(0, state.currentTrackIndex + 1),
      track,
      ...state.queue.slice(state.currentTrackIndex + 1),
    ]);
  },

  seekTo: (time) => {
    if (!isNaN(time) && isFinite(time)) {
      audioEl.currentTime = time;
      playerStore.setKey("currentTime", time);
    }
  },
};

onMount(playerStore, () => {

  audioEl.onended = () => {
    playerActions.playNext();
  };

  audioEl.onplay = () => {
    playerStore.setKey("isPlaying", true);
  };

  audioEl.onplaying = () => {
    playerStore.setKey("isLoading", false);
  };

  audioEl.onwaiting = () => {
    playerStore.setKey("isLoading", true);
  };

  audioEl.onerror = () => {
    playerStore.setKey("isLoading", false);
    playerStore.setKey("isPlaying", false);
  };

  audioEl.onpause = () => {
    playerStore.setKey("isPlaying", false);
  };

  audioEl.onloadedmetadata = () => {
    playerStore.setKey("duration", audioEl.duration);
  };

  audioEl.ontimeupdate = () => {
    playerStore.setKey("currentTime", audioEl.currentTime);
  };
});
