import { FaGithub, FaLinkedin } from "react-icons/fa";

import styles from "./AboutMe.module.css";
import Button from "../button/Button";

export default function AboutMe() {
  return (
    <div
      className="p-3 h-100 d-flex flex-column justify-content-center"
      style={{ color: "whitesmoke", fontSize: 18 }}
    >
      <p>
        Hey there! <span className={styles.wave}>👋</span>
      </p>
      <p>
        I’m Jon, a dedicated software engineer with a track record of delivering
        impactful solutions across multiple platforms—whether it’s web, mobile,
        or embedded systems. With a focus on quality, performance, and user
        experience, I’ve been fortunate to work on diverse technologies that
        push the boundaries of innovation. Please explore my work, and let’s
        connect if you’d like to collaborate!
      </p>
      <div className="d-flex gap-2 align-items-center">
        <div>Find me on: </div>
        <Button
          href="https://linkedin.com/in/jonshaw199"
          className="d-flex gap-1 align-items-center text-white"
          target="_blank"
        >
          <FaLinkedin color="white" />
          LinkedIn
        </Button>
        <Button
          href="https://github.com/jonshaw199"
          className="d-flex gap-1 align-items-center text-white"
          target="_blank"
        >
          <FaGithub color="white" />
          GitHub
        </Button>
      </div>
    </div>
  );
}
