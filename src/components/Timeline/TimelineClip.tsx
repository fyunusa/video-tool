'use client';
import React from 'react';
import './TimelineClip.css';

interface TimelineClipProps {
  clip: any;
  track: any;
  zoom: number;
  snapToGrid: boolean;
  snapInterval: number;
  isSelected: boolean;
}

export default function TimelineClip({
  clip,
  track,
  zoom,
  isSelected,
}: TimelineClipProps) {
  return (
    <div
      className={`timeline-clip ${isSelected ? 'selected' : ''}`}
      style={{
        '--left': `${clip.start * zoom}px`,
        '--width': `${(clip.end - clip.start) * zoom}px`,
        '--height': `${track.height - 4}px`,
      } as React.CSSProperties}
    >
      {clip.name}
    </div>
  );
}