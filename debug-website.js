import puppeteer from 'puppeteer';

async function debugWebsite() {
  console.log('🚀 Starting website debugging...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  const page = await browser.newPage();
  
  // Capture console messages
  page.on('console', (msg) => {
    console.log(`🖥️  BROWSER CONSOLE [${msg.type()}]:`, msg.text());
  });
  
  page.on('pageerror', (error) => {
    console.log('❌ PAGE ERROR:', error.message);
  });
  
  try {
    console.log('📍 Navigating to website...');
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle0' });
    
    console.log('📸 Taking initial screenshot...');
    await page.screenshot({ path: 'website-initial.png', fullPage: true });
    
    // Check if news section exists
    console.log('🔍 Looking for news section...');
    const newsSection = await page.$('[data-testid="news-section"], .news-section, #news');
    if (newsSection) {
      console.log('✅ News section found');
    } else {
      console.log('❌ News section not found with standard selectors');
      
      // Look for any section containing "news" text
      const newsSectionByText = await page.$x("//section[contains(., 'News') or contains(., 'news')]");
      if (newsSectionByText.length > 0) {
        console.log('✅ Found news section by text content');
      } else {
        console.log('❌ No news section found by text content either');
      }
    }
    
    // Check API calls
    console.log('🌐 Testing news API directly...');
    const newsApiResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:5000/api/news');
        const data = await response.json();
        return { success: true, data, status: response.status };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    console.log('📡 News API Response:', JSON.stringify(newsApiResponse, null, 2));
    
    // Check what's actually on the page
    console.log('📄 Getting page content structure...');
    const pageStructure = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section, div[class*="section"]'));
      return sections.map(section => ({
        tagName: section.tagName,
        className: section.className,
        id: section.id,
        textContent: section.textContent.substring(0, 100) + '...'
      }));
    });
    
    console.log('🏗️  Page Structure:', JSON.stringify(pageStructure, null, 2));
    
    // Look for news-related elements
    console.log('🔍 Searching for news-related elements...');
    const newsElements = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent.toLowerCase().includes('news') ||
        el.className.toLowerCase().includes('news') ||
        el.id.toLowerCase().includes('news')
      );
      
      return elements.map(el => ({
        tagName: el.tagName,
        className: el.className,
        id: el.id,
        textContent: el.textContent.substring(0, 50) + '...'
      }));
    });
    
    console.log('📰 News-related elements:', JSON.stringify(newsElements, null, 2));
    
    // Check for React component mounting
    console.log('⚛️  Checking React component state...');
    const reactState = await page.evaluate(() => {
      // Look for React root
      const reactRoot = document.querySelector('#root');
      if (reactRoot) {
        return {
          hasReactRoot: true,
          childrenCount: reactRoot.children.length,
          innerHTML: reactRoot.innerHTML.substring(0, 200) + '...'
        };
      }
      return { hasReactRoot: false };
    });
    
    console.log('⚛️  React State:', JSON.stringify(reactState, null, 2));
    
    console.log('✅ Debugging complete! Check website-initial.png for visual inspection.');
    
  } catch (error) {
    console.error('❌ Error during debugging:', error);
  }
  
  // Keep browser open for manual inspection
  console.log('🔍 Browser staying open for manual inspection. Press Ctrl+C to close.');
  
  // Don't close browser automatically
  // await browser.close();
}

debugWebsite().catch(console.error);
