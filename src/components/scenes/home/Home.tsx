import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Cube from "./cube/Cube";
import Portfolio from "./portfolio/Portfolio";
import Resume from "./resume/Resume";
import Overview from "./overview/Overview";
import Contact from "./contact/Contact";

const faces = [<Contact />, <Resume />, <Portfolio />, <Overview />];

function getNextIndex(curIdx: number) {
  return (curIdx + 1) % faces.length;
}

function getPreviousIndex(curIdx: number) {
  return (curIdx - 1 + faces.length) % faces.length;
}

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div style={{ height: "750px", width: "100vw" }}>
      <div className="d-flex gap-1">
        <button onClick={() => setActiveIndex((idx) => getPreviousIndex(idx))}>
          Previous
        </button>
        <button onClick={() => setActiveIndex((idx) => getNextIndex(idx))}>
          Next
        </button>
      </div>
      <Canvas camera={{ position: [0, 0, -20] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Cube activeIndex={activeIndex} faces={faces} />
      </Canvas>
    </div>
  );
}
