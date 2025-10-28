import { Shield, Lock, Server, Key, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DonationButton } from './DonationButton';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-9 h-9 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SecureChat
              </h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              End-to-end encrypted messaging with military-grade security. 
              No signup, no tracking, complete privacy.
            </p>
            <a
              href="https://github.com/Arya182-ui/End2end-Chat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-sm text-gray-300 hover:text-white rounded-lg transition-all duration-200 border border-gray-700/50 hover:border-gray-600"
            >
              <Github className="w-4 h-4" />
              <span>View on GitHub</span>
            </a>
            
            {/* Donation Section */}
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">💖 Support Development</p>
              <DonationButton />
            </div>
          </div>

          {/* Security & Features */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              Security Features
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  <Lock className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">RSA-2048 + AES-256</div>
                  <div className="text-xs text-gray-500">Military-grade encryption</div>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                  <Key className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Client-Side Keys</div>
                  <div className="text-xs text-gray-500">Never leave your device</div>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                  <Server className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Zero Persistence</div>
                  <div className="text-xs text-gray-500">In-memory sessions only</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <Link to="/encrypted-chat-features" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-0.5 transform duration-200">
                Features
              </Link>
              <Link to="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-0.5 transform duration-200">
                Privacy
              </Link>
              <Link to="/security-encryption" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-0.5 transform duration-200">
                Security
              </Link>
              <Link to="/terms-of-service" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-0.5 transform duration-200">
                Terms
              </Link>
              <Link to="/about-securechat" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-0.5 transform duration-200">
                About
              </Link>
              <Link to="/project-overview" className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-0.5 transform duration-200">
                Overview
              </Link>
              <a 
                href="https://github.com/Arya182-ui/End2end-Chat/blob/main/LICENSE" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-0.5 transform duration-200"
              >
                License
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2025 <span className="text-gray-400 font-medium">SecureChat</span>. Open source & privacy-focused.
            </p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-green-500/10 to-green-600/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20">
                ✓ Open Source
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-400 text-xs font-medium rounded-full border border-blue-500/20">
                ✓ No Tracking
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500/10 to-purple-600/10 text-purple-400 text-xs font-medium rounded-full border border-purple-500/20">
                ✓ E2E Encrypted
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
