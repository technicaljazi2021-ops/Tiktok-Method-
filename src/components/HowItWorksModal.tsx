import React from 'react';
import { X, Upload, Sliders, Zap, Download, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#090d16] border border-cyan-500/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">
                How CompressBase TikTok Patcher Works
              </h3>
              <p className="text-xs text-zinc-400">
                Complete 4-step workflow to get crystal clear 1080p 60/90 FPS on TikTok
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Steps Grid */}
        <div className="py-6 space-y-4">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/15 flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 font-black text-sm flex items-center justify-center shrink-0">
              1
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white mb-1">
                Drop Your Source Video
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Drop your edit, montage, or gaming recording (MP4, MOV, or MKV). The inspector immediately checks whether your container is <strong className="text-white">Fast-Start</strong> (moov at offset 0) or if it has trailing metadata that forces TikTok to buffer and re-encode.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/15 flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 font-black text-sm flex items-center justify-center shrink-0">
              2
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white mb-1">
                Choose Target Quality: 60 FPS or 90 FPS
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Select between <strong className="text-cyan-300">1080p @ 60 FPS Master</strong> (recommended for high-motion gaming and edits) or <strong className="text-cyan-300">1080p @ 90 FPS Ultra</strong> (liquid-smooth playback on 90Hz/120Hz phone screens).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/15 flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 font-black text-sm flex items-center justify-center shrink-0">
              3
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white mb-1">
                Choose Engine: Instant Patch vs Full Transcode
              </h4>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                  <strong className="text-cyan-300 font-bold block mb-1">⚡ Instant Patch (0.1s Lossless)</strong>
                  <span className="text-zinc-400">Moves moov before mdat, updates chunk offsets, and injects TikTok brands. 100% lossless, 0s wait.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06]">
                  <strong className="text-blue-400 font-bold block mb-1">⚙️ Full Transcode (WASM)</strong>
                  <span className="text-zinc-400">Lanczos scales to 1080x1920 (9:16) with strict Constant Frame Rate (CFR) and H.264 High Profile.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/15 flex items-start gap-4">
            <div className="w-8 h-8 rounded-xl bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 font-black text-sm flex items-center justify-center shrink-0">
              4
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white mb-1">
                Export & Post via TikTok Studio Web
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Download your patched video. For maximum quality, upload using <a href="https://www.tiktok.com/upload" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-semibold">tiktok.com/upload</a> on your PC or Mac. Desktop upload ingests directly without applying mobile app aggressive compression.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <a
            href="https://www.tiktok.com/upload"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold hover:underline"
          >
            <span>Go to TikTok Studio Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-cyan-300 to-blue-500 rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            Understood, Start Patching!
          </button>
        </div>
      </div>
    </div>
  );
};
