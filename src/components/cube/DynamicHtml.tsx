import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Mesh, Box3, Vector3 } from "three";

const DynamicHtml: React.FC<{
  meshRef: React.RefObject<Mesh>;
  children: React.ReactNode;
}> = ({ meshRef, children }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (meshRef.current) {
      const bbox = new Box3().setFromObject(meshRef.current);
      const size = bbox.getSize(new Vector3());

      // Calculate a scale factor based on the size of the object
      const scaleFactor = 1 / Math.max(size.x, size.y, size.z);
      setScale(scaleFactor);
    }
  }, [meshRef]);

  return (
    <Html transform distanceFactor={1}>
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </Html>
  );
};

export default DynamicHtml;
