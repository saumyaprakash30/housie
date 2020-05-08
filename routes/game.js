const route = require('express').Router()




module.exports = (io)=>{
    route.get('/',(req,res)=>{
        console.log(req.query);
        console.log(req.body);
        
        
        // io.on('connection',(socket)=>{
        //     console.log(`new user connected in game ${socket.id}`);
            
        //     socket.on('disconnect',()=>{
        //         console.log(`user disconnected from game ${socket.id}`);
                
        //     })

        // })
        res.render('game'); 
    })
    route.post('/',(req,res)=>{
        console.log(req.query);
        console.log(req.body);
        res.render('game')
        io.on('connection',(socket)=>{
            console.log(`new user connected in game ${socket.id}`);
            socket.on('join',()=>{
                
            })
            socket.on('disconnect',()=>{
                console.log(`user disconnected from game ${socket.id}`);
                
            })

        })
    })
    // io.on('connection',(socket)=>{
        
        
    //     // socket.join(getRoomId())

    //     // socket.on('join',()=>{
    //     //     Users.removeUser(socket.id);
    //     //     Users.addUser(socket.id,username)
    //     // })

    // })
    return route;
}