import React from 'react';
import QRCode from 'qrcode.react';

interface QrCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export const QrCode: React.FC<QrCodeProps> = ({ value, size = 96, className }) => (
  <div className={className} style={{ background: 'white', borderRadius: 12, padding: 8, display: 'inline-block' }}>
    <QRCode value={value} size={size} fgColor="#4f46e5" bgColor="#fff" level="M" includeMargin={false} />
  </div>
);
