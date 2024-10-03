import { Badge } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import { useProjectContext } from "../../providers/projectProvider";
import { useEffect, useMemo } from "react";
import "./ProjectCarousel.css";
import { FaGithub } from "react-icons/fa";
import Button from "../button/Button";

// Prevent "ghost" prev/next buttons when clicking and dragging
// These attributes arent exposed in react
// TODO: look for CSS-only workaround that still allows clicking (button) but not dragging
const disablePrevNextDrag = () => {
  // Disable dragging for the previous/next controls
  const prevControl = document.querySelector(".carousel-control-prev");
  const nextControl = document.querySelector(".carousel-control-next");
  if (prevControl) prevControl.setAttribute("draggable", "false");
  if (nextControl) nextControl.setAttribute("draggable", "false");
};

export default function ProjectCarousel() {
  const { projects } = useProjectContext();

  useEffect(() => {
    disablePrevNextDrag();
  }, []);

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
                <Badge key={`tag_${tag}`} bg="secondary" pill>
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="d-flex gap-2 align-items-center justify-content-center">
              <div>See it on:</div>
              {!!project.githubUrl && (
                <Button
                  size="sm"
                  className="d-flex gap-1 align-items-center text-white"
                  href={project.githubUrl}
                >
                  <FaGithub />
                  GitHub
                </Button>
              )}
              {!!project.liveUrl && (
                <Button
                  size="sm"
                  className="d-flex gap-1 align-items-center text-white"
                  href={project.liveUrl}
                >
                  <img src="stewie.png" height={18} />
                  Live
                </Button>
              )}
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      )),
    [projects]
  );

  return (
    <>
      <div
        style={{
          position: "absolute",
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          width: "100%",
          padding: "1rem",
          color: "white",
          background: "rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1 className="m-0">Featured Projects</h1>
      </div>
      <Carousel interval={3000} draggable={false} fade>
        {slides}
      </Carousel>
    </>
  );
}
