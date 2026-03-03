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
  isSelected,
}: TimelineClipProps) {
  return (
    <div
      className={`timeline-clip ${isSelected ? 'selected' : ''}`}
      data-start={clip.start}
      data-end={clip.end}
      data-height={clip.trackHeight}
    >
      {clip.name}
    </div>
  );
}