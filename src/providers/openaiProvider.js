const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');
const config = require('../config');

const configuration = new Configuration({
    apiKey: config.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function analyzeImage(imageFile) {
    try {
        const base64Image = fs.readFileSync(imageFile, { encoding: 'base64' });
        const dataUrl = `data:image/png;base64,${base64Image}`;
        const response = await openai.createChatCompletion({
            model: config.OPENAI_MODEL,
            messages: [{
                role: "user",
                content: `Analyze this Unity game screenshot as a QA tester. Identify visible bug candidates such as UI overlap, object clipping, minimap mismatch, rendering artifact, pathfinding issue, collision issue, or object overlap. Return structured JSON only following this structure: {\n  imageFile: String,\n  visibleBugCandidates: [{\n    type: String,\n    isDetected: Boolean,\n    severity: String,\n    confidence: Number,\n    visualEvidence: String,\n    possibleUnityCause: String,\n    suggestedFixDirection: String\n  }],\n  primaryBugType: String,\n  severityEstimate: String,\n  overallConfidence: Number,\n  summary: String}`
            }],
            temperature: 0.5
        });

        const analysisData = response.data.choices[0].message.content.replace(/```json|```/g, '').trim();

        // Return standardized JSON structure
        const analysisJSON = JSON.parse(analysisData);

        return {
            imageFile,
            ...analysisJSON
        };
    } catch (error) {
        if (error.response) {
            console.error(`Error ${error.response.status}: ${error.response.data.error.message}`);
        } else {
            console.error('An unexpected error occurred:', error.message);
        }
        return null;
    }
}

module.exports = { analyzeImage };