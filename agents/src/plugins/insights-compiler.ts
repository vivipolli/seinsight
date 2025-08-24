import { Plugin } from '@elizaos/core';
import { criticalAnalysisAction } from '../actions/analysisActions';

export const insightsCompilerPlugin: Plugin = {
  name: 'insights-compiler-plugin',
  description: 'Provides critical analysis and insights compilation',
  
  actions: [criticalAnalysisAction],
};
