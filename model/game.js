class Game{
    constructor(){
        this.games=[];
        this.row1Winner;
        this.row2Winner;
        this.row3Winner;
        this.fullHouseWinner;
    }

    addGame(roomId){
        this.games.push({
            roomId:roomId,
            pickedNumbers:[],
            players:[]
        });
    }
    removePlayer(roomId,id){
        var gameList = this.games.filter((game)=>game.players.filter((player)=>player.id!==id))
        console.log(gameList);
        
    }
    getPlayerCount(roomId){
        var game = this.getGame(roomId)[0];
        // console.log("gameincount",game,game.players);
        
        var players = game.players;
        return players.length;
    }
    getPlayer(roomId,id){
        var game = this.games.filter((game)=>game.roomId==roomId)[0];
        var players = game.players;
        var player = players.filter((player)=>player.id === id);
        if(player){
            return player[0];
        }
        else{
            return false;
        }
        // console.log(players);
        
    }
    getGame(roomId){
        // return list
        var game = this.games.filter((game)=>game.roomId === roomId);
        return game;
    }
    addPlayer(roomId,id,ticket){
        // console.log("ingame",this.games,"ingameend");
        var game = this.getGame(roomId)[0];
        var index = this.games.indexOf(game);
        
        
        // console.log("index",index);
        
        // console.log("addplayer",this.games[index]);
        
        this.games[index].players.push({
            id:id,
            ticket:ticket,
            score:0,
            punchedTicket:[]
        })

        // console.log(this.games);
        
    }
    
}

module.exports = {Game}