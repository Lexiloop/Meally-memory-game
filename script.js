const gameContainer = document.getElementById('game-container');
const menu = document.getElementById('menu');
const gameBoard = document.getElementById('game-board');
const scoreBoard = document.getElementById('scoreboard');
const scoreDisplay = document.getElementById('score');
const endMessage = document.getElementById('end-message');
const playAgainButton = document.getElementById('play-again-button');
const loseMessage = document.getElementById('lose-message');
const tryAgainButton = document.getElementById('try-again-button');
const finalScoreDisplay = document.getElementById('final-score');
const levelSelect = document.getElementById('level-select');
const startButton = document.getElementById('start-button');
const opportunitiesDisplay = document.getElementById('opportunities');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let pairsFound = 0;
let totalPairs = 0;
let opportunities = 0;
let score = 0;

const cardData = {
  1: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg'],
  2: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg'],
  3: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg', 'img7.jpg', 'img8.jpg', 'img9.jpg', 'img10.jpg', 'img11.jpg', 'img12.jpg']
};

function addTouchAndClickListener(element, handler) {
  element.addEventListener('click', handler);
  element.addEventListener('touchstart', handler);
}

addTouchAndClickListener(startButton, startGame);
addTouchAndClickListener(playAgainButton, () => {
  endMessage.classList.add('hidden');
  gameBoard.innerHTML = '';
  gameBoard.classList.add('hidden');
  scoreBoard.classList.add('hidden');
  menu.classList.remove('hidden');
  pairsFound = 0;
  score = 0;
  resetBoard();
});
addTouchAndClickListener(tryAgainButton, resetGame);

function startGame() {
  // Limpiar tablero y restablecer variables
  gameBoard.innerHTML = '';
  pairsFound = 0;
  score = 0;
  firstCard = null;
  secondCard = null;

  // Obtener nivel seleccionado y cargar cartas
  const level = parseInt(levelSelect.value);
  createBoard(level);

  // Configurar oportunidades y pares totales según el nivel
  switch (level) {
    case 1:
      opportunities = 4;
      totalPairs = 4;
      break;
    case 2:
      opportunities = 6;
      totalPairs = 6;
      break;
    case 3:
      opportunities = 12;
      totalPairs = 12;
      break;
  }

  opportunitiesDisplay.textContent = opportunities;

  // Mostrar el tablero y el marcador
  scoreBoard.classList.remove('hidden');
  gameBoard.classList.remove('hidden');
  menu.classList.add('hidden');
}

function createBoard(level) {
  const images = cardData[level];
  const shuffledImages = [...images, ...images].sort(() => 0.5 - Math.random());

  // Limpiar las clases existentes y añadir la clase del nivel
  gameBoard.className = 'hidden';
  gameBoard.classList.add('level-' + level);

  shuffledImages.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front" style="background-image: url('images/${image}')"></div>
        <div class="card-back"></div>
      </div>
    `;
    addTouchAndClickListener(card, flipCard);
    gameBoard.appendChild(card);
  });

  gameBoard.classList.remove('hidden');
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.innerHTML === secondCard.innerHTML;

  if (isMatch) {
    disableCards();
    updateScore();
    pairsFound++;
    if (pairsFound === totalPairs) {
      setTimeout(endGame, 500);
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  opportunities--;

  if (opportunities === 0) {
    setTimeout(loseGame, 1000);
    return;
  }

  opportunitiesDisplay.textContent = opportunities;

  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function updateScore() {
  score++;
  scoreDisplay.textContent = score;
}

function endGame() {
  endMessage.classList.remove('hidden');
}

function loseGame() {
  finalScoreDisplay.textContent = score;
  loseMessage.classList.remove('hidden');
}

function resetGame() {
  loseMessage.classList.add('hidden');
  gameBoard.innerHTML = '';
  gameBoard.classList.add('hidden');
  scoreBoard.classList.add('hidden');
  menu.classList.remove('hidden');
  pairsFound = 0;
  score = 0;
  resetBoard();
}
