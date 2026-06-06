# kyucode Vision QA Report

- Project: kyucode
- Engine: Unity
- Mode: vision
- Screenshots: 10
- Detected Bugs: 31

## Image Analysis Results
### test_animation_bug_10.png
- Primary Bug Type: 미니맵 불일치
- Severity: Major
- Overall Confidence: 0.69

- UI 오류 / Minor / 0.85
  - Evidence: Health bar overlaps with the minimap.
  - Cause: Improper UI layout settings or anchors.
  - Fix: Adjust the UI anchors and layout to prevent overlap.
  - BBox: x=0.72, y=0.05, w=0.25, h=0.22
- 오브젝트 겹침 / Major / 0.6
  - Evidence: No visible clipping detected.
  - Cause: N/A
  - Fix: N/A
  - BBox: x=0.42, y=0.38, w=0.24, h=0.26
- 미니맵 불일치 / Major / 0.9
  - Evidence: Minimap does not accurately reflect the player's position.
  - Cause: Incorrect minimap scaling or player position tracking.
  - Fix: Check minimap scaling settings and player coordinate mapping.
  - BBox: x=0.76, y=0.04, w=0.2, h=0.22
- 렌더링 이상 / Minor / 0.75
  - Evidence: Flickering textures on the ground.
  - Cause: Z-fighting or incorrect material settings.
  - Fix: Adjust the materials or increase the distance between overlapping objects.
  - BBox: x=0.45, y=0.55, w=0.35, h=0.25
- 기타 / Minor / 0.5
  - Evidence: N/A
  - Cause: N/A
  - Fix: N/A
  - BBox: x=0.45, y=0.45, w=0.2, h=0.2
- 기타 / Major / 0.4
  - Evidence: N/A
  - Cause: N/A
  - Fix: N/A
  - BBox: x=0.45, y=0.45, w=0.2, h=0.2
- 충돌 판정 / Minor / 0.8
  - Evidence: Two NPCs are overlapping in the scene.
  - Cause: Improper spawn logic or collision settings.
  - Fix: Implement better spawn logic to avoid overlap.
  - BBox: x=0.45, y=0.4, w=0.3, h=0.3

### test_collision_issue_08.png
- Primary Bug Type: 충돌 판정
- Severity: Major
- Overall Confidence: 0.82

- UI 오류 / Minor / 0.85
  - Evidence: Health bar overlaps with minimap in the top corner.
  - Cause: Incorrect positioning of UI elements.
  - Fix: Adjust the anchor points and layout settings for the UI components.
  - BBox: x=0.72, y=0.05, w=0.25, h=0.22
- 충돌 판정 / Major / 0.9
  - Evidence: Character model partially intersects with the environment geometry.
  - Cause: Improper collider settings or incorrect model import settings.
  - Fix: Review and adjust colliders or modify the model's mesh to prevent clipping.
  - BBox: x=0.45, y=0.4, w=0.3, h=0.3
- 미니맵 불일치 / Major / 0.7
  - Evidence: Player's location on the minimap does not align with the actual position in the game world.
  - Cause: Incorrect mapping of player coordinates to minimap coordinates.
  - Fix: Check the minimap script for accurate position translation.
  - BBox: x=0.76, y=0.04, w=0.2, h=0.22

### test_minimap_mismatch_03.png
- Primary Bug Type: 충돌 판정
- Severity: Major
- Overall Confidence: 0.78

- UI 오류 / Minor / 0.85
  - Evidence: The health bar overlaps with the minimap.
  - Cause: Improper UI layout settings or anchors.
  - Fix: Adjust the RectTransform settings of the UI elements to prevent overlap.
  - BBox: x=0.72, y=0.05, w=0.25, h=0.22
- 충돌 판정 / Major / 0.9
  - Evidence: Character model is partially clipping through the environment.
  - Cause: Incorrect collider settings or scaling issues.
  - Fix: Review and adjust collider sizes and check for appropriate layer settings.
  - BBox: x=0.45, y=0.4, w=0.3, h=0.3
