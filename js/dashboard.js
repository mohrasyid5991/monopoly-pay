/* ==========================================
   MONOPOLY PAY - STATE MANAGEMENT
   dashboard.js
========================================== */

// 1. BUAT AKUN DEFAULT SEMENTARA
let game = {
    currencySymbol: "Rp",
    startingMoney: 1500000,
    goBonus: 200000,
    history: [],
    players: [
        { id: 999, name: "🅿 Free Parking", money: 0, system: true }
    ]
};

// 2. LANGSUNG CEK MEMORI LOCALSTORAGE (PENTING: Harus di luar listener agar terbaca duluan!)
const savedLocalData = localStorage.getItem("monopoly_game_state");
if (savedLocalData) {
    game = JSON.parse(savedLocalData);
}

// Array penampung list nama sementara khusus di pop-up modal
let tempPlayers = []; 

// 3. LOGIKA DETEKSI AUTO POP-UP SAAT HALAMAN DIMUAT
document.addEventListener("DOMContentLoaded", () => {
    // Cek sekali lagi apakah data di memori benar-benar ada
    const checkData = localStorage.getItem("monopoly_game_state");
    
    if (!checkData) {
        // JIKA KOSONG: Paksa munculkan Pop-up Setup Modal
        setTimeout(() => {
            const setupModalElement = document.getElementById('setupGameModal');
            if (setupModalElement) {
                const setupModal = new bootstrap.Modal(setupModalElement);
                setupModal.show();
            }
        }, 500);
    } else {
        // JIKA ADA: Langsung pastikan halaman dashboard me-render data dari LocalStorage
        if (typeof showPage === "function") {
            showPage('dashboard');
        }
    }
});

function saveGame() {
    localStorage.setItem("monopoly_game_state", JSON.stringify(game));
}
// ==========================================
// LOGIKA WORKFLOW POP-UP SETUP MODAL
// ==========================================

function addPlayerFromPopup() {
    const inputName = document.getElementById("popPlayerName");
    if (!inputName) return;
    const name = inputName.value.trim();

    if (name === "") return;

    // Cek nama kembar di penampung sementara
    if (tempPlayers.some(p => p.toLowerCase() === name.toLowerCase())) {
        alert(`Nama "${name}" sudah dimasukkan ke daftar!`);
        return;
    }

    tempPlayers.push(name);
    inputName.value = "";
    renderPopupPlayerList();
}

function renderPopupPlayerList() {
    const listDiv = document.getElementById("popPlayerList");
    if (!listDiv) return;

    listDiv.innerHTML = "";
    tempPlayers.forEach((name, index) => {
        listDiv.innerHTML += `
            <div class="list-group-item d-flex justify-content-between align-items-center py-1 bg-white text-dark small border shadow-sm mb-1 rounded">
                <span><i class="bi bi-person-fill text-success"></i> ${name}</span>
                <button class="btn btn-sm text-danger border-0 p-0" onclick="removePlayerFromPopup(${index})">
                    <i class="bi bi-trash-fill"></i>
                </button>
            </div>
        `;
    });
}

function removePlayerFromPopup(index) {
    tempPlayers.splice(index, 1);
    renderPopupPlayerList();
}

/**
 * Mengunci Hasil Input Pop-up ke Variabel Utama & LocalStorage
 */
function saveAndStartGame() {
    // Validasi minimal harus ada 1 player yang ikut main
    if (tempPlayers.length === 0) {
        alert("Mohon daftarkan minimal 1 nama player untuk bermain!");
        return;
    }

    const popCurrency = document.getElementById("popCurrency").value;
    const popStartingMoney = parseInt(document.getElementById("popStartingMoney").value) || 1500000;
    const popGoBonus = parseInt(document.getElementById("popGoBonus").value) || 200000;

    // Masukkan data dasar dari Pop-up ke objek utama game
    game.currencySymbol = popCurrency;
    game.startingMoney = popStartingMoney;
    game.goBonus = popGoBonus;
    game.history = [];
    game.players = []; // Reset ulang agar bersih

    // Daftarkan nama pemain sementara ke objek pemain asli dengan modal dinamis
    tempPlayers.forEach((name, idx) => {
        game.players.push({
            id: idx + 1,
            name: name,
            money: popStartingMoney,
            system: false
        });
    });

    // Tambahkan Free Parking wajib di baris paling bawah akhir
    game.players.push({ id: 999, name: "🅿 Free Parking", money: 0, system: true });

    // Kunci data ke memori browser
    saveGame();

    // Sembunyikan Pop-up Modal secara paksa dan segarkan halaman utama
    const setupModalElement = document.getElementById('setupGameModal');
    const modalInstance = bootstrap.Modal.getInstance(setupModalElement);
    if (modalInstance) modalInstance.hide();

    // Reset temporary list
    tempPlayers = [];

    // Muat ulang router/dashboard agar data barunya tampil di home
    if (typeof showPage === "function") {
        showPage('dashboard');
    } else {
        window.location.reload();
    }
}

// ==========================================
// HITUNG TOTAL UANG & COMPONENT DASHBOARD
// ==========================================
function getTotalMoney() {
    let total = 0;
    game.players.forEach(player => {
        if (!player.system) total += player.money;
    });
    return total;
}

function playerCard(player) {
    let role = player.system ? "System" : "Player";
    return `
    <div class="player">
        <div class="player-left">
            <div class="avatar">${player.system ? "🅿" : player.name.charAt(0)}</div>
            <div>
                <div class="player-name">${player.name}</div>
                <div class="player-role">${role}</div>
            </div>
        </div>
        <div class="player-money">
            ${game.currencySymbol || 'Rp'} ${player.money.toLocaleString("id-ID")}
        </div>
    </div>`;
}

function dashboardPage() {
    let html = `
    <div class="page">
        <div class="card-box total-money">
            <small>Total Money</small>
            <h1>${game.currencySymbol || 'Rp'} ${getTotalMoney().toLocaleString("id-ID")}</h1>
        </div>
        <div class="card-box">
            <div class="card-title">👥 Players</div>
    `;
    game.players.forEach(player => {
        html += playerCard(player);
    });
    html += `</div></div>`;
    return html;
}

function resetGameTotal() {
    const yakin = confirm("Apakah Anda yakin ingin mengakhiri sesi ini? Semua player akan dihapus dan pop-up setup awal akan muncul kembali!");
    if (yakin) {
        localStorage.removeItem("monopoly_game_state");
        window.location.reload();
    }
}