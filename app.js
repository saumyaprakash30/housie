const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const dotenv = require('dotenv').config()
const {Users} = require('./model/users');

var users = new Users();


app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')
var io = socketIO(http);
io.on('connection',(socket)=>{
    console.log("new User connected "+ socket.id);
    
    socket.on('join',(param,calback)=>{
        // console.log("joining to room "+ param.username);
        if(param.username && param.roomId){
            console.log(`${param.username} joined ${param.roomId}`);
            var delUser = users.removeUser(socket.id)
            if(delUser){
                io.to(delUser.roomId).emit('updateList',users.getUsernameList(delUser.roomId));
            }
            var user = users.getAdmin(param.roomId);            
            if(user){
                admin = false;
            }else{
                
                admin=true;
            }
            users.addUser(socket.id,param.username,param.roomId,admin);
            // console.log(users.getAllUsers());
            socket.join(param.roomId);
            io.to(param.roomId).emit('updateList',users.getUsernameList(param.roomId))
        }
        else{
            return calback('Fill both username and roomId!')
        }
        // calback()
    })

    socket.on('getList',(callback)=>{
        var user = users.getUser(socket.id);
        // console.log("all users",users.getAllUsers());
        
        if(user){
            // console.log(user);
            // console.log("all users",users.getAllUsers());
            
            // console.log(users.getUsernameList(user.roomId));
            
            return callback(users.getUsernameList(user.roomId))
            // console.log(user);
        // return callback("hello" + user.username)
        }
        else{
            console.log("no user ");
            
        }
        callback("hey")
        // var userlist = u./sers.getUserameList()
    })

    
    socket.on('disconnect',()=>{
        console.log(`user disconnected ${socket.id  }`);
        var deletedUser = users.removeUser(socket.id);
        if(deletedUser && deletedUser.admin==true){
            users.setAdmin(deletedUser.roomId);
            
        }
        if(deletedUser){
            io.to(deletedUser.roomId).emit('updateList',users.getUsernameList(deletedUser.roomId))        

        }
        // console.log("delUser ",deletedUser);
        
    })
    
    socket.on('startGame',(callback)=>{
        var user = users.getUser(socket.id);
        var admin = user.admin;
        if(admin){
            io.to(user.roomId).emit('gameStarted')
            
        }
        else{
            return callback('Admin Will start game!')
        }
    })

})

// var home = require('./routes/home');
// var custom = require('./routes/custom')(io);
// var game = require('./routes/game')(io);

// app.use('/',home);
// app.use('/customroom',custom);
// app.use('/game',game);

app.get('/',(req,res)=>{
    res.render('home');
})


const PORT = process.env.PORT||5081;
http.listen(PORT,()=>{
    console.log(`Server is live on ${PORT}`);
    
})
