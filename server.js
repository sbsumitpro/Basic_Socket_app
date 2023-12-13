import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import path from "path";

const app = express();

// 1. create server using http
const server = http.createServer(app);

// 2. create socket server
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET", "POST"]
    }
})

// 3. use socket events

io.on("connection",(socket)=>{
    console.log("connection is established");

    socket.on("join",(username)=>{
        socket.username = username;
    })

    socket.on("new_message",(message)=>{
        const user ={
            username:socket.username,
            message:message
        }
        // broadcasting the message to all the clients from the server
        socket.broadcast.emit("broadcast_message", user)
    })

    socket.on("disconnect",()=>{
        console.log("connection is disconnected");
    })
})

app.get("/",(req,res)=>{
    return res.sendFile("client.html",{root: path.resolve() })
})

server.listen(3000,()=>{
    console.log("server is connected and listening to port 3000")
})