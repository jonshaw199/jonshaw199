import { PrimitiveProps, useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Object3DEventMap } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import {
  getInitialShipPositions,
  getRandomArbitrary,
  getUpdateShipPositions,
} from "./shipUtils";

const sceneBounds = 250;
const shipSpeedRange = [0.05, 1];

enum ModelId {
  CR90 = "cr90",
  STAR_DESTROYER = "starDestroyer",
  SULON_STAR = "sulonStar",
}

type Model = {
  id: string;
  // Just support gltf/glb for now
  gltfPath: string;
};

const models: { [id: string]: Model } = {
  [ModelId.CR90]: {
    id: ModelId.CR90,
    gltfPath: "/models/cr90.glb",
  },
  [ModelId.STAR_DESTROYER]: {
    id: ModelId.STAR_DESTROYER,
    gltfPath: "/models/imperial_star_destroyer_mark_i/scene.gltf",
  },
  [ModelId.SULON_STAR]: {
    id: ModelId.SULON_STAR,
    gltfPath: "/models/sulon_star.glb",
  },
};

/**
 * Preload GLTF assets once using useLoader
 */
function usePreloadGLTFs() {
  return Object.values(models).reduce(
    (map: { [id: string]: Group<Object3DEventMap> }, { gltfPath, id }) => {
      map[id] = useLoader(GLTFLoader, gltfPath).scene;
      return map;
    },
    {}
  );
}

const ships: { props: ShipProps; count: number }[] = [
  {
    count: 10,
    props: {
      modelId: ModelId.CR90,
      scale: 2,
    },
  },
  {
    count: 2,
    props: {
      modelId: ModelId.STAR_DESTROYER,
      scale: 0.04,
    },
  },
  {
    count: 10,
    props: {
      modelId: ModelId.SULON_STAR,
      scale: 0.005,
    },
  },
];

type ShipProps = Partial<PrimitiveProps> & {
  speed?: number;
  modelId?: string;
  sceneBounds?: number;
};

// Ship component to render the ship model and handle its own position updates
function Ship({
  speed = getRandomArbitrary(shipSpeedRange[0], shipSpeedRange[1]),
  modelId = ModelId.CR90,
  sceneBounds = 100,
  ...rest
}: ShipProps) {
  const shipRef = useRef<any>();
  const positionsRef = useRef(getInitialShipPositions(sceneBounds));
  const models = usePreloadGLTFs();

  useFrame(() => {
    const newPos = getUpdateShipPositions({
      curShipPositions: positionsRef.current,
      maxDistance: sceneBounds,
      shipSpeed: speed,
    });

    positionsRef.current.src.copy(newPos.src);
    positionsRef.current.dest.copy(newPos.dest);

    // Apply new position to ship
    shipRef.current.position.copy(newPos.src);
    shipRef.current.lookAt(newPos.dest);
  });

  console.log(models);
  return <primitive ref={shipRef} {...rest} object={models[modelId].clone()} />;
}

// Ships component that initializes the ships and renders them
export default function Ships() {
  const _ships = ships.reduce((arr: ShipProps[], { count, props }) => {
    return [
      ...arr,
      ...Array(count)
        .fill(null)
        .map(() => props),
    ];
  }, []);

  return (
    <>
      {_ships.map((props, i) => (
        <Ship key={`Ship_${i}`} sceneBounds={sceneBounds} {...props} />
      ))}
    </>
  );
}
