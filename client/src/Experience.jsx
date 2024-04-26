import { Environment, OrbitControls, Sky, SoftShadows } from "@react-three/drei"
import * as THREE from "three"
import Character from "./Character"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react";
import { Physics, RigidBody } from "@react-three/rapier"
import { Perf } from "r3f-perf"
import { Model as Stage } from "./Stage"
import { Model as Colleague } from "./Colleague"
import { DEG2RAD } from "three/src/math/MathUtils.js";
import { castAtom, socket } from "./ServerConnector";
import { useAtom } from "jotai";
import { EffectComposer,N8AO } from "@react-three/postprocessing";
function FollowShadowLight({ refLight, refCharacterRigid }) {
    useFrame(() => {
        if(refCharacterRigid.current) {
            const { x: cx, y: cy, z: cz } = refCharacterRigid.current.translation();
            const cPos = new THREE.Vector3(cx, cy, cz);
            const lightRevDir = new THREE.Vector3(0, 3, 2).normalize();
            const newPos = lightRevDir.multiplyScalar(10).add(cPos);
            if (refLight.current) {
                refLight.current.target.position.copy(cPos);
                refLight.current.position.copy(newPos);
            }
        }
    });
}

// const Colleagues = [
//     { name: "test1", animationName: "Idle", position: [2.5, 1, 0], rotationY: DEG2RAD * 0 },
//     { name: "test2", animationName: "Run", position: [-2.5, 1, 0], rotationY: DEG2RAD * 45 },
//     { name: "test3", animationName: "Walk", position: [0, 1, 2.5], rotationY: DEG2RAD * 228 }
// ];

export default function Experience({ loaded }) {
    const { gl, scene } = useThree(({ gl, scene }) => ({ gl, scene }));
    useEffect(() => { gl.toneMappingExposure = 0.7 }, [gl, scene]);
    const refOrbitControls = useRef();
    const refLight = useRef();
    const refShadowCameraHelper = useRef();
    const refCharacterRigid = useRef();
    const [cast]=useAtom(castAtom);

    useEffect(() => {
        refShadowCameraHelper.current =
            new THREE.CameraHelper(refLight.current.shadow.camera);
        // scene.add(refShadowCameraHelper.current);
        scene.add(refLight.current.target);

        return () => {
            scene.remove(refShadowCameraHelper.current);
            scene.remove(refLight.current.target);
        }

    }, [refLight.current]);

    return <>
        <Perf position="bottom-left" />
        <OrbitControls ref={refOrbitControls} />
        <EffectComposer>
            <N8AO distanceFalloff={1} aoRadius={.5} intensity={1.4}/>
        </EffectComposer>
        <directionalLight shadow-normalBias={0.05} ref={refLight} castShadow
            position={[0, 1, 2]} intensity={1} />
        <Environment preset="city" />
        <Sky />
        <SoftShadows size={2} focus={0} samples={8} />

        <Physics>
            {/* {loaded && <Character
                name="metamong" position={[1, 3, 0]}
                ref={refCharacterRigid} refOrbitControls={refOrbitControls} />
            }

            {loaded && Colleagues.map((item, idx) => <Colleague key={idx} {...item} />)} */}

            {
                cast.map(item=>{
                    console.log(item, socket)
                    if(item.key===socket.id){
                        return <Character ref={refCharacterRigid} refOrbitControls={refOrbitControls} {...item}/>
                    }
                    else{
                        return <Colleague {...item}/>
                    }
                })
            }

            <RigidBody type="fixed" colliders="trimesh">
                <Stage />
            </RigidBody>

        </Physics>

        <FollowShadowLight refLight={refLight} refCharacterRigid={refCharacterRigid} />

    </>
}