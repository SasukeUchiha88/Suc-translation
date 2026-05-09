// ===== PREMIUM AI TRANSLATOR =====

const inputText = document.getElementById("inputText");
const resultText = document.getElementById("resultText");
const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");
const translateBtn = document.getElementById("translateBtn");
const bubble = document.getElementById("bubble");

// ===== TRANSLATE FUNCTION =====

async function translateText() {

  const text = inputText.value.trim();

  if (!text) {

    resultText.innerHTML =
      "⚠ Please type something...";

    return;
  }

  resultText.innerHTML =
    "⏳ Translating...";

  let source = fromLang.value;
  let target = toLang.value;

  // ===== AUTO FIX =====

  if (source === "auto") {
    source = "en";
  }

  try {

    // ===== LIBRE TRANSLATE API =====

    const response = await fetch(
      "https://libretranslate.de/translate",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          q: text,
          source: source,
          target: target,
          format: "text"
        })
      }
    );

    const data = await response.json();

    console.log(data);

    // ===== RESULT =====

    if (data.translatedText) {

      const translated =
        data.translatedText;

      // typing animation
      typeText(translated);

      // voice speak
      speakText(translated);

      // vibration
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }

    } else {

      resultText.innerHTML =
        "❌ Translation failed";
    }

  } catch (error) {

    console.log(error);

    resultText.innerHTML =
      "❌ API Error";
  }
}

// ===== TYPE EFFECT =====

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

// ===== SPEAK VOICE =====

function speakText(text) {

  // stop old voice
  window.speechSynthesis.cancel();

  const speech =
    new SpeechSynthesisUtterance(text);

  speech.lang = toLang.value;

  speech.rate = 1;

  speech.pitch = 1;

  speech.volume = 1;

  window.speechSynthesis.speak(speech);
}

// ===== BUTTON CLICK =====

translateBtn.addEventListener(
  "click",
  translateText
);

// ===== FLOATING BUBBLE =====

bubble.addEventListener("click", () => {

  bubble.style.transform =
    "scale(0.9)";

  setTimeout(() => {

    bubble.style.transform =
      "scale(1)";

  }, 150);

  translateText();
});

// ===== ENTER KEY =====

inputText.addEventListener(
  "keydown",
  (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      translateText();
    }
  }
);

// ===== BUBBLE DRAG =====

let isDragging = false;

bubble.addEventListener(
  "touchstart",
  () => {

    isDragging = true;
  }
);

bubble.addEventListener(
  "touchmove",
  (e) => {

    if (!isDragging) return;

    const x =
      e.touches[0].clientX;

    const y =
      e.touches[0].clientY;

    bubble.style.left =
      `${x - 30}px`;

    bubble.style.top =
      `${y - 30}px`;
  }
);

bubble.addEventListener(
  "touchend",
  () => {

    isDragging = false;
  }
);

// ===== AUTO THEME =====

const hour =
  new Date().getHours();

if (hour >= 6 && hour < 18) {

  document.body.style.background =
    "linear-gradient(135deg,#0f172a,#1e293b)";

} else {

  document.body.style.background =
    "linear-gradient(135deg,#020617,#050816)";
}

// ===== WELCOME =====

window.onload = () => {

  setTimeout(() => {

    resultText.innerHTML =
      "🌍 AI Translator Ready...";

  }, 600);
};
