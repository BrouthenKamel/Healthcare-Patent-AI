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
  const requiredVars = ['GROQ_API_KEY', 'SCRAPINGDOG_API_KEY'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated successfully');
}