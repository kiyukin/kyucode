const fs = require('fs');
const path = require('path');
const config = require('./config');

// Function to generate HTML report snapshot
function generateReport(normalizedResults, detectedBugs) {
    const reportPath = path.join(__dirname, '../output/report.html');

    // Start building the HTML content
    let htmlContent = `<!DOCTYPE html>\n<html lang='en'>\n<head>\n    <meta charset='UTF-8'>\n    <meta name='viewport' content='width=device-width, initial-scale=1.0'>\n    <title>Game QA Report</title>\n    <style>\nbody { background-color: #07111f; color: white; font-family: Arial, sans-serif; }\n.nav { background-color: #0f1b2d; padding: 10px; display: flex; justify-content: space-between; }\n.summary { display: flex; justify-content: space-between; padding: 20px; }\n.card { background-color: #111827; border-radius: 5px; padding: 15px; margin: 10px; flex: 1; box-shadow: 0 0 10px rgba(0,0,0,0.5); }\n.screenshot-wrapper { position: relative; width: 100%; overflow: hidden; border-radius: 14px; }\n.main-image { width: 100%; display: block; }\n.bug-box { position: absolute; box-sizing: border-box; border: 2px solid; }\n.bug-label { position: absolute; top: -24px; left: 0; background-color: black; color: white; padding: 2px; }\n    </style>\n</head>\n<body>`;
 
    // Add navigation
    htmlContent += `\n    <div class='nav'>\n        <h2>kyucode AI Game QA Agent</h2>\n        <div>\n            <span>Mode: <strong>${config.MODE}</strong></span>\n            <span>Engine: <strong>${config.engine}</strong></span>\n        </div>\n    </div>`;

    // Main Screenshot Panel
    const mainImage = `../data/screenshots/${normalizedResults[0].imageFile}`;
    htmlContent += `\n    <div class='analysis-panel'>\n        <h2>Main Screenshot</h2>\n        <div class='screenshot-wrapper'>\n            <img src='${mainImage}' alt='${normalizedResults[0].imageFile}' onerror='this.onerror=null; this.src="placeholder.png";'>\n`;

    // Add bounding boxes
    normalizedResults[0].visibleBugCandidates.forEach(bug => {
        if (bug.isDetected) {
            htmlContent += `\n        <div class='bug-box' style='left:${bug.bbox.x*100}%; top:${bug.bbox.y*100}%; width:${bug.bbox.w*100}%; height:${bug.bbox.h*100}%;'>\n            <span class='bug-label'>${bug.type}</span>\n        </div>`;
        }
    });
    htmlContent += `\n        </div>`;

    // Summary and Detected Bugs Section
    htmlContent += `\n    <div class='summary'>\n        <h3>Summary</h3>\n        <p>Todo: Add overall summary content here.</p>\n    </div>`;

    // Detected Bugs Panel
    htmlContent += `\n    <h2>Detected Bugs</h2>\n    <div>`;
    detectedBugs.forEach(bug => {
        htmlContent += `<div class='card'>\n            <h4>${bug.bugId} - ${bug.bugType}</h4>\n            <p>Severity: <span class='severity-${bug.severity.toLowerCase()}'>${bug.severity}</span></p>\n            <p>Confidence: ${bug.confidence}</p>\n            <p>Summary: ${bug.summary}</p>\n        </div>`;
    });
    htmlContent += `\n    </div>`;

    // Finalize the HTML document
    htmlContent += `\n</body>\n</html>`;

    fs.writeFileSync(reportPath, htmlContent);
    console.log('HTML report generated successfully.');
}

module.exports = { generateReport };