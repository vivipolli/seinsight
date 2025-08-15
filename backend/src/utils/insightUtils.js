const logger = require('./logger');

// Generate unique workflow ID
const generateWorkflowId = () => {
  return `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Extract all comments from social media posts
const extractAllComments = (socialData, apifyService) => {
  const allComments = [];
  
  socialData.forEach(post => {
    // Extract comments using Apify service method
    const postComments = apifyService.extractComments([post]);
    allComments.push(...postComments);
  });
  
  logger.info(`Extracted ${allComments.length} comments from ${socialData.length} posts`);
  return allComments;
};

// Identify opportunities based on analysis
const identifyOpportunities = (insights) => {
  const opportunities = [];
  
  // High engagement opportunities
  if (insights.engagement.averageEngagement > 10) {
    opportunities.push({
      type: 'engagement',
      description: 'High engagement detected - consider creating more similar content',
      priority: 'high',
      confidence: 0.8
    });
  }
  
  // Trending topics
  if (insights.keyTopics.length > 0) {
    opportunities.push({
      type: 'content',
      description: `Focus on "${insights.keyTopics[0].topic}" - trending topic in your niche`,
      priority: 'medium',
      confidence: 0.7
    });
  }
  
  // Positive sentiment opportunities
  if (insights.sentiment.overall === 'positive') {
    opportunities.push({
      type: 'branding',
      description: 'Positive sentiment detected - good time for brand promotion',
      priority: 'medium',
      confidence: 0.6
    });
  }
  
  return opportunities;
};

// Generate actionable items
const generateActionItems = (insights, hashtags) => {
  const actionItems = [];
  
  // Content creation
  actionItems.push({
    type: 'content',
    action: 'Create content around trending topics',
    description: `Focus on: ${insights.keyTopics.slice(0, 3).map(t => t.topic).join(', ')}`,
    priority: 'high',
    timeline: '1 week'
  });
  
  // Hashtag optimization
  actionItems.push({
    type: 'hashtag',
    action: 'Optimize hashtag strategy',
    description: `Use these hashtags: ${hashtags.slice(0, 5).join(', ')}`,
    priority: 'medium',
    timeline: 'immediate'
  });
  
  // Engagement strategy
  if (insights.recommendations.length > 0) {
    actionItems.push({
      type: 'engagement',
      action: 'Improve engagement strategy',
      description: insights.recommendations[0].suggestion,
      priority: 'medium',
      timeline: '2 weeks'
    });
  }
  
  return actionItems;
};

// Analyze hashtag performance
const analyzeHashtagPerformance = (results) => {
  const performance = {};
  
  results.forEach(result => {
    if (result.success) {
      performance[result.hashtag] = {
        posts: result.data?.length || 0,
        engagement: calculateHashtagEngagement(result.data),
        success: true
      };
    } else {
      performance[result.hashtag] = {
        posts: 0,
        engagement: 0,
        success: false,
        error: result.error
      };
    }
  });
  
  return performance;
};

// Calculate engagement for a hashtag
const calculateHashtagEngagement = (posts) => {
  if (!posts || posts.length === 0) return 0;
  
  const totalEngagement = posts.reduce((sum, post) => {
    const likes = post.likesCount || 0;
    const comments = post.commentsCount || 0;
    return sum + likes + comments;
  }, 0);
  
  return totalEngagement / posts.length;
};

// Estimate reach based on posts collected
const estimateReach = (totalPosts) => {
  // Rough estimation: each post reaches ~1000 people on average
  return totalPosts * 1000;
};

// Generate final insights combining all data
const generateFinalInsights = (data) => {
  const {
    businessReport,
    hashtagResult,
    socialDataResult,
    analysisResult,
    workflowId,
    executionTime
  } = data;
  
  return {
    workflowId,
    timestamp: new Date().toISOString(),
    executionTime,
    
    // Business Report Analysis
    businessReport: {
      summary: hashtagResult.analysis.reportSummary,
      keyThemes: hashtagResult.analysis.reportSummary.keyThemes,
      sentiment: hashtagResult.analysis.reportSummary.sentiment
    },
    
    // Hashtag Analysis
    hashtags: {
      generated: hashtagResult.hashtags,
      reasoning: hashtagResult.analysis.hashtagReasoning,
      confidence: hashtagResult.analysis.confidence
    },
    
    // Social Media Analysis
    socialMedia: {
      postsCollected: socialDataResult.summary.totalPosts,
      commentsAnalyzed: analysisResult.insights.sentiment.positive + 
                        analysisResult.insights.sentiment.negative + 
                        analysisResult.insights.sentiment.neutral,
      engagement: analysisResult.insights.engagement,
      topTopics: analysisResult.insights.keyTopics.slice(0, 5)
    },
    
    // Sentiment Analysis
    sentiment: {
      overall: analysisResult.insights.sentiment.overall,
      breakdown: analysisResult.insights.sentiment,
      trends: analysisResult.insights.trends
    },
    
    // Key Insights
    insights: {
      summary: analysisResult.summary,
      recommendations: analysisResult.insights.recommendations,
      trends: analysisResult.insights.trends,
      opportunities: identifyOpportunities(analysisResult.insights)
    },
    
    // Action Items
    actionItems: generateActionItems(analysisResult.insights, hashtagResult.hashtags),
    
    // Performance Metrics
    performance: {
      hashtagPerformance: analyzeHashtagPerformance(socialDataResult.results),
      engagementScore: analysisResult.insights.engagement.averageEngagement,
      reachEstimate: estimateReach(socialDataResult.summary.totalPosts)
    }
  };
};

module.exports = {
  generateWorkflowId,
  extractAllComments,
  identifyOpportunities,
  generateActionItems,
  analyzeHashtagPerformance,
  calculateHashtagEngagement,
  estimateReach,
  generateFinalInsights
};
