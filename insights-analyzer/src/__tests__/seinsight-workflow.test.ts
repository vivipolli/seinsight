import { IAgentRuntime, logger, Message } from '@elizaos/core';
import { afterAll, beforeAll, describe, expect, it, mock, spyOn } from 'bun:test';
import { 
  hashtagGeneratorAgent, 
  instagramAnalyzerAgent, 
  twitterCollectorAgent, 
  insightCompilerAgent 
} from '../agents';
import {
  generateHashtagsAction,
  analyzeBusinessReportAction
} from '../actions/hashtagActions';
import {
  collectInstagramDataAction,
  analyzeInstagramSentimentAction
} from '../actions/instagramActions';
import {
  collectTwitterDataAction,
  analyzeTwitterTrendsAction,
  searchKeywordsAction
} from '../actions/twitterActions';
import {
  compileInsightsAction,
  generateStrategicReportAction
} from '../actions/compilerActions';

// Mock fetch globally to prevent real API calls
global.fetch = mock();

// Set up spies on logger
beforeAll(() => {
  spyOn(logger, 'info').mockImplementation(() => {});
  spyOn(logger, 'error').mockImplementation(() => {});
  spyOn(logger, 'warn').mockImplementation(() => {});
  spyOn(logger, 'debug').mockImplementation(() => {});
});

afterAll(() => {
  // Clean up mocks
  (global.fetch as any).mockRestore?.();
});

