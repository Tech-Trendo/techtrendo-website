'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatsAppChatFAB = () => {
  const handleOpenWhatsApp = () => {
    const phoneNumber = '9779815602535'; // Tech Trendo WhatsApp number
    const message = encodeURIComponent("Hello! 👋 I'm interested in your services at Tech Trendo.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleOpenWhatsApp}
        // size="lg"
        className="w-16 h-16 rounded-full bg-linear-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-2xl hover:shadow-blue-400/30 transition-all duration-300 group"
      >
        <MessageCircle
          size={28}
          className="text-white group-hover:scale-110 transition-transform duration-300"
        />
      </Button>
    </div>
  );
};

export default WhatsAppChatFAB;
