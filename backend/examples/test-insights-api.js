const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_USER_ID = 'user_123';

// Example business report
const businessReport = `
Esta semana foi muito desafiadora para nossa startup. Estamos enfrentando dificuldades 
com o crescimento de usuários e precisamos melhorar nossa estratégia de marketing digital. 
O time de vendas está trabalhando duro, mas os resultados não estão chegando como esperado. 
Identificamos algumas tendências interessantes no mercado de SaaS, especialmente relacionadas 
a automação e inteligência artificial. Precisamos focar em growth hacking e otimizar nossos 
canais de aquisição. A concorrência está se movendo rápido e não podemos ficar para trás.
`;

// Test functions
async function testGenerateInsights() {
  try {
    console.log('🧪 Testing insight generation...');
    
    const response = await axios.post(`${API_BASE_URL}/insights/generate`, {
      businessReport,
      options: {
        resultsLimit: 50,
        onlyPostsNewerThan: '1 week',
        maxConcurrent: 2
      }
    });
    
    console.log('✅ Insight generation successful!');
    console.log('📊 Generated hashtags:', response.data.data.hashtags.generated);
    console.log('📈 Engagement score:', response.data.data.performance.engagementScore);
    console.log('🎯 Key recommendation:', response.data.data.insights.summary.keyRecommendation);
    
    return response.data.data;
    
  } catch (error) {
    console.error('❌ Error generating insights:', error.response?.data || error.message);
    throw error;
  }
}

async function testScheduleInsights() {
  try {
    console.log('🧪 Testing insight scheduling...');
    
    const response = await axios.post(`${API_BASE_URL}/insights/schedule`, {
      userId: TEST_USER_ID,
      schedule: {
        frequency: 'weekly',
        dayOfWeek: 'monday',
        time: '09:00',
        enabled: true
      }
    });
    
    console.log('✅ Insight scheduling successful!');
    console.log('📅 Schedule ID:', response.data.scheduleId);
    console.log('⏰ Schedule:', response.data.data);
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error scheduling insights:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetInsightHistory() {
  try {
    console.log('🧪 Testing insight history...');
    
    const response = await axios.get(`${API_BASE_URL}/insights/history/${TEST_USER_ID}?limit=5`);
    
    console.log('✅ Insight history retrieved!');
    console.log('📚 History entries:', response.data.data.length);
    console.log('📊 Latest insight:', response.data.data[0]);
    
    return response.data.data;
    
  } catch (error) {
    console.error('❌ Error getting insight history:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetInsightStats() {
  try {
    console.log('🧪 Testing insight statistics...');
    
    const response = await axios.get(`${API_BASE_URL}/insights/stats/${TEST_USER_ID}`);
    
    console.log('✅ Insight statistics retrieved!');
    console.log('📈 Total insights:', response.data.data.totalInsights);
    console.log('📊 Average engagement:', response.data.data.averageEngagementScore);
    console.log('🏷️ Top hashtags:', response.data.data.topPerformingHashtags);
    
    return response.data.data;
    
  } catch (error) {
    console.error('❌ Error getting insight stats:', error.response?.data || error.message);
    throw error;
  }
}

async function testGetInsightById() {
  try {
    console.log('🧪 Testing get insight by ID...');
    
    const insightId = 'insight_1';
    const response = await axios.get(`${API_BASE_URL}/insights/${insightId}`);
    
    console.log('✅ Insight retrieved by ID!');
    console.log('🆔 Insight ID:', response.data.data.id);
    console.log('📅 Timestamp:', response.data.data.timestamp);
    console.log('🎯 Action items:', response.data.data.actionItems.length);
    
    return response.data.data;
    
  } catch (error) {
    console.error('❌ Error getting insight by ID:', error.response?.data || error.message);
    throw error;
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting Seinsight AI API Tests\n');
  
  try {
    // Test 1: Generate insights
    const insights = await testGenerateInsights();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 2: Schedule insights
    const schedule = await testScheduleInsights();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 3: Get insight history
    const history = await testGetInsightHistory();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 4: Get insight statistics
    const stats = await testGetInsightStats();
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 5: Get insight by ID
    const insight = await testGetInsightById();
    console.log('\n' + '='.repeat(50) + '\n');
    
    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Generated ${insights.hashtags.generated.length} hashtags`);
    console.log(`- Analyzed ${insights.socialMedia.commentsAnalyzed} comments`);
    console.log(`- Found ${insights.insights.opportunities.length} opportunities`);
    console.log(`- Created ${insights.actionItems.length} action items`);
    
  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testGenerateInsights,
  testScheduleInsights,
  testGetInsightHistory,
  testGetInsightStats,
  testGetInsightById,
  runAllTests
};
