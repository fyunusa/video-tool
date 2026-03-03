'use client';
import React from 'react';

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
      className={`absolute bg-purple-600 ${isSelected ? 'border-2 border-yellow-500' : ''}`}
      style={{
        left: clip.start * zoom,
        width: (clip.end - clip.start) * zoom,
        height: track.height - 4,
        top: 2,
      }}
    >
      {clip.name}
    </div>
  );
}