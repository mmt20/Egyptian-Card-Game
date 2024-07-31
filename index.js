const value = ['C', 'D', 'H', 'S'];
const key = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

const playerOne = document.getElementById('playerOne');
const playerTwo = document.getElementById('playerTwo');
const ground = document.getElementById('ground');
const drawCardBtn = document.getElementById('drawCardBtn');
const restartBtn = document.getElementById('restartBtn');

const allCards = [];
let playerOneCards = [];
let playerTwoCards = [];
let groundCards = [];
let currentPlayer = 1;
let playerOneScore = 0;
let playerTwoScore = 0;

function initializeCards() {
  for (let i = 0; i < value.length; i++) {
    for (let j = 0; j < key.length; j++) {
      allCards.push(key[j] + value[i]);
    }
  }
}

function shuffleCards() {
  allCards.sort(() => Math.random() - 0.5);
}

function dealInitialCards() {
  for (let i = 0; i < 4; i++) {
    playerOneCards.push(drawCard());
    playerTwoCards.push(drawCard());
    groundCards.push(drawCard());
  }
  updateCardDisplay();
}

function drawCard() {
  if (allCards.length === 0) {
    alert("No more cards !");
    return null;
  }
  const card = allCards.pop();
  return card;
}

function updateCardDisplay() {
  updatePlayerCards('playerOne', playerOneCards);
  updatePlayerCards('playerTwo', playerTwoCards);
  updatePlayerCards('ground', groundCards);
}

function updatePlayerCards(cardId, cards) {
  const element = document.getElementById(cardId);
  element.innerHTML = '';

  const title = document.createElement('h3');
  title.innerText = cardId === 'ground' ? 'Ground' : `Player ${cardId === 'playerOne' ? 1 : 2}`;
  element.appendChild(title);

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');
  cards.forEach((card, index) => {
    const img = document.createElement('img');
    img.src = `/imgs/${card}.svg`;
    img.alt = card;
    if (cardId !== 'ground') {
      img.addEventListener('click', () => playCard(cardId, index));
    }
    cardContainer.appendChild(img);
  });
  element.appendChild(cardContainer);
}

function playCard(playerId, cardIndex) {

  if ((playerId === 'playerOne' && currentPlayer !== 1) || (playerId === 'playerTwo' && currentPlayer !== 2)) {
    return;
  }

  const playerCards = playerId === 'playerOne' ? playerOneCards : playerTwoCards;
  const playedCard = playerCards.splice(cardIndex, 1)[0];

  let matchFound = false;

  for (let i = 0; i < groundCards.length; i++) {
    if (playedCard[0] === groundCards[i][0]) {
      groundCards.splice(i, 1);
      matchFound = true;
      updateScore(currentPlayer);
      break;
    }
  }

  if (!matchFound) {
    groundCards.push(playedCard);
  }

  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateCardDisplay();
  updateMessage();
}

function updateScore(player) {
  if (player === 1) {
    playerOneScore++;
  } else {
    playerTwoScore++;
  }

  document.getElementById('PlayerOneScore').innerText = `Player 1: ${playerOneScore}`;
  document.getElementById('PlayerTwoScore').innerText = `Player 2: ${playerTwoScore}`;
}

function updateMessage() {
  let message = '';

  if (allCards.length === 0 && (playerOneCards.length === 0 || playerTwoCards.length === 0)) {
    if (playerOneScore > playerTwoScore) {
      message = 'Player 1 wins!';
    } else if (playerOneScore < playerTwoScore) {
      message = 'Player 2 wins!';
    } else {
      message = 'It\'s a tie!';
    }

    alert(message);
    drawCardBtn.style.display = 'none';
    restartBtn.style.display = 'block';
  } else {
    message = `Player ${currentPlayer}  turn`;
    drawCardBtn.style.display = 'block';
    restartBtn.style.display = 'none';
  }

  document.getElementById('message').innerText = message;
}


drawCardBtn.addEventListener('click', () => {
  addCardToPlayer(currentPlayer);
});

function addCardToPlayer(playerId) {
  const playerCards = playerId === 1 ? playerOneCards : playerTwoCards;
  if (playerCards.length < 4) {
    const card = drawCard();
    if (card) {
      playerCards.push(card);
      updateCardDisplay();
    }
  } else {
    alert(`Player ${playerId} has reached the maximum number of cards!`);
  }
}



document.getElementById('restartBtn').addEventListener('click', () => {
  startGame();
});

function startGame() {
  initializeCards();
  shuffleCards();
  dealInitialCards();
  updateMessage();
}

startGame();
