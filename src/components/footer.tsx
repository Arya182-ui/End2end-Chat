import { Shield, Lock, Server, Key, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DonationButton } from './DonationButton';

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-6 lg:col-span-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-blue-600/20 p-2 rounded-xl border border-blue-500/30">
                <Shield className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                SecureChat
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Open-source, end-to-end encrypted messaging. 
              No tracking, no ads, just privacy.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/Arya182-ui" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/encrypted-chat-features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</Link>
              </li>
              <li>
                <Link to="/security-encryption" className="text-gray-400 hover:text-white transition-colors text-sm">Security</Link>
              </li>
              <li>
                <Link to="/about-securechat" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</Link>
              </li>
              <li>
                <a href="https://github.com/Arya182-ui/End2end-Chat/releases" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">Changelog</a>
              </li>
            </ul>
          </div>

           {/* Legal & Resources */}
           <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
              </li>
              <li>
                <a href="https://github.com/Arya182-ui/End2end-Chat/issues" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors text-sm">Report Issue</a>
              </li>
            </ul>
          </div>

          {/* Interaction Column */}
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 lg:col-span-4">
             <h3 className="text-sm font-bold text-white mb-2">Support the Project</h3>
             <p className="text-gray-400 text-xs mb-4">
                SecureChat is free and open source. Your support keeps it running.
             </p>
             <DonationButton />
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} SecureChat. Built with <Heart className="w-3 h-3 text-red-500 inline mx-1 fill-current" /> by Arya & Team.</p>
          </div>
          
          <div className="flex gap-4">
             <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                <Lock className="w-3 h-3" /> Encrypted
             </span>
             <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                <Server className="w-3 h-3" /> No Logs
             </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
