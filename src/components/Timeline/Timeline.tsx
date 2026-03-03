'use client';
import React, { useRef, useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import TimelineClip from './TimelineClip';
import TimelineRuler from './TimelineRuler';
import Playhead from './Playhead';

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { timeline, playback, setZoom, toggleSnapToGrid, seek } = useEditorStore();

  return (
    <div className="flex flex-col h-full bg-gray-900 border-t border-gray-800">
      <div
        ref={containerRef}
        className="flex-1 overflow-auto relative bg-gray-900"
      >
        <TimelineRuler duration={playback.duration} zoom={timeline.zoom} />
        {timeline.tracks.map((track, index) => (
          <div key={track.id} className="relative border-b border-gray-800" style={{ height: track.height }}>
            <div className="ml-32 relative h-full">
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
        <Playhead currentTime={playback.currentTime} zoom={timeline.zoom} containerHeight={timeline.tracks.reduce((sum, t) => sum + t.height, 0) + 40} />
      </div>
    </div>
  );
}