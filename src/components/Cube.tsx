import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface CubeProps {
  faces?: React.ReactNode[]; // Content for each cube face
  activeIndex?: number; // Index of the active face (front and center)
}

const Cube: React.FC<CubeProps> = ({ faces = [], activeIndex = 0 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const cubeSize = 3; // Size of the cube

  // Effect for rotating the cube based on active index
  useEffect(() => {
    if (groupRef.current) {
      const rotationMap = [
        [0, 0, 0], // Front face
        [0, Math.PI / 2, 0], // Right face
        [0, Math.PI, 0], // Back face
        [0, -Math.PI / 2, 0], // Left face
        [-Math.PI / 2, 0, 0], // Top face
        [Math.PI / 2, 0, 0], // Bottom face
      ];

      const [x, y, z] = rotationMap[activeIndex] || [0, 0, 0];

      groupRef.current.rotation.set(x, y, z);
    }
  }, [activeIndex]);

  return (
    <Canvas style={{ height: "100vh", width: "100vw" }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <group ref={groupRef}>
        {/* Create each face of the cube */}
        {faces.map((content, i) => {
          const position = getPositionForFace(i, cubeSize);
          const rotation = getRotationForFace(i);

          return (
            <mesh key={i} position={position} rotation={rotation}>
              <boxGeometry args={[cubeSize, cubeSize, 0.1]} />
              <meshBasicMaterial color="white" />
              {/* Use Html from drei to render React components on cube faces */}
              <Html transform occlude position={[0, 0, 0.06]}>
                <div
                  style={{
                    width: `${cubeSize * 50}px`,
                    height: `${cubeSize * 50}px`,
                  }}
                >
                  {content}
                </div>
              </Html>
            </mesh>
          );
        })}
      </group>
    </Canvas>
  );
};

// Helper to get position for each cube face
const getPositionForFace = (
  index: number,
  size: number
): [number, number, number] => {
  switch (index) {
    case 0:
      return [0, 0, size / 2]; // Front
    case 1:
      return [size / 2, 0, 0]; // Right
    case 2:
      return [0, 0, -size / 2]; // Back
    case 3:
      return [-size / 2, 0, 0]; // Left
    case 4:
      return [0, size / 2, 0]; // Top
    case 5:
      return [0, -size / 2, 0]; // Bottom
    default:
      return [0, 0, 0];
  }
};

// Helper to get rotation for each cube face
const getRotationForFace = (index: number): [number, number, number] => {
  switch (index) {
    case 0:
      return [0, 0, 0]; // Front
    case 1:
      return [0, Math.PI / 2, 0]; // Right
    case 2:
      return [0, Math.PI, 0]; // Back
    case 3:
      return [0, -Math.PI / 2, 0]; // Left
    case 4:
      return [-Math.PI / 2, 0, 0]; // Top
    case 5:
      return [Math.PI / 2, 0, 0]; // Bottom
    default:
      return [0, 0, 0];
  }
};

export default Cube;
