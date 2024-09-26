import React, { useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three"; // Import react-spring for animations
import { Group } from "three";
import {
  ProjectContext,
  useProjectContext,
} from "../../../../providers/projectProvider";

function DefaultFace() {
  return <></>;
}

interface CubeProps {
  faces?: React.ReactNode[];
  activeIndex?: number;
}

const CUBE_SCALE_FACTOR = 79.5;
const CUBE_SIZE = 15;

// Define the target rotation for the cube based on the activeIndex
const rotationMap = [
  [0, 0, 0], // Front face
  [0, Math.PI / 2, 0], // Right face
  [0, Math.PI, 0], // Back face
  [0, -Math.PI / 2, 0], // Left face
  [-Math.PI / 2, 0, 0], // Top face
  [Math.PI / 2, 0, 0], // Bottom face
];

const Cube: React.FC<CubeProps> = ({ faces = [], activeIndex = 0 }) => {
  const groupRef = useRef<Group>(null);
  const { projects } = useProjectContext();

  const _faces = useMemo(() => {
    const filled = Array(6).fill(<DefaultFace />);
    filled.splice(0, 6 - faces.length, ...faces);
    return filled;
  }, [faces]);

  const _activeIndex = useMemo(
    () => Math.max(0, activeIndex) % 6,
    [activeIndex]
  );

  const [targetX, targetY, targetZ] = rotationMap[_activeIndex] || [0, 0, 0];

  // Create a spring animation for the rotation
  const { rotation } = useSpring({
    rotation: [targetX, targetY, targetZ], // Interpolate to the target rotation
    config: { mass: 1, tension: 170, friction: 26 },
  });

  return (
    <animated.group ref={groupRef} rotation={rotation as any}>
      {/* Create each face of the cube */}
      {_faces.map((content, i) => {
        const position = getPositionForFace(i, CUBE_SIZE);
        const rotation = getRotationForFace(i);

        return (
          <mesh key={i} position={position} rotation={rotation}>
            <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, 0.01]} />
            <meshBasicMaterial color="white" />
            <Html
              transform
              occlude
              position={[0, 0, 0.051]}
              distanceFactor={5}
              style={{
                height: CUBE_SIZE * CUBE_SCALE_FACTOR,
                width: CUBE_SIZE * CUBE_SCALE_FACTOR,
                overflow: "auto",
              }}
            >
              {/* Forward context; see https://github.com/pmndrs/react-three-fiber/issues/262 */}
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
