/**
 * Generate thumbnail from video file
 */
export async function generateVideoThumbnail(
  file: File,
  timeInSeconds = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    video.preload = 'metadata';
    video.muted = true;

    video.onloadedmetadata = () => {
      // Set thumbnail time (ensure it's within video duration)
      video.currentTime = Math.min(timeInSeconds, video.duration - 0.1);
    };

    video.onseeked = () => {
      try {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to data URL
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);

        // Cleanup
        URL.revokeObjectURL(video.src);
        resolve(thumbnailUrl);
      } catch (error) {
        URL.revokeObjectURL(video.src);
        reject(error);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video for thumbnail'));
    };

    video.src = URL.createObjectURL(file);
  });
}

/**
 * Generate multiple thumbnails for timeline scrubbing
 */
export async function generateThumbnailStrip(
  file: File,
  count = 10
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const thumbnails: string[] = [];
    let currentIndex = 0;

    video.preload = 'metadata';
    video.muted = true;

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Calculate time intervals
      const interval = video.duration / (count + 1);
      
      // Seek to first thumbnail position
      video.currentTime = interval;
    };

    video.onseeked = () => {
      try {
        // Draw current frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
        thumbnails.push(thumbnailUrl);

        currentIndex++;

        if (currentIndex < count) {
          // Seek to next position
          const interval = video.duration / (count + 1);
          video.currentTime = interval * (currentIndex + 1);
        } else {
          // All thumbnails generated
          URL.revokeObjectURL(video.src);
          resolve(thumbnails);
        }
      } catch (error) {
        URL.revokeObjectURL(video.src);
        reject(error);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to generate thumbnail strip'));
    };

    video.src = URL.createObjectURL(file);
  });
}

/**
 * Generate audio waveform visualization as image
 */
export async function generateAudioWaveformImage(
  waveformData: number[],
  width = 800,
  height = 80
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = width;
  canvas.height = height;

  // Clear canvas
  ctx.fillStyle = '#1f2937'; // gray-800
  ctx.fillRect(0, 0, width, height);

  // Draw waveform
  const barWidth = width / waveformData.length;
  const centerY = height / 2;

  ctx.fillStyle = '#8b5cf6'; // purple-500

  waveformData.forEach((value, index) => {
    const barHeight = value * centerY;
    const x = index * barWidth;
    
    // Draw bar (centered vertically)
    ctx.fillRect(
      x,
      centerY - barHeight / 2,
      barWidth - 1,
      barHeight
    );
  });

  return canvas.toDataURL('image/png', 0.9);
}

/**
 * Resize image while maintaining aspect ratio
 */
export function resizeImage(
  imageUrl: string,
  maxWidth: number,
  maxHeight: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}