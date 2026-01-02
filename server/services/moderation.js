import dotenv from 'dotenv';

dotenv.config();

const isDemoMode = process.env.DEMO_MODE === 'true' || !process.env.GEMINI_API_KEY;

/**
 * Moderate content using Gemini AI (server-side for enhanced security)
 * Note: This is a simplified version. In production, use proper Gemini API setup
 */
export const moderateContent = async (text) => {
  if (isDemoMode) {
    console.log('🎭 DEMO: Mock content moderation');
    
    // Simple keyword-based demo moderation
    const toxicKeywords = ['spam', 'hate', 'abuse', 'violence', 'explicit'];
    const lowerText = text.toLowerCase();
    const hasToxic = toxicKeywords.some(keyword => lowerText.includes(keyword));
    
    return {
      isSafe: !hasToxic,
      toxicityScore: hasToxic ? 0.8 : 0.1,
      categories: hasToxic ? ['potentially-toxic'] : [],
      warning: hasToxic ? 'This message may contain inappropriate content' : undefined
    };
  }

  try {
    // In production, call Gemini API for content moderation
    // For now, return safe by default
    return {
      isSafe: true,
      toxicityScore: 0,
      categories: [],
      warning: undefined
    };
  } catch (error) {
    console.error('❌ Moderation error:', error);
    return {
      isSafe: true,
      toxicityScore: 0,
      categories: [],
      warning: undefined
    };
  }
};

/**
 * Analyze sentiment of message
 */
export const analyzeSentiment = async (text) => {
  if (isDemoMode) {
    console.log('🎭 DEMO: Mock sentiment analysis');
    
    const positiveWords = ['happy', 'great', 'good', 'love', 'excellent'];
    const negativeWords = ['sad', 'bad', 'hate', 'terrible', 'angry'];
    
    const lowerText = text.toLowerCase();
    const hasPositive = positiveWords.some(word => lowerText.includes(word));
    const hasNegative = negativeWords.some(word => lowerText.includes(word));
    
    if (hasPositive && !hasNegative) {
      return { sentiment: 'positive', score: 0.8, emoji: '😊' };
    } else if (hasNegative && !hasPositive) {
      return { sentiment: 'negative', score: -0.7, emoji: '😔' };
    }
    return { sentiment: 'neutral', score: 0, emoji: '😐' };
  }

  return { sentiment: 'neutral', score: 0, emoji: '😐' };
};

/**
 * Generate smart reply suggestions
 */
export const generateSmartReplies = async (messageHistory, count = 3) => {
  if (isDemoMode) {
    console.log('🎭 DEMO: Mock smart replies');
    return [
      { text: 'That sounds great!', confidence: 0.9 },
      { text: 'Tell me more', confidence: 0.85 },
      { text: 'I agree', confidence: 0.8 }
    ];
  }

  return [];
};
