import React, { useState } from 'react';
import { Sliders, Zap, Sparkles, Activity, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';
import { PatchVariant } from '../utils/mp4Patcher';

export interface UnifiedPreset {
  id: string;
  name: string;
  tag: string;
  badge?: string;
  resolution: '1080x1920' | '1080x1350' | '1080x1080' | 'source';
  fps: 60 | 90 | 120 | 'source';
  defaultVariant: PatchVariant;
  defaultEngine: 'patch' | 'transcode';
  description: string;
  recommendedFor: string;
}

export const UNIFIED_PRESETS: UnifiedPreset[] = [
  {
    id: '1080p-60fps',
    name: '1080p @ 60 FPS Master',
    tag: 'ULTRA SMOOTH',
    badge: 'POPULAR',
    resolution: '1080x1920',
    fps: 60,
    defaultVariant: 'variant-2',
    defaultEngine: 'transcode',
    description: 'Crisp 1080x1920 vertical canvas with true 60 FPS constant frame rate, Lanczos scaling, and H.264 High Profile.',
    recommendedFor: 'Gaming clips, velocity edits, dance, anime montages'
  },
  {
    id: '1080p-90fps',
    name: '1080p @ 90 FPS Ultra',
    tag: 'HIGH REFRESH RATE',
    badge: 'NEW',
    resolution: '1080x1920',
    fps: 90,
    defaultVariant: 'variant-4',
    defaultEngine: 'transcode',
    description: 'True 90 FPS constant frame rate resampling. Delivers liquid-smooth playback on 90Hz & 120Hz mobile screens.',
    recommendedFor: 'High refresh rate viewers, AMVs, smooth motion graphics'
  },
  {
    id: '1080p-120fps',
    name: '1080p @ 120 FPS Ghost',
    tag: 'GHOST MULTIPLIER',
    resolution: '1080x1920',
    fps: 120,
    defaultVariant: 'variant-4',
    defaultEngine: 'transcode',
    description: 'Extreme 120 FPS frame rate resampling. Bypasses TikTok frame-rate ingestion downclocking.',
    recommendedFor: 'Twixtor slow-motion, speed ramps, extreme motion clips'
  },
  {
    id: 'ios-bypass',
    name: 'iOS / iPhone Camera Spoof',
    tag: 'MOBILE BYPASS',
    resolution: '1080x1920',
    fps: 60,
    defaultVariant: 'variant-3',
    defaultEngine: 'transcode',
    description: 'Injects Apple QuickTime metadata (qt brand) so TikTok treats footage as native iPhone camera recording.',
    recommendedFor: 'Posting directly from iPhone or iPad TikTok app'
  }
];

interface PresetSelectorProps {
  selectedPresetId: string;
  onSelectPreset: (preset: UnifiedPreset) => void;
  targetFps: 60 | 90 | 120 | 'source';
  onChangeFps: (fps: 60 | 90 | 120 | 'source') => void;
  targetResolution: '1080x1920' | '1080x1350' | '1080x1080' | 'source';
  onChangeResolution: (res: '1080x1920' | '1080x1350' | '1080x1080' | 'source') => void;
  selectedVariant: PatchVariant;
  onChangeVariant: (v: PatchVariant) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  selectedPresetId,
  onSelectPreset,
  targetFps,
  onChangeFps,
  targetResolution,
  onChangeResolution,
  selectedVariant,
  onChangeVariant
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white tracking-tight uppercase">
            Step 2: Choose TikTok Quality Target
          </h4>
        </div>
        <span className="text-[11px] text-cyan-400 font-medium">Select one profile</span>
      </div>

      {/* Unified Preset Cards List */}
      <div className="grid grid-cols-1 gap-2.5">
        {UNIFIED_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`relative text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/[0.08] border-cyan-400 shadow-[0_0_24px_rgba(0,240,255,0.2),inset_3px_0_0_#00f0ff] ring-1 ring-cyan-400/50'
                  : 'bg-white/[0.03] border-white/[0.08] hover:border-cyan-500/40 hover:bg-white/[0.05]'
              }`}
            >
              {/* Badge */}
              {preset.badge && (
                <span className="absolute top-3 right-3 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-gradient-to-r from-cyan-300 to-blue-500 text-black shadow-sm">
                  {preset.badge}
                </span>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                    isSelected ? 'bg-cyan-400 text-black font-extrabold' : 'bg-white/[0.08] text-zinc-300'
                  }`}>
                    {preset.tag}
                  </span>
                </div>
                <strong className="text-sm font-extrabold text-white block tracking-tight">
                  {preset.name}
                </strong>
                <p className="text-[11px] text-zinc-400 leading-snug mt-1">
                  {preset.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
                <span className="truncate pr-2">Best: {preset.recommendedFor}</span>
                <span className={`font-mono font-bold shrink-0 ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`}>
                  {preset.fps !== 'source' ? `${preset.fps} FPS` : 'INSTANT PATCH'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Advanced Customizer Toggle */}
      <div className="pt-1">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-cyan-300 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] rounded-xl transition-all"
        >
          <span>Advanced Tuning (Resolution, Framerate, Method Variant)</span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="mt-2.5 p-4 rounded-xl bg-black/60 border border-cyan-500/20 space-y-3 animate-in fade-in duration-150">
            {/* FPS override (NO 30 FPS!) */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                Target Frame Rate (FPS)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {([60, 90, 120, 'source'] as const).map((fps) => (
                  <button
                    key={String(fps)}
                    onClick={() => onChangeFps(fps)}
                    className={`py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                      targetFps === fps
                        ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                        : 'bg-white/[0.05] text-zinc-400 hover:bg-white/[0.1] border border-white/[0.06]'
                    }`}
                  >
                    {fps === 'source' ? 'Source' : `${fps} FPS`}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution override */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                Target Canvas Resolution
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {([
                  { id: '1080x1920', label: '9:16 (1080p)' },
                  { id: '1080x1350', label: '4:5 Portrait' },
                  { id: '1080x1080', label: '1:1 Square' },
                  { id: 'source', label: 'Source (1080p)' }
                ] as const).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onChangeResolution(r.id)}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-semibold transition-all truncate text-center ${
                      targetResolution === r.id
                        ? 'bg-cyan-400 text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                        : 'bg-white/[0.05] text-zinc-400 hover:bg-white/[0.1] border border-white/[0.06]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Method Variant override */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
                TikTok Patch Method Variant
              </label>
              <div className="grid grid-cols-5 gap-1 text-[10px]">
                {([
                  { id: 'variant-1', name: 'Var 1 (Std)' },
                  { id: 'variant-2', name: 'Var 2 (PC)' },
                  { id: 'variant-3', name: 'Var 3 (iOS)' },
                  { id: 'variant-4', name: 'Var 4 (Ghost)' },
                  { id: 'variant-5', name: 'Var 5 (Stream)' }
                ] as const).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => onChangeVariant(v.id as PatchVariant)}
                    className={`py-1.5 rounded-lg font-bold transition-all text-center ${
                      selectedVariant === v.id
                        ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                        : 'bg-white/[0.05] text-zinc-400 hover:bg-white/[0.1] border border-white/[0.06]'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
