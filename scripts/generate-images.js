/**
 * 36Route Image Generator - Uses sharp directly
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'assets', 'images');
const C = {
  primary: '#F97316', secondary: '#F59E0B', accent: '#22C55E',
  white: '#FFFFFF', dark: '#18181B', orangeDark: '#EA580C',
};

function svgIconFull(size) {
  const p = (v) => (v / 1024 * size).toFixed(1);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${C.primary}"/>
      <stop offset="100%" stop-color="${C.orangeDark}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${p(220)}" fill="url(#g)"/>
  <g transform="translate(${p(170)},${p(220)})">
    <rect x="${p(40)}" y="${p(20)}" width="${p(680)}" height="${p(380)}" rx="${p(50)}" fill="white" opacity="0.95"/>
    <rect x="${p(560)}" y="${p(60)}" width="${p(100)}" height="${p(220)}" rx="${p(16)}" fill="${C.secondary}" opacity="0.75"/>
    <rect x="${p(90)}" y="${p(70)}" width="${p(90)}" height="${p(120)}" rx="${p(12)}" fill="${C.primary}" opacity="0.5"/>
    <rect x="${p(210)}" y="${p(70)}" width="${p(90)}" height="${p(120)}" rx="${p(12)}" fill="${C.primary}" opacity="0.5"/>
    <rect x="${p(320)}" y="${p(70)}" width="${p(60)}" height="${p(120)}" rx="${p(12)}" fill="${C.primary}" opacity="0.5"/>
    <rect x="${p(40)}" y="${p(280)}" width="${p(680)}" height="${p(40)}" rx="${p(8)}" fill="${C.secondary}" opacity="0.4"/>
    <circle cx="${p(180)}" cy="${p(420)}" r="${p(30)}" fill="white" opacity="0.9"/>
    <circle cx="${p(180)}" cy="${p(420)}" r="${p(15)}" fill="${C.dark}" opacity="0.4"/>
    <circle cx="${p(580)}" cy="${p(420)}" r="${p(30)}" fill="white" opacity="0.9"/>
    <circle cx="${p(580)}" cy="${p(420)}" r="${p(15)}" fill="${C.dark}" opacity="0.4"/>
    <circle cx="${p(700)}" cy="${p(250)}" r="${p(20)}" fill="${C.secondary}"/>
  </g>
  <text x="${size/2}" y="${p(820)}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="${p(170)}" fill="white" letter-spacing="${p(5)}">36</text>
  <text x="${size/2}" y="${p(910)}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="600" font-size="${p(65)}" fill="white" opacity="0.85">Route</text>
</svg>`;
}

function svgIconFg(size) {
  const p = (v) => (v / 1024 * size).toFixed(1);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <g transform="translate(${p(170)},${p(180)})">
    <rect x="${p(40)}" y="${p(20)}" width="${p(680)}" height="${p(380)}" rx="${p(50)}" fill="white" opacity="0.95"/>
    <rect x="${p(560)}" y="${p(60)}" width="${p(100)}" height="${p(220)}" rx="${p(16)}" fill="${C.secondary}" opacity="0.75"/>
    <rect x="${p(90)}" y="${p(70)}" width="${p(90)}" height="${p(120)}" rx="${p(12)}" fill="${C.primary}" opacity="0.5"/>
    <rect x="${p(210)}" y="${p(70)}" width="${p(90)}" height="${p(120)}" rx="${p(12)}" fill="${C.primary}" opacity="0.5"/>
    <rect x="${p(320)}" y="${p(70)}" width="${p(60)}" height="${p(120)}" rx="${p(12)}" fill="${C.primary}" opacity="0.5"/>
    <rect x="${p(40)}" y="${p(280)}" width="${p(680)}" height="${p(40)}" rx="${p(8)}" fill="${C.secondary}" opacity="0.4"/>
    <circle cx="${p(180)}" cy="${p(420)}" r="${p(30)}" fill="white" opacity="0.9"/>
    <circle cx="${p(180)}" cy="${p(420)}" r="${p(15)}" fill="${C.dark}" opacity="0.4"/>
    <circle cx="${p(580)}" cy="${p(420)}" r="${p(30)}" fill="white" opacity="0.9"/>
    <circle cx="${p(580)}" cy="${p(420)}" r="${p(15)}" fill="${C.dark}" opacity="0.4"/>
    <circle cx="${p(700)}" cy="${p(250)}" r="${p(20)}" fill="${C.secondary}"/>
  </g>
  <text x="${size/2}" y="${p(820)}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="${p(170)}" fill="white" letter-spacing="${p(5)}">36</text>
  <text x="${size/2}" y="${p(910)}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="600" font-size="${p(65)}" fill="white" opacity="0.85">Route</text>
</svg>`;
}

function svgIconBg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${C.primary}"/>
      <stop offset="100%" stop-color="${C.orangeDark}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size*0.22}" fill="url(#bg)"/>
</svg>`;
}

function svgIconMono(size) {
  const p = (v) => (v / 1024 * size).toFixed(1);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <g transform="translate(${p(170)},${p(180)})">
    <rect x="${p(40)}" y="${p(20)}" width="${p(680)}" height="${p(380)}" rx="${p(50)}" fill="black"/>
    <rect x="${p(560)}" y="${p(60)}" width="${p(100)}" height="${p(220)}" rx="${p(16)}" fill="white" opacity="0.25"/>
    <rect x="${p(90)}" y="${p(70)}" width="${p(90)}" height="${p(120)}" rx="${p(12)}" fill="white" opacity="0.15"/>
    <rect x="${p(210)}" y="${p(70)}" width="${p(90)}" height="${p(120)}" rx="${p(12)}" fill="white" opacity="0.15"/>
    <rect x="${p(320)}" y="${p(70)}" width="${p(60)}" height="${p(120)}" rx="${p(12)}" fill="white" opacity="0.15"/>
    <rect x="${p(40)}" y="${p(280)}" width="${p(680)}" height="${p(40)}" rx="${p(8)}" fill="white" opacity="0.12"/>
    <circle cx="${p(180)}" cy="${p(420)}" r="${p(30)}" fill="black"/>
    <circle cx="${p(180)}" cy="${p(420)}" r="${p(15)}" fill="white" opacity="0.3"/>
    <circle cx="${p(580)}" cy="${p(420)}" r="${p(30)}" fill="black"/>
    <circle cx="${p(580)}" cy="${p(420)}" r="${p(15)}" fill="white" opacity="0.3"/>
  </g>
  <text x="${size/2}" y="${p(820)}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="${p(170)}" fill="black">36</text>
  <text x="${size/2}" y="${p(910)}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="600" font-size="${p(65)}" fill="black" opacity="0.7">Route</text>
</svg>`;
}

function svgSplash(w, h) {
  const cx = w/2, cy = h * 0.42;
  const bs = Math.min(w, h) * 0.22;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${C.primary}"/>
      <stop offset="50%" stop-color="${C.orangeDark}"/>
      <stop offset="100%" stop-color="#DC2626" stop-opacity="0.3"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="45%">
      <stop offset="0%" stop-color="white" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <g opacity="0.05">
    <circle cx="${w*0.15}" cy="${h*0.2}" r="${w*0.08}" fill="white"/>
    <circle cx="${w*0.85}" cy="${h*0.8}" r="${w*0.12}" fill="white"/>
  </g>
  <g transform="translate(${cx - bs/2}, ${cy - bs/2})">
    <rect width="${bs}" height="${bs*0.52}" rx="${bs*0.08}" fill="white" opacity="0.95"/>
    <rect x="${bs*0.76}" y="${bs*0.08}" width="${bs*0.14}" height="${bs*0.3}" rx="${bs*0.02}" fill="${C.secondary}" opacity="0.75"/>
    <rect x="${bs*0.1}" y="${bs*0.1}" width="${bs*0.15}" height="${bs*0.2}" rx="${bs*0.02}" fill="${C.primary}" opacity="0.5"/>
    <rect x="${bs*0.3}" y="${bs*0.1}" width="${bs*0.15}" height="${bs*0.2}" rx="${bs*0.02}" fill="${C.primary}" opacity="0.5"/>
    <rect x="${bs*0.5}" y="${bs*0.1}" width="${bs*0.15}" height="${bs*0.2}" rx="${bs*0.02}" fill="${C.primary}" opacity="0.5"/>
    <rect x="${bs*0.1}" y="${bs*0.38}" width="${bs*0.8}" height="${bs*0.06}" rx="${bs*0.01}" fill="${C.secondary}" opacity="0.4"/>
    <circle cx="${bs*0.22}" cy="${bs*0.58}" r="${bs*0.055}" fill="white" opacity="0.9"/>
    <circle cx="${bs*0.22}" cy="${bs*0.58}" r="${bs*0.028}" fill="${C.dark}" opacity="0.4"/>
    <circle cx="${bs*0.78}" cy="${bs*0.58}" r="${bs*0.055}" fill="white" opacity="0.9"/>
    <circle cx="${bs*0.78}" cy="${bs*0.58}" r="${bs*0.028}" fill="${C.dark}" opacity="0.4"/>
  </g>
  <text x="${cx}" y="${cy + bs*0.52 + bs*0.35}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="${bs*0.32}" fill="white" letter-spacing="2">36Route</text>
</svg>`;
}

function svgFavicon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
  <defs>
    <linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${C.primary}"/>
      <stop offset="100%" stop-color="${C.orangeDark}"/>
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="10" fill="url(#fg)"/>
  <g transform="translate(7,10)">
    <rect x="1" y="0" width="30" height="15" rx="3" fill="white" opacity="0.95"/>
    <rect x="22" y="3" width="5" height="8" rx="1" fill="${C.secondary}" opacity="0.7"/>
    <rect x="5" y="3" width="4" height="5" rx="0.5" fill="${C.primary}" opacity="0.5"/>
    <rect x="11" y="3" width="4" height="5" rx="0.5" fill="${C.primary}" opacity="0.5"/>
    <rect x="17" y="3" width="3" height="5" rx="0.5" fill="${C.primary}" opacity="0.5"/>
    <circle cx="8" cy="19" r="2.5" fill="white" opacity="0.9"/>
    <circle cx="8" cy="19" r="1.2" fill="${C.dark}" opacity="0.4"/>
    <circle cx="24" cy="19" r="2.5" fill="white" opacity="0.9"/>
    <circle cx="24" cy="19" r="1.2" fill="${C.dark}" opacity="0.4"/>
  </g>
  <text x="24" y="45" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="6" fill="white" opacity="0.9">36</text>
</svg>`;
}

function svgLogoGlow(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="lg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${C.primary}" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="${C.primary}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${C.primary}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#lg)"/>
</svg>`;
}

async function toPNG(svgString, outputPath, w, h) {
  const buf = Buffer.from(svgString);
  const img = sharp(buf);
  if (w && h) img.resize(w, h);
  await img.png().toFile(outputPath);
  const stats = fs.statSync(outputPath);
  console.log(`  OK: ${path.basename(outputPath)} (${(stats.size/1024).toFixed(1)}KB)`);
}

async function main() {
  console.log('Generating 36Route images with sharp...\n');

  console.log('1. App Icon (1024x1024):');
  await toPNG(svgIconFull(1024), path.join(IMAGES_DIR, 'icon.png'), 1024, 1024);

  console.log('2. Android Foreground (432x432):');
  await toPNG(svgIconFg(432), path.join(IMAGES_DIR, 'android-icon-foreground.png'), 432, 432);

  console.log('3. Android Background (432x432):');
  await toPNG(svgIconBg(432), path.join(IMAGES_DIR, 'android-icon-background.png'), 432, 432);

  console.log('4. Android Monochrome (432x432):');
  await toPNG(svgIconMono(432), path.join(IMAGES_DIR, 'android-icon-monochrome.png'), 432, 432);

  console.log('5. Splash Icon (200x200):');
  const splashSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <g transform="translate(30, 38)">
      <rect x="8" y="4" width="126" height="72" rx="10" fill="white" opacity="0.95"/>
      <rect x="104" y="12" width="20" height="42" rx="4" fill="${C.primary}" opacity="0.5"/>
      <rect x="18" y="13" width="18" height="24" rx="3" fill="${C.primary}" opacity="0.4"/>
      <rect x="42" y="13" width="18" height="24" rx="3" fill="${C.primary}" opacity="0.4"/>
      <rect x="66" y="13" width="14" height="24" rx="3" fill="${C.primary}" opacity="0.4"/>
      <rect x="8" y="54" width="126" height="10" rx="2" fill="${C.secondary}" opacity="0.4"/>
      <circle cx="34" cy="80" r="7" fill="white" opacity="0.9"/>
      <circle cx="34" cy="80" r="3.5" fill="${C.dark}" opacity="0.4"/>
      <circle cx="110" cy="80" r="7" fill="white" opacity="0.9"/>
      <circle cx="110" cy="80" r="3.5" fill="${C.dark}" opacity="0.4"/>
    </g>
    <text x="100" y="170" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="34" fill="white" letter-spacing="1">36</text>
    <text x="100" y="188" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="600" font-size="11" fill="white" opacity="0.85">Route</text>
  </svg>`;
  await toPNG(splashSVG, path.join(IMAGES_DIR, 'splash-icon.png'), 200, 200);

  console.log('6. Favicon (48x48):');
  await toPNG(svgFavicon(), path.join(IMAGES_DIR, 'favicon.png'), 48, 48);

  console.log('7. Logo Glow (300x300):');
  await toPNG(svgLogoGlow(300), path.join(IMAGES_DIR, 'logo-glow.png'), 300, 300);

  // 7b. Brand Logo for Login/UI (200x200)
  console.log('7b. Brand Logo (200x200):');
  const brandLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="bl" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${C.primary}"/>
        <stop offset="100%" stop-color="${C.orangeDark}"/>
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="96" fill="white" opacity="0.12"/>
    <circle cx="100" cy="100" r="86" fill="white" opacity="0.08"/>
    <g transform="translate(38, 42)">
      <rect x="8" y="4" width="108" height="62" rx="9" fill="white"/>
      <rect x="88" y="10" width="18" height="36" rx="4" fill="${C.primary}" opacity="0.4"/>
      <rect x="16" y="11" width="16" height="20" rx="3" fill="${C.primary}" opacity="0.35"/>
      <rect x="38" y="11" width="16" height="20" rx="3" fill="${C.primary}" opacity="0.35"/>
      <rect x="60" y="11" width="12" height="20" rx="3" fill="${C.primary}" opacity="0.35"/>
      <rect x="8" y="45" width="108" height="8" rx="2" fill="${C.secondary}" opacity="0.4"/>
      <circle cx="30" cy="66" r="6" fill="#18181B" opacity="0.25"/>
      <circle cx="30" cy="66" r="3" fill="white" opacity="0.9"/>
      <circle cx="94" cy="66" r="6" fill="#18181B" opacity="0.25"/>
      <circle cx="94" cy="66" r="3" fill="white" opacity="0.9"/>
    </g>
    <text x="100" y="165" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="30" fill="white" letter-spacing="1">36</text>
    <text x="100" y="182" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="600" font-size="10" fill="white" opacity="0.85">Route</text>
  </svg>`;
  await toPNG(brandLogo, path.join(IMAGES_DIR, 'logo.png'), 200, 200);

  console.log('\n8. Tab Icons:');
  const tabDir = path.join(IMAGES_DIR, 'tabIcons');
  for (const suffix of ['', '@2x', '@3x']) {
    const sz = suffix === '' ? 24 : suffix === '@2x' ? 48 : 72;
    const homeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}" viewBox="0 0 24 24">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" 
            fill="none" stroke="${C.secondary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    await toPNG(homeSvg, path.join(tabDir, `home${suffix}.png`), sz, sz);

    const exploreSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sz}" height="${sz}" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="none" stroke="${C.secondary}" stroke-width="2"/>
      <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="${C.secondary}" opacity="0.3"/>
      <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="none" stroke="${C.secondary}" stroke-width="2" stroke-linejoin="round"/>
    </svg>`;
    await toPNG(exploreSvg, path.join(tabDir, `explore${suffix}.png`), sz, sz);
  }

  console.log('\nDone! All images generated successfully.');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