- 미니맵 불일치 / Major / 0.6
  - Evidence: Minimap does not accurately reflect player position.
  - Cause: Minimap camera settings may be misconfigured.
  - Fix: Verify the minimap camera's position and settings against the main camera.
  - BBox: x=0.76, y=0.04, w=0.2, h=0.22

### test_missing_texture_05.png
- Primary Bug Type: 미니맵 불일치
- Severity: Major
- Overall Confidence: 0.75

- UI 오류 / Minor / 0.85
  - Evidence: The health bar overlaps with the minimap.
  - Cause: Incorrect canvas sorting order or anchors.
  - Fix: Adjust the canvas hierarchy or reposition UI elements.
  - BBox: x=0.72, y=0.05, w=0.25, h=0.22
- 충돌 판정 / Major / 0.6
  - Evidence: Some objects appear partially obscured by the environment.
  - Cause: Improper collider setup or object layering.
  - Fix: Check the collider settings and ensure proper layering.
  - BBox: x=0.45, y=0.4, w=0.3, h=0.3
- 미니맵 불일치 / Major / 0.9
  - Evidence: Minimap does not show the correct player position.
  - Cause: Minimap camera not aligned with player position.
  - Fix: Reconfigure the minimap camera settings to track the player accurately.
  - BBox: x=0.76, y=0.04, w=0.2, h=0.22
- 렌더링 이상 / Minor / 0.75
  - Evidence: Flickering textures on the terrain.
  - Cause: Z-fighting between overlapping textures.
  - Fix: Adjust the material properties or increase the distance between overlapping objects.
  - BBox: x=0.45, y=0.55, w=0.35, h=0.25
- 경로 탐색 / Major / 0.7
  - Evidence: NPCs getting stuck in corners.
  - Cause: NavMesh not properly baked or updated.
  - Fix: Re-bake the NavMesh to ensure proper navigation paths.
  - BBox: x=0.35, y=0.35, w=0.25, h=0.25
- 충돌 판정 / Minor / 0.8
  - Evidence: Player character passes through a wall.
  - Cause: Incorrect collider setup or missing colliders.
  - Fix: Verify that all colliders are correctly placed and configured.
  - BBox: x=0.45, y=0.4, w=0.3, h=0.3
- 기타 / Info / 0.65
  - Evidence: Two objects appear to occupy the same space.
  - Cause: Improper object placement in the scene.
  - Fix: Review object placements and ensure no overlaps occur.
  - BBox: x=0.45, y=0.45, w=0.2, h=0.2

### test_npc_stacking_06.png
- Primary Bug Type: 충돌 판정
- Severity: Major
- Overall Confidence: 0.78

- UI 오류 / Minor / 0.85
  - Evidence: The health bar overlaps with the minimap in the top right corner.
  - Cause: Improper UI layout settings or anchor points.
  - Fix: Adjust the positioning of the UI elements in the Canvas.
  - BBox: x=0.72, y=0.05, w=0.25, h=0.22
- 충돌 판정 / Major / 0.9
  - Evidence: Character model partially clips through the wall.
  - Cause: Incorrect collider settings or mesh rendering issues.
  - Fix: Check the collider bounds and adjust the character's position or scale.
  - BBox: x=0.45, y=0.4, w=0.3, h=0.3
- 미니맵 불일치 / Major / 0.6
  - Evidence: Minimap does not accurately reflect player position.
  - Cause: Incorrect tracking of player coordinates.
  - Fix: Verify the script handling the minimap updates.
  - BBox: x=0.76, y=0.04, w=0.2, h=0.22
- 오브젝트 겹침 / Minor / 0.75
  - Evidence: Strange flickering on the terrain in the background.
  - Cause: Z-fighting due to overlapping meshes or incorrect camera settings.
  - Fix: Adjust the mesh depth or modify camera clipping planes.
  - BBox: x=0.35, y=0.58, w=0.22, h=0.22
- 충돌 판정 / Major / 0.8
  - Evidence: Player can walk through certain objects that should be solid.
  - Cause: Colliders not set up correctly on solid objects.
  - Fix: Review and fix the collider configurations for affected objects.
  - BBox: x=0.45, y=0.4, w=0.3, h=0.3

