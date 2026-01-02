import React from 'react';

export const TechBadge: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {/* Main Badge */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-3 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <div className="text-sm">
              <div className="font-semibold text-gray-800">Powered by Google</div>
              <div className="text-xs text-gray-600">Technologies</div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Pills */}
      <div className="flex flex-wrap gap-2 justify-end">
        <div className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-200">
          🔥 Firebase
        </div>
        <div className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-200">
          🌐 Translation API
        </div>
        <div className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full border border-purple-200">
          ✨ Gemini AI
        </div>
      </div>
    </div>
  );
};
