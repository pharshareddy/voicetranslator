let recognizedText = "";

// Function to start speech recognition
function startSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        alert("Your browser does not support speech recognition. Please try Chrome.");
        return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
        recognizedText = event.results[0][0].transcript;
        document.getElementById("inputText").innerText = "Recognized Speech: " + recognizedText;
    };

    recognition.onerror = (event) => {
        alert("Speech recognition error: " + event.error);
    };
}

// Function to translate recognized text
function translateText() {
    if (!recognizedText) {
        alert("Please speak something first!");
        return;
    }

    const targetLang = document.getElementById("targetLanguage").value;

    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(recognizedText)}`)
        .then(response => response.json())
        .then(data => {
            const translatedText = data[0][0][0];
            document.getElementById("translatedText").innerText = "Translated Text: " + translatedText;
            speakText(translatedText, targetLang);
        })
        .catch(() => {
            document.getElementById("translatedText").innerText = "Translation error. Please try again.";
        });
}

// Function to speak the translated text
function speakText(text, lang) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map Google Translate language codes to SpeechSynthesis voices
    const langMap = {
        'es': 'es-ES', 'fr': 'fr-FR', 'de': 'de-DE', 'hi': 'hi-IN',
        'it': 'it-IT', 'pt': 'pt-PT', 'ru': 'ru-RU', 'zh': 'zh-CN',
        'ja': 'ja-JP', 'ar': 'ar-SA', 'nl': 'nl-NL', 'ko': 'ko-KR',
        'tr': 'tr-TR', 'el': 'el-GR', 'pl': 'pl-PL', 'sv': 'sv-SE',
        'th': 'th-TH', 'vi': 'vi-VN', 'he': 'he-IL', 'cs': 'cs-CZ',
        'da': 'da-DK', 'fi': 'fi-FI', 'ro': 'ro-RO', 'uk': 'uk-UA','te':'te-TE'
    };

    utterance.lang = langMap[lang] || lang; 
    window.speechSynthesis.speak(utterance);
}
