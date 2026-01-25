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
  const uniqueId = useRef(`ad-${adSlot}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Don't show ads if client ID not configured
  if (!clientId || clientId === 'ca-pub-XXXXXXXXXXXXXXXX') {
    return null;
  }

  useEffect(() => {
    // Prevent duplicate loading
    if (isLoadedRef.current || !adRef.current) return;
    
    const adElement = adRef.current.querySelector('.adsbygoogle') as HTMLElement;
    if (!adElement) return;
    
    // More robust duplicate check using unique tracking
    const trackingAttr = `data-tracking-id`;
    if (adElement.getAttribute(trackingAttr) === uniqueId.current) {
      return;
    }
    
    // More robust duplicate check
    if (adElement.innerHTML.trim() !== '' || 
        adElement.getAttribute('data-adsbygoogle-status') === 'done' ||
        adElement.getAttribute('data-ad-status') === 'filled') {
      return;
    }

    try {
      // Mark this ad instance as being processed
      adElement.setAttribute(trackingAttr, uniqueId.current);
      
      // Initialize adsbygoogle array if not exists
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []);
      
      // Clear any existing data attributes to prevent conflicts
      adElement.removeAttribute('data-adsbygoogle-status');
      adElement.removeAttribute('data-ad-status');
      
      // Add timeout to ensure DOM is ready
      setTimeout(() => {
        try {
          // Additional check before pushing
          if (adElement.getAttribute('data-adsbygoogle-status') !== 'done') {
            ((window as any).adsbygoogle).push({});
            isLoadedRef.current = true;
          }
        } catch (error) {
          console.error('AdSense push error:', error);
          // Reset tracking on error
          adElement.removeAttribute(trackingAttr);
          // Don't retry to prevent infinite loops
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

// Global state to track AdSense initialization
let adSenseInitialized = false;
let adSenseScriptLoaded = false;

// Initialize AdSense script
export const initAdSense = () => {
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  
  if (!clientId || clientId === 'ca-pub-XXXXXXXXXXXXXXXX') {
    console.log('AdSense: Client ID not configured, skipping initialization');
    return;
  }

  // Prevent multiple initializations
  if (adSenseInitialized) {
    console.log('AdSense: Already initialized, skipping');
    return;
  }

  // Check if script already loaded
  const existingScript = document.querySelector(`script[src*="adsbygoogle.js"]`);
  if (existingScript || adSenseScriptLoaded) {
    console.log('AdSense: Script already loaded');
    adSenseInitialized = true;
    return;
  }

  const script = document.createElement('script');
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  script.async = true;
  script.crossOrigin = 'anonymous';
  
  script.onload = () => {
    console.log('AdSense: Script loaded successfully');
    adSenseScriptLoaded = true;
    adSenseInitialized = true;
    // Initialize adsbygoogle array
    (window as any).adsbygoogle = (window as any).adsbygoogle || [];
  };
  
  script.onerror = () => {
    console.error('AdSense: Script failed to load - check network connection or ad blocker');
    adSenseInitialized = false;
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
