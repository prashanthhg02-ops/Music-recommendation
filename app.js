const tracks = {
  focus: [
    { title: 'A Walk', artist: 'Tycho', mood: 'focus', accent: '#52675b' },
    { title: 'Show Me How', artist: 'Men I Trust', mood: 'focus', accent: '#8d9b72' },
    { title: 'Near Light', artist: 'Ólafur Arnalds', mood: 'focus', accent: '#4b5969' }
  ],
  energy: [
    { title: 'Loud Places', artist: 'Jamie xx', mood: 'energy', accent: '#ee684c' },
    { title: 'D.A.N.C.E.', artist: 'Justice', mood: 'energy', accent: '#8a6c45' },
    { title: 'Lisztomania', artist: 'Phoenix', mood: 'energy', accent: '#bb5f55' }
  ],
  night: [
    { title: 'Roads', artist: 'Portishead', mood: 'night', accent: '#3d4b54' },
    { title: 'Retrograde', artist: 'James Blake', mood: 'night', accent: '#6f5d65' },
    { title: 'Teardrop', artist: 'Massive Attack', mood: 'night', accent: '#3f514e' }
  ],
  open: [
    { title: 'Holocene', artist: 'Bon Iver', mood: 'open', accent: '#668e83' },
    { title: 'Young Lion', artist: 'Vampire Weekend', mood: 'open', accent: '#c18b54' },
    { title: 'Sweet Disposition', artist: 'The Temper Trap', mood: 'open', accent: '#be7555' }
  ]
};

const moodCopy = { focus: 'Soft focus, in stereo', energy: 'A little more voltage', night: 'After dark, on repeat', open: 'Wide open, windows down' };
let currentMood = 'focus';
let saved = new Set(JSON.parse(localStorage.getItem('echo-saved') || '[]'));

function renderTracks() {
  const grid = document.querySelector('#trackGrid');
  grid.innerHTML = tracks[currentMood].map((track, index) => {
    const key = `${track.title}-${track.artist}`;
    const isSaved = saved.has(key);
    return `<article class="track-card" style="animation-delay:${index * 90}ms">
      <div class="track-art" style="--accent:${track.accent}"><span class="track-number">0${index + 1} / ECHO PICK</span><button class="play" aria-label="Play ${track.title}">▶</button></div>
      <div class="track-info"><div><div class="track-title">${track.title}</div><div class="track-artist">${track.artist}</div></div><button class="save ${isSaved ? 'saved' : ''}" data-save="${key}" aria-label="${isSaved ? 'Remove' : 'Save'} ${track.title}">${isSaved ? '♥' : '♡'}</button></div>
    </article>`;
  }).join('');
  document.querySelectorAll('[data-save]').forEach(button => button.addEventListener('click', () => toggleSave(button.dataset.save)));
}

function selectMood(mood) {
  currentMood = mood;
  document.querySelectorAll('.mood').forEach(button => button.classList.toggle('active', button.dataset.mood === mood));
  document.querySelector('#signalLabel').textContent = mood === 'focus' ? 'Soft focus' : mood === 'energy' ? 'High voltage' : mood === 'night' ? 'Low light' : 'Open air';
  document.querySelector('#resultTitle').textContent = moodCopy[mood];
  renderTracks();
}

function toggleSave(key) {
  saved.has(key) ? saved.delete(key) : saved.add(key);
  localStorage.setItem('echo-saved', JSON.stringify([...saved]));
  document.querySelector('#savedCount').textContent = saved.size;
  renderTracks();
}

document.querySelectorAll('.mood').forEach(button => button.addEventListener('click', () => selectMood(button.dataset.mood)));
document.querySelector('#refreshButton').addEventListener('click', () => {
  const moods = Object.keys(tracks);
  selectMood(moods[(moods.indexOf(currentMood) + 1) % moods.length]);
});
document.querySelector('#askForm').addEventListener('submit', event => {
  event.preventDefault();
  const prompt = document.querySelector('#askInput').value.toLowerCase();
  const mood = prompt.includes('night') || prompt.includes('dark') || prompt.includes('late') ? 'night' : prompt.includes('energy') || prompt.includes('party') || prompt.includes('upbeat') ? 'energy' : prompt.includes('road') || prompt.includes('outside') || prompt.includes('sun') ? 'open' : 'focus';
  selectMood(mood);
  document.querySelector('#askInput').value = '';
});
document.querySelector('#savedCount').textContent = saved.size;
renderTracks();
