/* ==========================================
   MONOPOLY PAY
   router.js
========================================== */

/**
 * SPA Router untuk Mengatur Perpindahan Halaman
 * @param {string} page - Nama halaman ('dashboard', 'transfer', 'bank', 'setting', 'history')
 */
function showPage(page) {
    const content = document.getElementById("pageContent");
    if (!content) return;

    // 1. PINDAH HALAMAN & RENDER HTML
    switch (page) {
        case "dashboard":
            if (typeof dashboardPage === "function") {
                content.innerHTML = dashboardPage();
            } else {
                content.innerHTML = `<div class="alert alert-danger">Fungsi dashboardPage() tidak ditemukan!</div>`;
            }
            break;

        case "transfer":
            if (typeof transferPage === "function") {
                content.innerHTML = transferPage();
                // Tunggu DOM selesai ditempel baru isi dropdown player
                setTimeout(() => {
                    if (typeof loadTransferPlayer === "function") loadTransferPlayer();
                }, 20);
            } else {
                content.innerHTML = `<div class="alert alert-danger">Fungsi transferPage() tidak ditemukan!</div>`;
            }
            break;

        case "bank":
            if (typeof bankPage === "function") {
                content.innerHTML = bankPage();
                // Tunggu DOM selesai ditempel baru isi dropdown bank player
                setTimeout(() => {
                    if (typeof loadBankPlayer === "function") loadBankPlayer();
                }, 20);
            } else {
                content.innerHTML = `<div class="alert alert-danger">Fungsi bankPage() tidak ditemukan!</div>`;
            }
            break;

        case "history":
            if (typeof historyPage === "function") {
                content.innerHTML = historyPage();
            } else {
                content.innerHTML = `
                    <div class="card-box">
                        <h3><i class="bi bi-clock-history"></i> History Transaksi</h3>
                        <p class="text-muted">Riwayat transaksi game Anda akan muncul di sini.</p>
                    </div>`;
            }
            break;

        case "setting":
            const simbolMataUang = game.currencySymbol || "Rp";
            const bonusGoSekarang = game.goBonus || 200000;
            const modalAwalSekarang = game.startingMoney || 1500000;

            content.innerHTML = `
                <div class="card-box text-center mb-3">
                    <h2><i class="bi bi-gear-fill text-secondary"></i> Info Sesi Game</h2>
                    <p class="text-muted">Status konfigurasi permainan yang sedang aktif saat ini.</p>
                </div>

                <!-- KOTAK INFORMASI PARAMETER GAME -->
                <div class="card-box mb-3">
                    <h5 class="fw-bold text-success mb-3"><i class="bi bi-info-circle-fill"></i> Aturan Sesi Ini</h5>
                    <ul class="list-group">
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Mata Uang:</span> 
                            <span class="fw-bold text-primary">${simbolMataUang}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Modal Awal Player:</span> 
                            <span class="fw-bold text-primary">${simbolMataUang} ${modalAwalSekarang.toLocaleString("id-ID")}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Gaji Lewat GO:</span> 
                            <span class="fw-bold text-primary">${simbolMataUang} ${bonusGoSekarang.toLocaleString("id-ID")}</span>
                        </li>
                    </ul>
                </div>
                
                <!-- AREA RESET SESI (DANGER ZONE) -->
                <div class="card-box">
                    <div class="p-3 bg-light rounded border">
                        <h5 class="fw-bold text-danger"><i class="bi bi-exclamation-triangle-fill"></i> Area Bahaya</h5>
                        <p class="small text-muted">Ingin mengganti nama pemain, nominal GO, atau jenis uang? Klik tombol di bawah untuk menghapus sesi dan memicu Pop-up Setup Ulang dari awal.</p>
                        
                        <button class="btn btn-danger w-100 py-2 fw-bold" onclick="resetGameTotal()">
                            <i class="bi bi-arrow-counterclockwise"></i> Reset & Buat Game Baru
                        </button>
                    </div>
                </div>`;
            break;
    } // <--- KURUNG TUTUP SWITCH CASE

    // 2. UPDATE VISUAL NAVIGASI (Dipanggil setiap kali halaman berpindah)
    if (typeof updateBottomNavVisual === "function") {
        updateBottomNavVisual(page);
    }
} // <--- KURUNG TUTUP UTK FUNGSI showPage() YANG TADI HILANG

/**
 * Mengatur Style Tombol Menu Navigasi Bawah yang Sedang Aktif
 */
function updateBottomNavVisual(page) {
    const navButtons = document.querySelectorAll(".bottom-nav .nav-btn");
    navButtons.forEach(btn => {
        const clickAttr = btn.getAttribute("onclick") || "";
        if (clickAttr.includes(`'${page}'`) || clickAttr.includes(`"${page}"`)) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}