import { useEffect } from "react";
import {io} from "socket.io-client"
import {atom, useAtom} from "jotai"

export const socket= io("http://localhost:3001");

export const castAtom=atom([]);

export default function ServerConnector(){
    const [cast,setCast]=useAtom(castAtom);
    useEffect(()=>{
        const onConnect=()=>{
            console.log("connected");
        }
        const onDisconnect=()=>{
            console.log("disconnected");
        }

        const onChracters=(v)=>{
            setCast(v);
        }
        socket.on("connect",onConnect);
        socket.on("disconnect",onDisconnect);
        socket.on("characters",v=>{
            setCast(v);
        })
        return ()=>{
            socket.off("connect",onConnect);
            socket.off("disconnect",onDisconnect);
            socket.off("characters",onChracters);
        }
    })
}