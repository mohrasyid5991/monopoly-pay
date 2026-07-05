/* ==========================================
   MONOPOLY PAY
   bank.js
========================================== */

/**
 * Mengembalikan String HTML untuk Halaman Bank
 */
function bankPage() {
    const freeParkingObj = game.players.find(p => p.id === 999) || { money: 0 };
    
    // Ambil nominal dinamis GO dari state game, pasang default jika belum diset
    const currentGoBonus = game.goBonus || 200000;
    const simbol = game.currencySymbol || "Rp";

    return `
    <div class="page">
        <div class="card-box mb-3">
            <button class="btn btn-outline-success mb-3" onclick="showPage('dashboard')">
                <i class="bi bi-arrow-left"></i> Kembali
            </button>

            <h3><i class="bi bi-bank"></i> Monopoly Bank</h3>
            <hr>

            <div class="mb-3">
                <label class="form-label fw-semibold">Pilih Player</label>
                <select id="bankPlayer" class="form-select"></select>
            </div>

            <div class="d-grid gap-2">
                <button class="btn btn-success fw-bold" onclick="bankGO()">
                    🟢 GO (+${currentGoBonus.toLocaleString("id-ID")})
                </button>
                
                <button class="btn btn-warning text-white fw-bold" onclick="bankBonus()">
                    🅿 Klaim Free Parking
                </button>
                
                <button class="btn btn-danger" onclick="bankTax()">💸 Pajak (Ke Free Parking)</button>
                <button class="btn btn-secondary" onclick="bankFine()">🚔 Denda (Ke Free Parking)</button>
                <button class="btn btn-primary" onclick="bankAddMoney()">➕ Tambah Uang</button>
                <button class="btn btn-dark" onclick="bankRemoveMoney()">➖ Kurangi Uang</button>
            </div>

            <hr>

            <div class="text-center p-3 bg-light rounded border">
                <h5 class="text-muted mb-1">🅿 Free Parking</h5>
                <h3 class="fw-bold text-success mb-0">
                    ${simbol} ${freeParkingObj.money.toLocaleString("id-ID")}
                </h3>
            </div>
        </div>
    </div>`;
}

/**
 * Mengisi Dropdown Select dengan Player Aktif (Kecuali Free Parking)
 */
function loadBankPlayer() {
    const combo = document.getElementById("bankPlayer");
    if (!combo) return;

    combo.innerHTML = "";
    game.players.forEach((player, index) => {
        // Hanya masukkan player asli (bukan sistem/free parking)
        if (!player.system) {
            combo.innerHTML += `
                <option value="${index}">${player.name}</option>
            `;
        }
    });
}

// ==========================================
// LOGIKA TOMBOL AKSI BANK + ANTI RESET
// ==========================================

function bankGO() {
    const playerIndex = parseInt(document.getElementById("bankPlayer").value);
    
    // Ambil nominal dinamis GO dari Pop-up untuk dieksekusi transaksinya
    const amountToGo = game.goBonus || 200000;

    if (typeof addMoney === "function") {
        addMoney(playerIndex, amountToGo, "BANK", "GO");
        
        if (typeof saveGame === "function") saveGame();
        showPage('bank'); 
    }
}

/**
 * Mengubah fitur Bonus menjadi klaim seluruh dana di Free Parking untuk player tertentu
 */
