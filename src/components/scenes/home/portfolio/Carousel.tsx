import _Carousel from "react-bootstrap/Carousel";
import { useProjectContext } from "../../../../providers/projectProvider";
import { useMemo } from "react";
import "./Carousel.css";

export default function Carousel() {
  const { projects } = useProjectContext();

  const slides = useMemo(
    () =>
      [...projects.values()].map((project) => (
        <_Carousel.Item
          interval={1000}
          key={`Carousel.Item_${project.id}`}
          style={{
            background: `url(${project.images.values().next().value})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <_Carousel.Caption>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </_Carousel.Caption>
        </_Carousel.Item>
      )),
    [projects]
  );

  return <_Carousel fade>{slides}</_Carousel>;
}
