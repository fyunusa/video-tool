

'use client';

import React from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { Play, Pause, SkipBack, SkipForward, ZoomIn, ZoomOut, Grid } from 'lucide-react';

export default function TimelineControls() {
  const { playback, timeline, play, pause, seek, setZoom, toggleSnapToGrid } =
    useEditorStore();

  const handleSkipBack = () => {
    seek(0);
  };

  const handleSkipForward = () => {
    seek(playback.duration);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(timeline.zoom * 1.2, 500);
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(timeline.zoom / 1.2, 20);
    setZoom(newZoom);
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-gray-800 border-b border-gray-700">
      {/* Playback Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleSkipBack}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          title="Skip to Start"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={playback.isPlaying ? pause : play}
          className="p-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors text-white"
          title={playback.isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {playback.isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={handleSkipForward}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          title="Skip to End"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Current Time Display */}
      <div className="text-xs text-gray-400 font-mono min-w-[80px]">
        {formatTime(playback.currentTime)}
        <span className="text-gray-600 mx-1">/</span>
        {formatTime(playback.duration)}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-gray-700" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="text-xs text-gray-400 min-w-[60px] text-center font-mono">
          {Math.round(timeline.zoom)}px/s
        </div>

        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-300 hover:text-white"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Snap to Grid Toggle */}
      <button
        onClick={toggleSnapToGrid}
        className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors text-xs ${
          timeline.snapToGrid
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
        }`}
        title="Toggle Snap to Grid"
      >
        <Grid className="w-3.5 h-3.5" />
        <span>Snap</span>
      </button>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}