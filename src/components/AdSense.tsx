// Google AdSense Component
// Use this after getting AdSense approval

import { useEffect, useRef } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
}

export const AdSense = ({ adSlot, adFormat = 'auto', className = '' }: AdSenseProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoadedRef = useRef(false);
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;

  // Don't show ads if client ID not configured
  if (!clientId || clientId === 'ca-pub-XXXXXXXXXXXXXXXX') {
    return null;
  }

  useEffect(() => {
    // Prevent duplicate loading
    if (isLoadedRef.current || !adRef.current) return;
    
    const adElement = adRef.current.querySelector('.adsbygoogle');
    if (!adElement) return;
    
    // Check if ad already has content or is already processed
    if (adElement.innerHTML.trim() !== '' || adElement.getAttribute('data-adsbygoogle-status')) {
      console.log('AdSense: Ad already loaded, skipping...');
      return;
    }

    try {
      // Initialize adsbygoogle array if not exists
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []);
      
      // Add timeout to ensure DOM is ready
      setTimeout(() => {
        try {
          // Push ad configuration
          ((window as any).adsbygoogle).push({});
          isLoadedRef.current = true;
          console.log('AdSense: Ad loaded successfully');
        } catch (error) {
          console.error('AdSense push error:', error);
        }
      }, 100);
      
    } catch (error) {
      console.error('AdSense error:', error);
    }

    // Cleanup on unmount
    return () => {
      if (adElement) {
        adElement.innerHTML = '';
        adElement.removeAttribute('data-adsbygoogle-status');
      }
      isLoadedRef.current = false;
    };
  }, []);

  return (
    <div ref={adRef} className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Initialize AdSense script
export const initAdSense = () => {
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  
  if (!clientId || clientId === 'ca-pub-XXXXXXXXXXXXXXXX') {
    console.log('AdSense: Client ID not configured, skipping initialization');
    return;
  }

  // Check if script already loaded
  const existingScript = document.querySelector(`script[src*="adsbygoogle.js"]`);
  if (existingScript) {
    console.log('AdSense: Script already loaded');
    return;
  }

  const script = document.createElement('script');
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  script.async = true;
  script.crossOrigin = 'anonymous';
  
  script.onload = () => {
    console.log('AdSense: Script loaded successfully');
    // Initialize adsbygoogle array
    (window as any).adsbygoogle = (window as any).adsbygoogle || [];
  };
  
  script.onerror = () => {
    console.error('AdSense: Script failed to load - check network connection or ad blocker');
  };
  
  document.head.appendChild(script);
};

// Cleanup function to remove ads and reset state
export const cleanupAdSense = () => {
  const adElements = document.querySelectorAll('.adsbygoogle');
  adElements.forEach(ad => {
    // Clear all ad-related attributes and content
    ad.innerHTML = '';
    ad.removeAttribute('data-adsbygoogle-status');
    ad.removeAttribute('data-ad-status');
    // Remove any dynamically added styles
    ad.removeAttribute('style');
  });
  
  // Reset the adsbygoogle array
  if ((window as any).adsbygoogle) {
    (window as any).adsbygoogle.length = 0;
  }
};

export default AdSense;
