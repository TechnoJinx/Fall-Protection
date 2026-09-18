// ===================== TetherCheck =====================
// Fall protection equipment inspection tracker — offline-first PWA.

// ---------- Constants ----------
// Equipment types and checklist items are taken from 3M/DBI-SALA/Protecta's
// published Fall Protection Inspection Checklist/Logs (Appendix, Release 2,
// Oct 2017) so field checks match the manufacturer's own criteria.
const EQUIPMENT_TYPES = {
  harness:     { label: 'Full Body Harness',   icon: 'harness' },
  lanyard:     { label: 'Lanyard',             icon: 'lanyard' },
  tieoff:      { label: 'Tie-Off Adaptor',     icon: 'tieoff' },
  hook:        { label: 'Hook / Carabiner',    icon: 'hook' },
  anchor:      { label: 'Anchorage Plate',     icon: 'anchor' },
  srl:         { label: 'Self Retracting Lifeline', icon: 'srl' },
  escapebelt:  { label: 'Emergency Service Ladder / Escape Belt', icon: 'escapebelt' },
  cablegrab:   { label: 'Cable Grab',          icon: 'cablegrab' },
};

const CHECKLISTS = {
  harness: [
    'Hardware (D-rings, buckles, keepers, back pads): inspect for damage, distortion, sharp edges, burrs, cracks and corrosion',
    'Webbing: inspect for cuts, burns, tears, abrasion, frays, excessive soiling and discoloration',
    'Stitching: inspect for pulled or cut stitches',
    'Labels: inspect — make certain all labels are securely held in place and legible',
  ],
  lanyard: [
    'Hardware (snap hooks, carabiners, adjusters, keepers, thimbles, D-rings): inspect for damage, distortion, sharp edges, burrs, cracks, corrosion and proper operation',
    'Webbing: inspect for cuts, burns, tears, abrasion, frays, excessive soiling and discoloration',
    'Stitching: inspect for pulled or cut stitches',
    'Synthetic rope: inspect for pulled or cut yarns, burns, abrasion, knots, excessive soiling and discoloration',
    'Wire rope: inspect for broken wires, corrosion, kinks and separation of strands',
    'Energy absorbing component: inspect for elongation, tears and excessive soiling',
    'Labels: inspect — make certain all labels are securely held in place and legible',
  ],
  tieoff: [
    'Hardware (D-rings): inspect for damage, distortion, sharp edges, burrs, cracks and corrosion',
    'Webbing: inspect for cuts, burns, tears, abrasion, frays, excessive soiling and discoloration',
    'Stitching: inspect for pulled or cut stitches',
    'Labels: inspect — make certain all labels are securely held in place and legible',
  ],
  hook: [
    'Physical damage: inspect for cracks, sharp edges, burrs, deformities and locking operation',
    'Excessive corrosion: inspect for corrosion which affects operation and/or strength',
    'Markings: inspect — make certain marking(s) are legible',
  ],
  anchor: [
    'Physical damage: inspect for cracks, sharp edges, burrs, deformities and locking operation',
    'Excessive corrosion: inspect for corrosion which affects operation and/or strength',
    'Fasteners: inspect for corrosion, tightness, damage and distortion — if welded, inspect weld for corrosion, cracks and damage',
    'Markings: inspect — make certain marking(s) are legible',
  ],
  srl: [
    'Impact indicator: inspect for activation (rupture of red stitching, elongated indicator, etc.)',
    'Screws/fasteners: inspect for damage — make certain all screws and fasteners are tight',
    'Housing: inspect for distortion, cracks and other damage; inspect anchoring loop for distortion and damage',
    'Lifeline: inspect for cuts, burns, tears, abrasion, frays, excessive soiling, discoloration, and broken wires',
    'Locking action: inspect for proper lock-up of the brake mechanism',
    'Retraction/extension: pull lifeline out fully and allow it to retract fully — check spring tension, no slack',
    'Hooks/carabiners: inspect for physical damage, corrosion, proper operation and legible markings',
    'Reserve lifeline: inspect reserve lifeline retention system for deployment',
    'Labels: inspect — make certain all labels are securely held in place and legible',
  ],
  escapebelt: [
    'Hardware (D-rings): inspect for damage, distortion, sharp edges, burrs, cracks and corrosion',
    'Webbing: inspect for cuts, burns, tears, abrasion, frays, excessive soiling and discoloration',
    'Stitching: inspect for pulled or cut stitches',
    'Labels: inspect — make certain all labels are securely held in place and legible',
  ],
  cablegrab: [
    'Excessive corrosion: inspect for corrosion which affects operation and/or strength',
    'Physical damage: inspect for cracks, sharp edges, burrs, deformities and locking operation',
    'Labels: inspect — make certain all labels are securely held in place and legible',
  ],
};

const ICONS = {
  harness: '<path d="M12 3v6M8 9c0 4 1.5 6 4 6s4-2 4-6M6 21l2-6M18 21l-2-6M9 21h6"/>',
  lanyard: '<path d="M7 4a3 3 0 106 0 3 3 0 00-6 0z"/><path d="M10 7v6l6 8"/><path d="M16 21a2 2 0 100-4 2 2 0 000 4z"/>',
  srl: '<rect x="5" y="5" width="10" height="10" rx="2"/><path d="M15 10h4M19 10l-2-2M19 10l-2 2"/>',
  anchor: '<circle cx="12" cy="5" r="2"/><path d="M12 7v10M6 12H2a10 10 0 0020 0h-4M9 15l3 2 3-2"/>',
  tieoff: '<circle cx="8" cy="8" r="3"/><path d="M10.5 10.5L18 18"/><path d="M15 18h4v-4"/>',
  hook: '<path d="M8 3v9a5 5 0 0010 0"/><circle cx="8" cy="19" r="2.5"/>',
  escapebelt: '<path d="M6 3v18M18 3v18M6 7h12M6 12h12M6 17h12"/>',
  cablegrab: '<path d="M12 3v12"/><rect x="8" y="14" width="8" height="7" rx="1.5"/><path d="M9 21v-3M15 21v-3"/>',
  nfc: '<path d="M6 8a6 6 0 018 0M4 5a10 10 0 0112 0"/><circle cx="10" cy="14" r="2"/><path d="M13 12a4 4 0 010 4"/>',
  chevronLeft: '<path d="M15 18l-6-6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  refresh: '<path d="M21 12a9 9 0 11-3-6.7"/><path d="M21 3v6h-6"/>',
  barcode: '<path d="M3 5v14M7 5v14M11 5v14M13 5v14M17 5v14M21 5v14"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3"/>',
};
function icon(name, size = 20) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
}

