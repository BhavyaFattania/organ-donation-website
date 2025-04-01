"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useThree } from "@react-three/fiber"
import { MeshDistortMaterial, Sphere } from "@react-three/drei"
import type * as THREE from "three"

export default function BackgroundScene() {
  const { viewport } = useThree()
  const groupRef = useRef<THREE.Group>(null)

  // Create multiple spheres with different positions and colors
  const spheres = [
    { position: [0, 0, -5], color: "#f0f9ff", scale: 2.5, distort: 0.3, speed: 0.1 },
    { position: [-2, -1, -3], color: "#e0f2fe", scale: 1.2, distort: 0.2, speed: 0.15 },
    { position: [2, 1, -4], color: "#bae6fd", scale: 1.5, distort: 0.4, speed: 0.12 },
    { position: [-1, 2, -6], color: "#7dd3fc", scale: 1.8, distort: 0.3, speed: 0.08 },
  ]

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation of the entire group
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {spheres.map((sphere, index) => (
        <Sphere key={index} position={sphere.position as [number, number, number]} args={[sphere.scale, 64, 64]}>
          <MeshDistortMaterial
            color={sphere.color}
            attach="material"
            distort={sphere.distort}
            speed={sphere.speed}
            transparent
            opacity={0.7}
          />
        </Sphere>
      ))}
    </group>
  )
}

