function classifyBugs(analysisResults) {
    return analysisResults.map(result => {
        const { visibleBugCandidates, confidence } = result;
        let suspectedBugType = '';

        // Classify bug type
        if (visibleBugCandidates.includes('UI overlap')) {
            suspectedBugType = 'UI 오류';
        } else if (visibleBugCandidates.includes('collision issue')) {
            suspectedBugType = '충돌 판정';
        } else if (visibleBugCandidates.includes('pathfinding issue')) {
            suspectedBugType = '경로 탐색';
        } else if (visibleBugCandidates.includes('rendering artifact')) {
            suspectedBugType = '렌더링 이상';
        } else if (visibleBugCandidates.includes('minimap mismatch')) {
            suspectedBugType = '미니맵 불일치';
        } else if (visibleBugCandidates.includes('object overlap')) {
            suspectedBugType = '오브젝트 겹침';
        } else {
            suspectedBugType = '기타';
        }

        return {
            imageFile: result.imageFile,
            suspectedBugType,
            confidence
        };
    });
}

module.exports = { classifyBugs };