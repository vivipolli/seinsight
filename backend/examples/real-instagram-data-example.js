// Exemplo de como trabalhar com dados reais do Instagram do Apify
// Baseado no formato JSON fornecido

const realInstagramPost = {
  "inputUrl": "https://www.instagram.com/humansofny",
  "url": "https://www.instagram.com/p/C3TTthZLoQK/",
  "type": "Image",
  "shortCode": "C3TTthZLoQK",
  "caption": "\"Biology gives you a brain. Life turns it into a mind.\" Jeffrey Eugenides\n\nCongolese Refugees\n\n#congolese #congo #drc #refugee #refugees #bw #bwphotography #sony #sonyalpha #humanity #mind",
  "hashtags": [],
  "mentions": [],
  "commentsCount": 1,
  "firstComment": "We love your posts blend ! Message us to be featured! 🔥",
  "latestComments": [],
  "dimensionsHeight": 720,
  "dimensionsWidth": 1080,
  "displayUrl": "https://scontent-lga3-2.cdninstagram.com/v/t51.2885-15/426457868_1775839306212473_2684687436495806019_n.jpg?stp=dst-jpg_e35_s1080x1080&_nc_ht=scontent-lga3-2.cdninstagram.com&_nc_cat=105&_nc_ohc=UxY2B6TAloEAX9nHKi1&edm=AP_V10EBAAAA&ccb=7-5&oh=00_AfBSNWqMiaU24y8nOwL5sx-NC7TuvyXB6jzOXhs7oaNvHQ&oe=65D3DB7E&_nc_sid=2999b8",
  "images": [],
  "alt": "Photo shared by Brian René Bergeron on February 13, 2024 tagging @natgeo, @life, @people, @humansofny, @voiceofcongo, @sonyalpha, @congo_on_the_map, and @sony. May be a black-and-white image of 2 people, child and text.",
  "likesCount": 40,
  "timestamp": "2024-02-13T20:49:57.000Z",
  "childPosts": [],
  "ownerFullName": "Brian René Bergeron",
  "ownerUsername": "blend603",
  "ownerId": "5566937141",
  "isSponsored": false
};

// Função para extrair hashtags do caption
function extractHashtagsFromCaption(caption) {
  if (!caption) return [];
  
  const hashtagRegex = /#[\w]+/g;
  const hashtags = caption.match(hashtagRegex);
  
  return hashtags ? hashtags.map(tag => tag.substring(1)) : [];
}

// Função para calcular engajamento
function calculateEngagement(post) {
  const likes = post.likesCount || 0;
  const comments = post.commentsCount || 0;
  return likes + comments;
}

// Função para extrair comentários
function extractComments(post) {
  const comments = [];
  
  // Adicionar primeiro comentário se existir
  if (post.firstComment) {
    comments.push({
      id: `first_${post.shortCode}`,
      text: post.firstComment,
      author: post.ownerUsername,
      timestamp: post.timestamp,
      likes: 0,
      isFirstComment: true
    });
  }
  
  // Adicionar comentários mais recentes
  if (post.latestComments && Array.isArray(post.latestComments)) {
    post.latestComments.forEach(comment => {
      comments.push({
        id: comment.id || Math.random().toString(36),
        text: comment.text || comment.comment || '',
        author: comment.author || comment.username || 'anonymous',
        timestamp: comment.timestamp || post.timestamp,
        likes: comment.likes || 0
      });
    });
  }
  
  return comments;
}

// Função para analisar post para insights de negócio
function analyzePostForBusiness(post, targetHashtag) {
  const hashtags = extractHashtagsFromCaption(post.caption);
  const engagement = calculateEngagement(post);
  const comments = extractComments(post);
  
  return {
    postId: post.shortCode,
    url: post.url,
    caption: post.caption,
    hashtags: hashtags,
    engagement: engagement,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    comments: comments,
    owner: {
      username: post.ownerUsername,
      fullName: post.ownerFullName,
      id: post.ownerId
    },
    timestamp: post.timestamp,
    isSponsored: post.isSponsored,
    // Análise específica para negócios
    businessRelevance: {
      hasTargetHashtag: hashtags.includes(targetHashtag),
      hashtagCount: hashtags.length,
      engagementRate: engagement / (post.likesCount || 1),
      hasBusinessKeywords: hasBusinessKeywords(post.caption),
      sentiment: analyzeSentiment(post.caption)
    }
  };
}