### test_object_clipping_02.png
- Primary Bug Type: 충돌 판정
- Severity: Major
- Overall Confidence: 0.83

- UI 오류 / Minor / 0.85
  - Evidence: The health bar overlaps with the minimap.
  - Cause: Incorrect UI canvas settings or layout issues.
  - Fix: Adjust the positioning of the UI elements in the Canvas.
  - BBox: x=0.72, y=0.05, w=0.25, h=0.22
- 충돌 판정 / Major / 0.9
  - Evidence: Character model partially clipping through the wall.
  - Cause: Improper collider setup or wrong layer configurations.
  - Fix: Review and adjust colliders for the character and the wall.
  - BBox: x=0.45, y=0.4, w=0.3, h=0.3
- 미니맵 불일치 / Major / 0.75
  - Evidence: Minimap does not accurately reflect player position.
  - Cause: Incorrect player position tracking on the minimap.
  - Fix: Verify minimap camera settings and player position updates.
  - BBox: x=0.76, y=0.04, w=0.2, h=0.22

### test_pathfinding_issue_07.png
- Primary Bug Type: 미니맵 불일치
- Severity: Major
- Overall Confidence: 0.61

- UI 오류 / Minor / 0.8
  - Evidence: Health bar overlaps with inventory UI.
  - Cause: Incorrect UI layout settings or anchors.
  - Fix: Adjust the positioning and anchors of the UI elements in the Canvas.
  - BBox: x=0.66, y=0.1, w=0.28, h=0.2
- 오브젝트 겹침 / Major / 0.5
  - Evidence: No visible clipping detected in this frame.
  - Cause: N/A
  - Fix: N/A
  - BBox: x=0.42, y=0.38, w=0.24, h=0.26
- 미니맵 불일치 / Major / 0.9
  - Evidence: Minimap does not reflect the player's current position accurately.
  - Cause: Incorrect position syncing between player and minimap.
  - Fix: Check the minimap camera settings and ensure correct player position updates.
  - BBox: x=0.76, y=0.04, w=0.2, h=0.22
- 렌더링 이상 / Minor / 0.75
  - Evidence: Flickering textures on the terrain.
  - Cause: Shader issues or texture mipmap settings.
  - Fix: Review the shaders used and adjust mipmap settings for the terrain textures.
  - BBox: x=0.45, y=0.55, w=0.35, h=0.25
- 경로 탐색 / Major / 0.4
  - Evidence: Pathfinding not observable in this screenshot.
  - Cause: N/A
  - Fix: N/A
  - BBox: x=0.35, y=0.35, w=0.25, h=0.25
- 충돌 판정 / Major / 0.3
  - Evidence: No collision issues visible in this frame.
  - Cause: N/A
  - Fix: N/A
  - BBox: x=0.45, y=0.4, w=0.3, h=0.3
- 충돌 판정 / Major / 0.65
  - Evidence: Two NPCs are overlapping in the center of the screen.
  - Cause: Incorrect spawn logic or lack of collision avoidance.
  - Fix: Implement spacing logic for NPC spawns to prevent overlap.
  - BBox: x=0.45, y=0.4, w=0.3, h=0.3

### test_rendering_artifact_04.png
- Primary Bug Type: 충돌 판정
- Severity: Major
- Overall Confidence: 0.78

- UI 오류 / Minor / 0.85
  - Evidence: The health bar overlaps with the minimap.
  - Cause: Incorrect UI canvas sorting or positioning.
  - Fix: Adjust the UI elements' RectTransform properties to ensure proper layering.
  - BBox: x=0.72, y=0.05, w=0.25, h=0.22
- 충돌 판정 / Major / 0.9
  - Evidence: Character model partially clips through the wall.
  - Cause: Incorrect collider setup or scale issues.
  - Fix: Review collider boundaries and adjust the character's position or collider size.
  - BBox: x=0.45, y=0.4, w=0.3, h=0.3
