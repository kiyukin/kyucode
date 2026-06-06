const fs = require('fs');
const path = require('path');

function generateReport(normalizedResults) {
    const reportPath = path.join(__dirname, '../output/report.md');
    const htmlReportPath = path.join(__dirname, '../output/report.html');
    // Further code for generating reports goes here
    fs.writeFileSync(reportPath, 'Updated report based on normalized results.');
    fs.writeFileSync(htmlReportPath, '<!DOCTYPE html><html></html>');
    console.log('Reports generated.');
}

module.exports = { generateReport };