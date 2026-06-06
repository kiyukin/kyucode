const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "..", "output");
const RESULT_PATH = path.join(OUTPUT_DIR, "result.json");
const REPORT_MD_PATH = path.join(OUTPUT_DIR, "report.md");
const REPORT_HTML_PATH = path.join(OUTPUT_DIR, "report.html");

function clamp(n, min = 0, max = 1) {
  return Math.max(min, Math.min(max, n));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeConfidence(value) {
  if (value === undefined || value === null || value === "") return 0.5;
  let n = Number.parseFloat(String(value).replace("%", "").trim());
  if (Number.isNaN(n)) return 0.5;
  if (n > 1) n = n / 100;
  return round2(clamp(n));
}

function combinedText(candidate) {
  return [
    candidate.type,
    candidate.label,
    candidate.visualEvidence,
    candidate.possibleUnityCause,
    candidate.suggestedFixDirection
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function normalizeBugType(candidate) {
  const text = combinedText(candidate);

  if (/(health bar|score display|inventory|ui|canvas|anchor|recttransform|layout group|sorting order|overlaps with the inventory|overlaps with the score)/i.test(text)) {
    return "UI 오류";
  }

  if (/(minimap|mini-map|map mismatch|player position|tracking|minimap camera|different location|player location)/i.test(text)) {
    return "미니맵 불일치";
  }

  if (/(walks through|walk through|collision|collider|rigidbody|layer collision)/i.test(text)) {
    return "충돌 판정";
  }

  if (/(clipping|clips through|clip|intersects|intersecting|embedded|inside wall|inside ground|character model|foot|wall object|partially clips|partially intersects)/i.test(text)) {
    return "오브젝트 겹침";
  }

  if (/(flickering|texture|z-fighting|shader|terrain|rendering|visual glitch|graphical glitch)/i.test(text)) {
    return "렌더링 이상";
  }

  if (/(npc stuck|navmesh|pathfinding|movement|navigation|spawn point|standing on top of each other)/i.test(text)) {
    return "경로 탐색";
  }

  return "기타";
}

function normalizeSeverity(candidate, type) {
  const text = combinedText(candidate);
  const raw = String(candidate.severity ?? "").toLowerCase();

  if (/(critical|blocker|game breaking|cannot progress|crash)/i.test(raw + " " + text)) {
    return "Critical";
  }
  if (/(high|major)/i.test(raw)) return "Major";
  if (/(medium|minor)/i.test(raw)) return "Minor";
  if (/(low|info)/i.test(raw)) {
    if (["오브젝트 겹침", "충돌 판정", "미니맵 불일치"].includes(type)) return "Major";
    if (["UI 오류", "렌더링 이상", "경로 탐색"].includes(type)) return "Minor";
    return "Info";
  }

  if (["오브젝트 겹침", "충돌 판정", "미니맵 불일치"].includes(type)) return "Major";
  if (["UI 오류", "렌더링 이상", "경로 탐색"].includes(type)) return "Minor";
  return "Info";
}

function isPlaceholderBBox(bbox) {
  if (!bbox) return true;
  return (
    Number(bbox.x) === 0.5 &&
    Number(bbox.y) === 0.5 &&
    Number(bbox.w) === 0.1 &&
    Number(bbox.h) === 0.1
  );
}

function inferBBox(candidate, type) {
  const text = combinedText(candidate);

  if (type === "UI 오류") {
    if (/bottom left/i.test(text)) return { x: 0.02, y: 0.72, w: 0.30, h: 0.18 };
    if (/minimap|mini-map|upper right|top right/i.test(text)) return { x: 0.72, y: 0.05, w: 0.25, h: 0.22 };
    return { x: 0.66, y: 0.10, w: 0.28, h: 0.20 };
  }

  if (type === "미니맵 불일치") return { x: 0.76, y: 0.04, w: 0.20, h: 0.22 };

  if (type === "오브젝트 겹침") {
    if (/wall/i.test(text)) return { x: 0.55, y: 0.30, w: 0.25, h: 0.30 };
    if (/ground|foot/i.test(text)) return { x: 0.35, y: 0.58, w: 0.22, h: 0.22 };
    if (/fountain/i.test(text)) return { x: 0.40, y: 0.35, w: 0.25, h: 0.25 };
    return { x: 0.42, y: 0.38, w: 0.24, h: 0.26 };
  }

  if (type === "충돌 판정") return { x: 0.45, y: 0.40, w: 0.30, h: 0.30 };
  if (type === "렌더링 이상") return { x: 0.45, y: 0.55, w: 0.35, h: 0.25 };
  if (type === "경로 탐색") return { x: 0.35, y: 0.35, w: 0.25, h: 0.25 };

  return { x: 0.45, y: 0.45, w: 0.20, h: 0.20 };
}

function normalizeBBox(candidate, type) {
  const source = isPlaceholderBBox(candidate.bbox) ? inferBBox(candidate, type) : candidate.bbox;
  return {
    x: round2(clamp(Number(source.x) || 0)),
    y: round2(clamp(Number(source.y) || 0)),
    w: round2(clamp(Number(source.w) || 0.2, 0.03, 1)),
    h: round2(clamp(Number(source.h) || 0.2, 0.03, 1))
  };
}

function normalizeCandidate(candidate, imageResult) {
  const type = normalizeBugType(candidate);
  const severity = normalizeSeverity(candidate, type);
  const confidence = normalizeConfidence(candidate.confidence);
  const bbox = normalizeBBox(candidate, type);

  return {
    type,
    isDetected: Boolean(candidate.isDetected),
    severity,
    confidence,
    visualEvidence: candidate.visualEvidence || "No visual evidence provided.",
    possibleUnityCause: candidate.possibleUnityCause || "Unity component configuration requires inspection.",
    suggestedFixDirection: candidate.suggestedFixDirection || "Inspect the related Unity scene object and component settings.",
    label: type,
    bbox
  };
}

function severityRank(severity) {
  return { Critical: 4, Major: 3, Minor: 2, Info: 1 }[severity] || 0;
}

function normalizeImageResult(imageResult) {
  const imageFile = path.basename(String(imageResult.imageFile || "unknown.png").replace(/\\/g, "/"));
  const candidates = Array.isArray(imageResult.visibleBugCandidates)
    ? imageResult.visibleBugCandidates.map(c => normalizeCandidate(c, imageResult))
    : [];

  const detected = candidates.filter(c => c.isDetected);
  const primary = detected.length
    ? detected.slice().sort((a, b) => severityRank(b.severity) - severityRank(a.severity) || b.confidence - a.confidence)[0]
    : candidates[0];

  const overallConfidence = candidates.length
    ? round2(candidates.reduce((sum, c) => sum + c.confidence, 0) / candidates.length)
    : 0.5;

  return {
    imageFile,
    visibleBugCandidates: candidates,
    primaryBugType: primary ? primary.type : "기타",
    severityEstimate: primary ? primary.severity : "Info",
    overallConfidence,
    summary: imageResult.summary || "Vision analysis completed for this screenshot."
  };
}

function rootCausesFor(type) {
  const map = {
    "UI 오류": [
      "UI Canvas의 Anchor, Pivot, RectTransform 설정 오류 가능성",
      "Canvas Scaler 또는 Sorting Order 설정 문제 가능성"
    ],
    "오브젝트 겹침": [
      "Collider bounds와 Mesh Renderer 위치 불일치 가능성",
      "오브젝트 배치 좌표 또는 스케일 설정 오류 가능성"
    ],
    "미니맵 불일치": [
      "Minimap Camera가 Player Transform을 정확히 추적하지 못하는 문제 가능성",
      "월드 좌표와 미니맵 좌표 변환 로직 오류 가능성"
    ],
    "충돌 판정": [
      "Collider 또는 Rigidbody 설정 누락 가능성",
      "Layer Collision Matrix 설정 문제 가능성"
    ],
    "렌더링 이상": [
      "Z-fighting 또는 중복 메시 문제 가능성",
      "Shader, Material, Shadow Quality 설정 문제 가능성"
    ],
    "경로 탐색": [
      "NavMesh Bake 또는 NavMeshObstacle 설정 문제 가능성",
      "NPC Movement Script 또는 waypoint 설정 오류 가능성"
    ],
    "기타": [
      "씬 구성 또는 런타임 상태를 추가 점검할 필요가 있음"
    ]
  };
  return map[type] || map["기타"];
}

function fixesFor(type) {
  const map = {
    "UI 오류": [
      "Canvas Scaler, Anchor, Pivot, RectTransform, Sorting Order를 확인한다.",
      "여러 해상도에서 UI Safe Area와 겹침 여부를 테스트한다."
    ],
    "오브젝트 겹침": [
      "Collider 크기와 Mesh Renderer 위치를 비교한다.",
      "Scene View에서 오브젝트 배치와 충돌 영역을 확인한다."
    ],
    "미니맵 불일치": [
      "Minimap Camera target이 Player Transform을 정확히 추적하는지 확인한다.",
      "월드 좌표를 미니맵 좌표로 변환하는 스크립트를 점검한다."
    ],
    "충돌 판정": [
      "Collider, Rigidbody, Character Controller 설정을 확인한다.",
      "Layer Collision Matrix와 Is Trigger 설정을 점검한다."
    ],
    "렌더링 이상": [
      "Material, Shader, Shadow Quality, Z-fighting 여부를 확인한다.",
      "겹친 메시 또는 중복 지형 오브젝트를 제거한다."
    ],
    "경로 탐색": [
      "NavMesh Bake, NavMeshObstacle, OffMeshLink를 확인한다.",
      "NPC Movement Script의 destination update 조건을 점검한다."
    ],
    "기타": [
      "관련 씬 오브젝트와 컴포넌트를 추가 점검한다."
    ]
  };
  return map[type] || map["기타"];
}

function reproductionStepsFor(type) {
  return [
    "Unity에서 해당 씬을 실행한다.",
    "스크린샷과 동일한 위치로 플레이어를 이동한다.",
    "Game View에서 문제 영역을 확인한다.",
    "Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.",
    "동일 조건에서 문제가 반복 재현되는지 확인한다."
  ];
}

function buildDetectedBugs(results) {
  const bugs = [];
  let index = 1;

  for (const image of results) {
    for (const candidate of image.visibleBugCandidates.filter(c => c.isDetected)) {
      const bugId = `BUG-${String(index).padStart(3, "0")}`;
      bugs.push({
        bugId,
        sourceImage: image.imageFile,
        bugType: candidate.type,
        severity: candidate.severity,
        confidence: candidate.confidence,
        summary: candidate.visualEvidence,
        rootCauseCandidates: rootCausesFor(candidate.type),
        reproductionSteps: reproductionStepsFor(candidate.type),
        fixSuggestions: fixesFor(candidate.type),
        bbox: candidate.bbox
      });
      index += 1;
    }
  }

  return bugs;
}

function buildAgentResults(results, bugs) {
  const types = [...new Set(bugs.map(b => b.bugType))].join(", ") || "No bugs";
  return {
    qaLeadAgent: `Vision 분석 결과를 통합하여 ${bugs.length}개의 주요 버그 후보를 우선순위화했다.`,
    visualBugDetectorAgent: `실제 스크린샷 ${results.length}장을 분석하여 UI, 오브젝트, 미니맵, 렌더링 관련 후보를 감지했다.`,
    bugClassifierAgent: `Vision 결과를 kyucode 표준 분류(${types})로 정규화했다.`,
    reproductionAgent: "각 detectedBug에 대해 Unity 실행, 위치 이동, Game View/Scene View 비교, 반복 재현 확인 절차를 생성했다.",
    fixAdvisorAgent: "Canvas, Collider, Rigidbody, Minimap Camera, Shader, NavMesh 중심의 수정 방향을 제안했다.",
    reportWriterAgent: "정규화된 결과를 result.json, report.md, report.html Workbench 리포트로 변환했다."
  };
}

function severityClass(severity) {
  return String(severity || "Info").toLowerCase();
}

function generateMarkdown(result) {
  const lines = [];
  lines.push("# kyucode Vision QA Report");
  lines.push("");
  lines.push(`- Project: ${result.projectName}`);
  lines.push(`- Engine: ${result.engine}`);
  lines.push(`- Mode: ${result.mode}`);
  lines.push(`- Screenshots: ${result.imageAnalysisResults.length}`);
  lines.push(`- Detected Bugs: ${result.detectedBugs.length}`);
  lines.push("");

  lines.push("## Image Analysis Results");
  for (const image of result.imageAnalysisResults) {
    lines.push(`### ${image.imageFile}`);
    lines.push(`- Primary Bug Type: ${image.primaryBugType}`);
    lines.push(`- Severity: ${image.severityEstimate}`);
    lines.push(`- Overall Confidence: ${image.overallConfidence}`);
    lines.push("");
    for (const c of image.visibleBugCandidates) {
      lines.push(`- ${c.type} / ${c.severity} / ${c.confidence}`);
      lines.push(`  - Evidence: ${c.visualEvidence}`);
      lines.push(`  - Cause: ${c.possibleUnityCause}`);
      lines.push(`  - Fix: ${c.suggestedFixDirection}`);
      lines.push(`  - BBox: x=${c.bbox.x}, y=${c.bbox.y}, w=${c.bbox.w}, h=${c.bbox.h}`);
    }
    lines.push("");
  }

  lines.push("## Detected Bugs");
  for (const bug of result.detectedBugs) {
    lines.push(`### ${bug.bugId} - ${bug.bugType}`);
    lines.push(`- Source: ${bug.sourceImage}`);
    lines.push(`- Severity: ${bug.severity}`);
    lines.push(`- Confidence: ${bug.confidence}`);
    lines.push(`- Summary: ${bug.summary}`);
    lines.push(`- Root Cause Candidates:`);
    bug.rootCauseCandidates.forEach(x => lines.push(`  - ${x}`));
    lines.push(`- Reproduction Steps:`);
    bug.reproductionSteps.forEach(x => lines.push(`  - ${x}`));
    lines.push(`- Fix Suggestions:`);
    bug.fixSuggestions.forEach(x => lines.push(`  - ${x}`));
    lines.push("");
  }

  lines.push("## Agent Results");
  for (const [name, value] of Object.entries(result.agentResults)) {
    lines.push(`- ${name}: ${value}`);
  }

  return lines.join("\n");
}

function countsBySeverity(bugs) {
  const counts = { Critical: 0, Major: 0, Minor: 0, Info: 0 };
  for (const b of bugs) counts[b.severity] = (counts[b.severity] || 0) + 1;
  return counts;
}

function countsByType(bugs) {
  const labels = ["UI 오류", "충돌 판정", "경로 탐색", "렌더링 이상", "미니맵 불일치", "오브젝트 겹침", "기타"];
  const counts = Object.fromEntries(labels.map(l => [l, 0]));
  for (const b of bugs) counts[b.bugType] = (counts[b.bugType] || 0) + 1;
  return counts;
}

function generateHtml(result) {
  const severityCounts = countsBySeverity(result.detectedBugs);
  const typeCounts = countsByType(result.detectedBugs);
  const overall = result.detectedBugs.length
    ? round2(result.detectedBugs.reduce((s, b) => s + b.confidence, 0) / result.detectedBugs.length)
    : 0;

  const dataJson = JSON.stringify(result).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>kyucode AI Game QA Workbench</title>
<style>
:root {
  --bg: #07111f;
  --panel: #0f1b2d;
  --panel2: #111827;
  --line: rgba(56,189,248,.25);
  --cyan: #22d3ee;
  --blue: #60a5fa;
  --red: #ef4444;
  --orange: #f97316;
  --yellow: #eab308;
  --info: #38bdf8;
  --text: #e5eefb;
  --muted: #94a3b8;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: radial-gradient(circle at top left, #11233f, var(--bg) 45%, #020817);
  color: var(--text);
  font-family: Arial, sans-serif;
}
.nav {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: rgba(15, 27, 45, .92);
  border-bottom: 1px solid var(--line);
}
.logo { font-weight: 800; color: white; letter-spacing: .2px; }
.logo span { color: var(--cyan); }
.nav-links { display: flex; gap: 18px; align-items: center; color: var(--muted); font-size: 13px; }
.nav-links strong { color: var(--cyan); }
.container { padding: 26px; max-width: 1600px; margin: 0 auto; }
.title-row { display: flex; justify-content: space-between; align-items: end; margin-bottom: 20px; }
h1 { margin: 0; font-size: 34px; }
.subtitle { color: var(--muted); margin-top: 8px; }
.dashboard {
  display: grid;
  grid-template-columns: minmax(0, 2fr) 420px;
  gap: 20px;
}
.card {
  background: linear-gradient(180deg, rgba(15,27,45,.96), rgba(17,24,39,.96));
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(0,0,0,.32);
  padding: 18px;
}
.screenshot-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 16px;
  background: #050b14;
  border: 1px solid rgba(148,163,184,.2);
}
.main-image {
  width: 100%;
  display: block;
}
.bug-box {
  position: absolute;
  box-sizing: border-box;
  border: 2px solid var(--cyan);
  box-shadow: 0 0 18px rgba(34,211,238,.35);
  pointer-events: none;
}
.bug-label {
  position: absolute;
  top: -26px;
  left: 0;
  padding: 4px 8px;
  border-radius: 8px;
  background: rgba(0,0,0,.86);
  color: white;
  font-size: 12px;
  white-space: nowrap;
}
.severity-critical { border-color: var(--red); box-shadow: 0 0 18px rgba(239,68,68,.5); }
.severity-major { border-color: var(--orange); box-shadow: 0 0 18px rgba(249,115,22,.45); }
.severity-minor { border-color: var(--yellow); box-shadow: 0 0 18px rgba(234,179,8,.4); }
.severity-info { border-color: var(--info); box-shadow: 0 0 18px rgba(56,189,248,.35); }
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #020817;
}
.badge.Critical { background: var(--red); color: white; }
.badge.Major { background: var(--orange); color: white; }
.badge.Minor { background: var(--yellow); }
.badge.Info { background: var(--info); }
.summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.stat {
  padding: 14px;
  border-radius: 14px;
  background: rgba(2,8,23,.48);
  border: 1px solid rgba(148,163,184,.16);
}
.stat .num { font-size: 26px; font-weight: 800; color: white; }
.stat .label { color: var(--muted); font-size: 12px; margin-top: 4px; }
.section-title { margin: 0 0 12px; font-size: 16px; }
.type-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(148,163,184,.12);
  color: var(--muted);
}
.type-row strong { color: white; }
.thumb-strip { display: flex; gap: 12px; margin-top: 14px; overflow-x: auto; padding-bottom: 4px; }
.thumb {
  width: 160px;
  flex: 0 0 auto;
  border: 2px solid transparent;
  border-radius: 12px;
  overflow: hidden;
  background: #020817;
  cursor: pointer;
}
.thumb.active { border-color: var(--cyan); }
.thumb img { width: 100%; display: block; }
.thumb div { padding: 6px; font-size: 11px; color: var(--muted); }
.bugs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; margin-top: 20px; }
.bug-card h3 { margin: 0 0 8px; }
.bug-card p { color: var(--muted); line-height: 1.5; }
.bug-card ul { color: var(--muted); padding-left: 20px; }
.agent-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-top: 16px; }
.agent-card { background: rgba(2,8,23,.42); border: 1px solid rgba(148,163,184,.15); border-radius: 14px; padding: 14px; color: var(--muted); }
.agent-card strong { color: var(--cyan); display: block; margin-bottom: 6px; }
@media (max-width: 1100px) { .dashboard { grid-template-columns: 1fr; } .nav { height: auto; align-items: flex-start; gap: 12px; flex-direction: column; padding: 16px; } }
</style>
</head>
<body>
<nav class="nav">
  <div class="logo">kyucode <span>AI Game QA Agent</span></div>
  <div class="nav-links">
    <span>Dashboard</span><span>Session</span><span>Bug Classification</span><span>Report</span><span>Settings</span>
    <strong>Engine: ${esc(result.engine)}</strong>
    <strong>Mode: ${esc(result.mode)}</strong>
  </div>
