// Core data types for Clip Forge

export interface MediaFile {
  id: string;
  name: string;
  type: 'video' | 'audio';
  url: string;
  file: File;
  duration: number; // in seconds
  size: number; // in bytes
  thumbnail?: string;
  metadata: VideoMetadata | AudioMetadata;
}

export interface VideoMetadata {
  width: number;
  height: number;
  fps: number;
  codec?: string;
}

export interface AudioMetadata {
  sampleRate: number;
  channels: number;
  bitrate?: number;
  waveform?: number[]; // Waveform data for visualization
}

export interface TimelineClip {
  id: string;
  mediaId: string; // Reference to MediaFile
  trackId: string; // Which track (video1, audio1, etc)
  startTime: number; // Position on timeline (seconds)
  duration: number; // Clip duration (seconds)
  trimStart: number; // Trim from original (seconds)
  trimEnd: number; // Trim from end (seconds)
  volume?: number; // 0-1 for audio clips
}

export interface Track {
  id: string;
  type: 'video' | 'audio';
  clips: TimelineClip[];
  height: number; // Track height in pixels
  locked: boolean;
  muted: boolean;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number; // Current playhead position (seconds)
  duration: number; // Total timeline duration
  volume: number; // Master volume 0-1
  playbackRate: number; // 1.0 = normal speed
}

export interface TimelineState {
  tracks: Track[];
  zoom: number; // Pixels per second
  snapToGrid: boolean;
  snapInterval: number; // Snap grid interval in seconds
  selectedClipIds: string[];
}

export interface ExportState {
  isExporting: boolean;
  progress: number; // 0-100
  status: 'idle' | 'processing' | 'complete' | 'error';
  error?: string;
  outputUrl?: string;
}

export interface EditorState {
  // Media library
  mediaFiles: MediaFile[];
  
  // Timeline
  timeline: TimelineState;
  
  // Playback
  playback: PlaybackState;
  
  // Export
  export: ExportState;
  
  // UI state
  selectedTool: 'select' | 'trim' | 'split';
  darkMode: boolean;
}

// Action types for store
export interface EditorActions {
  // Media actions
  addMediaFile: (file: MediaFile) => void;
  removeMediaFile: (id: string) => void;
  
  // Timeline actions
  addClip: (clip: TimelineClip) => void;
  updateClip: (id: string, updates: Partial<TimelineClip>) => void;
  removeClip: (id: string) => void;
  selectClip: (id: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  
  // Playback actions
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  
  // Timeline controls
  setZoom: (zoom: number) => void;
  toggleSnapToGrid: () => void;
  
  // Export actions
  startExport: () => void;
  updateExportProgress: (progress: number) => void;
  completeExport: (url: string) => void;
  failExport: (error: string) => void;
  resetExport: () => void;
}

// Utility types
export type TimeFormat = 'MM:SS' | 'HH:MM:SS' | 'MM:SS.ms';

export interface TimelinePosition {
  x: number; // Pixel position
  time: number; // Time in seconds
}