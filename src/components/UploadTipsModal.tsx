import React from 'react';
import { X, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface UploadTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadTipsModal: React.FC<UploadTipsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090d16] border border-cyan-500/25 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                TikTok 1080p 60/90 FPS HD Upload Secrets
              </h3>
              <p className="text-xs text-zinc-400">
                How to ensure TikTok displays your video in razor sharp HD
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs leading-relaxed text-zinc-300">
          {/* Secret 1 */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/15 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-black text-[11px] font-black flex items-center justify-center">
                1
              </span>
              <span>Upload via Desktop TikTok Studio Web (tiktok.com/upload)</span>
            </div>
            <p className="text-zinc-400">
              When uploading through the TikTok mobile phone app, TikTok aggressively applies mobile compression algorithms and forces videos into 720p 30fps.
              Uploading via desktop web (<a href="https://www.tiktok.com/upload" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-semibold">tiktok.com/upload</a>) retains full 1080p and higher bitrate with direct server ingest.
            </p>
          </div>

          {/* Secret 2 */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/15 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-black text-[11px] font-black flex items-center justify-center">
                2
              </span>
              <span>Why Fast-Start (moov atom) Matters</span>
            </div>
            <p className="text-zinc-400">
              Standard video exports place the <code className="text-cyan-400 font-mono">moov</code> atom (index metadata) at the end of the file. TikTok's web servers require the video to start playing immediately. When <code className="text-cyan-400 font-mono">moov</code> is at the back, TikTok's CDN must buffer and re-encode the whole video. Our patch moves <code className="text-cyan-400 font-mono">moov</code> to byte offset 0.
            </p>
          </div>

          {/* Secret 3 */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/15 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-black text-[11px] font-black flex items-center justify-center">
                3
              </span>
              <span>Never Upload 4K Directly — Master at 1080x1920</span>
            </div>
            <p className="text-zinc-400">
              TikTok does NOT display 4K. Direct 4K uploads trigger low-quality server bilinear downscaling that blurs details.
              Downscaling your 4K or 1440p project to 1080x1920 with high-quality Lanczos resampling beforehand preserves razor-sharp edges.
            </p>
          </div>

          {/* Secret 4 */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/15 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-black text-[11px] font-black flex items-center justify-center">
                4
              </span>
              <span>If Uploading via Mobile App: Turn ON "Allow High-Quality Uploads"</span>
            </div>
            <p className="text-zinc-400">
              On the final post screen on your phone, tap <strong className="text-white">More Options</strong> and ensure <strong className="text-white">"Allow high-quality uploads"</strong> is enabled. Also check TikTok Profile Settings &gt; Data Saver &gt; Turn OFF.
            </p>
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
            <span>Open TikTok Upload Web</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-cyan-300 to-blue-500 rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
          >
            Got it, Let's Patch!
          </button>
        </div>
      </div>
    </div>
  );
};
