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

/* DEFAULT ITEMS LIKE IMAGE */
let items = ["YES", "NO", "YES", "NO", "YES", "NO", "YES", "NO"];

let angle = 0;
let spinning = false;
let idleSpin = true;
let lastSelectedIndex = null;

/* DRAW WHEEL */
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

/* IDLE SPIN */
function idleRotate() {
  if (!spinning && idleSpin) {
    angle += 0.002;
    drawWheel();
  }
  requestAnimationFrame(idleRotate);
}

/* INPUT */
function updateCount() {
  countEl.textContent = items.length;
}

function renderList() {
  itemList.innerHTML = "";
  items.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${item} <button onclick="removeItem(${i})">🗑</button>`;
    itemList.appendChild(li);
  });
  updateCount();
}

function addItem() {
  const value = textInput.value.trim();
  if (!value) return;
  items.push(value);
  textInput.value = "";
  renderList();
  drawWheel();
}

function removeItem(index) {
  items.splice(index, 1);
  renderList();
  drawWheel();
}

addBtn.onclick = addItem;
textInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addItem();
});

/* SPIN */
spinBtn.onclick = () => {
  if (items.length < 2 || spinning) return;

  spinning = true;
  idleSpin = false;

  let velocity = Math.random() * 0.5 + 0.6;

  function animate() {
    velocity *= 0.985;
    angle += velocity;
    drawWheel();

    if (velocity < 0.002) {
      spinning = false;
      idleSpin = true;

      const slice = (Math.PI * 2) / items.length;
      const normalized =
        (Math.PI * 1.5 - (angle % (Math.PI * 2)) + Math.PI * 2) %
        (Math.PI * 2);

      lastSelectedIndex = Math.floor(normalized / slice);
      showResult(items[lastSelectedIndex]);
      return;
    }
    requestAnimationFrame(animate);
  }

  animate();
};

/* RESULT */
function showResult(text) {
  resultText.textContent = text;
  overlay.classList.remove("hidden");
  launchConfetti();
}

hideBtn.onclick = () => {
  if (lastSelectedIndex !== null) {
    items.splice(lastSelectedIndex, 1);
    lastSelectedIndex = null;
    renderList();
    drawWheel();
  }
  overlay.classList.add("hidden");
};

doneBtn.onclick = () => overlay.classList.add("hidden");

/* CONFETTI */
function launchConfetti() {
  for (let i = 0; i < 80; i++) {
    const c = document.createElement("div");
    c.style.position = "fixed";
    c.style.left = Math.random() * 100 + "vw";
    c.style.top = "-10px";
    c.style.width = "8px";
    c.style.height = "8px";
    c.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    document.body.appendChild(c);

    c.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(110vh)" }],
      { duration: 1500 + Math.random() * 1000, easing: "ease-out" }
    );

    setTimeout(() => c.remove(), 2500);
  }
}

/* INIT */
renderList();
drawWheel();
idleRotate();

