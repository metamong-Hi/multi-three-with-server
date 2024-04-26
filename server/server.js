import { Server } from "socket.io"
const characters = [];
const io = new Server({
    cors: {
        origin: "http://localhost:5174"
    }
});

io.listen(3001);
io.on("connection", (socket) => {
    console.log(`connected ${socket.id}`);

    // characters.push({
    //     key:socket.id,
    //     name:"unknown",
    //     animationName:"Idle",
    //     position:[Math.random()*10-5,1,Math.random()*10-5],
    //     rotationY:(Math.random()*360)*(Math.PI/180)
    // })
    io.emit("characters", characters);
    // console.log(characters);
    socket.on("update", (data => {
        const character = characters.find(item => item.key === socket.id);

        //캐릭터 이동 시 채팅 숨김
        if(character.position.some((v,i) => v!==data.position[i])){
            character.talk="";
        }

        character.animationName = data.animationName;
        character.position = data.position;
        character.rotationY = data.rotationY;

        io.emit("characters", characters);
    }))

    socket.on("join", (name) => {
        characters.push({
            key: socket.id,
            name: name,
            animationName: "Idle",
            position: [Math.random() * 10 - 5, 1, Math.random() * 10 - 5],
            rotationY: (Math.random() * 360) * (Math.PI / 180),
            talk:""
        });
        io.emit("characters",characters);
    });
    socket.on("talk",(msg)=>{
        const character=characters.find(item=>item.key===socket.id);
        character.talk=msg;
        io.emit("characters",characters);
    });

    socket.on("disconnect", () => {
        console.log(`bye ${socket.id}`);
        const idx = characters.findIndex((item) => item.key === socket.id)
        characters.splice(idx, 1);
        io.emit("characters", characters);
        console.log(characters)
    })
});