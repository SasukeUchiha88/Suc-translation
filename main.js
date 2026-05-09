// ===== PREMIUM AI TRANSLATOR =====

const inputText = document.getElementById("inputText");
const resultText = document.getElementById("resultText");
const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");
const translateBtn = document.getElementById("translateBtn");
const bubble = document.getElementById("bubble");

// ===== TRANSLATE =====

async function translateText() {

  const text = inputText.value.trim();

  if (!text) {
    resultText.innerHTML = "⚠ Please type something...";
    return;
  }

  resultText.innerHTML = "⏳ Translating...";

  let source = fromLang.value;
  let target = toLang.value;

  // ===== FIX AUTO =====
  if (source === "auto") {
    source = "en";
  }

  try {

    const response = await fetch(
      `const response = await fetch(
  "https://translate.argosopentech.com/translate",
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

const translated = data.translatedText;}`
    );

    const data = await response.json();

    console.log(data);

    // ===== CHECK RESPONSE =====
    if (
      data &&
      data.responseData &&
      data.responseData.translatedText
    ) {

      const translated =
        data.responseData.translatedText;

      typeText(translated);

      speakText(translated);

      if (navigator.vibrate) {
        navigator.vibrate(100);
      }

    } else {

      resultText.innerHTML =
        "❌ Translation unavailable";
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

// ===== VOICE =====

function speakText(text) {

  window.speechSynthesis.cancel();

  const speech =
    new SpeechSynthesisUtterance(text);

  speech.lang = toLang.value;

  speech.rate = 1;

  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

// ===== BUTTON =====

translateBtn.addEventListener(
  "click",
  translateText
);

// ===== FLOATING BUBBLE =====

bubble.addEventListener("click", () => {

  bubble.style.transform = "scale(0.9)";

  setTimeout(() => {
    bubble.style.transform = "scale(1)";
  }, 150);

  translateText();
});

// ===== ENTER =====

inputText.addEventListener(
  "keydown",
  (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      translateText();
    }
  }
);

// ===== DRAG BUBBLE =====

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

// ===== WELCOME =====

window.onload = () => {

  resultText.innerHTML =
    "🌍 AI Translator Ready...";
};
