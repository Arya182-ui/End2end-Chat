import React, { useState, useEffect, useRef } from 'react';
import { Send, Shield, ShieldCheck, Users, X, Key, Image, Paperclip } from 'lucide-react';
import { FirebaseService, Message, PublicKey } from '../firebase/database';
import { CryptoService, KeyPair, HybridCryptoService } from '../crypto/encryption';
import { MessageBubble } from './MessageBubble';

interface ChatInterfaceProps {
  sessionId: string;
  userId: string;
  onLeave: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ sessionId, userId, onLeave }) => {
  const [messages, setMessages] = useState<Message[]>();
  const [peers, setPeers] = useState<PublicKey[]>([]);
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isKeyGenerated, setIsKeyGenerated] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firebaseService = useRef<FirebaseService | null>(null);

  useEffect(() => {
    initializeChat();
    return () => {
      // Cleanup listeners when component unmounts
      if (firebaseService.current) {
        // The listeners are cleaned up automatically when the component unmounts
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      // Generate RSA key pair
      const generatedKeyPair = await CryptoService.generateKeyPair();
      setKeyPair(generatedKeyPair);
      setIsKeyGenerated(true);

      // Initialize Firebase service
      firebaseService.current = new FirebaseService(sessionId, userId);

      // Export and save public key
      const publicKeyString = await CryptoService.exportPublicKey(generatedKeyPair.publicKey);
      await firebaseService.current.savePublicKey(publicKeyString);

      // Listen for peer public keys
      firebaseService.current.listenForPublicKeys((keys) => {
        setPeers(keys);
      });

      // Listen for messages
      firebaseService.current.listenForMessages((msgs) => {
        setMessages(msgs);
      });
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && !selectedImage) || !keyPair || !firebaseService.current || peers.length === 0) return;

    setIsEncrypting(true);

    try {
      // For now, send to the first peer (can be extended for group chat)
      const recipient = peers[0];
      const recipientPublicKey = await CryptoService.importPublicKey(recipient.publicKey);
      
      let messageContent = newMessage;
      
      // Handle image upload
      if (selectedImage) {
        const base64Image = await convertImageToBase64(selectedImage);
        messageContent = selectedImage.type.startsWith('image/') 
          ? `[IMAGE]${base64Image}` 
          : `[FILE]${selectedImage.name}:${base64Image}`;
      }
      
      // Use hybrid encryption for better handling of large messages/images
      const encryptedMessage = await HybridCryptoService.encryptLargeMessage(messageContent, recipientPublicKey);

      // Store the original message content for sender display
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        from: userId,
        to: recipient.userId,
        encrypted: encryptedMessage,
        timestamp: Date.now(),
        originalContent: messageContent, // Store original for sender
        type: selectedImage ? (selectedImage.type.startsWith('image/') ? 'image' : 'file') : 'text'
      };

      // Add to local messages immediately for sender
      setMessages(prev => [...(prev || []), tempMessage]);
      
      // Send to Firebase with original content for sender
      await firebaseService.current.sendMessage(recipient.userId, encryptedMessage, messageContent);
      setNewMessage('');
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsEncrypting(false);
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLeave = async () => {
    if (firebaseService.current) {
      await firebaseService.current.clearSession();
    }
    onLeave();
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col">
    <div className="sticky top-0 z-10 bg-gray-800/90 backdrop-blur-xl border-b border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Encrypted Chat</h1>
            <p className="text-sm text-gray-400">Session: <span className="font-mono">{sessionId}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            {isKeyGenerated ? (
              <div className="flex items-center gap-1 text-green-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Encrypted</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-yellow-400 animate-pulse">
                <Key className="w-4 h-4" />
                <span>Generating keys...</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-gray-400">
              <Users className="w-4 h-4" />
              <span>{peers.length + 1}</span>
            </div>
          </div>
          <button
            onClick={handleLeave}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-md"
            title="Leave chat"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {peers.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Waiting for others to join...</p>
            <p className="text-sm mt-2">Share the session code: <code className="bg-gray-700 px-2 py-1 rounded">{sessionId}</code></p>
          </div>
        ) : (
          messages?.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              keyPair={keyPair}
              isOwn={message.from === userId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

     {/* Sticky Input Bar */}
    {peers.length > 0 && (
      <div className="sticky bottom-0 z-10 bg-gray-800/90 backdrop-blur-xl border-t border-gray-700 p-4">
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-4 relative inline-block">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-w-xs max-h-32 rounded-lg border border-gray-600"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
              >
                ×
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 p-3 rounded-xl transition-colors"
            >
              <Image className="w-5 h-5" />
            </button>
            <div className="flex-1 bg-gray-700 rounded-xl border border-gray-600 focus-within:border-blue-500 transition-colors">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message... (Ctrl+Enter to send)"
                className="w-full bg-transparent text-white placeholder-gray-400 px-4 py-3 resize-none focus:outline-none"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={(!newMessage.trim() && !selectedImage) || isEncrypting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isEncrypting ? (
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
