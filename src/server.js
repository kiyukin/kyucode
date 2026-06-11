const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");

const app = express();
const PORT = 3000;

const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const SCREENSHOT_DIR = path.join(DATA_DIR, "screenshots");
const OUTPUT_DIR = path.join(ROOT, "output");
const PUBLIC_DIR = path.join(ROOT, "public");

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_DIR, { recursive: true });

function clearScreenshots() {
  const allowed = new Set([".png", ".jpg", ".jpeg"]);
  for (const file of fs.readdirSync(SCREENSHOT_DIR)) {
    const full = path.join(SCREENSHOT_DIR, file);
    if (fs.statSync(full).isFile() && allowed.has(path.extname(file).toLowerCase())) {
      fs.unlinkSync(full);
    }
  }
}

function safeFileName(originalName, index) {
  const ext = path.extname(originalName).toLowerCase();
  const base =
    path.basename(originalName, ext)
      .replace(/[^\w\-]+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 60) || `screenshot_${index + 1}`;

  return `${String(index + 1).padStart(2, "0")}_${base}${ext}`;
}

let uploadIndex = 0;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, SCREENSHOT_DIR),
  filename: (req, file, cb) => cb(null, safeFileName(file.originalname, uploadIndex++))
});

const upload = multer({
  storage,
  limits: {
    files: 10,
    fileSize: 12 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isImageExt = [".png", ".jpg", ".jpeg"].includes(ext);
    const isImageMime = ["image/png", "image/jpeg"].includes(file.mimetype);

    if (!isImageExt || !isImageMime) {
      return cb(new Error("Only PNG, JPG, and JPEG image files are allowed."));
    }

    cb(null, true);
  }
});

function runNodeScript(relativeScriptPath) {
  return new Promise((resolve, reject) => {
    execFile(
      "node",
      [relativeScriptPath],
      {
        cwd: ROOT,
        windowsHide: true,
        env: process.env
      },
      (error, stdout, stderr) => {
        if (error) {
          return reject(
            new Error(
              `${relativeScriptPath} failed\n${stderr || stdout || error.message}`
            )
          );
        }
        resolve(stdout);
      }
    );
  });
}

async function runAnalysisPipeline() {
  await runNodeScript(path.join("src", "vision.js"));
  await runNodeScript(path.join("src", "normalize.js"));
  await runNodeScript(path.join("src", "render_final_dashboard.js"));
  await runNodeScript(path.join("src", "fix_responsive_report.js"));
}

app.use("/public", express.static(PUBLIC_DIR));
app.use("/data", express.static(DATA_DIR));
app.use("/output", express.static(OUTPUT_DIR));

app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

app.post("/upload", (req, res) => {
  uploadIndex = 0;
  clearScreenshots();

  upload.array("screenshots", 10)(req, res, async (err) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    if (err) {
      return res.status(400).json({
        ok: false,
        message: err.message
      });
    }

    if (!req.files || req.files.length < 1) {
      return res.status(400).json({
        ok: false,
        message: "Please upload at least 1 screenshot."
      });
    }

    if (req.files.length > 10) {
      return res.status(400).json({
        ok: false,
        message: "You can upload up to 10 screenshots."
      });
    }

    try {
      await runAnalysisPipeline();

      return res.json({
        ok: true,
        message: "Analysis completed successfully.",
        fileCount: req.files.length,
        reportUrl: "/output/report_final.html",
        resultUrl: "/output/result.json"
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: error.message
      });
    }
  });
});

app.get("/report", (req, res) => {
  const reportPath = path.join(OUTPUT_DIR, "report_final.html");
  if (!fs.existsSync(reportPath)) {
    return res.status(404).send("report_final.html not found. Please analyze screenshots first.");
  }
  res.sendFile(reportPath);
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});


