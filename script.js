const book = document.getElementById("book");
const openBtn = document.getElementById("openBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const pageIndicator = document.getElementById("pageIndicator");

const photoInput = document.getElementById("photoInput");
const teacherPhoto = document.getElementById("teacherPhoto");
const musicInput = document.getElementById("musicInput");
const audioPlayer = document.getElementById("audioPlayer");
const musicButton = document.getElementById("musicButton");
const musicName = document.getElementById("musicName");
const musicStatus = document.getElementById("musicStatus");
const disc = document.getElementById("disc");

const recipientInput = document.getElementById("recipientInput");
const senderInput = document.getElementById("senderInput");
const messageInput = document.getElementById("messageInput");
const updateBtn = document.getElementById("updateBtn");

const recipientEls = [
  document.getElementById("heroRecipient"),
  document.getElementById("coverRecipient"),
  document.getElementById("footerRecipient")
];
const senderEls = [
  document.getElementById("senderDisplay"),
  document.getElementById("footerSender")
];
const dearLine = document.getElementById("dearLine");
const messageText = document.getElementById("messageText");

let state = 0; // 0 cover, 1 inside, 2 final

function updateView() {
  book.classList.toggle("open", state >= 1);
  book.classList.toggle("final", state === 2);

  pageIndicator.textContent =
    state === 0 ? "Cover" :
    state === 1 ? "Inside" : "Final Page";

  prevBtn.disabled = state === 0;
  nextBtn.disabled = state === 2;
  prevBtn.style.opacity = state === 0 ? ".5" : "1";
  nextBtn.style.opacity = state === 2 ? ".5" : "1";
}

function goTo(nextState) {
  const target = Math.max(0, Math.min(2, nextState));
  if (target !== state && target === 1) createConfetti();
  state = target;
  updateView();
}

openBtn.addEventListener("click", () => goTo(1));
nextBtn.addEventListener("click", () => goTo(state + 1));
prevBtn.addEventListener("click", () => goTo(state - 1));

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") goTo(state + 1);
  if (event.key === "ArrowLeft") goTo(state - 1);
});

photoInput.addEventListener("change", function () {
  const file = this.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please choose an image file.");
    return;
  }

  const url = URL.createObjectURL(file);
  teacherPhoto.src = url;
});

musicInput.addEventListener("change", function () {
  const file = this.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("audio/")) {
    alert("Please choose an audio file.");
    return;
  }

  const url = URL.createObjectURL(file);
  audioPlayer.src = url;
  musicName.textContent = file.name;
  musicStatus.textContent = "Ready to play";
  audioPlayer.pause();
  musicButton.textContent = "▶";
  disc.classList.remove("playing");
});

musicButton.addEventListener("click", async () => {
  if (!audioPlayer.src) {
    alert("Please add music to the card first.");
    return;
  }

  try {
    if (audioPlayer.paused) {
      await audioPlayer.play();
      musicButton.textContent = "❚❚";
      musicStatus.textContent = "Playing";
      disc.classList.add("playing");
    } else {
      audioPlayer.pause();
      musicButton.textContent = "▶";
      musicStatus.textContent = "Paused";
      disc.classList.remove("playing");
    }
  } catch (error) {
    musicStatus.textContent = "Tap play again to start";
  }
});

audioPlayer.addEventListener("ended", () => {
  musicButton.textContent = "▶";
  musicStatus.textContent = "Finished — play again";
  disc.classList.remove("playing");
});

function refreshNames() {
  const recipient = recipientInput.value.trim() || "Sir Randy Bello";
  const sender = senderInput.value.trim() || "Angela Joy Ibanez";

  recipientEls.forEach(el => el.textContent = recipient);
  senderEls.forEach(el => el.textContent = sender);
  dearLine.textContent = `DEAR ${recipient.toUpperCase()},`;
}

function updateMessage() {
  const value = messageInput.value.trim();
  if (!value) {
    alert("Please write a message first.");
    return;
  }

  refreshNames();
  messageText.textContent = value;
  updateBtn.textContent = "✓ Message Updated";

  setTimeout(() => {
    updateBtn.textContent = "✓ Update Message";
  }, 1800);
}

recipientInput.addEventListener("input", refreshNames);
senderInput.addEventListener("input", refreshNames);
updateBtn.addEventListener("click", updateMessage);

function createConfetti() {
  const colors = ["#b28a45", "#e1c78f", "#22211e", "#ffffff", "#9eafb7"];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.animationDuration = `${2.2 + Math.random() * 2.2}s`;
    piece.style.animationDelay = `${Math.random() * .45}s`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}

refreshNames();
messageText.textContent = messageInput.value.trim();
updateView();
