
import { SyncAction, UserStats } from '../types';

class SyncService {
  private static QUEUE_KEY = 'arabingo_sync_queue';

  getQueue(): SyncAction[] {
    const saved = localStorage.getItem(SyncService.QUEUE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  addToQueue(action: SyncAction) {
    const queue = this.getQueue();
    queue.push(action);
    localStorage.setItem(SyncService.QUEUE_KEY, JSON.stringify(queue));
    console.debug(`[Sync] Action ajoutée à la file : ${action.type}`);
  }

  clearQueue() {
    localStorage.removeItem(SyncService.QUEUE_KEY);
  }

  async processQueue(
    currentStats: UserStats, 
    updateStatsCallback: (newStats: UserStats) => void
  ): Promise<boolean> {
    const queue = this.getQueue();
    if (queue.length === 0) return false;

    console.debug(`[Sync] Traitement de ${queue.length} actions...`);
    
    let tempStats = { ...currentStats };

    // Tri par timestamp pour respecter l'ordre chronologique
    queue.sort((a, b) => a.timestamp - b.timestamp);

    for (const action of queue) {
      if (action.type === 'COMPLETE_LESSON') {
        const { lessonId, xp } = action.payload;
        if (!tempStats.completedLessons.includes(lessonId)) {
          tempStats.completedLessons.push(lessonId);
          tempStats.xp += xp;
        }
      } else if (action.type === 'UPDATE_STATS') {
        tempStats = { ...tempStats, ...action.payload };
      }
    }

    tempStats.lastSyncTimestamp = Date.now();
    updateStatsCallback(tempStats);
    this.clearQueue();
    return true;
  }
}

export const syncService = new SyncService();
