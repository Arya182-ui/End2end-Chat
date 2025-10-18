import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, AlertCircle, Image as ImageIcon, Download } from 'lucide-react';
import { Message } from '../firebase/database';
import { CryptoService, KeyPair, HybridCryptoService } from '../crypto/encryption';

interface MessageBubbleProps {
  message: Message;
  keyPair: KeyPair | null;
  isOwn: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, keyPair, isOwn }) => {
  const [decryptedText, setDecryptedText] = useState<string>('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptionError, setDecryptionError] = useState(false);

  useEffect(() => {
    if (message && keyPair && !isOwn) {
      decryptMessage();
    }
  }, [message, keyPair]);

  const decryptMessage = async () => {
    if (!keyPair) return;

    setIsDecrypting(true);
    setDecryptionError(false);

    try {
      const decrypted = await HybridCryptoService.decryptLargeMessage(message.encrypted, keyPair.privateKey);
      setDecryptedText(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
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
      return "Failed to decrypt message";
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
    
    if (text.startsWith('[IMAGE]')) {
      const base64Data = text.substring(7); // Remove '[IMAGE]' prefix
      return (
        <div className="space-y-2">
          <img 
            src={base64Data} 
            alt="Shared image" 
            className="max-w-xs rounded-lg border border-gray-600"
          />
          <div className="flex items-center gap-1 text-xs">
            <ImageIcon className="w-3 h-3" />
            <span>Image</span>
          </div>
        </div>
      );
    } else if (text.startsWith('[FILE]')) {
      const [fileName, base64Data] = text.substring(6).split(':');
      return (
        <div className="flex items-center gap-2 p-2 bg-gray-600 rounded-lg">
          <Download className="w-4 h-4" />
          <span className="text-sm">{fileName}</span>
        </div>
      );
    }
    
    return <span className="break-words">{text}</span>;
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-700'} rounded-2xl px-4 py-3 shadow-lg`}>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <p className={`text-sm ${isOwn ? 'text-white' : 'text-gray-100'} break-words`}>
              {renderMessageContent()}
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                {getEncryptionIcon()}
                <span className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                  {decryptionError ? 'Error' : 'Encrypted'}
                </span>
              </div>
              <span className={`text-xs ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
