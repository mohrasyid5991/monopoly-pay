/* ==========================================
   MONOPOLY PAY
   transfer.js
========================================== */

function transferPage() {
    return `
<div class="page">
    <div class="card-box">
        <button
            class="btn btn-outline-success mb-3"
            onclick="showPage('dashboard')">
            <i class="bi bi-arrow-left"></i>
            Kembali
        </button>

        <h3 class="mb-3">
            <i class="bi bi-cash-stack"></i>
            Transfer Money
        </h3>

        <div class="mb-3">
            <label class="form-label">Dari</label>
            <select id="fromPlayer" class="form-select"></select>
        </div>

        <div class="mb-3">
            <label class="form-label">Ke</label>
            <select id="toPlayer" class="form-select"></select>
        </div>

        <div class="mb-3">
            <label class="form-label">Nominal</label>
            <input
                id="amount"
                type="number"
                class="form-control"
                placeholder="Contoh : 200000">
        </div>

        <div class="mb-4">
            <label class="form-label">Catatan</label>
            <input
                id="note"
                class="form-control"
                placeholder="Misal : Bayar Sewa">
        </div>

        <button
            class="btn btn-success w-100"
            onclick="confirmTransfer()">
            <i class="bi bi-send-fill"></i>
            Transfer
        </button>
    </div>
</div>
`;
}

// =========================================
// LOAD PLAYER
// =========================================
function loadTransferPlayer(){
    const from = document.getElementById("fromPlayer");
    const to = document.getElementById("toPlayer");

    if (!from || !to) return;

    from.innerHTML = "";
    to.innerHTML = "";

    game.players.forEach((player, index) => {
        // Biar makin rapi, akun sistem seperti Free Parking jangan dimasukkan sebagai pengirim transfer
        if (!player.system) {
            from.innerHTML += `
                <option value="${index}">
                    ${player.name}
                </option>
            `;
        }

        // Tapi Free Parking bisa jadi penerima uang (misal player bayar sewa komplek parking)
        to.innerHTML += `
            <option value="${index}">
                ${player.name}
            </option>
        `;
    });
}

// =========================================
// TRANSFER EXECUTION
// =========================================
function confirmTransfer(){
    const from = parseInt(document.getElementById("fromPlayer").value);
    const to = parseInt(document.getElementById("toPlayer").value);
    const amount = parseInt(document.getElementById("amount").value);
    const note = document.getElementById("note").value.trim();

    if (from === to) {
        alert("Pengirim dan penerima tidak boleh sama.");
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        alert("Masukkan nominal yang benar.");
        return;
    }

    if (game.players[from].money < amount) {
        alert("Saldo tidak cukup.");
        return;
    }

    // 🚀 SOLUSI UTAMA: Alihkan manipulasi saldo ke core money engine kita di money.js!
    // Fungsi transferMoney() otomatis memotong uang pengirim, menambah uang penerima,
    // mencatat history, DAN mengunci datanya secara permanen via saveGame()!
    if (typeof transferMoney === "function") {
        transferMoney(from, to, amount, note || "Transfer Antar Pemain");
    } else {
        // Backup plan jika money.js tidak terbaca
        game.players[from].money -= amount;
        game.players[to].money += amount;
        if (typeof saveGame === "function") saveGame();
    }

    // Tampilkan notifikasi toast sukses mabar
    if (typeof toast === "function") {
        toast("Transfer berhasil!");
    }

    // Kembalikan ke halaman dashboard dengan data yang sudah fresh terkunci
    showPage("dashboard");
}