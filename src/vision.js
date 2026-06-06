const { detectBugs } = require('./agents/visualBugDetector');
const fs = require('fs');
const path = require('path');
const config = require('./config');

async function runVision() {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
        console.error('API key not found. Please set your OPENAI_API_KEY in the .env file.');
        return;
    }

    // Get image analysis results
    const analysisResults = await detectBugs();
    if (!analysisResults || analysisResults.length === 0) {
        console.warn('No images found for analysis. Falling back to mock mode.');
        return;
    }

    // Save results to output/result.json
    const outputFile = path.join(__dirname, '../output/result.json');
    fs.writeFileSync(outputFile, JSON.stringify({
        projectName: 'kyucode',
        engine: 'Unity',
        mode: 'vision',
        imageAnalysisResults: analysisResults
    }, null, 2));

    console.log('Vision analysis completed successfully and results saved.');
}

runVision();