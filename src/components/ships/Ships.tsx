import { useGLTF } from "@react-three/drei";
import { PrimitiveProps, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";

const sceneBounds = 250;
const shipSpeedRange = [0.05, 1];

const ships: { props: ShipProps; count: number }[] = [
  {
    count: 10,
    props: {
      gltfAssetPath: "/models/star_wars_laati_gunship/scene.gltf",
      scale: 0.5,
    },
  },
  {
    count: 10,
    props: {
      gltfAssetPath: "/models/cr90.glb",
      scale: 2,
    },
  },
  {
    count: 2,
    props: {
      gltfAssetPath: "/models/imperial_star_destroyer_mark_i/scene.gltf",
      scale: 0.05,
    },
  },
];

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Utility function to get a random point on the surface of a sphere
function getRandomPointOnSphere(radius = sceneBounds) {
  const theta = Math.random() * Math.PI * 2; // Angle around the equator
  const phi = Math.acos(2 * Math.random() - 1); // Angle from the pole

  // Convert spherical coordinates to Cartesian
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);

  return new Vector3(x, y, z);
}

function getRandomOffset(
  minOffset = sceneBounds / 4,
  maxOffset = sceneBounds / 2
) {
  // Generate a random offset within the specified range
  const range = maxOffset - minOffset;

  return new Vector3(
    (Math.random() - 0.5) * range + Math.sign(Math.random() - 0.5) * minOffset, // Offset in x direction
    (Math.random() - 0.5) * range + Math.sign(Math.random() - 0.5) * minOffset, // Offset in y direction
    (Math.random() - 0.5) * range + Math.sign(Math.random() - 0.5) * minOffset // Offset in z direction
  );
}

type ShipPositions = {
  src: Vector3;
  dest: Vector3;
};

function getInitialShipPositions(): ShipPositions {
  // Anywhere in scene
  const src = new Vector3(
    getRandomArbitrary(-sceneBounds, sceneBounds),
    getRandomArbitrary(-sceneBounds, sceneBounds),
    getRandomArbitrary(-sceneBounds, sceneBounds)
  );

  const dest = src
    .clone()
    .negate()
    .normalize()
    .multiplyScalar(sceneBounds)
    .add(getRandomOffset());

  return {
    src,
    dest,
  };
}

function getResetShipPositions(): ShipPositions {
  // Anywhere at edge of scene
  const src = getRandomPointOnSphere();

  const dest = src.clone().negate().add(getRandomOffset());

  return {
    src,
    dest,
  };
}

function getUpdateShipPositions({
  curShipPositions,
  shipSpeed,
  maxDistance,
}: {
  curShipPositions: ShipPositions;
  shipSpeed: number;
  maxDistance: number;
}): ShipPositions {
  // Update position
  const curPosition = curShipPositions.src
    .clone()
    .add(curShipPositions.dest.clone().normalize().multiplyScalar(shipSpeed));
  const destPosition = curShipPositions.dest;

  // Reset position if out of bounds
  if (
    Math.abs(curPosition.x) > maxDistance ||
    Math.abs(curPosition.y) > maxDistance ||
    Math.abs(curPosition.z) > maxDistance
  ) {
    return getResetShipPositions();
  }

  return {
    src: curPosition,
    dest: destPosition,
  };
}

type ShipProps = Partial<PrimitiveProps> & {
  speed?: number;
  gltfAssetPath?: string;
  sceneBounds?: number;
};

// Ship component to render the ship model and handle its own position updates
function Ship({
  speed = getRandomArbitrary(shipSpeedRange[0], shipSpeedRange[1]),
  gltfAssetPath = "/models/cr90.glb",
  sceneBounds = 100,
  ...rest
}: ShipProps) {
  const { scene } = useGLTF(gltfAssetPath);
  const shipRef = useRef<any>();
  const positionsRef = useRef(getInitialShipPositions());

  useFrame(() => {
    const newPos = getUpdateShipPositions({
      curShipPositions: positionsRef.current,
      maxDistance: sceneBounds,
      shipSpeed: speed,
    });

    positionsRef.current.src.copy(newPos.src);
    positionsRef.current.dest.copy(newPos.dest);

    // Apply new position to ship
    shipRef.current.position.copy(newPos.src);
    shipRef.current.lookAt(newPos.dest);
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
