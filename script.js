const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");

const textInput = document.getElementById("textInput");
const addBtn = document.getElementById("addBtn");
const itemList = document.getElementById("itemList");

const SIZE = canvas.width;
const RADIUS = SIZE / 2;

let items = [];
let angle = 0;
let spinning = false;

/* ---------- DRAW WHEEL ---------- */

function drawWheel() {
  ctx.clearRect(0, 0, SIZE, SIZE);

  if (items.length === 0) {
    ctx.beginPath();
    ctx.arc(RADIUS, RADIUS, RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    return;
  }

  const slice = (Math.PI * 2) / items.length;

  items.forEach((text, i) => {
    const start = angle + i * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.moveTo(RADIUS, RADIUS);
    ctx.arc(RADIUS, RADIUS, RADIUS, start, end);
    ctx.fillStyle = `hsl(${(i * 360) / items.length}, 70%, 55%)`;
    ctx.fill();

    ctx.save();
    ctx.translate(RADIUS, RADIUS);
    ctx.rotate(start + slice / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "16px system-ui";
    ctx.fillText(text, RADIUS - 15, 6);
    ctx.restore();
  });
}

/* ---------- INPUT HANDLING ---------- */

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

function renderList() {
  itemList.innerHTML = "";
  items.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${item} <button onclick="removeItem(${i})">🗑</button>`;
    itemList.appendChild(li);
  });
}

addBtn.onclick = addItem;
textInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addItem();
});

/* ---------- SPIN ---------- */

spinBtn.onclick = () => {
  if (items.length < 2 || spinning) return;

  spinning = true;
  let velocity = Math.random() * 0.4 + 0.5;

  function animate() {
    velocity *= 0.985;
    angle += velocity;
    drawWheel();

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
};

/* ---------- INIT ---------- */
drawWheel();

