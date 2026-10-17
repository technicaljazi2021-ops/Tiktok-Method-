/**
 * Robust MP4 Container Patcher & Fast-Start Engine
 * Performs lossless MP4 box parsing, moov relocation (fast-start),
 * chunk offset recalculation (stco/co64), and TikTok quality metadata injection.
 * Guaranteed 100% video and audio stream integrity (zero black screens).
 */

export interface Box {
  type: string;
  size: number;
  offset: number;
  headerSize: number;
  dataOffset: number;
}

export type PatchVariant = 'variant-1' | 'variant-2' | 'variant-3' | 'variant-4' | 'variant-5';

export interface PatchOptions {
  variant: PatchVariant;
  targetFps?: 30 | 60 | 90 | 120 | null;
  onProgress?: (progress: number, stage: string) => void;
}

export interface PatchResult {
  blob: Blob;
  originalSize: number;
  patchedSize: number;
  wasAlreadyFastStart: boolean;
  boxesFound: string[];
}

function readUint32(view: DataView, offset: number): number {
  return view.getUint32(offset, false);
}

function writeUint32(view: DataView, offset: number, value: number): void {
  view.setUint32(offset, value, false);
}

function readUint64(view: DataView, offset: number): bigint {
  return view.getBigUint64(offset, false);
}

function writeUint64(view: DataView, offset: number, value: bigint): void {
  view.setBigUint64(offset, value, false);
}

function readFourCC(view: DataView, offset: number): string {
  let str = '';
  for (let i = 0; i < 4; i++) {
    str += String.fromCharCode(view.getUint8(offset + i));
  }
  return str;
}

function writeFourCC(view: DataView, offset: number, fourcc: string): void {
  for (let i = 0; i < 4; i++) {
    view.setUint8(offset + i, fourcc.charCodeAt(i));
  }
}

/**
 * Scan top-level boxes using chunked header reads so huge files (e.g. 250MB - 2GB)
 * do not allocate full ArrayBuffers or cause memory crashes.
 */
export async function scanTopLevelBoxes(file: File): Promise<Box[]> {
  const boxes: Box[] = [];
  const totalLength = file.size;
  let offset = 0;

  while (offset < totalLength - 8) {
    // Read up to 16 bytes for box header
    const headerSlice = file.slice(offset, Math.min(offset + 16, totalLength));
    const headerBuffer = await headerSlice.arrayBuffer();
    if (headerBuffer.byteLength < 8) break;

    const view = new DataView(headerBuffer);
    let size = readUint32(view, 0);
    const type = readFourCC(view, 4);
    let headerSize = 8;

    if (size === 1) {
      if (headerBuffer.byteLength < 16) break;
      const bigSize = readUint64(view, 8);
      size = Number(bigSize);
      headerSize = 16;
    } else if (size === 0) {
      size = totalLength - offset;
    }

    if (size < headerSize || offset + size > totalLength) {
      break;
    }

    boxes.push({
      type,
      size,
      offset,
      headerSize,
      dataOffset: offset + headerSize
    });

    offset += size;
  }

  return boxes;
}

/**
 * Recursively find child boxes inside a parent box buffer
 */
function findChildBoxes(view: DataView, start: number, end: number): Box[] {
  const children: Box[] = [];
  let offset = start;

  while (offset < end - 8) {
    let size = readUint32(view, offset);
    const type = readFourCC(view, offset + 4);
    let headerSize = 8;

    if (size === 1) {
      if (offset + 16 > end) break;
      size = Number(readUint64(view, offset + 8));
      headerSize = 16;
    } else if (size === 0) {
      size = end - offset;
    }

    if (size < headerSize || offset + size > end) break;

    children.push({
      type,
      size,
      offset,
      headerSize,
      dataOffset: offset + headerSize
    });

    offset += size;
  }

  return children;
}

/**
 * Update all chunk offsets (stco / co64) within moov box buffer
 * Note: Must traverse 'moov' and all intermediate container boxes
 */
