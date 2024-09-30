import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { ReactNode, useMemo } from "react";
import { DoubleSide, Euler, Matrix4, Quaternion, Vector3 } from "three";

// Helper function to convert spherical coordinates to Cartesian
const sphericalToCartesian = (radius: number, theta: number, phi: number) => {
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new Vector3(x, y, z);
};

function Sphere({
  sphereRadius = 10,
  hoverOffset = 0.1,
  globalPosition = new Vector3(0, 0, 0),
}: {
  sphereRadius?: number;
  hoverOffset?: number;
  globalPosition?: Vector3;
}) {
  const tileRadius = useMemo(
    () => sphereRadius - hoverOffset,
    [sphereRadius, hoverOffset]
  );

  // Generating random tile positions on the surface of the sphere
  const tiles = useMemo(() => {
    return Array.from({ length: 25 }, (_, index) => {
      const theta = (index / 10) * Math.PI * 2; // longitude
      const phi = Math.random() * Math.PI; // latitude
      const position = sphericalToCartesian(tileRadius, theta, phi);
      return position;
    });
  }, [tileRadius]);

  return (
    <mesh position={globalPosition}>
      <sphereGeometry args={[sphereRadius, 32, 32]} />
      <meshPhysicalMaterial
        color="lightblue"
        //transmission={0.9} // Glass-like transparency
        //transparent={true}
        //opacity={0.5} // Adjust opacity
        //reflectivity={0.7} // Reflective surface
        thickness={1} // Controls thickness for refraction effects
        //roughness={0.1}
        //metalness={0.1}
        side={DoubleSide} // Show inside of the sphere
        //vertexColors={true} // Enable gradient or color variation
      />
      {/* Loop through tile positions and render Html at those positions */}
      {tiles.map((position, index) => {
        // Calculate rotation to face the camera
        const lookAtMatrix = new Matrix4().lookAt(
          globalPosition,
          position,
          new Vector3(0, 1, 0)
        );
        const quaternion = new Quaternion().setFromRotationMatrix(lookAtMatrix);
        const euler = new Euler().setFromQuaternion(quaternion);

        return (
          <Html
            key={index}
            position={position}
            rotation={euler.toArray()}
            transform // Keeps Html components following 3D transformations
          >
            <div
              className="tile-content"
              style={{
                backgroundColor: "red",
              }}
            >
              <h1>Tile {index + 1}</h1>
            </div>
          </Html>
        );
      })}
    </mesh>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight />
      <Sphere />
      <OrbitControls enablePan={true} enableZoom={true} />
    </>
  );
}

export default function WorldScene() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Canvas>
        <SceneContent />
      </Canvas>
    </div>
  );
}
