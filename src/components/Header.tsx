import React from 'react';
import { Sparkles, ShieldCheck, Zap, HelpCircle, BookOpen, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onOpenHowItWorks: () => void;
  onOpenTips: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHowItWorks, onOpenTips }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#030712]/80 border-b border-cyan-500/10">
      <div className="max-w-[1540px] mx-auto px-6 h-18 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/40 shadow-[0_0_24px_rgba(0,240,255,0.25)]">
            <span className="text-cyan-400 font-black text-xl tracking-tighter">CB</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">CompressBase</span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-400/30">
                PRO 2.0
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium">TikTok Video Quality Patcher & FPS Booster</p>
          </div>
        </div>

        {/* Center Features */}
        <div className="hidden lg:flex items-center gap-6 text-xs text-zinc-300 font-medium">
          <div className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-default">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>100% Client-Side Private</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-default">
            <Zap className="w-4 h-4 text-blue-400" />
            <span>FastStart MOOV Restructuring</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1080p 60 & 90 FPS Active</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* How It Works Button (Requested by User) */}
          <button
            onClick={onOpenHowItWorks}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 rounded-xl transition-all shadow-[0_0_14px_rgba(0,240,255,0.15)] cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>How It Works</span>
          </button>

          {/* TikTok HD Upload Guide */}
          <button
            onClick={onOpenTips}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] rounded-xl transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span>HD Upload Guide</span>
          </button>
          
          {/* Direct TikTok Studio link */}
          <a
            href="https://www.tiktok.com/upload"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.35)] hover:brightness-110 transition-all cursor-pointer"
          >
            <span>TikTok Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};
