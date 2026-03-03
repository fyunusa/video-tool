'use client';
import React, { useState, useEffect } from 'react';
import TimelineRuler from '../components/Timeline/TimelineRuler';
import Timeline from '../components/Timeline/Timeline';
import Playhead from '../components/Timeline/Playhead';
import './page.css';

export default function Page() {
  const [currentTime, setCurrentTime] = useState(0);
  const zoom = 50;
  const duration = 10;
  const containerHeight = 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => (prev < duration ? prev + 0.1 : 0));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container">
      <h1>Clip Forge Timeline Demo</h1>
      <TimelineRuler duration={duration} zoom={zoom} />
      <Timeline />
      <Playhead currentTime={currentTime} zoom={zoom} containerHeight={containerHeight} />
    </div>
  );
}