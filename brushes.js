/* brushes.js — Estilos de trazo, paletas de color y biblioteca de personajes */

/* ── ESTILOS DE TRAZO ──────────────────────────────────────────────
   Cada estilo tiene:
     name    → nombre visible
     viewBox → coordenadas SVG internas
     render(color, opacity, uid) → devuelve el contenido SVG interno
   uid se usa para IDs únicos de gradientes (evita conflictos en página)
─────────────────────────────────────────────────────────────────── */
const BRUSH_STYLES = {
  classic: {
    name: 'Clásico',
    viewBox: '0 0 400 100',
    render: (c, op) => `
      <path d="M12,52 C18,16 96,4 200,6 C304,4 382,16 388,52 C382,86 304,96 200,94 C96,96 18,86 12,52Z" fill="${c}" opacity="${op}"/>
      <path d="M30,42 C60,26 130,20 200,22 C270,20 340,26 368,42" stroke="#fff" stroke-width="7" fill="none" opacity="${parseFloat(op)*0.18}" stroke-linecap="round"/>`
  },
  wavy: {
    name: 'Ondulado',
    viewBox: '0 0 400 100',
    render: (c, op) => `
      <path d="M8,50 C28,22 68,30 108,24 C148,18 178,38 218,32 C258,26 294,14 334,22 C362,28 390,40 392,52 C388,66 360,76 334,72 C294,80 258,90 218,84 C178,78 148,90 108,86 C68,82 28,80 8,66Z" fill="${c}" opacity="${op}"/>
      <path d="M20,40 C50,24 90,32 128,26 C168,20 195,36 230,30 C265,24 298,14 332,20" stroke="#fff" stroke-width="5" fill="none" opacity="${parseFloat(op)*0.16}" stroke-linecap="round"/>`
  },
  ribbon: {
    name: 'Cinta',
    viewBox: '0 0 400 100',
    render: (c, op) => `
      <path d="M4,20 C60,10 160,6 200,8 C240,6 340,10 396,20 L396,80 C340,90 240,94 200,92 C160,94 60,90 4,80Z" fill="${c}" opacity="${op}"/>
      <path d="M4,20 C60,10 160,6 200,8 C240,6 340,10 396,20 L396,34 C340,28 240,24 200,26 C160,24 60,28 4,34Z" fill="#fff" opacity="${parseFloat(op)*0.16}"/>`
  },
  rounded: {
    name: 'Píldora',
    viewBox: '0 0 400 100',
    render: (c, op, uid = 'rnd') => {
      const id = `rg${uid}`;
      return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fff" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.10"/>
      </linearGradient></defs>
      <path d="M50,8 L350,8 Q395,8 395,50 Q395,92 350,92 L50,92 Q5,92 5,50 Q5,8 50,8Z" fill="${c}" opacity="${op}"/>
      <path d="M50,8 L350,8 Q395,8 395,50 Q395,92 350,92 L50,92 Q5,92 5,50 Q5,8 50,8Z" fill="url(#${id})"/>`;
    }
  },
  burst: {
    name: 'Explosión',
    viewBox: '0 0 400 100',
    render: (c, op) =>
      `<path d="M200,5 L222,38 L270,18 L248,52 L390,45 L358,58 L388,74 L326,70 L308,92 L248,68 L200,95 L152,68 L92,92 L74,70 L12,74 L42,58 L10,45 L152,52 L130,18 L178,38Z" fill="${c}" opacity="${op}"/>`
  },
  paintbrush: {
    name: 'Pincel orgánico',
    viewBox: '0 0 400 100',
    render: (c, op) => `
      <path d="M6,44 C14,8 80,2 160,4 C200,4 240,4 280,6 C330,8 388,20 394,44 C398,58 392,76 376,84 C348,96 268,99 200,97 C130,99 50,96 22,82 C6,72 2,58 6,44Z" fill="${c}" opacity="${op}"/>
      <path d="M16,36 C36,16 100,10 180,10 C230,10 300,12 360,28" stroke="#fff" stroke-width="8" fill="none" opacity="${parseFloat(op)*0.2}" stroke-linecap="round"/>
      <path d="M376,66 C360,80 310,88 240,90 C180,92 100,90 40,80" stroke="#000" stroke-width="4" fill="none" opacity="${parseFloat(op)*0.08}" stroke-linecap="round"/>`
  },
  bar: {
    name: 'Barra plana',
    viewBox: '0 0 400 100',
    render: (c, op, uid = 'bar') => {
      const id = `bg${uid}`;
      return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fff" stop-opacity="0.20"/>
        <stop offset="50%" stop-color="${c}" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.10"/>
      </linearGradient></defs>
      <rect x="2" y="14" width="396" height="72" rx="5" fill="${c}" opacity="${op}"/>
      <rect x="2" y="14" width="396" height="72" rx="5" fill="url(#${id})"/>`;
    }
  },
  tube: {
    name: 'Tubo 3D',
    viewBox: '0 0 400 100',
    render: (c, op, uid = 'tg') => {
      const id1 = `g1${uid}`, id2 = `g2${uid}`;
      return `<defs>
        <linearGradient id="${id1}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#fff" stop-opacity="0.58"/>
          <stop offset="42%"  stop-color="${c}"  stop-opacity="${op}"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.22"/>
        </linearGradient>
        <linearGradient id="${id2}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stop-color="#fff" stop-opacity="0.42"/>
          <stop offset="32%" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="M50,8 L350,8 Q396,8 396,50 Q396,92 350,92 L50,92 Q4,92 4,50 Q4,8 50,8Z" fill="url(#${id1})"/>
      <path d="M50,8 L350,8 Q396,8 396,50 Q396,92 350,92 L50,92 Q4,92 4,50 Q4,8 50,8Z" fill="url(#${id2})"/>
      <ellipse cx="200" cy="18" rx="140" ry="5" fill="#fff" opacity="${parseFloat(op)*0.12}"/>`;
    }
  },
  bandera: {
    name: 'Bandera',
    viewBox: '0 0 400 100',
    render: (c, op) => `
      <path d="M5,10 L360,10 L396,50 L360,90 L5,90 Z" fill="${c}" opacity="${op}"/>
      <path d="M5,10 L360,10 L396,50 L360,38 L90,34 Z" fill="#fff" opacity="${parseFloat(op)*0.15}"/>`
  },
};

