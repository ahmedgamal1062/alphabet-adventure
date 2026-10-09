const status = document.querySelector('#status');
const cards = [...document.querySelectorAll('.letter-card')];
const progressCount = document.querySelector('#progress-count');
const progressFill = document.querySelector('#progress-fill');
const progressBar = document.querySelector('.progress-bar');
const surpriseButton = document.querySelector('#surprise-me');
const musicToggle = document.querySelector('#music-toggle');
const learnedLetters = new Set();
const AudioContextType = window.AudioContext || window.webkitAudioContext;
const melody = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
let musicContext;
let musicMaster;
let musicInterval;
let musicTimeout;
let melodyIndex = 0;
let accompanimentEnabled = true;
let activePlaybackId = 0;
let playbackActive = false;

function updateProgress() {
  const learnedCount = learnedLetters.size;
  const percentage = (learnedCount / cards.length) * 100;

  progressCount.textContent = `${learnedCount} / ${cards.length}`;
  progressFill.style.width = `${percentage}%`;
  progressBar.setAttribute('aria-valuenow', String(learnedCount));
}

function markLetterLearned(letter) {
  learnedLetters.add(letter);
  updateProgress();
}

function playMusicNote() {
  const startTime = musicContext.currentTime;
  const oscillator = musicContext.createOscillator();
  const noteGain = musicContext.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(melody[melodyIndex], startTime);
  noteGain.gain.setValueAtTime(0.0001, startTime);
  noteGain.gain.linearRampToValueAtTime(0.08, startTime + 0.04);
  noteGain.gain.setValueAtTime(0.08, startTime + 0.22);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.42);
  oscillator.connect(noteGain);
  noteGain.connect(musicMaster);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.43);
  melodyIndex = (melodyIndex + 1) % melody.length;
}

function updateMusicToggle() {
  musicToggle.textContent = `♫ Accompaniment: ${accompanimentEnabled ? 'On' : 'Off'}`;
  musicToggle.setAttribute('aria-pressed', String(accompanimentEnabled));
}

async function startMusic(playbackId, maxDuration) {
  if (!accompanimentEnabled) return false;

  if (!AudioContextType) {
    status.textContent = 'Music accompaniment is not supported by this browser.';
    return false;
  }

  try {
    if (!musicContext) {
      musicContext = new AudioContextType();
      musicMaster = musicContext.createGain();
      musicMaster.gain.value = 0.24;
      musicMaster.connect(musicContext.destination);
    }

    if (musicContext.state === 'suspended') await musicContext.resume();
    if (musicContext.state !== 'running') throw new Error('The audio context is not running.');
    if (playbackId !== activePlaybackId || !playbackActive || !accompanimentEnabled) return false;

    musicMaster.gain.cancelScheduledValues(musicContext.currentTime);
    musicMaster.gain.setValueAtTime(0.24, musicContext.currentTime);
    playMusicNote();
    musicInterval = window.setInterval(playMusicNote, 500);
    musicTimeout = window.setTimeout(() => stopMusic(playbackId), maxDuration);
    return true;
  } catch (error) {
    console.error('Unable to start background music.', error);
    status.textContent = 'Music accompaniment could not start. Check your browser audio settings and try again.';
    return false;
  }
}

function stopMusic(playbackId) {
  if (playbackId !== undefined && playbackId !== activePlaybackId) return;
  playbackActive = false;
  if (musicInterval) {
    window.clearInterval(musicInterval);
    musicInterval = undefined;
  }
  if (musicTimeout) {
    window.clearTimeout(musicTimeout);
    musicTimeout = undefined;
  }
  if (musicContext && musicMaster && musicContext.state === 'running') {
    musicMaster.gain.cancelScheduledValues(musicContext.currentTime);
    musicMaster.gain.setTargetAtTime(0.0001, musicContext.currentTime, 0.04);
  }
}

function speakText(text, rate, pitch, statusMessage, maxDuration) {
  const playbackId = ++activePlaybackId;
  stopMusic();
  playbackActive = true;
  status.textContent = statusMessage;

  if (!('speechSynthesis' in window)) {
    void startMusic(playbackId, Math.min(maxDuration, 1800));
    return;
  }

  window.speechSynthesis.cancel();
  const message = new SpeechSynthesisUtterance(text);
  message.rate = rate;
  message.pitch = pitch;
  message.onend = () => stopMusic(playbackId);
  message.onerror = (event) => {
    stopMusic(playbackId);
    if (event.error !== 'canceled' && event.error !== 'interrupted') {
      status.textContent = 'Speech could not play. Check your browser speech settings and try again.';
    }
  };
  void startMusic(playbackId, maxDuration);
  window.speechSynthesis.speak(message);
}

function speak(letter, word) {
  markLetterLearned(letter);
  speakText(`${letter}! ${letter} is for ${word}!`, 0.78, 1.25, `Great job! ${letter} is for ${word}.`, 5000);
}

cards.forEach((card) => {
  const play = () => speak(card.dataset.letter, card.dataset.word);
  card.addEventListener('click', (event) => { if (!event.target.matches('.sound-button')) play(); });
  card.querySelector('.sound-button').addEventListener('click', play);
  card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); play(); } });
});

document.querySelector('#play-all').addEventListener('click', () => {
  cards.forEach((card) => markLetterLearned(card.dataset.letter));
  const alphabet = cards.map((card) => card.dataset.letter).join(', ');
  speakText(`Let's say the alphabet together! ${alphabet}`, 0.58, 1.2, 'Singing the alphabet!', 30000);
  updateProgress();
});

surpriseButton.addEventListener('click', () => {
  const unlearned = cards.filter((card) => !learnedLetters.has(card.dataset.letter));
  const nextCard = unlearned.length ? unlearned[Math.floor(Math.random() * unlearned.length)] : cards[Math.floor(Math.random() * cards.length)];

  nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  nextCard.focus();
  speak(nextCard.dataset.letter, nextCard.dataset.word);
});

musicToggle.addEventListener('click', () => {
  accompanimentEnabled = !accompanimentEnabled;
  if (!accompanimentEnabled) {
    stopMusic();
    status.textContent = 'Music accompaniment turned off.';
  } else {
    status.textContent = 'Music accompaniment will play with the next pronunciation.';
  }
  updateMusicToggle();
});

updateMusicToggle();
updateProgress();
