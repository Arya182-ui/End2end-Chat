import { Heart, Coffee } from 'lucide-react';

export const DonationButton = () => {
  return (
    <div className="inline-flex gap-2">
      {/* Buy Me a Coffee */}
      <a
        href="https://buymeacoffee.com/arya182"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/50"
      >
        <Coffee className="w-4 h-4" />
        <span className="hidden sm:inline">Buy Me a Coffee</span>
        <span className="sm:hidden">☕</span>
      </a>

      {/* GitHub Sponsors */}
      <a
        href="https://github.com/sponsors/Arya182-ui"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/50"
      >
        <Heart className="w-4 h-4" />
        <span className="hidden sm:inline">Sponsor</span>
        <span className="sm:hidden">💖</span>
      </a>
    </div>
  );
};

// Compact version for sidebar/header
export const DonationButtonCompact = () => {
  return (
    <a
      href="https://buymeacoffee.com/arya182"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black font-medium text-sm rounded-lg transition-all duration-200 transform hover:scale-105"
      title="Support SecureChat development"
    >
      <Coffee className="w-4 h-4" />
      <span>Support Us</span>
    </a>
  );
};
