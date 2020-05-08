const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const dotenv = require('dotenv').config()




app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')
var io = socketIO(http);


app.get('/',(req,res)=>{
    res.render('home');
})



const PORT = process.env.PORT||5081;
http.listen(PORT,()=>{
    console.log(`Server is live on ${PORT}`);
    
})
