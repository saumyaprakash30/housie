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
    console.log("started");
    document.getElementById('waiting').style.display = 'none';
    document.getElementById('gaming').style.display = 'block';

})

socket.on('generateTicket',(callback)=>{
    var ticket = generateTicket(100,15)
    console.log(ticket);
    // return ticket;
    socket.emit('generatedTicket',ticket);
    var post ='';
    for(let i=0;i<ticket.length;i++){
        post+='<button onclick="numberCheck(this)" value="'+ticket[i]+'">'+ticket[i]+'</button>'
        if((i+1)%5==0){
            post+='<br>'
        }
    }
    console.log(post);
    
    document.getElementById('ticket').innerHTML = post;
    document.getElementById('waiting').style.display = 'none';
    document.getElementById('gaming').style.display = 'block';
        
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
function numberCheck(that){
    console.log("value",that.value);
    
    socket.emit('checkNumber',that.value,(val)=>{
        console.log("msg",val);
        if(val){
            that.disabled = true;
        }
    });
}

socket.on('pickedNumber',(pnumber)=>{
    console.log(pnumber);
    document.getElementById('picked').innerHTML = pnumber;
    // var post = `<span> ${pnumber} </span>`;
    var post = document.createElement('span');
    post.innerHTML = ` ${pnumber} `;
    document.getElementById('board').appendChild(post)
    
})
socket.on('scoreChange',(winner)=>{
    console.log(winner);
    var post = '';
    for(let i=0;i<winner.length;i++){
        if(i==3){
            post+='<p>Full House Winner: '+winner[i]+'</p>'
        }else{
            post+='<p>Row'+(i+1)+' winner: '+winner[i]+'</p>';

        }
    }
    document.getElementById('scoreBoard').innerHTML = post;
    
})