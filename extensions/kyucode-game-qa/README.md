# kyucode Game QA Workbench Extension

## 목적
이 Extension의 목적은 Web UI, MCP tools, Skill, Vision pipeline을 하나로 묶는 것입니다. 

## 기능
- Pi Extension으로서 Screenshot QA 분석 기능을 확장합니다.

## 실행 방법
1. `npm run web`로 Web UI 시작
2. `npm run mcp`로 MCP 서버 시작
3. Vision 분석 실행: `node src/mcp/server.js run_vision_analysis`

## Extension 활용
이 Extension은 필수 요구사항 중 Extension 활용을 만족합니다. Web UI와 MCP 서버를 통합 관리합니다.