- 미니맵 불일치 / Major / 0.6
  - Evidence: Minimap does not reflect the current player position accurately.
  - Cause: Minimap update logic may be faulty.
  - Fix: Ensure the minimap updates correctly based on player movement.
  - BBox: x=0.76, y=0.04, w=0.2, h=0.22

### test_ui_cutoff_09.png
- Primary Bug Type: 충돌 판정
- Severity: Major
- Overall Confidence: 0.78

- UI 오류 / Minor / 0.85
  - Evidence: The health bar overlaps with the minimap, making it hard to read both elements.
  - Cause: Incorrect UI layout settings or canvas scaling issues.
  - Fix: Adjust the layout of the UI elements to ensure they do not overlap and are clearly visible.
  - BBox: x=0.72, y=0.05, w=0.25, h=0.22
- 충돌 판정 / Major / 0.9
  - Evidence: The character model is partially clipping through a wall.
  - Cause: Improper collider settings or incorrect positioning of the character model.
  - Fix: Check and adjust the collider settings and ensure the character's position respects the environment boundaries.
  - BBox: x=0.45, y=0.4, w=0.3, h=0.3
- 미니맵 불일치 / Major / 0.6
  - Evidence: Minimap does not accurately represent the current terrain.
  - Cause: Outdated minimap data or incorrect map generation.
  - Fix: Update the minimap data to reflect the current game state and terrain.
  - BBox: x=0.76, y=0.04, w=0.2, h=0.22

### test_ui_overlap_01.png
- Primary Bug Type: 충돌 판정
- Severity: Major
- Overall Confidence: 0.78

- UI 오류 / Minor / 0.85
  - Evidence: The health bar overlaps with the inventory icon.
  - Cause: Canvas scaling issues or incorrect anchor settings.
  - Fix: Adjust the canvas settings and reposition UI elements to prevent overlap.
  - BBox: x=0.66, y=0.1, w=0.28, h=0.2
- 충돌 판정 / Major / 0.9
  - Evidence: Character's arm clips through the wall when standing close.
  - Cause: Improper collider setup or incorrect layer settings.
  - Fix: Review the collider dimensions and adjust them to prevent clipping.
  - BBox: x=0.45, y=0.4, w=0.3, h=0.3
- 미니맵 불일치 / Major / 0.6
  - Evidence: Minimap does not reflect the current player position accurately.
  - Cause: Incorrect player position updates on the minimap.
  - Fix: Check the minimap camera settings and ensure player position is correctly linked.
  - BBox: x=0.76, y=0.04, w=0.2, h=0.22
- 렌더링 이상 / Minor / 0.75
  - Evidence: Flickering textures on the ground in certain lighting conditions.
  - Cause: Z-fighting between two overlapping meshes.
  - Fix: Adjust the position or scale of overlapping meshes to eliminate Z-fighting.
  - BBox: x=0.45, y=0.55, w=0.35, h=0.25

## Detected Bugs
### BUG-001 - UI 오류
- Source: test_animation_bug_10.png
- Severity: Minor
- Confidence: 0.85
- Summary: Health bar overlaps with the minimap.
- Root Cause Candidates:
  - UI Canvas의 Anchor, Pivot, RectTransform 설정 오류 가능성
  - Canvas Scaler 또는 Sorting Order 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Canvas Scaler, Anchor, Pivot, RectTransform, Sorting Order를 확인한다.
  - 여러 해상도에서 UI Safe Area와 겹침 여부를 테스트한다.

### BUG-002 - 미니맵 불일치
- Source: test_animation_bug_10.png
- Severity: Major
- Confidence: 0.9
- Summary: Minimap does not accurately reflect the player's position.
- Root Cause Candidates:
  - Minimap Camera가 Player Transform을 정확히 추적하지 못하는 문제 가능성
  - 월드 좌표와 미니맵 좌표 변환 로직 오류 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Minimap Camera target이 Player Transform을 정확히 추적하는지 확인한다.
  - 월드 좌표를 미니맵 좌표로 변환하는 스크립트를 점검한다.

