let inputBuffer = "";
let activeTeam = null;

const bufferDisplay = document.querySelector(".buffer-display");

function updateBufferDisplay() {
    bufferDisplay.textContent = inputBuffer === "" ? "0" : inputBuffer;
}

// Active team selection
function setActiveTeam(team) {
    document.querySelector(".home-score").classList.remove("active-team");
    document.querySelector(".away-score").classList.remove("active-team");

    activeTeam = team;
    document.querySelector(`.${team}-score`).classList.add("active-team");
}

document.querySelector(".home-score").addEventListener("click", () => setActiveTeam("home"));
document.querySelector(".away-score").addEventListener("click", () => setActiveTeam("away"));

// Keypad number handling
document.querySelectorAll(".key").forEach(key => {
    key.addEventListener("click", () => {
        const value = key.textContent.trim();

        if (!isNaN(value)) {
            inputBuffer += value;
            updateBufferDisplay();
        }
    });
});

// Add button
document.querySelector(".add").addEventListener("click", () => {
    if (!activeTeam || inputBuffer === "") return;

    const amount = parseInt(inputBuffer, 10);
    const scoreBox = document.querySelector(`.${activeTeam}-score`);
    const footerBox = document.querySelector(`.${activeTeam}-total`);

    const current = parseInt(scoreBox.textContent, 10);
    const newScore = current + amount;

    scoreBox.textContent = newScore;
    footerBox.textContent = newScore;

    inputBuffer = "";
    updateBufferDisplay();
});

// Clear button
document.querySelector(".clear").addEventListener("click", () => {
    inputBuffer = "";
    updateBufferDisplay();
});
