/**
 * Generate a chat title from a message
 * @param {string} text - The user's message
 * @returns {string} Generated title
 */
export const generateChatTitle = (text) => {
  if (!text || text.trim() === '') return 'New Chat';
  
  // Clean the text
  let cleanText = text.trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' '); // Remove extra spaces
  
  // Split into words and take first 5
  const words = cleanText.split(' ');
  const titleWords = words.slice(0, 5);
  
  if (titleWords.length === 0) return 'New Chat';
  
  // Join and capitalize
  let title = titleWords.join(' ');
  title = title.charAt(0).toUpperCase() + title.slice(1);
  
  // Add ellipsis if truncated
  if (words.length > 5) {
    title += '...';
  }
  
  // Limit length
  if (title.length > 50) {
    title = title.substring(0, 47) + '...';
  }
  
  return title;
};