import { useEffect, useState } from "react";
import "./App.css";
import WorldScene from "./components/scenes/world/WorldScene";
import { ProjectProvider } from "./providers/projectProvider";
import _Loading from "./components/loading/Loading";
import Fade from "./components/fade/Fade";

const loadingTimeMs = 5000;

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
    const timeout = setTimeout(() => setShowTip(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        display: "grid",
        gridTemplateRows: "50% 25% 1fr",
        justifyItems: "center",
        width: "100vw",
        height: "100vh",
        background: "black",
        zIndex: 1,
        padding: "1rem",
      }}
    >
      <div style={{ alignSelf: "end" }}>
        <_Loading />
      </div>
      <div style={{ alignSelf: "end" }}>
        <Fade show={showTip}>
          <Tip />
        </Fade>
      </div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, loadingTimeMs);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw", background: "black" }}>
      <ProjectProvider>
        <WorldScene />
        {loading && <Loading />}
      </ProjectProvider>
    </div>
  );
}

export default App;
