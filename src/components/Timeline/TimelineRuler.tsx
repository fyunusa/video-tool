'use client';

import React from 'react';
import { formatTime } from '@/utils/timeUtils';

interface TimelineRulerProps {
  duration: number;
  zoom: number;
}

export default function TimelineRuler({ duration, zoom }: TimelineRulerProps) {
  // Calculate how many markers to show based on zoom level
  const getMarkerInterval = (): number => {
    if (zoom >= 300) return 0.5; // Every 0.5 seconds
    if (zoom >= 150) return 1; // Every 1 second
    if (zoom >= 75) return 2; // Every 2 seconds
    if (zoom >= 40) return 5; // Every 5 seconds
    if (zoom >= 20) return 10; // Every 10 seconds
    return 30; // Every 30 seconds
  };

  const interval = getMarkerInterval();
  const markers: number[] = [];

  // Generate markers from 0 to duration
  for (let time = 0; time <= duration; time += interval) {
    markers.push(time);
  }

  // Add final marker if needed
  if (markers[markers.length - 1] < duration) {
    markers.push(duration);
  }

  return (
    <div className="h-10 bg-gray-800 border-b border-gray-700 relative ml-32">
      <div className="relative h-full">
        {markers.map((time) => {
          const x = time * zoom;
          const isMainMarker = time % (interval * 2) === 0;

          return (
            <div
              key={time}
              className="absolute top-0 bottom-0 flex flex-col items-center"
              style={{ left: `${x}px` }}
            >
              {/* Marker line */}
              <div
                className={`w-px bg-gray-600 ${
                  isMainMarker ? 'h-full' : 'h-2'
                }`}
              />

              {/* Time label (only for main markers) */}
              {isMainMarker && (
                <span className="text-[10px] text-gray-400 mt-1 select-none">
                  {formatTime(time)}
                </span>
              )}

              {/* Sub-markers (between main markers) */}
              {zoom >= 100 && !isMainMarker && (
                <div className="absolute top-0 left-0 flex flex-col">
                  {Array.from({ length: Math.floor(interval) }).map((_, i) => {
                    const subTime = time + (i + 1) * (interval / Math.floor(interval));
                    const subX = subTime * zoom - x;
                    
                    return (
                      <div
                        key={i}
                        className="absolute top-0 w-px h-1 bg-gray-700"
                        style={{ left: `${subX}px` }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}