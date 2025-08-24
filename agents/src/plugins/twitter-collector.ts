import { Plugin } from '@elizaos/core';
import { collectTwitterDataAction } from '../actions/twitterActions';
import { generateTop3SignalsAction } from 'src/actions/oracleActions';

export const twitterCollectorPlugin: Plugin = {
  name: 'twitter-collector-plugin',
  description: 'Provides twitter data collection',
  
  actions: [collectTwitterDataAction, generateTop3SignalsAction],
};