import React, { ReactNode } from "react";
import styles from "./Fade.module.css";

const Fade = ({ show, children }: { show: boolean; children: ReactNode }) => {
  return show && <div className={styles.fade}>{children}</div>;
};

export default Fade;
