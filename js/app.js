/* ==========================================
   MONOPOLY PAY - UTILITIES & TRIGGERS
   app.js
========================================== */

/**
 * Fungsi global untuk menampilkan notifikasi pop-up hitam di bawah layar
 * @param {string} message - Pesan teks yang ingin ditampilkan
 */
function toast(message){
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerHTML = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}