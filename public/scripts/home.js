var socket = io()



function startGame(){
    socket.emit('startGame',(err)=>{
        if(err){
            alert(err);
        }
    })
}

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
            document.getElementById('joining').style.display = 'none';
            document.getElementById('waiting').style.display = 'block';
            
        }
    });
}
socket.on('updateList',(users)=>{
    console.log("users in this room ",users);

    var list = document.getElementById('userList');
    var post = '';
    for(let i=0;i<users.length;i++){
        post+='<li>'+users[i]+'</li>';
    }
    post = '<ol>'+post+'</ol>'
    list.innerHTML = post;
    // list
    // list.appendChild(post)
    console.log(post);
    
    
})

socket.on('gameStarted',()=>{
    // console.log();
    
    document.getElementById('gaming').style.display = 'block';
})

socket.on('generateTicket',(callback)=>{
    var ticket = generateTicket(100,15)
    console.log(ticket);
    // return ticket;
    socket.emit('generatedTicket',ticket);
        
})

var generateTicket = (max,count)=>{
    //max : number between 0 to max
    //count : how many unique numbers
    uniqueNubers = []
    while(uniqueNubers.length<count){
        var randomNumber = Math.floor(Math.random()*max)+1;
        if(uniqueNubers.indexOf(randomNumber)==-1){
            uniqueNubers.push(randomNumber);
        }
    }
    return uniqueNubers;

}

socket.on('pickedNumber',(pnumber)=>{
    console.log(pnumber);
    
})