// ---------- Tiny IndexedDB wrapper ----------
const DB_NAME = 'tethercheck';
const DB_VERSION = 1;
let _db = null;
function openDB() {
  return new Promise((resolve, reject) => {
    if (_db) return resolve(_db);
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('equipment')) {
        db.createObjectStore('equipment', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('inspections')) {
        const s = db.createObjectStore('inspections', { keyPath: 'insId' });
        s.createIndex('by_equipment', 'equipmentId');
      }
    };
    req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
    req.onerror = (e) => reject(e.target.error);
  });
}
async function dbGetAll(store) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly');
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e.target.error);
  });
}
async function dbGet(store, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, 'readonly').objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e.target.error);
  });
}
async function dbPut(store, val) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(val);
    tx.oncomplete = () => resolve(val);
    tx.onerror = (e) => reject(e.target.error);
  });
}
async function dbDelete(store, key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}
async function dbInspectionsFor(equipmentId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction('inspections', 'readonly')
      .objectStore('inspections').index('by_equipment').getAll(equipmentId);
    req.onsuccess = () => resolve(req.result.sort((a, b) => b.date.localeCompare(a.date)));
    req.onerror = (e) => reject(e.target.error);
  });
}

// ---------- Helpers ----------
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function todayStr() { return new Date().toISOString().slice(0, 10); }
function fmtDate(s) {
  if (!s) return '—';
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
function addMonths(dateStr, months) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}
function daysUntil(dateStr) {
  const ms = new Date(dateStr + 'T00:00:00') - new Date(todayStr() + 'T00:00:00');
  return Math.round(ms / 86400000);
}
function computeStatus(eq) {
  if (eq.status === 'retired') return 'retired';
  if (eq.status === 'out_of_service') return 'oos';
  const d = daysUntil(eq.nextDueDate);
  if (d < 0) return 'overdue';
  if (d <= 30) return 'due';
  return 'ok';
}
const STATUS_LABEL = { overdue: 'Overdue', due: 'Due soon', ok: 'Current', oos: 'Out of service', retired: 'Retired' };
function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}

// ---------- NFC ----------
function nfcSupported() { return 'NDEFReader' in window; }
let _nfcAbort = null;
async function nfcScan(onRead) {
  if (!nfcSupported()) throw new Error('unsupported');
  const reader = new NDEFReader();
  _nfcAbort = new AbortController();
  await reader.scan({ signal: _nfcAbort.signal });
  reader.onreading = (event) => {
    let text = '';
    for (const rec of event.message.records) {
      if (rec.recordType === 'text') {
        text = new TextDecoder(rec.encoding || 'utf-8').decode(rec.data);
        break;
      }
    }
    if (!text) text = event.serialNumber || '';
    onRead(text.trim());
  };
}
function nfcStop() { if (_nfcAbort) { _nfcAbort.abort(); _nfcAbort = null; } }
async function nfcWrite(idValue) {
  if (!nfcSupported()) throw new Error('unsupported');
  const writer = new NDEFReader();
  await writer.write({ records: [{ recordType: 'text', data: idValue }] });
}

// ---------- Barcode / QR scanning (camera) ----------
// Covers printed barcodes (like the ones used for extinguishers/lights on the
// SCBA tracker) using the phone's camera — no extra hardware needed. A
// physical USB/Bluetooth barcode scanner also works with this app already:
// those act as a keyboard, so scanning into any text field + its Enter key
// types the code and submits it (wired below on the manual-entry inputs).
function barcodeSupported() { return 'BarcodeDetector' in window; }
let _barcodeStream = null;
let _barcodeRAF = null;
async function startBarcodeScan(videoEl, onRead) {
  if (!barcodeSupported()) throw new Error('unsupported');
  const detector = new BarcodeDetector({
    formats: ['qr_code', 'code_128', 'code_39', 'code_93', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'itf', 'pdf417', 'data_matrix'],
  });
  _barcodeStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  videoEl.srcObject = _barcodeStream;
  await videoEl.play();
  let stopped = false;
  const tick = async () => {
    if (stopped) return;
    try {
      const codes = await detector.detect(videoEl);
      if (codes.length) {
        stopped = true;
        onRead(codes[0].rawValue.trim());
        return;
      }
    } catch (e) { /* keep trying */ }
    _barcodeRAF = requestAnimationFrame(tick);
  };
  tick();
}
function stopBarcodeScan() {
  if (_barcodeRAF) { cancelAnimationFrame(_barcodeRAF); _barcodeRAF = null; }
  if (_barcodeStream) { _barcodeStream.getTracks().forEach(t => t.stop()); _barcodeStream = null; }
}

// ---------- Router / state ----------
let route = { view: 'dashboard', params: {} };
let equipmentCache = [];
let listFilter = 'all';
let listSearch = '';

function navigate(view, params = {}) {
  route = { view, params };
  history.pushState({ view, params }, '', '#' + view);
  render();
}
window.addEventListener('popstate', (e) => {
  route = e.state || { view: 'dashboard', params: {} };
  render();
});

async function refreshCache() {
  equipmentCache = await dbGetAll('equipment');
  equipmentCache.sort((a, b) => (a.label || a.id).localeCompare(b.label || b.id));
}

// ---------- App shell ----------
async function render() {
  const app = document.getElementById('app');
  await refreshCache();
  let body = '';
  switch (route.view) {
    case 'dashboard': body = viewDashboard(); break;
    case 'list': body = viewList(); break;
    case 'detail': body = await viewDetail(route.params.id); break;
    case 'addEquipment': body = viewAddEquipment(route.params); break;
    case 'inspect': body = await viewInspect(route.params.id); break;
    case 'editInspection': body = await viewEditInspection(route.params.id, route.params.insId); break;
    default: body = viewDashboard();
  }
  app.innerHTML = body + bottomNav();
  attachHandlers();
}

function topbar(opts) {
  if (opts.back) {
    return `<div class="topbar"><div class="back-row"><button class="back-btn" data-nav="back">${icon('chevronLeft', 20)} Back</button></div>${opts.right || ''}</div>`;
  }
  return `<div class="topbar">
    <div class="brand"><span class="brand-mark">Tether<span>Check</span></span></div>
    ${opts.right || ''}
  </div>`;
}

function bottomNav() {
  const items = [
    { v: 'dashboard', label: 'Home', icon: 'home' },
    { v: 'list', label: 'Equipment', icon: 'list' },
  ];
  return `<div class="bottom-nav"><div class="bottom-nav-inner">
    ${items.map(it => `<button class="nav-btn ${route.view === it.v ? 'active' : ''}" data-nav="${it.v}">${icon(it.icon, 22)}<span>${it.label}</span></button>`).join('')}
    <button class="nav-btn" data-action="scan-sheet">${icon('nfc', 22)}<span>Scan</span></button>
  </div></div>`;
}

