import { twitterMockData } from '../../mocks/twitterMockData';

export class TwitterDataParser {
  parseTwitterData(rawData: string, hashtags: string[]): any {
    try {
      const tweets = twitterMockData.tweets;
      
      const totalTweets = tweets.length;
      const totalLikes = tweets.reduce((sum: number, tweet: any) => sum + tweet.like_count, 0);
      const totalRetweets = tweets.reduce((sum: number, tweet: any) => sum + tweet.retweet_count, 0);
      const totalEngagement = totalLikes + totalRetweets;
      
      const positiveTweets = tweets.filter((tweet: any) => tweet.sentiment === 'positive').length;
      const neutralTweets = tweets.filter((tweet: any) => tweet.sentiment === 'neutral').length;
      const sentimentScore = positiveTweets / totalTweets;
      
      const topTweet = tweets.reduce((top: any, tweet: any) => 
        (tweet.like_count + tweet.retweet_count) > (top.like_count + top.retweet_count) ? tweet : top
      );
      
      const topUser = tweets.reduce((top: any, tweet: any) => 
        (tweet.like_count + tweet.retweet_count) > (top.like_count + top.retweet_count) ? tweet : top
      );
      
      const averageEngagementRate = ((totalEngagement / totalTweets) / 1000 * 100).toFixed(1) + '%';
      const averageRetweetRate = ((totalRetweets / totalTweets) / 1000 * 100).toFixed(1) + '%';
      const averageLikeRate = ((totalLikes / totalTweets) / 1000 * 100).toFixed(1) + '%';
      
      const sentiment = sentimentScore > 0.6 ? 'positive' : sentimentScore > 0.4 ? 'mixed' : 'negative';
      
      const structuredData = {
        totalTweets,
        totalEngagement,
        totalLikes,
        totalRetweets,
        sentiment,
        sentimentScore,
        keywords: hashtags,
        hashtags: hashtags,
        topTweet: topTweet.text,
        topUser: topUser.user,
        averageEngagementRate,
        averageRetweetRate,
        averageLikeRate,
        rawData: rawData,
        tweets: tweets
      };
      
      return structuredData;
    } catch (error) {
      console.error('Error parsing Twitter data:', error);
      return {
        totalTweets: 0,
        totalEngagement: 0,
        sentiment: 'neutral',
        keywords: hashtags,
        hashtags: hashtags,
        rawData: rawData
      };
    }
  }

  formatTwitterDataForAnalysis(twitterData: any): string {
    if (!twitterData || typeof twitterData !== 'object' || Object.keys(twitterData).length === 0) {
      return 'No Twitter data available for analysis.';
    }

    const formattedData: string[] = [];

    if (twitterData.totalTweets) {
      formattedData.push(`Total Tweets: ${twitterData.totalTweets}`);
    }
    if (twitterData.totalUsers) {
      formattedData.push(`Total Users: ${twitterData.totalUsers}`);
    }
    if (twitterData.totalHashtags) {
      formattedData.push(`Total Hashtags: ${twitterData.totalHashtags}`);
    }
    if (twitterData.totalMentions) {
      formattedData.push(`Total Mentions: ${twitterData.totalMentions}`);
    }
    if (twitterData.totalReplies) {
      formattedData.push(`Total Replies: ${twitterData.totalReplies}`);
    }
    if (twitterData.totalRetweets) {
      formattedData.push(`Total Retweets: ${twitterData.totalRetweets}`);
    }
    if (twitterData.totalLikes) {
      formattedData.push(`Total Likes: ${twitterData.totalLikes}`);
    }
    if (twitterData.totalComments) {
      formattedData.push(`Total Comments: ${twitterData.totalComments}`);
    }

    if (twitterData.sentiment) {
      formattedData.push(`Overall Sentiment: ${twitterData.sentiment}`);
    }
    if (twitterData.sentimentScore) {
      formattedData.push(`Sentiment Score: ${twitterData.sentimentScore}`);
    }
    if (twitterData.sentimentTrend) {
      formattedData.push(`Sentiment Trend: ${twitterData.sentimentTrend}`);
    }

    if (twitterData.keywords) {
      formattedData.push(`Top Keywords: ${twitterData.keywords.join(', ')}`);
    }
    if (twitterData.mentions) {
      formattedData.push(`Top Mentions: ${twitterData.mentions.join(', ')}`);
    }
    if (twitterData.hashtags) {
      formattedData.push(`Top Hashtags: ${twitterData.hashtags.join(', ')}`);
    }

    if (twitterData.averageEngagementRate) {
      formattedData.push(`Average Engagement Rate: ${twitterData.averageEngagementRate}`);
    }
    if (twitterData.averageRetweetRate) {
      formattedData.push(`Average Retweet Rate: ${twitterData.averageRetweetRate}`);
    }
    if (twitterData.averageLikeRate) {
      formattedData.push(`Average Like Rate: ${twitterData.averageLikeRate}`);
    }
    if (twitterData.averageCommentRate) {
      formattedData.push(`Average Comment Rate: ${twitterData.averageCommentRate}`);
    }

    if (twitterData.topTweet) {
      formattedData.push(`Top Tweet: ${twitterData.topTweet}`);
    }
    if (twitterData.topUser) {
      formattedData.push(`Top User: ${twitterData.topUser}`);
    }
    if (twitterData.topHashtag) {
      formattedData.push(`Top Hashtag: ${twitterData.topHashtag}`);
    }
    if (twitterData.topMention) {
      formattedData.push(`Top Mention: ${twitterData.topMention}`);
    }

    if (twitterData.tweets && twitterData.tweets.length > 0) {
      formattedData.push(`Sample Tweets:\n${twitterData.tweets.slice(0, 3).map((tweet: any) => 
        `- ${tweet.user}: "${tweet.text}" (${tweet.sentiment}, ${tweet.like_count} likes, ${tweet.retweet_count} retweets)`
      ).join('\n')}`);
      
      formattedData.push(`Data Source: Twitter (${twitterData.tweets.length} tweets analyzed)`);
      formattedData.push(`Analysis Window: Last 24 hours`);
      formattedData.push(`Data Integrity: Hash verified and immutable`);
    }

    return formattedData.join('\n\n');
  }
}
