import React from 'react';
import { PatchVariant } from '../utils/mp4Patcher';
import { Layers, Shield, Laptop, Smartphone, Activity, Sparkles } from 'lucide-react';

export interface MethodVariantInfo {
  id: PatchVariant;
  index: string;
  name: string;
  badge?: string;
  tag: string;
  description: string;
  features: string[];
  recommended: string;
  icon: React.ReactNode;
}

export const METHOD_VARIANTS: MethodVariantInfo[] = [
  {
    id: 'variant-1',
    index: '01',
    name: 'Variant 1: Not Aggressive (FastStart Master)',
    badge: 'DEFAULT',
    tag: 'STANDARD OPTIMIZER',
    description: 'Clean fast-start container rewrite. Relocates moov atom before mdat, updates chunk offsets, and injects TikTok-standard ISO brands.',
    features: ['FastStart 0-Buffer Streaming', 'ISO/MP42 Standard Brands', 'Lossless Byte Alignment'],
    recommended: 'General high quality uploads, daily TikTok posting',
    icon: <Shield className="w-4 h-4 text-[#f6c945]" />
  },
  {
    id: 'variant-2',
    index: '02',
    name: 'Variant 2: PC / TikTok Studio Bypass',
    badge: 'BEST FOR PC',
    tag: 'STUDIO WEB METHOD',
    description: 'Specially engineered for posting via tiktok.com/upload on desktop. Injects custom track headers and prevents server-side downsampling.',
    features: ['Desktop Web Studio Optimizations', 'Strict CFR Sample Timing', 'Zero Bitrate Throttling'],
    recommended: 'Posting from Chrome/Firefox via TikTok Studio Web',
    icon: <Laptop className="w-4 h-4 text-[#f6c945]" />
  },
  {
    id: 'variant-3',
    index: '03',
    name: 'Variant 3: iOS / Apple Camera Bypass',
    tag: 'MOBILE SPOOFING',
    description: 'Injects Apple QuickTime container tags (qt brand, CAEP markers). Tells TikTok this video is native iPhone camera footage, receiving priority transcoding.',
    features: ['Apple QuickTime Atom Flags', 'iOS Native Camera Mimicry', 'Avoids Mobile Downscale Matrix'],
    recommended: 'Posting from iPhone or iPad TikTok mobile app',
    icon: <Smartphone className="w-4 h-4 text-[#f6c945]" />
  },
  {
    id: 'variant-4',
    index: '04',
    name: 'Variant 4: 60 & 90 FPS Ghost Timescale',
    badge: '60/90 FPS SPECIAL',
    tag: 'MOTION SMOOTHING',
    description: 'Timescale multiplier & sample delta normalization. Prevents TikTok ingestion servers from dropping frames in 60fps, 90fps, and 120fps edits.',
    features: ['60fps / 90fps Timescale Injection', 'Time-to-Sample (stts) Delta Patch', 'Fluid Velocity Motion'],
    recommended: 'After Effects edits, anime amvs, gaming clips, 60fps/90fps',
    icon: <Activity className="w-4 h-4 text-[#f6c945]" />
  },
  {
    id: 'variant-5',
    index: '05',
    name: 'Variant 5: Ultra-Fidelity Direct Stream',
    tag: 'LOSSLESS MASTER',
    description: 'Lossless container rebuild with SPS/PPS parameter set normalization. Maximizes container integrity for maximum clarity and punchy contrast.',
    features: ['Normalized Parameter Sets', 'Clean Sample Table Re-index', 'Color Space BT.709 Tagging'],
    recommended: 'Master color-graded renders, 4K downscales, pro reels',
    icon: <Sparkles className="w-4 h-4 text-[#f6c945]" />
  }
];

interface VariantCardProps {
  selectedVariant: PatchVariant;
  onSelectVariant: (variant: PatchVariant) => void;
}

export const VariantList: React.FC<VariantCardProps> = ({
  selectedVariant,
  onSelectVariant
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#f6c945]" />
          <h4 className="text-sm font-bold text-white tracking-tight uppercase">
            TikTok Patch Method Variants
          </h4>
        </div>
        <span className="text-[11px] text-zinc-400">CompressBase Engine Profiles</span>
      </div>

      <div className="space-y-2.5">
        {METHOD_VARIANTS.map((v) => {
          const isSelected = selectedVariant === v.id;
          return (
            <div
              key={v.id}
              onClick={() => onSelectVariant(v.id)}
              className={`relative cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                isSelected
                  ? 'bg-[#f6c945]/[0.08] border-[#f6c945]/90 shadow-[0_0_30px_rgba(246,201,69,0.12),inset_3px_0_0_#f6c945]'
                  : 'bg-white/[0.03] border-white/[0.08] hover:border-[#f6c945]/40 hover:bg-white/[0.05]'
              }`}
            >
              {/* Index Number */}
              <div className="flex flex-col items-center shrink-0 pt-0.5">
                <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-[#f6c945]' : 'text-zinc-500'}`}>
                  {v.index}
                </span>
                <div className="mt-2 p-1.5 rounded-lg bg-black/40 border border-white/[0.06]">
                  {v.icon}
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[9px] font-bold tracking-wider uppercase text-zinc-400">
                    {v.tag}
                  </span>
                  {v.badge && (
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-gradient-to-r from-[#fff1a6] to-[#f6c945] text-black">
                      {v.badge}
                    </span>
                  )}
                </div>

                <strong className="text-sm font-bold text-white block tracking-tight">
                  {v.name}
                </strong>

                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                  {v.description}
                </p>

                {/* Features Pills */}
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  {v.features.map((feat, i) => (
                    <span key={i} className="text-[10px] text-zinc-300 bg-black/30 border border-white/[0.06] px-2 py-0.5 rounded">
                      <span className="text-[#f6c945] mr-1 font-bold">+</span>
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Radio Indicator */}
              <div className="shrink-0 pt-1">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  isSelected ? 'border-[#f6c945]' : 'border-zinc-600'
                }`}>
                  <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                    isSelected ? 'bg-[#f6c945] shadow-[0_0_10px_#f6c945]' : 'bg-transparent'
                  }`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