// ---------- Dashboard ----------
function viewDashboard() {
  const counts = { overdue: 0, due: 0, ok: 0, oos: 0 };
  equipmentCache.forEach(eq => {
    const s = computeStatus(eq);
    if (s === 'overdue') counts.overdue++;
    else if (s === 'due') counts.due++;
    else if (s === 'ok') counts.ok++;
    else if (s === 'oos') counts.oos++;
  });
  return `
  ${topbar({ right: `<button class="icon-btn" data-action="force-update" title="Force refresh app">${icon('refresh', 18)}</button>` })}
  <main>
    <button class="scan-cta" data-action="scan-sheet">
      ${icon('nfc', 26)}
      <span class="scan-cta-text">Scan a tag<small>Look up equipment or add new</small></span>
    </button>
    <div class="stat-grid">
      <div class="stat-card overdue" data-nav="list" data-filter="overdue"><div class="stat-num">${counts.overdue}</div><div class="stat-label">Overdue</div></div>
      <div class="stat-card due" data-nav="list" data-filter="due"><div class="stat-num">${counts.due}</div><div class="stat-label">Due within 30 days</div></div>
      <div class="stat-card ok" data-nav="list" data-filter="ok"><div class="stat-num">${counts.ok}</div><div class="stat-label">Current</div></div>
      <div class="stat-card oos" data-nav="list" data-filter="oos"><div class="stat-num">${counts.oos}</div><div class="stat-label">Out of service</div></div>
    </div>
    <div class="section-title" style="font-size:18px;">Needs attention</div>
    ${renderAttentionList()}
    <button class="btn-secondary" data-nav="addEquipment">${icon('plus', 16)} &nbsp;Add equipment manually</button>
  </main>`;
}
function renderAttentionList() {
  const flagged = equipmentCache
    .filter(eq => ['overdue', 'due', 'oos'].includes(computeStatus(eq)))
    .sort((a, b) => (a.nextDueDate || '').localeCompare(b.nextDueDate || ''))
    .slice(0, 6);
  if (!flagged.length) {
    return `<div class="empty-state">${icon('check', 34)}<p>Nothing needs attention right now.</p></div>`;
  }
  return flagged.map(eq => equipmentCard(eq)).join('');
}

// ---------- List ----------
function viewList() {
  if (route.params.filter) { listFilter = route.params.filter; route.params.filter = null; }
  const filters = [
    { k: 'all', label: 'All' },
    { k: 'overdue', label: 'Overdue' },
    { k: 'due', label: 'Due soon' },
    { k: 'ok', label: 'Current' },
    { k: 'oos', label: 'Out of service' },
    { k: 'retired', label: 'Retired' },
  ];
  let items = equipmentCache;
  if (listFilter !== 'all') items = items.filter(eq => computeStatus(eq) === listFilter);
  const q = listSearch.trim().toLowerCase();
  if (q) {
    items = items.filter(eq =>
      (eq.id || '').toLowerCase().includes(q) ||
      (eq.serial || '').toLowerCase().includes(q) ||
      (eq.label || '').toLowerCase().includes(q) ||
      (eq.manufacturer || '').toLowerCase().includes(q) ||
      (eq.model || '').toLowerCase().includes(q) ||
      (eq.lotNumber || '').toLowerCase().includes(q)
    );
  }
  return `
  ${topbar({ right: `<button class="icon-btn" data-action="import-file" title="Import equipment">${icon('upload')}</button><button class="icon-btn" data-nav="addEquipment">${icon('plus')}</button>` })}
  <main>
    <div class="section-title">Equipment</div>
    <div class="field" style="margin-bottom:14px;">
      <input id="search-input" value="${escapeHtml(listSearch)}" placeholder="Search by ID, serial number, label..." autocomplete="off">
    </div>
    <div class="filter-row">
      ${filters.map(f => `<button class="filter-chip ${listFilter === f.k ? 'active' : ''}" data-action="filter" data-filter="${f.k}">${f.label}</button>`).join('')}
    </div>
    ${items.length ? items.map(eq => equipmentCard(eq)).join('') : `<div class="empty-state">${icon('list', 34)}<p>${q ? 'No equipment matches your search.' : 'No equipment in this view yet.'}</p></div>`}
  </main>`;
}

function equipmentCard(eq) {
  const status = computeStatus(eq);
  const typeInfo = EQUIPMENT_TYPES[eq.type] || { label: eq.type, icon: 'harness' };
  const sub = status === 'oos' ? 'Removed from service' :
    status === 'retired' ? 'Retired' :
    `${status === 'overdue' ? 'Was due' : 'Due'} ${fmtDate(eq.nextDueDate)}`;
  return `<div class="item-card" data-nav="detail" data-id="${eq.id}">
    <div class="item-type-icon">${icon(typeInfo.icon, 20)}</div>
    <div class="item-main">
      <div class="item-title">${escapeHtml(eq.label || eq.id)}</div>
      <div class="item-sub">${typeInfo.label} · ${sub}</div>
    </div>
    <div class="status-pill ${status}">${STATUS_LABEL[status]}</div>
  </div>`;
}

