const status = document.querySelector('#status');
const cards = [...document.querySelectorAll('.letter-card')];

function speak(letter, word) {
  if (!('speechSynthesis' in window)) {
    status.textContent = `${letter} is for ${word}!`;
    return;
  }
  window.speechSynthesis.cancel();
  const message = new SpeechSynthesisUtterance(`${letter}! ${letter} is for ${word}!`);
  message.rate = 0.78;
  message.pitch = 1.25;
  window.speechSynthesis.speak(message);
  status.textContent = `Great job! ${letter} is for ${word}.`;
}

cards.forEach((card) => {
  const play = () => speak(card.dataset.letter, card.dataset.word);
  card.addEventListener('click', (event) => { if (!event.target.matches('.sound-button')) play(); });
  card.querySelector('.sound-button').addEventListener('click', play);
  card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); play(); } });
});

document.querySelector('#play-all').addEventListener('click', () => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const alphabet = cards.map((card) => card.dataset.letter).join(', ');
  const message = new SpeechSynthesisUtterance(`Let's say the alphabet together! ${alphabet}`);
  message.rate = 0.58;
  message.pitch = 1.2;
  window.speechSynthesis.speak(message);
  status.textContent = 'Singing the alphabet!';
});
