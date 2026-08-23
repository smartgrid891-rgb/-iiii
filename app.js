/* ====================================================================
   學測國文複習系統 — 應用邏輯 (Vanilla JS SPA)
   對應物理站 app.js：hash 路由、視圖生命週期、批改、localStorage
   ==================================================================== */
'use strict';

/* ===== 素養包裝破解器資料（兩欄：情境包裝 ↔ 核心考點）===== */
const BUSTER_DATA = [
  {
    surface:'某題以「行銷企劃書」形式包裝，給一段產品文案，問其中「隱含的論證結構」與「主要訴求對象」。',
    surfaceTitle:'113 學測示例：行銷文案閱讀題',
    coreTitle:'論點與論據的辨識',
    core:'本質是閱讀理解的「主旨與論據」節點（N14/N15）。文案雖披上行銷外衣，但解題只需剝離廣告語言，找出「主張」與「支撐主張的理由」。',
    strategy:'策略：把文案當一般論述文讀，問自己「作者主張什麼」「用什麼證據說服我」。'
  },
  {
    surface:'某題以「求職信改寫」為情境，要求判斷哪個版本符合應用文格式與語氣。',
    surfaceTitle:'112 學測示例：求職信應用文題',
    coreTitle:'書信格式與稱謂語氣',
    core:'本質是應用文的「書信與稱謂」節點（N24）。求職信的包裝只是背景，真正考的是提稱語、自稱、結尾敬辭的格式正確性。',
    strategy:'策略：不管求職信寫得多動人，先檢查格式（提稱、自稱、敬辭）是否正確，再看語氣是否得體。'
  },
  {
    surface:'某題以「氣候變遷報導」為文本，夾雜數據與科學術語，問「作者對政策的態度」與「可推論的事實」。',
    surfaceTitle:'114 學測示例：氣候報導閱讀題',
    coreTitle:'作者觀點與細節推論',
    core:'本質是閱讀理解的「作者觀點」（N17）與「細節推論」（N15）。科學術語與數據是干擾包裝，解題關鍵在區分「事實陳述」與「作者評論」。',
    strategy:'策略：標出評論性詞句（應當、必須、令人擔憂），這些是作者態度的線索；數據只是論據，不是結論。'
  },
  {
    surface:'某題以「社群貼文」形式呈現一段議論，問「其中何者為未經證實的主張」。',
    surfaceTitle:'113 學測示例：社群貼文思辨題',
    coreTitle:'事實與意見的區辨',
    core:'本質是閱讀理解的「推論」（N15）與批判思辨（tc）。社群貼文混雜事實陳述與主觀意見，考的是能否區分「可驗證的事實」與「個人意見/推測」。',
    strategy:'策略：逐句標記「事實」或「意見」。能查證的為事實，含評價/預測/主張的為意見。'
  },
  {
    surface:'某題以「古文＋白話夾敘」呈現一段文言選文，附上譯註，問「畫線句的修辭與句式」。',
    surfaceTitle:'111 學測示例：古今對讀文言題',
    coreTitle:'文言句式與修辭辨識',
    core:'本質是文言文的「文言句式」（N11）與修辭的「修辭辨識」（N05）。古今夾敘的編排只是降低閱讀門檻，解題仍須回到畫線句的結構分析。',
    strategy:'策略：忽略譯註的干擾，直接分析畫線句——找虛詞、判句式、辨修辭，按字→句→篇層次推進。'
  },
  {
    surface:'某題節錄15古文之一（如《赤壁賦》《鴻門宴》《師說》），問「作者情志／全篇主旨／某段敘事作用」，並搭配看似合理的現代化選項。',
    surfaceTitle:'近年學測示例：古文15篇情志題',
    coreTitle:'體裁＋結構＋情志三軸判讀',
    core:'本質是15古文的「體裁特徵＋結構手法＋作者情志」（N31-N45）。現代化選項與情境包裝只是干擾，解題須回到體裁定方向、抓結構線索（對比／主客問答／今昔對照／托物言志）、再推作者情志。',
    strategy:'策略：先辨體裁（論說/記敘/賦/小說/遊記）→ 抓結構線索 → 回文本找情志證據，不作脫離文本的推論。'
  }
];

/* ===== localStorage 持久化（穩定鍵設計，防題庫變動錯位）===== */
const REC_KEY = 'gsat-chinese-records-v1';
function loadRecords() {
  try {
    const raw = JSON.parse(localStorage.getItem(REC_KEY));
    if (raw && raw.bank) return raw;
  } catch (e) { /* 壞資料視同無紀錄 */ }
  return { bank: {} };
}
let studyRecords = loadRecords();
function saveRecords() {
  try { localStorage.setItem(REC_KEY, JSON.stringify(studyRecords)); }
  catch (e) { /* 無痕模式等情況下略過 */ }
}
// 穩定鍵：節點｜層次｜題幹雜湊（DJB2），不用陣列序號
function bankKey(q) {
  let h = 5381;
  const s = q.q || '';
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return q.node + '|' + q.level + '|' + h.toString(36);
}
function recordResult(q, isCorrect) {
  const k = bankKey(q);
  const r = studyRecords.bank[k] || { a: 0, c: 0, last: 0, t: 0, nodes: q.node };
  r.a++; r.t = Date.now();
  if (isCorrect) { r.c++; r.last = 1; }
  else r.last = -1;
  studyRecords.bank[k] = r;
  saveRecords();
}

/* ===== 記憶體互動狀態（session-only）===== */
const bankSel = {};     // uid -> Set of selected option indices
const bankDone = {};    // uid -> bool
const bankScored = {};  // uid -> bool (避免重複計分)
const probeSel = {};   // probeId -> selected index

/* ===== 視圖生命週期清理 ===== */
let cleanupFns = [];
function onCleanup(fn) { cleanupFns.push(fn); }
function cleanupCurrentView() {
  cleanupFns.forEach(fn => { try { fn(); } catch(e){} });
  cleanupFns = [];
}

