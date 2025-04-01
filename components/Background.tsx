"use client";

import dynamic from "next/dynamic";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import BackgroundScene from "./background-scene";

const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => mod.Canvas), {
    ssr: false,
});

export default function Background() {
    return (
        <div className="fixed inset-0 -z-10">
            <Canvas>
                <Suspense fallback={null}>
                    <BackgroundScene />
                    <Environment preset="city" />
                    <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                </Suspense>
            </Canvas>
        </div>
    );
}