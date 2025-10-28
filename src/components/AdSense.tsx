// Google AdSense Component
// Use this after getting AdSense approval

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
}

export const AdSense = ({ adSlot, adFormat = 'auto', className = '' }: AdSenseProps) => {
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;

  // Don't show ads if client ID not configured
  if (!clientId || clientId === 'ca-pub-XXXXXXXXXXXXXXXX') {
    return null;
  }

  return (
    <div className={`adsense-container ${className}`}>
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
    return;
  }

  const script = document.createElement('script');
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  script.async = true;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);

  // Push ads after script loads
  script.onload = () => {
    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
  };
};

export default AdSense;
