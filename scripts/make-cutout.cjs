const fs = require('fs');
const zlib = require('zlib');

function decodePng(buffer) {
  let pos = 8;
  let width = buffer.readUInt32BE(16);
  let height = buffer.readUInt32BE(20);
  let idatChunks = [];
  
  while (pos < buffer.length) {
    let len = buffer.readUInt32BE(pos);
    let type = buffer.toString('ascii', pos + 4, pos + 8);
    if (type === 'IDAT') {
      idatChunks.push(buffer.slice(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }
  
  let compressed = Buffer.concat(idatChunks);
  let raw = zlib.inflateSync(compressed);
  
  const bytesPerPixel = 4;
  const rowBytes = width * bytesPerPixel;
  const image = Buffer.alloc(width * height * bytesPerPixel);
  
  let rawPos = 0;
  for (let y = 0; y < height; y++) {
    const filterType = raw[rawPos++];
    const rowStart = y * rowBytes;
    
    for (let x = 0; x < width; x++) {
      const pxStart = rowStart + x * bytesPerPixel;
      
      for (let c = 0; c < bytesPerPixel; c++) {
        const rawByte = raw[rawPos + x * bytesPerPixel + c];
        let a = x > 0 ? image[pxStart - bytesPerPixel + c] : 0;
        let b = y > 0 ? image[pxStart - rowBytes + c] : 0;
        let cPrev = (x > 0 && y > 0) ? image[pxStart - rowBytes - bytesPerPixel + c] : 0;
        
        let filteredVal = 0;
        if (filterType === 0) {
          filteredVal = rawByte;
        } else if (filterType === 1) {
          filteredVal = (rawByte + a) & 0xFF;
        } else if (filterType === 2) {
          filteredVal = (rawByte + b) & 0xFF;
        } else if (filterType === 3) {
          filteredVal = (rawByte + Math.floor((a + b) / 2)) & 0xFF;
        } else if (filterType === 4) {
          let p = a + b - cPrev;
          let pa = Math.abs(p - a);
          let pb = Math.abs(p - b);
          let pc = Math.abs(p - cPrev);
          let pr = (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : cPrev);
          filteredVal = (rawByte + pr) & 0xFF;
        }
        image[pxStart + c] = filteredVal;
      }
    }
    rawPos += rowBytes;
  }
  
  return { width, height, image };
}

function encodePng(width, height, rgbaBuffer) {
  const bytesPerPixel = 4;
  const rowBytes = width * bytesPerPixel;
  const filteredRaw = Buffer.alloc(height * (1 + rowBytes));
  
  let rawPos = 0;
  for (let y = 0; y < height; y++) {
    filteredRaw[rawPos++] = 0;
    const rowStart = y * rowBytes;
    for (let i = 0; i < rowBytes; i++) {
      filteredRaw[rawPos++] = rgbaBuffer[rowStart + i];
    }
  }
  
  const compressed = zlib.deflateSync(filteredRaw);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  
  return Buffer.concat([
    signature,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', compressed),
    createChunk('IEND', Buffer.alloc(0))
  ]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.slice(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const { width, height, image } = decodePng(fs.readFileSync('public/assets/image.png'));

// Flood fill starting from all outer border pixels
// Stop when reaching the thick black outline of the mascot
const isBackground = new Uint8Array(width * height);
const queue = [];

for (let x = 0; x < width; x++) {
  queue.push([x, 0]);
  queue.push([x, height - 1]);
}
for (let y = 0; y < height; y++) {
  queue.push([0, y]);
  queue.push([width - 1, y]);
}

while (queue.length > 0) {
  const [x, y] = queue.pop();
  if (x < 0 || x >= width || y < 0 || y >= height) continue;
  const pos = y * width + x;
  if (isBackground[pos]) continue;
  
  const idx = pos * 4;
  const r = image[idx];
  const g = image[idx + 1];
  const b = image[idx + 2];
  
  // Outer boundary barrier:
  // The dark black outline of the mascot (r < 75 && g < 75 && b < 75)
  // Or the orange body if reached
  const isDarkBoundary = (r < 75 && g < 75 && b < 75);
  const isOrange = (r > 200 && g > 110 && g < 200 && b < 90);
  
  // Top right corner cloud artifact check: if x > 300 and y < 80, continue through it as background
  const isTopRightArtifact = (x > 310 && y < 70);
  // Bottom right motion ray artifact check: if x > 310 and y > 240, continue through it as background
  const isBottomRightArtifact = (x > 325 && y > 250);

  if ((isDarkBoundary || isOrange) && !isTopRightArtifact && !isBottomRightArtifact) {
    continue; // Barrier hit
  }
  
  isBackground[pos] = 1;
  queue.push([x + 1, y]);
  queue.push([x - 1, y]);
  queue.push([x, y + 1]);
  queue.push([x, y - 1]);
}

// Flood fill the hole inside the top loop handle
for (let y = 32; y < 58; y++) {
  for (let x = 148; x < 178; x++) {
    const idx = (y * width + x) * 4;
    const r = image[idx];
    const g = image[idx+1];
    const b = image[idx+2];
    if (r > 215 && g > 195 && b > 170 && !isBackground[y * width + x]) {
      const hQueue = [[x, y]];
      while (hQueue.length > 0) {
        const [hx, hy] = hQueue.pop();
        if (hx < 135 || hx > 185 || hy < 20 || hy > 65) continue;
        const hpos = hy * width + hx;
        if (isBackground[hpos]) continue;
        const hidx = hpos * 4;
        const hr = image[hidx];
        const hg = image[hidx+1];
        const hb = image[hidx+2];
        if (hr < 75 && hg < 75 && hb < 75) continue; // Boundary
        isBackground[hpos] = 1;
        hQueue.push([hx + 1, hy]);
        hQueue.push([hx - 1, hy]);
        hQueue.push([hx, hy + 1]);
        hQueue.push([hx, hy - 1]);
      }
    }
  }
}

// Clean up any remaining non-connected background pixels outside the mascot
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const pos = y * width + x;
    const idx = pos * 4;
    
    // If it is background, make it 100% transparent
    if (isBackground[pos]) {
      image[idx + 3] = 0;
    } else {
      // It's the mascot! Ensure alpha is 255
      image[idx + 3] = 255;
    }
  }
}

// Clean up disconnected islands like the stray motion ray or corner cloud
// Flood fill from center of mascot to keep ONLY the mascot connected component
const isMascotConnected = new Uint8Array(width * height);
const mQueue = [[180, 250]];
isMascotConnected[250 * width + 180] = 1;

while (mQueue.length > 0) {
  const [x, y] = mQueue.pop();
  const neighbors = [[x+1, y], [x-1, y], [x, y+1], [x, y-1]];
  for (const [nx, ny] of neighbors) {
    if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
    const npos = ny * width + nx;
    if (isMascotConnected[npos]) continue;
    if (image[npos * 4 + 3] === 0) continue; // Transparent pixel
    
    isMascotConnected[npos] = 1;
    mQueue.push([nx, ny]);
  }
}

// Set anything not connected to mascot body to 0
for (let i = 0; i < width * height; i++) {
  if (!isMascotConnected[i]) {
    image[i * 4 + 3] = 0;
  }
}

const outPng = encodePng(width, height, image);
fs.writeFileSync('public/mascot-cutout.png', outPng);
console.log('Finished! Saved pristine cutout:', outPng.length);
