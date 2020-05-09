class Game{
    constructor(){
        this.games=[]
    }

    addGame(roomId){
        this.games.push({
            roomId:roomId,
            players:[]
        });
    }
    getGame(roomId){
        var game = this.games.filter((game)=>game.roomId === roomId);
        return game;
    }
    addPlayer(roomId,id,ticket){
        var index = this.games.indexOf(this.getGame(roomId));
        console.log("index",index);
        
        console.log("addplayer",this.games[index]);
        
        // this.games[index].players.push({
        //     id:id,
        //     ticket:ticket,
        //     score:0,
        //     punchedTicket:[]
        // })
    }
    
}

module.exports = {Game}