import { logger, type IAgentRuntime, type Project, type ProjectAgent } from '@elizaos/core';
import { character } from './character.ts';

// Import Seinsight AI agents
import { 
  hashtagGeneratorAgent, 
  // instagramAnalyzerAgent, 
  twitterCollectorAgent, 
  insightCompilerAgent 
} from './agents/index';

// Import Seinsight AI actions
import {
  generateHashtagsAction,
  collectInstagramDataAction,
  // analyzeInstagramSentimentAction,
  collectTwitterDataAction,
  generateTop3SignalsAction,
  getOracleStatusAction
} from './agents/index';

import {
  compileInsightsAction,
  generateStrategicReportAction,
  criticalAnalysisAction
} from './actions/compilerActions';

// Import Seinsight AI providers
import {
  businessContextProvider,
  socialMediaMetricsProvider,
  hashtagPerformanceProvider,
  insightHistoryProvider
} from './agents/index';

// Initialize Seinsight AI agents
const initSeinsightAgents = ({ runtime }: { runtime: IAgentRuntime }) => {
  logger.info('Initializing Seinsight AI agents');
  
  // Register custom actions
  runtime.registerAction(generateHashtagsAction);
  runtime.registerAction(collectInstagramDataAction);
  // runtime.registerAction(analyzeInstagramSentimentAction);
  runtime.registerAction(collectTwitterDataAction);
  runtime.registerAction(compileInsightsAction);
  runtime.registerAction(generateStrategicReportAction);
  runtime.registerAction(criticalAnalysisAction);
  runtime.registerAction(generateTop3SignalsAction);
  runtime.registerAction(getOracleStatusAction);
  
  // Register custom providers
  runtime.registerProvider(businessContextProvider);
  runtime.registerProvider(socialMediaMetricsProvider);
  runtime.registerProvider(hashtagPerformanceProvider);
  runtime.registerProvider(insightHistoryProvider);
  
  logger.info('Seinsight AI agents initialized successfully');
};

// Main project agent (Eliza)
export const projectAgent: ProjectAgent = {
  character,
  init: async (runtime: IAgentRuntime) => {
    logger.info('Initializing Eliza');
    logger.info({ name: character.name }, 'Name:');
    initSeinsightAgents({ runtime });
  },
};

// HashtagGenerator agent
export const hashtagGeneratorProjectAgent: ProjectAgent = {
  character: hashtagGeneratorAgent,
  init: async (runtime: IAgentRuntime) => {
    logger.info('Initializing HashtagGenerator agent');
    initSeinsightAgents({ runtime });
  },
};

// InstagramAnalyzer agent
// export const instagramAnalyzerProjectAgent: ProjectAgent = {
//   character: instagramAnalyzerAgent,
//   init: async (runtime: IAgentRuntime) => {
//     logger.info('Initializing InstagramAnalyzer agent');
//     initSeinsightAgents({ runtime });
//   },
// };

// TwitterCollector agent
export const twitterCollectorProjectAgent: ProjectAgent = {
  character: twitterCollectorAgent,
  init: async (runtime: IAgentRuntime) => {
    logger.info('Initializing TwitterCollector agent');
    initSeinsightAgents({ runtime });
  },
};

// InsightCompiler agent
export const insightCompilerProjectAgent: ProjectAgent = {
  character: insightCompilerAgent,
  init: async (runtime: IAgentRuntime) => {
    logger.info('Initializing InsightCompiler agent');
    initSeinsightAgents({ runtime });
  },
};

// Multi-agent project configuration
const project: Project = {
  agents: [
    projectAgent,
    hashtagGeneratorProjectAgent,
    // instagramAnalyzerProjectAgent, // Currently disabled
    twitterCollectorProjectAgent,
    insightCompilerProjectAgent
  ],
};

export { character } from './character.ts';

export default project;
