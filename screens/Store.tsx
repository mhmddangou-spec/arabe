
import React, { useState } from 'react';
import { playSound } from '../services/audio';
import { UserStats } from '../types';

interface StoreProps {
  stats: UserStats;
  updateStats: (stats: Partial<UserStats>) => void;
}

const Store: React.FC<StoreProps> = ({ stats, updateStats }) => {
  const [showCheckout, setShowCheckout] = useState(false);

  const items = [
    { id: 'h1', name: 'Recharge de vies', description: 'Remplis tes cœurs pour continuer à apprendre.', cost: 450, icon: '❤️' },
    { id: 's1', name: 'Gel de série', description: 'Ta série reste intacte si tu manques un jour.', cost: 600, icon: '❄️' },
    { id: 'p1', name: 'Double mise', description: 'Mise 50 gemmes, gagne en double après 7 jours.', cost: 50, icon: '💎' },
  ];

  const premiumOffers = [
    { id: 'mo', label: 'Mensuel', price: '9.99€', period: 'mois', desc: 'Essai gratuit de 7 jours' },
    { id: 'yr', label: 'Annuel', price: '79.99€', period: 'an', desc: 'Économisez 33%', best: true },
  ];

  const handlePurchaseItem = (cost: number, id: string) => {
    if (stats.gems >= cost) {
      playSound('success');
      let update: Partial<UserStats> = { gems: stats.gems - cost };
      if (id === 'h1') update.hearts = 5;
      updateStats(update);
      alert('Achat réussi !');
    } else {
      playSound('incorrect');
      alert('Pas assez de gemmes !');
    }
  };

  const handleSubscribe = () => {
    playSound('success');
    updateStats({ isPremium: true });
    setShowCheckout(false);
    alert('Félicitations ! Vous êtes maintenant membre Arabingo Plus.');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto animate-in slide-in-from-bottom duration-500 pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-gray-800">Boutique</h1>
        <div className="flex items-center gap-1.5 font-extrabold text-[#1cb0f6] text-xl bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 shadow-sm">
           <span>💎</span>
           <span>{stats.gems}</span>
        </div>
      </div>

      <div className="mb-10 relative group">
        <div className={`p-8 rounded-3xl text-white overflow-hidden shadow-xl border-4 border-white/20 transition-all ${stats.isPremium ? 'bg-green-500' : 'bg-gradient-to-br from-[#1cb0f6] to-[#1899d6]'}`}>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2 tracking-tighter italic uppercase">
              {stats.isPremium ? 'Membre Arabingo Plus' : 'Arabingo Plus'}
            </h2>
            <ul className="space-y-2 mb-8 font-bold text-sm opacity-95">
              <li className="flex items-center gap-2">✅ Vies illimitées</li>
              <li className="flex items-center gap-2">✅ Zéro publicité</li>
              <li className="flex items-center gap-2">✅ Cours de Tajwid & Arabe Coranique</li>
              <li className="flex items-center gap-2">✅ Mode hors ligne complet</li>
            </ul>
            {!stats.isPremium ? (
              <button 
                onClick={() => { playSound('click'); setShowCheckout(true); }}
                className="w-full bg-white text-[#1899d6] py-4 rounded-2xl font-black uppercase text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                Passer au Premium
              </button>
            ) : (
              <div className="w-full bg-white/20 text-center py-2 rounded-xl font-black uppercase">Statut Actif</div>
            )}
          </div>
          <div className="absolute -right-10 -bottom-10 text-[12rem] opacity-20 rotate-12 select-none">🦉</div>
        </div>
      </div>

      <h2 className="text-xl font-black mb-4 uppercase text-gray-400 tracking-widest">Objets Spéciaux</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-5 bg-white border-2 border-gray-200 rounded-2xl flex items-center gap-6 shadow-sm hover:border-[#84d8ff] transition-all cursor-pointer group" onClick={() => handlePurchaseItem(item.cost, item.id)}>
            <div className="text-5xl group-hover:scale-110 transition-transform">{item.icon}</div>
            <div className="flex-1">
              <h3 className="font-black text-lg text-gray-800">{item.name}</h3>
              <p className="text-gray-400 font-bold text-sm leading-tight">{item.description}</p>
            </div>
            <button className="bg-[#1cb0f6] text-white px-6 py-2 rounded-xl font-black uppercase shadow-[0_4px_0_0_#1899d6] active:shadow-none active:translate-y-1 transition-all">
              {item.cost}
            </button>
          </div>
        ))}
      </div>

      {showCheckout && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-8 animate-in slide-in-from-bottom duration-500 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">Choisissez votre forfait</h3>
                <button onClick={() => setShowCheckout(false)} className="text-3xl font-light text-gray-400">×</button>
              </div>

              <div className="space-y-4 mb-8">
                {premiumOffers.map((offer) => (
                  <div key={offer.id} onClick={handleSubscribe} className={`p-4 border-2 rounded-2xl relative cursor-pointer transition-all hover:scale-[1.02] ${offer.best ? 'border-[#1cb0f6] bg-blue-50' : 'border-gray-200'}`}>
                    {offer.best && <span className="absolute -top-3 right-4 bg-[#1cb0f6] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Meilleure offre</span>}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-black text-lg">{offer.label}</p>
                        <p className="text-gray-500 text-sm font-bold">{offer.desc}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-[#1cb0f6]">{offer.price}</p>
                        <p className="text-gray-400 text-xs font-bold uppercase">par {offer.period}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-gray-400 text-center font-bold px-4">
                En vous abonnant, vous acceptez nos CGV. Le paiement sera débité de votre compte Google Play. Tarifs adaptés selon la région (Europe/Afrique).
              </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default Store;