function bankBonus() {
    const playerSelect = document.getElementById("bankPlayer");
    // Jika ID dropdown kamu di html bernama 'fromPlayer' atau 'toPlayer', sesuaikan baris di bawah:
    const selectedElement = playerSelect || document.getElementById("fromPlayer") || document.getElementById("toPlayer");
    
    if (!selectedElement) {
        alert("Elemen pilihan player tidak ditemukan!");
        return;
    }
    
    const playerIndex = parseInt(selectedElement.value);

    // 1. Cari data Free Parking di dalam list player (id sistem: 999 atau cek namanya)
    const freeParkingIndex = game.players.findIndex(p => p.id === 999 || p.name.toLowerCase().includes("free parking"));

    if (freeParkingIndex === -1) {
        alert("Data Free Parking tidak ditemukan di dalam sistem!");
        return;
    }

    // 2. Ambil nominal total uang yang sedang terkumpul di Free Parking
    const totalFreeParkingMoney = game.players[freeParkingIndex].money;

    // 3. Validasi: Kalau Free Parking masih Rp 0, batalkan transaksi
    if (totalFreeParkingMoney <= 0) {
        alert("Brankas Free Parking masih kosong (Rp 0)!");
        return;
    }

    // Konfirmasi admin bank sebelum mencairkan dana jumbo
    const namaPlayer = game.players[playerIndex].name;
    const konfirmasi = confirm(`Apakah benar ${namaPlayer} mendarat di Free Parking dan mengklaim Rp ${totalFreeParkingMoney.toLocaleString("id-ID")}?`);
    
    if (!konfirmasi) return;

    // 4. Eksekusi: Transfer SEMUA uang dari Free Parking ke Player yang beruntung
    if (typeof transferMoney === "function") {
        // transferMoney(dari, ke, nominal, catatan)
        transferMoney(freeParkingIndex, playerIndex, totalFreeParkingMoney, "Klaim Dana Free Parking");
        
        if (typeof toast === "function") {
            toast(`Selamat! ${namaPlayer} mendapatkan Rp ${totalFreeParkingMoney.toLocaleString("id-ID")} dari Free Parking!`);
        }
        
        // Refresh halaman bank agar angka Free Parking di bawah langsung update jadi Rp 0
        showPage('bank');
    } else {
        // Backup plan langsung jika money.js tidak merespons
        game.players[freeParkingIndex].money = 0;
        game.players[playerIndex].money += totalFreeParkingMoney;
        if (typeof saveGame === "function") saveGame();
        refreshApp();
    }
}

function bankTax() {
    const playerIndex = parseInt(document.getElementById("bankPlayer").value);
    const amount = parseInt(prompt("Nominal Pajak:"));
    if (!amount || isNaN(amount)) return;

    // Tambah dana ke Free Parking (ID: 999)
    const freeParkingObj = game.players.find(p => p.id === 999);
    if (freeParkingObj) freeParkingObj.money += amount;

    if (typeof subtractMoney === "function") {
        subtractMoney(playerIndex, amount, "FREE PARKING", "Pajak");
        
        // Kunci data ke LocalStorage & refresh halaman
        if (typeof saveGame === "function") saveGame();
        showPage('bank');
    }
}

function bankFine() {
    const playerIndex = parseInt(document.getElementById("bankPlayer").value);
    const amount = parseInt(prompt("Nominal Denda:"));
    if (!amount || isNaN(amount)) return;

    // Tambah dana ke Free Parking (ID: 999)
    const freeParkingObj = game.players.find(p => p.id === 999);
    if (freeParkingObj) freeParkingObj.money += amount;

    if (typeof subtractMoney === "function") {
        subtractMoney(networkPlayerIndex = playerIndex, amount, "FREE PARKING", "Denda");
        
        // Kunci data ke LocalStorage & refresh halaman
        if (typeof saveGame === "function") saveGame();
        showPage('bank');
    }
}

function bankAddMoney() {
    const playerIndex = parseInt(document.getElementById("bankPlayer").value);
    const amount = parseInt(prompt("Masukkan Nominal Tambah Uang:"));
    if (!amount || isNaN(amount)) return;

    if (typeof addMoney === "function") {
        addMoney(playerIndex, amount, "BANK", "Tambah Uang");
        
        // Kunci data ke LocalStorage & refresh halaman
        if (typeof saveGame === "function") saveGame();
        showPage('bank');
    }
}

function bankRemoveMoney() {
    const playerIndex = parseInt(document.getElementById("bankPlayer").value);
    const amount = parseInt(prompt("Masukkan Nominal Kurangi Uang:"));
    if (!amount || isNaN(amount)) return;

    if (typeof subtractMoney === "function") {
        subtractMoney(playerIndex, amount, "BANK", "Kurangi Uang");
        
        // Kunci data ke LocalStorage & refresh halaman
        if (typeof saveGame === "function") saveGame();
        showPage('bank');
    }
}