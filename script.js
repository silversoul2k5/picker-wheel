const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let angle = 0;
let spinning = false;

function getOptions() {
  return document
    .getElementById("options")
    .value
    .split("\n")
    .filter(o => o.trim() !== "");
}

function drawWheel(options) {
  const slice = (2 * Math.PI) / options.length;
  options.forEach((opt, i) => {
    ctx.beginPath();
    ctx.fillStyle = `hsl(${i * 360 / options.length}, 80%, 60%)`;
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, slice * i + angle, slice * (i + 1) + angle);
    ctx.fill();
  });
}

function spinWheel() {
  if (spinning) return;
  spinning = true;

  const options = getOptions();
  let speed = Math.random() * 0.3 + 0.3;

  const interval = setInterval(() => {
    angle += speed;
    speed *= 0.97;

    ctx.clearRect(0, 0, 400, 400);
    drawWheel(options);

    if (speed < 0.002) {
      clearInterval(interval);
      spinning = false;
      const selected =
        options[Math.floor(((2 * Math.PI - angle) % (2 * Math.PI)) / ((2 * Math.PI) / options.length))];
      document.getElementById("result").innerText = "Result: " + selected;
    }
  }, 16);
}

