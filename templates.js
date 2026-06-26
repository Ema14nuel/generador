/**
 * templates.js — Plantillas prediseñadas de stickers de velas
 */

const CandleTemplates = {

  list: [
    // ─────────────────────────────────────
    // CLÁSICAS
    // ─────────────────────────────────────
    {
      id: 'classic-elegance',
      name: 'Elegancia Clásica',
      category: 'classic',
      description: 'Fondo crema con marco dorado',
      primaryColor: '#fdf3e3',
      accentColor: '#c9a84c',
      load(canvas) {
        const w = canvas.width, h = canvas.height;
        canvas.setBackgroundColor('#fdf3e3', canvas.renderAll.bind(canvas));

        // Marco dorado doble
        [0.04, 0.06].forEach((ratio, i) => {
          const m = w * ratio;
          const rect = new fabric.Rect({
            left: m, top: m,
            width: w - m * 2, height: h - m * 2,
            fill: 'transparent',
            stroke: i === 0 ? '#c9a84c' : '#e8d5a3',
            strokeWidth: i === 0 ? 3 : 1,
            rx: 6, ry: 6,
            selectable: true, evented: true
          });
          canvas.add(rect);
        });

        // Línea decorativa superior
        canvas.add(new fabric.Line([w*0.15, h*0.25, w*0.85, h*0.25], {
          stroke: '#c9a84c', strokeWidth: 1, opacity: 0.6,
          selectable: true
        }));
        canvas.add(new fabric.Line([w*0.15, h*0.75, w*0.85, h*0.75], {
          stroke: '#c9a84c', strokeWidth: 1, opacity: 0.6,
          selectable: true
        }));

        // Rombo central decorativo
        canvas.add(new fabric.Text('✦', {
          left: w/2, top: h*0.18,
          fontSize: w * 0.06,
          fill: '#c9a84c',
          originX: 'center', originY: 'center',
          selectable: true
        }));

        // Texto principal
        canvas.add(new fabric.IText('VELA ARTESANAL', {
          left: w/2, top: h * 0.38,
          fontSize: w * 0.072, fontFamily: 'Georgia',
          fill: '#3d2b1f', fontWeight: 'bold',
          textAlign: 'center', originX: 'center', originY: 'center',
          charSpacing: 120,
          selectable: true
        }));

        // Subtítulo
        canvas.add(new fabric.IText('Elaborada con amor', {
          left: w/2, top: h * 0.52,
          fontSize: w * 0.04, fontFamily: 'Georgia',
          fill: '#8b6914', fontStyle: 'italic',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        // Aroma
        canvas.add(new fabric.IText('Aroma: Lavanda & Vainilla', {
          left: w/2, top: h * 0.62,
          fontSize: w * 0.032, fontFamily: 'Georgia',
          fill: '#5a4030',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        // Peso y datos
        canvas.add(new fabric.IText('250g · Cera de soya · Hecho a mano', {
          left: w/2, top: h * 0.82,
          fontSize: w * 0.027, fontFamily: 'Georgia',
          fill: '#8b6914',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.renderAll();
      }
    },

    {
      id: 'classic-minimalist',
      name: 'Minimalista',
      category: 'classic',
      description: 'Diseño limpio y elegante',
      load(canvas) {
        const w = canvas.width, h = canvas.height;
        canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));

        const m = w * 0.08;
        [m, m*1.3].forEach((offset, i) => {
          const len = i === 0 ? 30 : 15;
          [[offset, offset, offset+len, offset], [offset, offset, offset, offset+len],
           [w-offset, offset, w-offset-len, offset], [w-offset, offset, w-offset, offset+len],
           [offset, h-offset, offset+len, h-offset], [offset, h-offset, offset, h-offset-len],
           [w-offset, h-offset, w-offset-len, h-offset], [w-offset, h-offset, w-offset, h-offset-len]
          ].forEach(pts => {
            canvas.add(new fabric.Line(pts, {
              stroke: '#1a1a1a', strokeWidth: i===0 ? 2 : 1,
              selectable: true
            }));
          });
        });

        canvas.add(new fabric.IText('CANDLELIGHT', {
          left: w/2, top: h * 0.35,
          fontSize: w * 0.07, fontFamily: 'Arial',
          fill: '#1a1a1a', fontWeight: 'bold',
          textAlign: 'center', originX: 'center', originY: 'center',
          charSpacing: 200, selectable: true
        }));

        canvas.add(new fabric.Line([w*0.3, h*0.47, w*0.7, h*0.47], {
          stroke: '#1a1a1a', strokeWidth: 1, selectable: true
        }));

        canvas.add(new fabric.IText('artisan candles', {
          left: w/2, top: h * 0.56,
          fontSize: w * 0.038, fontFamily: 'Georgia',
          fill: '#555', fontStyle: 'italic',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.renderAll();
      }
    },

    {
      id: 'classic-rustic',
      name: 'Rústico',
      category: 'classic',
      description: 'Estilo artesanal campestre',
      load(canvas) {
        const w = canvas.width, h = canvas.height;
        canvas.setBackgroundColor('#f5deb3', canvas.renderAll.bind(canvas));

        // Textura de papel (líneas sutiles)
        for (let y = 0; y < h; y += 18) {
          canvas.add(new fabric.Line([0, y, w, y], {
            stroke: '#c9a882', strokeWidth: 0.5, opacity: 0.2,
            selectable: false, evented: false
          }));
        }

        // Marco de madera simulado
        const border = new fabric.Rect({
          left: w*0.05, top: h*0.05,
          width: w*0.9, height: h*0.9,
          fill: 'transparent',
          stroke: '#8b5a2b', strokeWidth: 4,
          strokeDashArray: [12, 4],
          selectable: true
        });
        canvas.add(border);

        canvas.add(new fabric.IText('🕯 Vela Artesanal 🕯', {
          left: w/2, top: h * 0.22,
          fontSize: w * 0.065, fontFamily: 'Georgia',
          fill: '#5c3317', fontWeight: 'bold',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('Hecho con amor\ny cera natural', {
          left: w/2, top: h * 0.48,
          fontSize: w * 0.05, fontFamily: 'Georgia',
          fill: '#6b3a1f', fontStyle: 'italic',
          textAlign: 'center', originX: 'center', originY: 'center',
          lineHeight: 1.4, selectable: true
        }));

        canvas.add(new fabric.IText('~ 100% Natural ~', {
          left: w/2, top: h * 0.72,
          fontSize: w * 0.038, fontFamily: 'Georgia',
          fill: '#8b5a2b',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.renderAll();
      }
    },

    // ─────────────────────────────────────
    // MODERNAS
    // ─────────────────────────────────────
    {
      id: 'modern-dark',
      name: 'Oscuro Elegante',
      category: 'modern',
      description: 'Fondo negro con acentos dorados',
      load(canvas) {
        const w = canvas.width, h = canvas.height;
        canvas.setBackgroundColor('#0d0d0d', canvas.renderAll.bind(canvas));

        // Líneas doradas geométricas
        canvas.add(new fabric.Rect({
          left: w*0.06, top: h*0.06,
          width: w*0.88, height: h*0.88,
          fill: 'transparent',
          stroke: '#c9a84c', strokeWidth: 1,
          selectable: true
        }));

        canvas.add(new fabric.Rect({
          left: w*0.1, top: h*0.1,
          width: w*0.8, height: h*0.8,
          fill: 'transparent',
          stroke: '#c9a84c', strokeWidth: 0.5, opacity: 0.4,
          selectable: true
        }));

        // Línea horizontal central
        canvas.add(new fabric.Line([w*0.12, h*0.45, w*0.88, h*0.45], {
          stroke: '#c9a84c', strokeWidth: 0.8, selectable: true
        }));

        canvas.add(new fabric.IText('LUXE', {
          left: w/2, top: h * 0.25,
          fontSize: w * 0.18, fontFamily: 'Georgia',
          fill: '#c9a84c',
          textAlign: 'center', originX: 'center', originY: 'center',
          charSpacing: 300, fontWeight: 'bold',
          selectable: true
        }));

        canvas.add(new fabric.IText('C A N D L E S', {
          left: w/2, top: h * 0.4,
          fontSize: w * 0.048, fontFamily: 'Arial',
          fill: '#888', charSpacing: 180,
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('PREMIUM · ARTISAN', {
          left: w/2, top: h * 0.6,
          fontSize: w * 0.036, fontFamily: 'Arial',
          fill: '#c9a84c', charSpacing: 100,
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('Soy Wax · Hand Poured · 45hr Burn', {
          left: w/2, top: h * 0.8,
          fontSize: w * 0.028, fontFamily: 'Arial',
          fill: '#666',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.renderAll();
      }
    },

    {
      id: 'modern-gradient',
      name: 'Degradado Moderno',
      category: 'modern',
      description: 'Gradiente rosa-morado vibrante',
      load(canvas) {
        const w = canvas.width, h = canvas.height;

        const grad = new fabric.Gradient({
          type: 'linear',
          gradientUnits: 'pixels',
          coords: { x1: 0, y1: 0, x2: w, y2: h },
          colorStops: [
            { offset: 0, color: '#667eea' },
            { offset: 0.5, color: '#764ba2' },
            { offset: 1, color: '#f093fb' }
          ]
        });

        const bgRect = new fabric.Rect({
          left: 0, top: 0,
          width: w, height: h,
          fill: grad,
          selectable: false, evented: false
        });
        canvas.add(bgRect);
        canvas.sendToBack(bgRect);

        // Círculos decorativos
        [[w*0.15, h*0.1, w*0.25], [w*0.85, h*0.9, w*0.2]].forEach(([cx, cy, r]) => {
          canvas.add(new fabric.Circle({
            left: cx - r, top: cy - r,
            radius: r, fill: 'transparent',
            stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2,
            selectable: true
          }));
        });

        canvas.add(new fabric.IText('✦ Aromática ✦', {
          left: w/2, top: h * 0.22,
          fontSize: w * 0.048, fontFamily: 'Georgia',
          fill: 'rgba(255,255,255,0.8)',
          textAlign: 'center', originX: 'center', originY: 'center',
          fontStyle: 'italic', selectable: true
        }));

        canvas.add(new fabric.IText('VELA DE SOYA', {
          left: w/2, top: h * 0.42,
          fontSize: w * 0.095, fontFamily: 'Arial',
          fill: '#ffffff', fontWeight: 'bold',
          textAlign: 'center', originX: 'center', originY: 'center',
          charSpacing: 80, selectable: true
        }));

        canvas.add(new fabric.Line([w*0.25, h*0.54, w*0.75, h*0.54], {
          stroke: 'rgba(255,255,255,0.5)', strokeWidth: 1, selectable: true
        }));

        canvas.add(new fabric.IText('Rosa · Jazmín · Ylang Ylang', {
          left: w/2, top: h * 0.63,
          fontSize: w * 0.038, fontFamily: 'Georgia',
          fill: 'rgba(255,255,255,0.9)', fontStyle: 'italic',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('200ml · 40 horas', {
          left: w/2, top: h * 0.8,
          fontSize: w * 0.035, fontFamily: 'Arial',
          fill: 'rgba(255,255,255,0.7)',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.renderAll();
      }
    },

    {
      id: 'modern-geometric',
      name: 'Geométrico',
      category: 'modern',
      description: 'Formas geométricas abstractas',
      load(canvas) {
        const w = canvas.width, h = canvas.height;
        canvas.setBackgroundColor('#1a1a2e', canvas.renderAll.bind(canvas));

        // Triángulos decorativos
        const triangles = [
          { pts: [0,0, w*0.4,0, 0,h*0.4], color: '#16213e' },
          { pts: [w,h, w*0.6,h, w,h*0.6], color: '#16213e' },
          { pts: [w*0.6,0, w,0, w,h*0.35], color: '#0f3460' },
        ];
        triangles.forEach(t => {
          const poly = new fabric.Polygon(
            t.pts.reduce((acc,v,i) => {
              if(i%2===0) acc.push({x:v, y:0}); else acc[acc.length-1].y=v;
              return acc;
            }, []),
            { fill: t.color, selectable: true }
          );
          canvas.add(poly);
        });

        canvas.add(new fabric.Text('GEO', {
          left: w/2, top: h * 0.2,
          fontSize: w * 0.2, fontFamily: 'Arial',
          fill: 'rgba(255,255,255,0.04)', fontWeight: 'bold',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: false
        }));

        canvas.add(new fabric.IText('CANDLE CO.', {
          left: w/2, top: h * 0.38,
          fontSize: w * 0.065, fontFamily: 'Arial',
          fill: '#e94560', fontWeight: 'bold', charSpacing: 150,
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('Diseño exclusivo', {
          left: w/2, top: h * 0.52,
          fontSize: w * 0.038, fontFamily: 'Arial',
          fill: '#9090b0',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        // Acento línea
        canvas.add(new fabric.Rect({
          left: w*0.35, top: h*0.6,
          width: w*0.3, height: 3,
          fill: '#e94560', rx: 2, selectable: true
        }));

        canvas.add(new fabric.IText('Cedro · Musgo · Ámbar', {
          left: w/2, top: h * 0.72,
          fontSize: w * 0.036, fontFamily: 'Arial',
          fill: '#c0c0d0',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.renderAll();
      }
    },

    // ─────────────────────────────────────
    // NATURALEZA
    // ─────────────────────────────────────
    {
      id: 'nature-botanical',
      name: 'Botánico',
      category: 'nature',
      description: 'Inspirado en la naturaleza',
      load(canvas) {
        const w = canvas.width, h = canvas.height;
        canvas.setBackgroundColor('#f0f7ee', canvas.renderAll.bind(canvas));

        // Marco de hojas (círculo decorativo)
        canvas.add(new fabric.Circle({
          left: w*0.1, top: h*0.1,
          radius: w*0.4,
          fill: 'transparent',
          stroke: '#4caf50', strokeWidth: 1.5, opacity: 0.4,
          selectable: true
        }));

        // Texto título
        canvas.add(new fabric.IText('Botanica', {
          left: w/2, top: h * 0.25,
          fontSize: w * 0.1, fontFamily: 'Georgia',
          fill: '#2e7d32', fontStyle: 'italic', fontWeight: 'bold',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('VELA NATURAL', {
          left: w/2, top: h * 0.4,
          fontSize: w * 0.048, fontFamily: 'Arial',
          fill: '#388e3c', charSpacing: 150,
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('🌿 · 🌸 · 🍃', {
          left: w/2, top: h * 0.54,
          fontSize: w * 0.06,
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('Eucalipto · Menta · Romero', {
          left: w/2, top: h * 0.67,
          fontSize: w * 0.038, fontFamily: 'Georgia',
          fill: '#558b2f', fontStyle: 'italic',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('Cera orgánica de abeja · 180g', {
          left: w/2, top: h * 0.82,
          fontSize: w * 0.03, fontFamily: 'Arial',
          fill: '#689f38',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.renderAll();
      }
    },

    {
      id: 'nature-ocean',
      name: 'Océano',
      category: 'nature',
      description: 'Brisa marina y colores del mar',
      load(canvas) {
        const w = canvas.width, h = canvas.height;

        const grad = new fabric.Gradient({
          type: 'linear',
          gradientUnits: 'pixels',
          coords: { x1: 0, y1: 0, x2: 0, y2: h },
          colorStops: [
            { offset: 0, color: '#e0f4ff' },
            { offset: 0.5, color: '#b3e5fc' },
            { offset: 1, color: '#81d4fa' }
          ]
        });

        const bgRect = new fabric.Rect({
          left: 0, top: 0, width: w, height: h,
          fill: grad, selectable: false, evented: false
        });
        canvas.add(bgRect);

        // Ondas
        for (let i = 0; i < 3; i++) {
          const y = h * (0.7 + i * 0.08);
          canvas.add(new fabric.Path(
            `M 0 ${y} Q ${w*0.25} ${y-12} ${w*0.5} ${y} Q ${w*0.75} ${y+12} ${w} ${y}`,
            { fill: 'rgba(30,136,229,0.15)', stroke: 'none', selectable: true }
          ));
        }

        canvas.add(new fabric.Text('⚓', {
          left: w/2, top: h * 0.15,
          fontSize: w * 0.12,
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('BRISA MARINA', {
          left: w/2, top: h * 0.35,
          fontSize: w * 0.075, fontFamily: 'Arial',
          fill: '#01579b', fontWeight: 'bold', charSpacing: 100,
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('Vela Aromática', {
          left: w/2, top: h * 0.49,
          fontSize: w * 0.045, fontFamily: 'Georgia',
          fill: '#0277bd', fontStyle: 'italic',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('Sal marina · Coco · Brisa\nCera de soya · 220g', {
          left: w/2, top: h * 0.65,
          fontSize: w * 0.032, fontFamily: 'Arial',
          fill: '#0288d1',
          textAlign: 'center', originX: 'center', originY: 'center',
          lineHeight: 1.5, selectable: true
        }));

        canvas.renderAll();
      }
    },

    // ─────────────────────────────────────
    // LUJO
    // ─────────────────────────────────────
    {
      id: 'luxury-gold',
      name: 'Oro Puro',
      category: 'luxury',
      description: 'Máximo lujo en negro y oro',
      load(canvas) {
        const w = canvas.width, h = canvas.height;
        canvas.setBackgroundColor('#0a0a0a', canvas.renderAll.bind(canvas));

        // Fondo con brillo sutil
        canvas.add(new fabric.Rect({
          left: 0, top: 0, width: w, height: h,
          fill: new fabric.Gradient({
            type: 'radial',
            gradientUnits: 'pixels',
            coords: { r1: 0, r2: w*0.7, x1: w/2, y1: h/2, x2: w/2, y2: h/2 },
            colorStops: [
              { offset: 0, color: '#1a1400' },
              { offset: 1, color: '#000000' }
            ]
          }),
          selectable: false, evented: false
        }));

        // Marcos dorados
        [[0.04,3], [0.07,0.8], [0.09,0.4]].forEach(([ratio, sw]) => {
          const m = w * ratio;
          canvas.add(new fabric.Rect({
            left: m, top: m,
            width: w - m*2, height: h - m*2,
            fill: 'transparent',
            stroke: '#c9a84c', strokeWidth: sw,
            selectable: true
          }));
        });

        canvas.add(new fabric.Text('✦', {
          left: w/2, top: h*0.18,
          fontSize: w * 0.07, fill: '#c9a84c',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('MAISON', {
          left: w/2, top: h * 0.33,
          fontSize: w * 0.11, fontFamily: 'Georgia',
          fill: '#c9a84c', charSpacing: 300,
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('de Bougies', {
          left: w/2, top: h * 0.46,
          fontSize: w * 0.055, fontFamily: 'Georgia',
          fill: '#e8d5a3', fontStyle: 'italic',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.Line([w*0.2, h*0.56, w*0.8, h*0.56], {
          stroke: '#c9a84c', strokeWidth: 0.8, selectable: true
        }));

        canvas.add(new fabric.IText('COLLECTION PRIVÉE', {
          left: w/2, top: h * 0.66,
          fontSize: w * 0.036, fontFamily: 'Arial',
          fill: '#888', charSpacing: 150,
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('Oud · Rose · Ambre · Patchouli', {
          left: w/2, top: h * 0.78,
          fontSize: w * 0.03, fontFamily: 'Georgia',
          fill: '#666', fontStyle: 'italic',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.renderAll();
      }
    },

    {
      id: 'luxury-marble',
      name: 'Mármol',
      category: 'luxury',
      description: 'Textura mármol con letras negras',
      load(canvas) {
        const w = canvas.width, h = canvas.height;
        canvas.setBackgroundColor('#f5f5f0', canvas.renderAll.bind(canvas));

        // Venas de mármol simuladas
        const veins = [
          `M ${w*0.1} 0 Q ${w*0.4} ${h*0.3} ${w*0.6} ${h*0.5} Q ${w*0.8} ${h*0.7} ${w} ${h*0.9}`,
          `M ${w*0.4} 0 Q ${w*0.2} ${h*0.2} ${w*0.5} ${h*0.4} Q ${w*0.7} ${h*0.6} ${w*0.9} ${h}`,
          `M 0 ${h*0.3} Q ${w*0.3} ${h*0.4} ${w*0.5} ${h*0.6} Q ${w*0.6} ${h*0.8} ${w*0.8} ${h}`,
        ];
        veins.forEach((d, i) => {
          canvas.add(new fabric.Path(d, {
            fill: 'none',
            stroke: i%2===0 ? 'rgba(150,140,130,0.25)' : 'rgba(180,170,160,0.15)',
            strokeWidth: i%2===0 ? 2 : 1,
            selectable: false, evented: false
          }));
        });

        canvas.add(new fabric.Rect({
          left: w*0.06, top: h*0.06,
          width: w*0.88, height: h*0.88,
          fill: 'transparent',
          stroke: '#2c2c2c', strokeWidth: 2, selectable: true
        }));

        canvas.add(new fabric.IText('MARBRE', {
          left: w/2, top: h * 0.25,
          fontSize: w * 0.13, fontFamily: 'Georgia',
          fill: '#1a1a1a', charSpacing: 200,
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.Line([w*0.2, h*0.38, w*0.8, h*0.38], {
          stroke: '#1a1a1a', strokeWidth: 1, selectable: true
        }));

        canvas.add(new fabric.IText('Candle & Parfum', {
          left: w/2, top: h * 0.5,
          fontSize: w * 0.048, fontFamily: 'Georgia',
          fill: '#333', fontStyle: 'italic',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('Bergamota · Vetiver · Incienso', {
          left: w/2, top: h * 0.65,
          fontSize: w * 0.032, fontFamily: 'Georgia',
          fill: '#555',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('300g · Cera virgen', {
          left: w/2, top: h * 0.82,
          fontSize: w * 0.028, fontFamily: 'Arial',
          fill: '#777',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.renderAll();
      }
    },

    {
      id: 'luxury-rose',
      name: 'Rose Gold',
      category: 'luxury',
      description: 'Rosa dorado femenino y elegante',
      load(canvas) {
        const w = canvas.width, h = canvas.height;

        const grad = new fabric.Gradient({
          type: 'linear',
          gradientUnits: 'pixels',
          coords: { x1: 0, y1: 0, x2: w, y2: h },
          colorStops: [
            { offset: 0, color: '#fff5f5' },
            { offset: 0.5, color: '#ffe0e8' },
            { offset: 1, color: '#ffd6e7' }
          ]
        });

        const bgRect = new fabric.Rect({
          left: 0, top: 0, width: w, height: h,
          fill: grad, selectable: false, evented: false
        });
        canvas.add(bgRect);

        // Marco rose gold
        [[0.04,2.5,'#c9748a'], [0.07,0.8,'#e0a0b0']].forEach(([r, sw, col]) => {
          const m = w * r;
          canvas.add(new fabric.Rect({
            left: m, top: m,
            width: w-m*2, height: h-m*2,
            fill: 'transparent', stroke: col,
            strokeWidth: sw, selectable: true
          }));
        });

        canvas.add(new fabric.Text('✿', {
          left: w/2, top: h*0.17,
          fontSize: w * 0.09, fill: '#c9748a',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('ROSE', {
          left: w/2, top: h * 0.31,
          fontSize: w * 0.13, fontFamily: 'Georgia',
          fill: '#8b3a52', charSpacing: 250, fontWeight: 'bold',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('& Santal', {
          left: w/2, top: h * 0.44,
          fontSize: w * 0.055, fontFamily: 'Georgia',
          fill: '#b06070', fontStyle: 'italic',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('✦ Vela de Soya Premium ✦', {
          left: w/2, top: h * 0.61,
          fontSize: w * 0.036, fontFamily: 'Georgia',
          fill: '#c9748a',
          textAlign: 'center', originX: 'center', originY: 'center',
          selectable: true
        }));

        canvas.add(new fabric.IText('Rosa búlgara · Sándalo · Pachulí\n200ml · 50 horas de armonía', {
          left: w/2, top: h * 0.78,
          fontSize: w * 0.03, fontFamily: 'Georgia',
          fill: '#9a6070', fontStyle: 'italic',
          textAlign: 'center', originX: 'center', originY: 'center',
          lineHeight: 1.5, selectable: true
        }));

        canvas.renderAll();
      }
    }
  ],

  // Renderizar las tarjetas de plantillas en el modal
  renderTemplates(container, filter = 'all') {
    container.innerHTML = '';
    const filtered = filter === 'all'
      ? this.list
      : this.list.filter(t => t.category === filter);

    filtered.forEach(tpl => {
      const card = document.createElement('div');
      card.className = 'template-card';
      card.dataset.id = tpl.id;

      // Miniatura generada con un canvas temporal
      const previewDiv = document.createElement('div');
      previewDiv.className = 'template-preview';
      const previewCanvas = document.createElement('canvas');
      previewCanvas.width = 200;
      previewCanvas.height = 200;
      previewDiv.appendChild(previewCanvas);

      const info = document.createElement('div');
      info.className = 'template-info';
      info.innerHTML = `<h4>${tpl.name}</h4><p>${tpl.description}</p>`;

      card.appendChild(previewDiv);
      card.appendChild(info);
      container.appendChild(card);

      // Generar preview async
      setTimeout(() => {
        try {
          const fc = new fabric.Canvas(previewCanvas, {
            width: 200, height: 200,
            renderOnAddRemove: false
          });
          tpl.load(fc);
          fc.renderAll();
        } catch(e) {
          previewCanvas.getContext('2d').fillStyle = tpl.primaryColor || '#fdf3e3';
          previewCanvas.getContext('2d').fillRect(0,0,200,200);
        }
      }, 100);

      card.addEventListener('click', () => {
        if (window.CandleApp) {
          window.CandleApp.loadTemplate(tpl);
          document.getElementById('modal-templates').classList.add('hidden');
        }
      });
    });
  }
};
