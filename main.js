async function translateText() {

  const text = inputText.value.trim();

  if (text === "") {
    resultText.innerHTML = "⚠ Please type something...";
    return;
  }

  resultText.innerHTML = "⏳ Translating...";

  // ===== FIX AUTO LANGUAGE =====
  let sourceLang = fromLang.value;
  let targetLang = toLang.value;

  // MyMemory API auto support করে না
  if (sourceLang === "auto") {
    sourceLang = "en";
  }

  const url =
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;

  try {

    const response = await fetch(url);
    const data = await response.json();

    const translated =
      data.responseData.translatedText;

    // ===== Typing Animation =====
    typeText(translated);

    // ===== Voice =====
    speakText(translated);

    // ===== Vibration =====
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

  } catch (error) {

    resultText.innerHTML =
      "❌ Translation failed";

    console.log(error);
  }
}
