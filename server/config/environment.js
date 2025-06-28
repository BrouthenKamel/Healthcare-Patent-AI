// Load environment variables
require('dotenv').config();

const config = {
  port: process.env.PORT || 3001,
  groqApiKey: process.env.GROQ_API_KEY,
  scrapingdogApiKey: process.env.SCRAPINGDOG_API_KEY,
  nodeEnv: process.env.NODE_ENV || 'development'
};

// Validate required environment variables
function validateEnvironment() {
  const requiredVars = [
    { name: 'GROQ_API_KEY', value: process.env.GROQ_API_KEY },
    { name: 'SCRAPINGDOG_API_KEY', value: process.env.SCRAPINGDOG_API_KEY }
  ];
  
  const missing = requiredVars.filter(({ value }) => !value || value.trim() === '');
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing or empty environment variables: ${missing.map(v => v.name).join(', ')}`);
    console.warn('Some features may not work properly. Please check your .env file.');
    return false;
  }
  
  console.log('✅ Environment variables validated successfully');
  return true;
}

module.exports = { config, validateEnvironment };