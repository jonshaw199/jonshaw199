import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Cube from "./cube/Cube";
import Portfolio from "./portfolio/Portfolio";
import Resume from "./resume/Resume";
import Overview from "./overview/Overview";
import Contact from "./contact/Contact";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";

const DISTANCE = 20;
const orbitEnabled = true;

const faces = [<Contact />, <Resume />, <Portfolio />, <Overview />];

// Helper function to convert face index to normalized position vector
const getFacePosition = (faceIndex: number) => {
  switch (faceIndex) {
    case 0:
      return new Vector3(0, 0, 1); // Front
    case 1:
      return new Vector3(1, 0, 0); // Right
    case 2:
      return new Vector3(0, 0, -1); // Back
    case 3:
      return new Vector3(-1, 0, 0); // Left
    case 4:
      return new Vector3(0, 1, 0); // Top
    case 5:
      return new Vector3(0, -1, 0); // Bottom
    default:
      return new Vector3(0, 0, 1); // Default to Front if out of bounds
  }
};

// Helper function to calculate a control point for the arc
const getControlPoint = (start: Vector3, end: Vector3, arcHeight: number) => {
  // Midpoint between start and end
  const midPoint = start.clone().add(end).multiplyScalar(0.5);

  // Direction perpendicular to the straight line path
  const direction = midPoint.clone().normalize();

  // Scale it by arcHeight and add to midpoint
  return midPoint.add(direction.multiplyScalar(arcHeight));
};

function Scene({ activeFaceIndex }: { activeFaceIndex: number }) {
  const { camera } = useThree();
  const [isOrbiting, setIsOrbiting] = useState(false);
  const targetPosition = useRef(new Vector3());
  const controlPoint = useRef(new Vector3());
  const currentPosition = useRef(camera.position.clone());
  const speed = 0.02; // Speed of the camera movement
  const arcHeight = 30; // Maximum distance from the straight line path

  // Track progress along the path (0 to 1)
  const progress = useRef(0);

  // Update the target and control positions whenever the activeFaceIndex changes
  useEffect(() => {
    const startPosition = currentPosition.current.clone();
    const facePosition =
      getFacePosition(activeFaceIndex).multiplyScalar(DISTANCE);
    targetPosition.current.copy(facePosition);
    controlPoint.current.copy(
      getControlPoint(startPosition, facePosition, arcHeight)
    );

    // Reset the progress
    progress.current = 0;
  }, [activeFaceIndex, DISTANCE, arcHeight]);

  // Update the camera's position along the arc
  useFrame(() => {
    if (!isOrbiting) {
      // Increase progress
      progress.current += speed;

      // Ensure progress doesn't exceed 1
      if (progress.current > 1) {
        progress.current = 1;
      }

      // Interpolate position along the quadratic Bézier curve
      const t = progress.current;
      const current = new Vector3()
        .copy(currentPosition.current.clone().multiplyScalar((1 - t) * (1 - t)))
        .add(controlPoint.current.clone().multiplyScalar(2 * (1 - t) * t))
        .add(targetPosition.current.clone().multiplyScalar(t * t));

      // Update camera position
      camera.position.copy(current);

      // Make the camera look at the center of the cube
      camera.lookAt(0, 0, 0);

      // Update currentPosition for the next frame
      if (progress.current < 1) {
        currentPosition.current.copy(current);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {orbitEnabled && (
        <OrbitControls
          enableZoom={false}
          onStart={() => setIsOrbiting(true)}
          onEnd={() => setIsOrbiting(false)}
        />
      )}
      <Cube faces={faces} />
    </>
  );
}

export default function Home() {
  const [activeFaceIndex, setActiveFaceIndex] = useState(0);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div className="d-flex gap-1">
        <button
          onClick={() =>
            setActiveFaceIndex((prev) => (prev + 5) % faces.length)
          }
        >
          Previous
        </button>
        <button
          onClick={() =>
            setActiveFaceIndex(
              (prev) => (prev - 1 + faces.length) % faces.length
            )
          }
        >
          Next
        </button>
      </div>
      <Canvas>
        <Scene activeFaceIndex={activeFaceIndex} />
      </Canvas>
    </div>
  );
}
