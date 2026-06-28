/* brushes.js — SVG brush stroke styles, color palettes, and font definitions */

const BRUSH_STYLES = {
  classic: {
    name: 'Clásico',
    viewBox: '0 0 400 100',
    path: 'M10,50 C20,15 100,5 200,7 C300,5 380,15 390,50 C380,85 300,95 200,93 C100,95 20,85 10,50Z'
  },
  wavy: {
    name: 'Ondulado',
    viewBox: '0 0 400 100',
    path: 'M8,48 C30,20 70,30 110,25 C150,20 180,38 220,33 C260,28 295,15 335,22 C362,27 388,38 392,50 C388,65 362,76 335,72 C295,80 260,88 220,82 C180,76 150,88 110,84 C70,80 30,82 8,65Z'
  },
  ribbon: {
    name: 'Cinta',
    viewBox: '0 0 400 100',
    path: 'M5,22 C60,12 160,8 200,10 C240,8 340,12 395,22 L395,78 C340,88 240,92 200,90 C160,92 60,88 5,78Z'
  },
  rounded: {
    name: 'Píldora',
    viewBox: '0 0 400 100',
    path: 'M50,8 L350,8 Q395,8 395,50 Q395,92 350,92 L50,92 Q5,92 5,50 Q5,8 50,8Z'
  },
  burst: {
    name: 'Explosión',
    viewBox: '0 0 400 100',
    path: 'M200,5 L222,38 L270,18 L248,52 L390,45 L358,58 L388,74 L326,70 L308,92 L248,68 L200,95 L152,68 L92,92 L74,70 L12,74 L42,58 L10,45 L152,52 L130,18 L178,38Z'
  },
  paintbrush: {
    name: 'Pincel',
    viewBox: '0 0 400 100',
    path: 'M12,42 C50,8 130,3 200,6 C270,3 350,8 388,38 C396,52 390,72 378,80 C348,95 268,98 200,96 C132,98 52,95 22,80 C8,70 3,55 12,42Z'
  }
};

const COLOR_PRESETS = [
  { name: 'Naranja',      value: '#ff9f43' },
  { name: 'Rosa fuerte',  value: '#fd79a8' },
  { name: 'Rojo',         value: '#e84393' },
  { name: 'Morado',       value: '#a29bfe' },
  { name: 'Azul cielo',   value: '#74b9ff' },
  { name: 'Azul marino',  value: '#0984e3' },
  { name: 'Esmeralda',    value: '#00b894' },
  { name: 'Verde lima',   value: '#55efc4' },
  { name: 'Amarillo',     value: '#ffeaa7' },
  { name: 'Dorado',       value: '#fdcb6e' },
  { name: 'Carmesí',      value: '#d63031' },
  { name: 'Coral',        value: '#e17055' },
  { name: 'Turquesa',     value: '#00cec9' },
  { name: 'Lavanda',      value: '#b2bec3' },
  { name: 'Fucsia',       value: '#e84393' },
  { name: 'Chocolate',    value: '#6d4c41' },
];

const DEFAULT_SEQUENCE = [
  '#ff9f43', '#fd79a8', '#a29bfe', '#74b9ff', '#00b894',
  '#fdcb6e', '#e17055', '#00cec9', '#d63031', '#55efc4'
];

const FONTS = [
  { id: 'Dancing Script', label: 'Dancing Script', sample: 'Amor' },
  { id: 'Caveat',         label: 'Caveat',         sample: 'Amor' },
  { id: 'Pacifico',       label: 'Pacifico',       sample: 'Amor' },
  { id: 'Satisfy',        label: 'Satisfy',        sample: 'Amor' },
];

function svgToDataUrl(svgStr) {
  try {
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
  } catch(e) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
  }
}

function makePlaceholderChar(label = '?', bgColor = '#dfe6e9', textColor = '#636e72') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 100">
    <rect width="80" height="100" rx="10" fill="${bgColor}"/>
    <circle cx="40" cy="32" r="18" fill="${textColor}" opacity="0.4"/>
    <ellipse cx="40" cy="78" rx="24" ry="26" fill="${textColor}" opacity="0.4"/>
    <text x="40" y="100" text-anchor="middle" font-size="11" fill="${textColor}" font-family="sans-serif" opacity="0.7">${label}</text>
  </svg>`;
  return svgToDataUrl(svg);
}
