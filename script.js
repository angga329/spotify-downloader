document.getElementById('search-btn').addEventListener('click', function() {
    const urlInput = document.getElementById('spotify-url').value.trim();
    const resultContainer = document.getElementById('result-container');
    const loading = document.getElementById('loading');

    // Validasi input
    if (!urlInput) {
        alert("Harap masukkan link Spotify terlebih dahulu!");
        return;
    }

    // Tampilkan loading dan kosongkan hasil sebelumnya
    loading.style.display = 'flex';
    resultContainer.innerHTML = '';

    // Encode URL agar aman dimasukkan ke dalam parameter API
    const encodedUrl = encodeURIComponent(urlInput);
    const apiUrl = `https://api.ikyyxd.my.id/download/spotifydl?url=${encodedUrl}`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            loading.style.display = 'none';
            console.log("Respon API:", data);

            try {
                // Ekstraksi data dari respon API
                const trackData = data.result || data.data || data;
                
                const title = trackData.title || trackData.name || "Judul tidak diketahui";
                const artist = trackData.artists || trackData.artist || "Artis tidak diketahui";
                const image = trackData.thumbnail || trackData.image || trackData.cover_url || "";
                const downloadUrl = trackData.url || trackData.link || trackData.download || "";

                if (!downloadUrl) {
                    resultContainer.innerHTML = `<div class="error-msg">Gagal mendapatkan link download dari API.</div>`;
                    return;
                }

                // Tampilkan Hasil di DOM
                resultContainer.innerHTML = `
                    ${image ? `<img src="${image}" alt="Cover Lagu" class="cover-image">` : ''}
                    <div class="track-info">
                        <div class="track-title">${title}</div>
                        <div class="track-artist">${artist}</div>
                    </div>
                    <a href="${downloadUrl}" class="download-btn" target="_blank" rel="noopener noreferrer">Download MP3</a>
                `;
            } catch (error) {
                console.error("Error parsing data:", error);
                resultContainer.innerHTML = `<div class="error-msg">Format data API tidak dikenali.</div>`;
            }
        })
        .catch(error => {
            loading.style.display = 'none';
            console.error("Terjadi kesalahan:", error);
            resultContainer.innerHTML = `<div class="error-msg">Gagal menghubungi server API. Cek koneksi atau coba lagi nanti.</div>`;
        });
});
