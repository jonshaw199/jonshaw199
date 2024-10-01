import {
  Html,
  OrbitControls,
  Text3D,
  useMatcapTexture,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ReactNode, useMemo } from "react";
import { DoubleSide, Euler, Matrix4, Quaternion, Vector3 } from "three";
import LoremIpsum from "../../lorem-ipsum/LoremIpsum";
import ProjectCarousel from "../../project-carousel/ProjectCarousel";
import {
  ProjectContext,
  useProjectContext,
} from "../../../providers/projectProvider";
import AboutMe from "../../about-me/AboutMe";
import Contact from "../../contact/Contact";

const globalSpherePosition = new Vector3(0, 0, 0);
const sphereRadius = 25;
const tileRadius = 45;
const distanceFactor = 45;

type TileProps = {
  id: string;
  position: Vector3;
  width?: number;
  height?: number;
  facePosition?: Vector3;
  children?: ReactNode;
};

function getObjectPosition({
  theta,
  radius,
  yOffset = 0,
}: {
  theta: number;
  radius: number;
  yOffset?: number;
}) {
  const x = radius * Math.cos(theta);
  const z = radius * Math.sin(theta); // Central tile at z = -1
  return new Vector3(x, yOffset, z); // Keep y = 0 (assuming a flat plane)
}

// Define the angles for each direction (in radians)
const angles = {
  east: 0, // 0 radians (0°)
  northeast: Math.PI / 4, // π/4 radians (45°)
  north: Math.PI / 2, // π/2 radians (90°)
  northwest: (3 * Math.PI) / 4, // 3π/4 radians (135°)
  west: Math.PI, // π radians (180°)
  southwest: (5 * Math.PI) / 4, // 5π/4 radians (225°)
  south: (3 * Math.PI) / 2, // 3π/2 radians (270°)
  southeast: (7 * Math.PI) / 4, // 7π/4 radians (315°)
};

const tiles: { [id: string]: TileProps } = {
  about: {
    id: "about",
    position: getObjectPosition({
      theta: angles.south,
      radius: tileRadius,
      yOffset: -10,
    }),
    children: <AboutMe />,
    height: 300,
  },
  projects: {
    id: "projects",
    position: getObjectPosition({ theta: angles.east, radius: tileRadius }),
    children: <ProjectCarousel />,
  },
  contact: {
    id: "contact",
    position: getObjectPosition({ theta: angles.north, radius: tileRadius }),
    children: <Contact />,
  },
};

const namePosition = new Vector3(-10, 7, -15);
const titlePosition = new Vector3(-10, 4.75, -15);

function Tile({
  position,
  facePosition = globalSpherePosition,
  width = 600,
  height = 600,
  children = <LoremIpsum />,
}: TileProps) {
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
      distanceFactor={distanceFactor}
    >
      <div
        className="tile-content"
        style={{
          backgroundColor: "red",
          width,
          height,
          borderRadius: "25px",
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
          {children}
        </ProjectContext.Provider>
      </div>
    </Html>
  );
}

function Sphere({
  radius = sphereRadius,
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
  const [matcapTexture] = useMatcapTexture("CB4E88_F99AD6_F384C3_ED75B9");

  return (
    <>
      <ambientLight />
      <Sphere>
        {Object.values(tiles).map((tileProps) => (
          <Tile {...tileProps} key={tileProps.id} />
        ))}
        <Text3D position={namePosition} scale={2.8} font={"/gt.json"}>
          Jon Shaw
          <meshMatcapMaterial color="white" matcap={matcapTexture} />
        </Text3D>
        <Text3D position={titlePosition} scale={1.3} font={"/gt.json"}>
          Software Engineer
          <meshMatcapMaterial color="white" matcap={matcapTexture} />
        </Text3D>
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
