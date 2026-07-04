function addHistory(from,to,amount,note){

    game.history.push({

        date:new Date().toLocaleString("id-ID"),

        from,

        to,

        amount,

        note

    });

}