import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  groqApiKey: process.env.GROQ_API_KEY,
  scrapingdogApiKey: process.env.SCRAPINGDOG_API_KEY,
  nodeEnv: process.env.NODE_ENV || 'development'
};

// Validate required environment variables
export function validateEnvironment() {
  const requiredVars = [
    { name: 'GROQ_API_KEY', value: process.env.GROQ_API_KEY },
    { name: 'SCRAPINGDOG_API_KEY', value: process.env.SCRAPINGDOG_API_KEY }
  ];
  
  const missing = requiredVars.filter(({ value }) => !value || value.trim() === '');
  
  if (missing.length > 0) {
    console.error(`❌ Missing or empty required environment variables: ${missing.map(v => v.name).join(', ')}`);
    console.error('Please check your .env file and ensure these variables are set with valid values.');
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated successfully');
}