### BUG-003 - 렌더링 이상
- Source: test_animation_bug_10.png
- Severity: Minor
- Confidence: 0.75
- Summary: Flickering textures on the ground.
- Root Cause Candidates:
  - Z-fighting 또는 중복 메시 문제 가능성
  - Shader, Material, Shadow Quality 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Material, Shader, Shadow Quality, Z-fighting 여부를 확인한다.
  - 겹친 메시 또는 중복 지형 오브젝트를 제거한다.

### BUG-004 - 충돌 판정
- Source: test_animation_bug_10.png
- Severity: Minor
- Confidence: 0.8
- Summary: Two NPCs are overlapping in the scene.
- Root Cause Candidates:
  - Collider 또는 Rigidbody 설정 누락 가능성
  - Layer Collision Matrix 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Collider, Rigidbody, Character Controller 설정을 확인한다.
  - Layer Collision Matrix와 Is Trigger 설정을 점검한다.

### BUG-005 - UI 오류
- Source: test_collision_issue_08.png
- Severity: Minor
- Confidence: 0.85
- Summary: Health bar overlaps with minimap in the top corner.
- Root Cause Candidates:
  - UI Canvas의 Anchor, Pivot, RectTransform 설정 오류 가능성
  - Canvas Scaler 또는 Sorting Order 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Canvas Scaler, Anchor, Pivot, RectTransform, Sorting Order를 확인한다.
  - 여러 해상도에서 UI Safe Area와 겹침 여부를 테스트한다.

### BUG-006 - 충돌 판정
- Source: test_collision_issue_08.png
- Severity: Major
- Confidence: 0.9
- Summary: Character model partially intersects with the environment geometry.
- Root Cause Candidates:
  - Collider 또는 Rigidbody 설정 누락 가능성
  - Layer Collision Matrix 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Collider, Rigidbody, Character Controller 설정을 확인한다.
  - Layer Collision Matrix와 Is Trigger 설정을 점검한다.

### BUG-007 - 미니맵 불일치
- Source: test_collision_issue_08.png
- Severity: Major
- Confidence: 0.7
- Summary: Player's location on the minimap does not align with the actual position in the game world.
- Root Cause Candidates:
  - Minimap Camera가 Player Transform을 정확히 추적하지 못하는 문제 가능성
  - 월드 좌표와 미니맵 좌표 변환 로직 오류 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Minimap Camera target이 Player Transform을 정확히 추적하는지 확인한다.
  - 월드 좌표를 미니맵 좌표로 변환하는 스크립트를 점검한다.

### BUG-008 - UI 오류
- Source: test_minimap_mismatch_03.png
- Severity: Minor
- Confidence: 0.85
- Summary: The health bar overlaps with the minimap.
- Root Cause Candidates:
  - UI Canvas의 Anchor, Pivot, RectTransform 설정 오류 가능성
  - Canvas Scaler 또는 Sorting Order 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Canvas Scaler, Anchor, Pivot, RectTransform, Sorting Order를 확인한다.
  - 여러 해상도에서 UI Safe Area와 겹침 여부를 테스트한다.

### BUG-009 - 충돌 판정
- Source: test_minimap_mismatch_03.png
- Severity: Major
- Confidence: 0.9
- Summary: Character model is partially clipping through the environment.
- Root Cause Candidates:
  - Collider 또는 Rigidbody 설정 누락 가능성
  - Layer Collision Matrix 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Collider, Rigidbody, Character Controller 설정을 확인한다.
  - Layer Collision Matrix와 Is Trigger 설정을 점검한다.

### BUG-010 - UI 오류
- Source: test_missing_texture_05.png
- Severity: Minor
- Confidence: 0.85
- Summary: The health bar overlaps with the minimap.
- Root Cause Candidates:
  - UI Canvas의 Anchor, Pivot, RectTransform 설정 오류 가능성
  - Canvas Scaler 또는 Sorting Order 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Canvas Scaler, Anchor, Pivot, RectTransform, Sorting Order를 확인한다.
  - 여러 해상도에서 UI Safe Area와 겹침 여부를 테스트한다.

