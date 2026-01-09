
import React, { useEffect, useState } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'badge' | 'streak';
  icon?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (message: string, type: Notification['type'] = 'info', icon?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type, icon }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  return { notifications, notify };
};

export const NotificationContainer: React.FC<{ notifications: Notification[] }> = ({ notifications }) => {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm flex flex-col gap-2 px-4 pointer-events-none">
      {notifications.map(n => (
        <div 
          key={n.id} 
          className={`
            flex items-center gap-3 p-4 rounded-2xl shadow-2xl border-2 animate-in slide-in-from-top duration-300
            ${n.type === 'success' ? 'bg-[#58cc02] border-[#46a302] text-white' : 
              n.type === 'streak' ? 'bg-[#ff9600] border-[#e58600] text-white' :
              n.type === 'badge' ? 'bg-[#1cb0f6] border-[#1899d6] text-white' :
              'bg-white border-gray-200 text-gray-800'}
          `}
        >
          <span className="text-2xl">{n.icon || (n.type === 'success' ? '🎉' : '🔔')}</span>
          <p className="font-black text-sm leading-tight">{n.message}</p>
        </div>
      ))}
    </div>
  );
};
