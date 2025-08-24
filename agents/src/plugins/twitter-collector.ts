import { Plugin } from '@elizaos/core';
import { collectTwitterDataAction } from '../actions/twitterActions';

export const twitterCollectorPlugin: Plugin = {
  name: 'twitter-collector-plugin',
  description: 'Provides twitter data collection',
  
  actions: [collectTwitterDataAction],
};