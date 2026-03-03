'use client';
import React from 'react';

interface TimelineRulerProps {
  duration: number;
  zoom: number;
}

export default function TimelineRuler({ duration, zoom }: TimelineRulerProps) {
  const markers: number[] = [];
  const interval = 1; // every second

  for (let i = 0; i <= duration; i += interval) markers.push(i);

  return (
    <div className="h-10 bg-gray-800 border-b border-gray-700 relative ml-32">
      {markers.map((time) => (
        <div key={time} className="absolute top-0 bottom-0" style={{ left: `${time * zoom}px` }}>
          <div className="w-px h-full bg-gray-600" />
        </div>
      ))}
    </div>
  );
}