### BUG-011 - 미니맵 불일치
- Source: test_missing_texture_05.png
- Severity: Major
- Confidence: 0.9
- Summary: Minimap does not show the correct player position.
- Root Cause Candidates:
  - Minimap Camera가 Player Transform을 정확히 추적하지 못하는 문제 가능성
  - 월드 좌표와 미니맵 좌표 변환 로직 오류 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Minimap Camera target이 Player Transform을 정확히 추적하는지 확인한다.
  - 월드 좌표를 미니맵 좌표로 변환하는 스크립트를 점검한다.

### BUG-012 - 렌더링 이상
- Source: test_missing_texture_05.png
- Severity: Minor
- Confidence: 0.75
- Summary: Flickering textures on the terrain.
- Root Cause Candidates:
  - Z-fighting 또는 중복 메시 문제 가능성
  - Shader, Material, Shadow Quality 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Material, Shader, Shadow Quality, Z-fighting 여부를 확인한다.
  - 겹친 메시 또는 중복 지형 오브젝트를 제거한다.

### BUG-013 - 충돌 판정
- Source: test_missing_texture_05.png
- Severity: Minor
- Confidence: 0.8
- Summary: Player character passes through a wall.
- Root Cause Candidates:
  - Collider 또는 Rigidbody 설정 누락 가능성
  - Layer Collision Matrix 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Collider, Rigidbody, Character Controller 설정을 확인한다.
  - Layer Collision Matrix와 Is Trigger 설정을 점검한다.

### BUG-014 - UI 오류
- Source: test_npc_stacking_06.png
- Severity: Minor
- Confidence: 0.85
- Summary: The health bar overlaps with the minimap in the top right corner.
- Root Cause Candidates:
  - UI Canvas의 Anchor, Pivot, RectTransform 설정 오류 가능성
  - Canvas Scaler 또는 Sorting Order 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Canvas Scaler, Anchor, Pivot, RectTransform, Sorting Order를 확인한다.
  - 여러 해상도에서 UI Safe Area와 겹침 여부를 테스트한다.

### BUG-015 - 충돌 판정
- Source: test_npc_stacking_06.png
- Severity: Major
- Confidence: 0.9
- Summary: Character model partially clips through the wall.
- Root Cause Candidates:
  - Collider 또는 Rigidbody 설정 누락 가능성
  - Layer Collision Matrix 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Collider, Rigidbody, Character Controller 설정을 확인한다.
  - Layer Collision Matrix와 Is Trigger 설정을 점검한다.

### BUG-016 - 오브젝트 겹침
- Source: test_npc_stacking_06.png
- Severity: Minor
- Confidence: 0.75
- Summary: Strange flickering on the terrain in the background.
- Root Cause Candidates:
  - Collider bounds와 Mesh Renderer 위치 불일치 가능성
  - 오브젝트 배치 좌표 또는 스케일 설정 오류 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Collider 크기와 Mesh Renderer 위치를 비교한다.
  - Scene View에서 오브젝트 배치와 충돌 영역을 확인한다.

### BUG-017 - 충돌 판정
- Source: test_npc_stacking_06.png
- Severity: Major
- Confidence: 0.8
- Summary: Player can walk through certain objects that should be solid.
- Root Cause Candidates:
  - Collider 또는 Rigidbody 설정 누락 가능성
  - Layer Collision Matrix 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Collider, Rigidbody, Character Controller 설정을 확인한다.
  - Layer Collision Matrix와 Is Trigger 설정을 점검한다.

### BUG-018 - UI 오류
- Source: test_object_clipping_02.png
- Severity: Minor
- Confidence: 0.85
- Summary: The health bar overlaps with the minimap.
- Root Cause Candidates:
  - UI Canvas의 Anchor, Pivot, RectTransform 설정 오류 가능성
  - Canvas Scaler 또는 Sorting Order 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Canvas Scaler, Anchor, Pivot, RectTransform, Sorting Order를 확인한다.
  - 여러 해상도에서 UI Safe Area와 겹침 여부를 테스트한다.

