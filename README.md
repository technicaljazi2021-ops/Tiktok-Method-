# CompressBase Pro 2.0 — TikTok Video Quality Patcher & FPS Booster

A reverse-engineered, enhanced, clean client-side web application inspired by **CompressBase (Upload Method)**. Built specifically for video editors, montage creators, and content producers to bypass aggressive TikTok video compression and deliver maximum visual fidelity.

---

## ⚡ What Makes This Better Than The Original

| Feature | Original CompressBase | This Enhanced Version |
| :--- | :--- | :--- |
| **Frame Rates** | Basic presets | **1080p @ 60 FPS**, **1080p @ 90 FPS**, **1080p @ 120 FPS**, **30 FPS** |
| **Patch Engine** | Container patching only | **Dual Engine**: Instant Lossless Patcher (0.1s) + Full WASM FFmpeg Transcoder |
| **Video Inspector** | Basic details | **Real-time container analysis**, FastStart detection, resolution & aspect ratio |
| **Comparison View** | None / external | **Interactive Synchronized Side-by-Side Comparison Inspector** |
| **Hosting & Privacy** | Cloud / Ad-supported | **100% Client-Side** • Deployable to **Vercel** with 0 server costs |
| **Upload Guide** | Fragmented | Built-in step-by-step **TikTok Ingestion Bypass Guide** |

---

## 🚀 Key Features

1. **Instant Lossless Container Patcher (0.1s)**:
   - Pure client-side binary MP4 box parsing (`ftyp`, `moov`, `mdat`).
   - Automatically relocates `moov` to byte offset 0 (Fast-Start), allowing immediate TikTok server ingestion without buffering delays.
   - Recalculates 32-bit (`stco`) and 64-bit (`co64`) sample chunk offsets.
   - Injects TikTok-standard compatible brands (`isom`, `mp42`, `iso2`, `avc1`).

2. **1080p 60 FPS & 90 FPS Timescale Alignment**:
   - Injects precise timescale multipliers into `mdhd` and `stts` sample deltas.
   - Prevents TikTok ingestion algorithms from dropping frames or down-clocking high refresh rate videos to 30 FPS.

3. **All 5 CompressBase Method Variants**:
   - **Variant 1 (Not Aggressive)**: Fast-Start container rewrite with standard ISO/MP42 brands.
   - **Variant 2 (PC / Studio Bypass)**: Tailored for desktop web upload (`tiktok.com/upload`) to avoid mobile app re-compression.
   - **Variant 3 (iOS / Apple Camera Bypass)**: Injects Apple QuickTime tags (`qt  `) so TikTok treats footage as native iPhone camera video.
   - **Variant 4 (60 / 90 FPS Ghost Timescale)**: Timescale multiplier & sample delta normalization for ultra-fluid motion.
   - **Variant 5 (Ultra-Fidelity Direct Stream)**: Normalized parameter sets and clean sample indexing.

4. **Deep WebAssembly Transcoder & Downscaler**:
   - Resamples any video (MKV, MOV, WebM, 4K, 1440p) to clean vertical `1080x1920` (9:16) with Lanczos filtering.
   - Strict Constant Frame Rate (CFR) normalization.
   - H.264 High Profile @ Level 4.2 with CRF 18-19 and AAC 192k audio.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🌐 Deploying to Vercel

This project is 100% client-side and requires zero server infrastructure. It includes `vercel.json` with the required `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` headers.

### Option 1: Using the Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: Using GitHub + Vercel Dashboard
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of CompressBase TikTok Quality Patcher"
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and select your repository.
3. Vercel will automatically detect **Vite**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Your site will be live on your `.vercel.app` domain!

---

## 📱 Pro Tips for TikTok Video Quality

1. **Upload via TikTok Studio Web on Desktop** ([tiktok.com/upload](https://www.tiktok.com/upload)): The web uploader does not enforce the aggressive mobile re-compression profile.
2. **Never post raw 4K**: TikTok only displays up to 1080p. Direct 4K uploads trigger low-quality server bilinear downscaling. Downscale to 1080x1920 first.
3. **If posting from mobile**: In the TikTok app, tap **More Options** on the post screen and toggle **"Allow high-quality uploads"** to ON. Also turn off **Data Saver** in profile settings.
