const express = require('express');
const path = require('path');

const messenger = require('socket.io')();

const app = express();

app.use(express.static("public"));

const port = process.env.PORT || 5050;

app.get("/", (req,res) => {
    console.log('you have now hit the home route');
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/chat", (req,res) => {
    console.log('you have now hit the chat.html');
    res.sendFile(path.join(__dirname, "chat.html"));
});

const server = app.listen(port, ()=>{
    console.log(`app is running on ${port}`);
});
var i = 0;
//messenger is the connection mananger - like a switchboard prerator
messenger.attach(server);

//stock is the individual connection - the caller
messenger.on('connection', (socket) => {
    /* Number of people entering the room +1 */
    i = i + 1;
    // send the user their assigned ID
    // The client sends a custom event to the server
    socket.emit('connected',{sID: `${socket.id}`});
    // socket.broadcast.emit('number', { number: i,sID: `${socket.id}`,});
    socket.emit('number', { number: i});
    
    
    /* The server responds to custom events */
    socket.on('chat_message', function(msg) {
        console.log(msg);
        console.log('Send data to the client method：message');
        socket.broadcast.emit('message', { id: `${socket.id}`,username: `${msg.username}`, name: `${msg.name}`, message: `${msg.message}`, time: `${msg.time}` });
        socket.emit('message', { id: `${msg.id}`,username: `${msg.username}`, name: `${msg.name}`, message: `${msg.message}`, time: `${msg.time}` });
    });
    // Exit the room prompt
    socket.on('disconnect',(msg) => {
        i = i - 1; 
        socket.broadcast.emit('number', { number: i});
        socket.emit('number', { id: `${socket.id}`,username: `${msg.username}`});
    })

    

});