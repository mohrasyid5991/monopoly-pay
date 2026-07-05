function historyPage(){

    let html=`

<div class="page">

<div class="card-box">

<h3>

<i class="bi bi-clock-history"></i>

History

</h3>

<hr>

`;

    if(game.history.length==0){

        html+=`

Belum ada transaksi.

`;

    }

    game.history.slice().reverse().forEach(item=>{

        html+=`

<div class="player">

<div>

<b>

${item.from}

</b>

↓

<b>

${item.to}

</b>

<br>

<small>

${item.note}

</small>

</div>

<div class="player-money">

Rp ${item.amount.toLocaleString("id-ID")}

</div>

</div>

`;

    });

    html+=`

</div>

</div>

`;

    return html;

}