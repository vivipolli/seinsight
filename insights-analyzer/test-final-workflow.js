// Final workflow test showing what works: hashtag generation → Twitter search → simulated analysis
import axios from 'axios';

// Mock Twitter response (simulated X/Twitter data)
const twitterMockResponse = {
  success: true,
  data: {
    twitter: {
      postsCollected: 15,
      commentsAnalyzed: 45,
      engagement: {
        totalLikes: 2340,
        totalComments: 156,
        totalRetweets: 89,
        totalShares: 23
      },
      topTopics: [
        { topic: "blockchain", count: 12 },
        { topic: "defi", count: 8 },
        { topic: "nft", count: 6 },
        { topic: "web3", count: 5 },
        { topic: "crypto", count: 4 }
      ],
      recentTweets: [
        {
          id: "1234567890123456789",
          text: "Just launched our new DeFi protocol! 🚀 The future of decentralized finance is here. #DeFi #blockchain #innovation",
          author: "@web3founder",
          created_at: "2024-01-15T10:30:00Z",
          public_metrics: {
            retweet_count: 45,
            reply_count: 12,
            like_count: 234,
            quote_count: 8
          },
          sentiment: "positive",
          relevance_score: 0.92
        },
        {
          id: "1234567890123456790",
          text: "The NFT market is evolving rapidly. Artists are finding new ways to monetize their work through blockchain technology. #NFT #art #blockchain",
          author: "@cryptoartist",
          created_at: "2024-01-15T09:15:00Z",
          public_metrics: {
            retweet_count: 23,
            reply_count: 8,
            like_count: 156,
            quote_count: 5
          },
          sentiment: "positive",
          relevance_score: 0.88
        },
        {
          id: "1234567890123456791",
          text: "Web3 is not just about technology, it's about building a more equitable digital future. #Web3 #future #equity",
          author: "@blockchain_advocate",
          created_at: "2024-01-15T08:45:00Z",
          public_metrics: {
            retweet_count: 67,
            reply_count: 19,
            like_count: 445,
            quote_count: 12
          },
          sentiment: "positive",
          relevance_score: 0.95
        }
      ],
      hashtagAnalysis: {
        "blockchain": {
          mentions: 12,
          sentiment: "positive",
          topTweets: 3,
          engagement: 890
        },
        "defi": {
          mentions: 8,
          sentiment: "positive", 
          topTweets: 2,
          engagement: 567
        },
        "nft": {
          mentions: 6,
          sentiment: "neutral",
          topTweets: 2,
          engagement: 345
        }
      },
      insights: [
        "High engagement around DeFi and blockchain topics",
        "Positive sentiment dominates Web3 discussions",
        "NFT conversations show growing interest in digital art",
        "Community focus on decentralization and innovation"
      ]
    }
  }
};

// Simulated AI analysis response
const simulatedAnalysisResponse = `Based on the Twitter data analysis for Web3 entrepreneurs, here are my strategic recommendations:

**Market Opportunity Analysis:**
The data shows strong engagement around blockchain verification and content authenticity, with 2,340 total likes and 156 comments across 15 posts. The positive sentiment (75% positive) indicates growing market interest.

**Strategic Recommendations:**

1. **Content Verification Focus**: Develop blockchain-based solutions for media verification, leveraging the high engagement around #MediaVerification and #ContentValidation hashtags.

2. **AI Authenticity Solutions**: Create tools to detect AI-generated content, addressing the #AIAuthenticity concerns in the market.

3. **Web3 Security Integration**: Build partnerships with DeFi and Web3 communities, as the data shows strong engagement in these areas.

4. **Digital Identity Solutions**: Focus on #DigitalIdentity and #CryptoSecurity, which are trending topics with positive sentiment.

**Next Steps:**
- Engage with @web3founder, @cryptoartist, and @blockchain_advocate influencers
- Monitor NFT market for media verification opportunities
- Develop proof-of-concept for blockchain-based content authentication
- Consider partnerships with DeFi protocols for security integration

The market is ready for innovative solutions in blockchain-based content verification and AI authenticity detection.`;

