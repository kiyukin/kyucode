const fs = require("fs");
const path = require("path");

const resultPath = path.join(__dirname, "..", "output", "result.json");
const htmlPath = path.join(__dirname, "..", "output", "report.html");
const finalHtmlPath = path.join(__dirname, "..", "output", "report_final.html");

const result = JSON.parse(fs.readFileSync(resultPath, "utf8"));

function esc(v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function imageSrc(file) {
  return "../data/screenshots/" + String(file || "").replace(/\\/g, "/");
}

function severityClass(sev) {
  return String(sev || "Info").toLowerCase();
}

function pct(n) {
  const value = Number(n);
  if (Number.isNaN(value)) return "0%";
  return `${Math.max(0, Math.min(100, value * 100))}%`;
}

function getCandidateBbox(c) {
  return c.bbox || { x: 0.45, y: 0.45, w: 0.2, h: 0.2 };
}

function severityCounts(bugs) {
  const counts = { Critical: 0, Major: 0, Minor: 0, Info: 0 };
  for (const b of bugs) {
    const key = b.severity || "Info";
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function typeCounts(bugs) {
  const types = ["UI 오류", "충돌 판정", "경로 탐색", "렌더링 이상", "미니맵 불일치", "오브젝트 겹침", "기타"];
  const counts = Object.fromEntries(types.map(t => [t, 0]));
  for (const b of bugs) {
    const key = b.bugType || "기타";
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

const bugs = result.detectedBugs || [];
const images = result.imageAnalysisResults || [];
const sevCounts = severityCounts(bugs);
const catCounts = typeCounts(bugs);
const overallConfidence = bugs.length
  ? Math.round((bugs.reduce((s, b) => s + Number(b.confidence || 0), 0) / bugs.length) * 100) / 100
  : 0;

function renderImageCard(image, index) {
  const candidates = (image.visibleBugCandidates || []).filter(c => c.isDetected);
  return `
    <section class="image-card">
      <div class="image-card-header">
        <div>
          <h2>Screenshot ${index + 1}</h2>
          <p>${esc(image.imageFile)}</p>
        </div>
        <div class="pill">${esc(image.primaryBugType || "분석 결과")}</div>
      </div>

      <div class="screenshot-wrapper">
        <img class="game-image" src="${esc(imageSrc(image.imageFile))}" alt="${esc(image.imageFile)}">
        ${candidates.map(c => {
          const b = getCandidateBbox(c);
          return `
            <div class="bug-box ${severityClass(c.severity)}"
              style="left:${pct(b.x)};top:${pct(b.y)};width:${pct(b.w)};height:${pct(b.h)};">
              <span>${esc(c.type)} · ${esc(c.severity)}</span>
            </div>
          `;
        }).join("")}
      </div>

      <div class="candidate-list">
        ${candidates.map(c => `
          <article class="candidate">
            <div class="candidate-top">
              <strong>${esc(c.type)}</strong>
              <span class="badge ${severityClass(c.severity)}">${esc(c.severity)}</span>
              <span class="confidence">신뢰도 ${esc(c.confidence)}</span>
            </div>
            <p>${esc(c.visualEvidence)}</p>
            <small><b>Unity Cause:</b> ${esc(c.possibleUnityCause)}</small>
            <small><b>Fix:</b> ${esc(c.suggestedFixDirection)}</small>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderBugCard(bug) {
  return `
    <article class="bug-card">
      <h3>${esc(bug.bugId)} · ${esc(bug.bugType)}
        <span class="badge ${severityClass(bug.severity)}">${esc(bug.severity)}</span>
      </h3>
      <p class="muted"><b>Source:</b> ${esc(bug.sourceImage)} · <b>Confidence:</b> ${esc(bug.confidence)}</p>
      <p>${esc(bug.summary)}</p>

      <h4>Root Cause Candidates</h4>
      <ul>${(bug.rootCauseCandidates || []).map(x => `<li>${esc(x)}</li>`).join("")}</ul>

      <h4>Reproduction Steps</h4>
      <ul>${(bug.reproductionSteps || []).map(x => `<li>${esc(x)}</li>`).join("")}</ul>

      <h4>Fix Suggestions</h4>
      <ul>${(bug.fixSuggestions || []).map(x => `<li>${esc(x)}</li>`).join("")}</ul>
    </article>
  `;
}

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>kyucode AI Game QA Agent</title>
<style>
:root {
  --bg: #07111f;
  --panel: #0f1b2d;
  --panel2: #111827;
  --line: rgba(56,189,248,.28);
  --cyan: #22d3ee;
  --blue: #60a5fa;
  --red: #ef4444;
  --orange: #f97316;
  --yellow: #eab308;
  --info: #38bdf8;
  --text: #e5eefb;
  --muted: #9db2d1;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: radial-gradient(circle at top left, #10233f 0, #07111f 42%, #020817 100%);
  color: var(--text);
  font-family: Arial, sans-serif;
}
.nav {
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  background: rgba(15, 27, 45, .94);
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 10;
}
.logo {
  font-size: 22px;
  font-weight: 800;
}
.logo span {
  color: var(--cyan);
}
.nav-links {
  display: flex;
  gap: 18px;
  align-items: center;
  font-size: 13px;
  color: var(--muted);
}
.nav-links strong {
  color: white;
}
.container {
  max-width: 1680px;
  margin: 0 auto;
  padding: 28px;
}
.hero {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 22px;
}
.hero h1 {
  font-size: 34px;
  margin: 0;
}
.hero p {
  color: var(--muted);
  margin: 8px 0 0;
}
.dashboard {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 22px;
  align-items: start;
}
.side {
  position: sticky;
  top: 92px;
}
.card, .image-card, .bug-card {
  background: linear-gradient(180deg, rgba(15,27,45,.96), rgba(17,24,39,.96));
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 18px 44px rgba(0,0,0,.33);
}
.summary {
  padding: 18px;
}
.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.stat {
  background: rgba(2,8,23,.48);
  border: 1px solid rgba(148,163,184,.18);
  border-radius: 16px;
  padding: 18px;
}
.stat .num {
  font-size: 30px;
  font-weight: 900;
  color: white;
}
.stat .label {
  color: var(--muted);
  margin-top: 6px;
  font-size: 13px;
}
.breakdown {
  margin-top: 20px;
}
.breakdown h3 {
  margin: 0 0 12px;
}
.type-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(148,163,184,.14);
  color: var(--muted);
}
.type-row strong {
  color: white;
}
.image-grid {
  display: grid;
  gap: 24px;
}
.image-card {
  padding: 18px;
}
.image-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.image-card-header h2 {
  margin: 0;
  font-size: 20px;
}
.image-card-header p {
  margin: 4px 0 0;
  color: var(--muted);
}
.pill {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(34,211,238,.12);
  border: 1px solid rgba(34,211,238,.35);
  color: var(--cyan);
  font-weight: 700;
}
.screenshot-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 16px;
  background: #050b14;
  border: 1px solid rgba(148,163,184,.2);
}
.game-image {
  width: 100%;
  display: block;
}
.bug-box {
  position: absolute;
  box-sizing: border-box;
  border: 3px solid var(--cyan);
  box-shadow: 0 0 22px rgba(34,211,238,.42);
  pointer-events: none;
}
.bug-box span {
  position: absolute;
  top: -30px;
  left: 0;
  padding: 5px 9px;
  border-radius: 8px;
  background: rgba(0,0,0,.86);
  color: white;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}
.bug-box.critical { border-color: var(--red); box-shadow: 0 0 24px rgba(239,68,68,.55); }
.bug-box.major { border-color: var(--orange); box-shadow: 0 0 24px rgba(249,115,22,.50); }
.bug-box.minor { border-color: var(--yellow); box-shadow: 0 0 22px rgba(234,179,8,.45); }
.bug-box.info { border-color: var(--info); box-shadow: 0 0 22px rgba(56,189,248,.42); }
.candidate-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
  margin-top: 14px;
}
.candidate {
  background: rgba(2,8,23,.42);
  border: 1px solid rgba(148,163,184,.15);
  border-radius: 14px;
  padding: 14px;
}
.candidate p {
  color: var(--muted);
  line-height: 1.45;
}
.candidate small {
  display: block;
  color: var(--muted);
  margin-top: 7px;
}
.candidate-top {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.badge {
  display: inline-flex;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  color: #020817;
}
.badge.critical { background: var(--red); color: white; }
.badge.major { background: var(--orange); color: white; }
.badge.minor { background: var(--yellow); }
.badge.info { background: var(--info); }
.confidence, .muted {
  color: var(--muted);
}
.bug-section-title {
  margin: 30px 0 14px;
  font-size: 26px;
}
.bug-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 18px;
}
.bug-card {
  padding: 20px;
}
.bug-card h3 {
  margin: 0 0 12px;
}
.bug-card p, .bug-card li {
  color: var(--muted);
  line-height: 1.55;
}
.agent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
  margin-top: 16px;
}
.agent-card {
  background: rgba(2,8,23,.42);
  border: 1px solid rgba(148,163,184,.15);
  border-radius: 14px;
  padding: 16px;
}
.agent-card strong {
  display: block;
  color: var(--cyan);
  margin-bottom: 8px;
}
@media (max-width: 1200px) {
  .dashboard { grid-template-columns: 1fr; }
  .side { position: static; }
}
</style>
</head>
<body>
<nav class="nav">
  <div class="logo">kyucode <span>AI Game QA Agent</span></div>
  <div class="nav-links">
    <span>Dashboard</span>
    <span>Session</span>
    <span>Bug Classification</span>
    <span>Report</span>
    <span>Settings</span>
    <strong>Engine: ${esc(result.engine)}</strong>
    <strong>Mode: ${esc(result.mode)}</strong>
  </div>
</nav>

<main class="container">
  <section class="hero">
    <div>
      <h1>버그 분류</h1>
      <p>AI가 감지한 이슈를 스크린샷별로 분류하고, bbox overlay로 시각화합니다.</p>
    </div>
  </section>

  <section class="dashboard">
    <div class="image-grid">
      ${images.map(renderImageCard).join("")}
    </div>

    <aside class="side card summary">
      <h2>QA Summary</h2>
      <div class="summary-grid">
        <div class="stat"><div class="num">${bugs.length}</div><div class="label">Total Bugs</div></div>
        <div class="stat"><div class="num">${overallConfidence}</div><div class="label">Overall Confidence</div></div>
        <div class="stat"><div class="num">${sevCounts.Critical}</div><div class="label">Critical</div></div>
        <div class="stat"><div class="num">${sevCounts.Major}</div><div class="label">Major</div></div>
        <div class="stat"><div class="num">${sevCounts.Minor}</div><div class="label">Minor</div></div>
        <div class="stat"><div class="num">${sevCounts.Info}</div><div class="label">Info</div></div>
      </div>

      <div class="breakdown">
        <h3>Category Breakdown</h3>
        ${Object.entries(catCounts).map(([k,v]) => `
          <div class="type-row"><span>${esc(k)}</span><strong>${v}</strong></div>
        `).join("")}
      </div>
    </aside>
  </section>

  <h2 class="bug-section-title">Detected Bugs</h2>
  <section class="bug-grid">
    ${bugs.map(renderBugCard).join("")}
  </section>

  <section class="card summary" style="margin-top:24px;">
    <h2>Agent Team Results</h2>
    <div class="agent-grid">
      ${Object.entries(result.agentResults || {}).map(([k,v]) => `
        <div class="agent-card"><strong>${esc(k)}</strong>${esc(v)}</div>
      `).join("")}
    </div>
  </section>
</main>
</body>
</html>`;

fs.writeFileSync(htmlPath, html, "utf8");
fs.writeFileSync(finalHtmlPath, html, "utf8");

console.log("Final dashboard generated:");
console.log(htmlPath);
console.log(finalHtmlPath);