/* ── PALETA ESTÁNDAR ───────────────────────────────────────────── */
const COLOR_PRESETS = [
  { name: 'Naranja',     value: '#ff9f43' },
  { name: 'Rosa',        value: '#fd79a8' },
  { name: 'Rojo',        value: '#e84393' },
  { name: 'Morado',      value: '#a29bfe' },
  { name: 'Azul cielo',  value: '#74b9ff' },
  { name: 'Azul marino', value: '#0984e3' },
  { name: 'Esmeralda',   value: '#00b894' },
  { name: 'Verde lima',  value: '#55efc4' },
  { name: 'Amarillo',    value: '#ffeaa7' },
  { name: 'Dorado',      value: '#fdcb6e' },
  { name: 'Carmesí',     value: '#d63031' },
  { name: 'Coral',       value: '#e17055' },
  { name: 'Turquesa',    value: '#00cec9' },
  { name: 'Gris suave',  value: '#b2bec3' },
  { name: 'Fucsia',      value: '#e84393' },
  { name: 'Chocolate',   value: '#6d4c41' },
];

/* ── PALETA PASTEL ─────────────────────────────────────────────── */
const PASTEL_COLORS = [
  { name: 'Rosa bebé',    value: '#FFB3C6' },
  { name: 'Azul pastel',  value: '#AED6F1' },
  { name: 'Lavanda',      value: '#D7BDE2' },
  { name: 'Menta',        value: '#A9DFBF' },
  { name: 'Durazno',      value: '#FDBCB4' },
  { name: 'Amarillo sol', value: '#FFF9C4' },
  { name: 'Salmón',       value: '#FFCBA4' },
  { name: 'Cielo suave',  value: '#B3E5FC' },
  { name: 'Verde agua',   value: '#C8E6C9' },
  { name: 'Lila',         value: '#CE93D8' },
  { name: 'Naranja suave',value: '#FFCC80' },
  { name: 'Turquesa suave',value:'#80DEEA' },
  { name: 'Rosa cálido',  value: '#F48FB1' },
  { name: 'Índigo suave', value: '#9FA8DA' },
  { name: 'Maíz',         value: '#FFF59D' },
  { name: 'Blanco hueso', value: '#FFF8E7' },
];

