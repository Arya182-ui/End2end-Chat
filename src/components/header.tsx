import { Shield, Github, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { DonationButtonCompact } from './DonationButton';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SecureChat
              </h1>
              <p className="text-xs text-gray-400">End-to-End Encrypted</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/encrypted-chat-features"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Features
            </Link>
            <Link
              to="/security-encryption"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Security
            </Link>
            <Link
              to="/about-securechat"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              About Us
            </Link>
            <a
              href="https://github.com/Arya182-ui/End2end-Chat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <DonationButtonCompact />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700/50 animate-fade-in">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/encrypted-chat-features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-800/50"
              >
                Features
              </Link>
              <Link
                to="/security-encryption"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-800/50"
              >
                Security
              </Link>
              <Link
                to="/about-securechat"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-800/50"
              >
                About Us
              </Link>
              <a
                href="https://github.com/Arya182-ui/End2end-Chat"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-800/50 flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
