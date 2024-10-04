import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";

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
