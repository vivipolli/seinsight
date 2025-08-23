# Hashtag Database Guide

This guide explains how to use the hashtag database functionality for sharing hashtags between agents in ElizaOS.

## Overview

The hashtag system consists of:
- **Shared Database Table**: `hashtags` table accessible by all agents
- **Actions**: Generate and retrieve hashtags
- **Provider**: Access hashtags from database
- **Cross-Agent Sharing**: Data persistence for downstream agents

## Database Schema

```typescript
export const hashtagsTable = pgTable('hashtags', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  agentId: text('agent_id').notNull(),
  hashtags: jsonb('hashtags').notNull(),
  businessReport: text('business_report'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

## Actions

### 1. GENERATE_HASHTAGS
Generates hashtags from business reports and saves them to the database.

**Usage:**
```
"Generate hashtags for my business report about growth challenges"
```

**Features:**
- AI-powered hashtag generation
- Automatic database storage
- Cross-agent data sharing
- Character settings persistence

### 2. HASHTAGS_PROVIDER
Provides hashtags from database for cross-agent access.

**Usage:**
```typescript
const provider = runtime.getProvider('HASHTAGS_PROVIDER');
const result = await provider.get(runtime, message, state);
const hashtags = result.data.hashtags;
```

**Features:**
- Retrieves recent hashtags for the user
- Deduplicates hashtags across sessions
- Provides hashtag history
- Cross-agent data sharing



## Cross-Agent Data Sharing

### Method 1: Database Access
Agents can directly query the database:
```typescript
const db = runtime.db;
const hashtags = await db.select().from(hashtagsTable)
  .where(eq(hashtagsTable.userId, userId))
  .orderBy(desc(hashtagsTable.createdAt));
```

### Method 2: Character Settings
Hashtags are stored in character settings:
```typescript
const settings = runtime.character.settings;
const trackedHashtags = settings.trackedHashtags;
const retrievedHashtags = settings.retrievedHashtags;
```

### Method 3: Provider Pattern
Use the hashtags provider:
```typescript
const provider = runtime.getProvider('HASHTAGS_PROVIDER');
const result = await provider.get(runtime, message, state);
const hashtags = result.data.hashtags;
```

## Example Workflow

1. **Agent A** generates hashtags from business report
2. **Agent A** saves hashtags to database
3. **Agent B** accesses hashtags via provider or direct database access
4. **Agent B** uses hashtags for social media analysis
5. **Agent C** accesses hashtag history for trend analysis

## Integration with Other Agents

The hashtag database can be integrated with:
- Social media monitoring agents
- Content analysis agents
- Trend tracking agents
- Reporting agents

## Error Handling

The system includes error handling for:
- Database connection issues
- Invalid hashtag formats
- Missing user data
- Provider access failures

## Best Practices

1. Always use the `entityId` from the message for user identification
2. Limit business report text to 1000 characters for database storage
3. Use the provider pattern for consistent data access
4. Implement proper error handling in downstream agents
5. Consider hashtag deduplication across sessions
