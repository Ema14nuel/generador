/**
 * app.js — Núcleo de la aplicación CandleSticker
 * Gestiona el canvas Fabric.js, herramientas, capas, exportación y plantillas
 */

const CandleApp = (() => {

  // ── ESTADO ────────────────────────────────────────────────────────────────
  let canvas = null;
  let currentBgType = 'solid';
  let currentFormat = 'png';
  let currentGradDir = 'horizontal';
  let zoom = 1;
  let history = [];
  let historyIndex = -1;
  let isSaving = false;
  let gridVisible = false;
  let bleedVisible = false;
  let snapToGrid = false;
  let gridSize = 30;
  let activePattern = null;
  let selectedObjOpacity = 100;

  const SIZES = {
    '4x2': { w: 1200, h: 600, label: '4×2 pulg · 300 DPI · 1200×600 px' },
    '3x3': { w: 900, h: 900, label: '3×3 pulg · 300 DPI · 900×900 px' },
    '2x2': { w: 600, h: 600, label: '2×2 pulg · 300 DPI · 600×600 px' },
    '5x2': { w: 1500, h: 600, label: '5×2 pulg · 300 DPI · 1500×600 px' },
  };

  const PRESET_TEXTS = [
    { label: 'Vela Artesanal', text: 'Vela Artesanal\nHecho con amor' },
    { label: 'Aromaterapia', text: '✦ Aromaterapia ✦\nRelaxing & Healing' },
    { label: 'Nombre + Aroma', text: 'Aroma:\nLavanda & Vainilla' },
    { label: 'Datos técnicos', text: '250g · Cera de soya\n45 horas de quemado' },
    { label: 'Cuidado', text: '⚠ Instrucciones:\nUsar con precaución' },
    { label: 'Regalo', text: '🎁 Con todo mi amor\nPara ti' },
  ];

  // ── INIT ──────────────────────────────────────────────────────────────────
  function init() {
    const size = SIZES['3x3'];
    canvas = new fabric.Canvas('main-canvas', {
      width: size.w,
      height: size.h,
      backgroundColor: '#fdf3e3',
      preserveObjectStacking: true,
      selection: true,
    });

    document.getElementById('canvas-w').value = size.w;
    document.getElementById('canvas-h').value = size.h;
    document.getElementById('canvas-size-label').textContent = size.label;

    _setupZoom();
    _setupEventListeners();
    _setupTabSwitching();
    _setupBackground();
    _setupTextPanel();
    _setupImageUpload();
    _setupShapes();
    _setupLayerPanel();
    _setupExport();
    _setupCanvasToolbar();
    _setupModals();
    _setupGuides();
    _setupKeyboardShortcuts();
    _renderPresetTexts();

    // Inicializar elementos y plantillas
    CandleElements.init();
    _renderTemplatesModal();

    // Guardar estado inicial
    saveHistory();
    zoomFit();

    showToast('¡Bienvenido a CandleSticker! Elige una plantilla o empieza desde cero.', 'success');
  }

  // ── HISTORIA (UNDO/REDO) ──────────────────────────────────────────────────
  function saveHistory() {
    if (isSaving) return;
    isSaving = true;
    const json = JSON.stringify(canvas.toJSON(['id', 'name', 'layerType']));
    history = history.slice(0, historyIndex + 1);
    history.push(json);
    if (history.length > 30) history.shift();
    historyIndex = history.length - 1;
    isSaving = false;
    _updateLayerList();
  }

  function undo() {
    if (historyIndex <= 0) return;
    historyIndex--;
    _restoreState(history[historyIndex]);
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    historyIndex++;
    _restoreState(history[historyIndex]);
  }

  function _restoreState(json) {
    canvas.loadFromJSON(json, () => {
      canvas.renderAll();
      _updateLayerList();
    });
  }

  // ── ZOOM ──────────────────────────────────────────────────────────────────
  function _setupZoom() {
    document.getElementById('btn-zoom-in').addEventListener('click', () => setZoom(zoom + 0.1));
    document.getElementById('btn-zoom-out').addEventListener('click', () => setZoom(zoom - 0.1));
    document.getElementById('btn-zoom-fit').addEventListener('click', zoomFit);
  }

  function setZoom(z) {
    zoom = Math.min(Math.max(z, 0.1), 4);
    const frame = document.getElementById('canvas-frame');
    frame.style.transform = `scale(${zoom})`;
    frame.style.transformOrigin = 'center center';
    document.getElementById('zoom-label').textContent = `${Math.round(zoom * 100)}%`;
  }

  function zoomFit() {
    const wrapper = document.getElementById('canvas-wrapper');
    const frame = document.getElementById('canvas-frame');
    const availW = wrapper.clientWidth - 48;
    const availH = wrapper.clientHeight - 48;
    const scaleW = availW / canvas.width;
    const scaleH = availH / canvas.height;
    setZoom(Math.min(scaleW, scaleH, 1));
  }

  // ── EVENT LISTENERS CANVAS ────────────────────────────────────────────────
  function _setupEventListeners() {
    canvas.on('object:modified', saveHistory);
    canvas.on('object:added', () => { saveHistory(); _updateLayerList(); });
    canvas.on('object:removed', () => { saveHistory(); _updateLayerList(); });

    canvas.on('selection:created', _onSelectionChange);
    canvas.on('selection:updated', _onSelectionChange);
    canvas.on('selection:cleared', () => {
      document.getElementById('selection-info').textContent = '';
      document.getElementById('selected-obj-panel').classList.add('hidden');
    });

    // Snap to grid
    canvas.on('object:moving', e => {
      if (!snapToGrid) return;
      const obj = e.target;
      obj.set({
        left: Math.round(obj.left / gridSize) * gridSize,
        top: Math.round(obj.top / gridSize) * gridSize,
      });
    });
  }

  function _onSelectionChange() {
    const obj = canvas.getActiveObject();
    if (!obj) return;

    let info = '';
    if (obj.type === 'i-text' || obj.type === 'text') info = `Texto · ${Math.round(obj.width)}×${Math.round(obj.height)}px`;
    else if (obj.type === 'image') info = `Imagen · ${Math.round(obj.width * obj.scaleX)}×${Math.round(obj.height * obj.scaleY)}px`;
    else info = `${obj.type} · ${Math.round(obj.width)}×${Math.round(obj.height)}px`;
    document.getElementById('selection-info').textContent = info;

    // Mostrar panel de objeto seleccionado
    const panel = document.getElementById('selected-obj-panel');
    panel.classList.remove('hidden');
    const opSlider = document.getElementById('obj-opacity');
    opSlider.value = Math.round((obj.opacity || 1) * 100);
    document.getElementById('obj-opacity-val').textContent = opSlider.value + '%';
    const rotSlider = document.getElementById('obj-rotation');
    rotSlider.value = Math.round(obj.angle || 0);
    document.getElementById('obj-rotation-val').textContent = rotSlider.value + '°';

    _updateLayerList();
  }

  // ── TAB SWITCHING ─────────────────────────────────────────────────────────
  function _setupTabSwitching() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.remove('hidden');
      });
    });
  }

  // ── FONDO ─────────────────────────────────────────────────────────────────
  function _setupBackground() {
    // Selector tipo de fondo
    document.querySelectorAll('.bg-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.bg-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentBgType = btn.dataset.type;
        document.querySelectorAll('.bg-section').forEach(s => s.classList.add('hidden'));
        document.getElementById(`bg-${currentBgType}`).classList.remove('hidden');
      });
    });

    // Color sólido
    const bgColor = document.getElementById('bg-color');
    const bgHex = document.getElementById('bg-color-hex');
    bgColor.addEventListener('input', () => {
      bgHex.value = bgColor.value;
      canvas.setBackgroundColor(bgColor.value, canvas.renderAll.bind(canvas));
      saveHistory();
    });
    bgHex.addEventListener('change', () => {
      if (/^#[0-9a-f]{6}$/i.test(bgHex.value)) {
        bgColor.value = bgHex.value;
        canvas.setBackgroundColor(bgHex.value, canvas.renderAll.bind(canvas));
        saveHistory();
      }
    });

    // Colores rápidos
    document.getElementById('bg-quick-colors').addEventListener('click', e => {
      const qc = e.target.closest('.qc');
      if (!qc) return;
      const color = qc.dataset.color;
      bgColor.value = color;
      bgHex.value = color;
      canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
      saveHistory();
    });

    // Degradado
    document.getElementById('grad-color1').addEventListener('input', _syncGradHex);
    document.getElementById('grad-color2').addEventListener('input', _syncGradHex);
    document.getElementById('grad-hex1').addEventListener('change', () => {
      document.getElementById('grad-color1').value = document.getElementById('grad-hex1').value;
    });
    document.getElementById('grad-hex2').addEventListener('change', () => {
      document.getElementById('grad-color2').value = document.getElementById('grad-hex2').value;
    });

    document.querySelectorAll('.dir-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.dir-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentGradDir = btn.dataset.dir;
      });
    });

    document.getElementById('apply-gradient').addEventListener('click', applyGradient);

    // Imagen de fondo
    const bgUpload = document.getElementById('bg-image-input');
    document.getElementById('bg-upload-area').addEventListener('click', () => bgUpload.click());
    bgUpload.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        fabric.Image.fromURL(ev.target.result, img => {
          const scaleX = canvas.width / img.width;
          const scaleY = canvas.height / img.height;
          const scale = Math.max(scaleX, scaleY);
          img.scale(scale);
          img.set({ left: (canvas.width - img.width * scale) / 2, top: (canvas.height - img.height * scale) / 2 });
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
          saveHistory();
        });
      };
      reader.readAsDataURL(file);
    });

    const bgOpacity = document.getElementById('bg-opacity');
    bgOpacity.addEventListener('input', () => {
      document.getElementById('bg-opacity-val').textContent = bgOpacity.value + '%';
      const bi = canvas.backgroundImage;
      if (bi) { bi.set('opacity', bgOpacity.value / 100); canvas.renderAll(); }
    });

    // Propiedades de objeto seleccionado
    const objOpacity = document.getElementById('obj-opacity');
    objOpacity.addEventListener('input', () => {
      const val = objOpacity.value / 100;
      document.getElementById('obj-opacity-val').textContent = objOpacity.value + '%';
      const obj = canvas.getActiveObject();
      if (obj) { obj.set('opacity', val); canvas.renderAll(); }
    });
    objOpacity.addEventListener('change', saveHistory);

    const objRotation = document.getElementById('obj-rotation');
    objRotation.addEventListener('input', () => {
      const val = parseInt(objRotation.value);
      document.getElementById('obj-rotation-val').textContent = val + '°';
      const obj = canvas.getActiveObject();
      if (obj) { obj.set('angle', val); canvas.renderAll(); }
    });
    objRotation.addEventListener('change', saveHistory);
  }

  function _syncGradHex() {
    document.getElementById('grad-hex1').value = document.getElementById('grad-color1').value;
    document.getElementById('grad-hex2').value = document.getElementById('grad-color2').value;
  }

  function applyGradient() {
    const c1 = document.getElementById('grad-color1').value;
    const c2 = document.getElementById('grad-color2').value;
    const w = canvas.width, h = canvas.height;

    let coords;
    if (currentGradDir === 'horizontal') coords = { x1: 0, y1: 0, x2: w, y2: 0 };
    else if (currentGradDir === 'vertical') coords = { x1: 0, y1: 0, x2: 0, y2: h };
    else if (currentGradDir === 'diagonal') coords = { x1: 0, y1: 0, x2: w, y2: h };
    else { // radial
      const bgRect = new fabric.Rect({
        left: 0, top: 0, width: w, height: h,
        fill: new fabric.Gradient({
          type: 'radial',
          gradientUnits: 'pixels',
          coords: { r1: 0, r2: w * 0.7, x1: w/2, y1: h/2, x2: w/2, y2: h/2 },
          colorStops: [{ offset: 0, color: c1 }, { offset: 1, color: c2 }]
        }),
        selectable: false, evented: false, name: '__bg_gradient__'
      });
      _removeBgGradient();
      canvas.add(bgRect);
      canvas.sendToBack(bgRect);
      canvas.setBackgroundColor('transparent', canvas.renderAll.bind(canvas));
      saveHistory();
      return;
    }

    const bgRect = new fabric.Rect({
      left: 0, top: 0, width: w, height: h,
      fill: new fabric.Gradient({
        type: 'linear',
        gradientUnits: 'pixels',
        coords,
        colorStops: [{ offset: 0, color: c1 }, { offset: 1, color: c2 }]
      }),
      selectable: false, evented: false, name: '__bg_gradient__'
    });
    _removeBgGradient();
    canvas.add(bgRect);
    canvas.sendToBack(bgRect);
    canvas.setBackgroundColor('transparent', canvas.renderAll.bind(canvas));
    saveHistory();
  }

  function _removeBgGradient() {
    const existing = canvas.getObjects().find(o => o.name === '__bg_gradient__');
    if (existing) canvas.remove(existing);
  }

  function applyPattern(patternDef) {
    const color = document.getElementById('pattern-color').value;
    const bgColor = document.getElementById('pattern-bg-color').value;
    const scale = parseFloat(document.getElementById('pattern-scale').value);

    const svgStr = patternDef.create(color, bgColor, scale);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    fabric.Image.fromURL(url, img => {
      const pattern = new fabric.Pattern({
        source: img.getElement(),
        repeat: 'repeat'
      });
      _removeBgGradient();
      canvas.setBackgroundColor(pattern, canvas.renderAll.bind(canvas));
      saveHistory();
    });
  }

  document.getElementById('pattern-scale').addEventListener('input', function() {
    document.getElementById('pattern-scale-val').textContent = this.value + '×';
  });

  // ── TEXTO ─────────────────────────────────────────────────────────────────
  function _setupTextPanel() {
    // Botones de estilo
    ['bold','italic','underline'].forEach(style => {
      const btn = document.getElementById(`text-${style}`);
      btn.addEventListener('click', () => btn.classList.toggle('active'));
    });

    // Alineación
    ['left','center','right'].forEach(align => {
      document.getElementById(`align-${align}`).addEventListener('click', () => {
        ['left','center','right'].forEach(a => document.getElementById(`align-${a}`).classList.remove('active'));
        document.getElementById(`align-${align}`).classList.add('active');
      });
    });

    // Sliders
    document.getElementById('letter-spacing').addEventListener('input', function() {
      document.getElementById('letter-spacing-val').textContent = this.value;
    });
    document.getElementById('line-height').addEventListener('input', function() {
      document.getElementById('line-height-val').textContent = parseFloat(this.value).toFixed(1);
    });

    // Sombra
    document.getElementById('text-shadow').addEventListener('change', function() {
      document.getElementById('shadow-opts').classList.toggle('hidden', !this.checked);
    });
    document.getElementById('shadow-blur').addEventListener('input', function() {
      document.getElementById('shadow-blur-label').value = `Blur: ${this.value}px`;
    });

    // Contorno
    document.getElementById('text-stroke').addEventListener('change', function() {
      document.getElementById('stroke-opts').classList.toggle('hidden', !this.checked);
    });

    // Agregar texto
    document.getElementById('btn-add-text').addEventListener('click', addText);
  }

  function addText(textStr) {
    const text = typeof textStr === 'string' ? textStr : (document.getElementById('text-input').value || 'Texto de ejemplo');
    const font = document.getElementById('font-family').value;
    const size = parseInt(document.getElementById('font-size').value);
    const color = document.getElementById('text-color').value;
    const isBold = document.getElementById('text-bold').classList.contains('active');
    const isItalic = document.getElementById('text-italic').classList.contains('active');
    const isUnderline = document.getElementById('text-underline').classList.contains('active');
    const align = ['left','center','right'].find(a => document.getElementById(`align-${a}`).classList.contains('active')) || 'center';
    const charSpacing = parseInt(document.getElementById('letter-spacing').value) * 10;
    const lineHeight = parseFloat(document.getElementById('line-height').value);
    const hasShadow = document.getElementById('text-shadow').checked;
    const hasStroke = document.getElementById('text-stroke').checked;

    const opts = {
      left: canvas.width / 2,
      top: canvas.height / 2,
      fontSize: size,
      fontFamily: font,
      fill: color,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      underline: isUnderline,
      textAlign: align,
      charSpacing,
      lineHeight,
      originX: 'center',
      originY: 'center',
    };

    if (hasShadow) {
      opts.shadow = new fabric.Shadow({
        color: document.getElementById('shadow-color').value,
        blur: parseInt(document.getElementById('shadow-blur').value),
        offsetX: 2, offsetY: 2
      });
    }
    if (hasStroke) {
      opts.stroke = document.getElementById('stroke-color').value;
      opts.strokeWidth = parseInt(document.getElementById('stroke-width').value);
    }

    const itext = new fabric.IText(text, opts);
    canvas.add(itext);
    canvas.setActiveObject(itext);
    canvas.renderAll();
    saveHistory();
  }

  function _renderPresetTexts() {
    const container = document.getElementById('preset-texts');
    PRESET_TEXTS.forEach(pt => {
      const btn = document.createElement('button');
      btn.className = 'preset-text-btn';
      btn.textContent = pt.label;
      btn.addEventListener('click', () => {
        document.getElementById('text-input').value = pt.text;
        addText(pt.text);
      });
      container.appendChild(btn);
    });
  }

  // ── IMAGEN ────────────────────────────────────────────────────────────────
  function _setupImageUpload() {
    const imgInput = document.getElementById('img-input');
    document.getElementById('img-upload-area').addEventListener('click', () => imgInput.click());
    imgInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        fabric.Image.fromURL(ev.target.result, img => {
          const maxW = canvas.width * 0.6;
          const maxH = canvas.height * 0.6;
          if (img.width > maxW || img.height > maxH) {
            const scale = Math.min(maxW / img.width, maxH / img.height);
            img.scale(scale);
          }
          img.set({ left: canvas.width / 2, top: canvas.height / 2, originX: 'center', originY: 'center' });
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          saveHistory();
        });
      };
      reader.readAsDataURL(file);
    });

    // Drag & drop en toda el área del canvas
    const wrapper = document.getElementById('canvas-wrapper');
    wrapper.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
    wrapper.addEventListener('drop', e => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = ev => {
        fabric.Image.fromURL(ev.target.result, img => {
          const maxW = canvas.width * 0.7;
          if (img.width > maxW) img.scale(maxW / img.width);
          img.set({ left: canvas.width / 2, top: canvas.height / 2, originX: 'center', originY: 'center' });
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          saveHistory();
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // ── ELEMENTOS SVG ─────────────────────────────────────────────────────────
  function addSVGElement(svgStr, name) {
    fabric.loadSVGFromString(svgStr, (objects, options) => {
      const group = fabric.util.groupSVGElements(objects, options);
      const maxSize = Math.min(canvas.width, canvas.height) * 0.3;
      const scale = maxSize / Math.max(group.width, group.height);
      group.scale(scale);
      group.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
        name: name || 'SVG Element'
      });
      canvas.add(group);
      canvas.setActiveObject(group);
      canvas.renderAll();
      saveHistory();
    });
  }

  function addBorder(borderDef) {
    const svgStr = borderDef.generate(canvas.width, canvas.height, '#c9a84c');
    fabric.loadSVGFromString(svgStr, (objects, options) => {
      const group = fabric.util.groupSVGElements(objects, options);
      group.set({
        left: 0, top: 0,
        selectable: true,
        name: `Borde: ${borderDef.name}`
      });
      canvas.add(group);
      canvas.sendToBack(group);
      canvas.renderAll();
      saveHistory();
    });
  }

  // ── FORMAS ────────────────────────────────────────────────────────────────
  function _setupShapes() {
    document.getElementById('shape-opacity').addEventListener('input', function() {
      document.getElementById('shape-opacity-val').textContent = this.value + '%';
    });

    document.querySelectorAll('.shape-btn').forEach(btn => {
      btn.addEventListener('click', () => addShape(btn.dataset.shape));
    });
  }

  function addShape(type) {
    const fill = document.getElementById('shape-fill').value;
    const stroke = document.getElementById('shape-stroke').value;
    const strokeWidth = parseInt(document.getElementById('shape-stroke-width').value);
    const opacity = parseInt(document.getElementById('shape-opacity').value) / 100;
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const size = Math.min(canvas.width, canvas.height) * 0.2;

    const base = { fill, stroke, strokeWidth, opacity, originX: 'center', originY: 'center', left: cx, top: cy };
    let obj;

    switch(type) {
      case 'rect':
        obj = new fabric.Rect({ ...base, width: size * 1.5, height: size }); break;
      case 'circle':
        obj = new fabric.Circle({ ...base, radius: size / 2 }); break;
      case 'triangle':
        obj = new fabric.Triangle({ ...base, width: size, height: size }); break;
      case 'line':
        obj = new fabric.Line([cx - size, cy, cx + size, cy], {
          stroke, strokeWidth: strokeWidth || 3, opacity
        }); break;
      case 'star': {
        const pts = _starPoints(cx, cy, 5, size/2, size/4);
        obj = new fabric.Polygon(pts, { ...base }); break;
      }
      case 'heart': {
        const path = `M ${cx} ${cy+size*0.4} C ${cx} ${cy+size*0.4} ${cx-size*0.6} ${cy} ${cx-size*0.6} ${cy-size*0.2} C ${cx-size*0.6} ${cy-size*0.55} ${cx} ${cy-size*0.55} ${cx} ${cy-size*0.2} C ${cx} ${cy-size*0.55} ${cx+size*0.6} ${cy-size*0.55} ${cx+size*0.6} ${cy-size*0.2} C ${cx+size*0.6} ${cy} ${cx} ${cy+size*0.4} ${cx} ${cy+size*0.4} Z`;
        obj = new fabric.Path(path, { fill, stroke, strokeWidth, opacity }); break;
      }
    }
    if (obj) {
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.renderAll();
      saveHistory();
    }
  }

  function _starPoints(cx, cy, numPoints, outerR, innerR) {
    const pts = [];
    for (let i = 0; i < numPoints * 2; i++) {
      const angle = (i * Math.PI / numPoints) - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      pts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
    return pts;
  }

  // ── PANEL DE CAPAS ────────────────────────────────────────────────────────
  function _setupLayerPanel() {
    document.getElementById('btn-layer-up').addEventListener('click', () => {
      const obj = canvas.getActiveObject();
      if (obj) { canvas.bringForward(obj); saveHistory(); _updateLayerList(); }
    });
    document.getElementById('btn-layer-down').addEventListener('click', () => {
      const obj = canvas.getActiveObject();
      if (obj) { canvas.sendBackwards(obj); saveHistory(); _updateLayerList(); }
    });
    document.getElementById('btn-layer-delete').addEventListener('click', () => {
      const obj = canvas.getActiveObject();
      if (obj) { canvas.remove(obj); saveHistory(); _updateLayerList(); }
    });

    // Canvas size
    document.getElementById('btn-apply-size').addEventListener('click', () => {
      const w = parseInt(document.getElementById('canvas-w').value);
      const h = parseInt(document.getElementById('canvas-h').value);
      if (w && h) resizeCanvas(w, h);
    });
  }

  function _updateLayerList() {
    const list = document.getElementById('layers-list');
    const objects = canvas.getObjects();
    const active = canvas.getActiveObject();

    if (objects.length === 0) {
      list.innerHTML = '<div class="layer-empty">Sin capas todavía</div>';
      return;
    }

    list.innerHTML = '';
    [...objects].reverse().forEach((obj, i) => {
      const realIdx = objects.length - 1 - i;
      const item = document.createElement('div');
      item.className = 'layer-item' + (obj === active ? ' active' : '');

      const thumb = document.createElement('div');
      thumb.className = 'layer-thumb';
      if (obj.type === 'i-text' || obj.type === 'text') thumb.innerHTML = '<i class="fa-solid fa-font"></i>';
      else if (obj.type === 'image') thumb.innerHTML = '<i class="fa-solid fa-image"></i>';
      else if (obj.type === 'group') thumb.innerHTML = '<i class="fa-solid fa-layer-group"></i>';
      else if (obj.type === 'rect') thumb.innerHTML = '<i class="fa-regular fa-square"></i>';
      else if (obj.type === 'circle') thumb.innerHTML = '<i class="fa-regular fa-circle"></i>';
      else thumb.innerHTML = '<i class="fa-solid fa-shapes"></i>';

      const info = document.createElement('div');
      info.className = 'layer-info';
      const name = obj.name || obj.type || 'Objeto';
      const preview = obj.type === 'i-text' ? (obj.text || '').substring(0, 20) : obj.type;
      info.innerHTML = `<div class="layer-name">${name}</div><div class="layer-type">${preview}</div>`;

      const visBtn = document.createElement('button');
      visBtn.className = 'layer-vis-btn';
      visBtn.innerHTML = obj.visible === false ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      visBtn.title = 'Mostrar/ocultar';
      visBtn.addEventListener('click', e => {
        e.stopPropagation();
        obj.visible = !obj.visible;
        canvas.renderAll();
        _updateLayerList();
      });

      item.appendChild(thumb);
      item.appendChild(info);
      item.appendChild(visBtn);
      item.addEventListener('click', () => {
        canvas.setActiveObject(obj);
        canvas.renderAll();
        _updateLayerList();
      });

      list.appendChild(item);
    });
  }

  // ── BARRA DE HERRAMIENTAS CANVAS ──────────────────────────────────────────
  function _setupCanvasToolbar() {
    document.getElementById('btn-undo').addEventListener('click', undo);
    document.getElementById('btn-redo').addEventListener('click', redo);

    document.getElementById('btn-delete').addEventListener('click', () => {
      const obj = canvas.getActiveObject();
      if (obj) { canvas.remove(obj); saveHistory(); }
    });

    document.getElementById('btn-duplicate').addEventListener('click', () => {
      const obj = canvas.getActiveObject();
      if (!obj) return;
      obj.clone(clone => {
        clone.set({ left: obj.left + 20, top: obj.top + 20 });
        canvas.add(clone);
        canvas.setActiveObject(clone);
        canvas.renderAll();
        saveHistory();
      });
    });

    document.getElementById('btn-bring-front').addEventListener('click', () => {
      const obj = canvas.getActiveObject();
      if (obj) { canvas.bringToFront(obj); saveHistory(); }
    });

    document.getElementById('btn-send-back').addEventListener('click', () => {
      const obj = canvas.getActiveObject();
      if (obj) { canvas.sendToBack(obj); saveHistory(); }
    });

    document.getElementById('btn-center-h').addEventListener('click', () => {
      const obj = canvas.getActiveObject();
      if (obj) { obj.set({ left: canvas.width / 2, originX: 'center' }); canvas.renderAll(); saveHistory(); }
    });

    document.getElementById('btn-center-v').addEventListener('click', () => {
      const obj = canvas.getActiveObject();
      if (obj) { obj.set({ top: canvas.height / 2, originY: 'center' }); canvas.renderAll(); saveHistory(); }
    });
  }

  // ── TAMAÑO DEL CANVAS ─────────────────────────────────────────────────────
  function resizeCanvas(w, h) {
    canvas.setWidth(w);
    canvas.setHeight(h);
    canvas.renderAll();
    document.getElementById('canvas-w').value = w;
    document.getElementById('canvas-h').value = h;
    document.getElementById('canvas-size-label').textContent = `Personalizado · ${w}×${h} px`;
    zoomFit();
    saveHistory();
  }

  // ── EXPORTAR ──────────────────────────────────────────────────────────────
  function _setupExport() {
    document.getElementById('btn-export').addEventListener('click', () => {
      document.getElementById('modal-export').classList.remove('hidden');
      _updateExportInfo();
    });

    document.querySelectorAll('.format-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFormat = btn.dataset.fmt;
        document.getElementById('export-jpg-opts').classList.toggle('hidden', currentFormat !== 'jpg');
        _updateExportInfo();
      });
    });

    document.getElementById('export-dpi').addEventListener('change', _updateExportInfo);
    document.getElementById('jpg-quality').addEventListener('input', function() {
      document.getElementById('jpg-quality-val').textContent = this.value + '%';
      _updateExportInfo();
    });

    document.getElementById('btn-do-export').addEventListener('click', doExport);
    document.getElementById('close-export').addEventListener('click', () => {
      document.getElementById('modal-export').classList.add('hidden');
    });
  }

  function _updateExportInfo() {
    const multiplier = parseInt(document.getElementById('export-dpi').value);
    const w = canvas.width * multiplier;
    const h = canvas.height * multiplier;
    const fmt = currentFormat.toUpperCase();
    document.getElementById('export-size-info').textContent =
      `Salida: ${w}×${h} px · Formato: ${fmt} · Escala: ${multiplier}×`;
  }

  function doExport() {
    const multiplier = parseInt(document.getElementById('export-dpi').value);
    const filename = document.getElementById('export-filename').value || 'sticker-vela';
    const quality = parseInt(document.getElementById('jpg-quality').value) / 100;

    // Desseleccionar para no exportar bordes de selección
    canvas.discardActiveObject();
    canvas.renderAll();

    const dataURL = canvas.toDataURL({
      format: currentFormat,
      quality: currentFormat === 'jpg' ? quality : 1,
      multiplier
    });

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${filename}.${currentFormat}`;
    link.click();

    document.getElementById('modal-export').classList.add('hidden');
    showToast(`¡Sticker exportado como ${filename}.${currentFormat}!`, 'success');
  }

  // ── MODALES ───────────────────────────────────────────────────────────────
  function _setupModals() {
    // Plantillas
    document.getElementById('btn-templates').addEventListener('click', () => {
      document.getElementById('modal-templates').classList.remove('hidden');
    });
    document.getElementById('close-templates').addEventListener('click', () => {
      document.getElementById('modal-templates').classList.add('hidden');
    });

    // Categorías de plantillas
    document.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        CandleTemplates.renderTemplates(
          document.getElementById('templates-grid'),
          btn.dataset.cat
        );
      });
    });

    // Tamaño personalizado
    const sizeSelect = document.getElementById('sticker-size');
    sizeSelect.addEventListener('change', () => {
      if (sizeSelect.value === 'custom') {
        document.getElementById('modal-custom-size').classList.remove('hidden');
        return;
      }
      const size = SIZES[sizeSelect.value];
      if (size) {
        resizeCanvas(size.w, size.h);
        document.getElementById('canvas-size-label').textContent = size.label;
      }
    });

    document.getElementById('close-custom-size').addEventListener('click', () => {
      document.getElementById('modal-custom-size').classList.add('hidden');
    });
    document.getElementById('btn-apply-custom-size').addEventListener('click', () => {
      const w = parseFloat(document.getElementById('custom-w').value);
      const h = parseFloat(document.getElementById('custom-h').value);
      const dpi = parseInt(document.getElementById('custom-dpi').value);
      const pw = Math.round(w * dpi);
      const ph = Math.round(h * dpi);
      resizeCanvas(pw, ph);
      document.getElementById('canvas-size-label').textContent =
        `Personalizado · ${w}×${h} pulg · ${dpi} DPI · ${pw}×${ph} px`;
      document.getElementById('modal-custom-size').classList.add('hidden');
      document.getElementById('sticker-size').value = '';
    });

    // Cerrar modales con clic fuera
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.add('hidden');
      });
    });

    // Nuevo proyecto
    document.getElementById('btn-new').addEventListener('click', () => {
      if (confirm('¿Crear un nuevo proyecto? Se perderán los cambios no guardados.')) {
        canvas.clear();
        canvas.setBackgroundColor('#fdf3e3', canvas.renderAll.bind(canvas));
        history = [];
        historyIndex = -1;
        saveHistory();
        _updateLayerList();
        showToast('Nuevo proyecto creado', 'success');
      }
    });
  }

  function _renderTemplatesModal() {
    CandleTemplates.renderTemplates(document.getElementById('templates-grid'));
  }

  function loadTemplate(tpl) {
    canvas.clear();
    canvas.setBackgroundColor('#ffffff', () => {});
    tpl.load(canvas);
    history = [];
    historyIndex = -1;
    saveHistory();
    _updateLayerList();
    showToast(`Plantilla "${tpl.name}" cargada`, 'success');
  }

  // ── GUÍAS ─────────────────────────────────────────────────────────────────
  function _setupGuides() {
    document.getElementById('show-grid').addEventListener('change', function() {
      gridVisible = this.checked;
      _renderGrid();
    });
    document.getElementById('snap-grid').addEventListener('change', function() {
      snapToGrid = this.checked;
    });
    document.getElementById('show-bleed').addEventListener('change', function() {
      bleedVisible = this.checked;
      const frame = document.getElementById('canvas-frame');
      let bleed = frame.querySelector('.bleed-overlay');
      if (this.checked) {
        if (!bleed) {
          bleed = document.createElement('div');
          bleed.className = 'bleed-overlay';
          frame.appendChild(bleed);
        }
      } else if (bleed) {
        bleed.remove();
      }
    });
  }

  function _renderGrid() {
    const frame = document.getElementById('canvas-frame');
    let gridEl = frame.querySelector('.grid-overlay');
    if (!gridVisible) { if (gridEl) gridEl.remove(); return; }

    if (!gridEl) {
      gridEl = document.createElement('canvas');
      gridEl.className = 'grid-overlay';
      gridEl.width = canvas.width;
      gridEl.height = canvas.height;
      gridEl.style.cssText = `position:absolute;inset:0;pointer-events:none;z-index:10;opacity:0.2;`;
      frame.appendChild(gridEl);
    }

    const ctx = gridEl.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
  }

  // ── TECLADO ───────────────────────────────────────────────────────────────
  function _setupKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
      // No activar si estamos en un input/textarea
      if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); undo(); }
        if (e.key === 'y' || (e.shiftKey && e.key === 'z')) { e.preventDefault(); redo(); }
        if (e.key === 'd') {
          e.preventDefault();
          const obj = canvas.getActiveObject();
          if (obj) obj.clone(clone => {
            clone.set({ left: obj.left + 20, top: obj.top + 20 });
            canvas.add(clone);
            canvas.setActiveObject(clone);
            canvas.renderAll();
            saveHistory();
          });
        }
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const obj = canvas.getActiveObject();
        if (obj && obj.type !== 'i-text') {
          canvas.remove(obj);
          saveHistory();
        }
      }

      // Mover objeto con flechas
      const obj = canvas.getActiveObject();
      if (obj) {
        const step = e.shiftKey ? 10 : 1;
        if (e.key === 'ArrowLeft') { e.preventDefault(); obj.set({ left: obj.left - step }); canvas.renderAll(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); obj.set({ left: obj.left + step }); canvas.renderAll(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); obj.set({ top: obj.top - step }); canvas.renderAll(); }
        if (e.key === 'ArrowDown') { e.preventDefault(); obj.set({ top: obj.top + step }); canvas.renderAll(); }
        if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) saveHistory();
      }

      // Escape: deseleccionar
      if (e.key === 'Escape') canvas.discardActiveObject() && canvas.renderAll();
    });
  }

  // ── TOAST ─────────────────────────────────────────────────────────────────
  function showToast(msg, type = '') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; }, 2500);
    setTimeout(() => toast.remove(), 2900);
  }

  // ── API PÚBLICA ───────────────────────────────────────────────────────────
  return {
    init,
    addText,
    addSVGElement,
    addBorder,
    addShape,
    applyPattern,
    applyGradient,
    loadTemplate,
    undo,
    redo,
    saveHistory,
    showToast,
    getCanvas: () => canvas
  };
})();

// Exponer globalmente para que elements.js y templates.js puedan usarlo
window.CandleApp = CandleApp;

// Arrancar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => CandleApp.init());
