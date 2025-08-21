// Complete workflow test with X/Twitter data mocked
import axios from 'axios';

// Mock X/Twitter response data
const twitterMockData = {
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

async function testCompleteWorkflow() {
  console.log('🚀 **COMPLETE WORKFLOW TEST: Hashtag Generation → X/Twitter Search (Mocked) → Critical Analysis**\n');

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
      console.log('⏳ Waiting for hashtag generation...');
      await new Promise(resolve => setTimeout(resolve, 20000));

      // Get messages from session
      const messagesResponse = await axios.get(`http://localhost:3000/api/messaging/sessions/${sessionId}/messages`);
      
      if (messagesResponse.data && messagesResponse.data.messages) {
        const agentMessages = messagesResponse.data.messages.filter(msg => msg.isAgent);
        if (agentMessages.length > 0) {
          const agentResponse = agentMessages[agentMessages.length - 1].content;
          const hashtags = agentResponse.match(/#\w+/g) || [];
          console.log(`✅ Hashtags generated: ${hashtags.join(', ')}\n`);
          
          // Step 2: Use hashtags to search X/Twitter (MOCKED)
          console.log('🐦 **Step 2: Searching X/Twitter with Generated Hashtags (MOCKED)**');
          console.log(`🔍 Searching for hashtags: ${hashtags.join(', ')}`);
          
          // Simulate X/Twitter search with mock data
          console.log('📊 **X/Twitter Search Results (Mocked):**');
          console.log(`└ Posts collected: ${twitterMockData.data.twitter.postsCollected}`);
          console.log(`└ Comments analyzed: ${twitterMockData.data.twitter.commentsAnalyzed}`);
          console.log(`└ Total engagement: ${twitterMockData.data.twitter.engagement.totalLikes} likes`);
          console.log(`└ Top topics: ${twitterMockData.data.twitter.topTopics.map(t => t.topic).join(', ')}\n`);

          // Step 3: Critical Analysis with ElizaOS InsightCompiler
          console.log('🧠 **Step 3: Critical & Balanced Analysis with ElizaOS InsightCompiler**');
          
          // Create session with InsightCompiler
          const analysisSessionResponse = await axios.post('http://localhost:3000/api/messaging/sessions', {
            agentId: "3643e20d-b322-0e3e-a089-87f323dc94ad",
            userId: "550e8400-e29b-41d4-a716-446655440000",
            metadata: {
              platform: "test",
              purpose: "critical-analysis"
            }
          });

          if (analysisSessionResponse.data.sessionId) {
            const analysisSessionId = analysisSessionResponse.data.sessionId;
            console.log(`✅ Analysis session created: ${analysisSessionId}`);
            
            // Send analysis request with optimized prompt
            const analysisRequest = `Analyze this X/Twitter data for Web3 entrepreneurs with a critical and balanced perspective:

Hashtags: ${hashtags.join(', ')}
Business Context: ${userInput}

X/Twitter Data Summary:
- Posts: ${twitterMockData.data.twitter.postsCollected}
- Comments: ${twitterMockData.data.twitter.commentsAnalyzed}
- Engagement: ${twitterMockData.data.twitter.engagement.totalLikes} likes
- Top Topics: ${twitterMockData.data.twitter.topTopics.map(t => t.topic).join(', ')}

Key Insights:
${twitterMockData.data.twitter.insights.map(insight => `- ${insight}`).join('\n')}

Please provide a critical analysis that includes:
1. Market risks and challenges
2. Potential obstacles and limitations
3. Competitive landscape considerations
4. Realistic opportunities (not overly optimistic)
5. Potential failure points to watch for
6. Balanced recommendations considering both opportunities and risks

Be objective, data-driven, and avoid overly positive bias. Focus on actionable insights that help entrepreneurs make informed decisions.`;

            await axios.post(`http://localhost:3000/api/messaging/sessions/${analysisSessionId}/messages`, {
              content: analysisRequest,
              metadata: {
                requestType: "critical-analysis"
              }
            });

            console.log('⏳ Waiting for critical analysis...');
            // Wait for analysis response
            await new Promise(resolve => setTimeout(resolve, 25000));

            // Get analysis messages
            const analysisMessagesResponse = await axios.get(`http://localhost:3000/api/messaging/sessions/${analysisSessionId}/messages`);
            
            if (analysisMessagesResponse.data && analysisMessagesResponse.data.messages) {
              const analysisAgentMessages = analysisMessagesResponse.data.messages.filter(msg => msg.isAgent);
              if (analysisAgentMessages.length > 0) {
                const analysisResponse = analysisAgentMessages[analysisAgentMessages.length - 1].content;
                console.log('✅ Critical analysis completed successfully\n');
                
                // Step 4: Final response to user
                console.log('📋 **Step 4: Final Response to User**');
                console.log('='.repeat(60));
                console.log('🎯 **SEINSIGHT AI - CRITICAL MARKET ANALYSIS REPORT**');
                console.log('='.repeat(60));
                
                console.log(`📝 **Original Request:**`);
                console.log(`${userInput}\n`);
                
                console.log(`🏷️ **Generated Hashtags:**`);
                console.log(`${hashtags.join(', ')}\n`);
                
                console.log(`📊 **X/Twitter Analysis Summary:**`);
                console.log(`└ Posts analyzed: ${twitterMockData.data.twitter.postsCollected}`);
                console.log(`└ Comments processed: ${twitterMockData.data.twitter.commentsAnalyzed}`);
                console.log(`└ Total engagement: ${twitterMockData.data.twitter.engagement.totalLikes} likes`);
                console.log(`└ Sentiment: Predominantly positive\n`);
                
                console.log(`🔍 **Key Findings:**`);
                twitterMockData.data.twitter.insights.forEach((insight, index) => {
                  console.log(`${index + 1}. ${insight}`);
                });
                
                console.log(`\n🧠 **CRITICAL AI Analysis Results:**`);
                console.log(analysisResponse);
                
                console.log('\n' + '='.repeat(60));
                console.log('✅ **Complete Workflow Success - Ready for Informed Decision Making**');
                console.log('='.repeat(60));
                
                // Clean up sessions
                await axios.delete(`http://localhost:3000/api/messaging/sessions/${sessionId}`);
                await axios.delete(`http://localhost:3000/api/messaging/sessions/${analysisSessionId}`);
                
              } else {
                console.log('❌ No analysis response received from InsightCompiler');
              }
            }
          }
          
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
testCompleteWorkflow();
