/* =====================================
   MONEY ENGINE
==================================== */

function addMoney(playerIndex, amount, source, note=""){
    game.players[playerIndex].money += amount;
    
    addHistory(
        source,
        game.players[playerIndex].name,
        amount,
        note
    );

    // 1. KUNCI SALDO BARU KE LOCALSTORAGE
    if (typeof saveGame === "function") saveGame();

    // 2. PERBARUI TAMPILAN LAYAR
    refreshApp();
}

function subtractMoney(playerIndex, amount, target, note=""){
    game.players[playerIndex].money -= amount;
    
    addHistory(
        game.players[playerIndex].name,
        target,
        amount,
        note
    );

    // 1. KUNCI SALDO BARU KE LOCALSTORAGE
    if (typeof saveGame === "function") saveGame();

    // 2. PERBARUI TAMPILAN LAYAR
    refreshApp();
}

function transferMoney(from, to, amount, note=""){
    game.players[from].money -= amount;
    game.players[to].money += amount;
    
    addHistory(
        game.players[from].name,
        game.players[to].name,
        amount,
        note
    );

    // 1. KUNCI SALDO BARU KE LOCALSTORAGE
    if (typeof saveGame === "function") saveGame();

    // 2. PERBARUI TAMPILAN LAYAR
    refreshApp();
}