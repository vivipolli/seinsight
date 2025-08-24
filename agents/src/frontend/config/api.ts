// API Configuration for Eliza Agent
export const API_CONFIG = {
  // Development - local Eliza agent
  development: {
    elizaosUrl: 'http://localhost:3000'
  },
  // Production - Railway deployed Eliza agent
  production: {
    elizaosUrl: 'https://sei-agents-production.up.railway.app'
  }
};

// Get current environment
const isProduction = process.env.NODE_ENV === 'production';

// Export the appropriate configuration
export const ELIZA_API_URL = isProduction 
  ? API_CONFIG.production.elizaosUrl 
  : API_CONFIG.development.elizaosUrl;

console.log('🔧 Eliza API URL:', ELIZA_API_URL);
