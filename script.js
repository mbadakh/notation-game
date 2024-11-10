let mute = false;
function initCanvas() {
  const staff = document.querySelector(".staff");
  // Create 5 staff lines
  for (let i = 0; i < 5; i++) {
    const line = document.createElement("div");
    line.classList.add("staff-line");
    staff.appendChild(line);
  }
}

function toggleMute() {
  mute = !mute;
  document.getElementById("mute-button").textContent = mute
    ? "🔇 Unmute"
    : "🔊 Mute";
}

function playNote(note) {
  if (mute) return;
  const noteFrequencies = {
    C3: 130.81,
    D3: 146.83,
    E3: 164.81,
    F3: 174.61,
    G3: 196.0,
    A3: 220.0,
    B3: 246.94,
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.0,
    A4: 440.0,
    B4: 493.88,
    C5: 523.25,
    D5: 587.33,
    E5: 659.25,
    F5: 698.46,
    G5: 783.99,
    A5: 880.0,
    B5: 987.77,
  };
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const frequency = noteFrequencies[note];
  if (frequency) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  }
}

function generateDisplayNotes() {
  const notePositions = [
    // { note: "C3", position: -6.0, lineThrough: true },
    // { note: "D3", position: -5.4, lineThrough: false },
    // { note: "E3", position: -4.8, lineThrough: false },
    // { note: "F3", position: -4.2, lineThrough: false },
    // { note: "G3", position: -3.6, lineThrough: false },
    // { note: "A3", position: -3.0, lineThrough: false },
    // { note: "B3", position: -2.4, lineThrough: false },

    { note: "C4", position: -3.6, lineThrough: true },
    { note: "D4", position: -3, lineThrough: false },
    { note: "E4", position: -2.4, lineThrough: false },
    { note: "F4", position: -1.8, lineThrough: false },
    { note: "G4", position: -1.2, lineThrough: false },
    { note: "A4", position: -0.6, lineThrough: false },
    { note: "B4", position: 0, lineThrough: false },

    { note: "C5", position: 0.6, lineThrough: false },
    { note: "D5", position: 1.2, lineThrough: false },
    { note: "E5", position: 1.8, lineThrough: false },
    { note: "F5", position: 2.4, lineThrough: false },
    { note: "G5", position: 3, lineThrough: false },
    { note: "A5", position: 3.6, lineThrough: true },
    // { note: "B5", position: 6.0, lineThrough: true },
  ];

  const notesContainer = document.querySelector(".notes");
  notesContainer.replaceChildren([]);

  function generateRandomNotes(num) {
    let thisRoundsLetters = [];
    for (let i = 0; i < num; i++) {
      const randomIndex = Math.floor(Math.random() * notePositions.length);
      thisRoundsLetters.push(notePositions[randomIndex].note);
      const noteInfo = notePositions[randomIndex];
      const note = document.createElement("div");
      note.classList.add("quorternote");
      note.style.bottom = `${noteInfo.position * 10}px`;

      if (noteInfo.lineThrough) {
        const lineThrough = document.createElement("div");
        lineThrough.classList.add("line-through");
        note.appendChild(lineThrough);
      }
      notesContainer.appendChild(note);
    }
    return thisRoundsLetters;
  }

  const randomNotes = generateRandomNotes(8);
  return randomNotes;
}

function displayTimer(timer) {
  const timerElement = document.getElementById("timer");
  const bestTimeElement = document.getElementById("best-time");
  const oldBest = Number(bestTimeElement.textContent);
  timerElement.textContent = timer;
  if (oldBest > timer || oldBest === 0) {
    bestTimeElement.textContent = timer;
  }
}

function startNewRound() {
  currentNotes = generateDisplayNotes();
  guesses = [];
  currentGuessIndex = 0;
  startTimer = null;
  endTimer = null;
  updateDisplay(0);
}

function makeGuess(note) {
  playNote(note);
  let executionTime = 0;
  if (currentGuessIndex === 0) {
    startTimer = new Date().getTime();
  }
  if (currentGuessIndex === 7) {
    endTimer = new Date().getTime();
    executionTime = (endTimer - startTimer) / 1000;
    displayTimer(executionTime);
  }
  if (currentGuessIndex < 8) {
    guesses[currentGuessIndex] = note;
    currentGuessIndex++;
    updateDisplay(executionTime);
  }
}

function updateDisplay(executionTime) {
  for (let i = 0; i < 8; i++) {
    const noteElement = document.getElementById(`note${i + 1}`);
    noteElement.textContent = currentNotes[i];
    const guessElement = document.getElementById(`guess${i + 1}`);
    if (guesses[i] !== undefined) {
      guessElement.textContent = guesses[i];
      guessElement.style.backgroundColor =
        guesses[i] === currentNotes[i] ? "green" : "lightcoral";
    } else {
      guessElement.textContent = "";
      guessElement.style.backgroundColor = "gray";
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initCanvas();
  startNewRound();
});
