
import React from 'react';
import { NavLink } from 'react-router-dom';
import { playSound } from '../services/audio';
import { useTranslation } from '../context/LanguageContext';

const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const links = [
    { to: '/map', label: t.nav.learn, icon: '🏠' },
    { to: '/stories', label: 'Sagesse', icon: '🕌' }, // Nouvel onglet
    { to: '/leaderboard', label: t.nav.leaderboard, icon: '🏆' },
    { to: '/profile', label: t.nav.profile, icon: '👤' },
    { to: '/store', label: t.nav.store, icon: '💎' },
  ];

  return (
    <nav className="flex md:flex-col justify-around md:justify-start gap-1 py-2 md:py-0 px-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={() => playSound('click')}
          className={({ isActive }) =>
            `flex flex-col md:flex-row items-center gap-2 px-4 py-3 rounded-xl transition-all font-bold tracking-wide text-sm md:text-base uppercase ${
              isActive
                ? 'bg-[#ddf4ff] text-[#1899d6] border-2 border-[#84d8ff]'
                : 'text-gray-500 hover:bg-gray-100 border-2 border-transparent'
            }`
          }
        >
          <span className="text-2xl">{link.icon}</span>
          <span className="hidden xs:inline md:inline">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
