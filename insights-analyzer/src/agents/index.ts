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
export { generateHashtagsAction, analyzeBusinessReportAction } from '../actions/hashtagActions';
export { collectInstagramDataAction, analyzeInstagramSentimentAction } from '../actions/instagramActions';
export { collectTwitterDataAction, analyzeTwitterTrendsAction, searchTwitterContentAction, searchKeywordsAction } from '../actions/twitterActions';
export { compileInsightsAction, generateStrategicReportAction } from '../actions/compilerActions';

// Export providers
export { businessContextProvider, socialMediaMetricsProvider, hashtagPerformanceProvider, insightHistoryProvider } from '../providers/seinsightProviders';

// Agent configurations for easy access
export const agentConfigurations = {
  hashtagGenerator: hashtagGeneratorAgent,
  instagramAnalyzer: instagramAnalyzerAgent,
  twitterCollector: twitterCollectorAgent,
  insightCompiler: insightCompilerAgent
};
