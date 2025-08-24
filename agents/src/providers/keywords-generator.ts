import {
  type IAgentRuntime,
  type Memory,
  type Provider,
  type ProviderResult,
  type State,
} from '@elizaos/core';
import { eq, desc } from 'drizzle-orm';
import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Shared hashtags table accessible by all agents
export const hashtagsTable = pgTable('hashtags', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull(),
    agentId: text('agent_id').notNull(),
    hashtags: jsonb('hashtags').notNull(),
    businessReport: text('business_report'),
    createdAt: timestamp('created_at').defaultNow(),
  });
  

/**
 * Hashtags Provider
 * Retrieves hashtags from the database for sharing between agents
 */
export const hashtagsProvider: Provider = {
    name: 'HASHTAGS_PROVIDER',
    description: 'Provides hashtags from database for cross-agent sharing',
  
    get: async (
      runtime: IAgentRuntime,
      message: Memory,
      _state: State
    ): Promise<ProviderResult> => {
      try {
        // Only execute if specifically requested or if this is a hashtag generation request
        const content = typeof message.content === 'string' ? message.content : message.content.text || '';
        const metadata = (message as any).metadata || {};
        
        // Check if this is a hashtag generation request
        const isHashtagRequest = content.startsWith('GENERATE_HASHTAGS:') || 
                                metadata.requestType === 'hashtag-generation' ||
                                metadata.action === 'GENERATE_HASHTAGS';
        
        // If not a hashtag request, return empty result to avoid loop
        if (!isHashtagRequest) {
          return {
            text: 'Provider not needed for this message type',
            values: { hashtags: [] },
            data: { hashtags: [] },
          };
        }
        
        
        const db = runtime.db;
        const userId = message.entityId || 'default';
        
        // Get recent hashtags for the user
        console.log('🔍 Querying database for hashtags...');
        const recentHashtags = await db.select().from(hashtagsTable)
          .where(eq(hashtagsTable.userId, userId))
          .orderBy(desc(hashtagsTable.createdAt))
          .limit(5);
  
        
        if (recentHashtags.length === 0) {
          console.log('🔍 No hashtags found for user:', userId);
          return {
            text: 'No hashtags found for this user',
            values: { hashtags: [] },
            data: { hashtags: [] },
          };
        }

        const allHashtags = recentHashtags.flatMap((record: any) => record.hashtags as string[]);
        const uniqueHashtags = Array.from(new Set(allHashtags)); 
  

        return {
          text: `Found ${uniqueHashtags.length} unique hashtags from recent analysis`,
          values: { hashtags: uniqueHashtags },
          data: { 
            hashtags: uniqueHashtags,
            recentRecords: recentHashtags 
          },
        };
      } catch (error) {
        console.log('🔍 Error in HASHTAGS_PROVIDER:', error);
        return {
          text: 'Error retrieving hashtags from database',
          values: { hashtags: [] },
          data: { error: error instanceof Error ? error.message : String(error) },
        };
      }
    },
  };

  export default hashtagsProvider;