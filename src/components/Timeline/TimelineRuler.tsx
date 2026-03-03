'use client';
import React from 'react';
import './TimelineRuler.css';

interface TimelineRulerProps {
  duration: number;
   zoom: number; 
}

export default function TimelineRuler({ duration }: TimelineRulerProps) {
  const markers: number[] = [];
  const interval = 1;

  for (let i = 0; i <= duration; i += interval) markers.push(i);

  return (
    <div className="timeline-ruler">
      {markers.map((time) => (
        <div key={time} className="timeline-marker">
          <div className="timeline-marker-line" />
          <span className="timeline-marker-label">{time}s</span>
        </div>
      ))}
    </div>
  );
}