describe('Seinsight AI Complete Workflow', () => {
  let mockRuntime: IAgentRuntime;

  beforeEach(() => {
    // Create mock runtime for each test
    mockRuntime = {
      character: hashtagGeneratorAgent,
      plugins: [],
      registerAction: mock(),
      registerProvider: mock(),
      getService: mock(),
      getSetting: mock().mockReturnValue(null),
      useModel: mock().mockResolvedValue('Mock AI response'),
      getProviderResults: mock().mockResolvedValue([]),
      evaluateProviders: mock().mockResolvedValue([]),
      evaluate: mock().mockResolvedValue([]),
    } as unknown as IAgentRuntime;

    // Reset fetch mock
    (global.fetch as any).mockReset();
  });

  describe('Agent Configuration Tests', () => {
    it('should have all required agents configured', () => {
      expect(hashtagGeneratorAgent).toBeDefined();
      expect(instagramAnalyzerAgent).toBeDefined();
      expect(twitterCollectorAgent).toBeDefined();
      expect(insightCompilerAgent).toBeDefined();

      // Check required properties
      [hashtagGeneratorAgent, instagramAnalyzerAgent, twitterCollectorAgent, insightCompilerAgent].forEach(agent => {
        expect(agent.name).toBeDefined();
        expect(agent.plugins).toBeDefined();
        expect(agent.system).toBeDefined();
        expect(agent.bio).toBeDefined();
      });
    });

    it('should have Twitter agent in MVP mode', () => {
      expect(twitterCollectorAgent.settings?.TWITTER_SEARCH_ENABLE).toBe("false");
      expect(twitterCollectorAgent.settings?.TWITTER_POST_ENABLE).toBe("false");
      expect(twitterCollectorAgent.settings?.TWITTER_ENABLE_ACTIONS).toBe("false");
    });

    it('should have empty hashtags array initially', () => {
      expect(twitterCollectorAgent.settings?.trackedHashtags).toEqual([]);
      expect(twitterCollectorAgent.settings?.keywords).toEqual([]);
    });
  });

  describe('Action Configuration Tests', () => {
    it('should have all required actions defined', () => {
      const actions = [
        generateHashtagsAction,
        analyzeBusinessReportAction,
        collectInstagramDataAction,
        analyzeInstagramSentimentAction,
        collectTwitterDataAction,
        analyzeTwitterTrendsAction,
        searchKeywordsAction,
        compileInsightsAction,
        generateStrategicReportAction
      ];

      actions.forEach(action => {
        expect(action.name).toBeDefined();
        expect(action.description).toBeDefined();
        expect(action.validate).toBeDefined();
        expect(action.handler).toBeDefined();
      });
    });

    it('should have proper action names', () => {
      expect(generateHashtagsAction.name).toBe('GENERATE_HASHTAGS');
      expect(collectInstagramDataAction.name).toBe('COLLECT_INSTAGRAM_DATA');
      expect(collectTwitterDataAction.name).toBe('COLLECT_TWITTER_DATA');
      expect(compileInsightsAction.name).toBe('COMPILE_INSIGHTS');
    });
  });

  describe('Step 1: Hashtag Generation', () => {
    it('should validate hashtag generation action correctly', async () => {
      const validMessage: Message = {
        name: 'user',
        content: { text: 'Generate hashtags for my business report about startup growth' }
      };

      const invalidMessage: Message = {
        name: 'user',
        content: { text: 'Hello, how are you?' }
      };

      const validResult = await generateHashtagsAction.validate(mockRuntime, validMessage);
      const invalidResult = await generateHashtagsAction.validate(mockRuntime, invalidMessage);

      expect(validResult).toBe(true);
      expect(invalidResult).toBe(false);
    });

    it('should handle hashtag generation without API calls', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Generate hashtags for startup growth report' }
      };

      // Mock successful response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            hashtags: ['#startup', '#growth', '#business'],
            analysis: 'Mock analysis of business report'
          }
        })
      });

      const result = await generateHashtagsAction.handler(mockRuntime, message);

      expect(result.success).toBe(true);
      expect(result.text).toContain('hashtags');
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/insights/generate',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });
  });

  describe('Step 2: Instagram Data Collection', () => {
    it('should validate Instagram collection action', async () => {
      const validMessage: Message = {
        name: 'user',
        content: { text: 'Collect Instagram data for #startup hashtag' }
      };

      const result = await collectInstagramDataAction.validate(mockRuntime, validMessage);
      expect(result).toBe(true);
    });

    it('should handle Instagram data collection with mock response', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Collect Instagram data' }
      };

      // Mock successful Instagram collection
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            status: 'completed',
            platforms: ['instagram'],
            instagram: {
              postsCollected: 15,
              commentsAnalyzed: 45,
              engagement: { totalLikes: 120, totalComments: 45 }
            }
          }
        })
      });

      const result = await collectInstagramDataAction.handler(mockRuntime, message);

      expect(result.success).toBe(true);
      expect(result.text).toContain('Instagram Data Collection Results');
      expect(result.text).toContain('Posts Collected: 15');
    });

    it('should handle Instagram sentiment analysis', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Analyze Instagram sentiment' }
      };

      // Mock sentiment analysis response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            sentiment: { positive: 0.7, neutral: 0.2, negative: 0.1 },
            insights: ['High engagement with positive sentiment', 'Strong community interaction']
          }
        })
      });

      const result = await analyzeInstagramSentimentAction.handler(mockRuntime, message);

      expect(result.success).toBe(true);
      expect(result.text).toContain('Sentiment Analysis');
      expect(result.text).toContain('Positive: 70.0%');
    });
  });

  describe('Step 3: Twitter Data Collection (MVP Mode)', () => {
    it('should validate Twitter collection action', async () => {
      const validMessage: Message = {
        name: 'user',
        content: { text: 'Collect Twitter data for hashtags' }
      };

      const result = await collectTwitterDataAction.validate(mockRuntime, validMessage);
      expect(result).toBe(true);
    });

    it('should handle Twitter data collection with empty hashtags', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Collect Twitter data' }
      };

      // Set empty hashtags to simulate no hashtags from HashtagGenerator
      mockRuntime.character = {
        ...twitterCollectorAgent,
        settings: { trackedHashtags: [] }
      };

      const result = await collectTwitterDataAction.handler(mockRuntime, message);

      expect(result.success).toBe(true);
      expect(result.text).toContain('No hashtags available from HashtagGenerator');
    });

    it('should handle Twitter data collection with hashtags', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Collect Twitter data' }
      };

      // Set hashtags to simulate HashtagGenerator output
      mockRuntime.character = {
        ...twitterCollectorAgent,
        settings: { trackedHashtags: ['#startup', '#growth', '#business'] }
      };

      // Mock successful Twitter collection
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            status: 'completed',
            platforms: ['twitter'],
            twitter: {
              postsCollected: 25,
              commentsAnalyzed: 60,
              engagement: { totalLikes: 180, totalComments: 60 }
            }
          }
        })
      });

      const result = await collectTwitterDataAction.handler(mockRuntime, message);

      expect(result.success).toBe(true);
      expect(result.text).toContain('Hashtags from HashtagGenerator: #startup, #growth, #business');
      expect(result.text).toContain('Posts Collected: 25');
    });

    it('should handle Twitter trends analysis', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Analyze Twitter trends' }
      };

      // Set hashtags
      mockRuntime.character = {
        ...twitterCollectorAgent,
        settings: { trackedHashtags: ['#startup', '#growth'] }
      };

      // Mock trends analysis response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            sentiment: { positive: 0.6, neutral: 0.3, negative: 0.1 },
            topics: [
              { name: 'startup funding', mentions: 45 },
              { name: 'growth strategies', mentions: 32 }
            ],
            engagement: {
              avgEngagementRate: 0.08,
              peakTime: '14:00',
              totalInteractions: 250
            },
            insights: [
              'High interest in startup funding discussions',
              'Growth strategies trending positively'
            ]
          }
        })
      });

      const result = await analyzeTwitterTrendsAction.handler(mockRuntime, message);

      expect(result.success).toBe(true);
      expect(result.text).toContain('Hashtags from HashtagGenerator: #startup, #growth');
      expect(result.text).toContain('Positive: 60.0%');
      expect(result.text).toContain('startup funding');
    });

    it('should handle keyword search with rate limit check', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Search keywords' }
      };

      // Set hashtags and rate limit
      mockRuntime.character = {
        ...twitterCollectorAgent,
        settings: {
          trackedHashtags: ['#startup', '#growth', '#business'],
          requestCount: 95,
          monthlyLimit: 100
        }
      };

      const result = await searchKeywordsAction.handler(mockRuntime, message);

      expect(result.success).toBe(true);
      expect(result.text).toContain('Hashtags from HashtagGenerator: #startup, #growth, #business');
      expect(result.text).toContain('API Requests Used: 96/100');
    });

    it('should handle rate limit exceeded', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Search keywords' }
      };

      // Set rate limit exceeded
      mockRuntime.character = {
        ...twitterCollectorAgent,
        settings: {
          trackedHashtags: ['#startup'],
          requestCount: 100,
          monthlyLimit: 100
        }
      };

      const result = await searchKeywordsAction.handler(mockRuntime, message);

      expect(result.success).toBe(false);
      expect(result.text).toContain('Rate Limit Reached');
    });
  });

  describe('Step 4: Insight Compilation', () => {
    it('should validate insight compilation action', async () => {
      const validMessage: Message = {
        name: 'user',
        content: { text: 'Compile insights from all data sources' }
      };

      const result = await compileInsightsAction.validate(mockRuntime, validMessage);
      expect(result).toBe(true);
    });

    it('should handle insight compilation', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Compile insights' }
      };

      // Mock insight history response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [
            {
              id: '1',
              projectId: 'default',
              hashtags: ['#startup', '#growth'],
              insights: ['High engagement on startup content', 'Positive sentiment trends'],
              createdAt: new Date().toISOString()
            }
          ]
        })
      });

      const result = await compileInsightsAction.handler(mockRuntime, message);

      expect(result.success).toBe(true);
      expect(result.text).toContain('Insight Compilation Results');
      expect(result.text).toContain('#startup, #growth');
    });

    it('should handle strategic report generation', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Generate strategic report' }
      };

      // Mock insight stats response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            totalInsights: 5,
            averageSentiment: 0.75,
            topHashtags: ['#startup', '#growth', '#business'],
            engagementMetrics: {
              totalLikes: 500,
              totalComments: 150,
              averageEngagement: 0.12
            }
          }
        })
      });

      const result = await generateStrategicReportAction.handler(mockRuntime, message);

      expect(result.success).toBe(true);
      expect(result.text).toContain('Strategic Report');
      expect(result.text).toContain('Total Insights: 5');
    });
  });

  describe('Complete Workflow Integration', () => {
    it('should simulate complete workflow without real API calls', async () => {
      // Step 1: Hashtag Generation
      const hashtagMessage: Message = {
        name: 'user',
        content: { text: 'Generate hashtags for my startup growth report' }
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { hashtags: ['#startup', '#growth', '#business'] }
        })
      });

      const hashtagResult = await generateHashtagsAction.handler(mockRuntime, hashtagMessage);
      expect(hashtagResult.success).toBe(true);

      // Step 2: Instagram Collection
      const instagramMessage: Message = {
        name: 'user',
        content: { text: 'Collect Instagram data' }
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            status: 'completed',
            instagram: { postsCollected: 20, commentsAnalyzed: 50 }
          }
        })
      });

      const instagramResult = await collectInstagramDataAction.handler(mockRuntime, instagramMessage);
      expect(instagramResult.success).toBe(true);

      // Step 3: Twitter Collection (with hashtags)
      const twitterMessage: Message = {
        name: 'user',
        content: { text: 'Collect Twitter data' }
      };

      // Update character with hashtags
      mockRuntime.character = {
        ...twitterCollectorAgent,
        settings: { trackedHashtags: ['#startup', '#growth', '#business'] }
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            status: 'completed',
            twitter: { postsCollected: 30, commentsAnalyzed: 75 }
          }
        })
      });

      const twitterResult = await collectTwitterDataAction.handler(mockRuntime, twitterMessage);
      expect(twitterResult.success).toBe(true);

      // Step 4: Insight Compilation
      const compileMessage: Message = {
        name: 'user',
        content: { text: 'Compile insights' }
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [
            {
              id: '1',
              hashtags: ['#startup', '#growth', '#business'],
              insights: ['Strong community engagement', 'Positive growth trends'],
              createdAt: new Date().toISOString()
            }
          ]
        })
      });

      const compileResult = await compileInsightsAction.handler(mockRuntime, compileMessage);
      expect(compileResult.success).toBe(true);

      // Verify all API calls were made
      expect(global.fetch).toHaveBeenCalledTimes(4);
    });

    it('should handle workflow with rate limiting', async () => {
      // Set up character with rate limit
      mockRuntime.character = {
        ...twitterCollectorAgent,
        settings: {
          trackedHashtags: ['#startup'],
          requestCount: 99,
          monthlyLimit: 100
        }
      };

      const message: Message = {
        name: 'user',
        content: { text: 'Search keywords' }
      };

      const result = await searchKeywordsAction.handler(mockRuntime, message);

      expect(result.success).toBe(true);
      expect(result.text).toContain('API Requests Used: 100/100');
      expect(result.text).toContain('Remaining requests: 0');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Collect Twitter data' }
      };

      // Mock API error
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await collectTwitterDataAction.handler(mockRuntime, message);

      expect(result.success).toBe(false);
      expect(result.text).toContain('Error connecting to Twitter service');
    });

    it('should handle invalid API responses', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Generate hashtags' }
      };

      // Mock invalid response
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' })
      });

      const result = await generateHashtagsAction.handler(mockRuntime, message);

      expect(result.success).toBe(false);
      expect(result.text).toContain('Failed to generate hashtags');
    });
  });
});
