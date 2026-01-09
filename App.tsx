
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './screens/Home';
import LessonMap from './screens/LessonMap';
import StoriesMap from './screens/StoriesMap';
import Quiz from './screens/Quiz';
import Profile from './screens/Profile';
import Leaderboard from './screens/Leaderboard';
import Store from './screens/Store';
import Login from './screens/Login';
import StoryDetail from './screens/StoryDetail'; // Importé ici
import Navigation from './components/Navigation';
import Header from './components/Header';
import { NotificationContainer, useNotifications } from './components/NotificationSystem';
import { UserStats } from './types';
import { authService } from './services/auth';
import { updateStreak, calculateLessonXp } from './services/gamification';
import { setAudioSettings, playSound } from './services/audio';

const App: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(() => authService.getCurrentUser());
  const { notifications, notify } = useNotifications();

  useEffect(() => {
    if (stats) setAudioSettings({ soundEnabled: stats.soundEnabled, musicEnabled: stats.musicEnabled });
  }, [stats?.soundEnabled, stats?.musicEnabled]);

  const completeLesson = (lessonId: string, xpEarned: number) => {
    if (!stats) return;
    const { newStreak } = updateStreak(stats.lastLessonDate, stats.streak);
    const today = new Date().toISOString().split('T')[0];
    
    setStats(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        xp: prev.xp + xpEarned,
        streak: newStreak,
        lastLessonDate: today,
        completedLessons: prev.completedLessons.includes(lessonId) ? prev.completedLessons : [...prev.completedLessons, lessonId],
      };
      authService.saveSession(updated);
      return updated;
    });
  };

  const updateStats = (newStats: Partial<UserStats>) => setStats(prev => {
    if (!prev) return null;
    const updated = { ...prev, ...newStats };
    authService.saveSession(updated);
    return updated;
  });

  return (
    <HashRouter>
      <div className="relative">
        <NotificationContainer notifications={notifications} />
        <Routes>
          <Route path="/" element={stats ? <Navigate to="/map" /> : <Home onGuest={() => authService.signInAnonymously().then(setStats)} />} />
          <Route path="/login" element={<Login onAuth={setStats} />} />
          <Route path="*" element={
            stats ? (
              <div className="flex flex-col min-h-screen bg-white md:flex-row max-w-5xl mx-auto">
                <div className="md:hidden sticky top-0 z-50 bg-white border-b"><Header stats={stats} /></div>
                <div className="hidden md:block w-64 border-r sticky top-0 h-screen p-4 flex flex-col">
                  <span className="text-3xl font-bold text-[#58cc02] italic px-4 mb-8">arabingo</span>
                  <Navigation />
                </div>
                <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
                  <Routes>
                    <Route path="/map" element={<LessonMap stats={stats} isOnline={true} updateStats={updateStats} />} />
                    <Route path="/stories" element={<StoriesMap stats={stats} />} />
                    <Route path="/story/:storyId" element={<StoryDetail />} />
                    <Route path="/quiz/:lessonId" element={<Quiz onComplete={completeLesson} updateStats={updateStats} stats={stats} />} />
                    <Route path="/profile" element={<Profile stats={stats} updateStats={updateStats} />} />
                    <Route path="/leaderboard" element={<Leaderboard stats={stats} />} />
                    <Route path="/store" element={<Store stats={stats} updateStats={updateStats} />} />
                    <Route path="*" element={<Navigate to="/map" />} />
                  </Routes>
                </main>
                <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t"><Navigation /></div>
              </div>
            ) : <Navigate to="/" />
          } />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
