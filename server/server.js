import { Server } from "socket.io"
const io = new Server({
    cors:{
        origin:"http://localhost:5173"
    }
});

io.listen(3001);
io.on("connection",(socket)=>{
    console.log(`connected ${socket.id}`);

    socket.on("disconnect",()=>{
        console.log(`bye ${socket.id}`
    );
    })
});