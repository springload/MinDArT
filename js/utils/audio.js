let audioContext;
let audioInitialized = false;
let clickSound = null;
let soundtrackBuffer = null;
let currentSoundtrack = null;
let soundtrackGain = null;
let pendingSoundtrack = null;

/**
 * Prepare audio system by loading sounds, but not creating AudioContext
 * Called on page load
 */
export async function prepareAudio() {
  try {
    // Load click sound
    const clickResponse = await fetch(
      `${import.meta.env.BASE_URL}sound/click.mp3`
    );
    clickSound = await clickResponse.arrayBuffer();
  } catch (error) {
    console.warn("Failed to load click sound:", error);
  }
}

/**
 * Initialize audio context and set up the gain node
 * Called from the loading dialog's start button
 */
export function initializeAudioContext() {
  if (audioInitialized) return;

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    soundtrackGain = audioContext.createGain();
    soundtrackGain.connect(audioContext.destination);
    audioInitialized = true;

    // If we have a pending soundtrack, load it now
    if (pendingSoundtrack) {
      loadSoundtrack(pendingSoundtrack);
    }
  } catch (error) {
    console.warn("Failed to initialize audio context:", error);
  }
}

export function playClick() {
  if (!audioInitialized || !clickSound) return;

  audioContext.decodeAudioData(clickSound.slice(0), (audioBuffer) => {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  });
}
/**
 * Load soundtrack for a specific activity
 * @returns {Promise} Resolves when soundtrack is loaded
 */
export async function loadSoundtrack(appName) {
  try {
    if (currentSoundtrack) {
      currentSoundtrack.stop();
      currentSoundtrack = null;
    }

    const response = await fetch(
      `${import.meta.env.BASE_URL}sound/${appName}.mp3`
    );
    soundtrackBuffer = await response.arrayBuffer();
  } catch (error) {
    console.warn(`Failed to load soundtrack for ${appName}:`, error);
  }
}

export function playSoundtrack() {
  return new Promise(async (resolve, reject) => {
    if (!audioInitialized || !soundtrackBuffer) {
      console.error("[Audio] Cannot play - missing initialization or buffer");
      reject(
        new Error("Cannot play soundtrack - missing initialization or buffer")
      );
      return;
    }

    if (audioContext.state === "suspended") {
      try {
        await audioContext.resume();
      } catch (error) {
        reject(error);
        return;
      }
    }

    audioContext.decodeAudioData(
      soundtrackBuffer.slice(0),
      (audioBuffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        source.connect(soundtrackGain);
        currentSoundtrack = source;
        source.start();
        resolve();
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export function stopSoundtrack() {
  if (currentSoundtrack) {
    currentSoundtrack.stop();
    currentSoundtrack = null;
  }
  if (soundtrackBuffer) {
    soundtrackBuffer = null;
  }
  if (audioContext) {
    audioContext.suspend();
  }
}
