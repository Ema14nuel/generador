/* app.js — VelaSticker · Generador de etiquetas de velas */

const PAPER_SIZES = {
  letter: { w: 816, h: 1056, label: 'Carta (8.5×11")' },
  a4:     { w: 794, h: 1123, label: 'A4 (210×297mm)' },
  legal:  { w: 816, h: 1344, label: 'Oficio (8.5×14")' },
};

class StickerApp {
  constructor() {
    this.stickers = [];
    this.selectedId = null;
    this.activeEditorTab = 'etab-char';
    this.zoom = 0.75;
    this.exportFormat = 'png';
    this.globalCharImg = null;
    this.sequenceColors = [...DEFAULT_SEQUENCE];
    this.sheetConfig = {
      paperSize: 'letter',
      columns: 2,
      stickerHeight: 90,
      gap: 6,
      margin: 24,
      exportDpi: 2,
    };
    this._dragSrc = null;
  }

  /* ── INIT ─────────────────────────────────────────────────────── */
  init() {
    this.renderBrushGrid();
    this.renderColorSwatches();
    this.renderFontGrid();
    this.renderSequenceBar();
    this.renderTemplateGrid('all');
    this.setSheetDimensions();
    this.setZoom(this.zoom);
    this.bindUI();
    this.loadFromStorage();
    if (this.stickers.length === 0) this.loadDefaultStickers();
    this.renderWordList();
    this.renderSheet();
  }

  loadDefaultStickers() {
    const defaults = [
      { text: 'Amor',        color: '#ff9f43' },
      { text: 'Salud',       color: '#00b894' },
      { text: 'Familia',     color: '#74b9ff' },
      { text: 'Prosperidad', color: '#fdcb6e' },
      { text: 'Fe',          color: '#a29bfe' },
      { text: 'Esperanza',   color: '#fd79a8' },
    ];
    defaults.forEach(d => this.addSticker(d.text, { color: d.color }));
  }

  /* ── STICKER MODEL ────────────────────────────────────────────── */
  mkId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  createSticker(text = 'Nuevo', opts = {}) {
    return {
      id:           this.mkId(),
      text:         text,
      subtext:      opts.subtext   || '',
      color:        opts.color     || '#ff9f43',
      brushStyle:   opts.brushStyle || 'classic',
      textColor:    opts.textColor  || '#ffffff',
      font:         opts.font       || 'Dancing Script',
      fontSize:     opts.fontSize   || 32,
      charImg:      opts.charImg    || null,
      charPosition: opts.charPosition || 'left',
      charSize:     opts.charSize   || 120,
      iconImg:      opts.iconImg    || null,
      bgColor:      opts.bgColor    || '#ffffff',
      align:        opts.align      || 'center',
      deco:         opts.deco       || 'none',
      brushOpacity: opts.brushOpacity !== undefined ? opts.brushOpacity : 100,
    };
  }

  addSticker(text, opts = {}) {
    const s = this.createSticker(text, opts);
    this.stickers.push(s);
    this.renderWordList();
    this.renderSheet();
    this.saveToStorage();
    this.updateStickerCount();
    return s;
  }

  removeSticker(id) {
    this.stickers = this.stickers.filter(s => s.id !== id);
    if (this.selectedId === id) { this.selectedId = null; this.closeEditor(); }
    this.renderWordList();
    this.renderSheet();
    this.saveToStorage();
    this.updateStickerCount();
  }

  duplicateSticker(id) {
    const src = this.stickers.find(s => s.id === id);
    if (!src) return;
    const dup = { ...src, id: this.mkId(), text: src.text + ' (copia)' };
    const idx = this.stickers.findIndex(s => s.id === id);
    this.stickers.splice(idx + 1, 0, dup);
    this.renderWordList();
    this.renderSheet();
    this.saveToStorage();
    this.updateStickerCount();
    this.showToast('Sticker duplicado');
  }

  updateStickerData(id, changes) {
    const s = this.stickers.find(s => s.id === id);
    if (!s) return;
    Object.assign(s, changes);
  }

  /* ── SELECTION & EDITOR ───────────────────────────────────────── */
  selectSticker(id) {
    this.selectedId = id;
    const s = this.stickers.find(s => s.id === id);
    if (!s) return;
    this.openEditor(s);
    this.highlightSelected();
  }

  highlightSelected() {
    document.querySelectorAll('.word-item').forEach(el =>
      el.classList.toggle('selected', el.dataset.id === this.selectedId));
    document.querySelectorAll('.sticker-wrap').forEach(el =>
      el.classList.toggle('selected', el.dataset.id === this.selectedId));
  }

  openEditor(s) {
    document.getElementById('sticker-editor').classList.remove('hidden');
    document.getElementById('no-selection-msg').classList.add('hidden');
    document.getElementById('global-actions').style.display = '';
    this.fillEditorFromSticker(s);
    document.getElementById('editor-title').textContent = `Editando: ${s.text}`;
  }

  closeEditor() {
    document.getElementById('sticker-editor').classList.add('hidden');
    document.getElementById('no-selection-msg').classList.remove('hidden');
    document.getElementById('global-actions').style.display = 'none';
    document.querySelectorAll('.word-item').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.sticker-wrap').forEach(el => el.classList.remove('selected'));
  }

