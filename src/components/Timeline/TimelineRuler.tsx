'use client';
import React from 'react';
import './TimelineRuler.css';

interface TimelineRulerProps {
  duration: number;
  zoom: number;
}

export default function TimelineRuler({ duration, zoom }: TimelineRulerProps) {
  const markers: number[] = [];
  const interval = 1; // every second

  for (let i = 0; i <= duration; i += interval) markers.push(i);

  return (
    <div className="timeline-ruler">
      {markers.map((time) => (
        <div
          key={time}
          className="timeline-marker"
          style={{ '--left': `${time * zoom}px` } as React.CSSProperties}
        >
          <div className="timeline-marker-line" />
        </div>
      ))}
    </div>
  );
}