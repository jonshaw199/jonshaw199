import { Button } from 'react-bootstrap';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function AboutMe() {
  return (
    <div
      className="p-3 h-100 d-flex flex-column justify-content-center"
      style={{ color: "whitesmoke", fontSize: 18 }}
    >
      <p>Hi there!</p>
      <p>
        I’m Jon, a dedicated software engineer with a track record of
        delivering impactful solutions across multiple platforms—whether it’s
        web, mobile, or embedded systems. With a focus on quality, performance,
        and user experience, I’ve been fortunate to work on diverse technologies
        that push the boundaries of innovation. Please explore my work, and
        let’s connect if you’d like to collaborate!.
      </p>
        <div className="d-flex gap-4 justify-content-center">
          <Button href="https://linkedin.com/in/jonshaw199" variant="ghost" size="lg" className="p-0"><FaLinkedin color="white" /></Button>
          <Button href="https://github.com/jonshaw199" variant="ghost" size="lg" className="p-0"><FaGithub color="white" /></Button>
        </div>
    </div>
  );
}
