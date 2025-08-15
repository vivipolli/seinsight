const logger = require('../utils/logger');

// Mock AI service for MVP
const aiService = {
  // Generate hashtags from user's weekly business report
  async generateHashtagsFromReport(businessReport) {
    try {
      logger.info('Generating hashtags from business report');
      
      // Mock AI analysis - in production, this would call OpenAI/GPT
      const mockHashtags = this.analyzeReportContent(businessReport);
      
      return {
        success: true,
        hashtags: mockHashtags,
        analysis: {
          reportSummary: this.summarizeReport(businessReport),
          hashtagReasoning: this.explainHashtagSelection(mockHashtags),
          confidence: 0.85
        }
      };
    } catch (error) {
      logger.error('Error generating hashtags from report:', error);
      throw new Error('Failed to generate hashtags from report');
    }
  },

  // Analyze report content to extract relevant hashtags
  analyzeReportContent(report) {
    const hashtags = [];
    const content = report.toLowerCase();
    
    // Business growth related
    if (content.includes('crescimento') || content.includes('growth')) {
      hashtags.push('businessgrowth', 'growth', 'scaling');
    }
    
    if (content.includes('startup') || content.includes('empreendedor')) {
      hashtags.push('startup', 'entrepreneur', 'startuplife');
    }
    
    if (content.includes('marketing') || content.includes('vendas')) {
      hashtags.push('marketing', 'digitalmarketing', 'socialmediamarketing');
    }
    
    if (content.includes('tecnologia') || content.includes('tech')) {
      hashtags.push('tech', 'innovation', 'saas');
    }
    
    if (content.includes('problema') || content.includes('desafio')) {
      hashtags.push('businesschallenge', 'problemsolving', 'growthhacking');
    }
    
    if (content.includes('tendência') || content.includes('tendencia')) {
      hashtags.push('trending', 'innovation', 'futureofbusiness');
    }
    
    // Add some general business hashtags
    hashtags.push('business', 'success', 'entrepreneurship');
    
    // Remove duplicates and limit to 10
    return [...new Set(hashtags)].slice(0, 10);
  },

  // Summarize the business report
  summarizeReport(report) {
    const words = report.split(' ').length;
    const sentences = report.split(/[.!?]+/).length;
    
    return {
      wordCount: words,
      sentenceCount: sentences,
      keyThemes: this.extractKeyThemes(report),
      sentiment: this.analyzeSentiment(report)
    };
  },

  // Extract key themes from report
  extractKeyThemes(report) {
    const themes = [];
    const content = report.toLowerCase();
    
    if (content.includes('crescimento') || content.includes('growth')) themes.push('Growth');
    if (content.includes('problema') || content.includes('challenge')) themes.push('Challenges');
    if (content.includes('marketing') || content.includes('vendas')) themes.push('Marketing');
    if (content.includes('tecnologia') || content.includes('tech')) themes.push('Technology');
    if (content.includes('tendência') || content.includes('trend')) themes.push('Trends');
    
    return themes;
  },

  // Analyze sentiment of report
  analyzeSentiment(report) {
    const positiveWords = ['crescimento', 'sucesso', 'positivo', 'melhor', 'ótimo', 'excelente'];
    const negativeWords = ['problema', 'desafio', 'difícil', 'negativo', 'pior', 'falha'];
    
    const content = report.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (content.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (content.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  },

  // Explain hashtag selection
  explainHashtagSelection(hashtags) {
    const explanations = {
      'businessgrowth': 'Relevant for businesses focusing on growth strategies',
      'startup': 'Appropriate for startup-related challenges and opportunities',
      'marketing': 'Essential for marketing and sales discussions',
      'tech': 'Suitable for technology and innovation topics',
      'growthhacking': 'Perfect for rapid growth and optimization strategies',
      'entrepreneur': 'Relevant for entrepreneurial challenges and insights',
      'innovation': 'Appropriate for innovative business approaches',
      'trending': 'Suitable for trend analysis and market insights'
    };
    
    return hashtags.map(hashtag => ({
      hashtag,
      reasoning: explanations[hashtag] || 'General business relevance'
    }));
  },

  // Analyze social media comments and generate insights
  async analyzeSocialComments(comments) {
    try {
      logger.info('Analyzing social media comments');
      
      const insights = {
        sentiment: this.analyzeCommentsSentiment(comments),
        keyTopics: this.extractKeyTopics(comments),
        trends: this.identifyTrends(comments),
        recommendations: this.generateRecommendations(comments),
        engagement: this.calculateEngagement(comments)
      };
      
      return {
        success: true,
        insights,
        summary: this.createInsightSummary(insights)
      };
    } catch (error) {
      logger.error('Error analyzing social comments:', error);
      throw new Error('Failed to analyze social comments');
    }
  },

  // Analyze sentiment of comments
  analyzeCommentsSentiment(comments) {
    const sentiments = comments.map(comment => {
      const text = comment.text.toLowerCase();
      const positiveWords = ['ótimo', 'excelente', 'gosto', 'love', 'amazing', 'great'];
      const negativeWords = ['ruim', 'péssimo', 'não gosto', 'hate', 'terrible', 'bad'];
      
      let positiveCount = 0;
      let negativeCount = 0;
      
      positiveWords.forEach(word => {
        if (text.includes(word)) positiveCount++;
      });
      
      negativeWords.forEach(word => {
        if (text.includes(word)) negativeCount++;
      });
      
      if (positiveCount > negativeCount) return 'positive';
      if (negativeCount > positiveCount) return 'negative';
      return 'neutral';
    });
    
    const positiveCount = sentiments.filter(s => s === 'positive').length;
    const negativeCount = sentiments.filter(s => s === 'negative').length;
    const neutralCount = sentiments.filter(s => s === 'neutral').length;
    
    return {
      positive: positiveCount,
      negative: negativeCount,
      neutral: neutralCount,
      overall: positiveCount > negativeCount ? 'positive' : negativeCount > positiveCount ? 'negative' : 'neutral'
    };
  },

  // Extract key topics from comments
  extractKeyTopics(comments) {
    const topics = {};
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    
    comments.forEach(comment => {
      const words = comment.text.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 3 && !commonWords.includes(word)) {
          topics[word] = (topics[word] || 0) + 1;
        }
      });
    });
    
    // Return top 10 topics
    return Object.entries(topics)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));
  },

  // Identify trends in comments
  identifyTrends(comments) {
    const trends = [];
    
    // Mock trend identification
    if (comments.length > 0) {
      trends.push({
        type: 'engagement',
        description: 'High engagement on growth-related content',
        confidence: 0.8
      });
      
      trends.push({
        type: 'sentiment',
        description: 'Positive sentiment towards business growth topics',
        confidence: 0.7
      });
    }
    
    return trends;
  },

  // Generate recommendations based on comments
  generateRecommendations(comments) {
    const recommendations = [];
    
    if (comments.length > 0) {
      recommendations.push({
        type: 'content',
        suggestion: 'Focus on growth hacking content as it generates high engagement',
        priority: 'high'
      });
      
      recommendations.push({
        type: 'timing',
        suggestion: 'Post during business hours for better engagement',
        priority: 'medium'
      });
      
      recommendations.push({
        type: 'hashtag',
        suggestion: 'Use more specific hashtags related to your industry',
        priority: 'medium'
      });
    }
    
    return recommendations;
  },

  // Calculate engagement metrics
  calculateEngagement(comments) {
    const totalLikes = comments.reduce((sum, comment) => sum + (comment.likes || 0), 0);
    const totalComments = comments.length;
    const totalShares = comments.reduce((sum, comment) => sum + (comment.shares || 0), 0);
    
    return {
      totalLikes,
      totalComments,
      totalShares,
      averageEngagement: totalComments > 0 ? (totalLikes + totalComments + totalShares) / totalComments : 0
    };
  },

  // Create insight summary
  createInsightSummary(insights) {
    return {
      overallSentiment: insights.sentiment.overall,
      topTopic: insights.keyTopics[0]?.topic || 'N/A',
      mainTrend: insights.trends[0]?.description || 'No clear trends identified',
      keyRecommendation: insights.recommendations[0]?.suggestion || 'Continue monitoring',
      engagementScore: insights.engagement.averageEngagement
    };
  }
};

module.exports = aiService;
