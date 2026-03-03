'use client';
import React from 'react';

interface PlayheadProps {
  currentTime: number;
  zoom: number;
  containerHeight: number;
}

export default function Playhead({ currentTime, zoom, containerHeight }: PlayheadProps) {
  return (
    <div
      className="absolute bg-red-500 w-1"
      style={{
        left: currentTime * zoom,
        height: containerHeight,
        top: 0,
      }}
    />
  );
}