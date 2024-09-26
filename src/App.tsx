import "./App.css";
import Home from "./components/home/Home";
import { ProjectProvider } from "./providers/projectProvider";

function App() {
  return (
    <ProjectProvider>
      <Home />
    </ProjectProvider>
  );
}

export default App;