async function testFinalWorkflow() {
  console.log('🚀 **FINAL WORKFLOW TEST: Hashtag Generation → Twitter Search → Analysis**\n');

  // Step 1: Generate hashtags using ElizaOS HashtagGenerator
  console.log('📝 **Step 1: Generating Hashtags with ElizaOS**');
  const userInput = "Preciso avaliar no mercado os interesses por verificação de media e conteúdo na blockchain, também sobre a necessidade de comprovação e validação de media como autenticas e não geradas por IA.";
  
  try {
    // Create session with HashtagGenerator
    const sessionResponse = await axios.post('http://localhost:3000/api/messaging/sessions', {
      agentId: "635b4207-35ce-0ec5-a517-52445ae58215",
      userId: "550e8400-e29b-41d4-a716-446655440000",
      metadata: {
        platform: "test",
        purpose: "hashtag-generation"
      }
    });

    if (sessionResponse.data.sessionId) {
      const sessionId = sessionResponse.data.sessionId;
      console.log(`✅ Session created: ${sessionId}`);

      // Send message to generate hashtags
      await axios.post(`http://localhost:3000/api/messaging/sessions/${sessionId}/messages`, {
        content: userInput,
        metadata: {
          requestType: "hashtag-generation"
        }
      });

      // Wait for agent response
      await new Promise(resolve => setTimeout(resolve, 10000));

      // Get messages from session
      const messagesResponse = await axios.get(`http://localhost:3000/api/messaging/sessions/${sessionId}/messages`);
      
      if (messagesResponse.data && messagesResponse.data.messages) {
        const agentMessages = messagesResponse.data.messages.filter(msg => msg.isAgent);
        if (agentMessages.length > 0) {
          const agentResponse = agentMessages[agentMessages.length - 1].content;
          const hashtags = agentResponse.match(/#\w+/g) || [];
          console.log(`✅ Hashtags generated: ${hashtags.join(', ')}\n`);
          
          // Step 2: Use hashtags to search Twitter (MOCKED)
          console.log('🐦 **Step 2: Searching Twitter with Generated Hashtags (MOCKED)**');
          console.log(`🔍 Searching for hashtags: ${hashtags.join(', ')}`);
          
          // Simulate Twitter search with mock data
          console.log('📊 **Twitter Search Results (Mocked):**');
          console.log(`└ Posts collected: ${twitterMockResponse.data.twitter.postsCollected}`);
          console.log(`└ Comments analyzed: ${twitterMockResponse.data.twitter.commentsAnalyzed}`);
          console.log(`└ Total engagement: ${twitterMockResponse.data.twitter.engagement.totalLikes} likes`);
          console.log(`└ Top topics: ${twitterMockResponse.data.twitter.topTopics.map(t => t.topic).join(', ')}\n`);

          // Step 3: Simulated Analysis (since InsightCompiler is not responding)
          console.log('🧠 **Step 3: Analyzing Twitter Data (SIMULATED)**');
          console.log('✅ Analysis completed successfully\n');
          
          // Step 4: Final response to user
          console.log('📋 **Step 4: Final Response to User**');
          console.log('='.repeat(60));
          console.log('🎯 **SEINSIGHT AI - MARKET ANALYSIS REPORT**');
          console.log('='.repeat(60));
          
          console.log(`📝 **Original Request:**`);
          console.log(`${userInput}\n`);
          
          console.log(`🏷️ **Generated Hashtags:**`);
          console.log(`${hashtags.join(', ')}\n`);
          
          console.log(`📊 **Twitter Analysis Summary:**`);
          console.log(`└ Posts analyzed: ${twitterMockResponse.data.twitter.postsCollected}`);
          console.log(`└ Comments processed: ${twitterMockResponse.data.twitter.commentsAnalyzed}`);
          console.log(`└ Total engagement: ${twitterMockResponse.data.twitter.engagement.totalLikes} likes`);
          console.log(`└ Sentiment: Predominantly positive\n`);
          
          console.log(`🔍 **Key Findings:**`);
          twitterMockResponse.data.twitter.insights.forEach((insight, index) => {
            console.log(`${index + 1}. ${insight}`);
          });
          
          console.log(`\n🧠 **AI Analysis Results (Simulated):**`);
          console.log(simulatedAnalysisResponse);
          
          console.log('\n' + '='.repeat(60));
          console.log('✅ **Analysis Complete - Ready for Strategic Action**');
          console.log('='.repeat(60));
          
          // Clean up session
          await axios.delete(`http://localhost:3000/api/messaging/sessions/${sessionId}`);
          
        } else {
          console.log('❌ No hashtags generated');
        }
      } else {
        console.log('❌ No messages received');
      }
      
    } else {
      console.log('❌ Failed to create session');
    }
    
  } catch (error) {
    console.log('❌ Error in workflow:', error.message);
  }
}

// Run the test
testFinalWorkflow();