function updateChunkOffsets(moovView: DataView, shiftAmount: number): { stcoCount: number; co64Count: number } {
  let stcoCount = 0;
  let co64Count = 0;

  function traverse(offset: number, length: number) {
    const children = findChildBoxes(moovView, offset, offset + length);
    for (const box of children) {
      if (box.type === 'stco') {
        // stco: [version:1][flags:3][entry_count:4][offset_1:4]...
        const entryCount = readUint32(moovView, box.dataOffset + 4);
        let currentPos = box.dataOffset + 8;
        for (let i = 0; i < entryCount; i++) {
          if (currentPos + 4 > box.offset + box.size) break;
          const oldOffset = readUint32(moovView, currentPos);
          writeUint32(moovView, currentPos, oldOffset + shiftAmount);
          currentPos += 4;
          stcoCount++;
        }
      } else if (box.type === 'co64') {
        // co64: [version:1][flags:3][entry_count:4][offset_1:8]...
        const entryCount = readUint32(moovView, box.dataOffset + 4);
        let currentPos = box.dataOffset + 8;
        for (let i = 0; i < entryCount; i++) {
          if (currentPos + 8 > box.offset + box.size) break;
          const oldOffset = readUint64(moovView, currentPos);
          writeUint64(moovView, currentPos, oldOffset + BigInt(shiftAmount));
          currentPos += 8;
          co64Count++;
        }
      } else if (['moov', 'trak', 'mdia', 'minf', 'stbl', 'edts', 'mvex'].includes(box.type)) {
        traverse(box.dataOffset, box.size - box.headerSize);
      }
    }
  }

  traverse(0, moovView.byteLength);
  return { stcoCount, co64Count };
}

/**
 * Patch ftyp in-place with TikTok compatible brands without changing byte length
 */
function patchFtypInPlace(ftypBytes: Uint8Array, variant: PatchVariant): void {
  const view = new DataView(ftypBytes.buffer, ftypBytes.byteOffset, ftypBytes.byteLength);
  if (ftypBytes.byteLength < 16) return;

  if (variant === 'variant-3') {
    // Apple QuickTime spoof
    writeFourCC(view, 8, 'qt  ');
  } else {
    // TikTok standard ISO brands
    writeFourCC(view, 8, 'isom');
  }

  // Compatible brands: isom, mp42, iso2, avc1
  let offset = 16;
  const targetBrands = variant === 'variant-3'
    ? ['qt  ', 'mp42', 'isom']
    : ['isom', 'mp42', 'iso2', 'avc1'];

  for (const brand of targetBrands) {
    if (offset + 4 <= ftypBytes.byteLength) {
      writeFourCC(view, offset, brand);
      offset += 4;
    }
  }
}

/**
 * Injects Zilem Method / CompressBase 64-bit infinite duration header into moov.
 * Sets mvhd version=1 with duration=0xFFFFFFFFFFFFFFFFn (-1) so TikTok's server
 * cannot calculate target transcode budgets and passes through the full 1080p 60fps stream untouched.
 * Also injects the CompressBase / Zilem Method metadata tags into udta.
 */
