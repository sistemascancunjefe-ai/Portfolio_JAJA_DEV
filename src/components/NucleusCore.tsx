import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const NucleusCore: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.2;
      meshRef.current.rotation.y = t * 0.3;
      // Pulse effect
      const scale = 1 + Math.sin(t * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
    if (outerRef.current) {
        outerRef.current.rotation.z = t * 0.1;
        outerRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <group ref={outerRef}>
      {/* Central Geometric Core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#FF6600"
          emissive="#FF6600"
          emissiveIntensity={2}
          wireframe
        />
      </mesh>

      {/* Outer Shield / Energy Field */}
      <Sphere args={[1.2, 32, 32]}>
        <MeshDistortMaterial
          color="#0066B3"
          speed={2}
          distort={0.4}
          radius={1}
          opacity={0.3}
          transparent
        />
      </Sphere>

      {/* Technical Data Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00f2fe" opacity={0.5} transparent />
      </mesh>
    </group>
  );
};

export default NucleusCore;
