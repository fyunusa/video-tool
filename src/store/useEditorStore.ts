import { create } from 'zustand';
interface Clip {
  id: string;
  name: string;
  start: number;
  end: number;
}

interface Track {
  id: string;
  type: string;
  height: number;
  clips: Clip[];
}

interface Timeline {
  zoom: number;
  snapToGrid: boolean;
  snapInterval: number;
  tracks: Track[];
  selectedClipIds: string[];
}

interface Playback {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
}

interface EditorStore {
  timeline: Timeline;
  playback: Playback;
  setZoom: (zoom: number) => void;
  toggleSnapToGrid: () => void;
  seek: (time: number) => void;
  play: () => void;
  pause: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  timeline: {
    zoom: 100,
    snapToGrid: true,
    snapInterval: 1,
    tracks: [],
    selectedClipIds: [],
  },
  playback: {
    currentTime: 0,
    duration: 60,
    isPlaying: false,
  },
  setZoom: (zoom) =>
    set((state) => ({ timeline: { ...state.timeline, zoom } })),
  toggleSnapToGrid: () =>
    set((state) => ({
      timeline: { ...state.timeline, snapToGrid: !state.timeline.snapToGrid },
    })),
  seek: (time) =>
    set((state) => ({ playback: { ...state.playback, currentTime: time } })),
  play: () => set((state) => ({ playback: { ...state.playback, isPlaying: true } })),
  pause: () => set((state) => ({ playback: { ...state.playback, isPlaying: false } })),
}));