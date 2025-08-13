const axios = require('axios');
const logger = require('../utils/logger');

// Mock database for MVP
const socialDataDB = new Map();
const platformConfigDB = new Map();

const socialService = {
  // Collect social data from platforms
  async collectSocialData(projectId, platforms, forceRefresh = false) {
    try {
      logger.info(`Starting social data collection for project: ${projectId}, platforms: ${platforms.join(', ')}`);
      
      const results = {};
      
      for (const platform of platforms) {
        try {
          const data = await this.collectFromPlatform(projectId, platform, forceRefresh);
          results[platform] = {
            success: true,
            data: data,
            timestamp: Date.now()
          };
        } catch (error) {
          logger.error(`Error collecting from ${platform}:`, error);
          results[platform] = {
            success: false,
            error: error.message,
            timestamp: Date.now()
          };
        }
      }
      
      // Store collected data
      socialDataDB.set(projectId, {
        ...socialDataDB.get(projectId),
        ...results,
        lastUpdated: Date.now()
      });
      
      return results;
    } catch (error) {
      logger.error('Error collecting social data:', error);
      throw error;
    }
  },

  // Collect data from specific platform
  async collectFromPlatform(projectId, platform, forceRefresh) {
    const config = platformConfigDB.get(`${projectId}_${platform}`);
    
    if (!config && !forceRefresh) {
      throw new Error(`Platform ${platform} not configured for project ${projectId}`);
    }
    
    switch (platform) {
      case 'twitter':
        return await this.collectTwitterData(projectId, config);
      case 'linkedin':
        return await this.collectLinkedInData(projectId, config);
      case 'instagram':
        return await this.collectInstagramData(projectId, config);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  },

  // Mock Twitter data collection
  async collectTwitterData(projectId, config) {
    // In real implementation, this would use Twitter API
    const mockData = {
      followers: Math.floor(Math.random() * 10000) + 1000,
      tweets: Math.floor(Math.random() * 1000) + 100,
      mentions: Math.floor(Math.random() * 500) + 50,
      retweets: Math.floor(Math.random() * 200) + 20,
      likes: Math.floor(Math.random() * 1000) + 100,
      sentiment: {
        positive: Math.floor(Math.random() * 60) + 20,
        neutral: Math.floor(Math.random() * 30) + 10,
        negative: Math.floor(Math.random() * 20) + 5
      },
      trending_hashtags: ['#growth', '#startup', '#innovation'],
      recent_posts: [
        {
          id: '1',
          text: 'Great progress on our project! #growth #startup',
          likes: 45,
          retweets: 12,
          sentiment: 'positive'
        }
      ]
    };
    
    return mockData;
  },

  // Mock LinkedIn data collection
  async collectLinkedInData(projectId, config) {
    // In real implementation, this would use LinkedIn API
    const mockData = {
      followers: Math.floor(Math.random() * 5000) + 500,
      posts: Math.floor(Math.random() * 200) + 20,
      connections: Math.floor(Math.random() * 1000) + 100,
      engagement_rate: (Math.random() * 0.1 + 0.02).toFixed(3),
      impressions: Math.floor(Math.random() * 50000) + 5000,
      clicks: Math.floor(Math.random() * 1000) + 100,
      recent_posts: [
        {
          id: '1',
          text: 'Excited to share our latest milestone!',
          likes: 23,
          comments: 5,
          shares: 8
        }
      ]
    };
    
    return mockData;
  },

  // Mock Instagram data collection
  async collectInstagramData(projectId, config) {
    // In real implementation, this would use Instagram API
    const mockData = {
      followers: Math.floor(Math.random() * 15000) + 2000,
      posts: Math.floor(Math.random() * 300) + 50,
      likes: Math.floor(Math.random() * 5000) + 500,
      comments: Math.floor(Math.random() * 1000) + 100,
      engagement_rate: (Math.random() * 0.15 + 0.03).toFixed(3),
      stories_views: Math.floor(Math.random() * 2000) + 200,
      recent_posts: [
        {
          id: '1',
          caption: 'Behind the scenes of our growth journey',
          likes: 156,
          comments: 23,
          views: 1200
        }
      ]
    };
    
    return mockData;
  },

  // Configure platform credentials
  async configurePlatform(projectId, platform, credentials) {
    try {
      const configKey = `${projectId}_${platform}`;
      
      // Validate credentials (mock validation)
      if (!credentials.apiKey || !credentials.apiSecret) {
        throw new Error('Invalid credentials provided');
      }
      
      platformConfigDB.set(configKey, {
        projectId,
        platform,
        credentials,
        configuredAt: Date.now()
      });
      
      logger.info(`Platform ${platform} configured for project: ${projectId}`);
      
      return {
        success: true,
        platform,
        configuredAt: Date.now()
      };
    } catch (error) {
      logger.error('Error configuring platform:', error);
      throw error;
    }
  },

  // Get collection status
  async getCollectionStatus(projectId) {
    try {
      const data = socialDataDB.get(projectId);
      
      if (!data) {
        return {
          projectId,
          status: 'no_data',
          lastUpdated: null,
          platforms: []
        };
      }
      
      const platforms = Object.keys(data).filter(key => key !== 'lastUpdated');
      
      return {
        projectId,
        status: 'has_data',
        lastUpdated: data.lastUpdated,
        platforms: platforms.map(platform => ({
          platform,
          success: data[platform].success,
          timestamp: data[platform].timestamp
        }))
      };
    } catch (error) {
      logger.error('Error getting collection status:', error);
      throw error;
    }
  },

  // Get social data
  async getSocialData(projectId, platform = null, period = '7d') {
    try {
      const data = socialDataDB.get(projectId);
      
      if (!data) {
        return null;
      }
      
      if (platform) {
        return data[platform] || null;
      }
      
      return data;
    } catch (error) {
      logger.error('Error getting social data:', error);
      throw error;
    }
  },

  // Clear social data
  async clearSocialData(projectId) {
    try {
      socialDataDB.delete(projectId);
      
      // Also clear platform configs
      const keysToDelete = [];
      for (const [key, value] of platformConfigDB.entries()) {
        if (value.projectId === projectId) {
          keysToDelete.push(key);
        }
      }
      
      keysToDelete.forEach(key => platformConfigDB.delete(key));
      
      logger.info(`Social data cleared for project: ${projectId}`);
      
      return { success: true };
    } catch (error) {
      logger.error('Error clearing social data:', error);
      throw error;
    }
  }
};

module.exports = socialService;
