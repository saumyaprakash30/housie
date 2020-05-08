var socket = io()

function getList(){
    socket.emit('getList',(val)=>{
        console.log(val);
        
    })
}

function joinRoom(){
    var username = document.getElementById('username').value.trim();
    var roomId = document.getElementById('roomId').value.trim();
    var param = {username:username,roomId:roomId};
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
socket.on('updateList',(users)=>{
    console.log("users in this room ",users);
    
})