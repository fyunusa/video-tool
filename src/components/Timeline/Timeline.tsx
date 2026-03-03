'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { ZoomIn, ZoomOut, Grid } from 'lucide-react';
import TimelineClip from './TimelineClip';
import TimelineRuler from './TimelineRuler';
import Playhead from './Playhead';
export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const {
    timeline,
    playback,
    setZoom,
    toggleSnapToGrid,
    seek,
  } = useEditorStore();
  // Handle zoom controls
  const handleZoomIn = () => {
    setZoom(timeline.zoom * 1.2);
  };
  const handleZoomOut = () => {
    setZoom(timeline.zoom / 1.2);
  };
  // Handle timeline click for seeking
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current && !isDragging) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const time = clickX / timeline.zoom;
      
      // Apply snap if enabled
      const snappedTime = timeline.snapToGrid
        ? Math.round(time / timeline.snapInterval) * timeline.snapInterval
        : time;
      
      seek(snappedTime);
    }
  };
  return (
    <div className="flex flex-col h-full bg-gray-900 border-t border-gray-800">
      {/* Timeline Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <div className="text-xs text-gray-400 min-w-[80px] text-center">
            {Math.round(timeline.zoom)}px/s
          </div>
          
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={toggleSnapToGrid}
          className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${
            timeline.snapToGrid
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
          title="Toggle Snap to Grid"
        >
          <Grid className="w-4 h-4" />
          <span className="text-xs">Snap</span>
        </button>
        <div className="text-xs text-gray-400">
          Duration: {formatTime(playback.duration)}
        </div>
      </div>
      {/* Timeline Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto relative bg-gray-900 timeline-container"
        onClick={handleTimelineClick}
      >
        {/* Time Ruler */}
        <TimelineRuler
          duration={playback.duration}
          zoom={timeline.zoom}
        />
        {/* Tracks */}
        <div className="relative">
          {timeline.tracks.map((track, index) => (
            <div
              key={track.id}
              className="relative border-b border-gray-800"
              style={{ height: track.height }}
            >
              {/* Track Label */}
              <div className="absolute left-0 top-0 w-32 h-full bg-gray-800 border-r border-gray-700 flex items-center justify-center">
                <span className="text-xs text-gray-400 font-medium uppercase">
                  {track.type} {index + 1}
                </span>
              </div>
              {/* Track Content */}
              <div className="ml-32 relative h-full bg-gray-900/50">
                {track.clips.map((clip) => (
                  <TimelineClip
                    key={clip.id}
                    clip={clip}
                    track={track}
                    zoom={timeline.zoom}
                    snapToGrid={timeline.snapToGrid}
                    snapInterval={timeline.snapInterval}
                    isSelected={timeline.selectedClipIds.includes(clip.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* Playhead */}
        <Playhead
          currentTime={playback.currentTime}
          zoom={timeline.zoom}
          containerHeight={timeline.tracks.reduce((sum, t) => sum + t.height, 0) + 40}
        />
      </div>
    </div>
  );
}
// Utility function to format time
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}