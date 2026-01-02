/**
 * Translation Service using Google Cloud Translation API
 * Provides client-side translation after message decryption
 */

export interface TranslationLanguage {
  code: string;
  name: string;
  nativeName: string;
}

// Supported languages for hackathon demo
export const SUPPORTED_LANGUAGES: TranslationLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' }
];

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true' || !import.meta.env.VITE_FIREBASE_API_KEY;

// Demo translations for common phrases
const DEMO_TRANSLATIONS: Record<string, Record<string, string>> = {
  'hello': {
    'hi': 'नमस्ते',
    'es': 'hola',
    'fr': 'bonjour',
    'de': 'hallo',
    'ja': 'こんにちは',
    'zh': '你好',
    'ar': 'مرحبا',
    'pt': 'olá',
    'ru': 'привет',
    'ko': '안녕하세요',
    'it': 'ciao'
  },
  'thank you': {
    'hi': 'धन्यवाद',
    'es': 'gracias',
    'fr': 'merci',
    'de': 'danke',
    'ja': 'ありがとう',
    'zh': '谢谢',
    'ar': 'شكرا',
    'pt': 'obrigado',
    'ru': 'спасибо',
    'ko': '감사합니다',
    'it': 'grazie'
  },
  'how are you': {
    'hi': 'आप कैसे हैं',
    'es': 'cómo estás',
    'fr': 'comment allez-vous',
    'de': 'wie geht es dir',
    'ja': '元気ですか',
    'zh': '你好吗',
    'ar': 'كيف حالك',
    'pt': 'como você está',
    'ru': 'как дела',
    'ko': '어떻게 지내세요',
    'it': 'come stai'
  }
};

/**
 * Translate text using server-side API
 */
export const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'auto'
): Promise<string | null> => {
  // Demo mode - return mock translations
  if (isDemoMode) {
    console.log('🎭 DEMO: Mock translation', text, '->', targetLanguage);
    
    // Check for exact phrase matches
    const lowerText = text.toLowerCase();
    for (const [phrase, translations] of Object.entries(DEMO_TRANSLATIONS)) {
      if (lowerText.includes(phrase) && translations[targetLanguage]) {
        return `[DEMO] ${translations[targetLanguage]} (translated from "${text}")`;
      }
    }
    
    // Return demo message
    return `[DEMO Translation to ${targetLanguage}] ${text}`;
  }

  try {
    // Call server-side translation endpoint
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage,
        sourceLanguage
      })
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('❌ Translation error:', error);
    return null;
  }
};

/**
 * Detect language of text
 */
export const detectLanguage = async (text: string): Promise<string | null> => {
  if (isDemoMode) {
    // Simple heuristic for demo
    if (/[\u0900-\u097F]/.test(text)) return 'hi'; // Hindi
    if (/[\u4E00-\u9FFF]/.test(text)) return 'zh'; // Chinese
    if (/[\u0600-\u06FF]/.test(text)) return 'ar'; // Arabic
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja'; // Japanese
    return 'en'; // Default to English
  }

  try {
    const response = await fetch('/api/detect-language', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error('Language detection failed');
    }

    const data = await response.json();
    return data.language;
  } catch (error) {
    console.error('❌ Language detection error:', error);
    return null;
  }
};

/**
 * Get language name from code
 */
export const getLanguageName = (code: string): string => {
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
  return lang ? lang.name : code.toUpperCase();
};

/**
 * Check if translation is available
 */
export const isTranslationAvailable = (): boolean => {
  return isDemoMode || !!import.meta.env.VITE_FIREBASE_API_KEY;
};
