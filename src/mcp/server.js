const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..", "..");
const DATA_DIR = path.join(ROOT, "data");
const SCREENSHOT_DIR = path.join(DATA_DIR, "screenshots");
const OUTPUT_DIR = path.join(ROOT, "output");

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function fileInfo(fullPath) {
  const stat = fs.statSync(fullPath);
  return {
    fileName: path.basename(fullPath),
    extension: path.extname(fullPath).toLowerCase(),
    sizeBytes: stat.size,
    relativePath: path.relative(ROOT, fullPath).replace(/\\/g, "/")
  };
}

function listScreenshots() {
  ensureDir(SCREENSHOT_DIR);

  const files = fs
    .readdirSync(SCREENSHOT_DIR)
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .map((file) => fileInfo(path.join(SCREENSHOT_DIR, file)));

  return {
    tool: "list_screenshots",
    screenshotDir: path.relative(ROOT, SCREENSHOT_DIR).replace(/\\/g, "/"),
    count: files.length,
    files
  };
}

function listOutputFiles() {
  ensureDir(OUTPUT_DIR);

  const files = fs
    .readdirSync(OUTPUT_DIR)
    .filter((file) => fs.statSync(path.join(OUTPUT_DIR, file)).isFile())
    .map((file) => fileInfo(path.join(OUTPUT_DIR, file)));

  const names = new Set(files.map((file) => file.fileName));

  return {
    tool: "list_output_files",
    outputDir: path.relative(ROOT, OUTPUT_DIR).replace(/\\/g, "/"),
    resultJson: names.has("result.json"),
    reportMd: names.has("report.md"),
    reportHtml: names.has("report.html"),
    reportFinalHtml: names.has("report_final.html"),
    files
  };
}

function getProjectStatus() {
  const screenshots = listScreenshots();
  const outputs = listOutputFiles();

  return {
    tool: "get_project_status",
    projectName: "kyucode",
    engine: "Unity",
    mode: "vision",
    root: ROOT,
    screenshotCount: screenshots.count,
    hasResultJson: outputs.resultJson,
    hasReportMd: outputs.reportMd,
    hasReportHtml: outputs.reportHtml,
    hasReportFinalHtml: outputs.reportFinalHtml,
    mcpPurpose: "Connect kyucode Agent to screenshots, OpenAI Vision analysis pipeline, and generated QA reports."
  };
}

function readLatestReport() {
  const reportPath = path.join(OUTPUT_DIR, "report.md");
  const resultPath = path.join(OUTPUT_DIR, "result.json");

  if (fs.existsSync(reportPath)) {
    const content = fs.readFileSync(reportPath, "utf8");
    return {
      tool: "read_latest_report",
      source: "output/report.md",
      content: content.length > 8000 ? content.slice(0, 8000) + "\n\n...[truncated]" : content
    };
  }

  if (fs.existsSync(resultPath)) {
    const content = fs.readFileSync(resultPath, "utf8");
    return {
      tool: "read_latest_report",
      source: "output/result.json",
      content: content.length > 8000 ? content.slice(0, 8000) + "\n\n...[truncated]" : content
    };
  }

  return {
    tool: "read_latest_report",
    message: "No report found. Run run_vision_analysis first."
  };
}

function runScript(scriptRelativePath) {
  const output = execFileSync("node", [scriptRelativePath], {
    cwd: ROOT,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8"
  });

  return output;
}

function runVisionAnalysis() {
  const steps = [];

  steps.push({
    step: "vision",
    script: "src/vision.js",
    output: runScript(path.join("src", "vision.js"))
  });

  steps.push({
    step: "normalize",
    script: "src/normalize.js",
    output: runScript(path.join("src", "normalize.js"))
  });

  steps.push({
    step: "dashboard",
    script: "src/render_final_dashboard.js",
    output: runScript(path.join("src", "render_final_dashboard.js"))
  });

  const responsiveScript = path.join(ROOT, "src", "fix_responsive_report.js");
  if (fs.existsSync(responsiveScript)) {
    steps.push({
      step: "responsive_report_patch",
      script: "src/fix_responsive_report.js",
      output: runScript(path.join("src", "fix_responsive_report.js"))
    });
  }

  return {
    tool: "run_vision_analysis",
    success: true,
    message: "Analysis pipeline completed successfully.",
    outputs: {
      resultJson: "output/result.json",
      reportMd: "output/report.md",
      reportFinalHtml: "output/report_final.html"
    },
    steps
  };
}

const tools = {
  list_screenshots: listScreenshots,
  get_project_status: getProjectStatus,
  read_latest_report: readLatestReport,
  list_output_files: listOutputFiles,
  run_vision_analysis: runVisionAnalysis
};

function printUsage() {
  console.log("kyucode MCP tool runner");
  console.log("");
  console.log("Available tools:");
  Object.keys(tools).forEach((tool) => console.log(`- ${tool}`));
  console.log("");
  console.log("Examples:");
  console.log("node src/mcp/server.js list_screenshots");
  console.log("node src/mcp/server.js get_project_status");
  console.log("node src/mcp/server.js read_latest_report");
  console.log("node src/mcp/server.js list_output_files");
  console.log("node src/mcp/server.js run_vision_analysis");
}

function main() {
  const toolName = process.argv[2];

  if (!toolName) {
    printUsage();
    return;
  }

  if (!tools[toolName]) {
    console.error(`Unknown tool: ${toolName}`);
    printUsage();
    process.exit(1);
  }

  try {
    const result = tools[toolName]();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(JSON.stringify({
      tool: toolName,
      success: false,
      message: error.message
    }, null, 2));
    process.exit(1);
  }
}

main();