### BUG-019 - 충돌 판정
- Source: test_object_clipping_02.png
- Severity: Major
- Confidence: 0.9
- Summary: Character model partially clipping through the wall.
- Root Cause Candidates:
  - Collider 또는 Rigidbody 설정 누락 가능성
  - Layer Collision Matrix 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Collider, Rigidbody, Character Controller 설정을 확인한다.
  - Layer Collision Matrix와 Is Trigger 설정을 점검한다.

### BUG-020 - 미니맵 불일치
- Source: test_object_clipping_02.png
- Severity: Major
- Confidence: 0.75
- Summary: Minimap does not accurately reflect player position.
- Root Cause Candidates:
  - Minimap Camera가 Player Transform을 정확히 추적하지 못하는 문제 가능성
  - 월드 좌표와 미니맵 좌표 변환 로직 오류 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Minimap Camera target이 Player Transform을 정확히 추적하는지 확인한다.
  - 월드 좌표를 미니맵 좌표로 변환하는 스크립트를 점검한다.

### BUG-021 - UI 오류
- Source: test_pathfinding_issue_07.png
- Severity: Minor
- Confidence: 0.8
- Summary: Health bar overlaps with inventory UI.
- Root Cause Candidates:
  - UI Canvas의 Anchor, Pivot, RectTransform 설정 오류 가능성
  - Canvas Scaler 또는 Sorting Order 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Canvas Scaler, Anchor, Pivot, RectTransform, Sorting Order를 확인한다.
  - 여러 해상도에서 UI Safe Area와 겹침 여부를 테스트한다.

### BUG-022 - 미니맵 불일치
- Source: test_pathfinding_issue_07.png
- Severity: Major
- Confidence: 0.9
- Summary: Minimap does not reflect the player's current position accurately.
- Root Cause Candidates:
  - Minimap Camera가 Player Transform을 정확히 추적하지 못하는 문제 가능성
  - 월드 좌표와 미니맵 좌표 변환 로직 오류 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Minimap Camera target이 Player Transform을 정확히 추적하는지 확인한다.
  - 월드 좌표를 미니맵 좌표로 변환하는 스크립트를 점검한다.

### BUG-023 - 렌더링 이상
- Source: test_pathfinding_issue_07.png
- Severity: Minor
- Confidence: 0.75
- Summary: Flickering textures on the terrain.
- Root Cause Candidates:
  - Z-fighting 또는 중복 메시 문제 가능성
  - Shader, Material, Shadow Quality 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Material, Shader, Shadow Quality, Z-fighting 여부를 확인한다.
  - 겹친 메시 또는 중복 지형 오브젝트를 제거한다.

### BUG-024 - 충돌 판정
- Source: test_pathfinding_issue_07.png
- Severity: Major
- Confidence: 0.65
- Summary: Two NPCs are overlapping in the center of the screen.
- Root Cause Candidates:
  - Collider 또는 Rigidbody 설정 누락 가능성
  - Layer Collision Matrix 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Collider, Rigidbody, Character Controller 설정을 확인한다.
  - Layer Collision Matrix와 Is Trigger 설정을 점검한다.

### BUG-025 - UI 오류
- Source: test_rendering_artifact_04.png
- Severity: Minor
- Confidence: 0.85
- Summary: The health bar overlaps with the minimap.
- Root Cause Candidates:
  - UI Canvas의 Anchor, Pivot, RectTransform 설정 오류 가능성
  - Canvas Scaler 또는 Sorting Order 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Canvas Scaler, Anchor, Pivot, RectTransform, Sorting Order를 확인한다.
  - 여러 해상도에서 UI Safe Area와 겹침 여부를 테스트한다.

### BUG-026 - 충돌 판정
- Source: test_rendering_artifact_04.png
- Severity: Major
- Confidence: 0.9
- Summary: Character model partially clips through the wall.
- Root Cause Candidates:
  - Collider 또는 Rigidbody 설정 누락 가능성
  - Layer Collision Matrix 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Collider, Rigidbody, Character Controller 설정을 확인한다.
  - Layer Collision Matrix와 Is Trigger 설정을 점검한다.