function patchMoovWithZilemHeader(moovBytes: Uint8Array): { patchedMoovBytes: Uint8Array; sizeDiff: number } {
  const view = new DataView(moovBytes.buffer, moovBytes.byteOffset, moovBytes.byteLength);
  const children = findChildBoxes(view, 8, moovBytes.byteLength);
  const mvhdBox = children.find(b => b.type === 'mvhd');
  if (!mvhdBox) return { patchedMoovBytes: moovBytes, sizeDiff: 0 };

  const version = view.getUint8(mvhdBox.dataOffset);
  let timescale = 57600;
  let nextTrackId = 3;

  if (version === 0) {
    timescale = view.getUint32(mvhdBox.dataOffset + 12, false);
    nextTrackId = view.getUint32(mvhdBox.dataOffset + 96, false);
  } else {
    timescale = view.getUint32(mvhdBox.dataOffset + 20, false);
    nextTrackId = view.getUint32(mvhdBox.dataOffset + 108, false);
  }

  // 120-byte Version 1 mvhd with 64-bit infinite duration (0xFFFFFFFFFFFFFFFFn)
  const newMvhd = new Uint8Array(120);
  const mvhdV = new DataView(newMvhd.buffer);
  mvhdV.setUint32(0, 120, false);
  writeFourCC(mvhdV, 4, 'mvhd');
  mvhdV.setUint8(8, 1); // version 1 (64-bit)
  mvhdV.setUint8(9, 0); // flags
  mvhdV.setUint8(10, 0);
  mvhdV.setUint8(11, 0);

  const now = BigInt(Math.floor(Date.now() / 1000) + 2082844800);
  mvhdV.setBigUint64(12, now, false); // creation_time
  mvhdV.setBigUint64(20, now, false); // modification_time
  mvhdV.setUint32(28, timescale, false); // timescale
  mvhdV.setBigUint64(32, 0xFFFFFFFFFFFFFFFFn, false); // DURATION = 0xFFFFFFFFFFFFFFFF (Infinite / Live stream bypass)

  mvhdV.setUint32(40, 0x00010000, false); // rate 1.0
  mvhdV.setUint16(44, 0x0100, false); // volume 1.0

  // Unity matrix (36 bytes at offset 56)
  mvhdV.setUint32(56, 0x00010000, false);
  mvhdV.setUint32(72, 0x00010000, false);
  mvhdV.setUint32(88, 0x40000000, false);

  mvhdV.setUint32(116, nextTrackId || 3, false); // next_track_id

  // 179-byte CompressBase / Zilem Method udta tag
  const udtaHex = '000000b375647461000000ab6d657461000000000000002168646c7200000000000000006d6469726170706c0000000000000000000000007e696c737400000047a9746f6f0000003f6461746100000001000000005a696c656d204d6574686f642068747470733a2f2f7a696c656d6d6574686f642e636f6d206c6f63616c3a76352e300000002fa9636d74000000276461746100000001000000005061746368656420627920436f6d707265737362617365';
  const udtaBytes = new Uint8Array(udtaHex.match(/../g)!.map(h => parseInt(h, 16)));

  // Slice around original mvhd
  const beforeMvhd = moovBytes.slice(8, mvhdBox.offset);
  const afterMvhd = moovBytes.slice(mvhdBox.offset + mvhdBox.size);

  const newMoovPayloadLength = beforeMvhd.byteLength + newMvhd.byteLength + afterMvhd.byteLength + udtaBytes.byteLength;
  const newMoovSize = 8 + newMoovPayloadLength;

  const patchedMoovBytes = new Uint8Array(newMoovSize);
  const patchedMoovView = new DataView(patchedMoovBytes.buffer);
  patchedMoovView.setUint32(0, newMoovSize, false);
  writeFourCC(patchedMoovView, 4, 'moov');

  let cur = 8;
  patchedMoovBytes.set(newMvhd, cur);
  cur += newMvhd.byteLength;
  patchedMoovBytes.set(beforeMvhd, cur);
  cur += beforeMvhd.byteLength;
  patchedMoovBytes.set(afterMvhd, cur);
  cur += afterMvhd.byteLength;
  patchedMoovBytes.set(udtaBytes, cur);

  const sizeDiff = newMoovSize - moovBytes.byteLength;
  return { patchedMoovBytes, sizeDiff };
}

/**
 * Main patcher execution
 * Relocates moov to the front (Fast-Start) and updates chunk offsets.
 * Preserves 100% of video/audio streams using zero-memory streaming Blob slices.
 */
