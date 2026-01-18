import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, AlertCircle, Image as ImageIcon, Download, FileText, Film, Music, Package } from 'lucide-react';
import { Message } from '../services/websocket';
import { KeyPair, HybridCryptoService } from '../crypto/encryption';
import { GroupCryptoService } from '../crypto/groupEncryption';
import { logger } from '../utils/logger';

interface MessageBubbleProps {
  message: Message;
  keyPair: KeyPair | null;
  isOwn: boolean;
  senderName?: string;
  onDownload?: (senderId: string, fileName: string) => void;
  chatMode?: 'private' | 'group' | 'password';
  sessionKey?: CryptoKey | null;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  keyPair, 
  isOwn, 
  senderName, 
  onDownload,
  chatMode = 'group',
  sessionKey = null
}) => {
  const [decryptedText, setDecryptedText] = useState<string>('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptionError, setDecryptionError] = useState(false);

  useEffect(() => {
    if (message && !isOwn) {
      if (chatMode === 'group' && sessionKey) {
        logger.debug('🔓 Attempting to decrypt group message with session key');
        decryptGroupMessage();
      } else if ((chatMode === 'private' || chatMode === 'password') && keyPair) {
        logger.debug(`🔓 Attempting to decrypt ${chatMode} message with RSA key`);
        decryptPrivateMessage();
      }
    } else if (isOwn) {
      logger.debug('✅ Own message, showing original content');
    }
  }, [message, keyPair, sessionKey, chatMode]);

  const decryptGroupMessage = async () => {
    if (!sessionKey) return;

    setIsDecrypting(true);
    setDecryptionError(false);

    try {
      logger.debug('🔐 Decrypting group message with shared session key...');
      const decrypted = await GroupCryptoService.decryptMessage(message.encrypted, sessionKey);
      logger.debug('✅ Group decryption successful');
      setDecryptedText(decrypted);
    } catch (error) {
      logger.error('❌ Group decryption failed:', error);
      setDecryptionError(true);
    } finally {
      setIsDecrypting(false);
    }
  };

  const decryptPrivateMessage = async () => {
    if (!keyPair) return;

    setIsDecrypting(true);
    setDecryptionError(false);

    try {
      logger.debug(`🔐 Decrypting ${chatMode} message with RSA key...`);
      const decrypted = await HybridCryptoService.decryptLargeMessage(message.encrypted, keyPair.privateKey);
      logger.debug(`✅ ${chatMode} decryption successful`);
      setDecryptedText(decrypted);
    } catch (error) {
      // Silently handle - this is expected for messages encrypted with old keys after refresh
      // The UI will show the "Unable to decrypt" message with the lock icon
      logger.error(`❌ ${chatMode} decryption failed:`, error);
      setDecryptionError(true);
    } finally {
      setIsDecrypting(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getDisplayText = () => {
    if (isOwn) {
      // For own messages, show original content if available
      return message.originalContent || decryptedText || "Sending...";
    } else if (isDecrypting) {
      return "Decrypting...";
    } else if (decryptionError) {
      return "🔒 Unable to decrypt (sent before page refresh)";
    } else {
      return decryptedText || "Decrypting...";
    }
  };

  const getEncryptionIcon = () => {
    if (isOwn) {
      return <ShieldCheck className="w-3 h-3 text-green-400" />;
    } else if (isDecrypting) {
      return <Shield className="w-3 h-3 text-yellow-400 animate-pulse" />;
    } else if (decryptionError) {
      return <AlertCircle className="w-3 h-3 text-red-400" />;
    } else {
      return <ShieldCheck className="w-3 h-3 text-green-400" />;
    }
  };

  const renderMessageContent = () => {
    const text = getDisplayText();
    
    // Extract caption if present
    const [content, caption] = text.includes('|CAPTION|') 
      ? text.split('|CAPTION|')
      : [text, ''];
    
    // Image with optional caption
    if (content.startsWith('[IMAGE]')) {
      const base64Data = content.substring(7);
      
      const handleDownload = () => {
        const fileName = `image-${Date.now()}.png`;
        const link = document.createElement('a');
        link.href = base64Data;
        link.download = fileName;
        link.click();
        
        // Notify sender about download
        logger.debug('Download triggered');
        if (onDownload && !isOwn) {
          logger.debug('Calling onDownload callback');
          onDownload(message.from, fileName);
        }
      };
      
      return (
        <div className="space-y-2">
          <div className="relative group select-none">
            <img 
              src={base64Data} 
              alt="Shared image" 
              className="max-w-sm rounded-lg border border-gray-600 select-none"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
            {/* Watermark overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-white/10 text-4xl font-bold rotate-[-45deg] select-none">
                SECURE CHAT
              </div>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleDownload}
                className="bg-gray-900/80 hover:bg-gray-800 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
                title="Download image"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
          {caption && (
            <p className="text-sm mt-2 break-words">{caption}</p>
          )}
          <div className="flex items-center gap-1 text-xs opacity-70">
            <ImageIcon className="w-3 h-3" />
            <span>Image</span>
          </div>
        </div>
      );
    }
    
    // Video with optional caption
    if (content.startsWith('[VIDEO]')) {
      const [fileName, base64Data] = content.substring(7).split(':');
      
      const handleDownload = () => {
        const downloadName = fileName || `video-${Date.now()}.mp4`;
        const link = document.createElement('a');
        link.href = base64Data;
        link.download = downloadName;
        link.click();
        
        // Notify sender about download
        if (onDownload && !isOwn) {
          onDownload(message.from, downloadName);
        }
      };
      
      return (
        <div className="space-y-2">
          <div className="relative group">
            <video 
              controls 
              className="max-w-sm rounded-lg border border-gray-600"
              style={{ maxHeight: '300px' }}
            >
              <source src={base64Data} />
              Your browser doesn't support video playback.
            </video>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleDownload}
                className="bg-gray-900/80 hover:bg-gray-800 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
                title="Download video"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
          {caption && (
            <p className="text-sm mt-2 break-words">{caption}</p>
          )}
          <div className="flex items-center gap-1 text-xs opacity-70">
            <Film className="w-3 h-3" />
            <span>{fileName}</span>
          </div>
        </div>
      );
    }
    
    // Audio with optional caption
    if (content.startsWith('[AUDIO]')) {
      const [fileName, base64Data] = content.substring(7).split(':');
      
      const handleDownload = () => {
        const downloadName = fileName || `audio-${Date.now()}.mp3`;
        const link = document.createElement('a');
        link.href = base64Data;
        link.download = downloadName;
        link.click();
        
        // Notify sender about download
        if (onDownload && !isOwn) {
          onDownload(message.from, downloadName);
        }
      };
      
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <audio controls className="flex-1 max-w-sm">
              <source src={base64Data} />
              Your browser doesn't support audio playback.
            </audio>
            <button
              onClick={handleDownload}
              className="bg-gray-600/50 hover:bg-gray-600/70 text-white p-2 rounded-lg transition-colors flex-shrink-0"
              title="Download audio"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
          {caption && (
            <p className="text-sm mt-2 break-words">{caption}</p>
          )}
          <div className="flex items-center gap-1 text-xs opacity-70">
            <Music className="w-3 h-3" />
            <span>{fileName}</span>
          </div>
        </div>
      );
    }
    
    // File (PDF, DOC, APK, etc.) with optional caption
    if (content.startsWith('[FILE]')) {
      const parts = content.substring(6).split(':');
      const fileName = parts[0];
      const fileType = parts[1];
      const base64Data = parts[2];
      
      const getFileIcon = () => {
        if (fileType?.includes('pdf')) return <FileText className="w-8 h-8 text-red-400" />;
        if (fileType?.includes('word') || fileType?.includes('document')) return <FileText className="w-8 h-8 text-blue-400" />;
        if (fileType?.includes('sheet') || fileType?.includes('excel')) return <FileText className="w-8 h-8 text-green-400" />;
        if (fileType?.includes('zip') || fileType?.includes('rar')) return <Package className="w-8 h-8 text-yellow-400" />;
        if (fileType?.includes('apk')) return <Package className="w-8 h-8 text-green-500" />;
        return <Download className="w-8 h-8 text-gray-400" />;
      };
      
      const handleDownload = () => {
        const link = document.createElement('a');
        link.href = base64Data;
        link.download = fileName;
        link.click();
        
        // Notify sender about download
        if (onDownload && !isOwn) {
          onDownload(message.from, fileName);
        }
      };
      
      return (
        <div className="space-y-2">
          <div 
            onClick={handleDownload}
            className="flex items-center gap-3 p-3 bg-gray-600/50 rounded-lg hover:bg-gray-600/70 cursor-pointer transition-colors border border-gray-500"
          >
            <div className="flex-shrink-0">
              {getFileIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fileName}</p>
              <p className="text-xs opacity-70">Click to download</p>
            </div>
            <Download className="w-5 h-5 flex-shrink-0 opacity-70" />
          </div>
          {caption && (
            <p className="text-sm break-words">{caption}</p>
          )}
        </div>
      );
    }
    
    // Plain text
    return <span className="break-words whitespace-pre-wrap">{text}</span>;
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in mb-2 group`}>
      <div className={`
        relative max-w-[85%] sm:max-w-md transition-all duration-200
        ${decryptionError 
          ? 'bg-gray-800/90 border border-yellow-600/50' 
          : isOwn 
            ? 'bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-2xl rounded-tr-sm shadow-blue-900/20' 
            : 'glass-panel bg-gray-800/60 text-gray-100 rounded-2xl rounded-tl-sm border-gray-700/50'
        } 
        px-4 py-3 shadow-md hover:shadow-lg
      `}>
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            {/* Show sender name for incoming messages */}
            {!isOwn && senderName && (
              <div className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-1 truncate">
                {senderName}
              </div>
            )}
            
            <div className={`text-[15px] leading-relaxed ${
              decryptionError 
                ? 'text-yellow-200 italic font-medium' 
                : isOwn 
                  ? 'text-white/95' 
                  : 'text-gray-100'
            } break-words`}>
              {renderMessageContent()}
            </div>
            
            <div className="flex items-center justify-end mt-1.5 gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
               {decryptionError && (
                 <div className="flex items-center gap-1 text-yellow-500/80">
                   <AlertCircle className="w-3 h-3" />
                 </div>
               )}
               {!decryptionError && (
                 <div title="End-to-end encrypted">
                    <ShieldCheck className={`w-3 h-3 ${isOwn ? 'text-blue-200' : 'text-emerald-400'}`} />
                 </div>
               )}
              <span className={`text-[10px] font-medium ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
