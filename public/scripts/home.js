var socket = io()
function joinRoom(){
    var username = document.getElementById('username').value;
    var room = document.getElementById('room').value;
    var param = {username:username,room:room};
    // if(username && room){
    //     console.log(username,room);
    //     
        
        
    // }
    socket.emit('join',param,(err)=>{
        if(err){
            alert(err);
        }
        else{
            console.log("joined sucessful");
            
        }
    });
}