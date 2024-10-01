import { Html, OrbitControls } from "@react-three/drei";
import { HtmlProps } from "@react-three/drei/web/Html";
import { Canvas, MeshProps, useThree } from "@react-three/fiber";
import { ReactNode, useMemo, useRef } from "react";
import LoremIpsum from "./LoremIpsum";

const faceSize = 800;

function Face({ children }: { children: ReactNode }) {
  // Set size using pixels
  return (
    <div
      style={{
        backgroundColor: "red",
        width: `${faceSize}px`,
        height: `${faceSize}px`,
        overflow: "auto",
      }}
    >
      {children}
    </div>
  );
}

function Box({ faces }: { faces: ReactNode[] }) {
  // Ensure exactly 6 faces
  const _faces = useMemo(() => {
    return Array(6)
      .fill(null)
      .map(
        (_, i) =>
          (i < faces.length && faces[i]) || (
            <>
              <LoremIpsum />
            </>
          )
      )
      .map((face, i) => <Face key={`Face_${i}`}>{face}</Face>);
  }, [faces]);

  const commonHtmlProps: HtmlProps = {
    scale: [0.05, 0.05, 0.05],
    occlude: "blending",
    transform: true, // Allows the HTML element to follow 3D transformations
  };

  return (
    <group>
      <Html
        {...commonHtmlProps}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.5, 0]}
      >
        {_faces[0]}
      </Html>
      <Html
        {...commonHtmlProps}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
      >
        {_faces[1]}
      </Html>
      <Html
        {...commonHtmlProps}
        rotation={[0, -Math.PI / 2, 0]}
        position={[-0.5, 0, 0]}
      >
        {_faces[2]}
      </Html>
      <Html
        {...commonHtmlProps}
        rotation={[0, Math.PI / 2, 0]}
        position={[0.5, 0, 0]}
      >
        {_faces[3]}
      </Html>
      <Html {...commonHtmlProps} rotation={[0, 0, 0]} position={[0, 0, 0.5]}>
        {_faces[4]}
      </Html>
      <Html
        {...commonHtmlProps}
        rotation={[0, -Math.PI, 0]}
        position={[0, 0, -0.5]}
      >
        {_faces[5]}
      </Html>
    </group>
  );
}

function Scene() {
  // Get the canvas size and adjust the camera position
  const { size, camera } = useThree();

  // Calculate the appropriate camera position based on the size of the canvas
  // Adjust distance based on the FOV and canvas size to fit the cube
  const distance = 1.5; // Adjust this value to fit the cube perfectly on the screen

  camera.position.set(0, 0, distance);
  camera.updateProjectionMatrix();

  return (
    <>
      {" "}
      <ambientLight />
      <Box faces={[]} />
      <OrbitControls />
    </>
  );
}

export default function Home() {
  return (
    <div className="w-100 h-100">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}
