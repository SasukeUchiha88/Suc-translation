// ===== PREMIUM AI TRANSLATOR =====

const inputText = document.getElementById("inputText");
const resultText = document.getElementById("resultText");
const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");
const translateBtn = document.getElementById("translateBtn");
const bubble = document.getElementById("bubble");

// ===== Translate Function =====

async function translateText() {

  const text = inputText.value.trim();

  if (text === "") {
    resultText.innerHTML = "⚠ Please type something...";
    return;
  }

  resultText.innerHTML = "⏳ Translating...";

  const url =
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang.value}|${toLang.value}`;

  try {

    const response = await fetch(url);
    const data = await response.json();

    const translated =
      data.responseData.translatedText;

    // Typing Animation
    typeText(translated);

    // Voice Speak
    speakText(translated);

    // Vibration
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

  } catch (error) {

    resultText.innerHTML =
      "❌ Translation failed";

    console.log(error);
  }
}

// ===== Typing Animation =====

function typeText(text) {

  resultText.innerHTML = "";

  let i = 0;

  const typing = setInterval(() => {

    resultText.innerHTML += text.charAt(i);

    i++;

    if (i >= text.length) {
      clearInterval(typing);
    }

  }, 25);
}

// ===== Voice =====

function speakText(text) {

  const speech =
    new SpeechSynthesisUtterance(text);

  speech.lang = toLang.value;

  speech.rate = 1;

  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

// ===== Floating Bubble =====

bubble.addEventListener("click", () => {

  bubble.style.transform = "scale(0.9)";

  setTimeout(() => {
    bubble.style.transform = "scale(1)";
  }, 150);

  translateText();
});

// ===== Button =====

translateBtn.addEventListener(
  "click",
  translateText
);

// ===== Enter Key =====

inputText.addEventListener(
  "keydown",
  (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      translateText();
    }
  }
);

// ===== Auto Theme =====

const hour = new Date().getHours();

if (hour >= 6 && hour < 18) {

  document.body.style.background =
    "linear-gradient(135deg,#0f172a,#1e293b)";

} else {

  document.body.style.background =
    "linear-gradient(135deg,#020617,#050816)";
}

// ===== Bubble Drag =====

let isDragging = false;

bubble.addEventListener("touchstart", () => {
  isDragging = true;
});

bubble.addEventListener("touchmove", (e) => {

  if (!isDragging) return;

  const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;

  bubble.style.left = `${x - 30}px`;
  bubble.style.top = `${y - 30}px`;

});

bubble.addEventListener("touchend", () => {
  isDragging = false;
});

// ===== Welcome =====

window.onload = () => {

  setTimeout(() => {

    resultText.innerHTML =
      "🌍 AI Translator Ready...";

  }, 600);
};