// ---------- Detail ----------
async function viewDetail(id) {
  const eq = await dbGet('equipment', id);
  if (!eq) return `${topbar({ back: true })}<main><div class="empty-state"><p>Equipment not found.</p></div></main>`;
  const inspections = await dbInspectionsFor(id);
  const status = computeStatus(eq);
  const typeInfo = EQUIPMENT_TYPES[eq.type] || { label: eq.type };
  const tab = route.params.tab || 'info';

  const infoTab = `
    <div class="detail-grid">
      <div class="detail-grid-item"><div class="k">Manufacturer</div><div class="v">${escapeHtml(eq.manufacturer) || '—'}</div></div>
      <div class="detail-grid-item"><div class="k">Model</div><div class="v">${escapeHtml(eq.model) || '—'}</div></div>
      ${eq.type === 'harness' ? `<div class="detail-grid-item"><div class="k">Size</div><div class="v">${escapeHtml(eq.size) || '—'}</div></div>` : ''}
      ${eq.type === 'lanyard' ? `<div class="detail-grid-item"><div class="k">Lanyard type</div><div class="v">${escapeHtml(eq.lanyardType) || '—'}</div></div>` : ''}
      ${eq.type === 'srl' ? `<div class="detail-grid-item"><div class="k">Length</div><div class="v">${escapeHtml(eq.length) || '—'}</div></div>` : ''}
      ${eq.type === 'srl' ? `<div class="detail-grid-item"><div class="k">Class</div><div class="v">${escapeHtml(eq.srlClass) || '—'}</div></div>` : ''}
      ${eq.type === 'tieoff' ? `<div class="detail-grid-item"><div class="k">Length</div><div class="v">${escapeHtml(eq.length) || '—'}</div></div>` : ''}
      <div class="detail-grid-item"><div class="k">Serial number</div><div class="v">${escapeHtml(eq.serial) || '—'}</div></div>
      <div class="detail-grid-item"><div class="k">Lot number</div><div class="v">${escapeHtml(eq.lotNumber) || '—'}</div></div>
      <div class="detail-grid-item"><div class="k">Manufacture date</div><div class="v">${eq.manufactureDate ? fmtDate(eq.manufactureDate) : '—'}</div></div>
      <div class="detail-grid-item"><div class="k">Purchase date</div><div class="v">${eq.purchaseDate ? fmtDate(eq.purchaseDate) : '—'}</div></div>
      <div class="detail-grid-item"><div class="k">In service since</div><div class="v">${fmtDate(eq.dateInService)}</div></div>
      <div class="detail-grid-item"><div class="k">Location</div><div class="v">${escapeHtml(eq.location) || '—'}</div></div>
      <div class="detail-grid-item"><div class="k">Assigned to</div><div class="v">${escapeHtml(eq.assignedTo) || '—'}</div></div>
      <div class="detail-grid-item"><div class="k">Inspection interval</div><div class="v">${eq.intervalMonths} months</div></div>
      <div class="detail-grid-item"><div class="k">Next due</div><div class="v">${fmtDate(eq.nextDueDate)}</div></div>
    </div>
    ${eq.comments ? `<div class="field" style="margin-top:14px;"><label>Comments</label><div class="v" style="font-size:14px;line-height:1.5;">${escapeHtml(eq.comments)}</div></div>` : ''}
    <button class="btn-secondary" data-nav="addEquipment" data-edit="${eq.id}">Edit details</button>
    ${eq.status === 'out_of_service' ? `<button class="btn-secondary" data-action="return-service" data-id="${eq.id}">Return to service</button>` : ''}
    ${eq.status !== 'retired' ? `<button class="btn-danger" data-action="retire" data-id="${eq.id}">Retire this item</button>` : `<button class="btn-secondary" data-action="unretire" data-id="${eq.id}">Un-retire</button>`}
    <button class="btn-danger" data-action="delete-equipment" data-id="${eq.id}" style="margin-top:6px;">Delete equipment</button>
  `;
  const historyTab = inspections.length
    ? inspections.map(ins => `<div class="insp-row">
        <div class="insp-row-top">
          <span class="insp-date">${fmtDate(ins.date)}</span>
          <span class="status-pill ${ins.result === 'pass' ? 'ok' : 'oos'}">${ins.result === 'pass' ? 'Accepted' : 'Rejected'}</span>
        </div>
        <div class="insp-inspector">Inspected by ${escapeHtml(ins.inspector) || '—'}</div>
        ${ins.notes ? `<div class="insp-notes">${escapeHtml(ins.notes)}</div>` : ''}
        <div class="badge-row">
          <button class="mini-badge" style="cursor:pointer;" data-nav="editInspection" data-id="${eq.id}" data-insid="${ins.insId}">Edit</button>
          <button class="mini-badge" style="cursor:pointer;color:var(--fail);" data-action="delete-inspection" data-id="${eq.id}" data-insid="${ins.insId}">Delete</button>
        </div>
      </div>`).join('')
    : `<div class="empty-state">${icon('clock', 30)}<p>No inspections logged yet.</p></div>`;

  return `
  ${topbar({ back: true })}
  <main>
    <div class="detail-header">
      <div class="detail-header-top">
        <div>
          <div class="detail-title">${escapeHtml(eq.label || eq.id)}</div>
          <div class="detail-id">${escapeHtml(eq.id)}</div>
        </div>
        <div class="status-pill ${status}">${STATUS_LABEL[status]}</div>
      </div>
      <div class="badge-row"><span class="mini-badge">${typeInfo.label}</span></div>
    </div>
    ${eq.status !== 'retired' ? `<button class="btn-primary" data-nav="inspect" data-id="${eq.id}">Run inspection</button>` : ''}
    <div class="tab-row">
      <button class="tab-btn ${tab === 'info' ? 'active' : ''}" data-action="detail-tab" data-id="${eq.id}" data-tab="info">Info</button>
      <button class="tab-btn ${tab === 'history' ? 'active' : ''}" data-action="detail-tab" data-id="${eq.id}" data-tab="history">History (${inspections.length})</button>
    </div>
    ${tab === 'info' ? infoTab : historyTab}
  </main>`;
}

