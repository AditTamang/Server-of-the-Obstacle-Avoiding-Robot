const socket = new WebSocket("ws://localhost:8081");
const car = document.getElementById("car");
const indicators = {
  forward: document.getElementById("arrow-up"),
  backward: document.getElementById("arrow-down"),
  left: document.getElementById("arrow-left"),
  right: document.getElementById("arrow-right"),
};
const warning = document.getElementById("warning");
const warningSign = document.getElementById("warning-sign");
// const warningText = document.getElementById("warning-text");

const warningSound = document.getElementById("warning-sound");
let soundInitialized = false;

document.addEventListener("click", () => {
  if (!soundInitialized) {
    warningSound.volume = 0.5;
    soundInitialized = true;
  }
});
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateIndicators(data);
  handleWarning(data.distance);
};

function updateIndicators(data) {
  Object.keys(indicators).forEach((key) => {
    console.log(key);

    if (data[key] === 1) {
      indicators[key].style.animation = key + " 1s infinite";
      indicators[key].style.opacity = "1";
    } else {
      indicators[key].style.animation = "none";
      indicators[key].style.opacity = "0.3";
    }
  });
}

function handleWarning(distance) {
  const maxDistance = 200;
  if (distance < maxDistance) {
    const intensity = 1 - distance / maxDistance;
    warningSign.style.opacity = intensity;

    warningSign.style.opacity = intensity;
    // warningText.style.opacity = intensity;

    warning.classList.remove("hidden");
    warningSign.style.animation = "flash 1s infinite";
    if (soundInitialized) {
      warningSound.volume = intensity;

      if (warningSound.paused || warningSound.ended) {
        warningSound.play().catch((error) => {
          console.error("Audio playback failed:", error);
        });
      }
    }
  } else {
    warning.classList.add("hidden");
    warningSound.pause();
    warningSound.currentTime = 0;
  }
}
