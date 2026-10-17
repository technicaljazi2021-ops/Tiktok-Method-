import React, { useRef, useState } from 'react';
import { Upload, Video, Film, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { VideoMetadata } from '../utils/videoMetadata';

interface VideoDropzoneProps {
  videoFile: File | null;
  videoUrl: string | null;
  metadata: VideoMetadata | null;
  onSelectFile: (file: File) => void;
  onClearFile: () => void;
}

export const VideoDropzone: React.FC<VideoDropzoneProps> = ({
  videoFile,
  videoUrl,
  metadata,
  onSelectFile,
  onClearFile
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/') || file.name.match(/\.(mp4|mov|webm|mkv|avi|m4v)$/i)) {
        onSelectFile(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSelectFile(e.target.files[0]);
    }
  };

  return (
    <div className="source-panel backdrop-blur-2xl bg-white/[0.03] border border-cyan-500/20 rounded-3xl p-5 shadow-[0_28px_80px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col">
      {/* Topline indicator */}
      <div className="flex items-center justify-between min-h-[32px] px-2 pb-3 text-[11px] text-zinc-400 border-b border-white/[0.06] mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${videoFile ? 'bg-cyan-400 shadow-[0_0_10px_#00f0ff]' : 'bg-zinc-600'}`} />
          <span className="font-bold uppercase tracking-wider text-[10px] text-zinc-300">
            {videoFile ? 'STEP 1: SOURCE LOADED & READY' : 'STEP 1: SOURCE INSPECTION ENGINE'}
          </span>
        </div>
        <div className="text-[10px] text-cyan-400 font-mono font-bold">
          {videoFile ? `${metadata?.width}x${metadata?.height} @ ${metadata?.estimatedFps}FPS` : 'AWAITING VIDEO INPUT'}
        </div>
      </div>

      {/* Main Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !videoFile && fileInputRef.current?.click()}
        className={`relative w-full min-h-[460px] lg:min-h-[520px] rounded-2xl flex flex-col items-center justify-center transition-all duration-300 overflow-hidden ${
          !videoFile ? 'cursor-pointer hover:border-cyan-400/50 hover:bg-cyan-500/[0.02]' : ''
        } ${
          isDragging
            ? 'border-2 border-dashed border-cyan-400 bg-cyan-500/[0.08] scale-[0.995]'
            : videoFile
            ? 'border border-cyan-500/20 bg-black/60'
            : 'border-2 border-dashed border-white/[0.15] bg-[#030712]/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm,video/x-matroska,.mkv"
          className="hidden"
          onChange={handleFileInput}
        />

        {videoFile && videoUrl ? (
          <>
            {/* Embedded Video Preview */}
            <video
              src={videoUrl}
              controls
              playsInline
              loop
              className="absolute inset-0 w-full h-full object-contain bg-black rounded-2xl"
            />

            {/* Replace Video Floating Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md bg-black/80 hover:bg-black/95 border border-cyan-400/30 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Replace Video</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
            {/* Animated Pulsing Blue Icon */}
            <div className="relative flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-cyan-500/[0.08] border border-cyan-400/40 shadow-[0_0_50px_rgba(0,240,255,0.2)] group-hover:scale-105 transition-transform">
              <div className="absolute inset-[-10px] rounded-full border border-cyan-400/20 animate-ping opacity-25" />
              <div className="absolute inset-[-20px] rounded-full border border-cyan-400/10" />
              <Upload className="w-9 h-9 text-cyan-400" />
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight mb-2">
              Drop your video here to patch
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Bypass aggressive TikTok compression. Injects fast-start container atoms, timescale alignment, and 60 / 90 FPS support.
            </p>

            {/* Format Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-400/30 rounded-md">
                1080P 60FPS
              </span>
              <span className="px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-cyan-300 bg-cyan-500/10 border border-cyan-400/30 rounded-md">
                1080P 90FPS
              </span>
              <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-zinc-300 bg-white/[0.05] border border-white/[0.1] rounded-md">
                1080P 120FPS
              </span>
              <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-zinc-300 bg-white/[0.05] border border-white/[0.1] rounded-md">
                FASTSTART MOOV
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Source Readout Grid */}
      {videoFile && metadata && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/50 border border-cyan-500/15 rounded-xl p-2.5">
          <div className="p-2.5 bg-[#070b14] rounded-lg border border-white/[0.04]">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold mb-1">
              File Name
            </span>
            <strong className="text-xs text-zinc-200 font-medium block truncate" title={metadata.filename}>
              {metadata.filename}
            </strong>
          </div>

          <div className="p-2.5 bg-[#070b14] rounded-lg border border-white/[0.04]">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold mb-1">
              Resolution
            </span>
            <div className="flex items-center gap-1.5">
              <strong className="text-xs text-zinc-200 font-medium">
                {metadata.width} × {metadata.height}
              </strong>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-400/20">
                {metadata.aspectRatio}
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-[#070b14] rounded-lg border border-white/[0.04]">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold mb-1">
              Duration & Size
            </span>
            <strong className="text-xs text-zinc-200 font-medium">
              {metadata.formattedDuration} • {metadata.formattedSize}
            </strong>
          </div>

          <div className="p-2.5 bg-[#070b14] rounded-lg border border-white/[0.04]">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold mb-1">
              Container Layout
            </span>
            <div className="flex items-center gap-1.5">
              {metadata.isFastStart ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-xs text-emerald-400 font-medium">Fast-Start [moov-first]</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-xs text-cyan-400 font-medium">Needs Patch [mdat-first]</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
