// ====== ESTADO DEL JUEGO ======
let deck = [];
let playerCards = [];
let cpuCards = [];
let communityCards = [];

let playerChips = 1000;
let cpuChips = 1000;
let pot = 0;
let stage = "preflop"; // preflop, flop, turn, river, showdown

const suits = ["♠", "♥", "♦", "♣"];
const values = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];

// ====== UTILIDADES ======
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

function deal() {
  return deck.pop();
}

function renderCards(id, cards) {
  const el = document.getElementById(id);
  el.innerHTML = "";
  cards.forEach(c => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerText = c;
    el.appendChild(div);
  });
}

function updateUI() {
  document.getElementById("player-chips").innerText = playerChips;
  document.getElementById("cpu-chips").innerText = cpuChips;
  document.getElementById("pot").innerText = pot;
}

// ====== MANO NUEVA ======
function newHand() {
  createDeck();
  shuffleDeck();

  playerCards = [deal(), deal()];
  cpuCards = [deal(), deal()];
  communityCards = [];

  pot = 0;
  stage = "preflop";

  renderCards("player-cards", playerCards);
  renderCards("cpu-cards", cpuCards);
  renderCards("community-cards", communityCards);

  document.getElementById("status").innerText = "Nueva mano – Preflop";
  updateUI();
}

// ====== ACCIONES DEL JUGADOR ======
function playerCheck() {
  cpuAction();
}

function playerBet() {
  if (playerChips < 50) return;

  playerChips -= 50;
  pot += 50;
  document.getElementById("status").innerText = "Apostaste 50";
  updateUI();
  cpuAction(true);
}

function playerFold() {
  cpuChips += pot;
  pot = 0;
  updateUI();
  document.getElementById("status").innerText = "Te retiraste. CPU gana el bote.";
}

// ====== CPU SIMPLE ======
function cpuAction(playerBet = false) {
  const decision = Math.random();

  if (playerBet && decision > 0.35) {
    cpuChips -= 50;
    pot += 50;
    document.getElementById("status").innerText += " | CPU iguala";
  } else {
    document.getElementById("status").innerText += " | CPU pasa";
  }

  nextStage();
  updateUI();
}

// ====== AVANZAR ETAPAS ======
function nextStage() {
  if (stage === "preflop") {
    communityCards.push(deal(), deal(), deal());
    stage = "flop";
  } else if (stage === "flop") {
    communityCards.push(deal());
    stage = "turn";
  } else if (stage === "turn") {
    communityCards.push(deal());
    stage = "river";
  } else if (stage === "river") {
    showdown();
    return;
  }

  renderCards("community-cards", communityCards);
  document.getElementById("status").innerText += ` | ${stage.toUpperCase()}`;
}

// ====== EVALUACIÓN SIMPLE DE MANOS ======
function handStrength(cards) {
  let valuesOnly = cards.map(c => c.slice(0, -1));
  let score = 0;

  values.forEach(v => {
    const count = valuesOnly.filter(x => x === v).length;
    if (count === 2) score += 2;
    if (count === 3) score += 5;
    if (count === 4) score += 10;
  });

  return score;
}

// ====== SHOWDOWN ======
function showdown() {
  stage = "showdown";
  renderCards("cpu-cards", cpuCards);

  const playerScore = handStrength([...playerCards, ...communityCards]);
  const cpuScore = handStrength([...cpuCards, ...communityCards]);

  if (playerScore > cpuScore) {
    playerChips += pot;
    document.getElementById("status").innerText =
      "Showdown: GANAS la mano";
  } else if (cpuScore > playerScore) {
    cpuChips += pot;
    document.getElementById("status").innerText =
      "Showdown: CPU gana la mano";
  } else {
    playerChips += pot / 2;
    cpuChips += pot / 2;
    document.getElementById("status").innerText =
      "Showdown: Empate";
  }

  pot = 0;
  updateUI();
}

// ====== INICIO ======
newHand();
