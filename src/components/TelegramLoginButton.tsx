import React, { useEffect, useRef } from 'react';

interface TelegramLoginButtonProps {
  botName: string;
  onAuth: (user: any) => void;
  disabled?: boolean;
}

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({ 
  botName, 
  onAuth, 
  disabled = false 
}) => {
  const telegramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    // Load Telegram Widget script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    // Create a global callback function
    (window as any).onTelegramAuth = (user: any) => {
      onAuth(user);
    };

    script.setAttribute('data-onauth', 'onTelegramAuth(user)');

    if (telegramRef.current) {
      telegramRef.current.appendChild(script);
    }

    return () => {
      // Cleanup
      if (telegramRef.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete (window as any).onTelegramAuth;
    };
  }, [botName, onAuth, disabled]);

  if (disabled) {
    return (
      <button
        disabled
        className="flex items-center justify-center gap-3 px-4 py-3 bg-[#0088cc] text-white rounded-lg opacity-50 cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.896 6.728-1.268 8.368-1.268 8.368-.159.708-.534.708-.534.708s-2.376-.366-3.611-.854c-.801-.315-1.896-.728-1.896-.728s-.159-.315.159-.708c0 0 4.264-3.554 5.531-4.892.2-.212.159-.315-.053-.315-.212 0-3.034 1.896-6.728 4.264 0 0-.534.315-1.533.315s-2.376-.366-2.376-.366-1.533-.708.159-1.533c0 0 6.409-2.748 8.893-3.814C18.947 7.16 19.481 7.16 19.481 7.16s.708-.159.708.534c0 .159-.053.708-.159 1.268z"/>
        </svg>
        Continue with Telegram
      </button>
    );
  }

  return (
    <div ref={telegramRef} className="flex justify-center">
      {/* Telegram widget will be inserted here */}
    </div>
  );
};

export default TelegramLoginButton;