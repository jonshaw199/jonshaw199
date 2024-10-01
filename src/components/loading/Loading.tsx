import { PulseLoader, RingLoader } from "react-spinners";

import styles from "./Loading.module.css";

/* HTML: <div class="loader"></div>
.loader {
    width: 60px;
    aspect-ratio: 4;
    background: radial-gradient(circle closest-side,#000 90%,#0000) 0/calc(100%/3) 100% space;
    clip-path: inset(0 100% 0 0);
    animation: l1 1s steps(4) infinite;
  }
  @keyframes l1 {to{clip-path: inset(0 -34% 0 0)}}
*/

export default function Loading() {
  return (
    <div className="d-flex flex-column gap-3 justify-content-center align-items-center w-100 h-100">
      <RingLoader color="#f0f" size={150} />
      <div className="d-flex">
        <div
          style={{
            color: "#f0f",
            fontSize: "20px",
            fontWeight: "bold",
            opacity: 0.75,
          }}
        >
          Loading
        </div>
        <PulseLoader size={3} color="#f0f" style={{ marginTop: "7px" }} />
      </div>
    </div>
  );
}
