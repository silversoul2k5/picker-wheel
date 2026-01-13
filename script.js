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

let items = ["YES", "NO", "YES", "NO", "YES", "NO", "YES", "NO", "Arjun"];
let angle = 0;
let spinning = false;
let idleSpin = true;

let spinCount = 0;

/* ---------- DRAW ---------- */
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
    ctx.fillStyle = color === COLORS[0] || color === COLORS[1] ? "#fff" : "#000";
    ctx.fillText(text, RADIUS - 18, 8);
    ctx.restore();
  });
}

/* ---------- IDLE ---------- */
function idle() {
  if (!spinning && idleSpin) {
    angle += 0.002;
    drawWheel();
  }
  requestAnimationFrame(idle);
}

/* ---------- SECRET PICK ---------- */
function pickTargetIndex() {
  const arjunIndex = items.findIndex(i => i.toLowerCase() === "arjun");

  if (arjunIndex !== -1 && spinCount < 3) {
    spinCount++;
    return arjunIndex;
  }

  spinCount++;
  return Math.floor(Math.random() * items.length);
}

/* ---------- SPIN ---------- */
spinBtn.onclick = () => {
  if (spinning || items.length < 2) return;

  spinning = true;
  idleSpin = false;

  const targetIndex = pickTargetIndex();
  const slice = (Math.PI * 2) / items.length;

  const extraSpins = 6 + Math.random() * 3;
  const targetAngle =
    extraSpins * Math.PI * 2 +
    (Math.PI * 1.5 - (targetIndex + 0.5) * slice);

  const startAngle = angle;
  const duration = 4000;
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animate(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);

    angle = startAngle + (targetAngle - startAngle) * eased;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      idleSpin = true;
      showResult(items[targetIndex]);
    }
  }

  requestAnimationFrame(animate);
};

/* ---------- RESULT ---------- */
function showResult(text) {
  resultText.textContent = text;
  overlay.classList.remove("hidden");
}

doneBtn.onclick = () => overlay.classList.add("hidden");

/* ---------- INIT ---------- */
drawWheel();
idle();

