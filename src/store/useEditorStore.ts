import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  EditorState,
  EditorActions,
  MediaFile,
  TimelineClip,
  Track,
} from './types';

interface EditorStore extends EditorState, EditorActions {}

export const useEditorStore = create<EditorStore>()(
  devtools(
    (set, get) => ({
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
        zoom: 100, // 100 pixels per second
        snapToGrid: true,
        snapInterval: 0.1, // 100ms
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
      addMediaFile: (file) =>
        set((state) => ({
          mediaFiles: [...state.mediaFiles, file],
        })),

      removeMediaFile: (id) =>
        set((state) => ({
          mediaFiles: state.mediaFiles.filter((f) => f.id !== id),
        })),

      // Timeline actions
      addClip: (clip) =>
        set((state) => {
          // Find the appropriate track
          const trackIndex = state.timeline.tracks.findIndex(
            (t) => t.id === clip.trackId
          );
          
          if (trackIndex === -1) return state;

          const newTracks = [...state.timeline.tracks];
          newTracks[trackIndex] = {
            ...newTracks[trackIndex],
            clips: [...newTracks[trackIndex].clips, clip],
          };

          // Update timeline duration if needed
          const clipEnd = clip.startTime + clip.duration;
          const newDuration = Math.max(state.playback.duration, clipEnd);

          return {
            timeline: {
              ...state.timeline,
              tracks: newTracks,
            },
            playback: {
              ...state.playback,
              duration: newDuration,
            },
          };
        }),

      updateClip: (id, updates) =>
        set((state) => {
          const newTracks = state.timeline.tracks.map((track) => ({
            ...track,
            clips: track.clips.map((clip) =>
              clip.id === id ? { ...clip, ...updates } : clip
            ),
          }));

          // Recalculate timeline duration
          let maxDuration = 0;
          newTracks.forEach((track) => {
            track.clips.forEach((clip) => {
              const clipEnd = clip.startTime + clip.duration;
              if (clipEnd > maxDuration) maxDuration = clipEnd;
            });
          });

          return {
            timeline: {
              ...state.timeline,
              tracks: newTracks,
            },
            playback: {
              ...state.playback,
              duration: maxDuration,
            },
          };
        }),

      removeClip: (id) =>
        set((state) => {
          const newTracks = state.timeline.tracks.map((track) => ({
            ...track,
            clips: track.clips.filter((clip) => clip.id !== id),
          }));

          return {
            timeline: {
              ...state.timeline,
              tracks: newTracks,
              selectedClipIds: state.timeline.selectedClipIds.filter(
                (clipId) => clipId !== id
              ),
            },
          };
        }),

      selectClip: (id, multiSelect = false) =>
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
          timeline: {
            ...state.timeline,
            selectedClipIds: [],
          },
        })),

      // Playback actions
      play: () =>
        set((state) => ({
          playback: {
            ...state.playback,
            isPlaying: true,
          },
        })),

      pause: () =>
        set((state) => ({
          playback: {
            ...state.playback,
            isPlaying: false,
          },
        })),

      seek: (time) =>
        set((state) => ({
          playback: {
            ...state.playback,
            currentTime: Math.max(0, Math.min(time, state.playback.duration)),
          },
        })),

      setVolume: (volume) =>
        set((state) => ({
          playback: {
            ...state.playback,
            volume: Math.max(0, Math.min(1, volume)),
          },
        })),

      setPlaybackRate: (rate) =>
        set((state) => ({
          playback: {
            ...state.playback,
            playbackRate: rate,
          },
        })),

      // Timeline controls
      setZoom: (zoom) =>
        set((state) => ({
          timeline: {
            ...state.timeline,
            zoom: Math.max(20, Math.min(500, zoom)), // Min 20px/s, max 500px/s
          },
        })),

      toggleSnapToGrid: () =>
        set((state) => ({
          timeline: {
            ...state.timeline,
            snapToGrid: !state.timeline.snapToGrid,
          },
        })),

      // Export actions
      startExport: () =>
        set((state) => ({
          export: {
            ...state.export,
            isExporting: true,
            progress: 0,
            status: 'processing',
          },
        })),

      updateExportProgress: (progress) =>
        set((state) => ({
          export: {
            ...state.export,
            progress,
          },
        })),

      completeExport: (url) =>
        set((state) => ({
          export: {
            isExporting: false,
            progress: 100,
            status: 'complete',
            outputUrl: url,
          },
        })),

      failExport: (error) =>
        set((state) => ({
          export: {
            isExporting: false,
            progress: 0,
            status: 'error',
            error,
          },
        })),

      resetExport: () =>
        set((state) => ({
          export: {
            isExporting: false,
            progress: 0,
            status: 'idle',
          },
        })),
    }),
    { name: 'EditorStore' }
  )
);