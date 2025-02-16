/**
 * Audio context instance for handling all audio operations
 *  @type {AudioContext}
 * */
let audioContext;

/**
 * Flag indicating if audio system has been initialized
 *  @type {boolean}
 * */
let audioInitialized = false;

/**
 * Buffer containing the click sound data
 *  @type {ArrayBuffer|null}
 * */
let clickSound = null;

/**
 * Buffer containing the current soundtrack data
 *  @type {ArrayBuffer|null}
 * */
let soundtrackBuffer = null;

/**
 * Currently playing soundtrack source node
 *  @type {AudioBufferSourceNode|null}
 * */
let currentSoundtrack = null;

/**
 * Gain node for controlling soundtrack volume
 *  @type {GainNode|null}
 * */
let soundtrackGain = null;

/**
 * Name of soundtrack to load after audio initialization
 *  @type {string|null}
 * */
let pendingSoundtrack = null;

/**
 * Loads the sound file for the 'click' heard on button presses.
 * This function is called on page load and loads the file without creating
 * an AudioContext, to comply with browser autoplay policies.
 *
 * @async
 * @returns {Promise<void>}
 * @throws {Error} If sound files cannot be loaded
 */
export async function loadClick() {
  try {
    const clickResponse = await fetch(
      `${import.meta.env.BASE_URL}sound/click.mp3`
    );
    clickSound = await clickResponse.arrayBuffer();
  } catch (error) {
    console.warn("Failed to load click sound:", error);
  }
}

/**
 * Initializes the Web Audio API context and sets up the audio graph.
 * Called from the loading dialog's start button to comply with browser
 * autoplay policies.
 * @returns {void}
 * @throws {Error} If audio context cannot be initialized
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

/**
 * Plays a click sound effect on button presses.
 *
 * @returns {void}
 */
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
 * Loads a soundtrack for a specific drawing app.
 * In the unlikely event that a soundtrack is currently playing,
 * it will be stopped before loading the new one.
 *
 * @async
 * @param {string} appName - The name of the application/activity to load soundtrack for
 * @returns {Promise<void>} Resolves when the soundtrack is loaded
 * @throws {Error} If the soundtrack file cannot be loaded
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

/**
 * Starts playing the currently loaded soundtrack in a loop.
 * The soundtrack will only play if the audio system is initialized and a soundtrack is loaded.
 *
 * @async
 * @returns {Promise<void>} Resolves when the soundtrack starts playing
 * @throws {Error} If the soundtrack cannot be played due to missing initialization,
 *                 missing buffer, or audio decoding errors
 */
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

/**
 * Stops the currently playing soundtrack and suspends the audio context.
 * This function cleans up all audio resources and puts the audio system in a suspended state.
 *
 * @returns {void}
 */
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