const DEFAULT_SEQUENCE = [
  '#ff9f43','#fd79a8','#a29bfe','#74b9ff','#00b894',
  '#fdcb6e','#e17055','#00cec9','#d63031','#55efc4'
];

const FONTS = [
  { id: 'Dancing Script', label: 'Dancing Script', sample: 'Amor' },
  { id: 'Caveat',         label: 'Caveat',         sample: 'Amor' },
  { id: 'Pacifico',       label: 'Pacifico',       sample: 'Amor' },
  { id: 'Satisfy',        label: 'Satisfy',        sample: 'Amor' },
];

/* ── ÍCONOS DECORATIVOS PARA EL TRAZO ─────────────────────────── */
const DECO_ICONS = [
  { id: 'none',   symbol: '',   label: 'Ninguno' },
  { id: 'star4',  symbol: '✦',  label: 'Estrella' },
  { id: 'flower', symbol: '✿',  label: 'Flor' },
  { id: 'heart',  symbol: '♡',  label: 'Corazón' },
  { id: 'rose',   symbol: '❀',  label: 'Rosa' },
  { id: 'cross',  symbol: '✝',  label: 'Cruz' },
  { id: 'spark4', symbol: '❊',  label: 'Sol' },
  { id: 'spark',  symbol: '✨', label: 'Destellos' },
  { id: 'star',   symbol: '⭐', label: 'Estrella' },
  { id: 'fire',   symbol: '🔥', label: 'Fuego' },
  { id: 'cherry', symbol: '🌸', label: 'Flor' },
  { id: 'gem',    symbol: '💎', label: 'Gema' },
  { id: 'bow',    symbol: '🎀', label: 'Moño' },
  { id: 'dove',   symbol: '🕊', label: 'Paloma' },
  { id: 'leaf',   symbol: '🍀', label: 'Trébol' },
  { id: 'moon',   symbol: '🌙', label: 'Luna' },
];

/* ── HELPERS ───────────────────────────────────────────────────── */
function svgToDataUrl(svgStr) {
  try {
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
  } catch(e) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
  }
}