</nav>

<main class="container">
  <div class="title-row">
    <div>
      <h1>버그 분류</h1>
      <div class="subtitle">AI가 감지한 이슈를 유형별로 분류하고 우선순위를 부여합니다.</div>
    </div>
  </div>

  <section class="dashboard">
    <div class="card">
      <h2 class="section-title">Main Screenshot Analysis</h2>
      <div id="screenshotWrapper" class="screenshot-wrapper"></div>
      <div id="thumbStrip" class="thumb-strip"></div>
    </div>

    <aside class="card">
      <h2 class="section-title">QA Summary</h2>
      <div class="summary-grid">
        <div class="stat"><div class="num">${result.detectedBugs.length}</div><div class="label">Total Bugs</div></div>
        <div class="stat"><div class="num">${overall}</div><div class="label">Overall Confidence</div></div>
        <div class="stat"><div class="num">${severityCounts.Critical}</div><div class="label">Critical</div></div>
        <div class="stat"><div class="num">${severityCounts.Major}</div><div class="label">Major</div></div>
        <div class="stat"><div class="num">${severityCounts.Minor}</div><div class="label">Minor</div></div>
        <div class="stat"><div class="num">${severityCounts.Info}</div><div class="label">Info</div></div>
      </div>

      <h2 class="section-title">Category Breakdown</h2>
      ${Object.entries(typeCounts).map(([k,v]) => `<div class="type-row"><span>${esc(k)}</span><strong>${v}</strong></div>`).join("")}
    </aside>
  </section>

  <section class="bugs-grid">
    ${result.detectedBugs.map(bug => `
      <article class="card bug-card">
        <h3>${esc(bug.bugId)} · ${esc(bug.bugType)} <span class="badge ${esc(bug.severity)}">${esc(bug.severity)}</span></h3>
        <p><strong>Source:</strong> ${esc(bug.sourceImage)} · <strong>Confidence:</strong> ${esc(bug.confidence)}</p>
        <p>${esc(bug.summary)}</p>
        <strong>Root Cause Candidates</strong>
        <ul>${bug.rootCauseCandidates.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        <strong>Reproduction Steps</strong>
        <ul>${bug.reproductionSteps.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        <strong>Fix Suggestions</strong>
        <ul>${bug.fixSuggestions.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      </article>
    `).join("")}
  </section>

  <section class="card" style="margin-top:20px;">
    <h2 class="section-title">Agent Team Results</h2>
    <div class="agent-grid">
      ${Object.entries(result.agentResults).map(([k,v]) => `<div class="agent-card"><strong>${esc(k)}</strong>${esc(v)}</div>`).join("")}
    </div>
  </section>