### BUG-027 - UI 오류
- Source: test_ui_cutoff_09.png
- Severity: Minor
- Confidence: 0.85
- Summary: The health bar overlaps with the minimap, making it hard to read both elements.
- Root Cause Candidates:
  - UI Canvas의 Anchor, Pivot, RectTransform 설정 오류 가능성
  - Canvas Scaler 또는 Sorting Order 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Canvas Scaler, Anchor, Pivot, RectTransform, Sorting Order를 확인한다.
  - 여러 해상도에서 UI Safe Area와 겹침 여부를 테스트한다.

### BUG-028 - 충돌 판정
- Source: test_ui_cutoff_09.png
- Severity: Major
- Confidence: 0.9
- Summary: The character model is partially clipping through a wall.
- Root Cause Candidates:
  - Collider 또는 Rigidbody 설정 누락 가능성
  - Layer Collision Matrix 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Collider, Rigidbody, Character Controller 설정을 확인한다.
  - Layer Collision Matrix와 Is Trigger 설정을 점검한다.

### BUG-029 - UI 오류
- Source: test_ui_overlap_01.png
- Severity: Minor
- Confidence: 0.85
- Summary: The health bar overlaps with the inventory icon.
- Root Cause Candidates:
  - UI Canvas의 Anchor, Pivot, RectTransform 설정 오류 가능성
  - Canvas Scaler 또는 Sorting Order 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Canvas Scaler, Anchor, Pivot, RectTransform, Sorting Order를 확인한다.
  - 여러 해상도에서 UI Safe Area와 겹침 여부를 테스트한다.

### BUG-030 - 충돌 판정
- Source: test_ui_overlap_01.png
- Severity: Major
- Confidence: 0.9
- Summary: Character's arm clips through the wall when standing close.
- Root Cause Candidates:
  - Collider 또는 Rigidbody 설정 누락 가능성
  - Layer Collision Matrix 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Collider, Rigidbody, Character Controller 설정을 확인한다.
  - Layer Collision Matrix와 Is Trigger 설정을 점검한다.

### BUG-031 - 렌더링 이상
- Source: test_ui_overlap_01.png
- Severity: Minor
- Confidence: 0.75
- Summary: Flickering textures on the ground in certain lighting conditions.
- Root Cause Candidates:
  - Z-fighting 또는 중복 메시 문제 가능성
  - Shader, Material, Shadow Quality 설정 문제 가능성
- Reproduction Steps:
  - Unity에서 해당 씬을 실행한다.
  - 스크린샷과 동일한 위치로 플레이어를 이동한다.
  - Game View에서 문제 영역을 확인한다.
  - Scene View에서 Collider, Canvas, Camera, NavMesh 상태를 비교한다.
  - 동일 조건에서 문제가 반복 재현되는지 확인한다.
- Fix Suggestions:
  - Material, Shader, Shadow Quality, Z-fighting 여부를 확인한다.
  - 겹친 메시 또는 중복 지형 오브젝트를 제거한다.

## Agent Results
- qaLeadAgent: Vision 분석 결과를 통합하여 31개의 주요 버그 후보를 우선순위화했다.
- visualBugDetectorAgent: 실제 스크린샷 10장을 분석하여 UI, 오브젝트, 미니맵, 렌더링 관련 후보를 감지했다.
- bugClassifierAgent: Vision 결과를 kyucode 표준 분류(UI 오류, 미니맵 불일치, 렌더링 이상, 충돌 판정, 오브젝트 겹침)로 정규화했다.
- reproductionAgent: 각 detectedBug에 대해 Unity 실행, 위치 이동, Game View/Scene View 비교, 반복 재현 확인 절차를 생성했다.
- fixAdvisorAgent: Canvas, Collider, Rigidbody, Minimap Camera, Shader, NavMesh 중심의 수정 방향을 제안했다.
- reportWriterAgent: 정규화된 결과를 result.json, report.md, report.html Workbench 리포트로 변환했다.