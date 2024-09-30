import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ReactNode } from "react";
import { DoubleSide, Euler, Matrix4, Quaternion, Vector3 } from "three";
import LoremIpsum from "../../lorem-ipsum/LoremIpsum";
import ProjectCarousel from "../../project-carousel/ProjectCarousel";
import {
  ProjectContext,
  useProjectContext,
} from "../../../providers/projectProvider";
import AboutMe from "../../about-me/AboutMe";

const globalSpherePosition = new Vector3(0, 0, 0);

function Tile({
  position,
  facePosition = globalSpherePosition,
  width = 600,
  height = 600,
  children,
}: {
  position: Vector3;
  facePosition?: Vector3;
  width?: number;
  height?: number;
  children?: ReactNode;
}) {
  const { projects } = useProjectContext();

  // Calculate rotation to face the camera
  const lookAtMatrix = new Matrix4().lookAt(
    facePosition,
    position,
    new Vector3(0, 1, 0)
  );
  const quaternion = new Quaternion().setFromRotationMatrix(lookAtMatrix);
  const euler = new Euler().setFromQuaternion(quaternion);

  return (
    <Html
      position={position}
      rotation={euler.toArray()}
      transform // Keeps Html components following 3D transformations
      distanceFactor={17}
    >
      <div
        className="tile-content"
        style={{
          backgroundColor: "red",
          width,
          height,
          borderRadius: "25px",
          //padding: "10px",
          //transform: `perspective(100px)`,
          //perspective: "1000px",
          overflow: "auto",
          background: "linear-gradient(to bottom, #f06, #f0f)",
          //backfaceVisibility: "hidden",
          userSelect: "none",
        }}
        draggable={false}
      >
        <ProjectContext.Provider value={{ projects }}>
          {children || <LoremIpsum />}
        </ProjectContext.Provider>
      </div>
    </Html>
  );
}

function Sphere({
  radius = 20,
  children,
}: {
  radius?: number;
  children: ReactNode;
}) {
  return (
    <mesh position={globalSpherePosition}>
      <sphereGeometry args={[radius, 32, 32]} />
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
      {children}
    </mesh>
  );
}

function SceneContent() {
  const distance = 20; // meters between cam and tile

  return (
    <>
      <ambientLight />
      <Sphere>
        <Tile position={new Vector3(0, 0, -distance)}>
          <AboutMe />
        </Tile>
        <Tile
          position={
            new Vector3(
              Math.cos(Math.PI / 4) * distance,
              0,
              -Math.sin(Math.PI / 4) * distance
            )
          }
        >
          <ProjectCarousel />
        </Tile>
        <Tile
          position={
            new Vector3(
              Math.cos(Math.PI / 2) * distance,
              0,
              -Math.sin(Math.PI / 2) * distance
            )
          }
        >
          Contact
        </Tile>
      </Sphere>
      <OrbitControls enableZoom={false} reverseOrbit />
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