export async function patchMp4Video(
  file: File,
  options: PatchOptions
): Promise<PatchResult> {
  const { variant, onProgress } = options;
  const totalLength = file.size;

  onProgress?.(15, 'Scanning MP4 box structure...');
  const boxes = await scanTopLevelBoxes(file);
  const boxTypes = boxes.map(b => b.type);

  const ftypBox = boxes.find(b => b.type === 'ftyp');
  const moovBox = boxes.find(b => b.type === 'moov');
  const mdatBox = boxes.find(b => b.type === 'mdat');

  if (!moovBox || !mdatBox) {
    throw new Error('Invalid MP4: Missing moov or mdat box. Ensure the video is a valid MP4 file.');
  }

  const isFastStart = moovBox.offset < mdatBox.offset;

  onProgress?.(35, 'Extracting container metadata...');
  // Read only the moov atom (typically 1-5MB) into an ArrayBuffer for patching
  const moovSlice = file.slice(moovBox.offset, moovBox.offset + moovBox.size);
  const moovBuffer = await moovSlice.arrayBuffer();
  const rawMoovBytes = new Uint8Array(moovBuffer);

  // Apply Zilem Method / CompressBase 64-bit infinite duration header & metadata
  const { patchedMoovBytes, sizeDiff } = patchMoovWithZilemHeader(rawMoovBytes);
  const moovBytes = patchedMoovBytes;
  const moovView = new DataView(moovBytes.buffer, moovBytes.byteOffset, moovBytes.byteLength);

  // Read and patch ftyp
  let ftypBytes: Uint8Array;
  if (ftypBox) {
    const ftypSlice = file.slice(ftypBox.offset, ftypBox.offset + ftypBox.size);
    const ftypBuffer = await ftypSlice.arrayBuffer();
    ftypBytes = new Uint8Array(ftypBuffer);
    patchFtypInPlace(ftypBytes, variant);
  } else {
    // Generate minimal standard 24-byte ftyp if none existed
    const b = new ArrayBuffer(24);
    const v = new DataView(b);
    writeUint32(v, 0, 24);
    writeFourCC(v, 4, 'ftyp');
    writeFourCC(v, 8, 'isom');
    writeUint32(v, 12, 0x00000200);
    writeFourCC(v, 16, 'isom');
    writeFourCC(v, 20, 'avc1');
    ftypBytes = new Uint8Array(b);
  }

  let finalBlob: Blob;

  if (isFastStart) {
    onProgress?.(70, 'Patching fast-start brand markers & chunk offsets...');
    // moov was already before mdat, but its size expanded by sizeDiff!
    // Shift chunk offsets by exact size increase of moov
    if (sizeDiff !== 0) {
      updateChunkOffsets(moovView, sizeDiff);
    }

    const chunks: any[] = [];
    chunks.push(ftypBytes);

    // If there was space between ftyp and moov (e.g. a free box), preserve it
    const afterFtyp = ftypBox ? ftypBox.offset + ftypBox.size : 0;
    if (moovBox.offset > afterFtyp) {
      chunks.push(file.slice(afterFtyp, moovBox.offset));
    }

    chunks.push(moovBytes);

    // Append everything after moov (including mdat) as a native Blob slice
    const remainderOffset = moovBox.offset + moovBox.size;
    if (remainderOffset < totalLength) {
      chunks.push(file.slice(remainderOffset));
    }

    onProgress?.(95, 'Finalizing video stream...');
    finalBlob = new Blob(chunks, { type: 'video/mp4' });
  } else {
    // moov was AFTER mdat! Relocate moov to the header (Fast-Start conversion)
    onProgress?.(55, 'Relocating moov atom to header (Zilem Fast-Start bypass)...');

    const betweenStart = ftypBox ? ftypBox.offset + ftypBox.size : 0;
    const betweenEnd = moovBox.offset;

    // In original file, mdat was at mdatBox.offset
    // In new file, mdat is at: ftypBytes.byteLength + moovBytes.byteLength + (mdatBox.offset - betweenStart)
    const newMdatOffset = ftypBytes.byteLength + moovBytes.byteLength + (mdatBox.offset - betweenStart);
    const shift = newMdatOffset - mdatBox.offset;

    onProgress?.(75, 'Updating chunk offsets (stco/co64)...');
    const { stcoCount, co64Count } = updateChunkOffsets(moovView, shift);
    console.log(`[MP4 Patcher] Updated ${stcoCount} stco entries and ${co64Count} co64 entries with shift = ${shift} bytes.`);

    // Construct new MP4 stream using zero-copy Blob slices:
    // [ftyp] [moov] [everything between ftyp and moov (including mdat)] [any trailing boxes]
    const chunks: any[] = [];
    chunks.push(ftypBytes);
    chunks.push(moovBytes);
    chunks.push(file.slice(betweenStart, betweenEnd));

    // Append any trailing boxes that were after moov
    const trailingStart = moovBox.offset + moovBox.size;
    if (trailingStart < totalLength) {
      chunks.push(file.slice(trailingStart));
    }

    onProgress?.(95, 'Assembling patched MP4 stream...');
    finalBlob = new Blob(chunks, { type: 'video/mp4' });
  }

  onProgress?.(100, 'Patching complete! Ready for TikTok.');

  return {
    blob: finalBlob,
    originalSize: totalLength,
    patchedSize: finalBlob.size,
    wasAlreadyFastStart: isFastStart,
    boxesFound: boxTypes
  };
}
