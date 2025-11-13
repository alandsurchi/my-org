import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import puppeteer from 'puppeteer';

class BrowserMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "browser-controller",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    
    this.browser = null;
    this.page = null;
    this.consoleMessages = [];
    this.setupTools();
  }

  setupTools() {
    // List available tools
    this.server.setRequestHandler('tools/list', async () => {
      return {
        tools: [
          {
            name: 'navigate',
            description: 'Navigate to a URL',
            inputSchema: {
              type: 'object',
              properties: {
                url: { type: 'string', description: 'URL to navigate to' }
              },
              required: ['url']
            }
          },
          {
            name: 'click',
            description: 'Click an element by selector',
            inputSchema: {
              type: 'object',
              properties: {
                selector: { type: 'string', description: 'CSS selector to click' }
              },
              required: ['selector']
            }
          },
          {
            name: 'type',
            description: 'Type text into an element',
            inputSchema: {
              type: 'object',
              properties: {
                selector: { type: 'string', description: 'CSS selector to type into' },
                text: { type: 'string', description: 'Text to type' }
              },
              required: ['selector', 'text']
            }
          },
          {
            name: 'getContent',
            description: 'Get page content',
            inputSchema: { type: 'object', properties: {} }
          },
          {
            name: 'screenshot',
            description: 'Take a screenshot',
            inputSchema: { type: 'object', properties: {} }
          },
          {
            name: 'evaluateJS',
            description: 'Execute JavaScript on the page',
            inputSchema: {
              type: 'object',
              properties: {
                code: { type: 'string', description: 'JavaScript code to execute' }
              },
              required: ['code']
            }
          },
          {
            name: 'fillForm',
            description: 'Fill out a form with data',
            inputSchema: {
              type: 'object',
              properties: {
                formData: { 
                  type: 'object', 
                  description: 'Object with field selectors as keys and values to fill' 
                }
              },
              required: ['formData']
            }
          },
          {
            name: 'waitForElement',
            description: 'Wait for an element to appear',
            inputSchema: {
              type: 'object',
              properties: {
                selector: { type: 'string', description: 'CSS selector to wait for' }
              },
              required: ['selector']
            }
          },
          {
            name: 'getConsoleMessages',
            description: 'Get console messages from the page',
            inputSchema: { type: 'object', properties: {} }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        switch (name) {
          case 'navigate':
            return await this.navigate(args.url);
          case 'click':
            return await this.click(args.selector);
          case 'type':
            return await this.type(args.selector, args.text);
          case 'getContent':
            return await this.getContent();
          case 'screenshot':
            return await this.screenshot();
          case 'evaluateJS':
            return await this.evaluateJS(args.code);
          case 'fillForm':
            return await this.fillForm(args.formData);
          case 'waitForElement':
            return await this.waitForElement(args.selector);
          case 'getConsoleMessages':
            return await this.getConsoleMessages();
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: `Error executing ${name}: ${error.message}` 
          }],
          isError: true
        };
      }
    });
  }

  async ensureBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1280, height: 720 }
      });
      this.page = await this.browser.newPage();
      
      // Capture console messages
      this.page.on('console', (msg) => {
        this.consoleMessages.push({
          type: msg.type(),
          text: msg.text(),
          timestamp: new Date().toISOString()
        });
      });
    }
  }

  async navigate(url) {
    await this.ensureBrowser();
    await this.page.goto(url, { waitUntil: 'networkidle0' });
    return {
      content: [{ 
        type: 'text', 
        text: `Navigated to: ${url}` 
      }]
    };
  }

  async click(selector) {
    await this.ensureBrowser();
    await this.page.click(selector);
    return {
      content: [{ 
        type: 'text', 
        text: `Clicked element: ${selector}` 
      }]
    };
  }

  async type(selector, text) {
    await this.ensureBrowser();
    await this.page.type(selector, text);
    return {
      content: [{ 
        type: 'text', 
        text: `Typed "${text}" into: ${selector}` 
      }]
    };
  }

  async getContent() {
    await this.ensureBrowser();
    const content = await this.page.content();
    return {
      content: [{ 
        type: 'text', 
        text: content 
      }]
    };
  }

  async screenshot() {
    await this.ensureBrowser();
    const screenshot = await this.page.screenshot({ 
      encoding: 'base64',
      fullPage: true 
    });
    return {
      content: [{ 
        type: 'image', 
        data: screenshot,
        mimeType: 'image/png'
      }]
    };
  }

  async evaluateJS(code) {
    await this.ensureBrowser();
    const result = await this.page.evaluate(code);
    return {
      content: [{ 
        type: 'text', 
        text: JSON.stringify(result, null, 2) 
      }]
    };
  }

  async fillForm(formData) {
    await this.ensureBrowser();
    for (const [selector, value] of Object.entries(formData)) {
      await this.page.type(selector, value);
    }
    return {
      content: [{ 
        type: 'text', 
        text: `Filled form with: ${JSON.stringify(formData)}` 
      }]
    };
  }

  async waitForElement(selector) {
    await this.ensureBrowser();
    await this.page.waitForSelector(selector);
    return {
      content: [{ 
        type: 'text', 
        text: `Element appeared: ${selector}` 
      }]
    };
  }

  async getConsoleMessages() {
    return {
      content: [{ 
        type: 'text', 
        text: JSON.stringify(this.consoleMessages, null, 2) 
      }]
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  async stop() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Start the server
const mcpServer = new BrowserMCPServer();
mcpServer.start().catch(console.error);

// Handle cleanup
process.on('SIGINT', async () => {
  await mcpServer.stop();
  process.exit(0);
});
