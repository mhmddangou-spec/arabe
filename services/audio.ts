
const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  correct: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  incorrect: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
  badge: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
};

const MUSIC = {
  ambient: 'https://assets.mixkit.co/music/preview/mixkit-arabic-mystery-642.mp3',
};

let audioSettings = {
  soundEnabled: true,
  musicEnabled: true
};

let ambientAudio: HTMLAudioElement | null = null;

export const setAudioSettings = (settings: { soundEnabled: boolean, musicEnabled: boolean }) => {
  audioSettings = settings;
  if (!settings.musicEnabled) {
    stopAmbient();
  } else {
    playAmbient();
  }
};

export const playSound = (soundName: keyof typeof SOUNDS) => {
  if (!audioSettings.soundEnabled) return;
  
  try {
    const audio = new Audio(SOUNDS[soundName]);
    audio.volume = 0.3;
    audio.play().catch((err) => {
      console.debug('Audio play skipped/blocked', err);
    });
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

export const playAmbient = () => {
  if (!audioSettings.musicEnabled) return;

  if (!ambientAudio) {
    ambientAudio = new Audio(MUSIC.ambient);
    ambientAudio.loop = true;
    ambientAudio.volume = 0.1; // Très discret
  }

  ambientAudio.play().catch((err) => {
    console.debug('Ambient play blocked - waiting for interaction', err);
  });
};

export const stopAmbient = () => {
  if (ambientAudio) {
    ambientAudio.pause();
  }
};
