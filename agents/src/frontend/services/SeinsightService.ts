import { AnalysisResult, SessionResponse, Message, MessagesResponse } from '../types';

export class SeinsightService {
  private elizaosUrl = 'http://localhost:3000';
  private keywordsGeneratorId = '6045e764-c7b4-049a-9288-8a61c67c894c';
  private twitterCollectorId = '49694f6f-1a24-047d-b67f-1b3a56096764';
  private userId = '550e8400-e29b-41d4-a716-446655440000';

  async performRealAnalysis(businessDescription: string): Promise<AnalysisResult> {
    console.log('Starting REAL analysis for:', businessDescription);

    // Step 1: Generate hashtags using KeywordsGenerator agent
    const hashtags = await this.generateRealHashtags(businessDescription);

    // Step 2: Collect Twitter data using TwitterCollector agent
    const twitterData = await this.collectTwitterData(hashtags, businessDescription);

    return { hashtags, analysis: 'Analysis completed' };
  }

 
  async collectTwitterData(hashtags: string[], businessDescription: string): Promise<any> {
    try {
      // Create session with TwitterCollector agent
      const sessionResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: this.twitterCollectorId,
          userId: this.userId,
          metadata: {
            platform: "frontend",
            purpose: "twitter-collection"
          }
        })
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create session for Twitter collection and signals');
      }

      const sessionData = await sessionResponse.json() as SessionResponse;
      const sessionId = sessionData.sessionId;

      // Send message to collect Twitter data using hashtags
      console.log('📤 Sending Twitter collection request with hashtags:', hashtags);
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `Collect Twitter data using hashtags: ${hashtags.join(', ')} for: ${businessDescription}`,
          metadata: {
            requestType: "twitter-collection",
            hashtags: hashtags
          }
        })
      });

      // Wait for Twitter collection response
      await new Promise(resolve => setTimeout(resolve, 30000));

      // Get messages to extract Twitter data
      const messagesResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`);
      const messagesData = await messagesResponse.json() as MessagesResponse;
      
      // Extract Twitter data from agent response
      let twitterData = null;
      for (const msg of messagesData.messages) {
        if (msg.isAgent && (msg as any).metadata?.twitterData) {
          twitterData = (msg as any).metadata.twitterData;
          break;
        }
      }

      // Clean up session
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}`, {
        method: 'DELETE'
      });

      return twitterData;

    } catch (error) {
      console.error('Twitter collection and signals generation error:', error);
      return null;
    }
  }


  async generateRealHashtags(businessDescription: string): Promise<string[]> {
    try {
      // Create session with KeywordsGenerator
      const sessionResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: this.keywordsGeneratorId,
          userId: this.userId,
          metadata: {
            platform: "frontend",
            purpose: "hashtag-generation"
          }
        })
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create hashtag session');
      }

      const sessionData = await sessionResponse.json() as SessionResponse;
      const sessionId = sessionData.sessionId;

      // Send message to generate hashtags
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `GENERATE_HASHTAGS: ${businessDescription}`,
          metadata: {
            requestType: "hashtag-generation",
            action: "GENERATE_HASHTAGS"
          }
        })
      });

      // Wait for agent response with retry logic
      let attempts = 0;
      const maxAttempts = 10;
      let agentMessages: Message[] = [];
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds between attempts
        
        const messagesResponse = await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}/messages`);
        const messagesData = await messagesResponse.json() as MessagesResponse;
        
        if (messagesData.messages) {
          agentMessages = messagesData.messages.filter((msg: Message) => msg.isAgent);
          if (agentMessages.length > 0) {
            console.log('🔍 Found agent response after', attempts + 1, 'attempts');
            break;
          }
        }
        
        attempts++;
        console.log('🔍 Waiting for agent response, attempt', attempts);
      }
      
      if (agentMessages.length === 0) {
        throw new Error('Agent did not respond within expected time');
      }

      // Extract hashtags from agent response
      const agentResponse = agentMessages[agentMessages.length - 1];
      console.log('🔍 Agent response:', agentResponse);
      
      // Try to extract hashtags from different possible formats
      let hashtags: string[] = [];
      
      // Check if response has hashtags in content
      if (agentResponse.content) {
        const contentHashtags = agentResponse.content.match(/#\w+/g) || [];
        hashtags = [...hashtags, ...contentHashtags];
      }
      
      // Check if response has metadata with hashtags
      if ((agentResponse as any).metadata?.hashtags) {
        hashtags = [...hashtags, ...(agentResponse as any).metadata.hashtags];
      }
      
      // Check if response has raw_message with hashtags
      if ((agentResponse as any).metadata?.raw_message?.text) {
        const rawHashtags = (agentResponse as any).metadata.raw_message.text.match(/#\w+/g) || [];
        hashtags = [...hashtags, ...rawHashtags];
      }
      
      // Remove duplicates
      hashtags = [...new Set(hashtags)];
      
      console.log('🔍 Extracted hashtags:', hashtags);

      // Clean up session
      await fetch(`${this.elizaosUrl}/api/messaging/sessions/${sessionId}`, {
        method: 'DELETE'
      });

      return hashtags;
    } catch (error) {
      console.error('Hashtag generation error:', error);
      throw error;
    }
  }
 


}
