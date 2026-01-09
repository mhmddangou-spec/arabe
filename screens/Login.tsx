
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { playSound } from '../services/audio';

const Login: React.FC<{ onAuth: (user: any) => void }> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound('click');
    try {
      const user = isLogin 
        ? await authService.login(email, password)
        : await authService.signUpWithEmail(email, password);
      
      if (user) {
        onAuth(user);
        navigate('/map');
      } else {
        alert("Identifiants incorrects ou compte inexistant.");
      }
    } catch (err) {
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <h1 className="text-3xl font-black text-gray-800 mb-2 text-center">
          {isLogin ? 'Bon retour !' : 'Crée ton profil'}
        </h1>
        <p className="text-gray-400 font-bold text-center mb-8">
          {isLogin ? 'Connecte-toi pour retrouver ta série' : 'Rejoins la communauté Arabingo'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-1 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-100 border-2 border-gray-200 rounded-2xl focus:border-[#1cb0f6] outline-none font-bold transition-colors"
              placeholder="ton@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 mb-1 ml-1">Mot de passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-100 border-2 border-gray-200 rounded-2xl focus:border-[#1cb0f6] outline-none font-bold transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#1cb0f6] text-white py-4 rounded-2xl font-black uppercase text-lg shadow-[0_6px_0_0_#1899d6] active:shadow-none active:translate-y-1 transition-all mt-4"
          >
            {isLogin ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#1cb0f6] font-black uppercase text-sm hover:underline"
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>

      <button 
        onClick={() => navigate('/')}
        className="text-gray-400 font-black uppercase text-sm mt-8"
      >
        Retour
      </button>
    </div>
  );
};

export default Login;
