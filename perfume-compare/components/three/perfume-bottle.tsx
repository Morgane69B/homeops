"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Lathe, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { BottleStyle } from "@/lib/bottle-style";

function profile(pairs: [number, number][]) {
  return pairs.map(([r, y]) => new THREE.Vector2(r, y));
}

function GlassMaterial({ color }: { color: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      transmission={1}
      roughness={0.04}
      thickness={0.6}
      ior={1.5}
      envMapIntensity={1.4}
      clearcoat={1}
      clearcoatRoughness={0.1}
    />
  );
}

function LiquidMaterial({ color }: { color: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      transmission={0.6}
      roughness={0.15}
      thickness={0.4}
      ior={1.4}
      transparent
      opacity={0.9}
    />
  );
}

function CapMaterial({ color, roughness }: { color: string; roughness: number }) {
  return <meshStandardMaterial color={color} metalness={1} roughness={roughness} />;
}

/** A cap silhouette shared by every lathe-based bottle: flares over the neck,
 *  cylindrical band, then rounds off to a domed tip. */
function capProfile(neckRadius: number) {
  return profile([
    [neckRadius, 0],
    [neckRadius + 0.02, 0.02],
    [neckRadius, 0.05],
    [neckRadius - 0.01, 0.24],
    [neckRadius - 0.05, 0.3],
    [neckRadius - 0.12, 0.34],
    [0, 0.36],
  ]);
}

function LatheBottle({
  style,
  body,
  liquid,
  segments,
  neckRadius,
  neckTopY,
}: {
  style: BottleStyle;
  body: [number, number][];
  liquid: [number, number][];
  segments: number;
  neckRadius: number;
  neckTopY: number;
}) {
  const bodyPoints = useMemo(() => profile(body), [body]);
  const liquidPoints = useMemo(() => profile(liquid), [liquid]);
  const capPoints = useMemo(() => capProfile(neckRadius), [neckRadius]);

  return (
    <>
      <Lathe args={[liquidPoints, segments]}>
        <LiquidMaterial color={style.liquid} />
      </Lathe>
      <Lathe args={[bodyPoints, segments]}>
        <GlassMaterial color={style.glass} />
      </Lathe>
      <group position={[0, neckTopY, 0]}>
        <Lathe args={[capPoints, segments]}>
          <CapMaterial color={style.cap} roughness={style.capRoughness} />
        </Lathe>
      </group>
    </>
  );
}

function RoundBottle({ style }: { style: BottleStyle }) {
  return (
    <group position={[0, -0.5, 0]}>
      <LatheBottle
        style={style}
        segments={32}
        neckRadius={0.1}
        neckTopY={1.0}
        body={[
          [0, 0],
          [0.36, 0.02],
          [0.44, 0.1],
          [0.46, 0.2],
          [0.46, 0.55],
          [0.42, 0.66],
          [0.28, 0.76],
          [0.13, 0.85],
          [0.1, 0.92],
          [0.1, 1.0],
        ]}
        liquid={[
          [0, 0.05],
          [0.3, 0.08],
          [0.37, 0.15],
          [0.38, 0.45],
          [0.34, 0.58],
          [0.2, 0.66],
          [0, 0.7],
        ]}
      />
    </group>
  );
}

function FacetedBottle({ style }: { style: BottleStyle }) {
  return (
    <group position={[0, -0.55, 0]}>
      <LatheBottle
        style={style}
        segments={8}
        neckRadius={0.1}
        neckTopY={1.1}
        body={[
          [0, 0],
          [0.26, 0.02],
          [0.32, 0.1],
          [0.34, 0.22],
          [0.34, 0.8],
          [0.3, 0.9],
          [0.16, 0.98],
          [0.1, 1.04],
          [0.1, 1.1],
        ]}
        liquid={[
          [0, 0.05],
          [0.2, 0.08],
          [0.27, 0.15],
          [0.28, 0.65],
          [0.2, 0.75],
          [0, 0.8],
        ]}
      />
    </group>
  );
}

function FlaskBottle({ style }: { style: BottleStyle }) {
  return (
    <group position={[0, -0.55, 0]}>
      <LatheBottle
        style={style}
        segments={32}
        neckRadius={0.09}
        neckTopY={1.08}
        body={[
          [0, 0],
          [0.2, 0.02],
          [0.38, 0.1],
          [0.42, 0.25],
          [0.4, 0.42],
          [0.32, 0.58],
          [0.22, 0.75],
          [0.12, 0.9],
          [0.09, 1.0],
          [0.09, 1.08],
        ]}
        liquid={[
          [0, 0.05],
          [0.16, 0.08],
          [0.32, 0.15],
          [0.34, 0.3],
          [0.26, 0.5],
          [0.14, 0.65],
          [0, 0.7],
        ]}
      />
    </group>
  );
}

function TallBottle({ style }: { style: BottleStyle }) {
  return (
    <>
      <RoundedBox
        args={[0.62, 1.0, 0.34]}
        radius={0.05}
        smoothness={4}
        position={[0, -0.18, 0]}
      >
        <LiquidMaterial color={style.liquid} />
      </RoundedBox>
      <RoundedBox
        args={[0.72, 1.12, 0.42]}
        radius={0.06}
        smoothness={6}
        position={[0, -0.1, 0]}
      >
        <GlassMaterial color={style.glass} />
      </RoundedBox>
      <RoundedBox
        args={[0.42, 0.16, 0.24]}
        radius={0.04}
        smoothness={4}
        position={[0, 0.54, 0]}
      >
        <GlassMaterial color={style.glass} />
      </RoundedBox>
      <RoundedBox
        args={[0.18, 0.2, 0.18]}
        radius={0.03}
        smoothness={4}
        position={[0, 0.72, 0]}
      >
        <GlassMaterial color={style.glass} />
      </RoundedBox>
      <group position={[0, 0.82, 0]}>
        <Lathe args={[capProfile(0.16), 24]}>
          <CapMaterial color={style.cap} roughness={style.capRoughness} />
        </Lathe>
      </group>
    </>
  );
}

const SHAPE_COMPONENTS = {
  tall: TallBottle,
  round: RoundBottle,
  faceted: FacetedBottle,
  flask: FlaskBottle,
};

export function PerfumeBottle({
  style,
  interactive = false,
}: {
  style: BottleStyle;
  /** When true (product page + OrbitControls), skip the idle pointer-tilt so it doesn't fight user drag. */
  interactive?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const pointer = useThree((state) => state.pointer);
  const ShapeComponent = SHAPE_COMPONENTS[style.shape];

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;

    if (interactive) return;

    node.rotation.y += delta * 0.35;

    const targetTiltX = pointer.y * 0.25;
    const targetTiltZ = -pointer.x * 0.2;
    node.rotation.x = THREE.MathUtils.lerp(node.rotation.x, targetTiltX, 0.05);
    node.rotation.z = THREE.MathUtils.lerp(node.rotation.z, targetTiltZ, 0.05);
  });

  return (
    <group ref={group}>
      <ShapeComponent style={style} />
    </group>
  );
}
