const startBtn = document.getElementById('startBtn');
const statusText = document.getElementById('status');
const userSpeechDiv = document.getElementById('userSpeech');
const jarvisResponseDiv = document.getElementById('jarvisResponse');

// Inisialisasi Speech Recognition (Pengenalan Suara)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Browser kamu tidak mendukung Speech Recognition. Gunakan Google Chrome.");
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID'; // Bahasa Indonesia

    startBtn.addEventListener('click', () => {
        recognition.start();
        statusText.innerText = "Mendengarkan...";
    });

    recognition.onresult = async (event) => {
        const query = event.results[0][0].transcript;
        userSpeechDiv.innerText = query;
        statusText.innerText = "Jarvis sedang berpikir...";

        // Panggil API Jarvis
        await askJarvis(query);
    };

    recognition.onerror = (event) => {
        console.error(event.error);
        statusText.innerText = "Terjadi kesalahan saat mendengarkan.";
    };
}

// Fungsi untuk fetching API dan merespons
async function askJarvis(text) {
    try {
        const response = await fetch(`https://api.ikyyxd.my.id/ai/unliai?teks=${encodeURIComponent(text)}`);
        const data = await response.json();
        
        // Mengambil teks hasil respons dari data API
        const answer = data.result || data.message || JSON.stringify(data);
        
        jarvisResponseDiv.innerText = answer;
        statusText.innerText = "Selesai.";
        
        // Jarvis menjawab dengan suara
        speak(answer);
    } catch (error) {
        console.error(error);
        jarvisResponseDiv.innerText = "Gagal terhubung ke API.";
        statusText.innerText = "Error.";
    }
}

// Fungsi Text-to-Speech (Suara Jarvis)
function speak(text) {
    // Hentikan suara sebelumnya jika ada
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0; // Kecepatan bicara
    utterance.pitch = 1.0; // Nada suara

    window.speechSynthesis.speak(utterance);
}