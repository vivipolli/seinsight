import { IAgentRuntime, logger, Message } from '@elizaos/core';
import { afterAll, beforeAll, describe, expect, it, mock, spyOn } from 'bun:test';
import { hashtagGeneratorAgent } from '../agents';
import { generateHashtagsAction, analyzeBusinessReportAction } from '../actions/hashtagActions';

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

describe('Initial Endpoint Workflow - Hashtag Generation', () => {
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

  describe('Endpoint Input Processing', () => {
    it('should process user input text and generate hashtags', async () => {
      // Simulate user input from endpoint
      const userInput = `
        Our startup has been growing rapidly over the past quarter. 
        We've seen a 150% increase in user engagement and our revenue 
        has doubled. The team has expanded from 5 to 15 people and 
        we're looking to raise our Series A funding round. Our main 
        challenges are scaling our infrastructure and finding the right 
        talent in this competitive market.
      `;

      const message: Message = {
        name: 'user',
        content: { text: `Generate hashtags for this business report: ${userInput}` }
      };

      // Mock successful hashtag generation response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            hashtags: ['#startup', '#growth', '#funding'],
            analysis: 'Analysis of startup growth and funding needs',
            reportSummary: 'Startup showing strong growth metrics and preparing for Series A',
            keyThemes: ['growth', 'funding', 'scaling', 'talent acquisition']
          }
        })
      });

      const result = await generateHashtagsAction.handler(mockRuntime, message);

      expect(result.success).toBe(true);
      expect(result.text).toContain('hashtags');
      expect(result.text).toContain('#startup');
      expect(result.text).toContain('#growth');
      expect(result.text).toContain('#funding');

      // Verify API call was made to backend
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/insights/generate',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('startup')
        })
      );
    });

    it('should limit hashtags to maximum 3 as specified', async () => {
      const userInput = 'Generate hashtags for my business report about startup growth and funding';

      const message: Message = {
        name: 'user',
        content: { text: `Generate hashtags: ${userInput}` }
      };

      // Mock response with exactly 3 hashtags
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            hashtags: ['#startup', '#growth', '#funding'], // Exactly 3 hashtags
            analysis: 'Focused analysis on startup growth and funding'
          }
        })
      });

      const result = await generateHashtagsAction.handler(mockRuntime, message);

      expect(result.success).toBe(true);
      
      // Parse the response to verify hashtag count
      const hashtagsMatch = result.text.match(/#\w+/g);
      expect(hashtagsMatch).toHaveLength(3);
      expect(hashtagsMatch).toEqual(['#startup', '#growth', '#funding']);
    });

    it('should handle business report analysis', async () => {
      const businessReport = `
        Q3 Business Report:
        - Revenue increased by 85%
        - Customer acquisition cost decreased by 30%
        - New product launch planned for Q4
        - Team expansion: 10 new hires
        - Market expansion into Europe
      `;

      const message: Message = {
        name: 'user',
        content: { text: `Analyze this business report: ${businessReport}` }
      };

      // Mock business report analysis
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            hashtags: ['#business', '#growth', '#expansion'],
            analysis: 'Strong Q3 performance with revenue growth and cost optimization',
            insights: [
              'Revenue growth of 85% indicates strong market demand',
              'Reduced CAC suggests improved marketing efficiency',
              'European expansion shows strategic growth planning'
            ],
            recommendations: [
              'Continue optimizing customer acquisition',
              'Prepare for Q4 product launch',
              'Focus on European market entry strategy'
            ]
          }
        })
      });

      const result = await analyzeBusinessReportAction.handler(mockRuntime, message);

      expect(result.success).toBe(true);
      expect(result.text).toContain('Business Report Analysis');
      expect(result.text).toContain('#business');
      expect(result.text).toContain('#growth');
      expect(result.text).toContain('#expansion');
    });
  });

  describe('Hashtag Validation and Quality', () => {
    it('should validate hashtag format correctly', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Generate hashtags for startup growth' }
      };

      // Mock response with properly formatted hashtags
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            hashtags: ['#startup', '#growth', '#business'],
            analysis: 'Valid hashtag generation for startup growth'
          }
        })
      });

      const result = await generateHashtagsAction.handler(mockRuntime, message);

      expect(result.success).toBe(true);
      
      // Verify hashtags are properly formatted
      const hashtagsMatch = result.text.match(/#[a-zA-Z0-9]+/g);
      expect(hashtagsMatch).toBeTruthy();
      hashtagsMatch?.forEach(hashtag => {
        expect(hashtag).toMatch(/^#[a-zA-Z0-9]+$/);
      });
    });

    it('should handle different business contexts', async () => {
      const contexts = [
        {
          input: 'Generate hashtags for e-commerce business growth',
          expected: ['#ecommerce', '#growth', '#business']
        },
        {
          input: 'Generate hashtags for SaaS startup funding',
          expected: ['#saas', '#startup', '#funding']
        },
        {
          input: 'Generate hashtags for fintech innovation',
          expected: ['#fintech', '#innovation', '#technology']
        }
      ];

      for (const context of contexts) {
        const message: Message = {
          name: 'user',
          content: { text: context.input }
        };

        // Mock response for each context
        (global.fetch as any).mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              hashtags: context.expected,
              analysis: `Analysis for ${context.input}`
            }
          })
        });

        const result = await generateHashtagsAction.handler(mockRuntime, message);

        expect(result.success).toBe(true);
        context.expected.forEach(hashtag => {
          expect(result.text).toContain(hashtag);
        });
      }
    });
  });

  describe('Integration with Backend Services', () => {
    it('should send correct payload to backend API', async () => {
      const userInput = 'Generate hashtags for my startup growth report';

      const message: Message = {
        name: 'user',
        content: { text: userInput }
      };

      // Mock successful response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            hashtags: ['#startup', '#growth', '#business'],
            analysis: 'Mock analysis'
          }
        })
      });

      await generateHashtagsAction.handler(mockRuntime, message);

      // Verify the API call was made with correct payload
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/insights/generate',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('startup growth report')
        })
      );

      // Verify the request body structure
      const callArgs = (global.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(callArgs[1].body);
      
      expect(requestBody).toHaveProperty('projectId');
      expect(requestBody).toHaveProperty('userInput');
      expect(requestBody.userInput).toContain('startup growth report');
    });

    it('should handle backend service errors gracefully', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Generate hashtags for business report' }
      };

      // Mock backend error
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' })
      });

      const result = await generateHashtagsAction.handler(mockRuntime, message);

      expect(result.success).toBe(false);
      expect(result.text).toContain('Failed to generate hashtags');
    });

    it('should handle network errors', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Generate hashtags for business report' }
      };

      // Mock network error
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await generateHashtagsAction.handler(mockRuntime, message);

      expect(result.success).toBe(false);
      expect(result.text).toContain('Error connecting to backend service');
    });
  });

  describe('Action Validation', () => {
    it('should validate action triggers correctly', async () => {
      const validTriggers = [
        'Generate hashtags for my business report',
        'Create hashtags for startup growth',
        'Analyze this report and generate hashtags',
        'Business report hashtag generation',
        'Hashtags for growth analysis'
      ];

      const invalidTriggers = [
        'Hello, how are you?',
        'What is the weather today?',
        'Tell me a joke',
        'Random conversation'
      ];

      for (const trigger of validTriggers) {
        const message: Message = {
          name: 'user',
          content: { text: trigger }
        };

        const result = await generateHashtagsAction.validate(mockRuntime, message);
        expect(result).toBe(true);
      }

      for (const trigger of invalidTriggers) {
        const message: Message = {
          name: 'user',
          content: { text: trigger }
        };

        const result = await generateHashtagsAction.validate(mockRuntime, message);
        expect(result).toBe(false);
      }
    });

    it('should validate business report analysis triggers', async () => {
      const validTriggers = [
        'Analyze this business report',
        'Business report analysis',
        'Analyze my quarterly report',
        'Report analysis for business growth'
      ];

      const invalidTriggers = [
        'Generate hashtags',
        'Hello world',
        'Random text'
      ];

      for (const trigger of validTriggers) {
        const message: Message = {
          name: 'user',
          content: { text: trigger }
        };

        const result = await analyzeBusinessReportAction.validate(mockRuntime, message);
        expect(result).toBe(true);
      }

      for (const trigger of invalidTriggers) {
        const message: Message = {
          name: 'user',
          content: { text: trigger }
        };

        const result = await analyzeBusinessReportAction.validate(mockRuntime, message);
        expect(result).toBe(false);
      }
    });
  });

  describe('Response Format and Structure', () => {
    it('should return properly formatted response', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Generate hashtags for startup growth' }
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            hashtags: ['#startup', '#growth', '#business'],
            analysis: 'Analysis of startup growth trends',
            reportSummary: 'Startup showing strong growth potential',
            keyThemes: ['growth', 'innovation', 'scaling']
          }
        })
      });

      const result = await generateHashtagsAction.handler(mockRuntime, message);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('text');
      expect(result.success).toBe(true);
      expect(typeof result.text).toBe('string');
      expect(result.text.length).toBeGreaterThan(0);

      // Verify response contains expected sections
      expect(result.text).toContain('hashtags');
      expect(result.text).toContain('#startup');
      expect(result.text).toContain('#growth');
      expect(result.text).toContain('#business');
    });

    it('should handle empty or invalid responses from backend', async () => {
      const message: Message = {
        name: 'user',
        content: { text: 'Generate hashtags for business report' }
      };

      // Mock empty response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {}
        })
      });

      const result = await generateHashtagsAction.handler(mockRuntime, message);

      expect(result.success).toBe(true);
      expect(result.text).toContain('No hashtags generated');
    });
  });
});
