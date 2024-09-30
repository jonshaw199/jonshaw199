import Carousel from "react-bootstrap/Carousel";
import { useProjectContext } from "../../providers/projectProvider";
import { useMemo } from "react";
import "./ProjectCarousel.css";
import { Badge } from "react-bootstrap";

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
            <div className="d-flex gap-1 flex-wrap justify-content-center">
              {[...project.tags.values()].map((tag) => (
                <Badge key={`tag_${tag}`}>{tag}</Badge>
              ))}
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      )),
    [projects]
  );

  return (
    <Carousel fade interval={3000}>
      {slides}
    </Carousel>
  );
}
