import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, TrendingUp } from 'lucide-react';
import { generateSmartReplies, SmartReply, moderateContent, ModerationResult } from '../services/gemini';

interface AIAssistantProps {
  messageHistory: string[];
  onSelectReply: (reply: string) => void;
  lastMessage?: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  messageHistory,
  onSelectReply,
  lastMessage
}) => {
  const [smartReplies, setSmartReplies] = useState<SmartReply[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [moderation, setModeration] = useState<ModerationResult | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Generate smart replies when message history changes
  useEffect(() => {
    if (messageHistory.length > 0 && showSuggestions) {
      loadSmartReplies();
    }
  }, [messageHistory, showSuggestions]);

  // Moderate content when new message arrives
  useEffect(() => {
    if (lastMessage) {
      moderateMessage(lastMessage);
    }
  }, [lastMessage]);

  const loadSmartReplies = async () => {
    setIsLoadingReplies(true);
    try {
      const replies = await generateSmartReplies(messageHistory, 3);
      setSmartReplies(replies);
    } catch (error) {
      console.error('Error generating smart replies:', error);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const moderateMessage = async (text: string) => {
    try {
      const result = await moderateContent(text);
      if (!result.isSafe) {
        setModeration(result);
        setTimeout(() => setModeration(null), 5000); // Clear after 5 seconds
      }
    } catch (error) {
      console.error('Error moderating content:', error);
    }
  };

  return (
    <div className="space-y-3">
      {/* Content Moderation Warning */}
      {moderation && !moderation.isSafe && (
        <div className="bg-yellow-500/20 backdrop-blur-md rounded-lg p-3 border border-yellow-500/30">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-yellow-300">Content Warning</div>
              <div className="text-xs text-yellow-200 mt-1">
                {moderation.warning || 'This message may contain inappropriate content'}
              </div>
              {moderation.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {moderation.categories.map((category, index) => (
                    <span
                      key={index}
                      className="text-xs bg-yellow-600/30 text-yellow-200 px-2 py-0.5 rounded"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Smart Replies Panel */}
      {showSuggestions && (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-semibold text-white">AI Suggestions</h3>
            </div>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Hide
            </button>
          </div>

          {isLoadingReplies ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <TrendingUp className="w-4 h-4 animate-pulse" />
              <span>Generating suggestions...</span>
            </div>
          ) : smartReplies.length > 0 ? (
            <div className="space-y-2">
              {smartReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => onSelectReply(reply.text)}
                  className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/50 rounded-lg px-3 py-2 text-sm text-white transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span>{reply.text}</span>
                    <span className="text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {Math.round(reply.confidence * 100)}%
                    </span>
                  </div>
                </button>
              ))}
              <button
                onClick={loadSmartReplies}
                className="w-full text-center text-xs text-gray-400 hover:text-purple-400 py-1 transition-colors"
              >
                ↻ Refresh suggestions
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-400 text-center py-2">
              No suggestions available yet
            </div>
          )}

          <div className="text-xs text-gray-400 mt-3 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Powered by Gemini AI</span>
          </div>
        </div>
      )}

      {!showSuggestions && (
        <button
          onClick={() => setShowSuggestions(true)}
          className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          Show AI Suggestions
        </button>
      )}
    </div>
  );
};
