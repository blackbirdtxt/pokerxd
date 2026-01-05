let deck = [];
let playerCards = [];
let cpuCards = [];
let communityCards = [];

let playerChips = 1000;
let cpuChips = 1000;
let pot = 0;

const suits = ["♠", "♥", "♦", "♣"];
const values = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];

function createDeck() {
  deck = [];
  for (let s of suits) {
    for (let v of values) {
      deck.push(v + s);
    }
  }
}

function shuffleDeck() {
  deck.sort(() => Math.random() - 0.5);
}

function dealCard() {
  return deck.pop();
}

function renderCards(elementId, cards) {
  const el = document.getElementById(elementId);
  el.innerHTML = "";
  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerText = card;
    el.appendChild(div);
  });
}

function newHand() {
  createDeck();
  shuffleDeck();

  playerCards = [dealCard(), dealCard()];
  cpuCards = [dealCard(), dealCard()];
  communityCards = [];

  pot = 0;

  renderCards("player-cards", playerCards);
  renderCards("cpu-cards", cpuCards);
  renderCards("community-cards", communityCards);

  document.getElementById("status").innerText = "Nueva mano repartida";
}

function check() {
  document.getElementById("status").innerText = "Hiciste check";
  cpuAction();
}

function bet() {
  if (playerChips < 50) return;

  playerChips -= 50;
  pot += 50;
  document.getElementById("player-chips").innerText = playerChips;

  document.getElementById("status").innerText = "Apostaste 50";
  cpuAction(true);
}

function fold() {
  cpuChips += pot;
  pot = 0;
  document.getElementById("cpu-chips").innerText = cpuChips;
  document.getElementById("status").innerText = "Te retiraste. Gana la CPU.";
}

function cpuAction(playerBet = false) {
  const action = Math.random();

  if (playerBet && action > 0.4) {
    cpuChips -= 50;
    pot += 50;
    document.getElementById("cpu-chips").innerText = cpuChips;
    document.getElementById("status").innerText += " | CPU iguala";
  } else {
    document.getElementById("status").innerText += " | CPU pasa";
  }

  revealCommunity();
}

function revealCommunity() {
  if (communityCards.length < 5) {
    communityCards.push(dealCard());
    renderCards("community-cards", communityCards);
  }
}

newHand();