// ---------- Add / Edit equipment ----------
function viewAddEquipment(params) {
  const editing = params.edit ? equipmentCache.find(e => e.id === params.edit) : null;
  const prefillId = params.prefillId || '';
  const eq = editing || { id: prefillId, type: 'harness', intervalMonths: 12, dateInService: todayStr() };
  const typeOpts = Object.entries(EQUIPMENT_TYPES).map(([k, v]) => `<option value="${k}" ${eq.type === k ? 'selected' : ''}>${v.label}</option>`).join('');
  return `
  ${topbar({ back: true })}
  <main>
    <div class="section-title">${editing ? 'Edit equipment' : 'Add equipment'}</div>
    <form id="eq-form">
      <div class="field">
        <label>Equipment ID</label>
        <div class="id-input-row">
          <input name="id" value="${escapeHtml(eq.id)}" placeholder="e.g. HAR-0042" required>
          ${!editing && nfcSupported() ? `<button type="button" class="nfc-mini-btn" data-action="scan-for-id">${icon('nfc', 16)}</button>` : ''}
          ${!editing && barcodeSupported() ? `<button type="button" class="nfc-mini-btn" data-action="barcode-for-id">${icon('barcode', 16)}</button>` : ''}
        </div>
        ${editing ? `<div class="eyebrow" style="margin-top:6px;">Changing this moves its inspection history to the new ID.</div>` : ''}
      </div>
      <div class="field">
        <label>Type</label>
        <select name="type" id="type-select">${typeOpts}</select>
      </div>
      <div class="field">
        <label>Label / nickname</label>
        <input name="label" value="${escapeHtml(eq.label || '')}" placeholder="e.g. Harness — Reformer rack 3">
      </div>
      <div class="field-row">
        <div class="field"><label>Manufacturer</label><input name="manufacturer" value="${escapeHtml(eq.manufacturer || '')}"></div>
        <div class="field"><label>Model</label><input name="model" value="${escapeHtml(eq.model || '')}"></div>
      </div>
      <div class="field-row" id="size-row" style="${eq.type === 'harness' ? '' : 'display:none;'}">
        <div class="field"><label>Size</label>
          <select name="size">
            ${['', 'Universal', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'S/M', 'L/XL']
              .map(v => `<option value="${v}" ${eq.size === v ? 'selected' : ''}>${v || 'Select size…'}</option>`).join('')}
            ${eq.size && !['Universal', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'S/M', 'L/XL'].includes(eq.size)
              ? `<option value="${escapeHtml(eq.size)}" selected>${escapeHtml(eq.size)}</option>` : ''}
          </select>
        </div>
      </div>
      <div class="field-row" id="lanyard-row" style="${eq.type === 'lanyard' ? '' : 'display:none;'}">
        <div class="field"><label>Lanyard type</label>
          <select name="lanyardType">
            ${['', 'Nylon', 'Cable'].map(v => `<option value="${v}" ${eq.lanyardType === v ? 'selected' : ''}>${v || 'Select type…'}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="field-row" id="srl-row" style="${eq.type === 'srl' ? '' : 'display:none;'}">
        <div class="field"><label>Length</label><input name="length" value="${escapeHtml(eq.length || '')}" placeholder="e.g. 30 ft"></div>
        <div class="field"><label>Class</label>
          <select name="srlClass">
            ${['', 'Class 1', 'Class 2'].map(v => `<option value="${v}" ${eq.srlClass === v ? 'selected' : ''}>${v || 'Select class…'}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="field-row" id="tieoff-row" style="${eq.type === 'tieoff' ? '' : 'display:none;'}">
        <div class="field"><label>Length</label><input name="tieoffLength" value="${escapeHtml(eq.length || '')}" placeholder="e.g. 4 ft"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Serial number</label><input name="serial" value="${escapeHtml(eq.serial || '')}"></div>
        <div class="field"><label>Lot number</label><input name="lotNumber" value="${escapeHtml(eq.lotNumber || '')}"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Manufacture date</label><input type="date" name="manufactureDate" value="${eq.manufactureDate || ''}"></div>
        <div class="field"><label>Purchase date</label><input type="date" name="purchaseDate" value="${eq.purchaseDate || ''}"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>In service since</label><input type="date" name="dateInService" value="${eq.dateInService || todayStr()}"></div>
        <div class="field"><label>Inspection interval (months)</label><input type="number" name="intervalMonths" min="1" value="${eq.intervalMonths || 12}"></div>
      </div>
      <div class="field">
        <label>Next inspection due</label>
        <input type="date" name="nextDueDate" value="${eq.nextDueDate || ''}">
      </div>
      <div class="field-row">
        <div class="field"><label>Location / unit</label><input name="location" value="${escapeHtml(eq.location || '')}" placeholder="e.g. Coker"></div>
        <div class="field"><label>Assigned to</label><input name="assignedTo" value="${escapeHtml(eq.assignedTo || '')}"></div>
      </div>
      <div class="field"><label>Comments</label><textarea name="comments">${escapeHtml(eq.comments || '')}</textarea></div>
      <button type="submit" class="btn-primary">${editing ? 'Save changes' : 'Add equipment'}</button>
    </form>
  </main>`;
}

// ---------- Inspection flow ----------
async function viewInspect(id) {
  const eq = await dbGet('equipment', id);
  if (!eq) return `${topbar({ back: true })}<main><div class="empty-state"><p>Equipment not found.</p></div></main>`;
  const items = CHECKLISTS[eq.type] || [];
  return `
  ${topbar({ back: true })}
  <main>
    <div class="eyebrow">${(EQUIPMENT_TYPES[eq.type] || {}).label}</div>
    <div class="section-title">${escapeHtml(eq.label || eq.id)}</div>
    <form id="insp-form" data-id="${eq.id}">
      ${items.map((label, i) => `
        <div class="checklist-item">
          <div class="checklist-item-label">${escapeHtml(label)}</div>
          <div class="checklist-toggle" data-idx="${i}">
            <button type="button" class="toggle-btn pass" data-val="pass">Accepted</button>
            <button type="button" class="toggle-btn fail" data-val="fail">Rejected</button>
            <button type="button" class="toggle-btn na" data-val="na">N/A</button>
          </div>
        </div>
      `).join('')}
      <div class="field-row">
        <div class="field"><label>Inspected by</label><input name="inspector" placeholder="Your name" required></div>
        <div class="field"><label>Date inspected</label><input type="date" name="inspDate" value="${todayStr()}" required></div>
      </div>
      <div class="field">
        <label>Notes (optional)</label>
        <textarea name="notes" placeholder="Anything worth flagging..."></textarea>
      </div>
      <div id="insp-result-banner"></div>
      <button type="submit" class="btn-primary">Submit inspection</button>
    </form>
  </main>`;
}

async function viewEditInspection(equipmentId, insId) {
  const eq = await dbGet('equipment', equipmentId);
  const ins = await dbGet('inspections', insId);
  if (!eq || !ins) return `${topbar({ back: true })}<main><div class="empty-state"><p>Inspection not found.</p></div></main>`;
  const items = CHECKLISTS[eq.type] || [];
  return `
  ${topbar({ back: true })}
  <main>
    <div class="eyebrow">${(EQUIPMENT_TYPES[eq.type] || {}).label} · Editing inspection</div>
    <div class="section-title">${escapeHtml(eq.label || eq.id)}</div>
    <form id="insp-edit-form" data-id="${eq.id}" data-insid="${ins.insId}">
      ${items.map((label, i) => `
        <div class="checklist-item">
          <div class="checklist-item-label">${escapeHtml(label)}</div>
          <div class="checklist-toggle" data-idx="${i}">
            <button type="button" class="toggle-btn pass ${ins.items && ins.items[i] === 'pass' ? 'selected' : ''}" data-val="pass">Accepted</button>
            <button type="button" class="toggle-btn fail ${ins.items && ins.items[i] === 'fail' ? 'selected' : ''}" data-val="fail">Rejected</button>
            <button type="button" class="toggle-btn na ${ins.items && ins.items[i] === 'na' ? 'selected' : ''}" data-val="na">N/A</button>
          </div>
        </div>
      `).join('')}
      <div class="field-row">
        <div class="field"><label>Inspected by</label><input name="inspector" value="${escapeHtml(ins.inspector || '')}" placeholder="Your name" required></div>
        <div class="field"><label>Date inspected</label><input type="date" name="inspDate" value="${ins.date || todayStr()}" required></div>
      </div>
      <div class="field">
        <label>Notes (optional)</label>
        <textarea name="notes" placeholder="Anything worth flagging...">${escapeHtml(ins.notes || '')}</textarea>
      </div>
      <div id="insp-result-banner"></div>
      <button type="submit" class="btn-primary">Save changes</button>
      <button type="button" class="btn-danger" id="delete-inspection-inline">Delete this inspection</button>
    </form>
  </main>`;
}

// ---------- Sheets ----------
function openSheet(html) {
  const backdrop = document.createElement('div');
  backdrop.className = 'sheet-backdrop';
  backdrop.innerHTML = `<div class="sheet"><div class="sheet-handle"></div>${html}</div>`;
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeSheet(); });
  document.body.appendChild(backdrop);
  return backdrop;
}
function closeSheet() {
  nfcStop();
  stopBarcodeScan();
  document.querySelectorAll('.sheet-backdrop').forEach(el => el.remove());
}

function openManualEntrySheet(title) {
  const backdrop = openSheet(`
    <div class="sheet-title">${title || 'Enter equipment ID or serial number'}</div>
    <div class="field"><input id="manual-id-input" placeholder="Equipment ID or serial number" autofocus></div>
    <button class="btn-primary" id="manual-id-go">Look up</button>
  `);
  const input = backdrop.querySelector('#manual-id-input');
  const go = () => {
    const val = input.value.trim();
    if (!val) return;
    closeSheet();
    handleScannedId(val);
  };
  backdrop.querySelector('#manual-id-go').addEventListener('click', go);
  // A physical USB/Bluetooth barcode scanner acts like a keyboard: it types
  // the code into whatever's focused, then sends Enter — so this submits
  // automatically the moment someone scans into this field.
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
}

