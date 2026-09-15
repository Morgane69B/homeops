"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Sparkles } from "@react-three/drei";
import { PerfumeBottle } from "@/components/three/perfume-bottle";
import type { BottleStyle } from "@/lib/bottle-style";

export function ProductCanvas({ style }: { style: BottleStyle }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.6], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <spotLight
          position={[3, 4, 3]}
          angle={0.35}
          penumbra={1}
          intensity={2.2}
          color="#f4d998"
        />
        <pointLight position={[-3, -1, -2]} intensity={1.1} color="#0b6e4f" />

        <PerfumeBottle style={style} interactive />

        <Sparkles
          count={35}
          scale={[3, 3, 1.5]}
          size={2}
          speed={0.2}
          opacity={0.4}
          color="#d4af37"
        />

        <Environment preset="city" environmentIntensity={0.6} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.2}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(Math.PI * 2) / 3}
        />
      </Suspense>
    </Canvas>
  );
}
