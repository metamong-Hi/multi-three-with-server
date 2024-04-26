import { Server } from "socket.io"
const characters=[];
const io = new Server({
    cors:{
        origin:"http://localhost:5174"
    }
});

io.listen(3001);
io.on("connection",(socket)=>{
    console.log(`connected ${socket.id}`);

    characters.push({
        key:socket.id,
        name:"unknown",
        animationName:"Idle",
        position:[Math.random()*10-5,1,Math.random()*10-5],
        rotationY:(Math.random()*360)*(Math.PI/180)
    })
    io.emit("characters",characters);
    // console.log(characters);
    socket.on("update",(data=>{
        const character = characters.find(item=>item.key===socket.id);
        character.animationName=data.animationName;
        character.position=data.position;
        character.rotationY=data.rotationY;

        socket.broadcast.emit("characters",characters);
    }))
    socket.on("disconnect",()=>{
        console.log(`bye ${socket.id}`);
        const idx=characters.findIndex((item)=>item.key===socket.id)
        characters.splice(idx,1);
        io.emit("characters",characters);
    })
});