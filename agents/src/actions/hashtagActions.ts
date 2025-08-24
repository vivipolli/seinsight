import { Action } from '@elizaos/core';
import { hashtagsTable } from '../providers/keywords-generator';

export const generateHashtagsAction: Action = {
  name: 'GENERATE_HASHTAGS',
  description: 'Generate relevant hashtags from business report',  

  validate: async (runtime, message) => { return true; },


  handler: async (runtime, message) => {
    console.log('🔍 GENERATE_HASHTAGS handler called!');

    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    const businessReport = content;

    try {
      const prompt = [
        'You are an AI that generates up to 10 business-relevant hashtags from the following report.',
        'Rules:',
        '- Return ONLY the hashtags, comma-separated, no spaces, no extra text',
        '- Use # prefix, alphanumeric characters only',
        '- Maximum of 10 hashtags',
        '',
        'Report:',
        businessReport
      ].join('\n');

      const aiResponse = await runtime.useModel('TEXT_SMALL', {
        prompt: prompt
      });
      
      const raw = aiResponse.trim();
      let hashtags = raw
        .split(/[\s,]+/)
        .map((h: string) => h.trim())
        .filter((h: string) => h.startsWith('#') && h.length > 1)
        .map((h: string) => h.replace(/[^#a-zA-Z0-9_]/g, ''));

      const unique = Array.from(new Set(hashtags)).slice(0, 10);

      if (unique.length > 0) {
        // Save hashtags to database for sharing with other agents
        const db = runtime.db;
        
        try {
          await db.insert(hashtagsTable).values({
            userId: message.entityId || 'default',
            agentId: runtime.character.name,
            hashtags: unique,
            businessReport: businessReport.substring(0, 1000), // Limit report length
          });
          console.log('🔍 Database insert completed successfully');
        } catch (dbError) {
          console.log('🔍 Database insert error:', dbError);
          throw dbError;
        }

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
        responseText += `\n💾 Saved to database for sharing with other agents`;

        console.log('🔍 Returning response:', responseText);
        return { success: true, text: responseText };
      } else {
        return { success: false, text: '❌ No valid hashtags generated.' };
      }
    } catch (error) {
      console.log('🔍 Error in handler:', error);
      return { success: false, text: '❌ Error generating hashtags. Please try again.' };
    }
  }
};




