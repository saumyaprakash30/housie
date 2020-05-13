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
var scoreCheck = require('./util/scoreCheck');

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
            
            var game = games.getGame(param.roomId)[0]
            if(game && game.isStarted ){
                // socket.emit('generateTicket',2)
                // console.log("game stat",game.gameOver);
                if(!game.gameOver)
                return calback('Game in progress!')
            }
            users.addUser(socket.id,param.username,param.roomId,admin);
            // console.log(users.getAllUsers());
            socket.join(param.roomId);
            console.log(`${param.username} joined ${param.roomId}`);
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
                    console.log("last player leave - over");
                    
                    // games.setGameOver(game.roomId);
                    // console.log("game removed",game.id);
                    // games.games.splice(index,1);
                }
                else if(game && !game.gameOver){
                    console.log("last player leave - not over");
                    games.setGameOver(game.roomId);
                    setTimeout(()=>{
                        console.log("game removed",game.id);
                        
                        games.games.splice(index,1);

                    },10000)
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
                    var index = games.games.indexOf(game);
                    console.log("game removed",game.id);
                    games.games.splice(index,1);
                    io.to(user.roomId).emit('generateTicket',1);
                
                    games.addGame(user.roomId);
                    // console.log(games.games);
                }
                else{
                    callback('Game already started!')
                }
            }else{
                io.to(user.roomId).emit('generateTicket',1);
                
                games.addGame(user.roomId);
                // console.log(games.games);
            }
            
            
        }
        else{
            if(user){
                var game = games.getGame(user.roomId)[0];
                // console.log("gaameee",game);
                
                // if(game && games.getGame(user.roomId)[0].isStarted){
                //     return callback("Game in progress!")
                // }
                return callback('Admin Will start game!')

                
            }
            else{
                return callback('Join lobby first!')
            }
        }
    })

    socket.on('generatedTicket',(ticket,type)=>{
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
            if(users.getUserCount(user.roomId) == games.getPlayerCount(user.roomId) && type==1 ){
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
            console.log(user);
            
            var game = games.getGame(user.roomId)[0];
            if(game){
                var player = games.getPlayer(user.roomId,user.id);
                if(player){
                    var checkPicked = game.pickedNumbers.indexOf((number));
                    var checkTicket = player.ticket.indexOf(number)
                    if(checkPicked!=-1 && checkTicket!=-1){
                        games.punchTicket(user.roomId,user.id,number)
                        scoreCheck(user.roomId,user.id,io,games,users)
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
            }else{
                return callback(-1);
            }
        }
        else{
            return callback(-1);
        }
        
        
        
    })

    socket.on('message',(msg)=>{
        // console.log(msg);
        let user = users.getUser(socket.id);
        // console.log(user);
        
        if(user){
            io.to(user.roomId).emit('newMessage',{username:user.username,msg:msg});
        }
        


        // return callback('received')
        
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
