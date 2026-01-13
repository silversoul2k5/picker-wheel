const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const inputBox = document.getElementById("inputs");

const SIZE = canvas.width;
const RADIUS = SIZE / 2;

let angle = 0;
let spinning = false;

/* ---------- HELPERS ---------- */

function getItems() {
  return inputBox.value
    .split("\n")
    .map(i => i.trim())
    .filter(i => i.length > 0);
}

/* ---------- DRAW WHEEL ---------- */

function drawWheel(items) {
  ctx.clearRect(0, 0, SIZE, SIZE);

  if (items.length === 0) {
    // empty state
    ctx.beginPath();
    ctx.arc(RADIUS, RADIUS, RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    return;
  }

  const slice = (Math.PI * 2) / items.length;

  items.forEach((item, i) => {
    const start = angle + i * slice;
    const end = start + slice;

    // slice
    ctx.beginPath();
    ctx.moveTo(RADIUS, RADIUS);
    ctx.arc(RADIUS, RADIUS, RADIUS, start, end);
    ctx.fillStyle = `hsl(${(i * 360) / items.length}, 70%, 55%)`;
    ctx.fill();

    // text
    ctx.save();
    ctx.translate(RADIUS, RADIUS);
    ctx.rotate(start + slice / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "16px system-ui";
    ctx.fillText(item, RADIUS - 15, 6);
    ctx.restore();
  });
}

/* ---------- SPIN ---------- */

function spinWheel() {
  const items = getItems();
  if (items.length < 2 || spinning) return;

  spinning = true;
  let velocity = Math.random() * 0.4 + 0.5;

  function animate() {
    velocity *= 0.985;
    angle += velocity;
    drawWheel(items);

    if (velocity < 0.002) {
      spinning = false;

      const slice = (Math.PI * 2) / items.length;
      const index =
        items.length -
        Math.floor((angle % (Math.PI * 2)) / slice) -
        1;

      alert("Selected: " + items[index]);
      return;
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ---------- EVENTS ---------- */

spinBtn.addEventListener("click", spinWheel);
inputBox.addEventListener("input", () => drawWheel(getItems()));

/* ---------- INITIAL DRAW ---------- */
drawWheel([]);

