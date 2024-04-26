import { useRef } from "react";
import "./TalkOverlay.css";
import {socket} from "./ServerConnector";

export default function TalkOverlay(){
    const refInput=useRef();

    const talk=()=>{
        const msg=refInput.current.value.trim();
        if(msg.length>0){
            socket.emit("talk",msg);
        }
    }
    const keydown=(event) =>{
        //event.stopPropagation()
        if(event.code==="Enter") {
        talk()
        }
        event.stopPropagation();
        }
    return <>
        <div className="talk-layout">
            <input ref={refInput} onKeyDown={keydown}/>

            <div className="send" onClick={talk}>SEND</div>
        </div>
    </>
}