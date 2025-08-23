import { Plugin } from '@elizaos/core';
import { generateHashtagsAction } from '../actions/hashtagActions';
import hashtagsProvider, { hashtagsTable } from '../providers/keywords-generator';

export const keywordsGeneratorPlugin: Plugin = {
  name: 'keywords-generator-plugin',
  description: 'Provides keywords generation',
  
  schema: [hashtagsTable],
  actions: [generateHashtagsAction],
  providers: [hashtagsProvider],
};