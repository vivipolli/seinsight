import { Action } from '@elizaos/core';

export const generateHashtagsAction: Action = {
  name: 'GENERATE_HASHTAGS',
  description: 'Generate relevant hashtags from business report',

  validate: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    return content.toLowerCase().includes('hashtag') ||
           content.toLowerCase().includes('business report') ||
           content.toLowerCase().includes('generate');
  },

  handler: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    const businessReport = content;

    try {
      const prompt = [
        'You are an AI that extracts up to 3 business-relevant hashtags from the following report.',
        'Rules:',
        '- Return ONLY the hashtags, comma-separated, no spaces, no extra text',
        '- Use # prefix, alphanumeric characters only',
        '- Maximum of 3 hashtags',
        '',
        'Report:',
        businessReport
      ].join('\n');

      const aiResponse = await runtime.useModel('TEXT_LARGE', {
        prompt: prompt
      });
      
      const raw = aiResponse.trim();
      let hashtags = raw
        .split(/[\s,]+/)
        .map((h: string) => h.trim())
        .filter((h: string) => h.startsWith('#') && h.length > 1)
        .map((h: string) => h.replace(/[^#a-zA-Z0-9_]/g, ''));

      const unique = Array.from(new Set(hashtags)).slice(0, 3);

      if (unique.length > 0) {
        // Persist for downstream agents
        const s = (runtime.character as any).settings || {};
        s.trackedHashtags = unique;
        s.keywords = unique;
        (runtime.character as any).settings = s;

        let responseText = `🎯 Hashtags:\n\n`;
        unique.forEach(h => {
          responseText += `${h}\n`;
        });
        responseText += `\n📊 Count: ${unique.length} (max 3)`;

        return { success: true, text: responseText };
      } else {
        return { success: false, text: '❌ No valid hashtags generated.' };
      }
    } catch (error) {
      return { success: false, text: '❌ Error generating hashtags. Please try again.' };
    }
  }
};


