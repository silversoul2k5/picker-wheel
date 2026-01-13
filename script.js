const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const spinBtn = document.getElementById("spinBtn");
const textInput = document.getElementById("textInput");
const addBtn = document.getElementById("addBtn");
const itemList = document.getElementById("itemList");
const countEl = document.getElementById("count");

const overlay = document.getElementById("resultOverlay");
const resultText = document.getElementById("resultText");
const hideBtn = document.getElementById("hideBtn");
const doneBtn = document.getElementById("doneBtn");

const SIZE = canvas.width;
const RADIUS = SIZE / 2;

const COLORS = ["#2f5d0a", "#6b7f1a", "#f2b705", "#fff1a8"];

/* BIAS CONFIG */
const ARJUN_WEIGHT = 3;

let items = ["YES", "NO", "YES", "NO", "YES", "NO", "YES", "NO"];
let angle = 0;
let spinning = false;
let idleSpin = true;
let lastSelectedIndex = null;

/* DRAW */
function drawWheel() {
  ctx.clearRect(0, 0, SIZE, SIZE);
  const slice = (Math.PI * 2) / items.length;

  items.forEach((text, i) => {
    const start = angle + i * slice;
    const end = start + slice;
    const color = COLORS[i % COLORS.length];

    ctx.beginPath();
    ctx.moveTo(RADIUS, RADIUS);
    ctx.arc(RADIUS, RADIUS, RADIUS, start, end);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.save();
    ctx.translate(RADIUS, RADIUS);
    ctx.rotate(start + slice / 2);
    ctx.textAlign = "right";
    ctx.font = "bold 22px system-ui";
    ctx.fillStyle =
      color === "#2f5d0a" || color === "#6b7f1a" ? "#fff" : "#000";
    ctx.fillText(text, RADIUS - 18, 8);
    ctx.restore();
  });
}

/* INPUT */
function renderList() {
  itemList.innerHTML = "";
  items.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${item} <button onclick="removeItem(${i})">🗑</button>`;
    itemList.appendChild(li);
  });
  countEl.textContent = items.length;
}

function addItem() {
  const v = textInput.value.trim();
  if (!v) return;
  items.push(v);
  textInput.value = "";
  renderList();
  drawWheel();
}

function removeItem(i) {
  items.splice(i, 1);
  renderList();
  drawWheel();
}

addBtn.onclick = addItem;
textInput.addEventListener("keydown", e => e.key === "Enter" && addItem());

/* WEIGHTED PICK */
function weightedPick() {
  const weights = items.map(i =>
    i.toLowerCase() === "arjun" ? ARJUN_WEIGHT : 1
  );

  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;

  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return 0;
}

/* SPIN (CORRECT LANDING) */
spinBtn.onclick = () => {
  if (spinning || items.length < 2) return;
  spinning = true;
  idleSpin = false;

  const targetIndex = weightedPick();
  const slice = (Math.PI * 2) / items.length;

  const extraRotations = Math.floor(Math.random() * 3) + 4; // 4–6 spins
  const targetAngle =
    extraRotations * Math.PI * 2 +
    (Math.PI * 1.5 - (targetIndex + 0.5) * slice);

  const startAngle = angle;
  const duration = 4000;
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animate(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    angle = startAngle + (targetAngle - startAngle) * easeOutCubic(t);
    drawWheel();

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      idleSpin = true;
      lastSelectedIndex = targetIndex;
      showResult(items[targetIndex]);
    }
  }

  requestAnimationFrame(animate);
};

/* RESULT */
function showResult(text) {
  resultText.textContent = text;
  overlay.classList.remove("hidden");
}

hideBtn.onclick = () => {
  if (lastSelectedIndex !== null) {
    items.splice(lastSelectedIndex, 1);
    renderList();
    drawWheel();
    lastSelectedIndex = null;
  }
  overlay.classList.add("hidden");
};

doneBtn.onclick = () => overlay.classList.add("hidden");

/* IDLE ROTATION */
function idle() {
  if (!spinning && idleSpin) {
    angle += 0.002;
    drawWheel();
  }
  requestAnimationFrame(idle);
}

/* INIT */
renderList();
drawWheel();
idle();

