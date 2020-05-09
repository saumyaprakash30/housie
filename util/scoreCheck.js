module.exports = async(roomId,id,io,games,users)=>{
    // assuming ticket has 3 rows and every row contain 5 elements
    var player = games.getPlayer(roomId,id);
    if(checkRow(1,player,roomId) || checkRow(2,player,roomId) || checkRow(3,player,roomId) || checkRow(4,player,roomId)){
        var winners = getWinnerDetail(roomId)
        io.to(roomId).emit('scoreChange',winners);
    }
    

    function getWinnerDetail(roomId){
        var winners =[];
        var game = games.getGame(roomId)[0];
        var r = []
        r.push(game.row1Winner);
        // winners.push(users.getUser(r1).username)
        r.push(game.row2Winner);
        // winners.push(users.getUser(r12).username)
        r.push(game.row3Winner);
        // winners.push(users.getUser(r3).username)
        r.push(game.fullHouseWinner);
        // winners.push(users.getUser(fh).username)
        for(let i=0;i<r.length;i++){
            var user = users.getUser(r[i])
            if(user){
                winners.push(user.username);
            }else{
                winners.push('');
            }
        }
        // console.log("winners",winners,"winnersend");
        
        return winners;
        
    
    }
    
    
    function checkRow(row,player,roomId){
        switch(row){
            case 0:{
                var count = 0;
                for(let i =0;i<player.punchedTicket.length;i++){
                    var index = player.ticket.indexOf(player.punchedTicket[i]);
                    if(index<5){
                        count++;
                    }
                }
                if(count==5){
                    return games.addWinner(1,roomId,player.id);
    
                }
                return 0;
            }
            case 1:{
                var count =0;
                for(let i =0;i<player.punchedTicket.length;i++){
                    var index = player.ticket.indexOf(player.punchedTicket[i]);
                    if(index>=5 && index<10){
                        count++;
                    }
                }
                if(count==5){
                    return games.addWinner(2,roomId,player.id)
                }
                return 0;
                
            }
            case 3:{
                var count =0;
                for(let i =0;i<player.punchedTicket.length;i++){
                    var index = player.ticket.indexOf(player.punchedTicket[i]);
                    if(index>=10 && index<15){
                        count++;
                    }
                }
                if(count==5){
                    return games.addWinner(3,roomId,player.id)
                }
                return 0;
            }
            case 4:{
                var count =0;
                for(let i =0;i<player.punchedTicket.length;i++){
                    var index = player.ticket.indexOf(player.punchedTicket[i]);
                    if(index!=-1){
                        count++;
                    }
                }
                if(count==15){
                    return games.addWinner(4,roomId,player.id)
                }
                return 0;
            }
        }
    }
}