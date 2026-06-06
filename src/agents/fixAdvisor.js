function suggestFixes(bugAnalysis) {
    return bugAnalysis.map(result => {
        switch(result.suspectedBugType) {
            case 'UI 오류':
                return {
                    imageFile: result.imageFile,
                    suggestedFixDirection: 'UI Canvas 및 Anchor 설정 확인 필요'
                };
            case '충돌 판정':
                return {
                    imageFile: result.imageFile,
                    suggestedFixDirection: 'Collider 및 Rigidbody 설정 점검'
                };
            case '경로 탐색':
                return {
                    imageFile: result.imageFile,
                    suggestedFixDirection: 'NavMesh Bake 확인 및 OffMeshLink 점검'
                };
            case '렌더링 이상':
                return {
                    imageFile: result.imageFile,
                    suggestedFixDirection: 'Rendering Layer 및 Shader 설정 확인'
                };
            case '미니맵 불일치':
                return {
                    imageFile: result.imageFile,
                    suggestedFixDirection: 'Minimap Synchronization 로직 점검'
                };
            case '오브젝트 겹침':
                return {
                    imageFile: result.imageFile,
                    suggestedFixDirection: 'Object Hierarchy 및 Layer 설정 확인'
                };
            default:
                return {
                    imageFile: result.imageFile,
                    suggestedFixDirection: '문제의 자세한 원인에 대한 검토 필요'
                };
        }
    });
}

module.exports = { suggestFixes };