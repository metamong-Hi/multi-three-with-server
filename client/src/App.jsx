import { KeyboardControls, Loader } from '@react-three/drei'
import './App.css'
import Experience from './Experience'
import { Canvas } from "@react-three/fiber"
import { useState } from 'react';
import ServerConnector from './ServerConnector';
import LoginOverlay, { userNameAtom } from './LoginOverlay';
import {atom,useAtom} from "jotai";
import TalkOverlay from './TalkOverlay';
function App() {
  const [ loaded, setLoaded ] = useState(false);
  const[userName]=useAtom(userNameAtom);

  return (
    <>
    <ServerConnector/>
      <KeyboardControls map={[
        { name: "forward", keys: ["ArrowUp", "KeyW"]},
        { name: "backward", keys: ["ArrowDown", "KeyS"]},
        { name: "leftward", keys: ["ArrowLeft", "KeyA"]},
        { name: "rightward", keys: ["ArrowRight", "KeyD"]},
        { name: "walk", keys: ["Shift"]}
      ]}>
        <Canvas shadows>
          <Experience loaded={loaded} />
        </Canvas>
        <Loader dataInterpolation={ (v) => {
          if(v >= 100) setLoaded(true);
          return parseInt(v) + "% 다운로드 중입니다."
        }} />
       {!userName && <LoginOverlay/>}
       {userName && <TalkOverlay/>}
      </KeyboardControls>
    </>
  )
}

export default App
