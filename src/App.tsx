import "./App.css";
import WorldScene from "./components/scenes/world/WorldScene";
import { ProjectProvider } from "./providers/projectProvider";

function App() {
  return (
    <ProjectProvider>
      <WorldScene />
    </ProjectProvider>
  );
}

export default App;
