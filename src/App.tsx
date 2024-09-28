import "./App.css";
import Home from "./components/scenes/home2/Home";
import { ProjectProvider } from "./providers/projectProvider";

function App() {
  return (
    <ProjectProvider>
      <Home />
    </ProjectProvider>
  );
}

export default App;
