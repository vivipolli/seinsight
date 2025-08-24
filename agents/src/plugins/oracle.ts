import { Plugin } from '@elizaos/core';
import { generateTop3SignalsAction } from '../actions/oracleActions';

export const oraclePlugin: Plugin = {
  name: 'oracle-plugin',
  description: 'Provides blockchain oracle signal generation',
  
  actions: [generateTop3SignalsAction],
};
