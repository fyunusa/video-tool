export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'video' | 'audio' | 'image';
  size: number;
}

export interface TimelineClip {
  id: string;
  trackId: string;
  startTime: number;
  duration: number;
  mediaId: string;
  name: string;
}

export interface Track {
  id: string;
  type: 'video' | 'audio';
  clips: TimelineClip[];
  height: number;
  locked: boolean;
  muted: boolean;
}

export interface EditorState {
  mediaFiles: MediaFile[];
  timeline: {
    tracks: Track[];
    zoom: number;
    snapToGrid: boolean;
    snapInterval: number;
    selectedClipIds: string[];
  };
  playback: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    playbackRate: number;
  };
  export: {
    isExporting: boolean;
    progress: number;
    status: 'idle' | 'processing' | 'complete' | 'error';
    outputUrl?: string;
    error?: string;
  };
  selectedTool: string;
  darkMode: boolean;
}

export interface EditorActions {
  addMediaFile: (file: MediaFile) => void;
  removeMediaFile: (id: string) => void;
  addClip: (clip: TimelineClip) => void;
  updateClip: (id: string, updates: Partial<TimelineClip>) => void;
  removeClip: (id: string) => void;
  selectClip: (id: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setZoom: (zoom: number) => void;
  toggleSnapToGrid: () => void;
  startExport: () => void;
  updateExportProgress: (progress: number) => void;
  completeExport: (url: string) => void;
  failExport: (error: string) => void;
  resetExport: () => void;
}

export interface EditorStore extends EditorState, EditorActions {}