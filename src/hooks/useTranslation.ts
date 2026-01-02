import { useState, useCallback } from 'react';
import { translateText, SUPPORTED_LANGUAGES, TranslationLanguage } from '../services/translation';

export interface TranslationState {
  enabled: boolean;
  targetLanguage: string;
  isTranslating: boolean;
}

export const useTranslation = () => {
  const [translationState, setTranslationState] = useState<TranslationState>({
    enabled: false,
    targetLanguage: 'en',
    isTranslating: false
  });

  const [translationCache, setTranslationCache] = useState<Map<string, string>>(new Map());

  const toggleTranslation = useCallback(() => {
    setTranslationState(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  }, []);

  const setTargetLanguage = useCallback((language: string) => {
    setTranslationState(prev => ({
      ...prev,
      targetLanguage: language
    }));
    // Clear cache when language changes
    setTranslationCache(new Map());
  }, []);

  const translate = useCallback(async (text: string, sourceLanguage?: string): Promise<string | null> => {
    if (!translationState.enabled) {
      return null;
    }

    // Check cache
    const cacheKey = `${text}-${translationState.targetLanguage}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    setTranslationState(prev => ({ ...prev, isTranslating: true }));

    try {
      const translated = await translateText(text, translationState.targetLanguage, sourceLanguage);
      
      if (translated) {
        // Update cache
        setTranslationCache(prev => {
          const newCache = new Map(prev);
          newCache.set(cacheKey, translated);
          return newCache;
        });
      }

      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return null;
    } finally {
      setTranslationState(prev => ({ ...prev, isTranslating: false }));
    }
  }, [translationState.enabled, translationState.targetLanguage, translationCache]);

  return {
    translationState,
    toggleTranslation,
    setTargetLanguage,
    translate,
    supportedLanguages: SUPPORTED_LANGUAGES
  };
};
