import { Translate } from '@google-cloud/translate/build/src/v2/index.js';
import dotenv from 'dotenv';

dotenv.config();

const isDemoMode = process.env.DEMO_MODE === 'true' || !process.env.GOOGLE_CLOUD_TRANSLATE_KEY;

let translateClient = null;

if (!isDemoMode && process.env.GOOGLE_CLOUD_TRANSLATE_KEY) {
  translateClient = new Translate({
    key: process.env.GOOGLE_CLOUD_TRANSLATE_KEY
  });
  console.log('✅ Google Cloud Translation client initialized');
} else {
  console.log('🎭 Translation running in DEMO MODE');
}

/**
 * Translate text to target language
 */
export const translateText = async (text, targetLanguage, sourceLanguage = null) => {
  if (isDemoMode || !translateClient) {
    console.log('🎭 DEMO: Mock translation', text, '->', targetLanguage);
    return `[DEMO Translation to ${targetLanguage}] ${text}`;
  }

  try {
    const options = {
      to: targetLanguage
    };
    
    if (sourceLanguage && sourceLanguage !== 'auto') {
      options.from = sourceLanguage;
    }

    const [translation] = await translateClient.translate(text, options);
    return translation;
  } catch (error) {
    console.error('❌ Translation error:', error);
    throw error;
  }
};

/**
 * Detect language of text
 */
export const detectLanguage = async (text) => {
  if (isDemoMode || !translateClient) {
    console.log('🎭 DEMO: Mock language detection');
    // Simple heuristic for demo
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
    if (/[\u0600-\u06FF]/.test(text)) return 'ar';
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
    return 'en';
  }

  try {
    const [detection] = await translateClient.detect(text);
    return detection.language;
  } catch (error) {
    console.error('❌ Language detection error:', error);
    throw error;
  }
};

/**
 * Get supported languages
 */
export const getSupportedLanguages = async () => {
  if (isDemoMode || !translateClient) {
    return [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'ja', name: 'Japanese' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' }
    ];
  }

  try {
    const [languages] = await translateClient.getLanguages();
    return languages;
  } catch (error) {
    console.error('❌ Error fetching languages:', error);
    throw error;
  }
};
