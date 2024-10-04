import { Suspense, useEffect, useState } from "react";
import "./App.css";
import WorldScene from "./components/scenes/world/WorldScene";
import { ProjectProvider } from "./providers/projectProvider";
import _Loading from "./components/loading/Loading";
import Fade from "./components/fade/Fade";

function Tip() {
  return (
    <p className="text-white text-center">
      <strong>Tip: </strong>
      Click and drag to move the camera
    </p>
  );
}

function Loading() {
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowTip(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        background: "black",
        zIndex: 1,
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "25vh",
        gap: "10px",
      }}
    >
      <div>
        <_Loading />
      </div>
      <div>
        <Fade show={showTip}>
          <Tip />
        </Fade>
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ height: "100vh", width: "100vw", background: "black" }}>
      <ProjectProvider>
        <Suspense fallback={<Loading />}>
          <WorldScene />
        </Suspense>
      </ProjectProvider>
    </div>
  );
}

export default App;
