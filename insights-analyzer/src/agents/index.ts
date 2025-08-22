// Import agents
import { hashtagGeneratorAgent } from './hashtagGenerator';
import { instagramAnalyzerAgent } from './instagramAnalyzer';
import { twitterCollectorAgent } from './twitterCollector';
import { insightCompilerAgent } from './insightCompiler';

// Export agents
export { hashtagGeneratorAgent } from './hashtagGenerator';
export { instagramAnalyzerAgent } from './instagramAnalyzer';
export { twitterCollectorAgent } from './twitterCollector';
export { insightCompilerAgent } from './insightCompiler';

// Export actions
export { generateHashtagsAction } from '../actions/hashtagActions';
export { collectInstagramDataAction, analyzeInstagramSentimentAction } from '../actions/instagramActions';
export { collectTwitterDataAction } from '../actions/twitterActions';
export { criticalAnalysisAction, compileInsightsAction, generateStrategicReportAction } from '../actions/compilerActions';
export { generateTop3SignalsAction, getOracleStatusAction } from '../actions/oracleActions';

// Export providers
export { businessContextProvider, socialMediaMetricsProvider, hashtagPerformanceProvider, insightHistoryProvider } from '../providers/seinsightProviders';

// Agent configurations for easy access
export const agentConfigurations = {
  hashtagGenerator: hashtagGeneratorAgent,
  instagramAnalyzer: instagramAnalyzerAgent,
  twitterCollector: twitterCollectorAgent,
  insightCompiler: insightCompilerAgent
};
