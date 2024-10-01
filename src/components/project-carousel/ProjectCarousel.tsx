import Carousel from "react-bootstrap/Carousel";
import { useProjectContext } from "../../providers/projectProvider";
import { useMemo } from "react";
import "./ProjectCarousel.css";
import { Badge, Button } from "react-bootstrap";
import { FaGithub } from "react-icons/fa";

export default function ProjectCarousel() {
  const { projects } = useProjectContext();

  console.log(projects);

  const slides = useMemo(
    () =>
      [...projects.values()].map((project) => (
        <Carousel.Item
          key={`Carousel.Item_${project.id}`}
          style={{
            background: `url(${project.images.values().next().value})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Carousel.Caption>
            <h3 className="m-0">{project.name}</h3>
            <div>{project.description}</div>
            <div className="d-flex gap-1 flex-wrap justify-content-center">
              <div>Built with:</div>
              {[...project.tags.values()].map((tag) => (
                <Badge key={`tag_${tag}`} bg="secondary">{tag}</Badge>
              ))}
            </div>
            <div className="d-flex gap-2 align-items-center justify-content-center">
              <div>See it on:</div>
              <Button variant="primary" size="sm" className="d-flex gap-1 align-items-center text-white border-0" href={project.url} target="_blank" draggable={false}>
                <FaGithub />
                GitHub
              </Button>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      )),
    [projects]
  );

  return (
    <>
      <div style={{position: "absolute", zIndex: 1, display: "flex", justifyContent: "center", width: "100%", padding: "1rem", color: "white", background: "rgba(0, 0, 0, 0.2)"}}><h1 className="m-0">Featured Projects</h1></div>
      <Carousel interval={3000} draggable={false}>
        {slides}
      </Carousel>
    </>
  );
}
