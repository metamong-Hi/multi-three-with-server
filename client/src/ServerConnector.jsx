import { useEffect } from "react";
import {io} from "socket.io-client"
export const socket= io("http://localhost:3001");
export default function ServerConnector(){
    useEffect(()=>{
        const onConnect=()=>{
            console.log("connected");
        }
        const onDisconnect=()=>{
            console.log("disconnected");
        }
        socket.on("connect",onConnect);
        socket.on("disconnect",onDisconnect);
        return ()=>{
            socket.off("connect",onConnect);
            socket.off("disconnect",onDisconnect);
        }
    })
}