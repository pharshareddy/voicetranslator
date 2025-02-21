const speakButton = document.getElementById('speakButton');
const exitButton = document.getElementById('exitButton');
const languageSelect = document.getElementById('languageSelect');
const originalText = document.getElementById('original');
const translatedText = document.getElementById('translated');

let isRunning = false;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  alert("Speech recognition is not supported in this browser.");
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  async function translateText(text, targetLang) {
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
      const data = await response.json();
      return data.responseData.translatedText;
    } catch (error) {
      console.error("Translation API error:", error);
      return "Translation failed.";
    }
  }

  function speakText(text, lang) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  }

  function startRecognition() {
    if (!isRunning) return;
    speakButton.textContent = "🎙 Listening...";
    recognition.start();

    recognition.onresult = async (event) => {
      const speech = event.results[0][0].transcript;
      originalText.textContent = speech;
      const targetLang = languageSelect.value;
      const translated = await translateText(speech, targetLang);
      translatedText.textContent = translated;
      speakText(translated, targetLang);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      speakButton.textContent = "🔊 Start";
      if (isRunning) {
        startRecognition();
      }
    };
  }

  speakButton.addEventListener('click', () => {
    isRunning = true;
    startRecognition();
  });

  exitButton.addEventListener('click', () => {
    isRunning = false;
    recognition.abort();
    translatedText.textContent = 'Translation stopped.';
    originalText.textContent = 'Translation stopped.';
  });
}
