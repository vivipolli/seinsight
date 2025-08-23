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
        const db = runtime.db;
        const userId = message.entityId || 'default';
        
        // Get recent hashtags for the user
        const recentHashtags = await db.select().from(hashtagsTable)
          .where(eq(hashtagsTable.userId, userId))
          .orderBy(desc(hashtagsTable.createdAt))
          .limit(5);
  
        if (recentHashtags.length === 0) {
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
        return {
          text: 'Error retrieving hashtags from database',
          values: { hashtags: [] },
          data: { error: error instanceof Error ? error.message : String(error) },
        };
      }
    },
  };

  export default hashtagsProvider;