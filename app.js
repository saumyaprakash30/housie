const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const dotenv = require('dotenv').config()
const {Users} = require('./model/users');
const {Game} = require('./model/game');
var generateTicket = require('./util/genrateTicket');
var startTheGame = require('./util/startTheGame');

var users = new Users();
var games = new Game();


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
            // console.log(users.getUserCount(param.roomId));
            
            users.addUser(socket.id,param.username,param.roomId,admin);
            // console.log(users.getAllUsers());
            socket.join(param.roomId);
            io.to(param.roomId).emit('updateList',users.getUsernameList(param.roomId))
            calback();
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
        if(deletedUser && deletedUser.admin==true ){
            if(users.getUserCount(deletedUser.roomId)){
                users.setAdmin(deletedUser.roomId);

            }else{
                var game = games.getGame(deletedUser.roomId)[0];
                if(game && game.gameOver){
                    var index = games.games.indexOf(game);
                    games.games.splice(index,1);
                }
            }
            
        }
        if(deletedUser){
            io.to(deletedUser.roomId).emit('updateList',users.getUsernameList(deletedUser.roomId))        

        }
        // console.log("delUser ",deletedUser);
        
    })

    
    socket.on('startGame',(callback)=>{
        var user = users.getUser(socket.id);
        
        if(user && user.admin){
            var game = games.getGame(user.roomId)[0];
            if(game){
                console.log(game);
                
                if(game.gameOver){
                    //remove game
                }
                else{
                    callback('Game already started!')
                }
            }else{
                io.to(user.roomId).emit('generateTicket');
                games.addGame(user.roomId);
                console.log(games.games);
            }
            
            // var promise = new Promise((resolve,reject)=>{
            //     var count =0;
            //     var playerCount = users.getUserCount(user.roomId);
            //     socket.io('generatedTicket',(params)=>{
            //         console.log(params);
            //         count++;
            //     })
            //     if(count){

            //     }
                // var roomUsers = users.getUserList(user.roomId);
                // // console.log("roomUsers",roomUsers);
                
                // var players=[];
                // for(let i=0;i<roomUsers.length;i++){
                //     players.push(
                //         {
                //             id:roomUsers[i].id,
                //             ticket:generateTicket(100,15),
                //             score:0
                //         }
                //     )
                // }
                // console.log(players);
                
                // resolve(players);
            // })
            // promise.then((players)=>{

            //     console.log(player  s);
                
            // })
            // io.to(user.roomId).emit('generateTicket',)
            // io.to(user.roomId).emit('gameStarted',generateTicket(100,15));
            
        }
        else{
            if(user){
                return callback('Admin Will start game!')
            }
            else{
                return callback('Join lobby first!')
            }
        }
    })

    socket.on('generatedTicket',(ticket)=>{
        // console.log(ticket, socket.id);
        var user = users.getUser(socket.id);
        // console.log(user);
        if(user){
            var gameRoom = games.getGame(user.roomId);
            if(gameRoom){
                games.addPlayer(user.roomId,socket.id,ticket);
            }
            console.log("playerCount",games.getPlayerCount(user.roomId));
            
            // console.log(games.getPlayer(user.roomId,user.id));
            if(users.getUserCount(user.roomId) == games.getPlayerCount(user.roomId)){
                // io.to(user.roomId).emit('gameStarted')
                startTheGame(user.roomId,io,games)
                
            } 

        }
        
        // game.addPlayer()
        // console.log(games.games);
        
        
    })
    
    socket.on('checkNumber',(number,callback)=>{
        number = parseInt(number);
        var user = users.getUser(socket.id);
        if(user){
            var game = games.getGame(user.roomId)[0];
            if(game){
                var player = games.getPlayer(user.roomId,user.id);
                if(player){
                    var checkPicked = game.pickedNumbers.indexOf((number));
                    var checkTicket = player.ticket.indexOf(number)
                    if(checkPicked!=-1 && checkTicket!=-1){
                        games.punchTicket(user.roomId,user.id,number)
                        return callback(1);
                    }
                    else{
                        console.log("not ok");
                        return callback(0);
                    }
                }
                else{
                    console.log("game not found");
                    return callback(0);
                }
                }
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
