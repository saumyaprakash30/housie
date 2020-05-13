var socket = io()
var saveUsername='',saveRoomId='';
var saveUsers =[]

window.onbeforeunload = ()=>{
    let msg = 'Do you want to leave lobby?';
    if(saveUsername)
        return msg;
}

const urlParams = new URLSearchParams(window.location.search);
const paramRoomId = urlParams.get('roomid');
if(paramRoomId){
    document.getElementById('roomId').value = paramRoomId;
    document.getElementById('roomId').disabled = 'disabled';
}

function startGame(){
    var post = '<p>fullHouse winner: </p>'
    +'<p>Row1 winner: </p>';
    +'<p>Row2 winner: </p>'
    +'<p>Row3 winner: </p>'
    // document.getElementById('scoreBoard').innerHTML = post;
    document.getElementById('balls').innerHTML = '';
    
    socket.emit('startGame',(err)=>{
        if(err){
            alert(err);
        }
        else{
            document.getElementById('btnRestart').style.display = 'none';
        }
        if(err == 'Join lobby first!'){
            window.location = '/';  
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
    saveUsername= username;
    saveRoomId= roomId;
    // if(username && room){
    //     console.log(username,room);
    //     
        
        
    // }
    socket.emit('join',param,(err)=>{
        if(err){
            alert(err);
        }
        else{
            let url = window.location.href  ;
            console.log(url.split("?"))
            let urlToShare = url.split('?')[0]+'?roomid='+saveRoomId;
            console.log("joined sucessful");
            document.getElementById('joining').style.display = 'none';
            document.getElementById('waiting').style.display = 'block';
            document.getElementById('userList').style.display = 'block';
            document.getElementById('roomDetail').innerHTML= '<h3>Room Id - '+saveRoomId+'</h3>'+'<span >Invite link : </span><br><span  id="urlToShare" style="background-color: #1db0ff;margin: 0 auto" >'+urlToShare+'</span><br><button onclick="copyLink()">copyLink</button>';
        }
    });
}
function copyLink(){
    let urlToShare = window.location.href.split('?')[0]+'?roomid='+saveRoomId;
    const el = document.createElement('textarea');
    el.value = urlToShare;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);


}
socket.on('updateList',(users)=>{
    console.log("users in this room ",users,socket.id);
    saveUsers = users;
    var list = document.getElementById('userList');
    var list1 = document.getElementById('userListGaming');
    var post = 'Lobby Players<br>';
    for(let i=0;i<users.length;i++){
        let admin = ''
        if(i==0)
            admin='(admin)'
        else    admin=''
        if(socket.id==users[i].id) {
            post += '<li>' + users[i].username + ' (You) '+admin+'</li>';
        }
        else{
            post+='<li>'+users[i].username+' '+admin+'</li>';
        }

        
    }
    post = '<ol>'+post+'</ol>'
    list.innerHTML = post;

    post = '<button id = "btnLULG" onclick="leave()">Exit lobby</button><br>'+
        '<span style="color: black;text-align: center" >Room Id :'+saveRoomId+'</span><br>'
        +post;
    list1.innerHTML = post
    // list
    // list.appendChild(post)
    // console.log(post);
    
    
})



socket.on('generateTicket',(callback)=>{
    //welcome speech
    
    utter.text = 'The number is ....'
    window.speechSynthesis.speak(utter);

    var post = '<p>Row1 winner: </p>'
               +'<p>Row2 winner: </p>'
                +'<p>Row3 winner: </p>'
                +'<p>fullHouse winner: </p>';
    // document.getElementById('scoreBoard').innerHTML = post;
    var ticket = generateTicket(100,15)
    // console.log("ticket",ticket);
    // return ticket;
    socket.emit('generatedTicket',ticket,callback);
    var post ='';
    var index =0;   
    var rowEleCount=0;
    for(let i=0;i<30;i++){
        
        if(rowEleCount<5 && ticket[index]<(i%10+1)*10 ){
            // console.log("ticketval",ticket[index]);
            
            post+='<button class="btnTicket" onclick="numberCheck(this)" value="'+ticket[index]+'">'+ticket[index]+'</button>'
            index++;
            rowEleCount++;
            // console.log(rowEleCount,(i+1)%10);
            
            
        }
        else{
            post+='<button class="btnTicketD" disabled="true">X</Button>'
        }
        if(rowEleCount==5 && (i+1)%10==0){
            rowEleCount=0;
        }
        if((i+1)%10==0){
            post+='<br>'
        }
    }
    // console.log(post);
    document.getElementById('scoreBoard').innerHTML=''
    document.getElementById('balls').innerHTML = '';
    document.getElementById('ticket').innerHTML = post;
    document.getElementById('waiting').style.display = 'none';
    document.getElementById('userList').style.display = 'none';
    document.getElementById('gaming').style.display = 'block';
    document.getElementById('picked').innerHTML = 'Picking up number!!';
    document.getElementById('btnRestart').style.display = 'none';
    // document.getElementById('btnRestart').style.display = 'none';
    // document.getElementById('btnLeave').style.display = 'block';
        
})

var generateTicket = (max,count)=>{
    //max : number between 0 to max
    //count : how many unique numbers
    var uniqueNubers = []
    var prev = -1;
    var rowEleCount =0;
    while(uniqueNubers.length<count){
        if(rowEleCount==0){
            var randomNumber = Math.floor(Math.random()*(20))+rowEleCount*10*2+1;    
        }
        else if(rowEleCount==4){
            var randomNumber = Math.floor(Math.random()*(19))+rowEleCount*10*2;    
        }
        else{
            var randomNumber = Math.floor(Math.random()*(20))+rowEleCount*10*2;
        }
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
    // console.log("temp",temp);
    
    for(let i =0;i<3;i++){
        var part = temp.splice(0,5);
        // console.log(part);
        
        part.sort((a,b)=> a-b);
        // console.log('part',i,part);
        
        res = res.concat(part);

        // console.log("res",res);
        
        
    }
    return res;

}
function numberCheck(that){
    // console.log("value",that.value);
    
    socket.emit('checkNumber',that.value,(val)=>{
        // console.log("msg",val);
        if(val==1){
            that.disabled = true;
        }
        if(val==-1){
            alert("Game lobby does not exist!");
            window.location = '/'
        }
    });
}

var utter = new SpeechSynthesisUtterance();
var isMuted = false;
socket.on('pickedNumber',(pnumber)=>{
    window.speechSynthesis.cancel();
    utter.text = pnumber;
    window.speechSynthesis.speak(utter);
    // console.log(pnumber);
    document.getElementById('picked').innerHTML = '<div >New Number</div>'+'<span class = "ballPicked">'+pnumber+'</span>';
    // var post = `<span> ${pnumber} </span>`;
    var post = document.createElement('span');
    post.classList.add('ball');
    post.innerHTML = ` ${pnumber} `;
    document.getElementById('balls').appendChild(post)
    document.getElementById('gamescroll').scrollTop = document.getElementById('gamescroll').scrollHeight;    
})
function muteVolume(){
    if(isMuted){
        utter.volume=1;
        document.getElementById('btnMute').innerHTML = "Mute";
        isMuted=false;

    }else{
        utter.volume = 0;
        document.getElementById('btnMute').innerHTML = "Unmute";
        isMuted = true;
    }
}
socket.on('scoreChange',(winner)=>{
    // console.log(winner);
    var post = '';
    for(let i=0;i<winner.length;i++){
        if(i==3){
            post+='<p>Full House Winner: '+winner[i]+'</p>'
        }else{
            post+='<p>Row'+(i+1)+' winner: '+winner[i]+'</p>';

        }
    }
    document.getElementById('scoreBoard').innerHTML = post;
    document.getElementById('scoreBoard').scrollIntoView();
    
})

socket.on('gameOver',(winner)=>{
    console.log("winner",winner);
    window.speechSynthesis.cancel();
    utter.rate = 0.8;
    utter.text = "And the winners are "+ winner[3]+ ','+winner[0]+','+winner[1]+'and'+winner[2]+'.';
    window.speechSynthesis.speak(utter)
    // window.speechSynthesis.cancel();
    // console.log(saveUsername,saveUsers[0]);
    document.getElementById('picked').innerHTML = "Game Over!"
    document.getElementById('btnRestart').style.display = 'block';
    // document.getElementById('btnLeave').style.display = 'block';
    
})
function leave(){
    window.location = '/';
}

function restart(){
    console.log("restart");
    document.getElementById('btnRestart').style.display = 'none';
    // document.getElementById('btnLeave').style.display = 'none';
    document.getElementById('gaming').style.display = 'none';
    document.getElementById('waiting').style.display = 'block';
    document.getElementById('userList').style.display = 'block';
    
    // if(saveUsers[0]==saveUsername){
    //     document.getElementById('gaming')
    //     // startGame()
    // }else{

    // }
}

function showInfo(){
    display = document.getElementById('info').style.display = 'none';
    display = document.getElementById('closeInfo').style.display = 'block';
    display = document.getElementById('userListGaming').style.display = 'block';;
    
}
function hideInfo(){
    display = document.getElementById('info').style.display = 'block';
    display = document.getElementById('closeInfo').style.display = 'none';
    display = document.getElementById('userListGaming').style.display = 'none';;
}
