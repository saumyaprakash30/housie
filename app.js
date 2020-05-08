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
        if(param.username && param.room){
            console.log(`inside ${param.username} ${param.room}`);
            users.addUser(socket.id,param.username,param.room);
            console.log(users.getAllUsers());
            
        }
        else{
            return calback('Fill both username and roomId!')
        }
        calback()
    })

    
    socket.on('disconnect',()=>{
        console.log(`user disconnected ${socket.id  }`);
        users.removeUser(socket.id);
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
