import { describe, expect, it } from 'bun:test';

describe('Seinsight AI Agent Configuration', () => {
  it('should verify agent structure', () => {
    console.log('🔍 Verifying agent configurations...');
    
    // Import agents dynamically to avoid import issues
    const { hashtagGeneratorAgent, instagramAnalyzerAgent, twitterCollectorAgent, insightCompilerAgent } = require('../agents');
    
    // Test HashtagGenerator Agent
    console.log('✅ Testing HashtagGenerator Agent...');
    expect(hashtagGeneratorAgent.name).toBe('HashtagGenerator');
    expect(hashtagGeneratorAgent.plugins).toBeDefined();
    expect(hashtagGeneratorAgent.system).toBeDefined();
    expect(hashtagGeneratorAgent.bio).toBeDefined();
    console.log('   - Name:', hashtagGeneratorAgent.name);
    console.log('   - Plugins:', hashtagGeneratorAgent.plugins.length);
    console.log('   - System prompt length:', hashtagGeneratorAgent.system.length);
    
    // Test InstagramAnalyzer Agent
    console.log('✅ Testing InstagramAnalyzer Agent...');
    expect(instagramAnalyzerAgent.name).toBe('InstagramAnalyzer');
    expect(instagramAnalyzerAgent.plugins).toBeDefined();
    expect(instagramAnalyzerAgent.system).toBeDefined();
    expect(instagramAnalyzerAgent.bio).toBeDefined();
    console.log('   - Name:', instagramAnalyzerAgent.name);
    console.log('   - Plugins:', instagramAnalyzerAgent.plugins.length);
    console.log('   - System prompt length:', instagramAnalyzerAgent.system.length);
    
    // Test TwitterCollector Agent (MVP Mode)
    console.log('✅ Testing TwitterCollector Agent (MVP Mode)...');
    expect(twitterCollectorAgent.name).toBe('TwitterCollector');
    expect(twitterCollectorAgent.plugins).toBeDefined();
    expect(twitterCollectorAgent.system).toBeDefined();
    expect(twitterCollectorAgent.bio).toBeDefined();
    expect(twitterCollectorAgent.settings).toBeDefined();
    console.log('   - Name:', twitterCollectorAgent.name);
    console.log('   - Plugins:', twitterCollectorAgent.plugins.length);
    console.log('   - System prompt length:', twitterCollectorAgent.system.length);
    
    // Verify MVP Mode Configuration
    console.log('   - MVP Mode Settings:');
    console.log('     * TWITTER_SEARCH_ENABLE:', twitterCollectorAgent.settings.TWITTER_SEARCH_ENABLE);
    console.log('     * TWITTER_POST_ENABLE:', twitterCollectorAgent.settings.TWITTER_POST_ENABLE);
    console.log('     * TWITTER_ENABLE_ACTIONS:', twitterCollectorAgent.settings.TWITTER_ENABLE_ACTIONS);
    console.log('     * trackedHashtags:', twitterCollectorAgent.settings.trackedHashtags);
    console.log('     * keywords:', twitterCollectorAgent.settings.keywords);
    
    expect(twitterCollectorAgent.settings.TWITTER_SEARCH_ENABLE).toBe("false");
    expect(twitterCollectorAgent.settings.TWITTER_POST_ENABLE).toBe("false");
    expect(twitterCollectorAgent.settings.TWITTER_ENABLE_ACTIONS).toBe("false");
    expect(twitterCollectorAgent.settings.trackedHashtags).toEqual([]);
    expect(twitterCollectorAgent.settings.keywords).toEqual([]);
    
    // Test InsightCompiler Agent
    console.log('✅ Testing InsightCompiler Agent...');
    expect(insightCompilerAgent.name).toBe('InsightCompiler');
    expect(insightCompilerAgent.plugins).toBeDefined();
    expect(insightCompilerAgent.system).toBeDefined();
    expect(insightCompilerAgent.bio).toBeDefined();
    console.log('   - Name:', insightCompilerAgent.name);
    console.log('   - Plugins:', insightCompilerAgent.plugins.length);
    console.log('   - System prompt length:', insightCompilerAgent.system.length);
    
    console.log('\n🎉 All agents configured correctly!');
  });
  
  it('should verify action structure', () => {
    console.log('🔧 Verifying action configurations...');
    
    // Import actions dynamically
    const { generateHashtagsAction, analyzeBusinessReportAction } = require('../actions/hashtagActions');
    const { collectInstagramDataAction, analyzeInstagramSentimentAction } = require('../actions/instagramActions');
    const { collectTwitterDataAction, analyzeTwitterTrendsAction, searchKeywordsAction } = require('../actions/twitterActions');
    const { compileInsightsAction, generateStrategicReportAction } = require('../actions/compilerActions');
    
    const actions = [
      { name: 'GENERATE_HASHTAGS', action: generateHashtagsAction },
      { name: 'ANALYZE_BUSINESS_REPORT', action: analyzeBusinessReportAction },
      { name: 'COLLECT_INSTAGRAM_DATA', action: collectInstagramDataAction },
      { name: 'ANALYZE_INSTAGRAM_SENTIMENT', action: analyzeInstagramSentimentAction },
      { name: 'COLLECT_TWITTER_DATA', action: collectTwitterDataAction },
      { name: 'ANALYZE_TWITTER_TRENDS', action: analyzeTwitterTrendsAction },
      { name: 'SEARCH_KEYWORDS', action: searchKeywordsAction },
      { name: 'COMPILE_INSIGHTS', action: compileInsightsAction },
      { name: 'GENERATE_STRATEGIC_REPORT', action: generateStrategicReportAction }
    ];
    
    actions.forEach(({ name, action }) => {
      console.log(`✅ Testing ${name} Action...`);
      expect(action.name).toBeDefined();
      expect(action.description).toBeDefined();
      expect(action.validate).toBeDefined();
      expect(action.handler).toBeDefined();
      console.log(`   - Name: ${action.name}`);
      console.log(`   - Description: ${action.description.substring(0, 50)}...`);
    });
    
    console.log('\n🎉 All actions configured correctly!');
  });
});
