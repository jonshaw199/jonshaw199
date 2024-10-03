import { useEffect, useState } from "react";
import "./App.css";
import WorldScene from "./components/scenes/world/WorldScene";
import { ProjectProvider } from "./providers/projectProvider";
import _Loading from "./components/loading/Loading";
import Fade from "./components/fade/Fade";

const loadingTimeMs = 3000;

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
    const timeout = setTimeout(() => setShowTip(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
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
