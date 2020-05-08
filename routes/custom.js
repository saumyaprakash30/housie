var route = require('express').Router()





module.exports = (io)=>{
    route.get('/',(req,res)=>{
        console.log(req.query);
        
        io.on('connection',(socket)=>{
            console.log("new User connected in custom "+ socket.id);
            
    
        
            socket.on('disconnect',()=>{
            console.log(`user disconnected from custom ${socket.id  }`);
            
        })
        })
        res.render('custom')
    })

    return route;
};