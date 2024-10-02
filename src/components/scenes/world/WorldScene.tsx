import {
  Html,
  OrbitControls,
  Stars,
  Text3D,
  useMatcapTexture,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ReactNode, useMemo, useState } from "react";
import { DoubleSide, Euler, Matrix4, Quaternion, Vector3 } from "three";
import LoremIpsum from "../../lorem-ipsum/LoremIpsum";
import ProjectCarousel from "../../project-carousel/ProjectCarousel";
import {
  ProjectContext,
  useProjectContext,
} from "../../../providers/projectProvider";
import AboutMe from "../../about-me/AboutMe";
import Contact from "../../contact/Contact";
import Ships from "../../ships/Ships";

const globalSpherePosition = new Vector3(0, 0, 0);
const sphereRadius = 500;
const tileRadius = 45;
const distanceFactor = 42;
const maxCameraDistance = sphereRadius / 2;

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
    position: getObjectPosition({ theta: angles.west, radius: tileRadius }),
    children: <Contact />,
  },
};

const namePosition = new Vector3(-28.5, 15, -50);
const titlePosition = new Vector3(-23, 10, -50);

function Tile({
  position,
  facePosition = globalSpherePosition,
  width = 600,
  height = 600,
  children = <LoremIpsum />,
}: TileProps) {
  const { projects } = useProjectContext();

  const euler = useMemo(() => {
    const lookAtMatrix = new Matrix4().lookAt(
      facePosition,
      position,
      new Vector3(0, 1, 0)
    );
    const quaternion = new Quaternion().setFromRotationMatrix(lookAtMatrix);
    return new Euler().setFromQuaternion(quaternion).toArray();
  }, [facePosition, position]);

  return (
    <Html
      position={position}
      rotation={euler}
      transform // Keeps Html components following 3D transformations
      distanceFactor={distanceFactor}
      scale={0.5}
    >
      <div
        className="tile-content"
        style={{
          backgroundColor: "red",
          width,
          height,
          borderRadius: "25px",
          overflow: "auto",
          background: "linear-gradient(to bottom, #f06, #f0f)",
          userSelect: "none",
          transform: "scale(2)",
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
  /*
    There is a bug where the `Html` component doesn't show on first render; it
    does show after moving the camera, resizing the page, etc.; to fix this, we
    wait to render children until after the parent has been rendered
  */
  const [renderChildren, setRenderChildren] = useState(false);

  return (
    <mesh
      position={globalSpherePosition}
      onAfterRender={() => setRenderChildren(true)}
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshPhysicalMaterial
        color="black"
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
      {renderChildren && children}
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
        <Text3D position={namePosition} scale={8} font={"/gt.json"}>
          Jon Shaw
          <meshMatcapMaterial color="white" matcap={matcapTexture} />
        </Text3D>
        <Text3D position={titlePosition} scale={3} font={"/gt.json"}>
          Software Engineer
          <meshMatcapMaterial color="white" matcap={matcapTexture} />
        </Text3D>
      </Sphere>
      <Ships />
      <OrbitControls reverseOrbit />
      <Stars
        radius={50} // Radius of the sphere where stars are placed
        depth={50} // Star field depth
        count={3000} // Number of stars
        fade={true} // Fades stars based on camera position
      />
    </>
  );
}

export default function WorldScene() {
  return (
    <Canvas style={{ zIndex: 0 }}>
      <SceneContent />
    </Canvas>
  );
}
