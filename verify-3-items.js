import puppeteer from 'puppeteer';

async function checkUpdatedSections() {
  console.log('📸 Taking screenshot of updated sections...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
    
    // Scroll to news section
    await page.evaluate(() => {
      document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);
    
    // Take screenshot of news section
    const newsSection = await page.$('#news');
    if (newsSection) {
      await newsSection.screenshot({ path: 'news-section-3-items.png' });
      console.log('📸 News section screenshot saved');
    }
    
    // Scroll to projects section
    await page.evaluate(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);
    
    // Take screenshot of projects section
    const projectsSection = await page.$('#projects');
    if (projectsSection) {
      await projectsSection.screenshot({ path: 'projects-section-3-items.png' });
      console.log('📸 Projects section screenshot saved');
    }
    
    // Count items in news section
    const newsItemCount = await page.evaluate(() => {
      const newsCards = document.querySelectorAll('#news .grid > div');
      return newsCards.length;
    });
    
    // Count items in projects section
    const projectItemCount = await page.evaluate(() => {
      const projectCards = document.querySelectorAll('#projects .grid > div');
      return projectCards.length;
    });
    
    console.log(`📰 News items displayed: ${newsItemCount}`);
    console.log(`🚀 Project items displayed: ${projectItemCount}`);
    
    console.log('✅ Update verification complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  await browser.close();
}

checkUpdatedSections().catch(console.error);
