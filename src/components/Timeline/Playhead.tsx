'use client';
import React, { useEffect, useRef } from 'react';
import './Playhead.css'; // import CSS file

interface PlayheadProps {
  currentTime: number;
  zoom: number;
  containerHeight: number;
}

export default function Playhead({ currentTime, zoom, containerHeight }: PlayheadProps) {
  const playheadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playheadRef.current) {
      playheadRef.current.style.setProperty('--playhead-left', `${currentTime * zoom}px`);
      playheadRef.current.style.setProperty('--playhead-height', `${containerHeight}px`);
    }
  }, [currentTime, zoom, containerHeight]);

  return <div ref={playheadRef} className="playhead" />;
}