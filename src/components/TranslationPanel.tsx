import React from 'react';
import { Languages, Globe } from 'lucide-react';
import { TranslationLanguage } from '../services/translation';

interface TranslationPanelProps {
  enabled: boolean;
  targetLanguage: string;
  supportedLanguages: TranslationLanguage[];
  onToggle: () => void;
  onLanguageChange: (language: string) => void;
  isTranslating?: boolean;
}

export const TranslationPanel: React.FC<TranslationPanelProps> = ({
  enabled,
  targetLanguage,
  supportedLanguages,
  onToggle,
  onLanguageChange,
  isTranslating = false
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Auto-Translate</h3>
        </div>
        
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-green-500' : 'bg-gray-400'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="space-y-2">
          <label className="text-xs text-gray-300">Translate to:</label>
          <select
            value={targetLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-gray-800">
                {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>

          {isTranslating && (
            <div className="flex items-center gap-2 text-xs text-blue-400">
              <Languages className="w-4 h-4 animate-pulse" />
              <span>Translating...</span>
            </div>
          )}

          <div className="text-xs text-gray-400 mt-2">
            💡 Messages will be auto-translated to your selected language
          </div>
        </div>
      )}
    </div>
  );
};
