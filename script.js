// script.js
const form = document.getElementById('downloadForm');
const inputUrl = document.getElementById('inputUrl');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = inputUrl.value.trim();
    if(!url) return;

    // Reset UI
    loadingDiv.classList.remove('hidden');
    resultDiv.classList.add('hidden');
    resultDiv.innerHTML = '';

    // Encode URL untuk dikirimkan ke API
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `https://api.ikyyxd.my.id/download/all-in-one?url=${encodedUrl}`;

    // Fetch API 
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            console.log("Data API:", data); // Debugging di console
            loadingDiv.classList.add('hidden');
            resultDiv.classList.remove('hidden');
            renderResult(data);
        })
        .catch(err => {
            console.error(err);
            loadingDiv.classList.add('hidden');
            resultDiv.classList.remove('hidden');
            resultDiv.innerHTML = `
                <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <h3 class="text-red-800 font-bold flex items-center gap-2">
                        <i class="fa-solid fa-triangle-exclamation"></i> Terjadi Kesalahan
                    </h3>
                    <p class="text-red-600 text-sm mt-1">Gagal mengambil data dari server. Periksa koneksi atau pastikan tautan valid.</p>
                    <p class="text-red-500 text-xs mt-1 font-mono">${err.message}</p>
                </div>
            `;
        });
});

// Fungsi untuk merender hasil JSON ke HTML
function renderResult(data) {
    const title = data.title || (data.result && data.result.title) || "Hasil Unduhan";
    const thumbnail = data.thumbnail || (data.result && data.result.thumbnail) || "https://placehold.co/600x400/e2e8f0/475569?text=No+Thumbnail";
    
    let downloadLinksHtml = '';
    const mediaList = data.medias || (data.result && data.result.medias) || data.urls || [];
    
    if (mediaList.length > 0) {
        mediaList.forEach(media => {
            const url = media.url || media;
            const quality = media.quality || media.type || "Download";
            downloadLinksHtml += `
                <a href="${url}" target="_blank" class="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 py-3 px-4 rounded-xl font-semibold transition-colors flex justify-between items-center group">
                    <span><i class="fa-solid fa-file-video mr-2"></i> ${quality}</span>
                    <i class="fa-solid fa-cloud-arrow-down opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </a>
            `;
        });
    } else {
        // Fallback
        const singleUrl = data.url || (data.result && data.result.url);
        if (singleUrl) {
            downloadLinksHtml = `
                <a href="${singleUrl}" target="_blank" class="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 py-3 px-4 rounded-xl font-semibold transition-colors flex justify-between items-center group">
                    <span><i class="fa-solid fa-download mr-2"></i> Unduh File</span>
                    <i class="fa-solid fa-cloud-arrow-down opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </a>
            `;
        } else {
            downloadLinksHtml = `<p class="text-gray-500 text-sm italic">Link unduhan tidak terdeteksi dari respons API. Cek data JSON di bawah.</p>`;
        }
    }

    resultDiv.innerHTML = `
        <div class="border border-gray-100 rounded-2xl p-4 bg-gray-50 shadow-inner flex flex-col md:flex-row gap-6 items-start">
            <div class="w-full md:w-1/3 flex-shrink-0">
                <img src="${thumbnail}" alt="Thumbnail" class="w-full rounded-xl shadow-md object-cover aspect-video bg-gray-200">
            </div>
            
            <div class="w-full md:w-2/3 flex flex-col gap-4">
                <h3 class="text-xl font-bold text-gray-800 line-clamp-2">${title}</h3>
                
                <div class="flex flex-col gap-3 mt-2">
                    ${downloadLinksHtml}
                </div>
            </div>
        </div>

        <div class="mt-6">
            <details class="group bg-gray-100 rounded-lg">
                <summary class="flex cursor-pointer items-center justify-between p-4 font-medium text-gray-700">
                    <span><i class="fa-solid fa-code mr-2"></i> Lihat Respons API Mentah (Developer)</span>
                    <i class="fa-solid fa-chevron-down transition-transform group-open:rotate-180"></i>
                </summary>
                <div class="p-4 bg-gray-800 text-green-400 font-mono text-xs overflow-x-auto rounded-b-lg">
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                </div>
            </details>
        </div>
    `;
}
