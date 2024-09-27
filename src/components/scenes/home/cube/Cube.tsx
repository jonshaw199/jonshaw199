import React, { useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import { animated } from "@react-spring/three"; // Import react-spring for animations
import { Euler, Group, Vector3 } from "three";
import {
  ProjectContext,
  useProjectContext,
} from "../../../../providers/projectProvider";

function DefaultFace() {
  return null; // Using null to render an empty face
}

// Constants for cube dimensions
const CUBE_SIZE = 15;
const CUBE_SCALE_FACTOR = 79.5;

// Predefined face positions and rotations
const FACE_TRANSFORMS = [
  { position: [0, 0, CUBE_SIZE / 2], rotation: [0, 0, 0] }, // Front
  { position: [CUBE_SIZE / 2, 0, 0], rotation: [0, Math.PI / 2, 0] }, // Right
  { position: [0, 0, -CUBE_SIZE / 2], rotation: [0, Math.PI, 0] }, // Back
  { position: [-CUBE_SIZE / 2, 0, 0], rotation: [0, -Math.PI / 2, 0] }, // Left
  { position: [0, CUBE_SIZE / 2, 0], rotation: [-Math.PI / 2, 0, 0] }, // Top
  { position: [0, -CUBE_SIZE / 2, 0], rotation: [Math.PI / 2, 0, 0] }, // Bottom
].map(({ position, rotation }) => ({
  position: new Vector3(...position),
  rotation: new Euler(...rotation),
}));

interface CubeProps {
  faces?: React.ReactNode[];
}

const Cube: React.FC<CubeProps> = ({ faces = [] }) => {
  const groupRef = useRef<Group>(null);
  const { projects } = useProjectContext();

  // Ensure exactly 6 faces by filling missing ones with DefaultFace
  const _faces = useMemo(() => {
    return Array(6)
      .fill(null)
      .map((_, i) => faces[i] || <DefaultFace />);
  }, [faces]);

  return (
    <animated.group ref={groupRef}>
      {_faces.map((content, i) => {
        const { position, rotation } = FACE_TRANSFORMS[i];
        return (
          <mesh key={i} position={position} rotation={rotation}>
            <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, 0.001]} />
            <meshBasicMaterial color="white" />
            <Html
              transform
              occlude
              position={[0, 0, 0.01]}
              distanceFactor={5}
              style={{
                height: CUBE_SIZE * CUBE_SCALE_FACTOR,
                width: CUBE_SIZE * CUBE_SCALE_FACTOR,
                overflow: "auto",
              }}
            >
              <ProjectContext.Provider value={{ projects }}>
                {content}
              </ProjectContext.Provider>
            </Html>
          </mesh>
        );
      })}
    </animated.group>
  );
};

export default Cube;