function openBarcodeSheet() {
  if (!barcodeSupported()) {
    showToast('Camera barcode scanning isn\'t supported on this browser.');
    openManualEntrySheet();
    return;
  }
  const backdrop = openSheet(`
    <div class="sheet-title">Scanning for barcode…</div>
    <div class="sheet-sub">Point the camera at the barcode or QR code.</div>
    <video id="barcode-video" playsinline muted style="width:100%;border-radius:12px;background:#000;margin-bottom:16px;"></video>
    <button class="btn-secondary" id="manual-fallback-bc">Enter ID manually instead</button>
  `);
  backdrop.querySelector('#manual-fallback-bc').addEventListener('click', () => {
    closeSheet();
    openManualEntrySheet();
  });
  const videoEl = backdrop.querySelector('#barcode-video');
  startBarcodeScan(videoEl, (text) => {
    closeSheet();
    handleScannedId(text);
  }).catch(() => {
    closeSheet();
    showToast('Could not access the camera.');
  });
}

function openNfcSheet() {
  const backdrop = openSheet(`
    <div class="sheet-title">Scanning for tag…</div>
    <div class="sheet-sub">Hold your phone near the NFC tag.</div>
    <div class="nfc-pulse">${icon('nfc', 34)}</div>
    <button class="btn-secondary" id="manual-fallback">Enter ID manually instead</button>
  `);
  backdrop.querySelector('#manual-fallback').addEventListener('click', () => {
    closeSheet();
    openManualEntrySheet();
  });
  nfcScan((text) => {
    closeSheet();
    handleScannedId(text);
  }).catch(() => {
    closeSheet();
    showToast('Could not start NFC scan.');
  });
}

async function openScanSheet() {
  const options = [];
  if (nfcSupported()) options.push({ id: 'nfc', label: 'Scan NFC tag', sub: 'For tagged SCBA-style equipment', icon: 'nfc' });
  if (barcodeSupported()) options.push({ id: 'barcode', label: 'Scan barcode / QR', sub: 'Use the camera on a printed code', icon: 'barcode' });
  options.push({ id: 'manual', label: 'Enter ID manually', sub: 'Type the code, or scan into it with a handheld scanner', icon: 'list' });

  // If there's exactly one real scanning method available (no NFC, no
  // camera), skip the chooser and go straight to manual entry.
  if (options.length === 1) { openManualEntrySheet(); return; }

  const backdrop = openSheet(`
    <div class="sheet-title">Look up equipment</div>
    <div class="sheet-sub">Choose how you'd like to find it.</div>
    ${options.map(o => `
      <button class="item-card" style="width:100%;text-align:left;margin-bottom:10px;" data-scan-choice="${o.id}">
        <div class="item-type-icon">${icon(o.icon, 20)}</div>
        <div class="item-main"><div class="item-title">${o.label}</div><div class="item-sub">${o.sub}</div></div>
      </button>`).join('')}
  `);
  backdrop.querySelectorAll('[data-scan-choice]').forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.scanChoice;
      closeSheet();
      if (choice === 'nfc') openNfcSheet();
      else if (choice === 'barcode') openBarcodeSheet();
      else openManualEntrySheet();
    });
  });
}

async function handleScannedId(idValue) {
  await refreshCache();
  const needle = idValue.trim().toLowerCase();
  const match = equipmentCache.find(e =>
    (e.id || '').toLowerCase() === needle || (e.serial || '').toLowerCase() === needle
  );
  if (match) {
    navigate('detail', { id: match.id });
  } else {
    navigate('addEquipment', { prefillId: idValue });
  }
}

