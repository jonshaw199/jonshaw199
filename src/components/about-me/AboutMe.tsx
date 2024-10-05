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
        <strong>I’m Jon, a software engineer based in California.</strong> I’m
        passionate about pushing the boundaries of innovation and solving
        real-world challenges. I specialize in delivering impactful software
        solutions across various platforms including web, mobile, and embedded
        systems.
      </p>
      <p>
        Feel free to explore my site, check out my featured projects, and reach
        out if you’re interested in collaborating!
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
