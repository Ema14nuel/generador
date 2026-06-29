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
    this.zoom = 0.75;
    this.exportFormat = 'png';
    this.globalCharImg = null;
    this.sequenceColors = [...DEFAULT_SEQUENCE];
    this._paletteMode = 'vivid';
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
    this.renderCharLibrary();
    this.renderDecoGrids();
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
      subtext:      opts.subtext      || '',
      color:        opts.color        || '#ff9f43',
      brushStyle:   opts.brushStyle   || 'classic',
      brushImg:     opts.brushImg     || null,
      textColor:    opts.textColor    || '#ffffff',
      font:         opts.font         || 'Dancing Script',
      fontSize:     opts.fontSize     || 32,
      charImg:      opts.charImg      || null,
      charPosition: opts.charPosition || 'left',
      charSize:     opts.charSize     || 120,
      charRotation: opts.charRotation || 0,
      iconImg:      opts.iconImg      || null,
      bgColor:      opts.bgColor      || '#ffffff',
      align:        opts.align        || 'center',
      deco:         opts.deco         || 'none',
      brushOpacity: opts.brushOpacity !== undefined ? opts.brushOpacity : 100,
      strokeDecoL:  opts.strokeDecoL  || '',
      strokeDecoR:  opts.strokeDecoR  || '',
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

  /* ── LIVE UPDATE ──────────────────────────────────────────────── */
  liveProp(prop, val) {
    if (!this.selectedId) return;
    const s = this.stickers.find(s => s.id === this.selectedId);
    if (!s) return;
    s[prop] = val;
    this.liveUpdateSingle(s.id);
    this.saveToStorage();
  }

  liveUpdateSingle(id) {
    const s = this.stickers.find(s => s.id === id);
    if (!s) return;
    const oldWrap = document.querySelector(`.sticker-wrap[data-id="${id}"]`);
    if (!oldWrap) return;
    const newEl = this.createStickerElement(s);
    if (this.selectedId === id) newEl.classList.add('selected');
    oldWrap.replaceWith(newEl);
    this._attachInlineEdit(newEl, s);
  }

  _attachInlineEdit(wrap, s) {
    const mainText = wrap.querySelector('.sticker-main-text');
    if (!mainText) return;
    mainText.style.cursor = 'text';
    mainText.addEventListener('dblclick', e => {
      e.stopPropagation();
      this.startInlineEdit(mainText, s);
    });
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
    document.getElementById('text-size-val').textContent = s.fontSize + 'px';
    this.setVal('text-color-pick',       s.textColor);
    this.setVal('text-color-hex',        s.textColor);
    this.setVal('brush-color-pick',      s.color);
    this.setVal('brush-color-hex',       s.color);
    this.setVal('brush-opacity',         s.brushOpacity);
    document.getElementById('brush-opacity-val').textContent = s.brushOpacity + '%';
    this.setVal('sticker-bg-pick',       s.bgColor || '#ffffff');
    this.setVal('sticker-bg-hex',        s.bgColor || '#ffffff');
    this.setVal('char-size',             s.charSize);
    document.getElementById('char-size-val').textContent = s.charSize + '%';
    this.setVal('char-rotation',         s.charRotation || 0);
    document.getElementById('char-rotation-val').textContent = (s.charRotation || 0) + '°';

    this.setActiveGroup('.pos-btn',         'data-pos',   s.charPosition);
    this.setActiveGroup('.align-btn',       'data-align',  s.align);
    this.setActiveGroup('.deco-btn',        'data-deco',   s.deco);
    this.setActiveGroup('.brush-style-btn', 'data-style',  s.brushStyle);
    this.setActiveGroup('.font-btn',        'data-font',   s.font);
    this.setActiveGroup('.swatch',          'data-color',  s.color);

    // Brush image preview
    this.updateBrushImgPreview(s.brushImg);
    this.updateCharPreviewInEditor(s.charImg);
    this.updateIconPreviewInEditor(s.iconImg);

    // Deco icon selections
    this.updateDecoGridSelection('deco-left-grid',  s.strokeDecoL  || '');
    this.updateDecoGridSelection('deco-right-grid', s.strokeDecoR || '');
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
    s.text         = document.getElementById('sticker-text-input').value.trim() || 'Nuevo';
    s.subtext      = document.getElementById('sticker-subtext-input').value.trim();
    s.fontSize     = parseInt(document.getElementById('text-size').value) || 32;
    s.textColor    = document.getElementById('text-color-pick').value;
    s.color        = document.getElementById('brush-color-pick').value;
    s.brushOpacity = parseInt(document.getElementById('brush-opacity').value) || 100;
    s.bgColor      = document.getElementById('sticker-bg-pick').value;
    s.charSize     = parseInt(document.getElementById('char-size').value) || 120;
    s.charRotation = parseInt(document.getElementById('char-rotation').value) || 0;
    s.charPosition = this.getActiveAttr('.pos-btn',        'data-pos')   || 'left';
    s.align        = this.getActiveAttr('.align-btn',      'data-align') || 'center';
    s.deco         = this.getActiveAttr('.deco-btn',       'data-deco')  || 'none';
    s.brushStyle   = this.getActiveAttr('.brush-style-btn','data-style') || 'classic';
    s.font         = this.getActiveAttr('.font-btn',       'data-font')  || 'Dancing Script';
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
    const item = document.querySelector(`.word-item[data-id="${s.id}"]`);
    if (item) {
      item.querySelector('.word-item-color').style.background = s.color;
      item.querySelector('.word-item-text').textContent = s.text;
    }
    this.renderSheet();
    this.saveToStorage();
    this.showToast('Cambios aplicados', 'success');
  }

  /* ── BRUSH IMAGE ──────────────────────────────────────────────── */
  updateBrushImgPreview(src) {
    const area = document.getElementById('brush-img-preview');
    const btn  = document.getElementById('btn-remove-brush-img');
    if (src) {
      area.innerHTML = `<img src="${src}" alt="Trazo" style="height:36px;object-fit:contain;" />`;
      if (btn) btn.style.display = '';
    } else {
      area.innerHTML = '<i class="fa-solid fa-image"></i><span>Subir imagen de trazo (PNG)</span>';
      if (btn) btn.style.display = 'none';
    }
  }

  /* ── CHAR / ICON IMAGE PREVIEWS ───────────────────────────────── */
  updateCharPreviewInEditor(src) {
    const area    = document.getElementById('char-preview-area');
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
    const area      = document.getElementById('icon-preview-area');
    const removeBtn = document.getElementById('btn-remove-icon');
    if (src) {
      area.innerHTML = `<img src="${src}" alt="Ícono" style="height:36px;object-fit:contain;" />`;
      removeBtn.style.display = '';
    } else {
      area.innerHTML = `<i class="fa-solid fa-star"></i><span>Ícono</span>`;
      removeBtn.style.display = 'none';
    }
  }

  /* ── CHAR LIBRARY ─────────────────────────────────────────────── */
  renderCharLibrary() {
    const grid = document.getElementById('char-library-grid');
    if (!grid) return;
    grid.innerHTML = '';
    CHAR_LIBRARY.forEach(ch => {
      const card = document.createElement('div');
      card.className = 'char-card';
      card.dataset.charId = ch.id;
      card.innerHTML = `<img src="${ch.dataUrl}" alt="${ch.name}" /><span class="char-card-name">${ch.name}</span>`;
      card.addEventListener('click', () => this.selectCharFromLibrary(ch));
      grid.appendChild(card);
    });
  }

  selectCharFromLibrary(ch) {
    document.querySelectorAll('.char-card').forEach(c =>
      c.classList.toggle('active', c.dataset.charId === ch.id));
    this.globalCharImg = ch.dataUrl;
    this.updateCharPreviewInEditor(ch.dataUrl);
    if (this.selectedId) {
      const s = this.stickers.find(s => s.id === this.selectedId);
      if (s) {
        s.charImg = ch.dataUrl;
        if (s.charPosition === 'none') s.charPosition = 'left';
        this.liveUpdateSingle(s.id);
        this.saveToStorage();
      }
    }
  }

  /* ── DECO ICONS ───────────────────────────────────────────────── */
  renderDecoGrids() {
    ['deco-left-grid', 'deco-right-grid'].forEach(gridId => {
      const side = gridId.includes('left') ? 'L' : 'R';
      const grid = document.getElementById(gridId);
      if (!grid) return;
      grid.innerHTML = '';
      DECO_ICONS.forEach(icon => {
        const btn = document.createElement('button');
        btn.className = 'deco-icon-btn';
        btn.dataset.symbol = icon.symbol;
        btn.title = icon.label;
        btn.textContent = icon.symbol || '—';
        btn.addEventListener('click', () => {
          const prop = side === 'L' ? 'strokeDecoL' : 'strokeDecoR';
          const isActive = btn.classList.contains('active');
          grid.querySelectorAll('.deco-icon-btn').forEach(b => b.classList.remove('active'));
          if (!isActive) btn.classList.add('active');
          this.liveProp(prop, isActive ? '' : icon.symbol);
        });
        grid.appendChild(btn);
      });
    });
  }

  updateDecoGridSelection(gridId, symbol) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.querySelectorAll('.deco-icon-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.symbol === symbol && symbol !== '');
    });
  }

  /* ── INLINE TEXT EDITING ──────────────────────────────────────── */
  initInlineEditing() {
    document.querySelectorAll('.sticker-wrap').forEach(wrap => {
      const s = this.stickers.find(s => s.id === wrap.dataset.id);
      if (s) this._attachInlineEdit(wrap, s);
    });
  }

  startInlineEdit(textEl, s) {
    if (document.querySelector('.inline-edit-input')) return;
    const rect  = textEl.getBoundingClientRect();
    const input = document.createElement('input');
    input.type  = 'text';
    input.value = s.text;
    input.className = 'inline-edit-input';
    input.style.cssText = `
      position:fixed;left:${rect.left - 4}px;top:${rect.top - 4}px;
      min-width:${Math.max(rect.width + 8, 80)}px;height:${Math.max(rect.height + 8, 34)}px;
      font-family:'${s.font}',cursive;font-size:${s.fontSize}px;color:${s.textColor};
      background:rgba(0,0,0,0.82);border:2px solid #fdcb6e;border-radius:5px;
      padding:2px 6px;z-index:9999;text-align:${s.align||'center'};outline:none;
      box-shadow:0 0 0 3px rgba(253,203,110,0.25);`;
    document.body.appendChild(input);
    input.focus();
    input.select();

    let done = false;
    const commit = () => {
      if (done) return;
      done = true;
      const newText = input.value.trim() || s.text;
      input.removeEventListener('blur', commit);
      input.remove();
      if (newText === s.text) return;
      s.text = newText;
      this.renderWordList();
      this.renderSheet();
      this.saveToStorage();
      if (this.selectedId === s.id) {
        const ti = document.getElementById('sticker-text-input');
        if (ti) ti.value = newText;
        document.getElementById('editor-title').textContent = `Editando: ${newText}`;
      }
    };

    input.addEventListener('blur', commit);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter')  { e.preventDefault(); commit(); }
      if (e.key === 'Escape') { done = true; input.removeEventListener('blur', commit); input.remove(); }
    });
  }

  /* ── SHEET RENDERING ──────────────────────────────────────────── */
  setSheetDimensions() {
    const paper = PAPER_SIZES[this.sheetConfig.paperSize] || PAPER_SIZES.letter;
    const el    = document.getElementById('sheet-paper');
    el.style.width     = paper.w + 'px';
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
    container.querySelectorAll('.sheet-col-wrap').forEach(el => el.remove());
    container.style.padding = this.sheetConfig.margin + 'px';

    if (this.stickers.length === 0) {
      empty.style.display = '';
      this.updateSheetInfo();
      return;
    }
    empty.style.display = 'none';

    const cols   = this.sheetConfig.columns;
    const gap    = this.sheetConfig.gap;
    const perCol = Math.ceil(this.stickers.length / cols);

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
    this.initInlineEditing();
  }

  updateSheetInfo() {
    const paper = PAPER_SIZES[this.sheetConfig.paperSize] || PAPER_SIZES.letter;
    const c = this.sheetConfig.columns;
    document.getElementById('sheet-info').textContent =
      `${paper.label} · ${c} columna${c !== 1 ? 's' : ''} · ${this.stickers.length} sticker${this.stickers.length !== 1 ? 's' : ''}`;
  }

  createStickerElement(s) {
    const sH        = this.sheetConfig.stickerHeight;
    const hasChar   = !!(s.charImg && s.charPosition !== 'none');
    const charSide  = s.charPosition || 'left';
    const charScale = (s.charSize || 120) / 100;
    const charRot   = s.charRotation || 0;

    const charDisplayH = Math.round(sH * 1.25 * charScale);
    const charDisplayW = Math.round(charDisplayH * 0.72);

    const brushInset = hasChar ? Math.round(charDisplayW * 0.55) : 4;
    const brushLeft  = hasChar && charSide === 'left'  ? brushInset : 4;
    const brushRight = hasChar && charSide === 'right' ? brushInset : 4;
    const brushH     = Math.round(sH * 0.78);

    const textLeft  = brushLeft + 10;
    const textRight = brushRight + 10;

    const brushDef = BRUSH_STYLES[s.brushStyle] || BRUSH_STYLES.classic;
    const opacity  = ((s.brushOpacity !== undefined ? s.brushOpacity : 100) / 100).toFixed(2);
    const decoText = this.applyDeco(s.deco, this.esc(s.text));

    // Brush area
    let brushHTML;
    if (s.brushImg) {
      brushHTML = `<img src="${s.brushImg}" alt="" style="width:100%;height:100%;object-fit:fill;" />`;
    } else {
      brushHTML = `<svg viewBox="${brushDef.viewBox}" preserveAspectRatio="none" style="width:100%;height:100%;display:block;">
        ${brushDef.render(s.color, opacity, s.id)}
      </svg>`;
    }

    // Character
    let charHTML = '';
    if (hasChar) {
      const cStyle = charSide === 'right'
        ? `left:auto;right:0;top:50%;transform:translateY(-50%);width:${charDisplayW}px;height:${charDisplayH}px;`
        : `left:0;top:50%;transform:translateY(-50%);width:${charDisplayW}px;height:${charDisplayH}px;`;
      const imgStyle = `width:100%;height:100%;object-fit:contain;object-position:center bottom;transform:rotate(${charRot}deg);transition:transform 0.1s;`;
      charHTML = `<div class="sticker-char-zone" style="${cStyle}">
        <img src="${s.charImg}" alt="" style="${imgStyle}" />
      </div>`;
    }

    // Decorative icons
    let decoIconsHTML = '';
    if (s.strokeDecoL) {
      decoIconsHTML += `<span class="sticker-deco-icon" style="left:${textLeft + 2}px;">${s.strokeDecoL}</span>`;
    }
    if (s.strokeDecoR) {
      decoIconsHTML += `<span class="sticker-deco-icon" style="right:${textRight + 2}px;">${s.strokeDecoR}</span>`;
    }

    // Icon
    let iconHTML = '';
    if (s.iconImg) {
      const iconSz = Math.round(sH * 0.38);
      iconHTML = `<div class="sticker-icon-zone" style="right:6px;width:${iconSz}px;height:${iconSz}px;">
        <img src="${s.iconImg}" alt="" style="width:100%;height:100%;object-fit:contain;" />
      </div>`;
    }

    const fontDecl    = `'${s.font}',cursive`;
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
            ${brushHTML}
          </div>
          <div class="sticker-text-wrap" style="left:${textLeft}px;right:${textRight}px;top:0;bottom:0;text-align:${s.align||'center'};z-index:2;">
            <span class="sticker-main-text" style="font-family:${fontDecl};font-size:${s.fontSize}px;color:${s.textColor};" title="Doble clic para editar">${decoText}</span>
            ${subtextHTML}
          </div>
          ${decoIconsHTML}
        </div>
        ${iconHTML}
      </div>`;

    wrap.addEventListener('click', () => this.selectSticker(s.id));
    return wrap;
  }

  esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  escSVG(str) {
    return String(str || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&apos;');
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
        this._dragSrc = item; item.style.opacity = '0.4';
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.dataset.id);
      });
      item.addEventListener('dragend', () => { item.style.opacity = ''; });
      item.addEventListener('dragover', e => {
        e.preventDefault(); e.dataTransfer.dropEffect = 'move';
        list.querySelectorAll('.word-item').forEach(i => i.style.outline = '');
        item.style.outline = '2px dashed #fdcb6e';
      });
      item.addEventListener('drop', e => {
        e.stopPropagation(); e.preventDefault(); item.style.outline = '';
        if (this._dragSrc && this._dragSrc !== item) {
          const fi = this.stickers.findIndex(s => s.id === this._dragSrc.dataset.id);
          const ti = this.stickers.findIndex(s => s.id === item.dataset.id);
          if (fi !== -1 && ti !== -1) {
            const [removed] = this.stickers.splice(fi, 1);
            this.stickers.splice(ti, 0, removed);
            this.renderWordList(); this.renderSheet(); this.saveToStorage();
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
        ${style.render('#ff9f43', 1, 'prev_' + key)}
      </svg>`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.brush-style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.liveProp('brushStyle', key);
      });
      grid.appendChild(btn);
    });
    const first = grid.querySelector('.brush-style-btn');
    if (first) first.classList.add('active');
  }

  renderColorSwatches() {
    const swatches = document.getElementById('color-swatches');
    if (!swatches) return;
    swatches.innerHTML = '';
    const palette = this._paletteMode === 'pastel' ? PASTEL_COLORS : COLOR_PRESETS;
    palette.forEach(c => {
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
        this.liveProp('color', c.value);
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
        this.liveProp('font', f.id);
      });
      grid.appendChild(btn);
    });
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
      sp.style.background = c; sp.title = c; sp.dataset.idx = i;
      sp.addEventListener('click', () => {
        const pick = document.createElement('input');
        pick.type = 'color'; pick.value = c;
        pick.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
        document.body.appendChild(pick); pick.click();
        pick.addEventListener('input', () => { this.sequenceColors[i] = pick.value; this.renderSequenceBar(); });
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
    const all      = getAllTemplates();
    const filtered = cat === 'all' ? all : all.filter(t => t.category === cat);
    filtered.forEach(tpl => {
      const card = document.createElement('div');
      card.className = 'tpl-card';
      const previewStickers = tpl.stickers.slice(0, 3).map(st =>
        `<div class="tpl-sticker-preview" style="background:${st.color};font-family:'${tpl.font||'Dancing Script'}',cursive;">${this.esc(st.text)}</div>`
      ).join('');
      card.innerHTML = `<div class="tpl-preview">${previewStickers}</div>
        <div class="tpl-info"><h4>${this.esc(tpl.name)}</h4>
        <p>${this.esc(tpl.description || '')} · ${tpl.stickers.length} stickers</p></div>`;
      card.addEventListener('click', () => this.loadTemplate(tpl));
      grid.appendChild(card);
    });
    if (filtered.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">Sin plantillas en esta categoría</p>';
    }
  }

  loadTemplate(tpl) {
    this.stickers = tpl.stickers.map(st => this.createSticker(st.text, {
      subtext: st.subtext || '', color: st.color || '#ff9f43',
      brushStyle: tpl.brushStyle || 'classic', font: tpl.font || 'Dancing Script', textColor: '#ffffff',
    }));
    this.selectedId = null;
    this.closeEditor();
    this.renderWordList(); this.renderSheet(); this.saveToStorage();
    document.getElementById('modal-templates').classList.add('hidden');
    this.showToast(`Plantilla "${tpl.name}" cargada`, 'success');
  }

  /* ── SEQUENCE AUTO-COLOR ──────────────────────────────────────── */
  applyColorSequence() {
    const seq = this.sequenceColors;
    this.stickers.forEach((s, i) => { s.color = seq[i % seq.length]; });
    this.renderWordList(); this.renderSheet(); this.saveToStorage();
    this.showToast('Secuencia de colores aplicada', 'success');
  }

  applyCharToAll() {
    if (!this.globalCharImg) {
      this.showToast('Primero selecciona un personaje', 'error'); return;
    }
    const rot = parseInt(document.getElementById('char-rotation')?.value) || 0;
    const sz  = parseInt(document.getElementById('char-size')?.value)     || 120;
    this.stickers.forEach(s => {
      s.charImg = this.globalCharImg;
      s.charPosition = s.charPosition === 'none' ? 'left' : s.charPosition;
      s.charRotation = rot;
      s.charSize = sz;
    });
    this.renderSheet(); this.saveToStorage();
    this.showToast('Personaje aplicado a todos los stickers', 'success');
  }

  applyFontToAll() {
    const font = this.getActiveAttr('.font-btn', 'data-font') || 'Dancing Script';
    this.stickers.forEach(s => { s.font = font; });
    this.renderSheet(); this.saveToStorage();
    this.showToast(`Fuente "${font}" aplicada a todos`, 'success');
  }

  /* ── EXPORT PNG/JPG ───────────────────────────────────────────── */
  updateExportInfo() {
    const info = document.getElementById('export-info');
    if (!info) return;
    if (this.exportFormat === 'svg') {
      info.textContent = `SVG vectorial · editable en Illustrator / Inkscape · ${this.stickers.length} stickers`;
      return;
    }
    const paper = PAPER_SIZES[this.sheetConfig.paperSize] || PAPER_SIZES.letter;
    const dpi   = this.sheetConfig.exportDpi;
    const W = paper.w * dpi, H = paper.h * dpi;
    const pxDpi = dpi === 1 ? '150 DPI' : dpi === 2 ? '300 DPI' : '600 DPI';
    info.textContent = `${W} × ${H} px · ${pxDpi} · ${this.stickers.length} stickers`;
  }

  async doExport() {
    const fmt   = this.exportFormat;
    const dpi   = this.sheetConfig.exportDpi;
    const paper = PAPER_SIZES[this.sheetConfig.paperSize] || PAPER_SIZES.letter;
    const W = paper.w * dpi, H = paper.h * dpi;

    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
    await document.fonts.ready;

    const margin = this.sheetConfig.margin  * dpi;
    const gap    = this.sheetConfig.gap     * dpi;
    const sH     = this.sheetConfig.stickerHeight * dpi;
    const cols   = this.sheetConfig.columns;
    const avail  = W - margin * 2;
    const colW   = (avail - gap * (cols - 1)) / cols;
    const perCol = Math.ceil(this.stickers.length / cols);

    for (let c = 0; c < cols; c++) {
      const colX = margin + c * (colW + gap);
      const start = c * perCol, end = Math.min(start + perCol, this.stickers.length);
      for (let i = start; i < end; i++) {
        await this.drawStickerToCanvas(ctx, this.stickers[i], colX, margin + (i - start) * (sH + gap), colW, sH, dpi);
      }
    }

    const filename = (document.getElementById('export-filename').value || 'hoja-velas').replace(/[^a-z0-9_\-]/gi, '_');
    const link = document.createElement('a');
    link.download = `${filename}.${fmt}`;
    link.href = canvas.toDataURL(fmt === 'jpg' ? 'image/jpeg' : 'image/png', 0.95);
    link.click();
    this.showToast('Exportación completada', 'success');
  }

  async drawStickerToCanvas(ctx, s, x, y, w, h, scale) {
    ctx.fillStyle = s.bgColor || '#ffffff';
    ctx.fillRect(x, y, w, h);

    const hasChar   = !!(s.charImg && s.charPosition !== 'none');
    const charSide  = s.charPosition || 'left';
    const charScale = (s.charSize || 120) / 100;
    const charH_d   = Math.round(h * 1.25 * charScale);
    const charW_d   = Math.round(charH_d * 0.72);

    const brushInset = hasChar ? Math.round(charW_d * 0.55) : 4;
    const brushLeft  = hasChar && charSide === 'left'  ? brushInset : 4;
    const brushRight = hasChar && charSide === 'right' ? brushInset : 4;
    const bH = Math.round(h * 0.78);
    const bX = x + brushLeft, bY = y + (h - bH) / 2, bW = w - brushLeft - brushRight;

    if (s.brushImg) {
      await this.drawImgToCanvas(ctx, s.brushImg, bX, bY, bW, bH);
    } else {
      const brushDef = BRUSH_STYLES[s.brushStyle] || BRUSH_STYLES.classic;
      const opacity  = (s.brushOpacity !== undefined ? s.brushOpacity : 100) / 100;
      const svgStr   = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${brushDef.viewBox}" preserveAspectRatio="none">
        ${brushDef.render(s.color, opacity.toFixed(2), s.id + '_exp')}
      </svg>`;
      await this.drawSVGToCanvas(ctx, svgStr, bX, bY, bW, bH);
    }

    if (hasChar && s.charImg) {
      const cX = charSide === 'right' ? x + w - charW_d : x;
      const cY = y + h - charH_d;
      ctx.save();
      ctx.translate(cX + charW_d / 2, cY + charH_d / 2);
      ctx.rotate(((s.charRotation || 0) * Math.PI) / 180);
      await this.drawImgToCanvas(ctx, s.charImg, -charW_d / 2, -charH_d / 2, charW_d, charH_d);
      ctx.restore();
    }

    const textLeft = bX + 12, textW = bW - 24;
    const fontSz   = Math.round(s.fontSize * scale);
    const decoText = this.applyDeco(s.deco, s.text);

    ctx.save();
    ctx.font = `${fontSz}px '${s.font}', cursive`;
    ctx.fillStyle = s.textColor || '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = s.align === 'left' ? 'left' : s.align === 'right' ? 'right' : 'center';
    const tX = s.align === 'left' ? textLeft : s.align === 'right' ? textLeft + textW : textLeft + textW / 2;
    const tY = y + h / 2 - (s.subtext ? fontSz * 0.35 : 0);
    ctx.fillText(decoText, tX, tY, textW);
    if (s.subtext) {
      ctx.font = `${Math.round(fontSz * 0.5)}px '${s.font}', cursive`;
      ctx.fillText(s.subtext, tX, tY + fontSz * 0.65, textW);
    }

    // Deco icons in canvas
    if (s.strokeDecoL || s.strokeDecoR) {
      ctx.font = `${Math.round(fontSz * 0.6)}px sans-serif`;
      ctx.textBaseline = 'middle';
      if (s.strokeDecoL) { ctx.textAlign = 'left';  ctx.fillText(s.strokeDecoL, bX + 8, y + h / 2); }
      if (s.strokeDecoR) { ctx.textAlign = 'right'; ctx.fillText(s.strokeDecoR, bX + bW - 8, y + h / 2); }
    }
    ctx.restore();

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
      img.onload  = () => { ctx.drawImage(img, x, y, w, h); URL.revokeObjectURL(url); resolve(); };
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
      img.src = src;
    });
  }

  /* ── EXPORT SVG ───────────────────────────────────────────────── */
  async doExportSVG() {
    const paper  = PAPER_SIZES[this.sheetConfig.paperSize] || PAPER_SIZES.letter;
    const W = paper.w, H = paper.h;
    const margin = this.sheetConfig.margin, gap = this.sheetConfig.gap;
    const sH = this.sheetConfig.stickerHeight, cols = this.sheetConfig.columns;
    const avail = W - margin * 2;
    const colW  = (avail - gap * (cols - 1)) / cols;
    const perCol = Math.ceil(this.stickers.length / cols);

    const fontNames = [...new Set(this.stickers.map(s => s.font))];
    const fontFaces = await Promise.all(fontNames.map(f => this.loadFontFace(f)));

    let stickersStr = '';
    for (let c = 0; c < cols; c++) {
      const colX = margin + c * (colW + gap);
      const start = c * perCol, end = Math.min(start + perCol, this.stickers.length);
      for (let i = start; i < end; i++) {
        stickersStr += this.buildStickerSVGStr(this.stickers[i], colX, margin + (i - start) * (sH + gap), colW, sH);
      }
    }

    const svgDoc = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <style>
${fontFaces.filter(Boolean).join('\n')}
  </style>
  <rect width="${W}" height="${H}" fill="white"/>
${stickersStr}</svg>`;

    const filename = (document.getElementById('export-filename')?.value || 'hoja-velas').replace(/[^a-z0-9_\-]/gi, '_');
    const blob = new Blob([svgDoc], { type: 'image/svg+xml' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${filename}.svg`; link.href = url; link.click();
    URL.revokeObjectURL(url);
    this.showToast('SVG exportado — editable en Illustrator / Inkscape', 'success');
  }

  async loadFontFace(fontName) {
    const map = {
      'Dancing Script': 'dancing-script/files/dancing-script-latin-400-normal.woff2',
      'Caveat':         'caveat/files/caveat-latin-400-normal.woff2',
      'Pacifico':       'pacifico/files/pacifico-latin-400-normal.woff2',
      'Satisfy':        'satisfy/files/satisfy-latin-400-normal.woff2',
    };
    const path = map[fontName];
    if (!path) return '';
    try {
      const res = await fetch(`node_modules/@fontsource/${path}`);
      if (!res.ok) return '';
      const buf = await res.arrayBuffer();
      const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
      return `    @font-face { font-family: '${fontName}'; src: url('data:font/woff2;base64,${b64}') format('woff2'); font-weight: 400; font-style: normal; }`;
    } catch(e) { return ''; }
  }

  buildStickerSVGStr(s, x, y, w, h) {
    const hasChar   = !!(s.charImg && s.charPosition !== 'none');
    const charSide  = s.charPosition || 'left';
    const charScale = (s.charSize || 120) / 100;
    const charH_d   = Math.round(h * 1.25 * charScale);
    const charW_d   = Math.round(charH_d * 0.72);

    const brushInset = hasChar ? Math.round(charW_d * 0.55) : 4;
    const brushLeft  = hasChar && charSide === 'left'  ? brushInset : 4;
    const brushRight = hasChar && charSide === 'right' ? brushInset : 4;
    const bH = Math.round(h * 0.78);
    const bX = x + brushLeft, bY = y + (h - bH) / 2, bW = w - brushLeft - brushRight;

    const brushDef = BRUSH_STYLES[s.brushStyle] || BRUSH_STYLES.classic;
    const opacity  = ((s.brushOpacity !== undefined ? s.brushOpacity : 100) / 100).toFixed(2);
    const decoText = this.applyDeco(s.deco, s.text);

    let brushSvg = s.brushImg
      ? `  <image x="${bX}" y="${bY}" width="${bW}" height="${bH}" href="${s.brushImg}" preserveAspectRatio="none"/>`
      : `  <svg x="${bX}" y="${bY}" width="${bW}" height="${bH}" viewBox="${brushDef.viewBox}" preserveAspectRatio="none">
    ${brushDef.render(s.color, opacity, s.id + '_svg')}
  </svg>`;

    let charSvg = '';
    if (hasChar && s.charImg) {
      const cX = charSide === 'right' ? x + w - charW_d : x;
      const cY = y + h - charH_d;
      const cx = cX + charW_d / 2, cy = cY + charH_d / 2;
      const rot = s.charRotation || 0;
      charSvg = `  <image x="${cX}" y="${cY}" width="${charW_d}" height="${charH_d}" href="${s.charImg}" preserveAspectRatio="xMidYMax meet" transform="rotate(${rot},${cx},${cy})"/>`;
    }

    const textLeft = bX + 12, textW = bW - 24;
    const anchor   = s.align === 'left' ? 'start' : s.align === 'right' ? 'end' : 'middle';
    const tX = s.align === 'left' ? textLeft : s.align === 'right' ? textLeft + textW : textLeft + textW / 2;
    const tY = y + h / 2 + (s.subtext ? -(s.fontSize * 0.35) : s.fontSize * 0.35);
    const font = `'${s.font}', cursive`;

    let textSvg = `  <text x="${tX}" y="${tY}" font-family="${font}" font-size="${s.fontSize}" fill="${s.textColor}" text-anchor="${anchor}">${this.escSVG(decoText)}</text>`;
    if (s.subtext) {
      textSvg += `\n  <text x="${tX}" y="${tY + s.fontSize * 0.65}" font-family="${font}" font-size="${Math.round(s.fontSize * 0.5)}" fill="${s.textColor}" text-anchor="${anchor}">${this.escSVG(s.subtext)}</text>`;
    }

    let decoSvg = '';
    const decoFontSz = Math.round(s.fontSize * 0.6);
    if (s.strokeDecoL) decoSvg += `  <text x="${bX + 8}" y="${y + h / 2}" font-size="${decoFontSz}" dominant-baseline="middle">${this.escSVG(s.strokeDecoL)}</text>`;
    if (s.strokeDecoR) decoSvg += `  <text x="${bX + bW - 8}" y="${y + h / 2}" font-size="${decoFontSz}" text-anchor="end" dominant-baseline="middle">${this.escSVG(s.strokeDecoR)}</text>`;

    return `<g>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${s.bgColor || '#ffffff'}"/>
${brushSvg}
${charSvg}
${textSvg}
${decoSvg}
</g>\n`;
  }

  /* ── LOCALSTORAGE ─────────────────────────────────────────────── */
  saveToStorage() {
    try {
      localStorage.setItem('velasticker_state', JSON.stringify({
        stickers: this.stickers, sheetConfig: this.sheetConfig, seqColors: this.sequenceColors,
      }));
    } catch(e) {}
  }

  loadFromStorage() {
    try {
      const raw = localStorage.getItem('velasticker_state');
      if (!raw) return;
      const data = JSON.parse(raw);
      if (Array.isArray(data.stickers)) this.stickers = data.stickers;
      if (data.sheetConfig) Object.assign(this.sheetConfig, data.sheetConfig);
      if (Array.isArray(data.seqColors)) this.sequenceColors = data.seqColors;
    } catch(e) {}
  }

  /* ── TOAST ────────────────────────────────────────────────────── */
  showToast(msg, type = '') {
    const tc    = document.getElementById('toast-container');
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
    const seq = this.sequenceColors, base = this.stickers.length;
    lines.forEach((line, i) => this.stickers.push(this.createSticker(line, { color: seq[(base + i) % seq.length] })));
    this.renderWordList(); this.renderSheet(); this.saveToStorage();
    this.showToast(`${lines.length} stickers agregados`, 'success');
  }

  /* ── UI BINDING ───────────────────────────────────────────────── */
  bindUI() {
    /* ─ Header ─ */
    this.on('btn-new', 'click', () => {
      if (!confirm('¿Crear hoja nueva? Se perderán los cambios no guardados.')) return;
      this.stickers = []; this.selectedId = null; this.closeEditor();
      this.renderWordList(); this.renderSheet(); this.saveToStorage();
    });
    this.on('btn-load-template', 'click', () => {
      this.renderTemplateGrid(this.activeTplCat || 'all');
      document.getElementById('modal-templates').classList.remove('hidden');
    });
    this.on('btn-save-template',  'click', () => document.getElementById('modal-save-template').classList.remove('hidden'));
    this.on('btn-sheet-settings', 'click', () => document.getElementById('modal-sheet-settings').classList.remove('hidden'));
    this.on('btn-export', 'click', () => { this.updateExportInfo(); document.getElementById('modal-export').classList.remove('hidden'); });

    /* ─ Add sticker ─ */
    ['btn-add-first', 'btn-add-sticker', 'btn-add-empty'].forEach(id => {
      this.on(id, 'click', () => { const s = this.addSticker('Nuevo'); this.selectSticker(s.id); });
    });

    /* ─ Zoom ─ */
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

    this.on('btn-close-editor', 'click', () => { this.selectedId = null; this.closeEditor(); });

    /* ─ Apply / dup / delete ─ */
    this.on('btn-apply-sticker',     'click', () => this.applyEditorChanges());
    this.on('btn-duplicate-sticker', 'click', () => this.selectedId && this.duplicateSticker(this.selectedId));
    this.on('btn-delete-sticker',    'click', () => this.selectedId && this.removeSticker(this.selectedId));

    /* ─ Global actions ─ */
    this.on('btn-apply-char-all', 'click', () => this.applyCharToAll());
    this.on('btn-apply-font-all', 'click', () => this.applyFontToAll());
    this.on('btn-color-sequence', 'click', () => document.getElementById('sequence-bar').classList.toggle('hidden'));
    this.on('btn-apply-sequence', 'click', () => this.applyColorSequence());

    /* ─ LIVE: char size ─ */
    const cszEl = document.getElementById('char-size');
    if (cszEl) cszEl.addEventListener('input', () => {
      const v = parseInt(cszEl.value) || 120;
      document.getElementById('char-size-val').textContent = v + '%';
      this.liveProp('charSize', v);
    });

    /* ─ LIVE: char rotation (NEW) ─ */
    const crotEl = document.getElementById('char-rotation');
    if (crotEl) crotEl.addEventListener('input', () => {
      const v = parseInt(crotEl.value) || 0;
      document.getElementById('char-rotation-val').textContent = v + '°';
      this.liveProp('charRotation', v);
    });

    /* ─ LIVE: text size ─ */
    const tszEl = document.getElementById('text-size');
    if (tszEl) tszEl.addEventListener('input', () => {
      const v = parseInt(tszEl.value) || 32;
      document.getElementById('text-size-val').textContent = v + 'px';
      this.liveProp('fontSize', v);
    });

    /* ─ LIVE: text color ─ */
    const tcpick = document.getElementById('text-color-pick');
    const tchex  = document.getElementById('text-color-hex');
    if (tcpick) tcpick.addEventListener('input', () => {
      if (tchex) tchex.value = tcpick.value;
      this.liveProp('textColor', tcpick.value);
    });
    if (tchex) tchex.addEventListener('input', () => {
      if (/^#[0-9a-fA-F]{6}$/.test(tchex.value)) {
        if (tcpick) tcpick.value = tchex.value;
        this.liveProp('textColor', tchex.value);
      }
    });

    /* ─ LIVE: brush color ─ */
    const bcp  = document.getElementById('brush-color-pick');
    const bhex = document.getElementById('brush-color-hex');
    if (bcp)  bcp.addEventListener('input',  () => {
      if (bhex) bhex.value = bcp.value;
      document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      this.liveProp('color', bcp.value);
    });
    if (bhex) bhex.addEventListener('input', () => {
      if (/^#[0-9a-fA-F]{6}$/.test(bhex.value)) {
        if (bcp) bcp.value = bhex.value;
        this.liveProp('color', bhex.value);
      }
    });

    /* ─ LIVE: brush opacity ─ */
    const bop = document.getElementById('brush-opacity');
    if (bop) bop.addEventListener('input', () => {
      const v = parseInt(bop.value) || 100;
      document.getElementById('brush-opacity-val').textContent = v + '%';
      this.liveProp('brushOpacity', v);
    });

    /* ─ LIVE: bg color ─ */
    const sbgp = document.getElementById('sticker-bg-pick');
    const sbhex = document.getElementById('sticker-bg-hex');
    if (sbgp)  sbgp.addEventListener('input',  () => { if (sbhex) sbhex.value = sbgp.value; this.liveProp('bgColor', sbgp.value); });
    if (sbhex) sbhex.addEventListener('input', () => {
      if (/^#[0-9a-fA-F]{6}$/.test(sbhex.value)) { if (sbgp) sbgp.value = sbhex.value; this.liveProp('bgColor', sbhex.value); }
    });

    /* ─ LIVE: position / align / deco buttons ─ */
    document.querySelectorAll('.pos-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pos-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.liveProp('charPosition', btn.dataset.pos);
      });
    });
    document.querySelectorAll('.align-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.liveProp('align', btn.dataset.align);
      });
    });
    document.querySelectorAll('.deco-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.deco-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.liveProp('deco', btn.dataset.deco);
      });
    });

    /* ─ Live: text input ─ */
    const textInput = document.getElementById('sticker-text-input');
    if (textInput) textInput.addEventListener('input', () => {
      const txt = textInput.value.trim() || 'Nuevo';
      if (!this.selectedId) return;
      const s = this.stickers.find(s => s.id === this.selectedId);
      if (!s) return;
      s.text = txt;
      this.liveUpdateSingle(s.id);
      const item = document.querySelector(`.word-item[data-id="${s.id}"] .word-item-text`);
      if (item) item.textContent = txt;
    });

    /* ─ Palette toggle ─ */
    document.querySelectorAll('.palette-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.palette-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._paletteMode = btn.dataset.mode;
        this.renderColorSwatches();
      });
    });

    /* ─ Char library toggle ─ */
    this.on('btn-char-lib-toggle', 'click', () => {
      const grid = document.getElementById('char-library-grid');
      grid?.classList.toggle('hidden');
      const btn = document.getElementById('btn-char-lib-toggle');
      if (btn) btn.textContent = grid?.classList.contains('hidden') ? 'Mostrar' : 'Ocultar';
    });

    /* ─ Char image upload ─ */
    this.on('char-upload-zone', 'click', () => document.getElementById('char-file-input')?.click());
    const charInput = document.getElementById('char-file-input');
    if (charInput) charInput.addEventListener('change', e => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const src = ev.target.result;
        this.globalCharImg = src;
        this.updateCharPreviewInEditor(src);
        document.querySelectorAll('.char-card').forEach(c => c.classList.remove('active'));
        if (this.selectedId) {
          const s = this.stickers.find(s => s.id === this.selectedId);
          if (s) { s.charImg = src; this.liveUpdateSingle(s.id); this.saveToStorage(); }
        }
      };
      reader.readAsDataURL(file);
    });

    this.on('btn-change-char', 'click', () => document.getElementById('char-file-input')?.click());
    this.on('btn-remove-char', 'click', () => {
      if (this.selectedId) {
        const s = this.stickers.find(s => s.id === this.selectedId);
        if (s) { s.charImg = null; this.liveUpdateSingle(s.id); this.saveToStorage(); }
      }
      this.updateCharPreviewInEditor(null);
      document.querySelectorAll('.char-card').forEach(c => c.classList.remove('active'));
    });

    /* ─ Brush image upload (NEW) ─ */
    this.on('brush-img-upload-zone', 'click', () => document.getElementById('brush-img-input')?.click());
    const brushImgInput = document.getElementById('brush-img-input');
    if (brushImgInput) brushImgInput.addEventListener('change', e => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const src = ev.target.result;
        this.updateBrushImgPreview(src);
        if (this.selectedId) {
          const s = this.stickers.find(s => s.id === this.selectedId);
          if (s) { s.brushImg = src; this.liveUpdateSingle(s.id); this.saveToStorage(); }
        }
      };
      reader.readAsDataURL(file);
    });

    this.on('btn-remove-brush-img', 'click', () => {
      this.updateBrushImgPreview(null);
      if (this.selectedId) {
        const s = this.stickers.find(s => s.id === this.selectedId);
        if (s) { s.brushImg = null; this.liveUpdateSingle(s.id); this.saveToStorage(); }
      }
    });

    /* ─ Icon upload ─ */
    this.on('icon-upload-zone', 'click', () => document.getElementById('icon-file-input')?.click());
    const iconInput = document.getElementById('icon-file-input');
    if (iconInput) iconInput.addEventListener('change', e => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const src = ev.target.result;
        this.updateIconPreviewInEditor(src);
        if (this.selectedId) {
          const s = this.stickers.find(s => s.id === this.selectedId);
          if (s) { s.iconImg = src; this.liveUpdateSingle(s.id); this.saveToStorage(); }
        }
      };
      reader.readAsDataURL(file);
    });
    this.on('btn-remove-icon', 'click', () => {
      if (this.selectedId) {
        const s = this.stickers.find(s => s.id === this.selectedId);
        if (s) { s.iconImg = null; this.liveUpdateSingle(s.id); this.saveToStorage(); }
      }
      this.updateIconPreviewInEditor(null);
    });

    /* ─ Bulk words ─ */
    this.on('btn-bulk-toggle', 'click', () => document.getElementById('bulk-input-area').classList.toggle('hidden'));
    this.on('btn-bulk-add', 'click', () => {
      const ta = document.getElementById('bulk-words');
      if (ta) { this.bulkAdd(ta.value); ta.value = ''; }
      document.getElementById('bulk-input-area').classList.add('hidden');
    });

    /* ─ Clear all ─ */
    this.on('btn-clear-all', 'click', () => {
      if (!confirm('¿Eliminar todos los stickers?')) return;
      this.stickers = []; this.selectedId = null; this.closeEditor();
      this.renderWordList(); this.renderSheet(); this.saveToStorage();
    });

    /* ─ Sheet settings ─ */
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
      this.setSheetDimensions(); this.renderSheet(); this.saveToStorage();
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

    /* ─ Save template ─ */
    this.on('btn-do-save-template', 'click', () => {
      const nameEl = document.getElementById('template-name-input');
      const catEl  = document.getElementById('template-cat-select');
      if (!nameEl?.value.trim()) { this.showToast('Escribe un nombre', 'error'); return; }
      const tpl = {
        id: 'user_' + Date.now(), name: nameEl.value.trim(),
        category: catEl?.value || 'general',
        description: `${this.stickers.length} stickers personalizados`,
        brushStyle: this.stickers[0]?.brushStyle || 'classic',
        font: this.stickers[0]?.font || 'Dancing Script',
        stickers: this.stickers.map(s => ({ text: s.text, subtext: s.subtext, color: s.color })),
      };
      saveUserTemplate(tpl);
      document.getElementById('modal-save-template').classList.add('hidden');
      nameEl.value = '';
      this.showToast(`Plantilla "${tpl.name}" guardada`, 'success');
    });

    /* ─ Export ─ */
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
        if (this.exportFormat === 'svg') await this.doExportSVG();
        else await this.doExport();
      } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-download"></i> Descargar'; }
        document.getElementById('modal-export').classList.add('hidden');
      }
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
      ['close-templates','modal-templates'],
      ['close-sheet-settings','modal-sheet-settings'],
      ['close-save-template','modal-save-template'],
      ['close-export','modal-export'],
    ].forEach(([cid, mid]) => this.on(cid, 'click', () => document.getElementById(mid)?.classList.add('hidden')));

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.add('hidden'); });
    });

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
    if (slider && label) slider.addEventListener('input', () => { label.textContent = slider.value + suffix; });
  }
}

/* ── BOOT ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  window.app = new StickerApp();
  window.app.init();
});