</main>

<script>
const DATA = ${dataJson};

function imageSrc(file) {
  return "../data/screenshots/" + String(file || "").replace(/\\\\/g, "/");
}

function severityClass(severity) {
  return "severity-" + String(severity || "Info").toLowerCase();
}

function renderImage(index) {
  const item = DATA.imageAnalysisResults[index] || DATA.imageAnalysisResults[0];
  const wrapper = document.getElementById("screenshotWrapper");
  if (!item) {
    wrapper.innerHTML = "<div style='padding:80px;text-align:center;color:#94a3b8;'>No image data</div>";
    return;
  }

  const candidates = (item.visibleBugCandidates || []).filter(c => c.isDetected);
  wrapper.innerHTML =
    "<img class='main-image' src='" + imageSrc(item.imageFile) + "' alt='" + item.imageFile + "'>" +
    candidates.map(c => {
      const b = c.bbox || {x:0.45,y:0.45,w:0.2,h:0.2};
      return "<div class='bug-box " + severityClass(c.severity) + "' style='left:" + (b.x*100) + "%;top:" + (b.y*100) + "%;width:" + (b.w*100) + "%;height:" + (b.h*100) + "%;'>" +
        "<span class='bug-label'>" + c.type + " · " + c.severity + "</span></div>";
    }).join("");
}