/* ── BIBLIOTECA DE PERSONAJES ──────────────────────────────────── */
const CHAR_LIBRARY = (() => {
  const chars = [
    {
      id: 'persona',
      name: 'Persona',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
        <ellipse cx="40" cy="13" rx="16" ry="10" fill="#5D4037"/>
        <circle cx="40" cy="27" r="17" fill="#FFCC80"/>
        <ellipse cx="24" cy="21" rx="5" ry="9" fill="#5D4037"/>
        <ellipse cx="56" cy="21" rx="5" ry="9" fill="#5D4037"/>
        <circle cx="32" cy="23" r="3.5" fill="white"/>
        <circle cx="48" cy="23" r="3.5" fill="white"/>
        <circle cx="32.5" cy="23.5" r="2" fill="#1A1A2E"/>
        <circle cx="48.5" cy="23.5" r="2" fill="#1A1A2E"/>
        <circle cx="33" cy="22.5" r="0.7" fill="white"/>
        <circle cx="49" cy="22.5" r="0.7" fill="white"/>
        <circle cx="27" cy="29" r="4" fill="#FFB74D" opacity="0.45"/>
        <circle cx="53" cy="29" r="4" fill="#FFB74D" opacity="0.45"/>
        <ellipse cx="40" cy="30" rx="2" ry="1.5" fill="#E59866"/>
        <path d="M32,33 Q40,39 48,33" stroke="#C0392B" stroke-width="2" fill="none" stroke-linecap="round"/>
        <rect x="35" y="42" width="10" height="9" rx="3" fill="#FFCC80"/>
        <rect x="20" y="49" width="40" height="30" rx="8" fill="#42A5F5"/>
        <rect x="8" y="51" width="12" height="22" rx="6" fill="#42A5F5"/>
        <rect x="60" y="51" width="12" height="22" rx="6" fill="#42A5F5"/>
        <circle cx="14" cy="73" r="5" fill="#FFCC80"/>
        <circle cx="66" cy="73" r="5" fill="#FFCC80"/>
        <rect x="20" y="77" width="40" height="8" rx="2" fill="#1565C0"/>
        <rect x="22" y="83" width="14" height="24" rx="6" fill="#1565C0"/>
        <rect x="44" y="83" width="14" height="24" rx="6" fill="#1565C0"/>
        <ellipse cx="29" cy="109" rx="9" ry="5" fill="#3E2723"/>
        <ellipse cx="51" cy="109" rx="9" ry="5" fill="#3E2723"/>
      </svg>`
    },
    {
      id: 'angel',
      name: 'Ángel',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
        <ellipse cx="40" cy="7" rx="16" ry="5" fill="none" stroke="#FFD700" stroke-width="3"/>
        <ellipse cx="10" cy="52" rx="13" ry="26" fill="#E3F2FD" transform="rotate(-22,10,52)"/>
        <ellipse cx="70" cy="52" rx="13" ry="26" fill="#E3F2FD" transform="rotate(22,70,52)"/>
        <ellipse cx="10" cy="52" rx="7" ry="20" fill="#BBDEFB" transform="rotate(-22,10,52)"/>
        <ellipse cx="70" cy="52" rx="7" ry="20" fill="#BBDEFB" transform="rotate(22,70,52)"/>
        <circle cx="40" cy="26" r="17" fill="#FFCC80"/>
        <path d="M24,20 Q40,10 56,20 Q52,12 40,10 Q28,12 24,20Z" fill="#FFD700"/>
        <circle cx="33" cy="22" r="3.5" fill="white"/>
        <circle cx="47" cy="22" r="3.5" fill="white"/>
        <circle cx="33.5" cy="22.5" r="2" fill="#1A237E"/>
        <circle cx="47.5" cy="22.5" r="2" fill="#1A237E"/>
        <circle cx="27" cy="28" r="4" fill="#FFB74D" opacity="0.4"/>
        <circle cx="53" cy="28" r="4" fill="#FFB74D" opacity="0.4"/>
        <path d="M33,30 Q40,36 47,30" stroke="#C0392B" stroke-width="2" fill="none" stroke-linecap="round"/>
        <rect x="35" y="42" width="10" height="9" rx="3" fill="#FFCC80"/>
        <ellipse cx="40" cy="72" rx="22" ry="36" fill="#EDE7F6"/>
        <ellipse cx="40" cy="50" rx="16" ry="14" fill="#F3E5F5"/>
        <rect x="37" y="60" width="6" height="16" rx="2" fill="#CE93D8"/>
        <rect x="31" y="65" width="18" height="6" rx="2" fill="#CE93D8"/>
      </svg>`
    },
    {
      id: 'perro',
      name: 'Perro',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
        <ellipse cx="20" cy="24" rx="11" ry="19" fill="#8D6E63" transform="rotate(-15,20,24)"/>
        <ellipse cx="60" cy="24" rx="11" ry="19" fill="#8D6E63" transform="rotate(15,60,24)"/>
        <circle cx="40" cy="32" r="22" fill="#A1887F"/>
        <ellipse cx="40" cy="40" rx="13" ry="10" fill="#BCAAA4"/>
        <circle cx="32" cy="25" r="5" fill="white"/>
        <circle cx="48" cy="25" r="5" fill="white"/>
        <circle cx="32.5" cy="25.5" r="3" fill="#1A1A2E"/>
        <circle cx="48.5" cy="25.5" r="3" fill="#1A1A2E"/>
        <circle cx="33" cy="24.5" r="1.1" fill="white"/>
        <circle cx="49" cy="24.5" r="1.1" fill="white"/>
        <ellipse cx="40" cy="34" rx="5.5" ry="4.5" fill="#4E342E"/>
        <ellipse cx="39" cy="33" rx="1.8" ry="1.2" fill="white" opacity="0.5"/>
        <path d="M31,41 Q40,47 49,41" stroke="#4E342E" stroke-width="2" fill="none" stroke-linecap="round"/>
        <ellipse cx="40" cy="46" rx="6" ry="4.5" fill="#E91E63"/>
        <ellipse cx="40" cy="78" rx="26" ry="30" fill="#A1887F"/>
        <rect x="16" y="88" width="14" height="24" rx="7" fill="#A1887F"/>
        <rect x="50" y="88" width="14" height="24" rx="7" fill="#A1887F"/>
        <ellipse cx="23" cy="113" rx="9" ry="6" fill="#8D6E63"/>
        <ellipse cx="57" cy="113" rx="9" ry="6" fill="#8D6E63"/>
        <path d="M66,72 Q84,55 74,40" stroke="#A1887F" stroke-width="9" fill="none" stroke-linecap="round"/>
        <rect x="26" y="53" width="28" height="7" rx="3.5" fill="#E53935"/>
        <circle cx="40" cy="62" r="4.5" fill="#FFD700"/>
      </svg>`
    },
    {
      id: 'gato',
      name: 'Gato',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
        <polygon points="14,28 22,6 32,28" fill="#9E9E9E"/>
        <polygon points="17,27 22,10 29,27" fill="#F48FB1"/>
        <polygon points="48,28 58,6 66,28" fill="#9E9E9E"/>
        <polygon points="51,27 58,10 63,27" fill="#F48FB1"/>
        <circle cx="40" cy="33" r="23" fill="#BDBDBD"/>
        <ellipse cx="31" cy="27" rx="6" ry="5" fill="#A5D6A7"/>
        <ellipse cx="49" cy="27" rx="6" ry="5" fill="#A5D6A7"/>
        <ellipse cx="31" cy="27" rx="2.5" ry="4.5" fill="#1A1A2E"/>
        <ellipse cx="49" cy="27" rx="2.5" ry="4.5" fill="#1A1A2E"/>
        <circle cx="31" cy="25.5" r="0.9" fill="white"/>
        <circle cx="49" cy="25.5" r="0.9" fill="white"/>
        <polygon points="40,33 37.5,37 42.5,37" fill="#F06292"/>
        <line x1="17" y1="35" x2="33" y2="36" stroke="#9E9E9E" stroke-width="1.5"/>
        <line x1="17" y1="38" x2="33" y2="38" stroke="#9E9E9E" stroke-width="1.5"/>
        <line x1="47" y1="36" x2="63" y2="35" stroke="#9E9E9E" stroke-width="1.5"/>
        <line x1="47" y1="38" x2="63" y2="38" stroke="#9E9E9E" stroke-width="1.5"/>
        <path d="M36,38 Q40,43 44,38" stroke="#616161" stroke-width="1.5" fill="none"/>
        <ellipse cx="40" cy="82" rx="24" ry="30" fill="#BDBDBD"/>
        <ellipse cx="22" cy="103" rx="9" ry="12" fill="#BDBDBD"/>
        <ellipse cx="58" cy="103" rx="9" ry="12" fill="#BDBDBD"/>
        <ellipse cx="22" cy="113" rx="9" ry="5" fill="#9E9E9E"/>
        <ellipse cx="58" cy="113" rx="9" ry="5" fill="#9E9E9E"/>
        <path d="M64,90 Q84,75 76,54 Q72,44 66,53" stroke="#BDBDBD" stroke-width="8" fill="none" stroke-linecap="round"/>
        <rect x="27" y="54" width="26" height="7" rx="3.5" fill="#FF7043"/>
        <circle cx="40" cy="63" r="3.5" fill="#FFD700"/>
      </svg>`
    },
    {
      id: 'enfermera',
      name: 'Enfermera',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
        <rect x="24" y="4" width="32" height="14" rx="2" fill="white" stroke="#E91E63" stroke-width="1.5"/>
        <rect x="37" y="6" width="6" height="10" rx="1.5" fill="#E91E63"/>
        <rect x="32" y="9" width="16" height="4" rx="1.5" fill="#E91E63"/>
        <circle cx="40" cy="30" r="17" fill="#FFCC80"/>
        <path d="M24,26 Q24,14 40,11 Q56,14 56,26 L54,22 Q40,13 26,22Z" fill="#5D4037"/>
        <circle cx="33" cy="26" r="3.5" fill="white"/>
        <circle cx="47" cy="26" r="3.5" fill="white"/>
        <circle cx="33.5" cy="26.5" r="2" fill="#3E2723"/>
        <circle cx="47.5" cy="26.5" r="2" fill="#3E2723"/>
        <circle cx="27" cy="31" r="4" fill="#FFB74D" opacity="0.4"/>
        <circle cx="53" cy="31" r="4" fill="#FFB74D" opacity="0.4"/>
        <path d="M33,34 Q40,39 47,34" stroke="#C0392B" stroke-width="2" fill="none" stroke-linecap="round"/>
        <rect x="36" y="46" width="8" height="8" rx="3" fill="#FFCC80"/>
        <rect x="20" y="52" width="40" height="30" rx="8" fill="#F48FB1"/>
        <rect x="37" y="58" width="6" height="14" rx="2" fill="white"/>
        <rect x="31" y="63" width="18" height="6" rx="2" fill="white"/>
        <rect x="8" y="54" width="12" height="22" rx="6" fill="#F48FB1"/>
        <rect x="60" y="54" width="12" height="22" rx="6" fill="#F48FB1"/>
        <circle cx="14" cy="76" r="5" fill="#FFCC80"/>
        <circle cx="66" cy="76" r="5" fill="#FFCC80"/>
        <path d="M20,81 Q40,92 60,81 L62,112 L18,112 Z" fill="white" stroke="#F48FB1" stroke-width="1.5"/>
        <ellipse cx="29" cy="113" rx="9" ry="5" fill="#F5F5F5"/>
        <ellipse cx="51" cy="113" rx="9" ry="5" fill="#F5F5F5"/>
      </svg>`
    },
    {
      id: 'chef',
      name: 'Chef',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
        <rect x="24" y="16" width="32" height="10" rx="3" fill="white"/>
        <ellipse cx="40" cy="13" rx="17" ry="14" fill="white"/>
        <ellipse cx="40" cy="13" rx="17" ry="14" fill="none" stroke="#E0E0E0" stroke-width="1.5"/>
        <circle cx="40" cy="32" r="17" fill="#FFCC80"/>
        <path d="M31,37 Q35,33 40,36 Q45,33 49,37" fill="#5D4037"/>
        <circle cx="33" cy="27" r="3.5" fill="white"/>
        <circle cx="47" cy="27" r="3.5" fill="white"/>
        <circle cx="33.5" cy="27.5" r="2" fill="#1A1A2E"/>
        <circle cx="47.5" cy="27.5" r="2" fill="#1A1A2E"/>
        <path d="M29,22 Q33,20 37,22" stroke="#5D4037" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M43,22 Q47,20 51,22" stroke="#5D4037" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="27" cy="33" r="4" fill="#FFB74D" opacity="0.4"/>
        <circle cx="53" cy="33" r="4" fill="#FFB74D" opacity="0.4"/>
        <rect x="36" y="48" width="8" height="8" rx="3" fill="#FFCC80"/>
        <rect x="20" y="54" width="40" height="28" rx="8" fill="white" stroke="#E0E0E0" stroke-width="1.5"/>
        <circle cx="36" cy="61" r="2.5" fill="#BDBDBD"/>
        <circle cx="36" cy="69" r="2.5" fill="#BDBDBD"/>
        <circle cx="36" cy="77" r="2.5" fill="#BDBDBD"/>
        <path d="M20,58 Q30,53 37,57" stroke="#E0E0E0" stroke-width="1.5" fill="none"/>
        <rect x="8" y="56" width="12" height="20" rx="6" fill="white" stroke="#E0E0E0" stroke-width="1.5"/>
        <rect x="60" y="56" width="12" height="20" rx="6" fill="white" stroke="#E0E0E0" stroke-width="1.5"/>
        <circle cx="14" cy="76" r="5" fill="#FFCC80"/>
        <circle cx="66" cy="76" r="5" fill="#FFCC80"/>
        <ellipse cx="68" cy="68" rx="11" ry="3" fill="#9E9E9E"/>
        <rect x="20" y="81" width="40" height="8" rx="2" fill="#37474F"/>
        <rect x="22" y="87" width="14" height="22" rx="6" fill="#37474F"/>
        <rect x="44" y="87" width="14" height="22" rx="6" fill="#37474F"/>
        <ellipse cx="29" cy="111" rx="9" ry="5" fill="#212121"/>
        <ellipse cx="51" cy="111" rx="9" ry="5" fill="#212121"/>
      </svg>`
    },
    {
      id: 'nina',
      name: 'Niña',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
        <ellipse cx="17" cy="17" rx="8" ry="13" fill="#FF8A65" transform="rotate(-20,17,17)"/>
        <ellipse cx="63" cy="17" rx="8" ry="13" fill="#FF8A65" transform="rotate(20,63,17)"/>
        <circle cx="40" cy="28" r="17" fill="#FFCC80"/>
        <path d="M23,23 Q40,11 57,23 Q53,13 40,11 Q27,13 23,23Z" fill="#FF8A65"/>
        <circle cx="32" cy="23" r="4" fill="white"/>
        <circle cx="48" cy="23" r="4" fill="white"/>
        <circle cx="32.5" cy="23.5" r="2.3" fill="#3E2723"/>
        <circle cx="48.5" cy="23.5" r="2.3" fill="#3E2723"/>
        <circle cx="33" cy="22.5" r="0.8" fill="white"/>
        <circle cx="49" cy="22.5" r="0.8" fill="white"/>
        <line x1="29" y1="18" x2="30" y2="15" stroke="#3E2723" stroke-width="1.3"/>
        <line x1="33" y1="17" x2="33" y2="14" stroke="#3E2723" stroke-width="1.3"/>
        <line x1="37" y1="18" x2="38" y2="15" stroke="#3E2723" stroke-width="1.3"/>
        <line x1="43" y1="18" x2="42" y2="15" stroke="#3E2723" stroke-width="1.3"/>
        <line x1="47" y1="17" x2="47" y2="14" stroke="#3E2723" stroke-width="1.3"/>
        <circle cx="26" cy="29" r="5" fill="#FF8A65" opacity="0.4"/>
        <circle cx="54" cy="29" r="5" fill="#FF8A65" opacity="0.4"/>
        <path d="M32,33 Q40,39 48,33" stroke="#C0392B" stroke-width="2" fill="none" stroke-linecap="round"/>
        <rect x="36" y="44" width="8" height="8" rx="3" fill="#FFCC80"/>
        <rect x="22" y="50" width="36" height="22" rx="8" fill="#EC407A"/>
        <ellipse cx="40" cy="50" rx="16" ry="5" fill="white" opacity="0.65"/>
        <path d="M16,72 Q40,79 64,72 L66,112 L14,112 Z" fill="#EC407A"/>
        <rect x="8" y="52" width="14" height="18" rx="7" fill="#EC407A"/>
        <rect x="58" y="52" width="14" height="18" rx="7" fill="#EC407A"/>
        <circle cx="15" cy="70" r="5.5" fill="#FFCC80"/>
        <circle cx="65" cy="70" r="5.5" fill="#FFCC80"/>
        <ellipse cx="28" cy="114" rx="9" ry="5" fill="#B71C1C"/>
        <ellipse cx="52" cy="114" rx="9" ry="5" fill="#B71C1C"/>
        <path d="M35,73 L40,69 L45,73 L40,77 Z" fill="#F8BBD0"/>
      </svg>`
    },
    {
      id: 'santa',
      name: 'Navideño',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
        <path d="M22,27 Q38,3 52,9 L48,27" fill="#D32F2F"/>
        <rect x="20" y="25" width="34" height="9" rx="4.5" fill="white"/>
        <circle cx="52" cy="9" r="7" fill="white"/>
        <circle cx="36" cy="40" r="18" fill="#FFCC80"/>
        <ellipse cx="36" cy="49" rx="18" ry="12" fill="white"/>
        <path d="M25,40 Q36,36 47,40" fill="white"/>
        <path d="M29,31 Q33,28 37,31" stroke="#3E2723" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M41,31 Q45,28 49,31" stroke="#3E2723" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="36" cy="38" r="4.5" fill="#E53935"/>
        <circle cx="24" cy="38" r="6" fill="#EF9A9A" opacity="0.5"/>
        <circle cx="48" cy="38" r="6" fill="#EF9A9A" opacity="0.5"/>
        <rect x="16" y="58" width="40" height="30" rx="8" fill="#D32F2F"/>
        <rect x="14" y="58" width="44" height="8" rx="4" fill="white"/>
        <rect x="14" y="82" width="44" height="9" rx="3" fill="#212121"/>
        <rect x="35" y="83" width="9" height="7" rx="2" fill="#FFD700"/>
        <rect x="4" y="60" width="12" height="22" rx="6" fill="#D32F2F"/>
        <rect x="64" y="60" width="12" height="22" rx="6" fill="#D32F2F"/>
        <circle cx="10" cy="82" r="6.5" fill="#212121"/>
        <circle cx="70" cy="82" r="6.5" fill="#212121"/>
        <rect x="18" y="89" width="14" height="22" rx="6" fill="#D32F2F"/>
        <rect x="48" y="89" width="14" height="22" rx="6" fill="#D32F2F"/>
        <ellipse cx="25" cy="113" rx="10" ry="6" fill="#212121"/>
        <ellipse cx="55" cy="113" rx="10" ry="6" fill="#212121"/>
      </svg>`
    },
    {
      id: 'bebe',
      name: 'Bebé',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
        <circle cx="40" cy="30" r="26" fill="#FFCC80"/>
        <path d="M31,7 Q40,4 49,7" stroke="#8D6E63" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <circle cx="30" cy="26" r="7" fill="white"/>
        <circle cx="50" cy="26" r="7" fill="white"/>
        <circle cx="31" cy="27" r="4" fill="#1A237E"/>
        <circle cx="51" cy="27" r="4" fill="#1A237E"/>
        <circle cx="32.5" cy="25.5" r="1.5" fill="white"/>
        <circle cx="52.5" cy="25.5" r="1.5" fill="white"/>
        <path d="M26,19 Q30,17 34,19" stroke="#8D6E63" stroke-width="1.5" fill="none"/>
        <path d="M46,19 Q50,17 54,19" stroke="#8D6E63" stroke-width="1.5" fill="none"/>
        <circle cx="20" cy="36" r="9" fill="#FFB74D" opacity="0.5"/>
        <circle cx="60" cy="36" r="9" fill="#FFB74D" opacity="0.5"/>
        <circle cx="40" cy="35" r="3" fill="#E59866"/>
        <path d="M33,42 Q40,48 47,42" stroke="#C0392B" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <ellipse cx="40" cy="80" rx="26" ry="30" fill="#FFF9C4"/>
        <ellipse cx="40" cy="56" rx="22" ry="17" fill="#FFF9C4"/>
        <path d="M18,57 Q29,51 40,55 Q51,51 62,57" stroke="#FFD54F" stroke-width="2.5" fill="none"/>
        <ellipse cx="12" cy="72" rx="11" ry="15" fill="#FFF9C4"/>
        <ellipse cx="68" cy="72" rx="11" ry="15" fill="#FFF9C4"/>
        <circle cx="11" cy="84" r="9" fill="#FFCC80"/>
        <circle cx="69" cy="84" r="9" fill="#FFCC80"/>
        <ellipse cx="40" cy="100" rx="24" ry="12" fill="white"/>
        <ellipse cx="27" cy="110" rx="12" ry="11" fill="#FFCC80"/>
        <ellipse cx="53" cy="110" rx="12" ry="11" fill="#FFCC80"/>
        <polygon points="40,70 42.5,77 50,77 44,81.5 46.5,88.5 40,84 33.5,88.5 36,81.5 30,77 37.5,77" fill="#FFD54F"/>
      </svg>`
    },
  ];

  // Convertir SVG strings a data URLs
  return chars.map(ch => ({
    ...ch,
    dataUrl: svgToDataUrl(ch.svg)
  }));
})();
