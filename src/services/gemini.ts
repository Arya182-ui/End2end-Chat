import { GoogleGenerativeAI } from '@google/generative-ai';

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true' || !import.meta.env.VITE_GEMINI_API_KEY;
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

if (!isDemoMode && API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export interface ModerationResult {
  isSafe: boolean;
  toxicityScore: number;
  categories: string[];
  warning?: string;
}

export interface SentimentResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  emoji: string;
}

export interface SmartReply {
  text: string;
  confidence: number;
}

/**
 * Moderate content for toxicity and inappropriate content
 */
export const moderateContent = async (text: string): Promise<ModerationResult> => {
  if (isDemoMode) {
    console.log('�� DEMO: Mock content moderation for:', text);
    
    // Simple keyword-based demo moderation
    const toxicKeywords = ['spam', 'hate', 'abuse', 'violence'];
    const lowerText = text.toLowerCase();
    const hasToxic = toxicKeywords.some(keyword => lowerText.includes(keyword));
    
    return {
      isSafe: !hasToxic,
      toxicityScore: hasToxic ? 0.8 : 0.1,
      categories: hasToxic ? ['potentially-toxic'] : [],
      warning: hasToxic ? 'This message may contain inappropriate content' : undefined
    };
  }

  if (!genAI) {
    return { isSafe: true, toxicityScore: 0, categories: [] };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' }, { apiVersion: 'v1' });
    
    const prompt = `Analyze this message for toxicity, hate speech, or inappropriate content. 
Rate toxicity from 0-1 (0=safe, 1=toxic).
Message: "${text}"

Respond in JSON format:
{
  "isSafe": boolean,
  "toxicityScore": number,
  "categories": ["category1", "category2"],
  "warning": "optional warning message"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Parse JSON response with error handling
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse moderation response:', parseError);
    }
    
    // Fallback
    return { isSafe: true, toxicityScore: 0, categories: [] };
  } catch (error) {
    console.error('❌ Moderation error:', error);
    return { isSafe: true, toxicityScore: 0, categories: [] };
  }
};

/**
 * Analyze message sentiment
 */
export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  if (isDemoMode) {
    console.log('🎭 DEMO: Mock sentiment analysis for:', text);
    
    // Simple demo sentiment
    const positiveWords = ['happy', 'great', 'good', 'love', 'excellent', 'thank', '👍', '😊', '❤️'];
    const negativeWords = ['sad', 'bad', 'hate', 'terrible', 'angry', '👎', '😢', '😡'];
    
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

  if (!genAI) {
    return { sentiment: 'neutral', score: 0, emoji: '😐' };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' }, { apiVersion: 'v1' });
    
    const prompt = `Analyze the sentiment of this message.
Message: "${text}"

Respond in JSON format:
{
  "sentiment": "positive" | "neutral" | "negative",
  "score": number (-1 to 1),
  "emoji": "appropriate emoji"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Parse JSON response with error handling
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse sentiment response:', parseError);
    }
    
    return { sentiment: 'neutral', score: 0, emoji: '😐' };
  } catch (error) {
    console.error('❌ Sentiment analysis error:', error);
    return { sentiment: 'neutral', score: 0, emoji: '😐' };
  }
};

/**
 * Generate smart reply suggestions
 */
export const generateSmartReplies = async (messageHistory: string[], count: number = 3): Promise<SmartReply[]> => {
  if (isDemoMode) {
    console.log('🎭 DEMO: Mock smart replies');
    
    // Demo smart replies
    return [
      { text: 'That sounds great!', confidence: 0.9 },
      { text: 'Tell me more', confidence: 0.85 },
      { text: 'I agree', confidence: 0.8 }
    ];
  }

  if (!genAI) {
    return [];
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' }, { apiVersion: 'v1' });
    
    const conversationContext = messageHistory.slice(-5).join('\n');
    const prompt = `Given this conversation, suggest ${count} appropriate short replies (max 10 words each):

${conversationContext}

Respond in JSON format:
[
  {"text": "reply 1", "confidence": 0.9},
  {"text": "reply 2", "confidence": 0.85}
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Parse JSON response with error handling
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Failed to parse smart replies response:', parseError);
    }
    
    return [];
  } catch (error) {
    console.error('❌ Smart reply error:', error);
    return [];
  }
};

/**
 * Check if Gemini AI is available
 */
export const isGeminiAvailable = (): boolean => {
  return isDemoMode || (!!genAI && !!API_KEY);
};
