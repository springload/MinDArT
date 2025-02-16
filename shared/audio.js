// Keep track of audio context and audio buffers
let audioContext;
let sounds = new Map();
let currentSoundtrack = null;
let soundtrackGain = null;
let audioInitialized = false;

/**
 * Initialize the audio manager for a specific activity
 * @param {string} activityName - Name/number of the activity scene
 * Loads audio files but defers AudioContext creation until user interaction
 */
async function initAudio(activityName) {
  // Load both sounds first - this doesn't require AudioContext
  await Promise.all([
    loadSound("click", "../sound/click.mp3"),
    loadSound("soundtrack", `../sound/Scene${activityName}.mp3`),
  ]);

  // Handle page visibility changes to manage soundtrack playback
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseSoundtrack();
    } else {
      resumeSoundtrack();
    }
  });
}

/**
 * Initialize the Web Audio API context and set up the main gain node
 * This needs to be called after a user gesture due to browser autoplay policies
 * The gain node allows us to control the soundtrack volume independently
 */
function initializeAudioContext() {
  if (audioInitialized) return;

  // The AudioContext is the main entry point for working with Web Audio API
  // Some browsers use the webkit prefix
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Create a gain node for controlling soundtrack volume
  soundtrackGain = audioContext.createGain();
  soundtrackGain.connect(audioContext.destination);
  audioInitialized = true;
}

/**
 * Load an audio file and store it in the sounds Map
 * @param {string} key - Identifier for the sound (e.g., 'click', 'soundtrack')
 * @param {string} url - Path to the audio file
 * Stores the raw array buffer until we need to decode it
 */
async function loadSound(key, url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    // Store the raw buffer - we'll decode it when needed
    sounds.set(key, arrayBuffer);
  } catch (error) {
    console.warn(`Failed to load sound: ${key}`, error);
  }
}

/**
 * Play the click sound
 * Creates a new buffer source node each time (required by Web Audio API)
 * Initializes audio context if this is the first user interaction
 */
function playClick() {
  if (!audioInitialized) {
    initializeAudioContext();
  }

  if (!sounds.has("click")) return;

  // Decode the audio data and create a new source node
  audioContext.decodeAudioData(sounds.get("click").slice(0), (audioBuffer) => {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  });
}

/**
 * Play the background soundtrack
 * Stops any currently playing soundtrack first
 * Initializes audio context if this is the first user interaction
 */
function playSoundtrack() {
  if (!audioInitialized) {
    initializeAudioContext();
  }

  if (!sounds.has("soundtrack")) return;

  if (currentSoundtrack) {
    currentSoundtrack.stop();
  }

  // Decode the audio data and create a new source node
  audioContext.decodeAudioData(sounds.get("soundtrack"), (audioBuffer) => {
    currentSoundtrack = audioContext.createBufferSource();
    currentSoundtrack.buffer = audioBuffer;
    currentSoundtrack.loop = true;
    currentSoundtrack.connect(soundtrackGain);
    currentSoundtrack.start();
  });
}

/**
 * Pause the soundtrack by suspending the audio context
 * This preserves the audio state while stopping playback
 */
function pauseSoundtrack() {
  if (audioContext?.state === "running") {
    audioContext.suspend();
  }
}

/**
 * Resume the soundtrack by resuming the audio context
 * This restores playback from where it was suspended
 */
function resumeSoundtrack() {
  if (audioContext?.state === "suspended") {
    audioContext.resume();
  }
}

/**
 * Add click sound to a button or set of buttons
 * @param {HTMLElement|HTMLElement[]} elements - Button(s) to add click sound to
 * Click sound will only play if the button isn't disabled
 */
function addClickSound(elements) {
  const elementArray = Array.isArray(elements) ? elements : [elements];

  elementArray.forEach((element) => {
    element.addEventListener("click", (e) => {
      if (!element.disabled) {
        playClick();
      }
    });
  });
}