// Função para detectar palavras-chave de negócio
function hasBusinessKeywords(text) {
  if (!text) return false;
  
  const businessKeywords = [
    'business', 'startup', 'entrepreneur', 'growth', 'marketing',
    'sales', 'revenue', 'profit', 'strategy', 'innovation',
    'negócio', 'empreendedor', 'crescimento', 'vendas', 'lucro',
    'estratégia', 'inovação', 'mercado', 'cliente', 'produto'
  ];
  
  const lowerText = text.toLowerCase();
  return businessKeywords.some(keyword => lowerText.includes(keyword));
}

// Função simples de análise de sentimento
function analyzeSentiment(text) {
  if (!text) return 'neutral';
  
  const positiveWords = ['amazing', 'great', 'excellent', 'awesome', 'love', 'perfect', 'success', 'growth'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'failure', 'problem', 'difficult', 'challenge'];
  
  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// Exemplo de uso
function processInstagramData(posts, targetHashtag) {
  const processedPosts = posts.map(post => analyzePostForBusiness(post, targetHashtag));
  
  // Estatísticas gerais
  const stats = {
    totalPosts: processedPosts.length,
    totalEngagement: processedPosts.reduce((sum, post) => sum + post.engagement, 0),
    averageEngagement: processedPosts.reduce((sum, post) => sum + post.engagement, 0) / processedPosts.length,
    postsWithTargetHashtag: processedPosts.filter(post => post.businessRelevance.hasTargetHashtag).length,
    businessRelevantPosts: processedPosts.filter(post => post.businessRelevance.hasBusinessKeywords).length,
    sentimentDistribution: {
      positive: processedPosts.filter(post => post.businessRelevance.sentiment === 'positive').length,
      negative: processedPosts.filter(post => post.businessRelevance.sentiment === 'negative').length,
      neutral: processedPosts.filter(post => post.businessRelevance.sentiment === 'neutral').length
    }
  };
  
  return {
    posts: processedPosts,
    stats: stats,
    insights: generateInsights(processedPosts, stats)
  };
}

// Gerar insights baseados nos dados
function generateInsights(posts, stats) {
  const insights = [];
  
  if (stats.averageEngagement > 50) {
    insights.push({
      type: 'engagement',
      message: 'High engagement detected - content is resonating well',
      priority: 'high'
    });
  }
  
  if (stats.businessRelevantPosts > stats.totalPosts * 0.3) {
    insights.push({
      type: 'content',
      message: 'Good amount of business-relevant content found',
      priority: 'medium'
    });
  }
  
  if (stats.sentimentDistribution.positive > stats.sentimentDistribution.negative) {
    insights.push({
      type: 'sentiment',
      message: 'Positive sentiment dominates - good time for brand engagement',
      priority: 'medium'
    });
  }
  
  return insights;
}

// Teste com dados reais
console.log('=== Análise de Post Real ===');
const analysis = analyzePostForBusiness(realInstagramPost, 'humanity');
console.log(JSON.stringify(analysis, null, 2));

console.log('\n=== Estatísticas do Post ===');
console.log(`Engajamento: ${analysis.engagement}`);
console.log(`Hashtags: ${analysis.hashtags.join(', ')}`);
console.log(`Relevância para negócio: ${analysis.businessRelevance.hasBusinessKeywords}`);
console.log(`Sentimento: ${analysis.businessRelevance.sentiment}`);

module.exports = {
  extractHashtagsFromCaption,
  calculateEngagement,
  extractComments,
  analyzePostForBusiness,
  hasBusinessKeywords,
  analyzeSentiment,
  processInstagramData,
  generateInsights
};
