// Simple league/team lists
const leagues = ["Dudley", "Oldbury", "Smethwick", "Kingswinford"];
const teams = {
  "Dudley": ["Senior A", "Senior B", "Senior C", "Senior D", "Ladies", "Team A", "Team B"],
  "Oldbury": ["Senior A", "Senior B", "Senior C", "Senior D", "Team A"],
  "Smethwick": ["Team A"],
  "Kingswinford": ["Team A", "Team B"]
};

let currentGameCount = 6;
let gameState = [];

function initMatchboard() {
  initSelectors();
  buildGames(currentGameCount);
  attachGlobalHandlers();
  updateAggregate();
}

function initSelectors() {
  const leagueSel = document.getElementById("leagueSelect");
  const teamSel = document.getElementById("teamSelect");

  leagueSel.innerHTML = "";
  leagues.forEach(l => leagueSel.add(new Option(l, l)));

  leagueSel.addEventListener("change", () => {
    loadTeams(leagueSel.value);
  });

  loadTeams(leagues[0]);

  document.getElementById("formatSelect").addEventListener("change", (e) => {
    const count = parseInt(e.target.value, 10);
    currentGameCount = count;
    buildGames(count);
    updateAggregate();
  });
}

function loadTeams(league) {
  const teamSel = document.getElementById("teamSelect");
  teamSel.innerHTML = "";
  (teams[league] || []).forEach(t => teamSel.add(new Option(t, t)));
}

function buildGames(count) {
  const grid = document.getElementById("matchGrid");
  grid.innerHTML = "";
  gameState = [];

  for (let i = 1; i <= count; i++) {
    gameState.push({ homeScore: 0, awayScore: 0 });

    const card = document.createElement("div");
    card.className = "game-card";
    card.dataset.gameIndex = i - 1;

    const header = document.createElement("div");
    header.className = "game-header";
    header.textContent = `Game ${i}`;
    card.appendChild(header);

    const body = document.createElement("div");
    body.className = "game-body";

    const nameRow = document.createElement("div");
    nameRow.className = "name-row";
    nameRow.innerHTML = `
      <div class="name-label">Home player</div>
      <div class="name-label" style="text-align:right;">Away player</div>
    `;
    body.appendChild(nameRow);

    const nameInputRow = document.createElement("div");
    nameInputRow.className = "name-input-row";
    nameInputRow.innerHTML = `
      <input type="text" placeholder="Home name">
      <input type="text" placeholder="Away name">
    `;
    body.appendChild(nameInputRow);

    const scoreRow = document.createElement("div");
    scoreRow.className = "score-row";
    scoreRow.innerHTML = `
      <div class="score-box">
        <label>Home score</label>
        <input type="number" min="0" max="21" value="0">
      </div>
      <div class="score-box">
        <label>Away score</label>
        <input type="number" min="0" max="21" value="0">
      </div>
    `;
    body.appendChild(scoreRow);

    const running = document.createElement("div");
    running.className = "running-total";
    running.innerHTML = `Running total: <span>0 – 0 (Level)</span>`;
    body.appendChild(running);

    card.appendChild(body);
    grid.appendChild(card);

    const homeInput = scoreRow.querySelectorAll("input")[0];
    const awayInput = scoreRow.querySelectorAll("input")[1];

    homeInput.addEventListener("input", () => {
      onScoreChange(i - 1, homeInput, awayInput, running, card);
    });

    awayInput.addEventListener("input", () => {
      onScoreChange(i - 1, homeInput, awayInput, running, card);
    });
  }
}

function onScoreChange(index, homeInput, awayInput, runningEl, card) {
  let h = parseInt(homeInput.value || "0", 10);
  let a = parseInt(awayInput.value || "0", 10);

  if (h < 0) h = 0;
  if (a < 0) a = 0;
  if (h > 21) h = 21;
  if (a > 21) a = 21;

  homeInput.value = h;
  awayInput.value = a;

  gameState[index].homeScore = h;
  gameState[index].awayScore = a;

  updateGameRunningTotal(h, a, runningEl);
  updateGameWinner(card, h, a);
  updateAggregate();
}

function updateGameRunningTotal(h, a, runningEl) {
  const diff = h - a;
  let diffText = diff > 0 ? `(+${diff})` : diff < 0 ? `(${diff})` : `(Level)`;
  runningEl.innerHTML = `Running total: <span>${h} – ${a} ${diffText}</span>`;
}

function updateGameWinner(card, h, a) {
  const inputs = card.querySelectorAll(".score-box input");
  const homeInput = inputs[0];
  const awayInput = inputs[1];

  homeInput.classList.remove("winner-home");
  awayInput.classList.remove("winner-away");

  if (h === 21 && a < 21) homeInput.classList.add("winner-home");
  else if (a === 21 && h < 21) awayInput.classList.add("winner-away");
}

function updateAggregate() {
  let totalHome = 0;
  let totalAway = 0;

  gameState.forEach(g => {
    totalHome += g.homeScore;
    totalAway += g.awayScore;
  });

  const diff = totalHome - totalAway;
  let diffText = diff > 0 ? `(+${diff})` : diff < 0 ? `(${diff})` : `(Level)`;

  document.getElementById("aggregateDisplay").innerHTML =
    `${totalHome} – ${totalAway} <span>${diffText}</span>`;
}

function attachGlobalHandlers() {
  document.getElementById("resetMatch").addEventListener("click", () => {
    buildGames(currentGameCount);
    updateAggregate();
  });
}

/* NEW: setup hide/show controls */
function setupToggleControls() {
  const wrapper = document.getElementById("setupWrapper");
  const hideBtn = document.getElementById("hideSetupBtn");
  const showBtn = document.getElementById("showSetupBtn");

  hideBtn.addEventListener("click", () => {
    wrapper.classList.add("hidden");
    showBtn.classList.remove("hidden");
  });

  showBtn.addEventListener("click", () => {
    wrapper.classList.remove("hidden");
    showBtn.classList.add("hidden");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMatchboard();
  setupToggleControls();
});
