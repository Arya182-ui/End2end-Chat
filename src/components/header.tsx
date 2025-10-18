import React from 'react';
import { Shield, Github, Heart } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/95 backdrop-blur-xl border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SecureChat
              </h1>
              <p className="text-xs text-gray-400">End-to-End Encrypted</p>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <a
              href="https://www.buymeacoffee.com/arya182"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-xl shadow transition"
              title="Buy me a coffee"
            >
              <img
                src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
                alt="Buy me a coffee"
                className="w-6 h-6"
              />
              Buy me a coffee
            </a>
          </div>


          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Features
            </a>
            <a
              href="#security"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Security
            </a>
            <a
              href="https://github.com/Arya182-ui/End2end-Chat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>

          </nav>
        </div>
      </div>
    </header>
  );
};
