import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  EditorStore,
  MediaFile,
  TimelineClip,
  Track,
  EditorState,
  EditorActions
} from './types';



export const useEditorStore = create<EditorStore>()(
  devtools((set, get) => ({
    // Initial state
    mediaFiles: [],

    timeline: {
      tracks: [
        {
          id: 'video-track-1',
          type: 'video',
          clips: [],
          height: 120,
          locked: false,
          muted: false,
        },
        {
          id: 'audio-track-1',
          type: 'audio',
          clips: [],
          height: 80,
          locked: false,
          muted: false,
        },
      ],
      zoom: 100,
      snapToGrid: true,
      snapInterval: 0.1,
      selectedClipIds: [],
    },

    playback: {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      playbackRate: 1,
    },

    export: {
      isExporting: false,
      progress: 0,
      status: 'idle',
    },

    selectedTool: 'select',
    darkMode: true,

    // Media actions
    addMediaFile: (file: MediaFile) =>
      set((state) => ({
        mediaFiles: [...state.mediaFiles, file],
      })),

    removeMediaFile: (id: string) =>
      set((state) => ({
        mediaFiles: state.mediaFiles.filter((f) => f.id !== id),
      })),

    // Timeline actions
    addClip: (clip: TimelineClip) =>
      set((state) => {
        const trackIndex = state.timeline.tracks.findIndex(
          (t) => t.id === clip.trackId
        );
        if (trackIndex === -1) return state;

        const newTracks = [...state.timeline.tracks];
        newTracks[trackIndex] = {
          ...newTracks[trackIndex],
          clips: [...newTracks[trackIndex].clips, clip],
        };

        const clipEnd = clip.startTime + clip.duration;
        const newDuration = Math.max(state.playback.duration, clipEnd);

        return {
          timeline: { ...state.timeline, tracks: newTracks },
          playback: { ...state.playback, duration: newDuration },
        };
      }),

    updateClip: (id: string, updates: Partial<TimelineClip>) =>
      set((state) => {
        const newTracks = state.timeline.tracks.map((track) => ({
          ...track,
          clips: track.clips.map((clip) =>
            clip.id === id ? { ...clip, ...updates } : clip
          ),
        }));

        let maxDuration = 0;
        newTracks.forEach((track) =>
          track.clips.forEach((clip) => {
            const clipEnd = clip.startTime + clip.duration;
            if (clipEnd > maxDuration) maxDuration = clipEnd;
          })
        );

        return {
          timeline: { ...state.timeline, tracks: newTracks },
          playback: { ...state.playback, duration: maxDuration },
        };
      }),

    removeClip: (id: string) =>
      set((state) => ({
        timeline: {
          ...state.timeline,
          tracks: state.timeline.tracks.map((track) => ({
            ...track,
            clips: track.clips.filter((clip) => clip.id !== id),
          })),
          selectedClipIds: state.timeline.selectedClipIds.filter(
            (clipId) => clipId !== id
          ),
        },
      })),

    selectClip: (id: string, multiSelect = false) =>
      set((state) => ({
        timeline: {
          ...state.timeline,
          selectedClipIds: multiSelect
            ? [...state.timeline.selectedClipIds, id]
            : [id],
        },
      })),

    clearSelection: () =>
      set((state) => ({
        timeline: { ...state.timeline, selectedClipIds: [] },
      })),

    // Playback actions
    play: () =>
      set((state) => ({
        playback: { ...state.playback, isPlaying: true },
      })),

    pause: () =>
      set((state) => ({
        playback: { ...state.playback, isPlaying: false },
      })),

    seek: (time: number) =>
      set((state) => ({
        playback: {
          ...state.playback,
          currentTime: Math.max(0, Math.min(time, state.playback.duration)),
        },
      })),

    setVolume: (volume: number) =>
      set((state) => ({
        playback: { ...state.playback, volume: Math.max(0, Math.min(1, volume)) },
      })),

    setPlaybackRate: (rate: number) =>
      set((state) => ({
        playback: { ...state.playback, playbackRate: rate },
      })),

    // Timeline controls
    setZoom: (zoom: number) =>
      set((state) => ({
        timeline: { ...state.timeline, zoom: Math.max(20, Math.min(500, zoom)) },
      })),

    toggleSnapToGrid: () =>
      set((state) => ({
        timeline: { ...state.timeline, snapToGrid: !state.timeline.snapToGrid },
      })),

    // Export actions
    startExport: () =>
      set((state) => ({
        export: { ...state.export, isExporting: true, progress: 0, status: 'processing' },
      })),

    updateExportProgress: (progress: number) =>
      set((state) => ({
        export: { ...state.export, progress },
      })),

    completeExport: (url: string) =>
      set((state) => ({
        export: { isExporting: false, progress: 100, status: 'complete', outputUrl: url },
      })),

    failExport: (error: string) =>
      set((state) => ({
        export: { isExporting: false, progress: 0, status: 'error', error },
      })),

    resetExport: () =>
      set((state) => ({
        export: { isExporting: false, progress: 0, status: 'idle' },
      })),
  }),
  { name: 'EditorStore' })
);