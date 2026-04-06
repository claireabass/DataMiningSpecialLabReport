import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-6 right-6 px-[18px] py-3 rounded-xl text-white flex items-center gap-2 z-50"
      style={{
        background: '#0F1224',
        boxShadow: '0 20px 48px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.07)',
        animation: 'fadeUp 0.25s ease',
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '14px',
        fontWeight: 600,
      }}
    >
      {message}
    </div>
  );
}