// ---------- Event wiring ----------
function attachHandlers() {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => {
      const target = el.getAttribute('data-nav');
      if (target === 'back') { history.back(); return; }
      const params = {};
      if (el.dataset.id) params.id = el.dataset.id;
      if (el.dataset.filter) params.filter = el.dataset.filter;
      if (el.dataset.edit) params.edit = el.dataset.edit;
      if (el.dataset.insid) params.insId = el.dataset.insid;
      navigate(target, params);
    });
  });

  document.querySelectorAll('[data-action="filter"]').forEach(el => {
    el.addEventListener('click', () => { listFilter = el.dataset.filter; render(); });
  });

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', async () => {
    listSearch = searchInput.value;
    const cursorPos = searchInput.selectionStart;
    await render();
    const newInput = document.getElementById('search-input');
    if (newInput) { newInput.focus(); newInput.setSelectionRange(cursorPos, cursorPos); }
  });

  const scanBtns = document.querySelectorAll('[data-action="scan-sheet"]');
  scanBtns.forEach(el => el.addEventListener('click', openScanSheet));

  const forceUpdateBtn = document.querySelector('[data-action="force-update"]');
  if (forceUpdateBtn) forceUpdateBtn.addEventListener('click', forceUpdate);

  const importBtn = document.querySelector('[data-action="import-file"]');
  if (importBtn) importBtn.addEventListener('click', () => ensureImportInput().click());

  const scanForId = document.querySelector('[data-action="scan-for-id"]');
  if (scanForId) scanForId.addEventListener('click', async () => {
    if (!nfcSupported()) { showToast('Web NFC not supported on this device.'); return; }
    const backdrop = openSheet(`
      <div class="sheet-title">Scanning tag…</div>
      <div class="sheet-sub">Hold your phone near the tag to read its ID.</div>
      <div class="nfc-pulse">${icon('nfc', 34)}</div>
    `);
    try {
      await nfcScan((text) => {
        closeSheet();
        const input = document.querySelector('#eq-form input[name="id"]');
        if (input) input.value = text;
      });
    } catch (e) { closeSheet(); showToast('Could not start NFC scan.'); }
  });

  const barcodeForId = document.querySelector('[data-action="barcode-for-id"]');
  if (barcodeForId) barcodeForId.addEventListener('click', () => {
    if (!barcodeSupported()) { showToast('Camera barcode scanning not supported on this device.'); return; }
    const backdrop = openSheet(`
      <div class="sheet-title">Scanning barcode…</div>
      <div class="sheet-sub">Point the camera at the barcode or QR code.</div>
      <video id="barcode-video-id" playsinline muted style="width:100%;border-radius:12px;background:#000;margin-bottom:16px;"></video>
    `);
    const videoEl = backdrop.querySelector('#barcode-video-id');
    startBarcodeScan(videoEl, (text) => {
      closeSheet();
      const input = document.querySelector('#eq-form input[name="id"]');
      if (input) input.value = text;
    }).catch(() => { closeSheet(); showToast('Could not access the camera.'); });
  });

  const detailTabs = document.querySelectorAll('[data-action="detail-tab"]');
  detailTabs.forEach(el => el.addEventListener('click', () => {
    route.params.tab = el.dataset.tab;
    render();
  }));

  const retireBtn = document.querySelector('[data-action="retire"]');
  if (retireBtn) retireBtn.addEventListener('click', async () => {
    const eq = await dbGet('equipment', retireBtn.dataset.id);
    eq.status = 'retired';
    await dbPut('equipment', eq);
    showToast('Marked as retired.');
    render();
  });
  const unretireBtn = document.querySelector('[data-action="unretire"]');
  if (unretireBtn) unretireBtn.addEventListener('click', async () => {
    const eq = await dbGet('equipment', unretireBtn.dataset.id);
    eq.status = 'active';
    await dbPut('equipment', eq);
    showToast('Restored to active list.');
    render();
  });
  const returnBtn = document.querySelector('[data-action="return-service"]');
  if (returnBtn) returnBtn.addEventListener('click', async () => {
    const eq = await dbGet('equipment', returnBtn.dataset.id);
    eq.status = 'active';
    await dbPut('equipment', eq);
    showToast('Returned to service.');
    render();
  });

  const deleteBtn = document.querySelector('[data-action="delete-equipment"]');
  if (deleteBtn) deleteBtn.addEventListener('click', async () => {
    const id = deleteBtn.dataset.id;
    const eq = await dbGet('equipment', id);
    const inspections = await dbInspectionsFor(id);
    const backdrop = openSheet(`
      <div class="sheet-title">Delete ${escapeHtml(eq.label || eq.id)}?</div>
      <div class="sheet-sub">This permanently removes the equipment record${inspections.length ? ` and its ${inspections.length} logged inspection${inspections.length === 1 ? '' : 's'}` : ''}. This can't be undone.</div>
      <button class="btn-danger" id="confirm-delete">Delete permanently</button>
      <button class="btn-secondary" id="cancel-delete">Cancel</button>
    `);
    backdrop.querySelector('#cancel-delete').addEventListener('click', closeSheet);
    backdrop.querySelector('#confirm-delete').addEventListener('click', async () => {
      for (const ins of inspections) { await dbDelete('inspections', ins.insId); }
      await dbDelete('equipment', id);
      closeSheet();
      showToast('Equipment deleted.');
      navigate('list');
    });
  });

  const typeSelect = document.getElementById('type-select');
  if (typeSelect) typeSelect.addEventListener('change', () => {
    const sizeRow = document.getElementById('size-row');
    if (sizeRow) sizeRow.style.display = typeSelect.value === 'harness' ? '' : 'none';
    const lanyardRow = document.getElementById('lanyard-row');
    if (lanyardRow) lanyardRow.style.display = typeSelect.value === 'lanyard' ? '' : 'none';
    const srlRow = document.getElementById('srl-row');
    if (srlRow) srlRow.style.display = typeSelect.value === 'srl' ? '' : 'none';
    const tieoffRow = document.getElementById('tieoff-row');
    if (tieoffRow) tieoffRow.style.display = typeSelect.value === 'tieoff' ? '' : 'none';
  });

  const eqForm = document.getElementById('eq-form');
  if (eqForm) eqForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(eqForm);
    const id = fd.get('id').trim();
    if (!id) return;
    const editingId = route.params.edit || null;
    const existing = editingId ? await dbGet('equipment', editingId) : await dbGet('equipment', id);
    if (editingId && id !== editingId) {
      const conflict = await dbGet('equipment', id);
      if (conflict) { showToast(`ID "${id}" is already in use by another item.`); return; }
    }
    const intervalMonths = parseInt(fd.get('intervalMonths'), 10) || 12;
    const dateInService = fd.get('dateInService') || todayStr();
    const eq = {
      id,
      type: fd.get('type'),
      label: fd.get('label').trim(),
      manufacturer: fd.get('manufacturer').trim(),
      model: fd.get('model').trim(),
      size: fd.get('size') ? fd.get('size').trim() : '',
      lanyardType: fd.get('lanyardType') ? fd.get('lanyardType').trim() : '',
      srlClass: fd.get('srlClass') ? fd.get('srlClass').trim() : '',
      length: fd.get('type') === 'srl' ? (fd.get('length') || '').trim()
        : fd.get('type') === 'tieoff' ? (fd.get('tieoffLength') || '').trim() : '',
      serial: fd.get('serial').trim(),
      lotNumber: fd.get('lotNumber').trim(),
      manufactureDate: fd.get('manufactureDate') || '',
      purchaseDate: fd.get('purchaseDate') || '',
      dateInService,
      intervalMonths,
      location: fd.get('location').trim(),
      assignedTo: fd.get('assignedTo').trim(),
      comments: fd.get('comments').trim(),
      status: existing ? existing.status : 'active',
      nextDueDate: fd.get('nextDueDate') ? fd.get('nextDueDate')
        : (existing && existing.nextDueDate ? existing.nextDueDate : addMonths(dateInService, intervalMonths)),
      createdAt: existing ? existing.createdAt : Date.now(),
    };
    await dbPut('equipment', eq);
    if (editingId && id !== editingId) {
      // ID was changed: move this equipment's inspection history over to the
      // new ID, then remove the old equipment record.
      const oldInspections = await dbInspectionsFor(editingId);
      for (const ins of oldInspections) {
        ins.equipmentId = id;
        await dbPut('inspections', ins);
      }
      await dbDelete('equipment', editingId);
      showToast(`Equipment ID changed to "${id}".`);
    } else {
      showToast(existing ? 'Equipment updated.' : 'Equipment added.');
    }
    navigate('detail', { id });
  });

  // Checklist toggles
  document.querySelectorAll('.checklist-toggle').forEach(group => {
    group.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        updateInspectionBanner();
      });
    });
  });

  const inspForm = document.getElementById('insp-form');
  if (inspForm) inspForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const groups = inspForm.querySelectorAll('.checklist-toggle');
    const results = [];
    let allAnswered = true;
    groups.forEach(g => {
      const sel = g.querySelector('.toggle-btn.selected');
      if (!sel) allAnswered = false;
      results.push(sel ? sel.dataset.val : null);
    });
    if (!allAnswered) { showToast('Answer every checklist item.'); return; }
    const fd = new FormData(inspForm);
    const eqId = inspForm.dataset.id;
    const eq = await dbGet('equipment', eqId);
    const overallPass = !results.includes('fail');
    const ins = {
      insId: uid(),
      equipmentId: eqId,
      date: fd.get('inspDate') || todayStr(),
      inspector: fd.get('inspector').trim(),
      notes: fd.get('notes').trim(),
      items: results,
      result: overallPass ? 'pass' : 'fail',
    };
    await dbPut('inspections', ins);
    eq.status = overallPass ? 'active' : 'out_of_service';
    await dbPut('equipment', eq);
    showToast(overallPass ? 'Inspection accepted and logged.' : 'Inspection logged — item rejected and flagged out of service.');
    navigate('dashboard');
  });

  const inspEditForm = document.getElementById('insp-edit-form');
  if (inspEditForm) inspEditForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const groups = inspEditForm.querySelectorAll('.checklist-toggle');
    const results = [];
    let allAnswered = true;
    groups.forEach(g => {
      const sel = g.querySelector('.toggle-btn.selected');
      if (!sel) allAnswered = false;
      results.push(sel ? sel.dataset.val : null);
    });
    if (!allAnswered) { showToast('Answer every checklist item.'); return; }
    const fd = new FormData(inspEditForm);
    const eqId = inspEditForm.dataset.id;
    const insId = inspEditForm.dataset.insid;
    const eq = await dbGet('equipment', eqId);
    const overallPass = !results.includes('fail');
    const ins = {
      insId,
      equipmentId: eqId,
      date: fd.get('inspDate') || todayStr(),
      inspector: fd.get('inspector').trim(),
      notes: fd.get('notes').trim(),
      items: results,
      result: overallPass ? 'pass' : 'fail',
    };
    await dbPut('inspections', ins);
    eq.status = overallPass ? 'active' : 'out_of_service';
    await dbPut('equipment', eq);
    showToast('Inspection updated.');
    navigate('detail', { id: eqId, tab: 'history' });
  });

  const deleteInspectionInline = document.getElementById('delete-inspection-inline');
  if (deleteInspectionInline) deleteInspectionInline.addEventListener('click', () => {
    const eqId = inspEditForm.dataset.id;
    const insId = inspEditForm.dataset.insid;
    confirmDeleteInspection(eqId, insId);
  });

  document.querySelectorAll('[data-action="delete-inspection"]').forEach(btn => {
    btn.addEventListener('click', () => confirmDeleteInspection(btn.dataset.id, btn.dataset.insid));
  });
}