/* ===== 路由 ===== */
function routeFromLocation() {
  return decodeURIComponent(location.hash.replace(/^#/, '')) || 'home';
}
function navigateTo(targetId, options = {}) {
  const nextHash = '#' + encodeURIComponent(targetId);
  if (options.replace) history.replaceState({}, '', nextHash);
  else {
    history.pushState({}, '', nextHash);
  }
  renderRoute(targetId);
  // 關閉行動版側欄
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('main').scrollTop = 0;
  window.scrollTo(0, 0);
}
function goBackInApp() {
  if (history.length > 1) history.back();
  else navigateTo('home', { replace: true });
}
function renderRoute(route) {
  cleanupCurrentView();
  const view = document.getElementById('view');
  let html = '';
  try {
    if (route === 'home' || route === '') {
      html = renderHome();
    } else if (route === 'tool-summary') {
      html = renderSummary();
    } else if (route === 'tool-quiz') {
      html = renderQuizBank();
    } else if (route.startsWith('bank-')) {
      html = renderQuizBank(route.replace('bank-', ''));
    } else if (route === 'tool-exams') {
      html = renderExams();
    } else if (route === 'tool-diagnose') {
      html = renderDiagnose();
    } else if (route === 'tool-wrong') {
      html = renderWrong();
    } else if (route === 'tool-stats') {
      html = renderStats();
    } else if (route === 'tool-buster') {
      html = renderBuster();
    } else if (route.startsWith('node-')) {
      html = renderNodeView(route.replace('node-', ''));
    } else {
      html = `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-text">找不到「${esc(route)}」這個頁面</div><div class="empty-hint"><a href="#home">回到首頁</a></div></div>`;
    }
  } catch (e) {
    console.error(e);
    html = `<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-text">頁面渲染發生錯誤</div><div class="empty-hint">${esc(e.message)}</div></div>`;
  }
  view.innerHTML = html;
  // 渲染後掛載互動
  if (typeof afterRender === 'function') afterRender(route);
  // 更新側欄 active
  updateSidebarActive(route);
  // 顯示/隱藏上一頁按鈕
  document.getElementById('backBtn').style.display = (route === 'home' || route === '') ? 'none' : 'inline-flex';
}

/* ===== 工具函式 ===== */
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function uidCounter() { return 'u' + Math.random().toString(36).slice(2, 9); }

function findNode(id) { return knowledgeNodes.find(n => n.id === id); }
function moduleOf(num) { return modulesData[num]; }
function nodeTitle(id) { const n = findNode(id); return n ? n.name : id; }

/* ===== 側欄渲染 ===== */
function renderSidebar() {
  const el = document.getElementById('sidebar');
  let html = '';
  html += `<div class="brand"><span class="brand-seal">文</span><div class="brand-title">學測國文複習系統</div><div class="brand-sub">108 課綱 · 知識節點導航</div></div>`;

  // 開始
  html += `<nav class="nav-section"><div class="nav-section-title">開始</div>`;
  html += `<div class="node-group"><ul class="node-list">`;
  html += `<li class="node-item"><a class="node-link" href="#home"><span class="node-id">▸</span>學習首頁</a></li>`;
  html += `<li class="node-item"><a class="node-link" href="#tool-diagnose"><span class="node-id">⏱</span>15 分鐘診斷卷</a></li>`;
  html += `<li class="node-item"><a class="node-link" href="#tool-quiz"><span class="node-id">✏</span>分級題庫</a></li>`;
  html += `<li class="node-item"><a class="node-link" href="#tool-buster"><span class="node-id">◎</span>素養破解器</a></li>`;
  html += `</ul></div></nav>`;

  // 複習節點（依模組分組）
  html += `<nav class="nav-section"><div class="nav-section-title">複習節點</div>`;
  NODE_GROUPS.forEach(g => {
    const nodes = knowledgeNodes.filter(n => n.module === g.key);
    html += `<div class="node-group"><div class="node-group-head"><span class="node-group-icon">${g.icon}</span>${g.title}</div>`;
    html += `<ul class="node-list">`;
    nodes.forEach(n => {
      html += `<li class="node-item"><a class="node-link" href="#node-${n.id}"><span class="node-id">${n.id}</span>${esc(n.name)}<span class="node-badge">${n.exam5y}</span></a></li>`;
    });
    html += `</ul></div>`;
  });
  html += `</nav>`;

  // 複習工具箱
  const tools = [
    { id:'tool-summary', icon:'∑', name:'國文核心總整理' },
    { id:'tool-quiz', icon:'✏', name:'知識節點分級題庫' },
    { id:'tool-exams', icon:'試', name:'歷屆試題練習' },
    { id:'tool-diagnose', icon:'⏱', name:'15 分鐘診斷卷' },
    { id:'tool-wrong', icon:'✘', name:'錯題本' },
    { id:'tool-stats', icon:'▦', name:'五年命題矩陣' },
    { id:'tool-buster', icon:'◎', name:'素養包裝破解器' }
  ];
  html += `<nav class="nav-section"><div class="nav-section-title">複習工具箱</div><ul class="tool-list">`;
  tools.forEach(t => {
    html += `<li><a class="tool-link" href="#${t.id}"><span class="tool-icon">${t.icon}</span>${t.name}</a></li>`;
  });
  html += `</ul></nav>`;

  html += `<div class="sidebar-foot">本系統仿照物理複習系統精神製作<br>結合認知心理學與大考數據分析</div>`;
  el.innerHTML = html;
}

function updateSidebarActive(route) {
  document.querySelectorAll('.node-link, .tool-link').forEach(a => a.classList.remove('active'));
  const sel = document.querySelector(`a[href="#${route}"]`);
  if (sel) sel.classList.add('active');
}

/* ===== 首頁 ===== */
function renderHome() {
  const totalNodes = knowledgeNodes.length;
  const totalQ = questionBank.length;
  return `
  <div class="hero">
    <span class="hero-tag">108 課綱 · 知識節點導航</span>
    <h1 class="hero-title">學測國文複習系統</h1>
    <p class="hero-sub">結合認知心理學與大考數據分析。以 ${totalNodes} 個知識節點貫穿字音字形、修辭、文言文、閱讀理解、國學常識、應用文與國寫，每個錯誤都被解釋，素養可以被拆解。先測、再診斷、後補強。</p>
    <div class="cta-row">
      <a class="cta" href="#tool-diagnose"><span class="cta-icon">⏱</span><span class="cta-label">15 分鐘診斷卷</span><span class="cta-desc">不知道從哪讀起？先測一輪，依考題頻率排優先序</span></a>
      <a class="cta" href="#node-N01"><span class="cta-icon">▸</span><span class="cta-label">從第一節點開始</span><span class="cta-desc">逐節點系統複習，含錨點金句與隨堂檢測</span></a>
      <a class="cta" href="#tool-quiz"><span class="cta-icon">✏</span><span class="cta-label">分級題庫</span><span class="cta-desc">記憶／理解／應用／分析四層，逐選項誘答解析</span></a>
      <a class="cta" href="#tool-buster"><span class="cta-icon">◎</span><span class="cta-label">素養包裝破解器</span><span class="cta-desc">拆解大考題幹的表面包裝，直指核心考點</span></a>
    </div>
  </div>
  <div class="card">
    <div class="card-title">系統三大精神</div>
    <p class="card-sub">①<b>知識節點化</b>——所有內容用同一組節點 ID 互相索引，從節點頁、題庫、歷屆試題、命題矩陣任一入口進來，都能看到同一份知識的不同面向。</p>
    <p class="card-sub">②<b>每個錯誤都要被解釋</b>——正確答案要解釋為何對，每個誘答選項也都要具體指出對應哪一種真實會犯的概念錯誤，貫穿隨堂檢測、見招拆招、分級題庫三層互動。</p>
    <p class="card-sub">③<b>素養可以被拆解</b>——再複雜的大考題，都能拆成「表面情境」與「核心考點」兩層，核心永遠落在已教過的知識節點之中。</p>
  </div>
  <div class="card">
    <div class="card-title">目前內容規模</div>
    <p class="card-sub">已建置 <b>${totalNodes}</b> 個知識節點、<b>${totalQ}</b> 題分級題庫（含誘答解析與國寫 CER 鷹架）、<b>${BUSTER_DATA.length}</b> 則素養包裝拆解範例。本系統為 MVP 示範版本，內容持續擴充中。</p>
  </div>`;
}

/* ===== 節點視圖 ===== */
function renderNodeView(nodeId) {
  const node = findNode(nodeId);
  if (!node) return `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-text">找不到節點 ${esc(nodeId)}</div></div>`;
  const m = moduleOf(node.module);
  const formulas = (m.formulas || []).filter(f => f.node === nodeId);
  const features = (m.keyFeatures || []).filter(f => f.node === nodeId);
  const exams = (m.examQuestions || []).filter(f => Array.isArray(f.node) ? f.node.includes(nodeId) : f.node === nodeId);

  let html = `<div class="breadcrumb"><a href="#home">首頁</a> › <a href="#node-${nodeId}">${esc(m.title.replace(/模組[一二三四五六七八九]：/, ''))}</a> › <span>${esc(node.name)}</span></div>`;
  html += `<h1 class="section-title">${esc(node.name)} <span style="font-size:13px;color:var(--ink-faint);font-weight:400">（${node.id} · 近五年命題 ${node.exam5y} 組）</span></h1>`;
  html += `<div class="card"><span class="card-badge">${m.badge}</span><div class="card-title">${esc(m.title)}</div><div class="card-sub">${esc(m.subtitle)}</div></div>`;

  if (node.detail) {
    html += `<div class="card"><div class="card-title">五年核心考點</div><p class="card-sub">${esc(node.detail)}</p></div>`;
  }

  // 知識卡（formulas）
  if (formulas.length) {
    html += `<h2 class="subsection-title">知識卡 <span class="badge-count">${formulas.length}</span></h2>`;
    formulas.forEach(f => { html += renderFormulaCard(f); });
  } else {
    html += `<div class="card"><div class="card-title">${esc(node.name)}</div><p class="card-sub">本節點尚在建置中，完整知識卡即將推出。可先至<a href="#tool-quiz">分級題庫</a>練習相關題目。</p></div>`;
  }

  // 見招拆招
  if (features.length) {
    html += `<h2 class="subsection-title">見招拆招 <span class="badge-count">${features.length}</span></h2>`;
    features.forEach(f => { html += renderFeatureCard(f); });
  }

  // 歷屆真題拆解
  if (exams.length) {
    html += `<h2 class="subsection-title">歷屆真題拆解 <span class="badge-count">${exams.length}</span></h2>`;
    exams.forEach(e => {
      html += `<div class="ecard"><span class="ecard-year">${esc(e.year)}</span><div class="ecard-title">${esc(e.title)}</div><div class="ecard-desc">${e.desc}</div></div>`;
    });
  }

  // 操作入口
  const nodeQ = questionBank.filter(q => q.node === nodeId);
  html += `<div class="card"><div class="card-title">練習此節點</div>`;
  if (nodeQ.length) {
    html += `<p class="card-sub">本節點共有 <b>${nodeQ.length}</b> 題題庫題。`;
    html += ` <a class="btn btn-primary" href="#bank-${nodeId}">練習此節點題庫 →</a></p>`;
  } else {
    html += `<p class="card-sub">本節點尚無題庫題，可先至<a href="#tool-quiz">完整題庫</a>瀏覽。</p>`;
  }
  html += `</div>`;

  return html;
}

function renderFormulaCard(f) {
  const pid = 'probe-' + uidCounter();
  const hasProbe = !!f.probe;
  let probeHtml = '';
  if (hasProbe) {
    probeHtml = `<div class="probe-box" id="${pid}">
      <div class="probe-q">${esc(f.probe.q)}</div>
      <div class="probe-hint">先想 10 秒、押一個答案，再往下看解析</div>
      <ul class="probe-opts">${f.probe.opts.map((o, i) => `<li class="probe-opt" data-pid="${pid}" data-i="${i}" onclick="probePick('${pid}',${i})">${esc(o.t)}</li>`).join('')}</ul>
      <button class="probe-btn" onclick="probeReveal('${pid}')" disabled>送出並揭示解析</button>
    </div>`;
  }
  // 有 probe 時預設隱藏 anchor/desc；無 probe 時直接顯示
  const revealId = 'reveal-' + uidCounter();
  const revealStyle = hasProbe ? 'display:none' : 'display:block';
  const anchorDescBlock = `<div id="${revealId}" style="${revealStyle}">${f.anchor ? `<div class="kcard-anchor">${esc(f.anchor)}</div>` : ''}${f.desc ? `<div class="kcard-desc">${f.desc}</div>` : ''}</div>`;

  return `<div class="kcard">
    <div class="kcard-node">${esc(f.node)}</div>
    <div class="kcard-name">${esc(f.name)}</div>
    <div class="kcard-formula">${esc(f.formula)}</div>
    ${probeHtml}
    ${anchorDescBlock}
  </div>`;
}

function renderFeatureCard(f) {
  return `<div class="fcard">
    <div class="fcard-label">見招拆招 · ${esc(f.node)}</div>
    <div class="fcard-text"><b>觸發特徵：</b>${esc(f.feature)}</div>
    <div class="fcard-bridge"><b>解法橋接：</b>${esc(f.bridge)}</div>
    ${f.trap ? `<div class="fcard-trap">${esc(f.trap)}</div>` : ''}
  </div>`;
}

/* ===== Probe 互動（commit-before-reveal）===== */
function probePick(pid, idx) {
  probeSel[pid] = idx;
  document.querySelectorAll(`.probe-opt[data-pid="${pid}"]`).forEach((el, i) => {
    el.classList.remove('selected');
    if (i === idx) el.classList.add('selected');
  });
  const btn = document.querySelector(`#${pid} .probe-btn`);
  if (btn) btn.disabled = false;
}
function probeReveal(pid) {
  const probeBox = document.getElementById(pid);
  if (!probeBox) return;
  const opts = probeBox.querySelectorAll('.probe-opt');
  const sel = probeSel[pid];
  // 找正解
  const f = findFormulaByProbeId(pid);
  if (!f) return;
  opts.forEach((el, i) => {
    el.classList.remove('selected', 'correct', 'wrong');
    if (i === f.probe.correctIdx) el.classList.add('correct');
    else if (i === sel) el.classList.add('wrong');
  });
  // 揭示 anchor/desc
  const reveal = probeBox.nextElementSibling;
  if (reveal) reveal.style.display = 'block';
  const btn = probeBox.querySelector('.probe-btn');
  if (btn) { btn.disabled = true; btn.textContent = '已揭示解析'; }
}
// 反查 probe 對應的 formula（用題幹文字比對）
function findFormulaByProbeId(pid) {
  const probeBox = document.getElementById(pid);
  if (!probeBox) return null;
  const qText = probeBox.querySelector('.probe-q').textContent;
  for (const m of Object.values(modulesData)) {
    for (const f of (m.formulas || [])) {
      if (f.probe && f.probe.q === qText) {
        // 補算 correctIdx
        f.probe.correctIdx = f.probe.opts.findIndex(o => o.c === 1);
        return f;
      }
    }
  }
  return null;
}

/* ===== 國文核心總整理 ===== */
function renderSummary() {
  let html = `<div class="breadcrumb"><a href="#home">首頁</a> › <span>國文核心總整理</span></div>`;
  html += `<h1 class="section-title">國文核心總整理</h1>`;
  html += `<div class="card"><p class="card-sub">把 30 個節點的核心公式濃縮進一頁，供考前快速掃描。每行對應一張知識卡的核心重點。</p></div>`;
  NODE_GROUPS.forEach(g => {
    const nodes = knowledgeNodes.filter(n => n.module === g.key);
    html += `<h2 class="subsection-title">${g.title} <span class="badge-count">${nodes.length}</span></h2>`;
    nodes.forEach(n => {
      const m = moduleOf(n.module);
      const f = (m.formulas || []).find(x => x.node === n.id);
      if (f) {
        html += `<div class="kcard" style="margin-bottom:10px;padding:14px 18px"><div class="kcard-node">${n.id} · ${esc(n.name)}</div><div class="kcard-formula" style="margin:6px 0">${esc(f.formula)}</div></div>`;
      } else {
        html += `<div class="kcard" style="margin-bottom:10px;padding:14px 18px;border-left-color:var(--ink-faint)"><div class="kcard-node">${n.id} · ${esc(n.name)}</div><div style="font-size:13px;color:var(--ink-faint);margin-top:4px">建置中</div></div>`;
      }
    });
  });
  return html;
}

/* ===== 分級題庫 ===== */
let bankFilter = { node: 'all', level: 'all', type: 'all' };
function renderQuizBank(focusNode) {
  if (focusNode) bankFilter.node = focusNode;
  const qs = questionBank.map((q, i) => ({ q, i })).filter(item => {
    if (bankFilter.node !== 'all' && item.q.node !== bankFilter.node) return false;
    if (bankFilter.level !== 'all' && item.q.level !== bankFilter.level) return false;
    if (bankFilter.type !== 'all' && item.q.type !== bankFilter.type) return false;
    return true;
  });
  // 排序：依節點 → 層次權重
  qs.sort((a, b) => {
    if (a.q.node !== b.q.node) return a.q.node.localeCompare(b.q.node);
    return (BANK_LV_ORDER[a.q.level]||0) - (BANK_LV_ORDER[b.q.level]||0);
  });

  const nodeOpts = '<option value="all">全部節點</option>' + knowledgeNodes.map(n => `<option value="${n.id}" ${bankFilter.node===n.id?'selected':''}>${n.id} ${esc(n.name)}</option>`).join('');
  const levelOpts = '<option value="all">全部層次</option>' + ['記憶','理解','應用','分析'].map(l => `<option value="${l}" ${bankFilter.level===l?'selected':''}>${l}</option>`).join('');
  const typeOpts = '<option value="all">全部題型</option>' + ['single','multi','short'].map(t => `<option value="${t}" ${bankFilter.type===t?'selected':''}>${BANK_TYPE_LABEL[t]}</option>`).join('');

  let html = `<div class="breadcrumb"><a href="#home">首頁</a> › <span>分級題庫</span></div>`;
  html += `<h1 class="section-title">知識節點分級題庫</h1>`;
  html += `<div class="filter-bar">
    <div class="filter-group">節點 <select onchange="bankFilterChange('node',this.value)">${nodeOpts}</select></div>
    <div class="filter-group">層次 <select onchange="bankFilterChange('level',this.value)">${levelOpts}</select></div>
    <div class="filter-group">題型 <select onchange="bankFilterChange('type',this.value)">${typeOpts}</select></div>
    <div class="filter-count">共 ${qs.length} 題</div>
  </div>`;

  if (!qs.length) {
    html += `<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-text">沒有符合條件的題目</div><div class="empty-hint">試著調整篩選條件</div></div>`;
  } else {
    qs.forEach(item => { html += renderQuestionCard(item.q, item.i); });
  }
  return html;
}
function bankFilterChange(field, val) {
  bankFilter[field] = val;
  renderRoute('tool-quiz' + (bankFilter.node !== 'all' ? '' : ''));
  // 重新渲染後須還原捲動
}
// 重新渲染題庫時保留篩選
function renderQuizBankKeepFilter() {
  const html = renderQuizBank();
  document.getElementById('view').innerHTML = html;
  restoreBankStates();
}

/* ===== 題目卡片 ===== */
function renderQuestionCard(q, qid) {
  const uid = 'q' + qid;
  const node = findNode(q.node);
  if (q.type === 'short') return renderShortCard(q, qid, uid);

  const correctSet = new Set(q.opts.map((o, i) => o.c ? i : null).filter(x => x !== null));
  const isMulti = q.type === 'multi';

  let html = `<div class="qcard" id="card-${uid}">
    <div class="qcard-head">
      <span class="tag tag-node">${q.node} ${node ? esc(node.name) : ''}</span>
      <span class="tag tag-level">${q.level}</span>
      <span class="tag tag-type">${BANK_TYPE_LABEL[q.type]}</span>
    </div>
    <div class="qcard-q">${esc(q.q)}</div>
    <ul class="qcard-opts">`;
  q.opts.forEach((o, i) => {
    html += `<li class="qopt" data-uid="${uid}" data-i="${i}" onclick="bankSelect('${uid}',${i},${isMulti})">
      <span class="qopt-mark">${String.fromCharCode(65 + i)}.</span>
      <span>${esc(o.t)}</span>
    </li>`;
  });
  html += `</ul>
    <div class="qcard-actions">
      <button class="btn btn-primary" id="submit-${uid}" onclick="bankSubmit('${uid}')" disabled>送出回答</button>
      <button class="btn btn-ghost" onclick="bankReset('${uid}')">重置</button>
    </div>
    <div class="feedback" id="fb-${uid}"></div>
  </div>`;
  return html;
}

function renderShortCard(q, qid, uid) {
  const node = findNode(q.node);
  let html = `<div class="qcard" id="card-${uid}">
    <div class="qcard-head">
      <span class="tag tag-node">${q.node} ${node ? esc(node.name) : ''}</span>
      <span class="tag tag-level">${q.level}</span>
      <span class="tag tag-type">簡答題</span>
    </div>
    <div class="qcard-q">${esc(q.q)}</div>
    <textarea class="short-input" id="short-${uid}" placeholder="在此輸入你的作答..."></textarea>
    <div class="qcard-actions">
      <button class="btn btn-primary" onclick="shortReveal('${uid}')">看參考答案與 CER 鷹架</button>
    </div>
    <div class="feedback" id="fb-${uid}"></div>
  </div>`;
  return html;
}

/* ===== 題庫互動 ===== */
function bankSelect(uid, idx, isMulti) {
  if (bankDone[uid]) return;
  if (!bankSel[uid]) bankSel[uid] = new Set();
  if (isMulti) {
    if (bankSel[uid].has(idx)) bankSel[uid].delete(idx);
    else bankSel[uid].add(idx);
  } else {
    bankSel[uid].clear();
    bankSel[uid].add(idx);
  }
  // 更新視覺
  document.querySelectorAll(`.qopt[data-uid="${uid}"]`).forEach(el => {
    el.classList.remove('selected');
    if (bankSel[uid].has(parseInt(el.dataset.i))) el.classList.add('selected');
  });
  const btn = document.getElementById('submit-' + uid);
  if (btn) btn.disabled = bankSel[uid].size === 0;
}
function bankSubmit(uid) {
  if (bankDone[uid]) return;
  const qid = parseInt(uid.replace('q', ''));
  const q = bankIndex[qid];
  if (!q) return;
  const correctSet = new Set(q.opts.map((o, i) => o.c ? i : null).filter(x => x !== null));
  const sel = bankSel[uid] || new Set();
  const isCorrect = sel.size === correctSet.size && [...sel].every(i => correctSet.has(i));

  bankDone[uid] = true;
  if (!bankScored[uid]) {
    recordResult(q, isCorrect);
    bankScored[uid] = true;
  }
  paintBankResult(uid, q, correctSet, isCorrect);
}
function paintBankResult(uid, q, correctSet, isCorrect) {
  // 標記選項
  document.querySelectorAll(`.qopt[data-uid="${uid}"]`).forEach(el => {
    const i = parseInt(el.dataset.i);
    el.classList.remove('selected');
    if (correctSet.has(i)) el.classList.add('correct');
    else if ((bankSel[uid]||new Set()).has(i)) el.classList.add('incorrect');
  });
  // 逐選項解析
  let listHtml = q.opts.map((o, i) => {
    const mark = correctSet.has(i) ? '✔' : '✘';
    const cls = correctSet.has(i) ? 'ok' : 'no';
    return `<li><strong class="${cls}">${mark} ${String.fromCharCode(65+i)}</strong>：${esc(o.why || '無解析')}</li>`;
  }).join('');
  const fb = document.getElementById('fb-' + uid);
  if (fb) {
    fb.classList.add('show');
    fb.innerHTML = `<div class="feedback-result ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}">${isCorrect ? '答對了' : '答錯了'}</div>
      <ul class="feedback-list">${listHtml}</ul>
      <div class="feedback-exp">${esc(q.exp || '')}</div>`;
  }
  const btn = document.getElementById('submit-' + uid);
  if (btn) { btn.disabled = true; btn.textContent = '已作答'; }
}
function bankReset(uid) {
  delete bankSel[uid];
  delete bankDone[uid];
  delete bankScored[uid];
  const qid = parseInt(uid.replace('q', ''));
  const q = bankIndex[qid];
  const correctSet = new Set(q.opts.map((o, i) => o.c ? i : null).filter(x => x !== null));
  document.querySelectorAll(`.qopt[data-uid="${uid}"]`).forEach(el => {
    el.classList.remove('selected', 'correct', 'incorrect');
  });
  const fb = document.getElementById('fb-' + uid);
  if (fb) { fb.classList.remove('show'); fb.innerHTML = ''; }
  const btn = document.getElementById('submit-' + uid);
  if (btn) { btn.disabled = true; btn.textContent = '送出回答'; }
}
function shortReveal(uid) {
  const qid = parseInt(uid.replace('q', ''));
  const q = bankIndex[qid];
  if (!q) return;
  const fb = document.getElementById('fb-' + uid);
  if (!fb) return;
  fb.classList.add('show');
  let html = `<div class="feedback-result feedback-correct">參考答案與解析</div>`;
  html += `<div class="feedback-exp">${esc(q.ans || '無參考答案')}</div>`;
  if (q.cer) {
    html += `<details class="cer-box"><summary>展開 CER 論證鷹架（主張→證據→推理）</summary><div class="cer-grid">
      <div class="cer-row"><b>Claim 主張：</b>${esc(q.cer.c)}</div>
      <div class="cer-row"><b>Evidence 證據：</b>${esc(q.cer.e)}</div>
      <div class="cer-row"><b>Reasoning 推理：</b>${esc(q.cer.r)}</div>
    </div></details>`;
  }
  if (q.exp) html += `<div class="feedback-exp" style="margin-top:12px;border-top:1px solid var(--line);padding-top:12px">${esc(q.exp)}</div>`;
  fb.innerHTML = html;
}
// 切換篩選重新渲染後，重播已作答結果
function restoreBankStates() {
  Object.keys(bankDone).forEach(uid => {
    const qid = parseInt(uid.replace('q', ''));
    const q = bankIndex[qid];
    if (!q || q.type === 'short') return;
    const correctSet = new Set(q.opts.map((o, i) => o.c ? i : null).filter(x => x !== null));
    const sel = bankSel[uid] || new Set();
    const isCorrect = sel.size === correctSet.size && [...sel].every(i => correctSet.has(i));
    paintBankResult(uid, q, correctSet, isCorrect);
  });
}

/* ===== 歷屆試題練習（示例）===== */
function renderExams() {
  const years = ['111','112','113','114','115'];
  let html = `<div class="breadcrumb"><a href="#home">首頁</a> › <span>歷屆試題練習</span></div>`;
  html += `<h1 class="section-title">歷屆試題練習</h1>`;
  html += `<div class="card"><p class="card-sub">本區整理近五年學測國文科選擇題與國寫題。MVP 版本提供題型拆解示例，完整歷屆題目將陸續建置（來源將明確標注授權）。</p></div>`;
  years.forEach(y => {
    html += `<div class="ecard"><span class="ecard-year">${y} 學測</span><div class="ecard-title">國文科選擇題與國寫</div><div class="ecard-desc"><strong>題型結構：</strong>選擇題約 34 題（含單選、多選、閱讀題組），國寫兩大題（知性題＋情意題）。核心考點分布於閱讀理解（N14-N18）、文言文（N09-N13）、國寫（N27-N30）等節點。<br>完整逐題拆解建置中，可先至<a href="#tool-quiz">分級題庫</a>練習各節點題目。</div></div>`;
  });
  return html;
}

/* ===== 15 分鐘診斷卷 ===== */
let diagSet = [];
let diagCurrent = 0;
function renderDiagnose() {
  // 依近五年命題數排序節點，每節點挑一題（優先應用，退而求其次分析，再任意）
  const ranked = [...knowledgeNodes].sort((a, b) => b.exam5y - a.exam5y);
  const set = [];
  ranked.forEach(n => {
    const qs = questionBank.filter(q => q.node === n.id && q.type !== 'short');
    if (!qs.length) return;
    const pick = qs.find(q => q.level === '應用') || qs.find(q => q.level === '分析') || qs.find(q => q.level === '理解') || qs[0];
    set.push({ node: n, q: pick });
    if (set.length >= 10) return; // MVP 取 10 題
  });
  diagSet = set;
  diagCurrent = 0;
  return `<div class="breadcrumb"><a href="#home">首頁</a> › <span>15 分鐘診斷卷</span></div>
    <h1 class="section-title">15 分鐘診斷卷</h1>
    <div class="card"><p class="card-sub">系統依「近五年命題頻率」自動挑選代表題，每個高頻節點各一題（優先選應用層難度）。作答完畢後，依「答錯 × 高頻」排序產出補強建議——告訴你最該優先讀哪些節點。</p></div>
    <div id="diagArea">${diagRenderCurrent()}</div>`;
}
function diagRenderCurrent() {
  if (!diagSet.length) {
    return `<div class="empty-state"><div class="empty-icon">⏱</div><div class="empty-text">尚無足夠題庫組成診斷卷</div></div>`;
  }
  if (diagCurrent >= diagSet.length) {
    return diagResultHtml();
  }
  const item = diagSet[diagCurrent];
  const pct = Math.round((diagCurrent / diagSet.length) * 100);
  const qid = questionBank.indexOf(item.q);
  const uid = 'd' + qid;
  // 用題庫卡片但加上進度條
  const cardHtml = renderQuestionCard(item.q, qid).replace('id="card-q' + qid + '"', 'id="card-d' + qid + '"').replace(/q" + qid/g, 'd' + qid);
  // 重新產生（用 diag uid）
  let html = `<div class="diag-progress"><div class="diag-bar"><div class="diag-bar-fill" style="width:${pct}%"></div></div><span style="font-size:13px;color:var(--ink-faint)">第 ${diagCurrent+1} / ${diagSet.length} 題 · ${item.node.name}</span></div>`;
  // 為診斷題客製化送出後自動跳下一題
  html += renderDiagCard(item.q, qid);
  return html;
}
function renderDiagCard(q, qid) {
  const uid = 'd' + qid;
  const node = findNode(q.node);
  const correctSet = new Set(q.opts.map((o, i) => o.c ? i : null).filter(x => x !== null));
  let html = `<div class="qcard" id="card-${uid}">
    <div class="qcard-head">
      <span class="tag tag-node">${q.node} ${esc(node?node.name:'')}</span>
      <span class="tag tag-level">${q.level}</span>
    </div>
    <div class="qcard-q">${esc(q.q)}</div>
    <ul class="qcard-opts">`;
  q.opts.forEach((o, i) => {
    html += `<li class="qopt" data-uid="${uid}" data-i="${i}" onclick="diagSelect('${uid}',${i})"><span class="qopt-mark">${String.fromCharCode(65+i)}.</span><span>${esc(o.t)}</span></li>`;
  });
  html += `</ul><div class="qcard-actions"><button class="btn btn-primary" id="submit-${uid}" onclick="diagSubmit('${uid}')" disabled>送出</button></div>
    <div class="feedback" id="fb-${uid}"></div></div>`;
  return html;
}
function diagSelect(uid, idx) {
  if (bankDone[uid]) return;
  if (!bankSel[uid]) bankSel[uid] = new Set();
  bankSel[uid].clear(); bankSel[uid].add(idx);
  document.querySelectorAll(`.qopt[data-uid="${uid}"]`).forEach(el => {
    el.classList.remove('selected');
    if (bankSel[uid].has(parseInt(el.dataset.i))) el.classList.add('selected');
  });
  const btn = document.getElementById('submit-' + uid);
  if (btn) btn.disabled = false;
}
function diagSubmit(uid) {
  if (bankDone[uid]) return;
  const qid = parseInt(uid.replace('d', ''));
  const q = bankIndex[qid];
  const correctSet = new Set(q.opts.map((o, i) => o.c ? i : null).filter(x => x !== null));
  const sel = bankSel[uid] || new Set();
  const isCorrect = sel.size === correctSet.size && [...sel].every(i => correctSet.has(i));
  bankDone[uid] = true;
  if (!bankScored[uid]) { recordResult(q, isCorrect); bankScored[uid] = true; }
  paintDiagResult(uid, q, correctSet, isCorrect);
}
function paintDiagResult(uid, q, correctSet, isCorrect) {
  document.querySelectorAll(`.qopt[data-uid="${uid}"]`).forEach(el => {
    const i = parseInt(el.dataset.i);
    el.classList.remove('selected');
    if (correctSet.has(i)) el.classList.add('correct');
    else if ((bankSel[uid]||new Set()).has(i)) el.classList.add('incorrect');
  });
  let listHtml = q.opts.map((o, i) => {
    const mark = correctSet.has(i) ? '✔' : '✘';
    const cls = correctSet.has(i) ? 'ok' : 'no';
    return `<li><strong class="${cls}">${mark} ${String.fromCharCode(65+i)}</strong>：${esc(o.why || '無解析')}</li>`;
  }).join('');
  const fb = document.getElementById('fb-' + uid);
  if (fb) {
    fb.classList.add('show');
    fb.innerHTML = `<div class="feedback-result ${isCorrect?'feedback-correct':'feedback-wrong'}">${isCorrect?'答對了':'答錯了'}</div><ul class="feedback-list">${listHtml}</ul><div class="feedback-exp">${esc(q.exp||'')}</div>`;
  }
  const btn = document.getElementById('submit-' + uid);
  if (btn) { btn.disabled = true; btn.textContent = '已作答'; }
  // 顯示下一題按鈕
  setTimeout(() => {
    const card = document.getElementById('card-' + uid);
    if (card) {
      const next = document.createElement('div');
      next.className = 'qcard-actions';
      next.style.marginTop = '14px';
      next.innerHTML = `<button class="btn btn-primary" onclick="diagNext()">下一題 →</button>`;
      card.appendChild(next);
    }
  }, 100);
}
function diagNext() {
  diagCurrent++;
  const area = document.getElementById('diagArea');
  if (area) area.innerHTML = diagRenderCurrent();
  window.scrollTo({ top: area.offsetTop - 60, behavior: 'smooth' });
}
function diagResultHtml() {
  const rows = diagSet.map((item, i) => {
    const uid = 'd' + questionBank.indexOf(item.q);
    const done = bankDone[uid];
    const q = item.q;
    const correctSet = new Set(q.opts.map((o, k) => o.c ? k : null).filter(x => x !== null));
    const sel = bankSel[uid] || new Set();
    const isCorrect = done && sel.size === correctSet.size && [...sel].every(k => correctSet.has(k));
    return { node: item.node, ok: !!isCorrect, done: !!done, freq: item.node.exam5y };
  });
  const wrong = rows.filter(r => r.done && !r.ok).sort((a, b) => b.freq - a.freq);
  const correctCount = rows.filter(r => r.ok).length;

  let html = `<div class="card"><div class="card-title">診斷結果</div><p class="card-sub">本次共 ${diagSet.length} 題，答對 ${correctCount} 題，答錯 ${wrong.length} 題。</p></div>`;
  if (wrong.length) {
    html += `<h2 class="subsection-title">補強建議（答錯 × 高頻排序）</h2>`;
    wrong.forEach((r, i) => {
      html += `<div class="diag-rank"><div class="diag-rank-num">${i+1}</div><div class="diag-rank-name">${r.node.id} ${esc(r.node.name)}</div><div class="diag-rank-freq">近五年 ${r.freq} 組</div><a class="btn btn-ghost" href="#node-${r.node.id}">前往複習 →</a></div>`;
    });
  } else {
    html += `<div class="empty-state"><div class="empty-icon">🎉</div><div class="empty-text">全部答對，建議挑戰更高難度題目</div><div class="empty-hint">可至<a href="#tool-quiz">分級題庫</a>篩選「分析」層題目</div></div>`;
  }
  html += `<div class="qcard-actions"><button class="btn btn-primary" onclick="renderRoute('tool-diagnose')">重新診斷</button></div>`;
  return html;
}

/* ===== 錯題本 ===== */
function renderWrong() {
  const wrongKeys = Object.entries(studyRecords.bank)
    .filter(([k, r]) => r.last === -1)
    .sort((a, b) => (b[1].t||0) - (a[1].t||0));
  let html = `<div class="breadcrumb"><a href="#home">首頁</a> › <span>錯題本</span></div>`;
  html += `<h1 class="section-title">錯題本</h1>`;
  html += `<div class="card"><p class="card-sub">收錄最近一次答錯的題目。答對後會自動移出。這裡只記錄你「做過且做錯」的題目，是考前最後衝刺的精準複習區。</p></div>`;
  if (!wrongKeys.length) {
    html += `<div class="empty-state"><div class="empty-icon">📝</div><div class="empty-text">錯題本是空的</div><div class="empty-hint">先去<a href="#tool-quiz">分級題庫</a>或<a href="#tool-diagnose">診斷卷</a>作答，答錯的題目會出現在這裡</div></div>`;
    return html;
  }
  wrongKeys.forEach(([k, r]) => {
    // 反查題目
    const q = questionBank.find(qq => bankKey(qq) === k);
    if (!q) return;
    const qid = questionBank.indexOf(q);
    html += renderQuestionCard(q, qid);
  });
  return html;
}

/* ===== 五年命題矩陣 ===== */
let statsView = 'detail'; // 'detail'(15古文明細) | 'freq'(全部節點頻率)
let statsExpanded = null; // 'nodeId-year' of expanded cell

function renderStats() {
  const rec = studyRecords.bank;
  let html = `<div class="breadcrumb"><a href="#home">首頁</a> › <span>五年命題矩陣</span></div>`;
  html += `<h1 class="section-title">五年命題矩陣</h1>`;
  html += `<div class="card"><p class="card-sub">以108課綱部定十五篇核心古文（N31–N45）為列、近五年學測（111–115）為欄，呈現每篇每年是否入題、題號、題型與命題舉證。點格子可展開舉證與來源。</p></div>`;
  html += `<div class="card matrix-legend"><span class="ml-item"><span class="dot dot-direct"></span>● 直接引文／題組</span><span class="ml-item"><span class="dot dot-option"></span>◐ 選項／字音字義</span><span class="ml-item"><span class="dot dot-disputed"></span>△ 來源分歧待考</span><span class="ml-item"><span class="dot dot-unverified"></span>? 調題號待證</span><span class="ml-item"><span class="dot dot-none"></span>— 未入題</span></div>`;
  html += `<div class="card matrix-disclaimer"><b>說明</b>：此矩陣為「教師解題評析與官方試題互譯」之整理，分類為本站對應考點，<b>非大考中心官方分類</b>。直接（題組／引文）與選項（字音字義）為已確認命題；「?」表示來源標示曾出但未見題號舉證，「△」表示各解題來源說法分歧，皆標記原文來源供核對，部分題號仍待官方逐題核實。113年多篇（含台灣題材三篇、諫逐客書、師說、晚遊六橋待月記）經《cwtc評析》與解題群說法不一，以「△」標示。官方試題可至<a href="https://www.ceec.edu.tw/" target="_blank" rel="noopener">大考中心</a>查證。</div>`;

  // 切換鈕
  html += `<div class="stats-toggle">`;
  html += `<button class="stats-tab${statsView==='detail'?' active':''}" onclick="statsSetView('detail')">15古文明細</button>`;
  html += `<button class="stats-tab${statsView==='freq'?' active':''}" onclick="statsSetView('freq')">全部節點頻率</button>`;
  html += `</div>`;

  if (statsView === 'detail') {
    html += renderStatsDetail();
  } else {
    html += renderStatsFreq(rec);
  }
  return html;
}

function statsSetView(v){ statsView=v; statsExpanded=null; renderRoute(routeFromLocation()); }

function statsCellKey(nodeId, year){ return nodeId+'-'+year; }

function levelDot(level){
  if(level==='direct') return {cls:'dot-direct', ch:'●', cell:'cell-direct'};
  if(level==='option') return {cls:'dot-option', ch:'◐', cell:'cell-option'};
  if(level==='disputed') return {cls:'dot-disputed', ch:'△', cell:'cell-disputed'};
  if(level==='unverified') return {cls:'dot-unverified', ch:'?', cell:'cell-unverified'};
  return {cls:'dot-none', ch:'—', cell:'cell-none'};
}

function renderStatsDetail(){
  const g15 = knowledgeNodes.filter(n => n.module===8);
  let html = `<div class="matrix-wrap"><table class="matrix-table matrix-detail"><thead><tr><th>節點</th><th>古文</th>`;
  examYears.forEach(y => { html += `<th class="th-year">${esc(y.label)}<span class="th-sub">${esc(y.year)}</span></th>`; });
  html += `<th>5年累計</th></tr></thead><tbody>`;
  g15.forEach(n => {
    const freq = examFreqForNode(n.id);
    const pend = examPendingForNode(n.id);
    html += `<tr><td><a href="#node-${n.id}" class="mnode-id">${n.id}</a></td><td class="node-name"><a href="#node-${n.id}">${esc(n.name)}</a></td>`;
    examYears.forEach(y => {
      const entries = examMatrix.filter(e => e.nodeId===n.id && e.year===y.id);
      const key = statsCellKey(n.id, y.id);
      const isOpen = statsExpanded===key;
      if(entries.length===0){
        html += `<td class="cell cell-none"><span class="dot dot-none">—</span></td>`;
      } else {
        // 取最高強度代表
        const top = entries.reduce((a,b)=> rank(b.level)>rank(a.level)?b:a, entries[0]);
        const d = levelDot(top.level);
        html += `<td class="cell ${d.cell}${isOpen?' open':''}" onclick="statsToggleCell('${n.id}','${y.id}')"><span class="dot ${d.cls}">${d.ch}</span><span class="cell-count">${entries.length}</span></td>`;
      }
    });
    html += `<td class="cell-freq"><b>${freq}</b><span class="freq-sub">/5</span>${pend>0?` <span class="pend">+${pend}待考</span>`:''}</td></tr>`;
    // 展開列
    examYears.forEach(y => {
      const entries = examMatrix.filter(e => e.nodeId===n.id && e.year===y.id);
      const key = statsCellKey(n.id, y.id);
      if(statsExpanded===key && entries.length){
        html += `<tr class="detail-row"><td></td><td colspan="${examYears.length+2}"><div class="detail-box">`;
        html += `<div class="detail-title">${esc(y.label)} · ${esc(n.name)}</div>`;
        entries.forEach(e => {
          const d = levelDot(e.level);
          html += `<div class="detail-entry"><span class="dot ${d.cls}">${d.ch}</span><span class="de-q">${esc(e.q)}</span><span class="de-type tag tag-level">${esc(e.type)}</span><span class="de-evidence">${esc(e.evidence)}</span><a class="de-src" href="${e.sourceUrl}" target="_blank" rel="noopener">來源：${esc(e.sourceName)} ↗</a></div>`;
        });
        html += `</div></td></tr>`;
      }
    });
  });
  html += `</tbody></table></div>`;
  // 年度來源
  html += `<div class="card"><div class="card-title">年度命題來源</div><ul class="src-list">`;
  examYears.forEach(y => { html += `<li class="src-item"><b>${esc(y.label)}</b>（${esc(y.year)}）：${esc(y.srcName)} <a href="${y.srcUrl}" target="_blank" rel="noopener">查看 ↗</a></li>`; });
  html += `</ul></div>`;
  return html;
}

function rank(level){ return {direct:3,option:2,disputed:1,unverified:1,none:0}[level]||0; }

function statsToggleCell(nodeId, yearId){
  const key = statsCellKey(nodeId, yearId);
  statsExpanded = (statsExpanded===key) ? null : key;
  renderRoute(routeFromLocation());
}

function renderStatsFreq(rec){
  const maxFreq = Math.max(...knowledgeNodes.map(n => n.exam5y), 1);
  let html = `<div class="matrix-wrap"><table class="matrix-table"><thead><tr><th>節點</th><th>名稱</th><th>五年命題</th><th>頻率</th><th>掌握度</th></tr></thead><tbody>`;
  knowledgeNodes.forEach(n => {
    const nodeRecs = Object.entries(rec).filter(([k, r]) => r.nodes === n.id);
    const attempts = nodeRecs.reduce((s, [, r]) => s + (r.a||0), 0);
    const corrects = nodeRecs.reduce((s, [, r]) => s + (r.c||0), 0);
    const mastery = attempts ? Math.round(corrects / attempts * 100) : null;
    const mCls = mastery === null ? 'matrix-mastery-none' : (mastery >= 80 ? 'mastery-high' : mastery >= 50 ? 'mastery-mid' : 'mastery-low');
    const mTxt = mastery === null ? '—' : mastery + '%';
    const fillPct = Math.round(n.exam5y / maxFreq * 100);
    html += `<tr>
      <td><a href="#node-${n.id}" style="font-weight:600">${n.id}</a></td>
      <td class="node-name">${esc(n.name)}</td>
      <td>${n.exam5y} 組</td>
      <td><div class="freq-bar"><div class="freq-fill" style="width:${fillPct}%"></div></div></td>
      <td class="${mCls}">${mTxt}</td>
    </tr>`;
  });
  html += `</tbody></table></div>`;
  return html;
}

/* ===== 素養包裝破解器 ===== */
function renderBuster() {
  let html = `<div class="breadcrumb"><a href="#home">首頁</a> › <span>素養包裝破解器</span></div>`;
  html += `<h1 class="section-title">素養包裝破解器</h1>`;
  html += `<div class="buster-intro">引導你從「看見表面包裝」走向「識破核心考點」，一秒看穿題目的真正考點。再複雜的大考題，都能拆成「表面情境」與「核心考點」兩層，核心永遠落在已教過的知識節點之中。</div>`;
  BUSTER_DATA.forEach((b, i) => {
    html += `<div class="buster-row">
      <div class="buster-cell buster-cell-surface">
        <span class="buster-label buster-label-surface">情境包裝</span>
        <div class="buster-q">${esc(b.surfaceTitle)}</div>
        <div class="buster-desc">${esc(b.surface)}</div>
      </div>
      <div class="buster-cell buster-cell-core">
        <span class="buster-label buster-label-core">核心考點</span>
        <div class="buster-model">${esc(b.coreTitle)}</div>
        <div class="buster-desc">${esc(b.core)}</div>
        <div class="buster-strategy">${esc(b.strategy)}</div>
      </div>
    </div>`;
  });
  return html;
}

/* ===== 渲染後掛載 ===== */
function afterRender(route) {
  if (route === 'tool-quiz' || route.startsWith('bank-') || route === 'tool-wrong') {
    restoreBankStates();
  }
}

/* ===== 行動版選單 ===== */
function setupMobileMenu() {
  const btn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  btn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
  // 點側欄外關閉
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== btn) {
      sidebar.classList.remove('open');
    }
  });
}

/* ===== 深色模式切換 ===== */
function setupTheme() {
  const t = document.querySelector('[data-theme-toggle]');
  const r = document.documentElement;
  let d;
  try { d = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'; } catch(e){ d='light'; }
  r.setAttribute('data-theme', d);
  function updateBtn() {
    if (t) { t.textContent = d === 'dark' ? '日' : '月'; t.setAttribute('aria-label', d==='dark'?'切換淺色模式':'切換深色模式'); }
  }
  updateBtn();
  if (t) t.addEventListener('click', () => {
    d = d === 'dark' ? 'light' : 'dark';
    r.setAttribute('data-theme', d);
    updateBtn();
  });
}

/* ===== 初始化 ===== */
function init() {
  renderSidebar();
  setupMobileMenu();
  setupTheme();
  // 路由
  window.addEventListener('hashchange', () => renderRoute(routeFromLocation()));
  // 初次渲染
  renderRoute(routeFromLocation());
}
document.addEventListener('DOMContentLoaded', init);
