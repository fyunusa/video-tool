'use client';
import './Timeline.css';
import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';

export default function Timeline() {
  const { timeline } = useEditorStore();

  return (
    <div className="timeline">
      {timeline.tracks.map((track, trackIndex) => (
        <div key={track.id} className={`timeline-track track-${trackIndex}`}>
          {track.clips.map((clip) => (
            <div key={clip.id} className={`timeline-clip clip-${clip.startTime}-${clip.duration}`}>
              {clip.name}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}