function confirmDeleteInspection(eqId, insId) {
  const backdrop = openSheet(`
    <div class="sheet-title">Delete this inspection?</div>
    <div class="sheet-sub">This removes it from the history log permanently. This can't be undone.</div>
    <button class="btn-danger" id="confirm-delete-insp">Delete permanently</button>
    <button class="btn-secondary" id="cancel-delete-insp">Cancel</button>
  `);
  backdrop.querySelector('#cancel-delete-insp').addEventListener('click', closeSheet);
  backdrop.querySelector('#confirm-delete-insp').addEventListener('click', async () => {
    await dbDelete('inspections', insId);
    closeSheet();
    showToast('Inspection deleted.');
    navigate('detail', { id: eqId, tab: 'history' });
  });
}

function updateInspectionBanner() {
  const banner = document.getElementById('insp-result-banner');
  if (!banner) return;
  const groups = document.querySelectorAll('.checklist-toggle');
  let answered = 0, hasFail = false;
  groups.forEach(g => {
    const sel = g.querySelector('.toggle-btn.selected');
    if (sel) { answered++; if (sel.dataset.val === 'fail') hasFail = true; }
  });
  if (answered === 0) { banner.innerHTML = ''; return; }
  if (hasFail) {
    banner.innerHTML = `<div class="result-banner fail">Item(s) rejected — will be flagged out of service</div>`;
  } else if (answered === groups.length) {
    banner.innerHTML = `<div class="result-banner pass">Overall disposition: Accepted</div>`;
  } else {
    banner.innerHTML = '';
  }
}

// ---------- Import (bulk add equipment + inspections from a JSON file) ----------
// Expected shape:
// { "equipment": [{ id, type, label, manufacturer, model, size, lanyardType,
//     length, srlClass, serial, lotNumber, manufactureDate, purchaseDate,
//     dateInService, intervalMonths, location, assignedTo, comments,
//     nextDueDate, status }, ...],
//   "inspections": [{ equipmentId, date, inspector, notes, items: [...],
//     result }, ...] }
function ensureImportInput() {
  let input = document.getElementById('import-file-input');
  if (!input) {
    input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.id = 'import-file-input';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.addEventListener('change', async () => {
      const file = input.files[0];
      input.value = '';
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await runImport(data);
      } catch (e) {
        showToast('Could not read that file — check it\'s valid JSON.');
      }
    });
  }
  return input;
}

async function runImport(data) {
  const eqList = Array.isArray(data.equipment) ? data.equipment : [];
  const insList = Array.isArray(data.inspections) ? data.inspections : [];
  let addedEq = 0, skippedEq = 0, addedIns = 0;
  for (const eq of eqList) {
    if (!eq.id || !eq.type) continue;
    const existing = await dbGet('equipment', eq.id);
    if (existing) { skippedEq++; continue; }
    await dbPut('equipment', {
      id: eq.id,
      type: eq.type,
      label: eq.label || '',
      manufacturer: eq.manufacturer || '',
      model: eq.model || '',
      size: eq.size || '',
      lanyardType: eq.lanyardType || '',
      length: eq.length || '',
      srlClass: eq.srlClass || '',
      serial: eq.serial || '',
      lotNumber: eq.lotNumber || '',
      manufactureDate: eq.manufactureDate || '',
      purchaseDate: eq.purchaseDate || '',
      dateInService: eq.dateInService || todayStr(),
      intervalMonths: eq.intervalMonths || 12,
      location: eq.location || '',
      assignedTo: eq.assignedTo || '',
      comments: eq.comments || '',
      nextDueDate: eq.nextDueDate || addMonths(eq.dateInService || todayStr(), eq.intervalMonths || 12),
      status: eq.status || 'active',
      createdAt: Date.now(),
    });
    addedEq++;
  }
  for (const ins of insList) {
    if (!ins.equipmentId || !ins.date) continue;
    await dbPut('inspections', {
      insId: uid(),
      equipmentId: ins.equipmentId,
      date: ins.date,
      inspector: ins.inspector || '',
      notes: ins.notes || '',
      items: Array.isArray(ins.items) ? ins.items : [],
      result: ins.result === 'fail' ? 'fail' : 'pass',
    });
    addedIns++;
  }
  showToast(`Imported ${addedEq} equipment, ${addedIns} inspections${skippedEq ? ` (${skippedEq} skipped — ID already exists)` : ''}.`);
  navigate('list');
}


async function forceUpdate() {
  showToast('Refreshing app…');
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } catch (e) { /* fall through to reload regardless */ }
  location.reload();
}

// ---------- Boot ----------
async function boot() {
  await openDB();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      // Check for a newer sw.js on every launch so updates land without
      // needing the manual force-refresh button.
      reg.update().catch(() => {});
    }).catch(() => {});
    // When a new service worker takes control (after an update), reload
    // once so the fresh app.js/index.html are actually used.
    let refreshedOnce = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshedOnce) return;
      refreshedOnce = true;
      location.reload();
    });
  }
  const hashView = location.hash.replace('#', '');
  route = { view: hashView || 'dashboard', params: {} };
  history.replaceState(route, '', '#' + route.view);
  render();
}
boot();
