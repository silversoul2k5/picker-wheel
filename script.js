const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const inputBox = document.getElementById("inputs");

let angle = 0;
let spinning = false;

function getItems() {
  return inputBox.value
    .split("\n")
    .map(v => v.trim())
    .filter(v => v);
}

function drawWheel(items) {
  const radius = canvas.width / 2;
  const slice = (2 * Math.PI) / items.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate(angle);

  items.forEach((text, i) => {
    ctx.beginPath();
    ctx.fillStyle = `hsl(${(i * 360) / items.length}, 70%, 55%)`;
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, slice * i, slice * (i + 1));
    ctx.fill();

    ctx.rotate(slice / 2);
    ctx.fillStyle = "#000";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(text, radius - 15, 5);
    ctx.rotate(-slice / 2);
  });

  ctx.restore();
}

function spin() {
  if (spinning) return;
  const items = getItems();
  if (items.length < 2) return alert("Enter at least 2 items");

  spinning = true;
  let velocity = Math.random() * 0.35 + 0.4;

  function animate() {
    velocity *= 0.985;
    angle += velocity;
    drawWheel(items);

    if (velocity < 0.002) {
      spinning = false;
      const slice = (2 * Math.PI) / items.length;
      const index =
        items.length -
        Math.floor((angle % (2 * Math.PI)) / slice) - 1;
      alert("Selected: " + items[index]);
      return;
    }
    requestAnimationFrame(animate);
  }

  animate();
}

spinBtn.onclick = spin;
inputBox.oninput = () => drawWheel(getItems());

