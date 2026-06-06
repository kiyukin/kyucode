const { analyzeImage } = require('../providers/openaiProvider');
const { getImagesFromDirectory } = require('../adapters/imageInputAdapter');
const config = require('../config');

const bugTypeMapping = {
    'UI overlap': 'UI 오류',
    'ui_overlap': 'UI 오류',
    'uiIssues': 'UI 오류',
    'UI issue': 'UI 오류',
    'object clipping': '오브젝트 겹침',
    'clipping': '오브젝트 겹침',
    'object overlap': '오브젝트 겹침',
    'overlap': '오브젝트 겹침',
    'minimap mismatch': '미니맵 불일치',
    'minimapIssues': '미니맵 불일치',
    'rendering artifact': '렌더링 이상',
    'renderingArtifacts': '렌더링 이상',
    'pathfinding issue': '경로 탐색',
    'pathfindingIssues': '경로 탐색',
    'collision issue': '충돌 판정',
    'collisionIssues': '충돌 판정',
    'unknown': '기타'
};

const severityMapping = {
    'critical': 'Critical',
    'blocker': 'Critical',
    'game breaking': 'Critical',
    'high': 'Major',
    'major': 'Major',
    'medium': 'Minor',
    'minor': 'Minor',
    'low': 'Info',
    'info': 'Info'
};

function normalizeConfidence(confidence) {
    if (confidence === undefined) return 0.5;
    if (typeof confidence === 'string' && confidence.includes('%')) {
        return (parseFloat(confidence) / 100).toFixed(2);
    }
    return (+confidence).toFixed(2);
}

function normalizeVisionResult(analysisResult, actualImageFile) {
    const visibleBugCandidates = analysisResult.visibleBugCandidates.map(candidate => ({
        type: bugTypeMapping[candidate.type] || '기타',
        isDetected: candidate.isDetected,
        severity: severityMapping[candidate.severity.toLowerCase()] || 'Info',
        confidence: normalizeConfidence(candidate.confidence),
        visualEvidence: candidate.visualEvidence,
        possibleUnityCause: candidate.possibleUnityCause,
        suggestedFixDirection: candidate.suggestedFixDirection
    }));

    return {
        imageFile: actualImageFile,
        visibleBugCandidates,
        primaryBugType: analysisResult.primaryBugType,
        severityEstimate: severityMapping[analysisResult.severityEstimate.toLowerCase()] || 'Info',
        overallConfidence: normalizeConfidence(analysisResult.overallConfidence),
        summary: analysisResult.summary
    };
}

async function detectBugs() {
    const images = getImagesFromDirectory();
    let analysisResults = [];

    for (const image of images) {
        if (config.MODE === 'vision') {
            const analysisResult = await analyzeImage(image.path);
            if (analysisResult) {
                analysisResults.push(normalizeVisionResult(analysisResult, image.filename));
            }
        } else {
            const mockResult = {
                imageFile: image.filename,
                visibleBugCandidates: [{
                    type: 'UI 오류',
                    isDetected: true,
                    severity: 'Major',
                    confidence: 0.85,
                    visualEvidence: 'Visual evidence here',
                    possibleUnityCause: 'Collider Issue',
                    suggestedFixDirection: 'Check collider settings'
                }],
                primaryBugType: 'UI 오류',
                severityEstimate: 'Major',
                overallConfidence: 0.85,
                summary: 'Summary of issues detected in the image.'
            };
            analysisResults.push(mockResult);
        }
    }

    return analysisResults;
}

module.exports = { detectBugs };