/* ==========================================
   REFRESH ENGINE
   refresh.js
========================================== */

/**
 * Fungsi global untuk memperbarui tampilan halaman tanpa merusak data memori
 */
function refreshApp() {
    // 1. Ambil nama halaman aktif saat ini dari visual navigasi atau default ke dashboard
    let activePage = "dashboard";
    const activeNav = document.querySelectorAll(".bottom-nav .nav-btn");
    
    activeNav.forEach(btn => {
        if (btn.classList.contains("active")) {
            const clickAttr = btn.getAttribute("onclick") || "";
            if (clickAttr.includes("transfer")) activePage = "transfer";
            else if (clickAttr.includes("bank")) activePage = "bank";
            else if (clickAttr.includes("history")) activePage = "history";
            else if (clickAttr.includes("setting")) activePage = "setting";
        }
    });

    // 2. AMANKAN: Kunci data saldo terbaru ke LocalStorage sebelum layar digambar ulang
    if (typeof saveGame === "function") {
        saveGame();
    }

    // 3. Render ulang halaman aktif dengan data saldo yang paling baru
    if (typeof showPage === "function") {
        showPage(activePage);
    }
}