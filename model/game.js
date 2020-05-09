class Game{
    constructor(){
        this.games=[];
        
        
    }
    
    addGame(roomId){
        this.games.push({
            roomId:roomId,
            pickedNumbers:[],
            players:[],
            gameOver:false,
            row1Winner:null,
            row2Winner:null,
            row3Winner:null,
            fullHouseWinner:null
        });
    }
    setGameOver(roomId){
        var index = this.games.indexOf(this.getGame(roomId)[0]);
        console.log("index",index);
        
        if(index!=-1){
            this.games[index].gameOver = true;
        }
    }
    addPickednumbers(number,roomId){
        var index = this.games.indexOf(this.getGame(roomId)[0]);
        if(index!=-1){
            this.games[index].pickedNumbers.push(number);

        }
    }
    removePlayer(roomId,id){
        var index = this.games.indexOf(this.getGame(roomId)[0]);
        var indexPlayer = this.games[index].players.indexOf(this.getPlayer(roomId,id));
        if(indexPlayer!=-1){
            return this.games[index].players.splice(indexPlayer,1);
             
        }
        
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
    addWinner(row,roomId,id){
        var game = this.games.getGame(roomId)[0];
        // var player = this.getPlayer(roomId,id);
        if(row==1){
            if(!game.row1Winner){
                this.games[this.games.indexOf(game)].row1Winner = id;
                return 1;

            }
            return 0;
        }
        else if(row==2){
            if(!game.row2Winner){
                this.games[this.games.indexOf(game)].row2Winner = id;
                return 1;

            }
            return 0;
        }
        else if(row==3){
            if(!game.row3Winner){
                this.games[this.games.indexOf(game)].row3Winner = id;
                return 1;

            }
            return 0;
        }
        else if(row==4){
            if(!game.fullHouseWinner){
                this.games[this.games.indexOf(game)].fullHouseWinner = id;
                return 1;

            }
            return 0;
        }
    }

    punchTicket(roomId,id,number){
        var game = this.getGame(roomId)[0];
        var index = this.games.indexOf(game);
        var player = this.getPlayer(roomId,id);
        var indexPlayer = this.games[index].players.indexOf(player);
        if(indexPlayer!=-1){
            var indexPunch = this.games[index].players[indexPlayer].punchedTicket.indexOf(number);
            if(indexPunch==-1){
                this.games[index].players[indexPlayer].punchedTicket.push(number);

            }
            // this.games[index].punchedTicket.push(number)
        }
        console.log("punched",this.games[index].players[indexPlayer]);
        
    }
    
}

module.exports = {Game}