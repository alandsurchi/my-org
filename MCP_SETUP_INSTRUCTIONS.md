# MCP Browser Control Setup Instructions

## What is MCP?
Model Context Protocol (MCP) allows Claude to use external tools and servers. This browser control server gives Claude the ability to:
- Navigate websites
- Click elements
- Type text
- Take screenshots
- Execute JavaScript
- Fill forms
- Debug web applications

## Setup Steps:

### 1. Install Dependencies (In Progress)
The dependencies are currently installing. Once complete, you'll have:
- `@modelcontextprotocol/sdk` - Core MCP functionality
- `puppeteer` - Browser automation library

### 2. Configure Claude Desktop
Copy the configuration from `claude_desktop_config.json` to your Claude Desktop configuration:

**Windows Location:** `%APPDATA%\Claude\claude_desktop_config.json`

**Configuration:**
```json
{
  "mcpServers": {
    "browser-controller": {
      "command": "node",
      "args": ["c:\\Users\\aland\\Desktop\\test-2\\my-org\\mcp-server\\index.js"],
      "env": {}
    }
  }
}
```

### 3. Test the Setup
1. Restart Claude Desktop after adding the configuration
2. Look for the 🔌 plugin icon in Claude Desktop 
3. You should see "browser-controller" listed as an available MCP server

### 4. Using Browser Control
Once configured, you can ask Claude to:
- "Navigate to http://localhost:5173 and take a screenshot"
- "Click the news tab and check what's displayed"
- "Fill out the news form with test data"
- "Check the browser console for any errors"

## Benefits for Debugging:
- **Direct Testing:** Claude can interact with your website directly
- **Visual Feedback:** Screenshots show exactly what's happening
- **Console Access:** Monitor JavaScript errors and logs
- **Form Testing:** Automatically test form submissions
- **Real User Simulation:** Test how actual users would interact with your site

## Next Steps:
1. Wait for npm install to complete
2. Copy the configuration to Claude Desktop
3. Restart Claude Desktop
4. Test browser control capabilities
5. Use it to debug the news display issue

This will give Claude the power to directly interact with your website, making debugging much faster and more effective!
