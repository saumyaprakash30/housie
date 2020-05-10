var socket = io()
var saveUsername,saveRoomId;
var saveUsers =[]

function startGame(){
    var post = '<p>Row1 winner: </p>'
               +'<p>Row2 winner: </p>'
                +'<p>Row3 winner: </p>'
                +'<p>fullHouse winner: </p>';
    document.getElementById('scoreBoard').innerHTML = post;
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
            saveUsername= username;
            saveRoomId= roomId;
            console.log("joined sucessful");
            document.getElementById('joining').style.display = 'none';
            document.getElementById('waiting').style.display = 'block';
            
        }
    });
}
socket.on('updateList',(users)=>{
    console.log("users in this room ",users);
    saveUsers = users;
    var list = document.getElementById('userList');
    var post = 'Lobby Players<br>';
    for(let i=0;i<users.length;i++){
        post+='<li>'+users[i]+'</li>';
    }
    post = '<ol>'+post+'</ol>'
    list.innerHTML = post;
    // list
    // list.appendChild(post)
    console.log(post);
    
    
})



socket.on('generateTicket',(callback)=>{
    var post = '<p>Row1 winner: </p>'
               +'<p>Row2 winner: </p>'
                +'<p>Row3 winner: </p>'
                +'<p>fullHouse winner: </p>';
    document.getElementById('scoreBoard').innerHTML = post;
    var ticket = generateTicket(100,15)
    console.log("ticket",ticket);
    // return ticket;
    socket.emit('generatedTicket',ticket,callback);
    var post ='';
    var index =0;   
    var rowEleCount=0;
    for(let i=0;i<30;i++){
        
        if(rowEleCount<5 && ticket[index]<(i%10+1)*10 ){
            // console.log("ticketval",ticket[index]);
            
            post+='<button onclick="numberCheck(this)" value="'+ticket[index]+'">'+ticket[index]+'</button>'
            index++;
            rowEleCount++;
            // console.log(rowEleCount,(i+1)%10);
            
            
        }
        else{
            post+='<button disabled="true">X</Button>'
        }
        if(rowEleCount==5 && (i+1)%10==0){
            rowEleCount=0;
        }
        if((i+1)%10==0){
            post+='<br>'
        }
    }
    // console.log(post);
    
    document.getElementById('ticket').innerHTML = post;
    document.getElementById('waiting').style.display = 'none';
    document.getElementById('gaming').style.display = 'block';
        
})

var generateTicket = (max,count)=>{
    //max : number between 0 to max
    //count : how many unique numbers
    var uniqueNubers = []
    var prev = -1;
    var rowEleCount =0;
    while(uniqueNubers.length<count){
        var randomNumber = Math.floor(Math.random()*(20))+rowEleCount*10*2;
        if(uniqueNubers.indexOf(randomNumber)==-1 && randomNumber>prev){
            rowEleCount++;
            prev=randomNumber;
            uniqueNubers.push(randomNumber);
            if(rowEleCount==5){
                rowEleCount = 0;
                prev =-1;
            }
        }
    }
    
    let temp = uniqueNubers;
    var res =[];
    console.log("temp",temp);
    
    for(let i =0;i<3;i++){
        var part = temp.splice(0,5);
        console.log(part);
        
        part.sort((a,b)=> a-b);
        console.log('part',i,part);
        
        res = res.concat(part);

        console.log("res",res);
        
        
    }
    return res;

}
function numberCheck(that){
    console.log("value",that.value);
    
    socket.emit('checkNumber',that.value,(val)=>{
        console.log("msg",val);
        if(val==1){
            that.disabled = true;
        }
        if(val==-1){
            alert("Game lobby does not exist!");
            window.location = '/'
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

socket.on('gameOver',(winner)=>{
    console.log("winner",winner);
    console.log(saveUsername,saveUsers[0]);
    
    if(saveUsers[0]==saveUsername){
        document.getElementById('btnRestart').style.display = 'block';
    }
})

function restart(){
    console.log("restart");
    
    if(saveUsers[0]==saveUsername){
        // document.getElementById('btnRestart').style.display = 'block';
        startGame()
    }
}