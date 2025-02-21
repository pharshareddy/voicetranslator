let recognizedText = "";

// Function to start speech recognition
function startSpeechRecognition() {
    // Check if the browser supports speech recognition
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        alert("Your browser does not support speech recognition. Please try Chrome.");
        return;
    }

    // Create a new speech recognition instance
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US'; // Set language to English (US)
    recognition.start();

    // Event listener for speech recognition results
    recognition.onresult = (event) => {
        recognizedText = event.results[0][0].transcript; // Get recognized text
        document.getElementById("inputText").innerText = "Recognized Speech: " + recognizedText;
    };

    // Handle speech recognition errors
    recognition.onerror = (event) => {
        alert("Speech recognition error: " + event.error);
    };
}

// Function to translate recognized text
function translateText() {
    // Ensure there is text to translate
    if (!recognizedText) {
        alert("Please speak something first!");
        return;
    }

    // Get the target language selected by the user
    const targetLang = document.getElementById("targetLanguage").value;

    // Call Google Translate API to get the translation
    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(recognizedText)}`)
        .then(response => response.json())
        .then(data => {
            const translatedText = data[0][0][0]; // Extract translated text
            document.getElementById("translatedText").innerText = "Translated Text: " + translatedText;
            speakText(translatedText, targetLang); // Speak the translated text
        })
        .catch(() => {
            document.getElementById("translatedText").innerText = "Translation error. Please try again.";
        });
}

// Function to speak the translated text
function speakText(text, lang) {
    const utterance = new SpeechSynthesisUtterance(text); // Create a speech synthesis instance
    utterance.lang = lang; // Set the language for speech
    window.speechSynthesis.speak(utterance); // Speak the translated text
}

