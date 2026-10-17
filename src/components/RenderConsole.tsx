import React from 'react';
import { Play, Download, Eye, Check, Loader2, Sparkles, Cpu, Zap, AlertCircle } from 'lucide-react';
import { VideoMetadata, formatBytes } from '../utils/videoMetadata';
import { PatchVariant } from '../utils/mp4Patcher';

interface RenderConsoleProps {
  hasVideo: boolean;
  isProcessing: boolean;
  progress: number;
  stageMessage: string;
  isCompleted: boolean;
  targetFps: 60 | 90 | 120 | 'source';
  targetResolution: string;
  selectedVariant: PatchVariant;
  metadata: VideoMetadata | null;
  outputBlob: Blob | null;
  onStartProcessing: () => void;
  onDownload: () => void;
  onOpenCompare: () => void;
}

export const RenderConsole: React.FC<RenderConsoleProps> = ({
  hasVideo,
  isProcessing,
  progress,
  stageMessage,
  isCompleted,
  targetFps,
  targetResolution,
  selectedVariant,
  metadata,
  outputBlob,
  onStartProcessing,
  onDownload,
  onOpenCompare
}) => {
  return (
    <div className="backdrop-blur-2xl bg-white/[0.03] border border-cyan-500/20 rounded-3xl p-5 shadow-[0_28px_80px_rgba(0,0,0,0.6)] space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
          <span>Step 3: Generate Optimized Master</span>
        </span>
        <span className="text-[11px] text-cyan-400 font-mono font-bold">100% Client-Side WASM</span>
      </div>

      {/* Active Pipeline Card */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-black border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.08)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>TikTok HD Transcode + Zilem Method Patch</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-mono font-bold border border-cyan-400/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              Lanczos 1080p + 5×5 Unsharp Detail + 64-bit Infinite Duration Spoof (512M Hours)
            </p>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-black/60 rounded-xl border border-cyan-500/15 text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <span>Target Profile:</span>
          <strong className="text-cyan-300 font-mono font-bold">
            {targetResolution} @ {targetFps !== 'source' ? `${targetFps} FPS` : 'Source FPS'}
          </strong>
        </div>
        <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wide">
          {selectedVariant}
        </div>
      </div>

      {/* Progress Bar (Visible when processing or completed) */}
      {(isProcessing || isCompleted) && (
        <div className="space-y-2 pt-2 border-t border-white/[0.08]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-medium flex items-center gap-2">
              {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
              {isCompleted && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              {stageMessage || (isCompleted ? 'Ready for TikTok! Quality preserved.' : 'Processing...')}
            </span>
            <span className="font-mono font-extrabold text-cyan-400">{progress}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-[#fff] transition-all duration-200 shadow-[0_0_12px_#00f0ff]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Action Buttons */}
      <div className="pt-2">
        {!isCompleted ? (
          <button
            onClick={onStartProcessing}
            disabled={!hasVideo || isProcessing}
            className={`w-full min-h-[62px] rounded-2xl font-black text-sm tracking-wider uppercase flex items-center justify-between px-6 transition-all duration-300 relative overflow-hidden ${
              hasVideo && !isProcessing
                ? 'bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 text-black shadow-[0_16px_38px_rgba(0,0,0,0.5),0_0_32px_rgba(0,240,255,0.3)] hover:brightness-110 hover:-translate-y-0.5 cursor-pointer'
                : 'bg-zinc-900 text-zinc-500 border border-white/[0.05] cursor-not-allowed'
            }`}
          >
            <span className="flex items-center gap-2.5">
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>OPTIMIZING VIDEO FOR TIKTOK...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-black" />
                  <span>PATCH & OPTIMIZE FOR TIKTOK</span>
                </>
              )}
            </span>
            <span className="text-xs font-mono font-black opacity-85">
              HD MASTER
            </span>
          </button>
        ) : (
          <div className="space-y-3">
            {/* Download Button */}
            <button
              onClick={onDownload}
              className="w-full min-h-[62px] rounded-2xl font-black text-sm tracking-wider uppercase flex items-center justify-between px-6 bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 text-black shadow-[0_16px_38px_rgba(0,0,0,0.5),0_0_35px_rgba(0,240,255,0.4)] hover:brightness-110 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Download className="w-5 h-5 text-black" />
                <span>DOWNLOAD PATCHED VIDEO (.MP4)</span>
              </span>
              <span className="text-xs font-mono font-black opacity-90">
                {outputBlob ? formatBytes(outputBlob.size) : 'READY'}
              </span>
            </button>

            {/* Compare and Restart Options */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={onOpenCompare}
                className="py-3 px-4 rounded-xl text-xs font-bold text-white bg-white/[0.06] hover:bg-white/[0.1] border border-cyan-400/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>Compare Before / After</span>
              </button>

              <button
                onClick={onStartProcessing}
                className="py-3 px-4 rounded-xl text-xs font-bold text-zinc-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Re-patch Preset</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-[10px] text-zinc-500">
        100% private. Processed locally in your browser. Video files never touch external servers.
      </p>
    </div>
  );
};
