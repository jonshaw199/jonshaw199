import { useGLTF } from "@react-three/drei";
import { PrimitiveProps, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";

const sceneBounds = 250;

// Utility functions
function getRandomVector(min = -100, max = 100) {
  return new Vector3(
    Math.random() * (max - min) + min,
    Math.random() * (max - min) + min
  );
}

function getRandomSpeed(min = 0.1, max = 1) {
  return Math.random() * (max - min) + min;
}

function getRandomDirection() {
  return new Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  ).normalize();
}

type ShipProps = Partial<PrimitiveProps> & {
  speed?: number;
  gltfAssetPath?: string;
  sceneBounds?: number;
};

// Ship component to render the ship model and handle its own position updates
function Ship({
  speed = getRandomSpeed(0.05, 0.3),
  gltfAssetPath = "/models/cr90.glb",
  sceneBounds = 100,
  ...rest
}: ShipProps) {
  const { scene } = useGLTF(gltfAssetPath);
  const shipRef = useRef<any>(); // Ref for directly manipulating position

  // Store position and direction in refs for efficient updates
  const positionRef = useRef(getRandomVector(-sceneBounds, sceneBounds));
  const directionRef = useRef(getRandomDirection());

  useFrame(() => {
    // Update position
    const newPosition = positionRef.current
      .clone()
      .add(directionRef.current.clone().multiplyScalar(speed));

    // Reset position if out of bounds
    if (
      Math.abs(newPosition.x) > sceneBounds ||
      Math.abs(newPosition.y) > sceneBounds ||
      Math.abs(newPosition.z) > sceneBounds
    ) {
      positionRef.current = getRandomVector(-sceneBounds, sceneBounds);
      directionRef.current = getRandomDirection();
    } else {
      positionRef.current.copy(newPosition);
    }

    // Apply new position to ship
    if (shipRef.current) {
      shipRef.current.position.copy(positionRef.current);
    }

    // Calculate the ship's rotation to point in the direction of movement
    const targetPosition = positionRef.current
      .clone()
      .add(directionRef.current);
    shipRef.current.lookAt(targetPosition);
  });

  return <primitive ref={shipRef} {...rest} object={scene.clone()} />;
}

type DeathStarProps = {
  position?: [number, number, number]; // Position to place the Death Star
  assetPath?: string; // Path to the GLTF file
  scale?: number; // Optional scale for the model
};

// DeathStar component
export function DeathStar({
  position = [0, 0, 0], // Default position at the origin
  assetPath = "/models/star_wars_death_star/scene.gltf", // Default path for the Death Star GLB
  scale = 1, // Default scale
}: DeathStarProps) {
  const { scene } = useGLTF(assetPath); // Load the GLTF model
  const deathStarRef = useRef<any>(); // Ref for the Death Star

  // Rotate the Death Star slowly around the Y-axis
  useFrame(() => {
    if (deathStarRef.current) {
      deathStarRef.current.rotation.y += 0.001; // Slow Y-axis rotation
    }
  });

  return (
    <primitive
      ref={deathStarRef}
      object={scene}
      position={new Vector3(...position)} // Set the position
      scale={scale} // Adjust the scale
    />
  );
}

const ships: { props: ShipProps; count: number }[] = [
  {
    count: 20,
    props: {
      speed: 0.1,
      gltfAssetPath: "/models/star_wars_laati_gunship/scene.gltf",
    },
  },
  {
    count: 20,
    props: {
      speed: 0.05,
      gltfAssetPath: "/models/cr90.glb",
      scale: 2,
    },
  },
  {
    count: 2,
    props: {
      speed: 0.15,
      gltfAssetPath: "/models/imperial_star_destroyer_mark_i/scene.gltf",
      scale: 0.03,
    },
  },
];

// Ships component that initializes the ships and renders them
export default function Ships() {
  const _ships = ships.reduce((arr: ShipProps[], { count, props }) => {
    return [
      ...arr,
      ...Array(count)
        .fill(null)
        .map(() => props),
    ];
  }, []);

  return (
    <>
      {_ships.map((props, i) => (
        <Ship key={`Ship_${i}`} sceneBounds={sceneBounds} {...props} />
      ))}
    </>
  );
}
