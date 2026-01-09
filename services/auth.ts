
import { UserStats } from '../types';
import { INITIAL_STATS } from '../constants';

/**
 * Service simulant Firebase Auth & Firestore Sync
 */
class AuthService {
  private static STORAGE_KEY = 'arabingo_auth_session';

  async signInAnonymously(): Promise<UserStats> {
    // Simule Firebase.auth().signInAnonymously()
    // Fix: Added missing 'badges' and 'errorHistory' properties to satisfy UserStats interface
    const guestUser: UserStats = {
      ...INITIAL_STATS,
      badges: [],
      errorHistory: [],
      uid: 'guest_' + Math.random().toString(36).substr(2, 9),
      isAnonymous: true,
      displayName: 'Explorateur'
    };
    this.saveSession(guestUser);
    return guestUser;
  }

  async signUpWithEmail(email: string, pass: string): Promise<UserStats> {
    // Simule Firebase.auth().createUserWithEmailAndPassword()
    // Fix: Added missing 'badges' and 'errorHistory' properties to satisfy UserStats interface
    const newUser: UserStats = {
      ...INITIAL_STATS,
      badges: [],
      errorHistory: [],
      uid: 'user_' + Math.random().toString(36).substr(2, 9),
      email: email,
      isAnonymous: false,
      displayName: email.split('@')[0]
    };
    this.saveSession(newUser);
    return newUser;
  }

  async login(email: string, pass: string): Promise<UserStats | null> {
    // Simule Firebase.auth().signInWithEmailAndPassword()
    // Fix: access static property STORAGE_KEY via class name
    const saved = localStorage.getItem(AuthService.STORAGE_KEY);
    if (saved) {
      const user = JSON.parse(saved);
      if (user.email === email) return user;
    }
    return null;
  }

  getCurrentUser(): UserStats | null {
    const saved = localStorage.getItem(AuthService.STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  saveSession(user: UserStats) {
    localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem(AuthService.STORAGE_KEY);
  }
}

export const authService = new AuthService();
