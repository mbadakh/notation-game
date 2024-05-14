function  initCanvas(){
    const staff = document.querySelector(".staff");
    // Create 5 staff lines
    for (let i = 0; i < 5; i++) {
      const line = document.createElement("div");
      staff.appendChild(line);
    }
}
function playNote(note) {
  // Map of notes to frequencies
  const noteFrequencies = {
    C: 261.63,
    D: 293.66,
    E: 329.63,
    F: 349.23,
    G: 392.0,
    A: 440.0,
    B: 493.88,
  };
  const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

  const frequency = noteFrequencies[note];
  if (frequency) {
    // Create an oscillator
    const oscillator = audioContext.createOscillator();
    oscillator.type = "sine"; // You can change the type to 'square', 'sawtooth', or 'triangle'
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Connect the oscillator to the destination (speakers)
    oscillator.connect(audioContext.destination);

    // Start the oscillator
    oscillator.start();

    // Stop the oscillator after 1 second
    oscillator.stop(audioContext.currentTime + 0.2);
  }
}

function generateDisplayNotes(){
  const notePositions = [
    { note: "C", position: -3.6, lineThrough: true },
    { note: "D", position: -3, lineThrough: false },
    { note: "E", position: -2.4, lineThrough: false },
    { note: "F", position: -1.8, lineThrough: false },
    { note: "G", position: -1.2, lineThrough: false },
    { note: "A", position: -0.6, lineThrough: false },
    { note: "B", position: 0, lineThrough: false },
    { note: "C", position: 0.6, lineThrough: false },
    { note: "D", position: 1.2, lineThrough: false },
    { note: "E", position: 1.8, lineThrough: false },
    { note: "F", position: 2.4, lineThrough: false },
    { note: "G", position: 3, lineThrough: false },
    { note: "A", position: 3.6, lineThrough: true },
  ];
  const notesContainer = document.querySelector(".notes");
  notesContainer.replaceChildren([])
  // Function to generate random notes
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
  const randomNumbers = generateRandomNotes(8);
  return randomNumbers
}

function displayTimer(timer){
  let timerElement = document.getElementById(`timer`);
  let bestTimeElement = document.getElementById(`best-time`);
  let oldBest = Number(bestTimeElement.textContent);
  console.log(oldBest, timer);
  console.log(oldBest > timer);
  
  timerElement.textContent = timer;
  if (oldBest > timer) {
    bestTimeElement.textContent = timer;
  }
}
function startNewRound() {
  currentNotes = generateDisplayNotes();
  guesses = [];
  let startTimer;
  let endTimer;
  currentGuessIndex = 0;
  updateDisplay(0);
}

function makeGuess(note) {
  playNote(note);
  let executionTime = 0;
  if (currentGuessIndex  ==  0)
    startTimer = new Date().getTime()

  else if (currentGuessIndex == 7){
    endTimer = new Date().getTime();
    time = endTimer - startTimer;
    executionTime = time/1000
  }
    endTimer = new Date().getTime();
  if (currentGuessIndex < 8) {
    guesses[currentGuessIndex] = note;
    currentGuessIndex++;
    updateDisplay(executionTime);
  }
}
//
function updateDisplay(executionTime) {
  for (let i = 0; i < 8; i++) {
    let noteElement = document.getElementById(`note${i + 1}`);
    // thisRoundsLetters.push(currentNotes[i]);
    noteElement.textContent = currentNotes[i];

    let guessElement = document.getElementById(`guess${i + 1}`);
    if (guesses[i] !== undefined) {
      guessElement.textContent = guesses[i];
      if (guesses[i] === currentNotes[i]) {
        guessElement.style.backgroundColor = "green";
        if (i === 7) {
          if (executionTime > 0) {
            displayTimer(executionTime);
          }
        }
      } else {
        guessElement.style.backgroundColor = "lightcoral";
        guessElement.textContent += ` (${currentNotes[i]})`;
        if (i === 7) {
          if (executionTime > 0) {
            displayTimer(executionTime);
          }
        }
      }
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
