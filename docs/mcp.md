# MCP in kyucode

MCP acts as a connecting structure in kyucode, linking the various elements of the project:

## Connections:

- **File System:** data/screenshots
- **External API:** OpenAI Vision API
- **Analysis Pipeline:** vision → normalize → dashboard
- **Output Files:** output/result.json, output/report.md, output/report_final.html

## List of MCP Tools:

- **list_screenshots:** Lists the screenshots in the data folder.
- **get_project_status:** Returns the current status of the project.
- **read_latest_report:** Reads the latest report.
- **list_output_files:** Lists output files in the output directory.
- **run_vision_analysis:** Runs the full vision analysis pipeline.

## Usage:

To run the MCP scripts, use:
```
npm run mcp
```

### Examples:
- List screenshots:
```
node src/mcp/server.js list_screenshots
```
- Get project status:
```
node src/mcp/server.js get_project_status
```
- Read the latest report:
```
node src/mcp/server.js read_latest_report
```
- List output files:
```
node src/mcp/server.js list_output_files
```
