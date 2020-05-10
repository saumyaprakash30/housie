module.exports = async (roomId,io,games)=>{
    var count =0;
    var allNumbers = []
    
    while(allNumbers.length<100 ){
        allNumbers.push(count++)
    }
    console.log(allNumbers);
    
    console.log("game is startded in ", roomId);
    function fun1(){
        var game = games.getGame(roomId)[0];
        if(!game){
            clearInterval(interval);
            return 0;
        }
        // console.log(games.getGame(roomId)[0].gameOver);
        if(allNumbers.length==0 || games.getGame(roomId)[0].gameOver){
            
            games.setGameOver(roomId);
            
            clearInterval(interval)

            console.log("game finised");
            // io.to(roomId).emit('gameOver',[]);
            
        }
        else{
        // console.log("room:",roomId );
        var index = Math.floor(Math.random()*allNumbers.length);
        if(index>-1){   
            var num = allNumbers[index];
            var removed = allNumbers.splice(index,1);
            // console.log("room",roomId,removed);
        }

        games.addPickednumbers(num,roomId);
        io.to(roomId).emit('pickedNumber',num,interval);
        // console.log(num,allNumbesrs);
        }
        
        
    }
    var interval = setInterval(fun1,5000);
    // console.log("interval",interval);
    
    


    
}

