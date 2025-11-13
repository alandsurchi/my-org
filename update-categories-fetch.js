import fetch from 'node-fetch';

// Update news items with proper categories
async function updateNewsCategories() {
  try {
    console.log('🔍 Fetching news items...');
    // Get all news
    const response = await fetch('http://localhost:5000/api/news');
    const newsItems = await response.json();
    
    console.log('Found', newsItems.length, 'news items to categorize');
    
    for (const item of newsItems) {
      let category = 'placesVisited'; // default category
      
      // Categorize based on content and title
      const title = item.title.toLowerCase();
      const content = item.content.toLowerCase();
      
      if (title.includes('certificate') || content.includes('certificate') || 
          title.includes('appreciation') || content.includes('appreciation')) {
        category = 'certificatesReceived';
      } else if (title.includes('visit') || content.includes('visit') || 
                 title.includes('delegation') || content.includes('delegation')) {
        category = 'placesVisited';
      } else if (title.includes('volunteer') || content.includes('volunteer') ||
                 title.includes('thank') || content.includes('thank')) {
        category = 'certificatesAwarded';
      }
      
      console.log(`📝 Categorizing "${item.title}" as: ${category}`);
      
      // Update the news item
      const updateResponse = await fetch(`http://localhost:5000/api/news/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: item.title,
          content: item.content,
          category: category,
          imageUrl: item.imageUrl
        })
      });
      
      if (updateResponse.ok) {
        console.log(`✅ Updated "${item.title}" with category: ${category}`);
      } else {
        console.log(`❌ Failed to update "${item.title}"`);
      }
    }
    
    console.log('🎉 All news items categorized!');
    
  } catch (error) {
    console.error('❌ Error updating categories:', error);
  }
}

updateNewsCategories();
