import "./App.css";
import Home from "./components/scenes/home/Home";
import { ProjectProvider } from "./providers/projectProvider";
import Carousel from "./components/scenes/home/portfolio/Carousel";

function App() {
  return (
    <ProjectProvider>
      <Home />
    </ProjectProvider>
  );
}

export default App;
