/* 學測地科命題地圖 — 主程式 */
(function () {
  'use strict';
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const el = (t, cls) => { const e = document.createElement(t); if (cls) e.className = cls; return e; };
  const fmt = (n) => n.toLocaleString('zh-TW');

  const DATA = { curriculum: null, questions: [] };
  const NODES = {}; // nodeId -> {name, themeId, themeName, colorVar}
  const THEMES = [];
  const YEARS = ['106','107','108','109','110','111','112','113','114','115'];

  // ---------- theme toggle ----------
  (function () {
    const t = $('[data-theme-toggle]');
    const r = document.documentElement;
    let d = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
    r.setAttribute('data-theme', d);
    const sun = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4.5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>';
    const moon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
    const render = () => (t.innerHTML = d === 'dark' ? sun : moon);
    render();
    t.addEventListener('click', () => { d = d === 'dark' ? 'light' : 'dark'; r.setAttribute('data-theme', d); render(); });
  })();

  // ---------- starfield ----------
  function renderStarfield() {
    const svg = $('#starfield'); if (!svg) return;
    const W = 1440, H = 420, stars = 90;
    let html = `<defs><radialGradient id="hg" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.16"/><stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0"/></radialGradient></defs>`;
    html += `<rect width="${W}" height="${H}" fill="url(#hg)"/>`;
    for (let i = 0; i < stars; i++) {
      const x = Math.random() * W, y = Math.random() * H, r = Math.random() * 1.4 + 0.3;
      const o = Math.random() * 0.6 + 0.2;
      html += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="var(--color-primary)" opacity="${o.toFixed(2)}"/>`;
    }
    // orbit ring
    html += `<ellipse cx="${W * 0.82}" cy="${H * 0.5}" rx="260" ry="70" fill="none" stroke="var(--color-accent)" stroke-opacity="0.18" stroke-width="1" transform="rotate(-18 ${W*0.82} ${H*0.5})"/>`;
    svg.innerHTML = html;
  }

  // ---------- data load ----------
  async function init() {
    renderStarfield();
    try {
      const [cur, qs] = await Promise.all([
        fetch('data/curriculum_nodes.json').then(r => r.json()),
        fetch('data/questions.json').then(r => r.json()),
      ]);
      DATA.curriculum = cur;
      DATA.questions = qs;
      cur.themes.forEach(t => { THEMES.push({ id: t.id, name: t.name, colorVar: `--theme-c${t.id.slice(1)}` }); t.nodes.forEach(n => { NODES[n.id] = { name: n.name, themeId: t.id, themeName: t.name, colorVar: `--theme-c${t.id.slice(1)}` }; }); });
      renderStats();
      renderNodeOverview();
      renderMatrix();
      renderCogChart();
      renderTrendLine();
      renderInsights();
      initFilters();
      renderCards();
    } catch (e) {
      console.error(e);
      $('#cards').innerHTML = '<div class="empty-state">資料載入失敗，請重新整理。</div>';
    }
  }

  // ---------- stats ----------
  function renderStats() {
    const qs = DATA.questions;
    const analyze = Math.round(qs.filter(q => q.cognitiveLevel === '分析').length / qs.length * 100);
    const chart = Math.round(qs.filter(q => q.hasChart).length / qs.length * 100);
    const nodesUsed = new Set(qs.map(q => q.nodeId)).size;
    $('#stat-questions').textContent = qs.length;
    $('#stat-nodes').textContent = nodesUsed + '/' + Object.keys(NODES).length;
    $('#stat-analyze').textContent = analyze + '%';
    $('#stat-chart').textContent = chart + '%';
  }

  // ---------- node overview ----------
  function renderNodeOverview() {
    const root = $('#node-overview');
    const counts = {};
    DATA.questions.forEach(q => counts[q.nodeId] = (counts[q.nodeId] || 0) + 1);
    const max = Math.max(1, ...Object.values(counts));
    const total = DATA.questions.length;
    THEMES.forEach(theme => {
      const nodes = DATA.curriculum.themes.find(t => t.id === theme.id).nodes;
      const themeTotal = nodes.reduce((s, n) => s + (counts[n.id] || 0), 0);
      if (themeTotal === 0) return;
      const group = el('div', 'theme-group');
      const title = el('div', 'theme-group__title');
      title.innerHTML = `<span class="theme-dot" style="background:var(${theme.colorVar})"></span>${theme.name}<span class="count">${themeTotal} 題</span>`;
      group.appendChild(title);
      const grid = el('div', 'node-grid');
      nodes.forEach(n => {
        const c = counts[n.id] || 0;
        const card = el('div', 'node-card');
        card.innerHTML = `
          <div class="node-card__id">${n.id}</div>
          <div class="node-card__name">${n.name}</div>
          <div class="node-card__bar"><div class="node-card__bar-fill" style="width:${(c / max * 100).toFixed(0)}%;background:var(${theme.colorVar})"></div></div>
          <div class="node-card__stats"><span><b>${c}</b> 題</span><span>${(c / total * 100).toFixed(0)}%</span></div>`;
        grid.appendChild(card);
      });
      group.appendChild(grid);
      root.appendChild(group);
    });
  }

  // ---------- heat matrix ----------
  function renderMatrix() {
    const tbl = $('#heat-matrix');
    const nodesInOrder = [];
    DATA.curriculum.themes.forEach(t => t.nodes.forEach(n => { if (DATA.questions.some(q => q.nodeId === n.id)) nodesInOrder.push(n); }));
    // build counts
    const counts = {};
    DATA.questions.forEach(q => { counts[q.nodeId] = counts[q.nodeId] || {}; counts[q.nodeId][q.year] = (counts[q.nodeId][q.year] || 0) + 1; });

    let thead = '<thead><tr><th></th>';
    YEARS.forEach(y => { thead += `<th>${y}</th>`; });
    thead += '</tr></thead>';
    let tbody = '<tbody>';
    nodesInOrder.forEach(n => {
      const t = DATA.curriculum.themes.find(th => th.id === n.themeId || th.nodes.includes(n));
      const colorVar = `--theme-c${(t ? t.id : '1').slice(1)}`;
      tbody += `<tr><th>${n.name}</th>`;
      YEARS.forEach(y => {
        const c = (counts[n.id] && counts[n.id][y]) || 0;
        const lvl = c >= 4 ? 7 : c === 3 ? 6 : c === 2 ? 4 : c === 1 ? 2 : 0;
        const cls = c === 0 ? 'cell empty' : 'cell';
        tbody += `<td><div class="${cls}" style="background:var(--heat-${lvl})">${c || ''}</div></td>`;
      });
      tbody += '</tr>';
    });
    tbody += '</tbody>';
    tbl.innerHTML = thead + tbody;

    // legend
    const scale = $('#legend-scale');
    let sh = '';
    for (let i = 0; i <= 7; i++) sh += `<span style="background:var(--heat-${i})"></span>`;
    scale.innerHTML = sh;
  }

  // ---------- cognitive stacked bar ----------
  function renderCogChart() {
    const root = $('#cog-chart');
    const levels = ['知識', '理解', '應用', '分析'];
    const colors = { '知識': 'var(--lvl-knowledge)', '理解': 'var(--lvl-understand)', '應用': 'var(--lvl-apply)', '分析': 'var(--lvl-analyze)' };
    const perYear = {};
    YEARS.forEach(y => perYear[y] = { '知識': 0, '理解': 0, '應用': 0, '分析': 0 });
    DATA.questions.forEach(q => { if (perYear[q.year]) perYear[q.year][q.cognitiveLevel]++; });
    const max = Math.max(...YEARS.map(y => Object.values(perYear[y]).reduce((a, b) => a + b, 0)));
    const chart = el('div', 'bar-chart');
    YEARS.forEach(y => {
      const total = Object.values(perYear[y]).reduce((a, b) => a + b, 0);
      const row = el('div', 'bar-row');
      let segs = '';
      levels.forEach(l => { const v = perYear[y][l]; if (v) segs += `<div class="bar-row__seg" style="width:${(v / max * 100).toFixed(1)}%;background:${colors[l]}" title="${l} ${v} 題"></div>`; });
      row.innerHTML = `<span class="bar-row__label">${y}</span><div class="bar-row__track">${segs}</div><span class="bar-row__val">${total}</span>`;
      chart.appendChild(row);
    });
    root.appendChild(chart);
    // legend
    const lg = $('#cog-legend');
    levels.forEach(l => { const p = el('span', 'legend-pill'); p.innerHTML = `<span class="sw" style="background:${colors[l]}"></span>${l}`; lg.appendChild(p); });
  }

  // ---------- trend line (chart & difficult) ----------
  function renderTrendLine() {
    const svg = $('#trend-line');
    const W = 480, H = 220, padL = 30, padR = 10, padT = 16, padB = 30;
    const innerW = W - padL - padR, innerH = H - padT - padB;
    const data = YEARS.map(y => {
      const ys = DATA.questions.filter(q => q.year === y);
      const chart = ys.length ? ys.filter(q => q.hasChart).length / ys.length : 0;
      const hard = ys.length ? ys.filter(q => q.difficulty === '難').length / ys.length : 0;
      return { y, chart, hard, n: ys.length };
    });
    const x = i => padL + (i / (YEARS.length - 1)) * innerW;
    const y = v => padT + (1 - v) * innerH;
    let h = '';
    // grid lines
    for (let g = 0; g <= 4; g++) {
      const yy = padT + (g / 4) * innerH;
      h += `<line x1="${padL}" y1="${yy}" x2="${W - padR}" y2="${yy}" stroke="var(--color-divider)" stroke-width="1"/>`;
      h += `<text x="${padL - 6}" y="${yy + 4}" text-anchor="end" font-size="9" fill="var(--color-text-faint)">${(100 - g * 25)}%</text>`;
    }
    // line: chart
    const path = (key) => data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(d[key]).toFixed(1)}`).join(' ');
    h += `<path d="${path('chart')}" fill="none" stroke="var(--color-accent)" stroke-width="2.5" stroke-linejoin="round"/>`;
    h += `<path d="${path('hard')}" fill="none" stroke="var(--lvl-analyze)" stroke-width="2.5" stroke-linejoin="round" stroke-dasharray="4 3"/>`;
    // dots + labels
    data.forEach((d, i) => {
      h += `<circle cx="${x(i).toFixed(1)}" cy="${y(d.chart).toFixed(1)}" r="3" fill="var(--color-accent)"/>`;
      h += `<circle cx="${x(i).toFixed(1)}" cy="${y(d.hard).toFixed(1)}" r="3" fill="var(--lvl-analyze)"/>`;
      h += `<text x="${x(i).toFixed(1)}" y="${H - padB + 14}" text-anchor="middle" font-size="9" fill="var(--color-text-muted)">${d.y}</text>`;
    });
    svg.innerHTML = h;
  }

  // ---------- insights ----------
  function renderInsights() {
    const qs = DATA.questions;
    const nodeCounts = {};
    qs.forEach(q => nodeCounts[q.nodeId] = (nodeCounts[q.nodeId] || 0) + 1);
    const top = Object.entries(nodeCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const topStr = top.map(([id, c]) => `${NODES[id].name}（${c} 題）`).join('、');
    const analyze = qs.filter(q => q.cognitiveLevel === '分析').length;
    const early = qs.filter(q => ['106','107','108'].includes(q.year));
    const late = qs.filter(q => ['113','114','115'].includes(q.year));
    const earlyChart = early.length ? Math.round(early.filter(q => q.hasChart).length / early.length * 100) : 0;
    const lateChart = late.length ? Math.round(late.filter(q => q.hasChart).length / late.length * 100) : 0;
    const insights = [
      { t: '最熱命題節點', p: `十年累積前三名：${topStr}。天文與海洋、大氣為歷年命題核心。` },
      { t: '高層次思維成主流', p: `「分析」層次達 ${analyze} 題（${Math.round(analyze / qs.length * 100)}%），加上「應用」共占逾半，素養導向命題已是常態。` },
      { t: '圖表題半數化', p: `整體 ${Math.round(qs.filter(q => q.hasChart).length / qs.length * 100)}% 試題含圖表，較 106–108 年（約 ${earlyChart}%）上升至 113–115 年（約 ${lateChart}%），圖表判讀能力愈趨關鍵。` },
      { t: '冷區提示', p: 'Ea3-1 大氣結構、Ea6-4 因應氣候變遷、Ea7-2 資源利用等節點十年命題偏少，複習可著重基本定義即可。' },
    ];
    const root = $('#insights');
    insights.forEach(i => { const e = el('div', 'insight'); e.innerHTML = `<h4>${i.t}</h4><p>${i.p}</p>`; root.appendChild(e); });
  }

  // ---------- filters + cards ----------
  let filterState = { year: '', theme: '', node: '', cog: '', chart: '', search: '' };

  function initFilters() {
    const years = [...new Set(DATA.questions.map(q => q.year))].sort();
    years.forEach(y => $('#f-year').appendChild(new Option(`${y} 學年度`, y)));
    THEMES.forEach(t => $('#f-theme').appendChild(new Option(t.name, t.id)));
    DATA.curriculum.themes.forEach(t => t.nodes.forEach(n => { if (DATA.questions.some(q => q.nodeId === n.id)) $('#f-node').appendChild(new Option(`${n.id} ${n.name}`, n.id)); }));
    ['知識', '理解', '應用', '分析'].forEach(c => $('#f-cog').appendChild(new Option(c, c)));

    const upd = () => { filterState.year = $('#f-year').value; filterState.theme = $('#f-theme').value; filterState.node = $('#f-node').value; filterState.cog = $('#f-cog').value; filterState.chart = $('#f-chart').value; filterState.search = $('#f-search').value.toLowerCase().trim(); renderCards(); };
    ['#f-year', '#f-theme', '#f-node', '#f-cog', '#f-chart'].forEach(s => $(s).addEventListener('change', upd));
    $('#f-search').addEventListener('input', upd);

    // theme -> node cascade
    $('#f-theme').addEventListener('change', () => {
      const t = $('#f-theme').value;
      const nodeSel = $('#f-node');
      nodeSel.innerHTML = '<option value="">全部</option>';
      const themeObj = DATA.curriculum.themes.find(th => th.id === t);
      if (themeObj) themeObj.nodes.filter(n => DATA.questions.some(q => q.nodeId === n.id)).forEach(n => nodeSel.appendChild(new Option(`${n.id} ${n.name}`, n.id)));
    });
  }

  function renderCards() {
    const root = $('#cards');
    let list = DATA.questions.slice();
    const f = filterState;
    if (f.year) list = list.filter(q => q.year === f.year);
    if (f.node) list = list.filter(q => q.nodeId === f.node);
    else if (f.theme) { const themeObj = DATA.curriculum.themes.find(t => t.id === f.theme); if (themeObj) { const ids = new Set(themeObj.nodes.map(n => n.id)); list = list.filter(q => ids.has(q.nodeId)); } }
    if (f.cog) list = list.filter(q => q.cognitiveLevel === f.cog);
    if (f.chart !== '') list = list.filter(q => String(q.hasChart) === f.chart);
    if (f.search) list = list.filter(q => (q.concept + q.nodeName + q.nodeId + q.themeName).toLowerCase().includes(f.search));

    $('#filter-count').textContent = `共 ${list.length} 題`;
    root.innerHTML = '';
    if (!list.length) { root.innerHTML = '<div class="empty-state">沒有符合條件的題目</div>'; return; }
    const frag = document.createDocumentFragment();
    const cogClass = { '知識': 'tag--knowledge', '理解': 'tag--understand', '應用': 'tag--apply', '分析': 'tag--analyze' };
    list.forEach(q => {
      const card = el('div', 'q-card');
      const qidShort = q.qid.replace(/^0+/, '');
      card.innerHTML = `
        <div class="q-card__top">
          <span class="q-card__qid">${q.year} 第${qidShort}題</span>
          <span class="q-card__year">${q.year}學測</span>
          <span class="q-card__node">${q.nodeName}</span>
        </div>
        <p class="q-card__concept">${q.concept}</p>
        <div class="q-card__foot">
          <span class="tag ${cogClass[q.cognitiveLevel] || ''}">${q.cognitiveLevel}</span>
          <span class="tag tag--diff">${q.difficulty}</span>
          ${q.hasChart ? '<span class="tag tag--chart">📊 圖表</span>' : ''}
          <a class="q-card__link" href="${q.examUrl}" target="_blank" rel="noopener">官方試卷 ↗</a>
        </div>`;
      frag.appendChild(card);
    });
    root.appendChild(frag);
  }

  init();
})();