  fillEditorFromSticker(s) {
    this.setVal('sticker-text-input',    s.text || '');
    this.setVal('sticker-subtext-input', s.subtext || '');
    this.setVal('text-size',             s.fontSize);
    this.setVal('text-color-pick',       s.textColor);
    this.setVal('brush-color-pick',      s.color);
    this.setVal('brush-color-hex',       s.color);
    this.setVal('brush-opacity',         s.brushOpacity);
    document.getElementById('brush-opacity-val').textContent = s.brushOpacity + '%';
    this.setVal('sticker-bg-pick',       s.bgColor || '#ffffff');
    this.setVal('sticker-bg-hex',        s.bgColor || '#ffffff');
    this.setVal('char-size',             s.charSize);
    document.getElementById('char-size-val').textContent = s.charSize + '%';

    this.setActiveGroup('.pos-btn',         'data-pos',   s.charPosition);
    this.setActiveGroup('.align-btn',       'data-align',  s.align);
    this.setActiveGroup('.deco-btn',        'data-deco',   s.deco);
    this.setActiveGroup('.brush-style-btn', 'data-style',  s.brushStyle);
    this.setActiveGroup('.font-btn',        'data-font',   s.font);
    this.setActiveGroup('.swatch',          'data-color',  s.color);

    this.updateCharPreviewInEditor(s.charImg);
    this.updateIconPreviewInEditor(s.iconImg);
  }

  setVal(id, v) {
    const el = document.getElementById(id);
    if (el) el.value = v;
  }

  setActiveGroup(selector, attr, value) {
    document.querySelectorAll(selector).forEach(b =>
      b.classList.toggle('active', b.getAttribute(attr) === String(value)));
  }

  readEditorToSticker() {
    if (!this.selectedId) return null;
    const s = this.stickers.find(s => s.id === this.selectedId);
    if (!s) return null;

    s.text        = document.getElementById('sticker-text-input').value.trim() || 'Nuevo';
    s.subtext     = document.getElementById('sticker-subtext-input').value.trim();
    s.fontSize    = parseInt(document.getElementById('text-size').value) || 32;
    s.textColor   = document.getElementById('text-color-pick').value;
    s.color       = document.getElementById('brush-color-pick').value;
    s.brushOpacity = parseInt(document.getElementById('brush-opacity').value) || 100;
    s.bgColor     = document.getElementById('sticker-bg-pick').value;
    s.charSize    = parseInt(document.getElementById('char-size').value) || 120;
    s.charPosition = this.getActiveAttr('.pos-btn',         'data-pos')   || 'left';
    s.align       = this.getActiveAttr('.align-btn',        'data-align') || 'center';
    s.deco        = this.getActiveAttr('.deco-btn',         'data-deco')  || 'none';
    s.brushStyle  = this.getActiveAttr('.brush-style-btn',  'data-style') || 'classic';
    s.font        = this.getActiveAttr('.font-btn',         'data-font')  || 'Dancing Script';
    return s;
  }

  getActiveAttr(selector, attr) {
    const el = document.querySelector(selector + '.active');
    return el ? el.getAttribute(attr) : null;
  }

  applyEditorChanges() {
    const s = this.readEditorToSticker();
    if (!s) return;
    document.getElementById('editor-title').textContent = `Editando: ${s.text}`;
    // Update the word item color dot and text
    const item = document.querySelector(`.word-item[data-id="${s.id}"]`);
    if (item) {
      item.querySelector('.word-item-color').style.background = s.color;
      item.querySelector('.word-item-text').textContent = s.text;
    }
    this.renderSheet();
    this.saveToStorage();
    this.showToast('Cambios aplicados', 'success');
  }

