import { logger, type IAgentRuntime, type Project, type ProjectAgent } from '@elizaos/core';
import { keywordsGeneratorPlugin } from './plugins/keywords-generator';
import { keywordsGeneratorAgent } from './custom-agents/keywords-generator.ts';
import { twitterCollectorAgent } from './custom-agents/twitter-collector.ts';
import { insightsCompilerAgent } from './custom-agents/insights-compiler.ts';
import { oracleAgent } from './custom-agents/oracle-agent.ts';
import { ProjectStarterTestSuite } from './__tests__/e2e/project-starter.e2e';

import { twitterCollectorPlugin } from './plugins/twitter-collector.ts';
import { insightsCompilerPlugin } from './plugins/insights-compiler.ts';
import { oraclePlugin } from './plugins/oracle.ts';
import { collectTwitterDataAction } from './actions/twitterActions.ts';
import hashtagsProvider, { hashtagsTable } from './providers/keywords-generator.ts';

const initKeywordsGenerator = async ({ runtime }: { runtime: IAgentRuntime }) => {
  logger.info('Initializing KeywordsGenerator agent');
  logger.info({ name: keywordsGeneratorAgent.name }, 'Name:');
  runtime.registerProvider(hashtagsProvider);
  
  // Wait a bit for database to be available and create table
  setTimeout(async () => {
    try {
      logger.info('🔍 Creating hashtags table...');
      
      const adapter = (runtime as any).databaseAdapter || (runtime as any).adapter;
      if (adapter && adapter.db) {
        await adapter.db.execute(`
          CREATE TABLE IF NOT EXISTS hashtags (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            agent_id TEXT NOT NULL,
            hashtags JSONB NOT NULL,
            business_report TEXT,
            created_at TIMESTAMP DEFAULT NOW()
          );
        `);
        logger.info('✅ Hashtags table created successfully');
      } else {
        logger.error('❌ Database adapter not available');
      }
    } catch (error) {
      logger.error('❌ Error creating hashtags table:', error);
    }
  }, 5000); // Wait 5 seconds for database to be ready
};

const initTwitterCollector = ({ runtime }: { runtime: IAgentRuntime }) => {
  logger.info('Initializing TwitterCollector agent');
  logger.info({ name: twitterCollectorAgent.name }, 'Name:');
  runtime.registerAction(collectTwitterDataAction);
};

const initInsightsCompiler = ({ runtime }: { runtime: IAgentRuntime }) => {
  logger.info('Initializing InsightsCompiler agent');
  logger.info({ name: insightsCompilerAgent.name }, 'Name:');
  logger.info('InsightsCompiler Agent ID:', (runtime as any).agentId || 'unknown');
};

const initOracleAgent = ({ runtime }: { runtime: IAgentRuntime }) => {
  logger.info('Initializing OracleAgent agent');
  logger.info({ name: oracleAgent.name }, 'Name:');
};

export const keywordsProjectGeneratorAgent: ProjectAgent = {
  character: keywordsGeneratorAgent,
  init: async (runtime: IAgentRuntime) => await initKeywordsGenerator({ runtime }),
  plugins: [keywordsGeneratorPlugin],
  tests: [ProjectStarterTestSuite], // Export tests from ProjectAgent
};

export const twitterProjectCollectorAgent: ProjectAgent = {
  character: twitterCollectorAgent,
  init: async (runtime: IAgentRuntime) => await initTwitterCollector({ runtime }),
  plugins: [twitterCollectorPlugin],
  tests: [ProjectStarterTestSuite], // Export tests from ProjectAgent
};

export const insightsProjectCompilerAgent: ProjectAgent = {
  character: insightsCompilerAgent,
  init: async (runtime: IAgentRuntime) => await initInsightsCompiler({ runtime }),
  plugins: [insightsCompilerPlugin],
  tests: [ProjectStarterTestSuite], // Export tests from ProjectAgent
};

export const oracleProjectAgent: ProjectAgent = {
  character: oracleAgent,
  init: async (runtime: IAgentRuntime) => await initOracleAgent({ runtime }),
  plugins: [oraclePlugin],
  tests: [ProjectStarterTestSuite], // Export tests from ProjectAgent
};

const project: Project = {
  agents: [keywordsProjectGeneratorAgent, twitterProjectCollectorAgent, insightsProjectCompilerAgent, oracleProjectAgent],
};


export default project;
