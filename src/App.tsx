import { useEffect, useState } from "react";
import "./App.css";
import WorldScene from "./components/scenes/world/WorldScene";
import { ProjectProvider } from "./providers/projectProvider";
import _Loading from "./components/loading/Loading";

const loadingTimeMs = 5000;

function Loading() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "black",
        zIndex: 1,
      }}
    >
      <_Loading />
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
