const fs = require("fs");
const path = require("path");

const reportPath = path.join(__dirname, "..", "output", "report_final.html");

if (!fs.existsSync(reportPath)) {
  console.log("report_final.html not found. Skip responsive patch.");
  process.exit(0);
}

let html = fs.readFileSync(reportPath, "utf8");

const marker = "/* kyucode-responsive-patch */";

const responsiveCss = `
${marker}
@media (max-width: 1100px) {
  body {
    overflow-x: hidden;
  }

  .container {
    max-width: 100% !important;
    padding: 18px !important;
  }

  .nav {
    height: auto !important;
    min-height: 64px !important;
    padding: 14px 18px !important;
    flex-wrap: wrap !important;
    gap: 10px !important;
    align-items: flex-start !important;
  }

  .logo {
    font-size: 20px !important;
    line-height: 1.25 !important;
    white-space: normal !important;
    word-break: keep-all !important;
    overflow-wrap: normal !important;
    max-width: 100% !important;
  }

  .logo span {
    display: inline !important;
  }

  .nav-links {
    width: 100% !important;
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 10px !important;
    font-size: 12px !important;
  }

  h1 {
    font-size: 30px !important;
    line-height: 1.2 !important;
  }

  .hero {
    display: block !important;
  }

  .dashboard,
  .layout {
    display: grid !important;
    grid-template-columns: 1fr !important;
  }

  .side {
    position: static !important;
  }

  .image-grid,
  .bug-grid,
  .agent-grid,
  .candidate-list {
    grid-template-columns: 1fr !important;
  }

  .image-card,
  .bug-card,
  .card {
    padding: 14px !important;
    max-width: 100% !important;
  }

  .image-card-header {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 10px !important;
  }

  .image-card-header h2 {
    font-size: 18px !important;
  }

  .image-card-header p {
    max-width: 100% !important;
    word-break: break-all !important;
  }

  .pill {
    max-width: 100% !important;
    white-space: normal !important;
  }

  .screenshot-wrapper {
    width: 100% !important;
    max-width: 100% !important;
    overflow: hidden !important;
  }

  .game-image,
  .main-image {
    width: 100% !important;
    height: auto !important;
  }

  .bug-box {
    border-width: 2px !important;
  }

  .bug-box span,
  .bug-label {
    font-size: 10px !important;
    line-height: 1.2 !important;
    top: -23px !important;
    padding: 3px 6px !important;
    max-width: 180px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .summary-grid {
    grid-template-columns: 1fr 1fr !important;
  }

  .stat .num {
    font-size: 24px !important;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 12px !important;
  }

  .nav {
    padding: 12px !important;
  }

  .logo {
    font-size: 18px !important;
  }

  .nav-links {
    font-size: 11px !important;
  }

  h1 {
    font-size: 26px !important;
  }

  .subtitle {
    font-size: 14px !important;
  }

  .summary-grid {
    grid-template-columns: 1fr !important;
  }

  .bug-box span,
  .bug-label {
    display: none !important;
  }
}
`;

if (!html.includes(marker)) {
  if (html.includes("</style>")) {
    html = html.replace("</style>", responsiveCss + "\n</style>");
  } else {
    html = html.replace("</head>", `<style>${responsiveCss}</style>\n</head>`);
  }

  fs.writeFileSync(reportPath, html, "utf8");
  console.log("Responsive CSS patch applied to report_final.html.");
} else {
  console.log("Responsive CSS patch already exists.");
}
