import type { MediaFile, VideoMetadata, AudioMetadata } from '@/store/types';

/**
 * Extract video metadata using HTML5 Video API
 */
export async function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      const metadata: VideoMetadata = {
        width: video.videoWidth,
        height: video.videoHeight,
        fps: 30, // Default, hard to extract without specialized libraries
      };

      URL.revokeObjectURL(video.src);
      resolve(metadata);
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video metadata'));
    };

    video.src = URL.createObjectURL(file);
  });
}

/**
 * Extract audio metadata using Web Audio API
 */
export async function extractAudioMetadata(file: File): Promise<AudioMetadata> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const metadata: AudioMetadata = {
      sampleRate: audioBuffer.sampleRate,
      channels: audioBuffer.numberOfChannels,
    };

    // Generate basic waveform data
    const waveform = generateWaveformData(audioBuffer);
    metadata.waveform = waveform;

    return metadata;
  } catch (error) {
    throw new Error('Failed to extract audio metadata');
  } finally {
    audioContext.close();
  }
}

/**
 * Generate waveform data for visualization
 */
function generateWaveformData(audioBuffer: AudioBuffer, samples = 500): number[] {
  const rawData = audioBuffer.getChannelData(0);
  const blockSize = Math.floor(rawData.length / samples);
  const waveform: number[] = [];

  for (let i = 0; i < samples; i++) {
    const start = blockSize * i;
    let sum = 0;
    
    for (let j = 0; j < blockSize; j++) {
      sum += Math.abs(rawData[start + j]);
    }
    
    waveform.push(sum / blockSize);
  }

  return waveform;
}

/**
 * Get video duration
 */
export async function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      const duration = video.duration;
      URL.revokeObjectURL(video.src);
      resolve(duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video'));
    };

    video.src = URL.createObjectURL(file);
  });
}

/**
 * Get audio duration
 */
export async function getAudioDuration(file: File): Promise<number> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer.duration;
  } finally {
    audioContext.close();
  }
}

/**
 * Process uploaded media file
 */
export async function processMediaFile(file: File): Promise<MediaFile> {
  const id = `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const url = URL.createObjectURL(file);
  const type = file.type.startsWith('video') ? 'video' : 'audio';

  let duration: number;
  let metadata: VideoMetadata | AudioMetadata;

  if (type === 'video') {
    duration = await getVideoDuration(file);
    metadata = await extractVideoMetadata(file);
  } else {
    duration = await getAudioDuration(file);
    metadata = await extractAudioMetadata(file);
  }

  const mediaFile: MediaFile = {
    id,
    name: file.name,
    type,
    url,
    file,
    duration,
    size: file.size,
    metadata,
  };

  return mediaFile;
}

/**
 * Validate file type
 */
export function validateMediaFile(file: File): { valid: boolean; error?: string } {
  const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  const validAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
  
  const isVideo = validVideoTypes.includes(file.type);
  const isAudio = validAudioTypes.includes(file.type);

  if (!isVideo && !isAudio) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload MP4, WebM, MOV, MP3, or WAV files.',
    };
  }

  // Check file size (max 500MB)
  const maxSize = 500 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 500MB limit.',
    };
  }

  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}