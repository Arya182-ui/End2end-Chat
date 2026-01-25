import { useState, useEffect } from 'react';
import { initAdSense } from './AdSense';
import { Cookie, X, Settings } from 'lucide-react';

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      applyConsent(JSON.parse(consent));
    }
  }, []);

  const applyConsent = (consent: any) => {
    if (consent.analytics) {
      initGoogleAnalytics();
    }
    if (consent.ads) {
      initAdSense();
    }
  };

  const initGoogleAnalytics = () => {
    const gaId = import.meta.env.VITE_GA_TRACKING_ID;
    if (gaId && gaId !== '') {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', gaId);
    }
  };

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      ads: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    applyConsent(consent);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      ads: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    setShowBanner(false);
  };

  const handleSaveSettings = (settings: any) => {
    const consent = {
      necessary: true,
      ...settings,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    applyConsent(consent);
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {!showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 shadow-2xl animate-slide-up">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <Cookie className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 flex-shrink-0 mt-1" />
                <div className="text-white flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">We value your privacy</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    We use cookies to enhance your experience, serve ads, and analyze traffic.{' '}
                    <a 
                      href="/privacy-policy" 
                      className="text-blue-400 hover:text-blue-300 underline whitespace-nowrap"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/privacy-policy';
                      }}
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <button
                  onClick={handleRejectAll}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 active:scale-95 border border-gray-600"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 active:scale-95 border border-blue-500/50 flex items-center gap-2 justify-center"
                >
                  <Settings className="w-4 h-4" />
                  Manage
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 active:scale-95 shadow-lg"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-t-2xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-t sm:border border-gray-700 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 flex items-center justify-between rounded-t-2xl z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <h2 className="text-lg sm:text-2xl font-bold text-white">Privacy Settings</h2>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors active:scale-95"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <p className="text-sm sm:text-base text-gray-300">
                Customize your cookie preferences. Click on the categories to learn more.
              </p>

              <CookieToggle
                id="necessary"
                title="Strictly Necessary Cookies"
                description="Essential for the website to function. Cannot be disabled."
                enabled={true}
                locked={true}
                onChange={() => {}}
              />

              <CookieToggle
                id="analytics"
                title="Analytics Cookies"
                description="Help us understand how visitors use our website."
                enabled={true}
                locked={false}
                onChange={(checked) => {
                  const settings = {
                    analytics: checked,
                    ads: (document.getElementById('ads') as HTMLInputElement)?.checked || false
                  };
                  handleSaveSettings(settings);
                }}
              />

              <CookieToggle
                id="ads"
                title="Advertising Cookies"
                description="Used to show relevant ads and support our service."
                enabled={true}
                locked={false}
                onChange={(checked) => {
                  const settings = {
                    analytics: (document.getElementById('analytics') as HTMLInputElement)?.checked || false,
                    ads: checked
                  };
                  handleSaveSettings(settings);
                }}
              />
            </div>

            <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur p-4 sm:p-6 flex gap-3 border-t border-gray-700 rounded-b-2xl">
              <button
                onClick={handleRejectAll}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 active:scale-95"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg active:scale-95"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CookieToggle = ({ 
  id, 
  title, 
  description, 
  enabled, 
  locked, 
  onChange 
}: { 
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  locked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  const [isEnabled, setIsEnabled] = useState(enabled);

  const handleToggle = () => {
    if (locked) return;
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onChange(newValue);
  };

  return (
    <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>
        <div className="flex-shrink-0">
          <button
            id={id}
            type="button"
            onClick={handleToggle}
            disabled={locked}
            className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all duration-300 ${
              locked 
                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                : isEnabled 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                  : 'bg-gray-600 hover:bg-gray-500'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full transition-transform duration-300 shadow-lg ${
                isEnabled ? 'translate-x-6 sm:translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
      {locked && (
        <p className="text-xs text-gray-500 mt-2">
          ⚠️ Always Active
        </p>
      )}
    </div>
  );
};

export default CookieConsent;
