/**
 * elements.js — SVG decorativos de velas, bordes, íconos de aromas y patrones
 */

const CandleElements = {

  // ── ÍCONOS DE VELAS SVG ──────────────────────────────────────────────────
  candleSVGs: [
    {
      name: 'Vela Clásica',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
        <defs>
          <linearGradient id="wax1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#f5deb3"/>
            <stop offset="50%" style="stop-color:#fdf3e3"/>
            <stop offset="100%" style="stop-color:#d4a96a"/>
          </linearGradient>
          <radialGradient id="flame1" cx="50%" cy="80%" r="50%">
            <stop offset="0%" style="stop-color:#fff3a0"/>
            <stop offset="40%" style="stop-color:#ff9f43"/>
            <stop offset="100%" style="stop-color:#e74c3c;stop-opacity:0"/>
          </radialGradient>
        </defs>
        <!-- Cuerpo de la vela -->
        <rect x="20" y="45" width="40" height="70" rx="3" fill="url(#wax1)"/>
        <!-- Sombra lateral -->
        <rect x="55" y="45" width="5" height="70" rx="2" fill="#c9956a" opacity="0.5"/>
        <!-- Mecha -->
        <line x1="40" y1="45" x2="38" y2="35" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>
        <!-- Llama exterior -->
        <ellipse cx="38" cy="22" rx="8" ry="14" fill="#ff9f43" opacity="0.7"/>
        <!-- Llama interior -->
        <ellipse cx="38" cy="25" rx="5" ry="10" fill="#fff3a0"/>
        <!-- Brillo de llama -->
        <circle cx="36" cy="20" r="2" fill="white" opacity="0.6"/>
        <!-- Cera derretida -->
        <ellipse cx="40" cy="45" rx="20" ry="4" fill="#e8c99a"/>
        <path d="M45,45 Q48,52 46,60" stroke="#e8c99a" stroke-width="4" fill="none" stroke-linecap="round"/>
      </svg>`
    },
    {
      name: 'Vela Aromática',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
        <defs>
          <linearGradient id="wax2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ffc0cb"/>
            <stop offset="50%" style="stop-color:#ffb6c1"/>
            <stop offset="100%" style="stop-color:#e8a0af"/>
          </linearGradient>
        </defs>
        <!-- Base del tarro -->
        <rect x="15" y="55" width="50" height="58" rx="6" fill="#e8e0d5"/>
        <rect x="18" y="58" width="44" height="52" rx="4" fill="url(#wax2)"/>
        <!-- Tapa del tarro -->
        <rect x="13" y="50" width="54" height="10" rx="4" fill="#c8bfb5"/>
        <!-- Superficie de cera -->
        <ellipse cx="40" cy="60" rx="21" ry="4" fill="#ffcdd7" opacity="0.8"/>
        <!-- Mecha -->
        <line x1="40" y1="60" x2="39" y2="48" stroke="#333" stroke-width="1.5"/>
        <!-- Llama -->
        <ellipse cx="39" cy="36" rx="6" ry="11" fill="#ff9f43" opacity="0.8"/>
        <ellipse cx="39" cy="39" rx="4" ry="8" fill="#fff3a0"/>
        <!-- Humo decorativo -->
        <path d="M39,25 Q41,20 39,15 Q37,10 39,5" stroke="#aaa" stroke-width="1" fill="none" opacity="0.5"/>
        <!-- Etiqueta -->
        <rect x="22" y="72" width="36" height="24" rx="2" fill="white" opacity="0.4"/>
        <line x1="26" y1="80" x2="54" y2="80" stroke="white" stroke-width="1" opacity="0.6"/>
        <line x1="26" y1="86" x2="54" y2="86" stroke="white" stroke-width="1" opacity="0.6"/>
      </svg>`
    },
    {
      name: 'Vela Pilar',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
        <defs>
          <linearGradient id="wax3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#4ecdc4"/>
            <stop offset="50%" style="stop-color:#7ee8e4"/>
            <stop offset="100%" style="stop-color:#3ab8b0"/>
          </linearGradient>
        </defs>
        <rect x="22" y="40" width="36" height="75" rx="3" fill="url(#wax3)"/>
        <rect x="53" y="40" width="5" height="75" rx="2" fill="#3ab8b0" opacity="0.5"/>
        <!-- Textura de cera horizontal -->
        <line x1="22" y1="60" x2="58" y2="60" stroke="white" stroke-width="0.5" opacity="0.3"/>
        <line x1="22" y1="75" x2="58" y2="75" stroke="white" stroke-width="0.5" opacity="0.3"/>
        <line x1="22" y1="90" x2="58" y2="90" stroke="white" stroke-width="0.5" opacity="0.3"/>
        <!-- Cera superior derretida -->
        <ellipse cx="40" cy="40" rx="18" ry="5" fill="#7ee8e4"/>
        <!-- Mecha -->
        <line x1="40" y1="40" x2="39" y2="28" stroke="#555" stroke-width="1.5"/>
        <!-- Llama doble -->
        <ellipse cx="39" cy="16" rx="7" ry="12" fill="#ff9f43" opacity="0.7"/>
        <ellipse cx="39" cy="19" rx="4.5" ry="8" fill="#fff176"/>
        <ellipse cx="39" cy="22" rx="2.5" ry="5" fill="white" opacity="0.7"/>
      </svg>`
    },
    {
      name: 'Vela Navidad',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
        <rect x="25" y="42" width="30" height="73" rx="3" fill="#c0392b"/>
        <rect x="50" y="42" width="5" height="73" rx="2" fill="#a93226" opacity="0.6"/>
        <!-- Decoración dorada -->
        <rect x="25" y="65" width="30" height="6" fill="#f5a623"/>
        <rect x="25" y="85" width="30" height="6" fill="#f5a623"/>
        <!-- Superficie superior -->
        <ellipse cx="40" cy="42" rx="15" ry="4" fill="#cd6155"/>
        <!-- Mecha -->
        <line x1="40" y1="42" x2="40" y2="30" stroke="#333" stroke-width="1.5"/>
        <!-- Llama cálida -->
        <ellipse cx="40" cy="18" rx="7" ry="12" fill="#ff9f43" opacity="0.8"/>
        <ellipse cx="40" cy="21" rx="4.5" ry="9" fill="#fff3a0"/>
        <!-- Estrella pequeña -->
        <text x="30" y="78" font-size="8" fill="#fff3a0" opacity="0.7">✦</text>
        <text x="44" y="98" font-size="6" fill="#fff3a0" opacity="0.5">✦</text>
      </svg>`
    },
    {
      name: 'Vela Spa',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
        <defs>
          <linearGradient id="wax5" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#d4e8c2"/>
            <stop offset="100%" style="stop-color:#a8d08d"/>
          </linearGradient>
        </defs>
        <!-- Plato -->
        <ellipse cx="40" cy="115" rx="28" ry="5" fill="#c8bfb5"/>
        <ellipse cx="40" cy="112" rx="26" ry="4" fill="#ddd5cc"/>
        <!-- Vela corta ancha -->
        <rect x="18" y="70" width="44" height="42" rx="5" fill="url(#wax5)"/>
        <ellipse cx="40" cy="70" rx="22" ry="5" fill="#c8e0a8"/>
        <!-- Flores decorativas -->
        <circle cx="30" cy="85" r="5" fill="#ff9f43" opacity="0.7"/>
        <circle cx="50" cy="90" r="4" fill="#e91e63" opacity="0.6"/>
        <circle cx="40" cy="95" r="3" fill="#ff9f43" opacity="0.5"/>
        <!-- Mechas múltiples -->
        <line x1="33" y1="70" x2="32" y2="58" stroke="#333" stroke-width="1.2"/>
        <line x1="47" y1="70" x2="48" y2="58" stroke="#333" stroke-width="1.2"/>
        <!-- Llamas -->
        <ellipse cx="32" cy="48" rx="5" ry="9" fill="#ff9f43" opacity="0.8"/>
        <ellipse cx="32" cy="51" rx="3" ry="6" fill="#fff3a0"/>
        <ellipse cx="48" cy="48" rx="5" ry="9" fill="#ff9f43" opacity="0.8"/>
        <ellipse cx="48" cy="51" rx="3" ry="6" fill="#fff3a0"/>
      </svg>`
    },
    {
      name: 'Vela Lujo',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120">
        <defs>
          <linearGradient id="wax6" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#1a1a2e"/>
            <stop offset="40%" style="stop-color:#2d2d4e"/>
            <stop offset="100%" style="stop-color:#1a1a2e"/>
          </linearGradient>
        </defs>
        <rect x="20" y="40" width="40" height="75" rx="4" fill="url(#wax6)"/>
        <!-- Líneas doradas -->
        <rect x="20" y="50" width="40" height="2" fill="#f5a623" opacity="0.8"/>
        <rect x="20" y="108" width="40" height="2" fill="#f5a623" opacity="0.8"/>
        <rect x="20" y="40" width="2" height="75" fill="#f5a623" opacity="0.8"/>
        <rect x="58" y="40" width="2" height="75" fill="#f5a623" opacity="0.8"/>
        <!-- Monograma decorativo -->
        <text x="40" y="82" font-size="16" fill="#f5a623" opacity="0.6" text-anchor="middle" font-weight="bold">✦</text>
        <!-- Superficie cera -->
        <ellipse cx="40" cy="40" rx="20" ry="4" fill="#2d2d4e"/>
        <!-- Mecha dorada -->
        <line x1="40" y1="40" x2="40" y2="28" stroke="#f5a623" stroke-width="1.5"/>
        <!-- Llama elegante -->
        <ellipse cx="40" cy="16" rx="6" ry="11" fill="#f5a623" opacity="0.7"/>
        <ellipse cx="40" cy="19" rx="3.5" ry="7.5" fill="#fff3a0"/>
        <ellipse cx="40" cy="22" rx="2" ry="5" fill="white" opacity="0.8"/>
      </svg>`
    }
  ],

  // ── ELEMENTOS DECORATIVOS ────────────────────────────────────────────────
  decorElements: [
    {
      name: 'Llama',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 80">
        <ellipse cx="30" cy="55" rx="22" ry="8" fill="#ff9f43" opacity="0.3"/>
        <path d="M30,70 Q15,55 18,40 Q20,30 30,25 Q25,35 28,42 Q32,32 28,20 Q38,30 35,45 Q40,35 38,25 Q48,35 42,50 Q45,40 42,55 Q38,65 30,70Z" fill="#ff9f43"/>
        <path d="M30,65 Q20,53 22,42 Q26,35 30,30 Q27,38 30,45 Q34,37 31,28 Q38,37 36,48 Q40,40 38,50 Q35,60 30,65Z" fill="#ff6b35"/>
        <path d="M30,58 Q25,50 26,44 Q29,40 30,36 Q29,42 31,46 Q33,41 31,36 Q36,42 34,50 Q32,55 30,58Z" fill="#fff3a0"/>
        <circle cx="30" cy="42" r="5" fill="white" opacity="0.6"/>
      </svg>`
    },
    {
      name: 'Llamas x3',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 60">
        <path d="M15,55 Q8,45 10,35 Q12,28 15,24 Q13,31 15,37 Q18,30 16,22 Q22,30 20,40 Q22,33 21,42 Q19,50 15,55Z" fill="#ff9f43"/>
        <path d="M15,50 Q10,42 12,36 Q14,32 15,28 Q14,34 16,38 Q18,33 16,28 Q20,34 18,43 Q16,48 15,50Z" fill="#fff3a0"/>
        <path d="M40,55 Q30,42 33,30 Q36,22 40,18 Q37,28 40,36 Q44,26 40,16 Q50,26 47,38 Q50,30 48,42 Q45,51 40,55Z" fill="#ff9f43"/>
        <path d="M40,50 Q33,40 35,32 Q38,26 40,22 Q38,30 41,36 Q44,29 41,22 Q48,30 46,40 Q43,48 40,50Z" fill="#fff3a0"/>
        <path d="M65,55 Q58,45 60,35 Q62,28 65,24 Q63,31 65,37 Q68,30 66,22 Q72,30 70,40 Q72,33 71,42 Q69,50 65,55Z" fill="#ff9f43"/>
        <path d="M65,50 Q60,42 62,36 Q64,32 65,28 Q64,34 66,38 Q68,33 66,28 Q70,34 68,43 Q66,48 65,50Z" fill="#fff3a0"/>
      </svg>`
    },
    {
      name: 'Gota de Cera',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 80">
        <defs>
          <linearGradient id="drop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fdf3e3"/>
            <stop offset="100%" style="stop-color:#d4a96a"/>
          </linearGradient>
        </defs>
        <path d="M30,5 Q20,25 15,40 Q10,55 30,70 Q50,55 45,40 Q40,25 30,5Z" fill="url(#drop)"/>
        <path d="M30,20 Q25,32 22,42 Q20,52 30,60 Q35,52 34,42 Q33,32 30,20Z" fill="white" opacity="0.3"/>
      </svg>`
    },
    {
      name: 'Chispas',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="3" fill="#f5a623"/>
        <line x1="40" y1="15" x2="40" y2="28" stroke="#f5a623" stroke-width="2" stroke-linecap="round"/>
        <line x1="40" y1="52" x2="40" y2="65" stroke="#f5a623" stroke-width="2" stroke-linecap="round"/>
        <line x1="15" y1="40" x2="28" y2="40" stroke="#f5a623" stroke-width="2" stroke-linecap="round"/>
        <line x1="52" y1="40" x2="65" y2="40" stroke="#f5a623" stroke-width="2" stroke-linecap="round"/>
        <line x1="22" y1="22" x2="31" y2="31" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="49" y1="49" x2="58" y2="58" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="58" y1="22" x2="49" y2="31" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="31" y1="49" x2="22" y2="58" stroke="#f5a623" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="40" cy="15" r="2" fill="#fff3a0"/>
        <circle cx="40" cy="65" r="2" fill="#fff3a0"/>
        <circle cx="15" cy="40" r="2" fill="#fff3a0"/>
        <circle cx="65" cy="40" r="2" fill="#fff3a0"/>
      </svg>`
    },
    {
      name: 'Luna',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
        <path d="M35,8 Q20,12 16,28 Q12,44 25,52 Q15,50 10,38 Q5,22 16,12 Q24,5 35,8Z" fill="#f5a623"/>
        <circle cx="18" cy="20" r="2" fill="white" opacity="0.5"/>
        <circle cx="22" cy="40" r="1.5" fill="white" opacity="0.4"/>
        <circle cx="12" cy="32" r="1" fill="white" opacity="0.3"/>
      </svg>`
    },
    {
      name: 'Estrella',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
        <polygon points="30,5 36,22 54,22 40,33 45,50 30,40 15,50 20,33 6,22 24,22" fill="#f5a623"/>
        <polygon points="30,12 34,22 46,22 37,29 40,41 30,34 20,41 23,29 14,22 26,22" fill="#fff3a0"/>
      </svg>`
    },
    {
      name: 'Hoja',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 70">
        <path d="M30,65 Q10,50 10,30 Q10,10 30,5 Q50,10 50,30 Q50,50 30,65Z" fill="#4caf50"/>
        <path d="M30,65 Q20,50 20,32 Q20,18 30,10 Q32,25 30,40 Q28,52 30,65Z" fill="#2e7d32" opacity="0.5"/>
        <line x1="30" y1="65" x2="30" y2="10" stroke="#1b5e20" stroke-width="1" opacity="0.5"/>
        <line x1="30" y1="40" x2="20" y2="30" stroke="#1b5e20" stroke-width="0.8" opacity="0.4"/>
        <line x1="30" y1="35" x2="40" y2="25" stroke="#1b5e20" stroke-width="0.8" opacity="0.4"/>
        <line x1="30" y1="50" x2="22" y2="42" stroke="#1b5e20" stroke-width="0.8" opacity="0.4"/>
      </svg>`
    },
    {
      name: 'Rosa',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="8" fill="#e91e63"/>
        <path d="M30,22 Q38,18 40,26 Q36,30 30,30Z" fill="#c2185b"/>
        <path d="M30,22 Q22,18 20,26 Q24,30 30,30Z" fill="#f06292"/>
        <path d="M30,38 Q38,42 40,34 Q36,30 30,30Z" fill="#c2185b"/>
        <path d="M30,38 Q22,42 20,34 Q24,30 30,30Z" fill="#f06292"/>
        <path d="M22,26 Q18,34 22,38 Q26,36 30,30Z" fill="#e91e63" opacity="0.8"/>
        <path d="M38,26 Q42,34 38,38 Q34,36 30,30Z" fill="#e91e63" opacity="0.8"/>
        <circle cx="30" cy="30" r="4" fill="#ff80ab"/>
      </svg>`
    }
  ],

  // ── BORDES DECORATIVOS ───────────────────────────────────────────────────
  borders: [
    {
      name: 'Clásico',
      generate: (w, h, color) => {
        const margin = 12;
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
          <rect x="${margin}" y="${margin}" width="${w-margin*2}" height="${h-margin*2}"
            fill="none" stroke="${color}" stroke-width="2" rx="4"/>
          <rect x="${margin+4}" y="${margin+4}" width="${w-margin*2-8}" height="${h-margin*2-8}"
            fill="none" stroke="${color}" stroke-width="0.8" rx="2" opacity="0.5"/>
        </svg>`;
      }
    },
    {
      name: 'Floral',
      generate: (w, h, color) => {
        const m = 10;
        const corners = [
          [m, m], [w-m, m], [m, h-m], [w-m, h-m]
        ].map(([cx, cy]) =>
          `<circle cx="${cx}" cy="${cy}" r="5" fill="${color}" opacity="0.8"/>
           <circle cx="${cx}" cy="${cy}" r="8" fill="none" stroke="${color}" stroke-width="1" opacity="0.4"/>`
        ).join('');
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
          <rect x="${m}" y="${m}" width="${w-m*2}" height="${h-m*2}" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="8,4" rx="4"/>
          ${corners}
        </svg>`;
      }
    },
    {
      name: 'Doble Línea',
      generate: (w, h, color) => {
        const m1 = 8, m2 = 14;
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
          <rect x="${m1}" y="${m1}" width="${w-m1*2}" height="${h-m1*2}" fill="none" stroke="${color}" stroke-width="3" rx="3"/>
          <rect x="${m2}" y="${m2}" width="${w-m2*2}" height="${h-m2*2}" fill="none" stroke="${color}" stroke-width="1" rx="2" opacity="0.6"/>
        </svg>`;
      }
    },
    {
      name: 'Puntos',
      generate: (w, h, color) => {
        const m = 10, step = 12;
        let dots = '';
        for (let x = m; x <= w-m; x += step) {
          dots += `<circle cx="${x}" cy="${m}" r="2" fill="${color}" opacity="0.7"/>`;
          dots += `<circle cx="${x}" cy="${h-m}" r="2" fill="${color}" opacity="0.7"/>`;
        }
        for (let y = m+step; y <= h-m-step; y += step) {
          dots += `<circle cx="${m}" cy="${y}" r="2" fill="${color}" opacity="0.7"/>`;
          dots += `<circle cx="${w-m}" cy="${y}" r="2" fill="${color}" opacity="0.7"/>`;
        }
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${dots}</svg>`;
      }
    },
    {
      name: 'Ondulado',
      generate: (w, h, color) => {
        const m = 12, amp = 4, freq = 20;
        let topPath = `M ${m} ${m}`;
        let botPath = `M ${m} ${h-m}`;
        for (let x = m; x <= w-m; x += freq) {
          topPath += ` Q ${x+freq/2} ${m-amp} ${x+freq} ${m}`;
          botPath += ` Q ${x+freq/2} ${h-m+amp} ${x+freq} ${h-m}`;
        }
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
          <path d="${topPath}" fill="none" stroke="${color}" stroke-width="2"/>
          <path d="${botPath}" fill="none" stroke="${color}" stroke-width="2"/>
          <line x1="${m}" y1="${m}" x2="${m}" y2="${h-m}" stroke="${color}" stroke-width="2"/>
          <line x1="${w-m}" y1="${m}" x2="${w-m}" y2="${h-m}" stroke="${color}" stroke-width="2"/>
        </svg>`;
      }
    },
    {
      name: 'Vintage',
      generate: (w, h, color) => {
        const m = 10;
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
          <rect x="${m}" y="${m}" width="${w-m*2}" height="${h-m*2}" fill="none" stroke="${color}" stroke-width="2" rx="6"/>
          <rect x="${m+5}" y="${m+5}" width="${w-m*2-10}" height="${h-m*2-10}" fill="none" stroke="${color}" stroke-width="0.7" rx="4" stroke-dasharray="4,2" opacity="0.5"/>
          <circle cx="${m+8}" cy="${m+8}" r="3" fill="${color}" opacity="0.7"/>
          <circle cx="${w-m-8}" cy="${m+8}" r="3" fill="${color}" opacity="0.7"/>
          <circle cx="${m+8}" cy="${h-m-8}" r="3" fill="${color}" opacity="0.7"/>
          <circle cx="${w-m-8}" cy="${h-m-8}" r="3" fill="${color}" opacity="0.7"/>
        </svg>`;
      }
    },
    {
      name: 'Oro',
      generate: (w, h, color) => {
        const m = 8;
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
          <rect x="${m}" y="${m}" width="${w-m*2}" height="${h-m*2}" fill="none" stroke="#f5a623" stroke-width="3" rx="4"/>
          <rect x="${m+4}" y="${m+4}" width="${w-m*2-8}" height="${h-m*2-8}" fill="none" stroke="#d4a017" stroke-width="1" rx="2"/>
          <rect x="${m+3}" y="${m+3}" width="${w-m*2-6}" height="${h-m*2-6}" fill="none" stroke="#fff3a0" stroke-width="0.5" rx="3" opacity="0.5"/>
        </svg>`;
      }
    },
    {
      name: 'Minimalista',
      generate: (w, h, color) => {
        const m = 15, len = 20;
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
          <line x1="${m}" y1="${m}" x2="${m+len}" y2="${m}" stroke="${color}" stroke-width="2"/>
          <line x1="${m}" y1="${m}" x2="${m}" y2="${m+len}" stroke="${color}" stroke-width="2"/>
          <line x1="${w-m}" y1="${m}" x2="${w-m-len}" y2="${m}" stroke="${color}" stroke-width="2"/>
          <line x1="${w-m}" y1="${m}" x2="${w-m}" y2="${m+len}" stroke="${color}" stroke-width="2"/>
          <line x1="${m}" y1="${h-m}" x2="${m+len}" y2="${h-m}" stroke="${color}" stroke-width="2"/>
          <line x1="${m}" y1="${h-m}" x2="${m}" y2="${h-m-len}" stroke="${color}" stroke-width="2"/>
          <line x1="${w-m}" y1="${h-m}" x2="${w-m-len}" y2="${h-m}" stroke="${color}" stroke-width="2"/>
          <line x1="${w-m}" y1="${h-m}" x2="${w-m}" y2="${h-m-len}" stroke="${color}" stroke-width="2"/>
        </svg>`;
      }
    }
  ],

  // ── ÍCONOS DE AROMAS ─────────────────────────────────────────────────────
  scents: [
    {
      name: 'Lavanda',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 60">
        <line x1="25" y1="55" x2="25" y2="20" stroke="#8e44ad" stroke-width="2"/>
        <ellipse cx="25" cy="18" rx="5" ry="8" fill="#9b59b6"/>
        <ellipse cx="18" cy="25" rx="4" ry="7" fill="#8e44ad" transform="rotate(-20,18,25)"/>
        <ellipse cx="32" cy="25" rx="4" ry="7" fill="#8e44ad" transform="rotate(20,32,25)"/>
        <ellipse cx="20" cy="15" rx="3" ry="6" fill="#7d3c98" transform="rotate(-10,20,15)"/>
        <ellipse cx="30" cy="15" rx="3" ry="6" fill="#7d3c98" transform="rotate(10,30,15)"/>
      </svg>`
    },
    {
      name: 'Rosa',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="8" fill="#e91e63"/>
        <path d="M25,17 Q33,13 35,21 Q31,25 25,25Z" fill="#c2185b"/>
        <path d="M25,17 Q17,13 15,21 Q19,25 25,25Z" fill="#f06292"/>
        <path d="M25,33 Q33,37 35,29 Q31,25 25,25Z" fill="#c2185b"/>
        <path d="M25,33 Q17,37 15,29 Q19,25 25,25Z" fill="#f06292"/>
        <circle cx="25" cy="25" r="4" fill="#ff80ab"/>
      </svg>`
    },
    {
      name: 'Menta',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 60">
        <path d="M25,55 Q20,45 15,35 Q10,25 15,18 Q20,12 25,15 Q30,12 35,18 Q40,25 35,35 Q30,45 25,55Z" fill="#4caf50"/>
        <path d="M25,55 Q22,45 20,35 Q18,25 22,18 Q24,26 25,35 Q24,45 25,55Z" fill="#2e7d32" opacity="0.4"/>
        <line x1="25" y1="55" x2="25" y2="15" stroke="#1b5e20" stroke-width="1" opacity="0.4"/>
        <path d="M25,35 Q18,30 15,35" stroke="#1b5e20" stroke-width="0.8" fill="none" opacity="0.5"/>
        <path d="M25,42 Q32,37 35,42" stroke="#1b5e20" stroke-width="0.8" fill="none" opacity="0.5"/>
      </svg>`
    },
    {
      name: 'Vainilla',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 60">
        <path d="M25,5 Q28,10 25,55" stroke="#8b6914" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M18,15 Q25,12 32,15" stroke="#8b6914" stroke-width="1.5" fill="none"/>
        <path d="M16,25 Q25,22 34,25" stroke="#8b6914" stroke-width="1.5" fill="none"/>
        <path d="M17,35 Q25,32 33,35" stroke="#8b6914" stroke-width="1.5" fill="none"/>
        <circle cx="25" cy="8" r="4" fill="#f5a623" opacity="0.8"/>
        <circle cx="14" cy="18" r="2" fill="#f5a623" opacity="0.6"/>
        <circle cx="36" cy="18" r="2" fill="#f5a623" opacity="0.6"/>
      </svg>`
    },
    {
      name: 'Cedro',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 60">
        <line x1="25" y1="55" x2="25" y2="15" stroke="#795548" stroke-width="3"/>
        <polygon points="25,5 10,25 40,25" fill="#4caf50"/>
        <polygon points="25,15 8,32 42,32" fill="#388e3c"/>
        <polygon points="25,22 5,42 45,42" fill="#2e7d32"/>
      </svg>`
    },
    {
      name: 'Limón',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="18" fill="#fff176"/>
        <circle cx="25" cy="25" r="14" fill="#ffee58"/>
        <line x1="25" y1="11" x2="25" y2="39" stroke="#fdd835" stroke-width="1" opacity="0.6"/>
        <line x1="11" y1="25" x2="39" y2="25" stroke="#fdd835" stroke-width="1" opacity="0.6"/>
        <line x1="15" y1="15" x2="35" y2="35" stroke="#fdd835" stroke-width="1" opacity="0.4"/>
        <line x1="35" y1="15" x2="15" y2="35" stroke="#fdd835" stroke-width="1" opacity="0.4"/>
        <circle cx="25" cy="25" r="4" fill="#fdd835"/>
      </svg>`
    },
    {
      name: 'Canela',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 60">
        <path d="M15,10 Q20,5 25,10 Q30,15 35,10 Q40,5 45,10" stroke="#795548" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M15,22 Q20,17 25,22 Q30,27 35,22 Q40,17 45,22" stroke="#8d6e63" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M15,34 Q20,29 25,34 Q30,39 35,34 Q40,29 45,34" stroke="#795548" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M15,46 Q20,41 25,46 Q30,51 35,46 Q40,41 45,46" stroke="#8d6e63" stroke-width="3" fill="none" stroke-linecap="round"/>
      </svg>`
    },
    {
      name: 'Sándalo',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
        <path d="M25,8 Q40,15 42,28 Q44,42 28,46 Q12,50 8,35 Q4,20 18,12 Q21,10 25,8Z" fill="#d7ccc8"/>
        <path d="M25,8 Q32,16 33,26 Q34,36 25,40 Q16,44 12,36 Q8,28 14,20 Q18,14 25,8Z" fill="#bcaaa4"/>
        <path d="M25,8 Q28,18 26,28 Q24,36 25,44 Q22,38 22,28 Q20,18 25,8Z" fill="#a1887f" opacity="0.4"/>
      </svg>`
    }
  ],

  // ── PATRONES ─────────────────────────────────────────────────────────────
  patterns: [
    {
      name: 'Puntos',
      create: (color, bgColor, scale) => {
        const s = 20 * scale;
        const r = 3 * scale;
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
          <rect width="${s}" height="${s}" fill="${bgColor}"/>
          <circle cx="${s/2}" cy="${s/2}" r="${r}" fill="${color}"/>
        </svg>`;
      }
    },
    {
      name: 'Líneas',
      create: (color, bgColor, scale) => {
        const s = 15 * scale;
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
          <rect width="${s}" height="${s}" fill="${bgColor}"/>
          <line x1="0" y1="${s/2}" x2="${s}" y2="${s/2}" stroke="${color}" stroke-width="${1.5*scale}"/>
        </svg>`;
      }
    },
    {
      name: 'Cuadros',
      create: (color, bgColor, scale) => {
        const s = 20 * scale;
        const h = s / 2;
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
          <rect width="${s}" height="${s}" fill="${bgColor}"/>
          <rect width="${h}" height="${h}" fill="${color}"/>
          <rect x="${h}" y="${h}" width="${h}" height="${h}" fill="${color}"/>
        </svg>`;
      }
    },
    {
      name: 'Diagonal',
      create: (color, bgColor, scale) => {
        const s = 15 * scale;
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
          <rect width="${s}" height="${s}" fill="${bgColor}"/>
          <line x1="0" y1="0" x2="${s}" y2="${s}" stroke="${color}" stroke-width="${2*scale}"/>
          <line x1="${-s}" y1="0" x2="${s}" y2="${s*2}" stroke="${color}" stroke-width="${2*scale}"/>
          <line x1="${s}" y1="${-s}" x2="${s*2}" y2="0" stroke="${color}" stroke-width="${2*scale}"/>
        </svg>`;
      }
    },
    {
      name: 'Hexágono',
      create: (color, bgColor, scale) => {
        const w = 30 * scale, h = 26 * scale;
        const hw = w/2, qw = w/4;
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
          <rect width="${w}" height="${h}" fill="${bgColor}"/>
          <polygon points="${hw},2 ${w-2},${h*0.25} ${w-2},${h*0.75} ${hw},${h-2} 2,${h*0.75} 2,${h*0.25}"
            fill="none" stroke="${color}" stroke-width="${1.5*scale}"/>
        </svg>`;
      }
    },
    {
      name: 'Cruz',
      create: (color, bgColor, scale) => {
        const s = 20 * scale;
        const m = s * 0.3, t = s * 0.15;
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
          <rect width="${s}" height="${s}" fill="${bgColor}"/>
          <line x1="${s/2}" y1="${t}" x2="${s/2}" y2="${s-t}" stroke="${color}" stroke-width="${2*scale}"/>
          <line x1="${t}" y1="${s/2}" x2="${s-t}" y2="${s/2}" stroke="${color}" stroke-width="${2*scale}"/>
        </svg>`;
      }
    },
    {
      name: 'Ondas',
      create: (color, bgColor, scale) => {
        const w = 40 * scale, h = 15 * scale;
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
          <rect width="${w}" height="${h}" fill="${bgColor}"/>
          <path d="M 0 ${h/2} Q ${w/4} 2 ${w/2} ${h/2} Q ${w*3/4} ${h-2} ${w} ${h/2}"
            fill="none" stroke="${color}" stroke-width="${1.5*scale}"/>
        </svg>`;
      }
    },
    {
      name: 'Estrellas',
      create: (color, bgColor, scale) => {
        const s = 30 * scale;
        const cx = s/2, cy = s/2, r = 6*scale;
        const points = Array.from({length:5}, (_,i) => {
          const angle = (i * 72 - 90) * Math.PI / 180;
          const ir = r * 0.4;
          const oa = angle, ia = angle + 36 * Math.PI / 180;
          return `${cx+r*Math.cos(oa)},${cy+r*Math.sin(oa)} ${cx+ir*Math.cos(ia)},${cy+ir*Math.sin(ia)}`;
        }).join(' ');
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
          <rect width="${s}" height="${s}" fill="${bgColor}"/>
          <polygon points="${points}" fill="${color}"/>
        </svg>`;
      }
    }
  ],

  // ── REGISTRAR ELEMENTOS EN EL DOM ────────────────────────────────────────
  init() {
    this._renderCandleImages();
    this._renderDecorElements();
    this._renderBorders();
    this._renderScents();
    this._renderPatterns();
  },

  _renderCandleImages() {
    const grid = document.getElementById('candle-images-grid');
    if (!grid) return;
    grid.innerHTML = '';
    this.candleSVGs.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'candle-img-btn';
      btn.title = c.name;
      btn.innerHTML = c.svg;
      btn.dataset.svgContent = c.svg;
      btn.dataset.name = c.name;
      btn.addEventListener('click', () => {
        if (window.CandleApp) window.CandleApp.addSVGElement(c.svg, c.name);
      });
      grid.appendChild(btn);
    });
  },

  _renderDecorElements() {
    const grid = document.getElementById('elements-grid');
    if (!grid) return;
    grid.innerHTML = '';
    this.decorElements.forEach(el => {
      const btn = document.createElement('button');
      btn.className = 'element-btn';
      btn.title = el.name;
      btn.innerHTML = el.svg;
      btn.dataset.svgContent = el.svg;
      btn.addEventListener('click', () => {
        if (window.CandleApp) window.CandleApp.addSVGElement(el.svg, el.name);
      });
      grid.appendChild(btn);
    });
  },

  _renderBorders() {
    const grid = document.getElementById('borders-grid');
    if (!grid) return;
    grid.innerHTML = '';
    this.borders.forEach(b => {
      const btn = document.createElement('button');
      btn.className = 'element-btn';
      btn.title = b.name;
      const previewSvg = b.generate(50, 50, '#f5a623');
      btn.innerHTML = previewSvg;
      btn.addEventListener('click', () => {
        if (window.CandleApp) window.CandleApp.addBorder(b);
      });
      grid.appendChild(btn);
    });
  },

  _renderScents() {
    const grid = document.getElementById('scents-grid');
    if (!grid) return;
    grid.innerHTML = '';
    this.scents.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'element-btn';
      btn.title = s.name;
      btn.innerHTML = s.svg;
      btn.addEventListener('click', () => {
        if (window.CandleApp) window.CandleApp.addSVGElement(s.svg, s.name);
      });
      grid.appendChild(btn);
    });
  },

  _renderPatterns() {
    const grid = document.getElementById('pattern-grid');
    if (!grid) return;
    grid.innerHTML = '';
    this.patterns.forEach((p, i) => {
      const item = document.createElement('div');
      item.className = 'pattern-item';
      item.title = p.name;
      item.dataset.index = i;
      const svgStr = p.create('#d4a96a', '#fdf3e3', 1.5);
      const blob = new Blob([svgStr], {type: 'image/svg+xml'});
      const url = URL.createObjectURL(blob);
      const img = document.createElement('img');
      img.src = url;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
      item.appendChild(img);
      item.addEventListener('click', () => {
        grid.querySelectorAll('.pattern-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        if (window.CandleApp) window.CandleApp.applyPattern(p);
      });
      grid.appendChild(item);
    });
  }
};
