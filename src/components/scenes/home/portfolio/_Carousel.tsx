import _Carousel from "react-bootstrap/Carousel";

export default function Carousel() {
  return (
    <_Carousel fade>
      <_Carousel.Item interval={1000}>
        <img src="test1.jpg" />
        <_Carousel.Caption>
          <h3>Project Name</h3>
          <p>Project Description</p>
        </_Carousel.Caption>
      </_Carousel.Item>
    </_Carousel>
  );
}
