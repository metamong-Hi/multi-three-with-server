import { useEffect, useRef } from "react"
import "./LoginOverlay.css"
import {atom,useAtom} from "jotai";
import { socket } from "./ServerConnector";

export const userNameAtom=atom();
export default function LoginOverlay(){
    const refInput=useRef();
    const [,setUserName]=useAtom(userNameAtom);


    const login=()=>{
        console.log("login");
        const userName=refInput.current.value.trim();
        setUserName(userName);
        if(userName.length>0){
            socket.emit("join",userName);
        }
    }
    useEffect(()=>{
        refInput.current.focus();
    },[]);
    return <>
        <div className="login-layout">
            <div>
                <div className="name">YOUR NAME</div>
                <input ref={refInput}/>
            </div>
            <div onClick={login}className="login">JOIN</div>
        </div>
    </>
}