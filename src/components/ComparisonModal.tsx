import React, { useRef, useState, useEffect } from 'react';
import { X, Play, Pause, CheckCircle2 } from 'lucide-react';
import { formatBytes, VideoMetadata } from '../utils/videoMetadata';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalUrl: string;
  processedUrl: string;
  metadata: VideoMetadata | null;
  outputBlob: Blob | null;
  targetFps: string | number;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  originalUrl,
  processedUrl,
  metadata,
  outputBlob,
  targetFps
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
    }
  }, [isOpen]);

  const togglePlay = () => {
    if (!video1Ref.current || !video2Ref.current) return;

    if (isPlaying) {
      video1Ref.current.pause();
      video2Ref.current.pause();
      setIsPlaying(false);
    } else {
      video2Ref.current.currentTime = video1Ref.current.currentTime;
      video1Ref.current.play();
      video2Ref.current.play();
      setIsPlaying(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#090d16] border border-cyan-500/25 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span className="text-cyan-400">Comparison Inspector:</span>
              <span>Original vs TikTok Optimized</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Synchronized side-by-side playback to verify motion fluidity and detail preservation.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 flex-1 overflow-hidden min-h-[360px]">
          {/* Original */}
          <div className="relative flex flex-col bg-black rounded-2xl border border-white/[0.08] overflow-hidden">
            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-bold text-zinc-300">
              ORIGINAL SOURCE
            </div>
            <video
              ref={video1Ref}
              src={originalUrl}
              playsInline
              loop
              muted
              className="w-full h-full object-contain"
            />
            <div className="p-3 bg-[#070b14] border-t border-white/[0.06] text-[11px] text-zinc-400 flex justify-between">
              <span>{metadata?.width}x{metadata?.height}</span>
              <span>{metadata?.formattedSize}</span>
              <span className="text-zinc-500">{metadata?.isFastStart ? 'FastStart' : 'No FastStart'}</span>
            </div>
          </div>

          {/* Optimized */}
          <div className="relative flex flex-col bg-black rounded-2xl border border-cyan-500/40 overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.15)]">
            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-[10px] font-black uppercase shadow-md">
              TIKTOK PATCHED ({targetFps} FPS)
            </div>
            <video
              ref={video2Ref}
              src={processedUrl}
              playsInline
              loop
              muted
              className="w-full h-full object-contain"
            />
            <div className="p-3 bg-[#070b14] border-t border-white/[0.06] text-[11px] text-zinc-400 flex justify-between">
              <span>1080p Canvas</span>
              <span>{outputBlob ? formatBytes(outputBlob.size) : 'Ready'}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Fast-Start Active
              </span>
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 text-black font-extrabold text-xs shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:brightness-110 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>PAUSE SYNC</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>PLAY BOTH SIMULTANEOUSLY</span>
              </>
            )}
          </button>

          <span className="text-xs text-zinc-400">
            Audio is muted for synchronized dual comparison
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