function renderThumbs() {
  const strip = document.getElementById("thumbStrip");
  strip.innerHTML = DATA.imageAnalysisResults.map((item, i) =>
    "<div class='thumb' onclick='selectImage(" + i + ")'><img src='" + imageSrc(item.imageFile) + "'><div>" + item.imageFile + "</div></div>"
  ).join("");
  selectImage(0);
}

function selectImage(index) {
  renderImage(index);
  document.querySelectorAll(".thumb").forEach((el, i) => el.classList.toggle("active", i === index));
}

renderThumbs();
</script>
</body>
</html>`;
}

function main() {
  if (!fs.existsSync(RESULT_PATH)) {
    throw new Error("output/result.json not found. Run npm run vision first.");
  }

  const raw = JSON.parse(fs.readFileSync(RESULT_PATH, "utf8"));
  const imageAnalysisResults = Array.isArray(raw.imageAnalysisResults)
    ? raw.imageAnalysisResults
    : raw.analysisResult?.imageAnalysisResults || raw.result?.imageAnalysisResults || raw.data?.imageAnalysisResults;

  if (!Array.isArray(imageAnalysisResults)) {
    console.log("Available result.json keys:", Object.keys(raw));
    throw new Error("imageAnalysisResults array not found in output/result.json");
  }

  const normalizedResults = imageAnalysisResults.map(normalizeImageResult);
  const detectedBugs = buildDetectedBugs(normalizedResults);

  const normalized = {
    projectName: raw.projectName || "kyucode",
    engine: raw.engine || "Unity",
    mode: raw.mode || "vision",
    imageAnalysisResults: normalizedResults,
    detectedBugs,
    agentResults: buildAgentResults(normalizedResults, detectedBugs),
    futureUnityIntegration: [
      "Unity Console / Player.log integration",
      "GitHub Issue creation",
      "Jira ticket export",
      "Unity project file analysis",
      "Regression test suggestion"
    ]
  };

  fs.writeFileSync(RESULT_PATH, JSON.stringify(normalized, null, 2), "utf8");
  fs.writeFileSync(REPORT_MD_PATH, generateMarkdown(normalized), "utf8");
  fs.writeFileSync(REPORT_HTML_PATH, generateHtml(normalized), "utf8");

  console.log("Normalized result.json, report.md, and report.html generated successfully.");
}

main();
