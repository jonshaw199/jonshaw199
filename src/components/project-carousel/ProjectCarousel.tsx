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
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="d-flex gap-3 align-items-center justify-content-center pb-3">
              <div>See it on:</div>
              <Button variant="ghost" className="d-flex gap-1 align-items-center p-0 border-0 text-white" href={project.url} target="_blank" draggable={false}>
                <FaGithub />
                GitHub
              </Button>
            </div>
            <div className="d-flex gap-1 flex-wrap justify-content-center">
              <div style={{fontSize: "0.9rem"}}>Tech: </div>
              {[...project.tags.values()].map((tag) => (
                <Badge key={`tag_${tag}`} bg="secondary">{tag}</Badge>
              ))}
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      )),
    [projects]
  );

  return (
    <Carousel interval={3000} draggable={false}>
      {slides}
    </Carousel>
  );
}
