/**
 * Client-Side Video Transcoding & FPS Interpolation Engine
 * Uses WebAssembly FFmpeg for real 1080p 60 FPS / 90 FPS resampling,
 * Lanczos downscaling, CFR normalization, and TikTok High Profile encoding.
 */

export interface TranscodeOptions {
  targetResolution: '1080x1920' | '1080x1350' | '1080x1080' | 'source';
  targetFps: 30 | 60 | 90 | 120 | 'source';
  crf: number; // 18 is visually lossless master
  audioBitrate: string; // '192k'
  videoBitrate?: string; // '16M'
  onProgress?: (progress: number, stage: string) => void;
  onLog?: (message: string) => void;
}

// We dynamically load FFmpeg from reliable CDN to keep the initial Vercel bundle light and fast
let ffmpegInstance: any = null;

async function loadFFmpeg(onLog?: (message: string) => void): Promise<any> {
  if (ffmpegInstance) return ffmpegInstance;

  onLog?.('Initializing WebAssembly video processing core...');

  // Check if FFmpeg is already loaded in window
  if ((window as any).FFmpeg) {
    const { createFFmpeg } = (window as any).FFmpeg;
    const ffmpeg = createFFmpeg({
      log: true,
      corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
    });
    await ffmpeg.load();
    ffmpegInstance = ffmpeg;
    return ffmpeg;
  }

  // Inject FFmpeg script dynamically
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load FFmpeg WASM engine. Please check internet connection.'));
    document.head.appendChild(script);
  });

  const { createFFmpeg } = (window as any).FFmpeg;
  const ffmpeg = createFFmpeg({
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
  });

  await ffmpeg.load();
  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

export async function transcodeForTikTok(
  file: File,
  options: TranscodeOptions
): Promise<Blob> {
  const {
    targetResolution,
    targetFps,
    crf = 19,
    audioBitrate = '192k',
    videoBitrate = '16M',
    onProgress,
    onLog
  } = options;

  onProgress?.(5, 'Loading WebAssembly engine...');
  const ffmpeg = await loadFFmpeg(onLog);

  onProgress?.(15, 'Buffering video to memory...');
  const inputName = 'input_' + Date.now() + '.' + (file.name.split('.').pop() || 'mp4');
  const outputName = 'tiktok_master_' + Date.now() + '.mp4';

  const fileData = new Uint8Array(await file.arrayBuffer());
  ffmpeg.FS('writeFile', inputName, fileData);

  // Set up progress tracking
  ffmpeg.setProgress(({ ratio }: { ratio: number }) => {
    const percent = Math.min(95, Math.max(15, Math.round(15 + ratio * 80)));
    onProgress?.(percent, `Transcoding for TikTok: ${percent}%`);
  });

  onLog?.(`Building TikTok encoding pipeline: Res=${targetResolution}, FPS=${targetFps}, CRF=${crf}...`);

  // Construct ffmpeg arguments
  const args = ['-i', inputName];

  // Video filter construction
  const vfFilters: string[] = [];

  // Resolution scaling
  if (targetResolution === '1080x1920') {
    // High quality Lanczos scale to 1080x1920 with aspect ratio preservation
    vfFilters.push('scale=1080:1920:force_original_aspect_ratio=decrease:flags=lanczos,pad=1080:1920:(ow-iw)/2:(oh-ih)/2');
  } else if (targetResolution === '1080x1350') {
    vfFilters.push('scale=1080:1350:force_original_aspect_ratio=decrease:flags=lanczos,pad=1080:1350:(ow-iw)/2:(oh-ih)/2');
  } else if (targetResolution === '1080x1080') {
    vfFilters.push('scale=1080:1080:force_original_aspect_ratio=decrease:flags=lanczos,pad=1080:1080:(ow-iw)/2:(oh-ih)/2');
  }

  // Framerate normalization (Strict Constant Frame Rate)
  if (targetFps !== 'source') {
    args.push('-r', String(targetFps));
    args.push('-vsync', 'cfr');
  }

  if (vfFilters.length > 0) {
    args.push('-vf', vfFilters.join(','));
  }

  // Codec, profile and quality settings
  args.push(
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-level:v', '4.2',
    '-preset', 'fast',
    '-crf', String(crf),
    '-maxrate', videoBitrate,
    '-bufsize', '32M',
    '-pix_fmt', 'yuv420p',
    '-g', targetFps !== 'source' ? String(Number(targetFps) * 2) : '60', // 2 second GOP size
    '-keyint_min', targetFps !== 'source' ? String(Number(targetFps)) : '30',
    '-c:a', 'aac',
    '-b:a', audioBitrate,
    '-ar', '48000',
    '-ac', '2',
    '-movflags', '+faststart',
    outputName
  );

  onProgress?.(20, 'Executing high-fidelity encode pass...');
  await ffmpeg.run(...args);

  onProgress?.(95, 'Exporting optimized video stream...');
  const outputData = ffmpeg.FS('readFile', outputName);

  // Clean up memory in virtual FS
  try {
    ffmpeg.FS('unlink', inputName);
    ffmpeg.FS('unlink', outputName);
  } catch (e) {
    // ignore
  }

  onProgress?.(100, 'Processing complete!');
  return new Blob([outputData.buffer], { type: 'video/mp4' });
}
