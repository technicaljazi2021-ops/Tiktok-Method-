/**
 * Video metadata inspection utility
 */

export interface VideoMetadata {
  filename: string;
  filesize: number;
  formattedSize: string;
  duration: number;
  formattedDuration: string;
  width: number;
  height: number;
  aspectRatio: string;
  estimatedFps: number;
  isFastStart: boolean;
  mimeType: string;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export async function checkFastStart(file: File): Promise<boolean> {
  try {
    // Read the first 64KB
    const slice = file.slice(0, 65536);
    const buffer = await slice.arrayBuffer();
    const view = new DataView(buffer);

    let offset = 0;
    let foundMoov = false;
    let foundMdat = false;

    while (offset < buffer.byteLength - 8) {
      const size = view.getUint32(offset, false);
      let type = '';
      for (let i = 0; i < 4; i++) {
        type += String.fromCharCode(view.getUint8(offset + 4 + i));
      }

      if (type === 'moov') {
        foundMoov = true;
        break; // If moov appears before mdat in the first 64KB, it's fast-start
      }
      if (type === 'mdat') {
        foundMdat = true;
        break; // mdat appeared first
      }

      if (size <= 0) break;
      offset += size;
    }

    return foundMoov && !foundMdat;
  } catch (e) {
    return false;
  }
}

export async function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  const isFastStart = await checkFastStart(file);

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const url = URL.createObjectURL(file);
    video.src = url;

    const timeout = setTimeout(() => {
      URL.revokeObjectURL(url);
      // Fallback if video tag stalls
      resolve({
        filename: file.name,
        filesize: file.size,
        formattedSize: formatBytes(file.size),
        duration: 0,
        formattedDuration: '0:00',
        width: 1080,
        height: 1920,
        aspectRatio: '9:16',
        estimatedFps: 60,
        isFastStart,
        mimeType: file.type || 'video/mp4'
      });
    }, 5000);

    video.onloadedmetadata = () => {
      clearTimeout(timeout);
      const width = video.videoWidth || 1080;
      const height = video.videoHeight || 1920;
      const duration = video.duration || 0;

      // Calculate simplified aspect ratio
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(width, height);
      const aspectWidth = width / divisor;
      const aspectHeight = height / divisor;
      const aspectRatio = (aspectWidth <= 16 && aspectHeight <= 16)
        ? `${aspectWidth}:${aspectHeight}`
        : `${(width / height).toFixed(2)}:1`;

      URL.revokeObjectURL(url);

      resolve({
        filename: file.name,
        filesize: file.size,
        formattedSize: formatBytes(file.size),
        duration,
        formattedDuration: formatDuration(duration),
        width,
        height,
        aspectRatio,
        estimatedFps: 60, // Standard modern capture target
        isFastStart,
        mimeType: file.type || 'video/mp4'
      });
    };

    video.onerror = () => {
      clearTimeout(timeout);
      URL.revokeObjectURL(url);
      resolve({
        filename: file.name,
        filesize: file.size,
        formattedSize: formatBytes(file.size),
        duration: 0,
        formattedDuration: '0:00',
        width: 1080,
        height: 1920,
        aspectRatio: '9:16',
        estimatedFps: 60,
        isFastStart,
        mimeType: file.type || 'video/mp4'
      });
    };
  });
}
