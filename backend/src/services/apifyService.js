const axios = require('axios');
const logger = require('../utils/logger');

const apifyService = {
  // Apify API configuration
  config: {
    baseURL: 'https://api.apify.com/v2',
    token: process.env.APIFY_TOKEN,
    actorId: 'apify~instagram-hashtag-scraper', // Replace with actual actor ID
    timeout: 300000 // 5 minutes
  },

  // Run Instagram hashtag scraper
  async runInstagramScraper(hashtag, options = {}) {
    try {
      logger.info(`Running Instagram scraper for hashtag: ${hashtag}`);
      
      const input = {
        addParentData: false,
        enhanceUserSearchWithFacebookPage: false,
        isUserReelFeedURL: false,
        isUserTaggedFeedURL: false,
        onlyPostsNewerThan: options.onlyPostsNewerThan || "1 week",
        resultsLimit: options.resultsLimit || 180,
        resultsType: "posts",
        search: hashtag,
        searchLimit: options.searchLimit || 1,
        searchType: "hashtag"
      };

      // Start the actor run
      const runResponse = await this.startActorRun(input);
      
      if (!runResponse.success) {
        throw new Error(`Failed to start actor run: ${runResponse.error}`);
      }

      // Wait for the run to complete
      const runId = runResponse.data.id;
      const completedRun = await this.waitForRunCompletion(runId);
      
      if (!completedRun.success) {
        throw new Error(`Actor run failed: ${completedRun.error}`);
      }

      // Get the results
      const results = await this.getRunResults(runId);
      
      return {
        success: true,
        hashtag,
        data: results.data,
        metadata: {
          runId,
          totalPosts: results.data.length,
          executionTime: completedRun.data.finishedAt - completedRun.data.startedAt
        }
      };

    } catch (error) {
      logger.error(`Error running Instagram scraper for ${hashtag}:`, error);
      return {
        success: false,
        hashtag,
        error: error.message
      };
    }
  },

  // Start an actor run
  async startActorRun(input) {
    try {
      const response = await axios.post(
        `${this.config.baseURL}/acts/${this.config.actorId}/runs?token=${this.config.token}`,
        input,
        {
          timeout: this.config.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      logger.error('Error starting actor run:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  },

  // Wait for run completion
  async waitForRunCompletion(runId, maxWaitTime = 300000) { // 5 minutes max
    const startTime = Date.now();
    const pollInterval = 5000; // 5 seconds

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const runStatus = await this.getRunStatus(runId);
        
        if (runStatus.success) {
          const status = runStatus.data.status;
          
          if (status === 'SUCCEEDED') {
            return {
              success: true,
              data: runStatus.data
            };
          } else if (status === 'FAILED' || status === 'ABORTED') {
            return {
              success: false,
              error: `Run ${status.toLowerCase()}: ${runStatus.data.meta?.errorMessage || 'Unknown error'}`
            };
          }
          
          // Still running, wait and poll again
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        } else {
          return runStatus;
        }

      } catch (error) {
        logger.error('Error polling run status:', error);
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }

    return {
      success: false,
      error: 'Run timeout - exceeded maximum wait time'
    };
  },

  // Get run status
  async getRunStatus(runId) {
    try {
      const response = await axios.get(
        `${this.config.baseURL}/acts/${this.config.actorId}/runs/${runId}?token=${this.config.token}`,
        {
          timeout: 10000
        }
      );

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      logger.error('Error getting run status:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  },

  // Get run results from dataset
  async getRunResults(runId) {
    try {
      // First get run info to get dataset ID
      const runInfo = await this.getRunStatus(runId);
      
      if (!runInfo.success) {
        throw new Error(`Failed to get run info: ${runInfo.error}`);
      }

      const datasetId = runInfo.data.defaultDatasetId;
      
      if (!datasetId) {
        throw new Error('No dataset ID found in run info');
      }

      // Get results from dataset
      const response = await axios.get(
        `${this.config.baseURL}/datasets/${datasetId}/items?token=${this.config.token}`,
        {
          timeout: 30000
        }
      );

      return {
        success: true,
        data: response.data || []
      };

    } catch (error) {
      logger.error('Error getting run results:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        data: []
      };
    }
  },

  // Run multiple hashtags in parallel (with rate limiting)
  async runMultipleHashtags(hashtags, options = {}) {
    const results = [];
    const maxConcurrent = options.maxConcurrent || 3;
    const delayBetweenRuns = options.delayBetweenRuns || 2000; // 2 seconds

    logger.info(`Running Instagram scraper for ${hashtags.length} hashtags`);

    // Process hashtags in batches
    for (let i = 0; i < hashtags.length; i += maxConcurrent) {
      const batch = hashtags.slice(i, i + maxConcurrent);
      
      // Run batch in parallel
      const batchPromises = batch.map(hashtag => 
        this.runInstagramScraper(hashtag, options)
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Wait between batches to avoid rate limiting
      if (i + maxConcurrent < hashtags.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenRuns));
      }
    }

    return {
      success: true,
      results,
      summary: {
        totalHashtags: hashtags.length,
        successfulRuns: results.filter(r => r.success).length,
        failedRuns: results.filter(r => !r.success).length,
        totalPosts: results.reduce((sum, r) => sum + (r.data?.length || 0), 0)
      }
    };
  },

  // Extract comments from Instagram posts
  extractComments(posts) {
    const comments = [];
    
    posts.forEach(post => {
      // Extract from latestComments array
      if (post.latestComments && Array.isArray(post.latestComments)) {
        post.latestComments.forEach(comment => {
          comments.push({
            id: comment.id || Math.random().toString(36),
            text: comment.text || comment.comment || '',
            author: comment.author || comment.username || 'anonymous',
            timestamp: comment.timestamp || post.timestamp,
            likes: comment.likes || 0,
            postId: post.shortCode || post.id,
            hashtags: post.hashtags || [],
            postUrl: post.url,
            postCaption: post.caption
          });
        });
      }
      
      // Include the first comment if available
      if (post.firstComment) {
        comments.push({
          id: `first_${post.shortCode || post.id}`,
          text: post.firstComment,
          author: post.ownerUsername || 'anonymous',
          timestamp: post.timestamp,
          likes: 0,
          postId: post.shortCode || post.id,
          hashtags: post.hashtags || [],
          postUrl: post.url,
          postCaption: post.caption,
          isFirstComment: true
        });
      }
    });

    return comments;
  },

  // Mock data for testing (when Apify is not available)
  async getMockInstagramData(hashtag) {
    logger.info(`Getting mock Instagram data for hashtag: ${hashtag}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockPosts = [
      {
        inputUrl: `https://www.instagram.com/explore/tags/${hashtag}`,
        url: `https://www.instagram.com/p/C3TTthZLoQK/`,
        type: "Image",
        shortCode: "C3TTthZLoQK",
        caption: `Amazing insights about ${hashtag}! This is really helping my business grow. #${hashtag} #business #growth #startup`,
        hashtags: [hashtag, 'business', 'growth', 'startup'],
        mentions: [],
        commentsCount: 45,
        firstComment: "Excellent post! Really helpful insights.",
        latestComments: [
          {
            id: 'comment_1',
            text: 'Great content! Really helpful for my startup.',
            author: 'startup_owner',
            likes: 5,
            timestamp: new Date().toISOString()
          },
          {
            id: 'comment_2',
            text: 'Thanks for sharing these insights!',
            author: 'entrepreneur_123',
            likes: 3,
            timestamp: new Date().toISOString()
          }
        ],
        dimensionsHeight: 720,
        dimensionsWidth: 1080,
        displayUrl: "https://example.com/image1.jpg",
        images: [],
        alt: "Business growth insights",
        likesCount: 1250,
        timestamp: new Date().toISOString(),
        childPosts: [],
        ownerFullName: "Business Guru",
        ownerUsername: "business_guru",
        ownerId: "123456789",
        isSponsored: false
      },
      {
        inputUrl: `https://www.instagram.com/explore/tags/${hashtag}`,
        url: `https://www.instagram.com/p/C3TTthZLoQK2/`,
        type: "Image",
        shortCode: "C3TTthZLoQK2",
        caption: `Learning so much from the ${hashtag} community. Growth is happening! #${hashtag} #entrepreneur #success #marketing`,
        hashtags: [hashtag, 'entrepreneur', 'success', 'marketing'],
        mentions: [],
        commentsCount: 32,
        firstComment: "Inspiring content! Keep it up.",
        latestComments: [
          {
            id: 'comment_3',
            text: 'This is exactly what I needed to read today.',
            author: 'growth_seeker',
            likes: 8,
            timestamp: new Date().toISOString()
          }
        ],
        dimensionsHeight: 720,
        dimensionsWidth: 1080,
        displayUrl: "https://example.com/image2.jpg",
        images: [],
        alt: "Entrepreneurial growth",
        likesCount: 890,
        timestamp: new Date().toISOString(),
        childPosts: [],
        ownerFullName: "Growth Expert",
        ownerUsername: "growth_expert",
        ownerId: "987654321",
        isSponsored: false
      }
    ];

    return {
      success: true,
      hashtag,
      data: mockPosts,
      metadata: {
        runId: 'mock_run_123',
        totalPosts: mockPosts.length,
        executionTime: 1000
      }
    };
  }
};

module.exports = apifyService;
