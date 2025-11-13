import puppeteer from 'puppeteer';

async function checkNewsDisplay() {
  console.log('🔍 Checking news display after categorization fix...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  const page = await browser.newPage();
  
  // Capture console messages
  page.on('console', (msg) => {
    if (msg.text().includes('📰')) {
      console.log(`🖥️  NEWS:`, msg.text());
    }
  });
  
  try {
    console.log('📍 Navigating to website...');
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle0' });
    
    // Wait for news section to load
    await page.waitForSelector('#news', { timeout: 10000 });
    
    // Scroll to news section
    await page.evaluate(() => {
      document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Wait a moment for scrolling
    await page.waitForTimeout(2000);
    
    // Take screenshot of news section
    const newsSection = await page.$('#news');
    if (newsSection) {
      await newsSection.screenshot({ path: 'news-section.png' });
      console.log('📸 News section screenshot saved as news-section.png');
    }
    
    // Check tabs and their content
    console.log('🔍 Checking news tabs...');
    
    // Check Places Visited tab (should be active by default)
    const placesVisitedContent = await page.evaluate(() => {
      const tabs = document.querySelectorAll('[role="tab"]');
      const placesTab = Array.from(tabs).find(tab => tab.textContent?.includes('Places Visited'));
      return {
        tabExists: !!placesTab,
        isActive: placesTab?.getAttribute('aria-selected') === 'true',
        newsCount: document.querySelectorAll('#news .grid > div').length
      };
    });
    
    console.log('📍 Places Visited tab:', placesVisitedContent);
    
    // Click on Certificates Received tab
    await page.evaluate(() => {
      const tabs = document.querySelectorAll('[role="tab"]');
      const certTab = Array.from(tabs).find(tab => tab.textContent?.includes('Certificates Received'));
      if (certTab) certTab.click();
    });
    
    await page.waitForTimeout(1000);
    
    const certificatesContent = await page.evaluate(() => {
      return {
        newsCount: document.querySelectorAll('#news .grid > div').length
      };
    });
    
    console.log('🏆 Certificates Received tab:', certificatesContent);
    
    // Click on Certificates Awarded tab
    await page.evaluate(() => {
      const tabs = document.querySelectorAll('[role="tab"]');
      const awardedTab = Array.from(tabs).find(tab => tab.textContent?.includes('Certificates Awarded'));
      if (awardedTab) awardedTab.click();
    });
    
    await page.waitForTimeout(1000);
    
    const awardedContent = await page.evaluate(() => {
      return {
        newsCount: document.querySelectorAll('#news .grid > div').length
      };
    });
    
    console.log('🎖️ Certificates Awarded tab:', awardedContent);
    
    console.log('✅ News display check complete!');
    
  } catch (error) {
    console.error('❌ Error checking news display:', error);
  }
  
  // Keep browser open for inspection
  console.log('🔍 Browser staying open for inspection. Press Ctrl+C to close.');
}

checkNewsDisplay().catch(console.error);
