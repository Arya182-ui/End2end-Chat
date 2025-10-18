import React from 'react';
import { Shield, Lock, Eye, Server } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/95 backdrop-blur-xl border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Security Features */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Security Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-400" />
                RSA-OAEP 2048-bit encryption
              </li>
              <li className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-green-400" />
                Private keys never leave device
              </li>
              <li className="flex items-center gap-2">
                <Server className="w-4 h-4 text-green-400" />
                No message history stored
              </li>
            </ul>
          </div>

          {/* How It Works */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
            <ol className="space-y-2 text-sm text-gray-400">
              <li>1. Create or join a secure session</li>
              <li>2. RSA keys generated in your browser</li>
              <li>3. Messages encrypted before sending</li>
              <li>4. Only you can decrypt received messages</li>
            </ol>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">About SecureChat</h3>
            <p className="text-sm text-gray-400 mb-4">
              A demonstration of end-to-end encryption using modern web technologies. 
              Built with React, Firebase, and Web Crypto API.
            </p>
            <p className="text-xs text-gray-500">
              Made with ❤️ for privacy and security
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © 2025 SecureChat. Open source and privacy-focused.
          </p>
        </div>
      </div>
    </footer>
  );
};
