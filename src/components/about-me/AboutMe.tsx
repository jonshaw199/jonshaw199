import { Button } from 'react-bootstrap';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

import styles from "./AboutMe.module.css"

export default function AboutMe() {
  return (
    <div
      className="p-3 h-100 d-flex flex-column justify-content-center"
      style={{ color: "whitesmoke", fontSize: 18 }}
    >
      <p>Hey there! <span className={styles.wave}>👋</span></p>
      <p>
        I’m Jon, a dedicated software engineer with a track record of
        delivering impactful solutions across multiple platforms—whether it’s
        web, mobile, or embedded systems. With a focus on quality, performance,
        and user experience, I’ve been fortunate to work on diverse technologies
        that push the boundaries of innovation. Please explore my work, and
        let’s connect if you’d like to collaborate!
      </p>
        <div className="d-flex gap-2 align-items-center">
          <div>Find me on: </div>
          <Button draggable={false} href="https://linkedin.com/in/jonshaw199" target="_blank" variant="primary" className="border-0 align-items-center d-flex gap-1 text-white"><FaLinkedin color="white" />LinkedIn</Button>
          <Button draggable={false} href="https://github.com/jonshaw199" target="_blank" variant="primary" className="border-0 d-flex align-items-center gap-1 text-white"><FaGithub color="white" />GitHub</Button>
        </div>
    </div>
  );
}
