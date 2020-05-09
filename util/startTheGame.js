module.exports = async (roomId,io,games)=>{
    var count =1;
    var allNumbers = []
    
    while(allNumbers.length<5){
        allNumbers.push(count++)
    }
    console.log(allNumbers);
    
    console.log("game is startded in ", roomId);
    function fun1(){
        if(allNumbers.length==0){
            games.setGameOver(roomId);
            
            clearInterval(interval)

            console.log("game finised");
            
        }
        else{
        // console.log("room:",roomId );
        var index = Math.floor(Math.random()*allNumbers.length);
        if(index>-1){
            var num = allNumbers[index];
            console.log(allNumbers.splice(index,1));
        }

        games.addPickednumbers(num,roomId);
        io.to(roomId).emit('pickedNumber',num);
        // console.log(num,allNumbers);
        }
        
        
    }
    var interval = setInterval(fun1,5000);



    
}