  /* ── CHAR / ICON IMAGE PREVIEWS ───────────────────────────────── */
  updateCharPreviewInEditor(src) {
    const area = document.getElementById('char-preview-area');
    const actions = document.getElementById('char-actions');
    if (src) {
      area.innerHTML = `<img src="${src}" alt="Personaje" />`;
      actions.style.display = 'flex';
    } else {
      area.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i><span>Haz clic o arrastra tu imagen</span>`;
      actions.style.display = 'none';
    }
  }

  updateIconPreviewInEditor(src) {
    const area = document.getElementById('icon-preview-area');
    const removeBtn = document.getElementById('btn-remove-icon');
    if (src) {
      area.innerHTML = `<img src="${src}" alt="Ícono" style="height:36px;object-fit:contain;" />`;
      removeBtn.style.display = '';
    } else {
      area.innerHTML = `<i class="fa-solid fa-star"></i><span>Ícono</span>`;
      removeBtn.style.display = 'none';
    }
  }

  /* ── SHEET RENDERING ──────────────────────────────────────────── */
  setSheetDimensions() {
    const paper = PAPER_SIZES[this.sheetConfig.paperSize] || PAPER_SIZES.letter;
    const el = document.getElementById('sheet-paper');
    el.style.width    = paper.w + 'px';
    el.style.minHeight = paper.h + 'px';
  }

  setZoom(z) {
    this.zoom = Math.max(0.25, Math.min(2.0, z));
    document.getElementById('sheet-paper').style.transform = `scale(${this.zoom})`;
    document.getElementById('zoom-label').textContent = Math.round(this.zoom * 100) + '%';
  }

  renderSheet() {
    const container = document.getElementById('sheet-columns');
    const empty     = document.getElementById('sheet-empty');

    // Clear existing column wraps
    container.querySelectorAll('.sheet-col-wrap').forEach(el => el.remove());

    container.style.padding = this.sheetConfig.margin + 'px';

    if (this.stickers.length === 0) {
      empty.style.display = '';
      this.updateSheetInfo();
      return;
    }
    empty.style.display = 'none';

    const cols    = this.sheetConfig.columns;
    const gap     = this.sheetConfig.gap;
    const perCol  = Math.ceil(this.stickers.length / cols);

    const wrap = document.createElement('div');
    wrap.className = 'sheet-col-wrap';
    wrap.style.gap = gap + 'px';

    for (let c = 0; c < cols; c++) {
      const colEl = document.createElement('div');
      colEl.className = 'sheet-col';
      colEl.style.gap = gap + 'px';
      const start = c * perCol;
      const end   = Math.min(start + perCol, this.stickers.length);
      for (let i = start; i < end; i++) {
        colEl.appendChild(this.createStickerElement(this.stickers[i]));
      }
      wrap.appendChild(colEl);
    }

    container.appendChild(wrap);
    this.highlightSelected();
    this.updateSheetInfo();
  }

  updateSheetInfo() {
    const paper = PAPER_SIZES[this.sheetConfig.paperSize] || PAPER_SIZES.letter;
    const c = this.sheetConfig.columns;
    document.getElementById('sheet-info').textContent =
      `${paper.label} · ${c} columna${c !== 1 ? 's' : ''} · ${this.stickers.length} sticker${this.stickers.length !== 1 ? 's' : ''}`;
  }

  createStickerElement(s) {
    const sH       = this.sheetConfig.stickerHeight;
    const hasChar  = !!(s.charImg && s.charPosition !== 'none');
    const charSide = s.charPosition || 'left';
    const charScale = (s.charSize || 120) / 100;

    // Character display dimensions
    const charDisplayH = Math.round(sH * 1.25 * charScale);
    const charDisplayW = Math.round(charDisplayH * 0.72);

    // Brush stroke area
    const brushInset = hasChar ? Math.round(charDisplayW * 0.55) : 4;
    const brushLeft  = hasChar && charSide === 'left'  ? brushInset : 4;
    const brushRight = hasChar && charSide === 'right' ? brushInset : 4;
    const brushH     = Math.round(sH * 0.78);

    // Text area (z-indexed on top of brush)
    const textLeft  = brushLeft + 10;
    const textRight = brushRight + 10;

    const brushDef  = BRUSH_STYLES[s.brushStyle] || BRUSH_STYLES.classic;
    const opacity   = ((s.brushOpacity !== undefined ? s.brushOpacity : 100) / 100).toFixed(2);
    const decoText  = this.applyDeco(s.deco, this.esc(s.text));

    // Build char zone
    let charHTML = '';
    if (hasChar) {
      const cStyle = charSide === 'right'
        ? `left:auto;right:0;top:50%;transform:translateY(-50%);width:${charDisplayW}px;height:${charDisplayH}px;`
        : `left:0;top:50%;transform:translateY(-50%);width:${charDisplayW}px;height:${charDisplayH}px;`;
      charHTML = `<div class="sticker-char-zone" style="${cStyle}">
        <img src="${s.charImg}" alt="" style="width:100%;height:100%;object-fit:contain;object-position:center bottom;" />
      </div>`;
    }

    // Build icon zone
    let iconHTML = '';
    if (s.iconImg) {
      const iconSz = Math.round(sH * 0.38);
      iconHTML = `<div class="sticker-icon-zone" style="right:6px;width:${iconSz}px;height:${iconSz}px;">
        <img src="${s.iconImg}" alt="" style="width:100%;height:100%;object-fit:contain;" />
      </div>`;
    }

    const fontDecl = `'${s.font}',cursive`;
    const subtextHTML = s.subtext
      ? `<span class="sticker-sub-text" style="font-family:${fontDecl};color:${s.textColor};">${this.esc(s.subtext)}</span>`
      : '';

    const wrap = document.createElement('div');
    wrap.className = 'sticker-wrap';
    wrap.dataset.id = s.id;
    wrap.style.cssText = `height:${sH}px;background-color:${s.bgColor||'#fff'};margin-bottom:0;`;

    wrap.innerHTML = `
      <div class="sticker" style="height:${sH}px;">
        ${charHTML}
        <div class="sticker-body">
          <div class="sticker-brush-wrap" style="left:${brushLeft}px;right:${brushRight}px;height:${brushH}px;z-index:1;">
            <svg viewBox="${brushDef.viewBox}" preserveAspectRatio="none" style="width:100%;height:100%;display:block;">
              <path d="${brushDef.path}" fill="${s.color}" opacity="${opacity}"/>
            </svg>
          </div>
          <div class="sticker-text-wrap" style="left:${textLeft}px;right:${textRight}px;top:0;bottom:0;text-align:${s.align||'center'};z-index:2;">
            <span class="sticker-main-text" style="font-family:${fontDecl};font-size:${s.fontSize}px;color:${s.textColor};">${decoText}</span>
            ${subtextHTML}
          </div>
        </div>
        ${iconHTML}
      </div>`;

    wrap.addEventListener('click', () => this.selectSticker(s.id));
    return wrap;
  }

  esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  applyDeco(deco, text) {
    const map = {
      none:    text,
      stars:   `✦ ${text} ✦`,
      dots:    `· ${text} ·`,
      flowers: `❀ ${text} ❀`,
      hearts:  `♡ ${text} ♡`,
      arrows:  `» ${text} «`,
    };
    return map[deco] || text;
  }

  /* ── WORD LIST ────────────────────────────────────────────────── */
  renderWordList() {
    const list  = document.getElementById('word-list');
    const empty = document.getElementById('wordlist-empty');
    list.querySelectorAll('.word-item').forEach(el => el.remove());
    empty.style.display = this.stickers.length === 0 ? '' : 'none';
    this.stickers.forEach(s => list.appendChild(this.createWordItem(s)));
    this.updateStickerCount();
    this.initDragReorder();
  }

  updateStickerCount() {
    const n = this.stickers.length;
    document.getElementById('sticker-count').textContent = `${n} sticker${n !== 1 ? 's' : ''}`;
  }

  createWordItem(s) {
    const div = document.createElement('div');
    div.className = 'word-item';
    div.dataset.id = s.id;
    div.setAttribute('draggable', 'true');
    div.innerHTML = `
      <span class="word-item-drag" title="Arrastrar"><i class="fa-solid fa-grip-vertical"></i></span>
      <span class="word-item-color" style="background:${s.color};"></span>
      <span class="word-item-text" title="${this.esc(s.text)}">${this.esc(s.text)}</span>
      <div class="word-item-actions">
        <button class="word-item-btn js-edit" title="Editar"><i class="fa-solid fa-pen"></i></button>
        <button class="word-item-btn js-dup"  title="Duplicar"><i class="fa-regular fa-copy"></i></button>
        <button class="word-item-btn danger js-del" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
      </div>`;
    div.querySelector('.js-edit').addEventListener('click', e => { e.stopPropagation(); this.selectSticker(s.id); });
    div.querySelector('.js-dup').addEventListener('click',  e => { e.stopPropagation(); this.duplicateSticker(s.id); });
    div.querySelector('.js-del').addEventListener('click',  e => { e.stopPropagation(); this.removeSticker(s.id); });
    div.addEventListener('click', () => this.selectSticker(s.id));
    return div;
  }

  initDragReorder() {
    const list = document.getElementById('word-list');
    list.querySelectorAll('.word-item').forEach(item => {
      item.addEventListener('dragstart', e => {
        this._dragSrc = item;
        item.style.opacity = '0.4';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.dataset.id);
      });
      item.addEventListener('dragend', () => {
        item.style.opacity = '';
        list.querySelectorAll('.word-item').forEach(i => i.style.borderColor = '');
      });
      item.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        list.querySelectorAll('.word-item').forEach(i => i.style.outline = '');
        item.style.outline = '2px dashed #fdcb6e';
      });
      item.addEventListener('drop', e => {
        e.stopPropagation(); e.preventDefault();
        item.style.outline = '';
        if (this._dragSrc && this._dragSrc !== item) {
          const fromId = this._dragSrc.dataset.id;
          const toId   = item.dataset.id;
          const fi = this.stickers.findIndex(s => s.id === fromId);
          const ti = this.stickers.findIndex(s => s.id === toId);
          if (fi !== -1 && ti !== -1) {
            const [removed] = this.stickers.splice(fi, 1);
            this.stickers.splice(ti, 0, removed);
            this.renderWordList();
            this.renderSheet();
            this.saveToStorage();
          }
        }
      });
    });
  }

  /* ── EDITOR UI ELEMENTS ───────────────────────────────────────── */
  renderBrushGrid() {
    const grid = document.getElementById('brush-styles-grid');
    if (!grid) return;
    grid.innerHTML = '';
    Object.entries(BRUSH_STYLES).forEach(([key, style]) => {
      const btn = document.createElement('button');
      btn.className = 'brush-style-btn';
      btn.dataset.style = key;
      btn.title = style.name;
      btn.innerHTML = `<svg viewBox="${style.viewBox}" preserveAspectRatio="none" style="width:100%;height:100%;">
        <path d="${style.path}" fill="#ff9f43"/>
      </svg>`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.brush-style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (this.selectedId) this.liveUpdateBrush(key);
      });
      grid.appendChild(btn);
    });
    // Set first as active
    const first = grid.querySelector('.brush-style-btn');
    if (first) first.classList.add('active');
  }

  liveUpdateBrush(style) {
    const s = this.stickers.find(s => s.id === this.selectedId);
    if (!s) return;
    s.brushStyle = style;
    // Update just the brush SVG in the sheet
    const wrap = document.querySelector(`.sticker-wrap[data-id="${s.id}"]`);
    if (wrap) {
      const brushDef = BRUSH_STYLES[style] || BRUSH_STYLES.classic;
      const svg = wrap.querySelector('.sticker-brush-wrap svg');
      if (svg) {
        svg.setAttribute('viewBox', brushDef.viewBox);
        const path = svg.querySelector('path');
        if (path) path.setAttribute('d', brushDef.path);
      }
    }
  }

  renderColorSwatches() {
    const swatches = document.getElementById('color-swatches');
    if (!swatches) return;
    swatches.innerHTML = '';
    COLOR_PRESETS.forEach(c => {
      const sp = document.createElement('span');
      sp.className = 'swatch';
      sp.dataset.color = c.value;
      sp.title = c.name;
      sp.style.background = c.value;
      sp.addEventListener('click', () => {
        document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
        sp.classList.add('active');
        document.getElementById('brush-color-pick').value = c.value;
        document.getElementById('brush-color-hex').value  = c.value;
      });
      swatches.appendChild(sp);
    });
  }

  renderFontGrid() {
    const grid = document.getElementById('font-grid');
    if (!grid) return;
    grid.innerHTML = '';
    FONTS.forEach(f => {
      const btn = document.createElement('button');
      btn.className = 'font-btn';
      btn.dataset.font = f.id;
      btn.style.fontFamily = `'${f.id}', cursive`;
      btn.textContent = f.sample || 'Amor';
      btn.title = f.label;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
      grid.appendChild(btn);
    });
    // Set first active
    const first = grid.querySelector('.font-btn');
    if (first) first.classList.add('active');
  }

  renderSequenceBar() {
    const bar = document.getElementById('seq-colors');
    if (!bar) return;
    bar.innerHTML = '';
    this.sequenceColors.forEach((c, i) => {
      const sp = document.createElement('span');
      sp.className = 'seq-swatch';
      sp.style.background = c;
      sp.title = c;
      sp.dataset.idx = i;
      sp.addEventListener('click', () => {
        // Allow picking a new color for this position
        const pick = document.createElement('input');
        pick.type = 'color';
        pick.value = c;
        pick.style.position = 'fixed';
        pick.style.opacity = '0';
        pick.style.pointerEvents = 'none';
        document.body.appendChild(pick);
        pick.click();
        pick.addEventListener('input', () => {
          this.sequenceColors[i] = pick.value;
          this.renderSequenceBar();
        });
        pick.addEventListener('change', () => pick.remove());
      });
      bar.appendChild(sp);
    });
  }

  /* ── TEMPLATE MODAL ───────────────────────────────────────────── */
  renderTemplateGrid(cat = 'all') {
    const grid = document.getElementById('tpl-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const all = getAllTemplates();
    const filtered = cat === 'all' ? all : all.filter(t => t.category === cat);

    filtered.forEach(tpl => {
      const card = document.createElement('div');
      card.className = 'tpl-card';
      const isUser = !BUILTIN_TEMPLATES.find(b => b.id === tpl.id);

      // Build mini preview of stickers
      const previewStickers = tpl.stickers.slice(0, 3).map(st =>
        `<div class="tpl-sticker-preview" style="background:${st.color};font-family:'${tpl.font||'Dancing Script'}',cursive;">${this.esc(st.text)}</div>`
      ).join('');

      card.innerHTML = `
        <div class="tpl-preview">${previewStickers}</div>
        <div class="tpl-info">
          <h4>${this.esc(tpl.name)}</h4>
          <p>${this.esc(tpl.description || '')} · ${tpl.stickers.length} stickers</p>
        </div>`;

      card.addEventListener('click', () => this.loadTemplate(tpl));
      grid.appendChild(card);
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">Sin plantillas en esta categoría</p>';
    }
  }

  loadTemplate(tpl) {
    this.stickers = tpl.stickers.map(st => this.createSticker(st.text, {
      subtext:   st.subtext   || '',
      color:     st.color     || '#ff9f43',
      brushStyle: tpl.brushStyle || 'classic',
      font:      tpl.font     || 'Dancing Script',
      textColor: '#ffffff',
    }));
    this.selectedId = null;
    this.closeEditor();
    this.renderWordList();
    this.renderSheet();
    this.saveToStorage();
    document.getElementById('modal-templates').classList.add('hidden');
    this.showToast(`Plantilla "${tpl.name}" cargada`, 'success');
  }

  /* ── SEQUENCE AUTO-COLOR ──────────────────────────────────────── */
  applyColorSequence() {
    const seq = this.sequenceColors;
    this.stickers.forEach((s, i) => {
      s.color = seq[i % seq.length];
    });
    this.renderWordList();
    this.renderSheet();
    this.saveToStorage();
    this.showToast('Secuencia de colores aplicada', 'success');
  }

  applyCharToAll() {
    if (!this.globalCharImg) {
      this.showToast('Primero selecciona y aplica un personaje en algún sticker', 'error');
      return;
    }
    this.stickers.forEach(s => {
      s.charImg = this.globalCharImg;
      s.charPosition = 'left';
    });
    this.renderSheet();
    this.saveToStorage();
    this.showToast('Personaje aplicado a todos los stickers', 'success');
  }

  applyFontToAll() {
    const font = this.getActiveAttr('.font-btn', 'data-font') || 'Dancing Script';
    this.stickers.forEach(s => { s.font = font; });
    this.renderSheet();
    this.saveToStorage();
    this.showToast(`Fuente "${font}" aplicada a todos`, 'success');
  }

  /* ── EXPORT ───────────────────────────────────────────────────── */
  updateExportInfo() {
    const info = document.getElementById('export-info');
    if (!info) return;
    const paper = PAPER_SIZES[this.sheetConfig.paperSize] || PAPER_SIZES.letter;
    const dpi   = this.sheetConfig.exportDpi;
    const W     = paper.w * dpi;
    const H     = paper.h * dpi;
    const pxDpi = dpi === 1 ? '150 DPI' : dpi === 2 ? '300 DPI' : '600 DPI';
    info.textContent = `${W} × ${H} px · ${pxDpi} · ${this.stickers.length} stickers`;
  }

  async doExport() {
    const fmt   = this.exportFormat;
    const dpi   = this.sheetConfig.exportDpi;
    const paper = PAPER_SIZES[this.sheetConfig.paperSize] || PAPER_SIZES.letter;
    const W     = paper.w  * dpi;
    const H     = paper.h  * dpi;

    const canvas = document.createElement('canvas');
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    await document.fonts.ready;

    const margin = this.sheetConfig.margin  * dpi;
    const gap    = this.sheetConfig.gap     * dpi;
    const sH     = this.sheetConfig.stickerHeight * dpi;
    const cols   = this.sheetConfig.columns;
    const avail  = W - margin * 2;
    const colW   = (avail - gap * (cols - 1)) / cols;
    const perCol = Math.ceil(this.stickers.length / cols);

    for (let c = 0; c < cols; c++) {
      const colX  = margin + c * (colW + gap);
      const start = c * perCol;
      const end   = Math.min(start + perCol, this.stickers.length);
      for (let i = start; i < end; i++) {
        const s    = this.stickers[i];
        const sY   = margin + (i - start) * (sH + gap);
        await this.drawStickerToCanvas(ctx, s, colX, sY, colW, sH, dpi);
      }
    }

    const filename = (document.getElementById('export-filename').value || 'hoja-velas').replace(/[^a-z0-9_\-]/gi, '_');
    const mime = fmt === 'jpg' ? 'image/jpeg' : 'image/png';
    const link = document.createElement('a');
    link.download = `${filename}.${fmt}`;
    link.href = canvas.toDataURL(mime, 0.95);
    link.click();
    this.showToast('Exportación completada', 'success');
  }

  async drawStickerToCanvas(ctx, s, x, y, w, h, scale) {
    // Background
    ctx.fillStyle = s.bgColor || '#ffffff';
    ctx.fillRect(x, y, w, h);

    const hasChar  = !!(s.charImg && s.charPosition !== 'none');
    const charSide = s.charPosition || 'left';
    const charScale = (s.charSize || 120) / 100;
    const charH_disp = Math.round(h * 1.25 * charScale);
    const charW_disp = Math.round(charH_disp * 0.72);

    const brushInset = hasChar ? Math.round(charW_disp * 0.55) : 4;
    const brushLeft  = hasChar && charSide === 'left'  ? brushInset : 4;
    const brushRight = hasChar && charSide === 'right' ? brushInset : 4;
    const bH = Math.round(h * 0.78);
    const bX = x + brushLeft;
    const bY = y + (h - bH) / 2;
    const bW = w - brushLeft - brushRight;

    // Brush stroke
    const brushDef = BRUSH_STYLES[s.brushStyle] || BRUSH_STYLES.classic;
    const opacity  = (s.brushOpacity !== undefined ? s.brushOpacity : 100) / 100;
    const svgStr   = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${brushDef.viewBox}" preserveAspectRatio="none">
      <path d="${brushDef.path}" fill="${s.color}" opacity="${opacity}"/>
    </svg>`;
    await this.drawSVGToCanvas(ctx, svgStr, bX, bY, bW, bH);

    // Character image
    if (hasChar && s.charImg) {
      const cX = charSide === 'right' ? x + w - charW_disp : x;
      const cY = y + h - charH_disp;
      await this.drawImgToCanvas(ctx, s.charImg, cX, cY, charW_disp, charH_disp);
    }

    // Text
    const textLeft  = bX + 12;
    const textW     = bW - 24;
    const fontSz    = Math.round(s.fontSize * scale);
    const fontDecl  = `${fontSz}px '${s.font}', cursive`;
    const decoText  = this.applyDeco(s.deco, s.text);

    ctx.save();
    ctx.font         = fontDecl;
    ctx.fillStyle    = s.textColor || '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.textAlign    = s.align === 'left' ? 'left' : s.align === 'right' ? 'right' : 'center';

    const tX = s.align === 'left'  ? textLeft :
               s.align === 'right' ? textLeft + textW :
               textLeft + textW / 2;
    const tY = y + h / 2 - (s.subtext ? fontSz * 0.35 : 0);

    ctx.fillText(decoText, tX, tY, textW);

    if (s.subtext) {
      ctx.font = `${Math.round(fontSz * 0.5)}px '${s.font}', cursive`;
      ctx.fillText(s.subtext, tX, tY + fontSz * 0.65, textW);
    }
    ctx.restore();

    // Icon
    if (s.iconImg) {
      const iSz = Math.round(h * 0.38);
      await this.drawImgToCanvas(ctx, s.iconImg, x + w - iSz - 6, y + (h - iSz) / 2, iSz, iSz);
    }
  }

  drawSVGToCanvas(ctx, svgStr, x, y, w, h) {
    return new Promise(resolve => {
      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      const url  = URL.createObjectURL(blob);
      const img  = new Image(w, h);
      img.onload = () => {
        ctx.drawImage(img, x, y, w, h);
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(); };
      img.src = url;
    });
  }

  drawImgToCanvas(ctx, src, x, y, w, h) {
    return new Promise(resolve => {
      if (!src) { resolve(); return; }
      const img = new Image();
      img.onload  = () => { ctx.drawImage(img, x, y, w, h); resolve(); };
      img.onerror = resolve;
      if (!img.src) img.src = src;
      img.src = src;
    });
  }

  /* ── LOCALSTORAGE ─────────────────────────────────────────────── */
  saveToStorage() {
    try {
      const data = {
        stickers:    this.stickers,
        sheetConfig: this.sheetConfig,
        seqColors:   this.sequenceColors,
      };
      localStorage.setItem('velasticker_state', JSON.stringify(data));
    } catch(e) { /* quota or private mode */ }
  }

  loadFromStorage() {
    try {
      const raw = localStorage.getItem('velasticker_state');
      if (!raw) return;
      const data = JSON.parse(raw);
      if (Array.isArray(data.stickers)) this.stickers = data.stickers;
      if (data.sheetConfig) Object.assign(this.sheetConfig, data.sheetConfig);
      if (Array.isArray(data.seqColors)) this.sequenceColors = data.seqColors;
    } catch(e) { /* corrupt data */ }
  }

  /* ── TOAST ────────────────────────────────────────────────────── */
  showToast(msg, type = '') {
    const tc   = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast${type ? ' ' + type : ''}`;
    toast.textContent = msg;
    tc.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
  }

  /* ── BULK ADD ─────────────────────────────────────────────────── */
  bulkAdd(rawText) {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) return;
    const seq = this.sequenceColors;
    const base = this.stickers.length;
    lines.forEach((line, i) => {
      this.stickers.push(this.createSticker(line, {
        color: seq[(base + i) % seq.length],
      }));
    });
    this.renderWordList();
    this.renderSheet();
    this.saveToStorage();
    this.showToast(`${lines.length} stickers agregados`, 'success');
  }

  /* ── UI BINDING ───────────────────────────────────────────────── */
  bindUI() {
    /* ─ Header buttons ─ */
    this.on('btn-new', 'click', () => {
      if (!confirm('¿Crear hoja nueva? Se perderán los cambios no guardados.')) return;
      this.stickers = [];
      this.selectedId = null;
      this.closeEditor();
      this.renderWordList();
      this.renderSheet();
      this.saveToStorage();
    });

    this.on('btn-load-template', 'click', () => {
      this.renderTemplateGrid(this.activeTplCat || 'all');
      document.getElementById('modal-templates').classList.remove('hidden');
    });

    this.on('btn-save-template', 'click', () => {
      document.getElementById('modal-save-template').classList.remove('hidden');
    });

    this.on('btn-sheet-settings', 'click', () => {
      document.getElementById('modal-sheet-settings').classList.remove('hidden');
    });

    this.on('btn-export', 'click', () => {
      this.updateExportInfo();
      document.getElementById('modal-export').classList.remove('hidden');
    });

    /* ─ Sheet add sticker buttons ─ */
    ['btn-add-first', 'btn-add-sticker', 'btn-add-empty'].forEach(id => {
      this.on(id, 'click', () => {
        const s = this.addSticker('Nuevo');
        this.selectSticker(s.id);
      });
    });

    /* ─ Zoom controls ─ */
    this.on('btn-zoom-in',  'click', () => this.setZoom(this.zoom + 0.1));
    this.on('btn-zoom-out', 'click', () => this.setZoom(this.zoom - 0.1));
    this.on('btn-zoom-fit', 'click', () => this.setZoom(0.75));

    /* ─ Editor tabs ─ */
    document.querySelectorAll('.etab').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.etab;
        document.querySelectorAll('.etab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.etab-content').forEach(c => c.classList.add('hidden'));
        btn.classList.add('active');
        document.getElementById(tab)?.classList.remove('hidden');
      });
    });

    /* ─ Editor close ─ */
    this.on('btn-close-editor', 'click', () => { this.selectedId = null; this.closeEditor(); });

    /* ─ Apply / duplicate / delete from editor ─ */
    this.on('btn-apply-sticker',     'click', () => this.applyEditorChanges());
    this.on('btn-duplicate-sticker', 'click', () => this.selectedId && this.duplicateSticker(this.selectedId));
    this.on('btn-delete-sticker',    'click', () => this.selectedId && this.removeSticker(this.selectedId));

    /* ─ Global actions ─ */
    this.on('btn-apply-char-all',  'click', () => this.applyCharToAll());
    this.on('btn-apply-font-all',  'click', () => this.applyFontToAll());
    this.on('btn-color-sequence',  'click', () => {
      const bar = document.getElementById('sequence-bar');
      bar.classList.toggle('hidden');
    });

    /* ─ Sequence bar ─ */
    this.on('btn-apply-sequence', 'click', () => this.applyColorSequence());

    /* ─ Brush color sync ─ */
    const bcp  = document.getElementById('brush-color-pick');
    const bhex = document.getElementById('brush-color-hex');
    if (bcp) {
      bcp.addEventListener('input', () => {
        if (bhex) bhex.value = bcp.value;
        document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      });
    }
    if (bhex) {
      bhex.addEventListener('input', () => {
        if (/^#[0-9a-fA-F]{6}$/.test(bhex.value) && bcp) bcp.value = bhex.value;
      });
    }

    /* ─ Sticker BG color sync ─ */
    const sbgp = document.getElementById('sticker-bg-pick');
    const sbhex = document.getElementById('sticker-bg-hex');
    if (sbgp) sbgp.addEventListener('input', () => { if (sbhex) sbhex.value = sbgp.value; });
    if (sbhex) sbhex.addEventListener('input', () => {
      if (/^#[0-9a-fA-F]{6}$/.test(sbhex.value) && sbgp) sbgp.value = sbhex.value;
    });

    /* ─ Brush opacity label ─ */
    const bop = document.getElementById('brush-opacity');
    if (bop) bop.addEventListener('input', () => {
      document.getElementById('brush-opacity-val').textContent = bop.value + '%';
    });

    /* ─ Char size label ─ */
    const cszEl = document.getElementById('char-size');
    if (cszEl) cszEl.addEventListener('input', () => {
      document.getElementById('char-size-val').textContent = cszEl.value + '%';
    });

    /* ─ Character upload ─ */
    this.on('char-upload-zone', 'click', () => document.getElementById('char-file-input')?.click());
    const charInput = document.getElementById('char-file-input');
    if (charInput) charInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const src = ev.target.result;
        this.globalCharImg = src;
        this.updateCharPreviewInEditor(src);
        if (this.selectedId) {
          const s = this.stickers.find(s => s.id === this.selectedId);
          if (s) { s.charImg = src; this.renderSheet(); this.saveToStorage(); }
        }
      };
      reader.readAsDataURL(file);
    });

    /* ─ Change / remove char ─ */
    this.on('btn-change-char', 'click', () => document.getElementById('char-file-input')?.click());
    this.on('btn-remove-char', 'click', () => {
      if (this.selectedId) {
        const s = this.stickers.find(s => s.id === this.selectedId);
        if (s) { s.charImg = null; this.renderSheet(); this.saveToStorage(); }
      }
      this.updateCharPreviewInEditor(null);
    });

    /* ─ Icon upload ─ */
    this.on('icon-upload-zone', 'click', () => document.getElementById('icon-file-input')?.click());
    const iconInput = document.getElementById('icon-file-input');
    if (iconInput) iconInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const src = ev.target.result;
        this.updateIconPreviewInEditor(src);
        if (this.selectedId) {
          const s = this.stickers.find(s => s.id === this.selectedId);
          if (s) { s.iconImg = src; this.renderSheet(); this.saveToStorage(); }
        }
      };
      reader.readAsDataURL(file);
    });

    this.on('btn-remove-icon', 'click', () => {
      if (this.selectedId) {
        const s = this.stickers.find(s => s.id === this.selectedId);
        if (s) { s.iconImg = null; this.renderSheet(); this.saveToStorage(); }
      }
      this.updateIconPreviewInEditor(null);
    });

    /* ─ Bulk words ─ */
    this.on('btn-bulk-toggle', 'click', () => {
      document.getElementById('bulk-input-area').classList.toggle('hidden');
    });
    this.on('btn-bulk-add', 'click', () => {
      const ta = document.getElementById('bulk-words');
      if (ta) { this.bulkAdd(ta.value); ta.value = ''; }
      document.getElementById('bulk-input-area').classList.add('hidden');
    });

    /* ─ Clear all ─ */
    this.on('btn-clear-all', 'click', () => {
      if (!confirm('¿Eliminar todos los stickers?')) return;
      this.stickers = [];
      this.selectedId = null;
      this.closeEditor();
      this.renderWordList();
      this.renderSheet();
      this.saveToStorage();
    });

    /* ─ Sheet settings modal ─ */
    this.on('btn-apply-sheet-settings', 'click', () => {
      const ps = document.getElementById('paper-size');
      if (ps) this.sheetConfig.paperSize = ps.value;
      const activeCol = document.querySelector('.col-btn.active');
      if (activeCol) this.sheetConfig.columns = parseInt(activeCol.dataset.cols);
      const exDpi = document.getElementById('export-dpi');
      if (exDpi) this.sheetConfig.exportDpi = parseInt(exDpi.value);
      this.sheetConfig.stickerHeight = parseInt(document.getElementById('sticker-h-slider')?.value) || 90;
      this.sheetConfig.gap    = parseInt(document.getElementById('sticker-gap-slider')?.value) || 6;
      this.sheetConfig.margin = parseInt(document.getElementById('sheet-margin-slider')?.value) || 24;
      this.setSheetDimensions();
      this.renderSheet();
      this.saveToStorage();
      document.getElementById('modal-sheet-settings').classList.add('hidden');
      this.showToast('Configuración aplicada', 'success');
    });

    document.querySelectorAll('.col-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.col-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    this.bindSliderLabel('sticker-h-slider',   'sticker-h-val',   'px');
    this.bindSliderLabel('sticker-gap-slider',  'sticker-gap-val', 'px');
    this.bindSliderLabel('sheet-margin-slider', 'sheet-margin-val','px');

    /* ─ Save template modal ─ */
    this.on('btn-do-save-template', 'click', () => {
      const nameEl = document.getElementById('template-name-input');
      const catEl  = document.getElementById('template-cat-select');
      if (!nameEl?.value.trim()) { this.showToast('Escribe un nombre', 'error'); return; }
      const tpl = {
        id:          'user_' + Date.now(),
        name:        nameEl.value.trim(),
        category:    catEl?.value || 'general',
        description: `${this.stickers.length} stickers personalizados`,
        brushStyle:  this.stickers[0]?.brushStyle || 'classic',
        font:        this.stickers[0]?.font || 'Dancing Script',
        stickers:    this.stickers.map(s => ({ text: s.text, subtext: s.subtext, color: s.color })),
      };
      saveUserTemplate(tpl);
      document.getElementById('modal-save-template').classList.add('hidden');
      nameEl.value = '';
      this.showToast(`Plantilla "${tpl.name}" guardada`, 'success');
    });

    /* ─ Export modal ─ */
    document.querySelectorAll('.format-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.exportFormat = btn.dataset.fmt;
        this.updateExportInfo();
      });
    });

    this.on('btn-do-export', 'click', async () => {
      const btn = document.getElementById('btn-do-export');
      if (btn) { btn.disabled = true; btn.textContent = 'Generando...'; }
      try {
        await this.doExport();
      } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-download"></i> Descargar'; }
      }
      document.getElementById('modal-export').classList.add('hidden');
    });

    /* ─ Template categories ─ */
    document.querySelectorAll('.tcat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tcat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTplCat = btn.dataset.cat;
        this.renderTemplateGrid(this.activeTplCat);
      });
    });

    /* ─ Close modals ─ */
    [
      ['close-templates',      'modal-templates'],
      ['close-sheet-settings', 'modal-sheet-settings'],
      ['close-save-template',  'modal-save-template'],
      ['close-export',         'modal-export'],
    ].forEach(([closeBtnId, modalId]) => {
      this.on(closeBtnId, 'click', () =>
        document.getElementById(modalId)?.classList.add('hidden'));
    });

    /* Close on overlay click */
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.add('hidden');
      });
    });

    /* ─ Position buttons ─ */
    document.querySelectorAll('.pos-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pos-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    /* ─ Align buttons ─ */
    document.querySelectorAll('.align-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    /* ─ Deco buttons ─ */
    document.querySelectorAll('.deco-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.deco-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    /* ─ Hide global actions initially ─ */
    const ga = document.getElementById('global-actions');
    if (ga) ga.style.display = 'none';
  }

  on(id, event, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
  }

  bindSliderLabel(sliderId, labelId, suffix = '') {
    const slider = document.getElementById(sliderId);
    const label  = document.getElementById(labelId);
    if (slider && label) {
      slider.addEventListener('input', () => {
        label.textContent = slider.value + suffix;
      });
    }
  }
}

/* ── BOOT ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  window.app = new StickerApp();
  window.app.init();
});
