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
      // Primary: use Eliza model to generate up to 3 hashtags
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

      const aiResponse = await runtime.useModel(prompt, {
        model: 'openrouter/mistralai/mistral-7b-instruct:free'
      });
      const raw = (typeof aiResponse === 'string' ? aiResponse : String(aiResponse)).trim();
      let hashtags = raw
        .split(/[\s,]+/)
        .map(h => h.trim())
        .filter(h => h.startsWith('#') && h.length > 1)
        .map(h => h.replace(/[^#a-zA-Z0-9_]/g, ''));

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
      }
    } catch {}

    // Fallback: backend API (also limited to max 3 on backend)
    try {
      const response = await fetch('http://localhost:8080/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessReport })
      });

      const result = await response.json() as any;

      if (result.success) {
        const all = Array.isArray(result.data?.hashtags?.generated)
          ? result.data.hashtags.generated
          : [];
        const hashtags = Array.from(new Set(all.map((h: string) => (h.startsWith('#') ? h : `#${h}`)))).slice(0, 3);

        const s = (runtime.character as any).settings || {};
        s.trackedHashtags = hashtags;
        s.keywords = hashtags;
        (runtime.character as any).settings = s;

        let responseText = `🎯 Hashtags:\n\n`;
        hashtags.forEach((h: string) => {
          responseText += `${h}\n`;
        });
        responseText += `\n📊 Count: ${hashtags.length} (max 3)`;

        return { success: true, text: responseText };
      } else {
        return { success: false, text: '❌ Failed to generate hashtags.' };
      }
    } catch (error) {
      return { success: false, text: '❌ Error generating hashtags. Please check your setup.' };
    }
  }
};

export const analyzeBusinessReportAction: Action = {
  name: 'ANALYZE_BUSINESS_REPORT',
  description: 'Analyze business report and extract key insights',

  validate: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    return content.toLowerCase().includes('analyze') ||
           content.toLowerCase().includes('business report') ||
           content.toLowerCase().includes('report') ||
           content.toLowerCase().includes('insights');
  },

  handler: async (runtime, message) => {
    const content = typeof message.content === 'string' ? message.content : message.content.text || '';
    const businessReport = content;

    try {
      const response = await fetch('http://localhost:8080/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessReport })
      });

      const result = await response.json() as any;

      if (result.success) {
        const insights = result.data?.insights;
        const summary = result.data?.businessReport?.summary;

        let responseText = `📊 Business Report Analysis:\n\n`;

        if (summary) {
          responseText += `📝 Report Summary:\n`;
          responseText += `└ Word Count: ${summary.wordCount}\n`;
          responseText += `└ Sentence Count: ${summary.sentenceCount}\n`;
          responseText += `└ Key Themes: ${summary.keyThemes?.join(', ')}\n`;
          responseText += `└ Overall Sentiment: ${summary.sentiment}\n\n`;
        }

        if (insights?.summary) {
          responseText += `💡 Key Insights:\n`;
          responseText += `└ Overall Sentiment: ${insights.summary.overallSentiment}\n`;
          responseText += `└ Top Topic: ${insights.summary.topTopic}\n`;
          responseText += `└ Main Trend: ${insights.summary.mainTrend}\n`;
          responseText += `└ Engagement Score: ${insights.summary.engagementScore}\n\n`;
        }

        return { success: true, text: responseText };
      } else {
        return { success: false, text: '❌ Failed to analyze business report.' };
      }
    } catch (error) {
      return { success: false, text: '❌ Error analyzing business report. Please check your backend connection.' };
    }
  }
};
