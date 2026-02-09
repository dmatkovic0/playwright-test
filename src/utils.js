// Generate a unique identifier (GUID)
export function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Generate a short unique identifier (for names)
export function generateShortID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Generate a random date within the last N days (default: 30 days)
// Returns date in MM/DD/YYYY format
export function generateRandomPastDate(daysBack = 30) {
  const today = new Date();
  const randomDaysAgo = Math.floor(Math.random() * daysBack);
  const randomDate = new Date(today);
  randomDate.setDate(today.getDate() - randomDaysAgo);

  const month = String(randomDate.getMonth() + 1).padStart(2, '0');
  const day = String(randomDate.getDate()).padStart(2, '0');
  const year = randomDate.getFullYear();

  return `${month}/${day}/${year}`;
}