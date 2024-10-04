import { PrimitiveProps, useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
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
  TIE_FIGHTER = "tieFighter",
  X_WING = "xWing",
  M_FALCON = "mFalcon",
}

type Model = {
  id: string;
  // Just support gltf/glb for now
  gltfPath: string;
  transformer?: (model: Group<Object3DEventMap>) => Group<Object3DEventMap>;
};

const models: { [id: string]: Model } = {
  [ModelId.CR90]: {
    id: ModelId.CR90,
    gltfPath: "/models/cr90.glb",
    transformer: (model) => {
      model.scale.setScalar(2);
      return model;
    },
  },
  [ModelId.STAR_DESTROYER]: {
    id: ModelId.STAR_DESTROYER,
    gltfPath: "/models/star_destroyer.glb",
    transformer: (model) => {
      model.scale.setScalar(0.08);
      return model;
    },
  },
  [ModelId.SULON_STAR]: {
    id: ModelId.SULON_STAR,
    gltfPath: "/models/sulon_star.glb",
  },
  [ModelId.TIE_FIGHTER]: {
    id: ModelId.TIE_FIGHTER,
    gltfPath: "/models/tie_fighter.glb",
    transformer: (model) => {
      model.scale.setScalar(0.4);
      return model;
    },
  },
  [ModelId.X_WING]: {
    id: ModelId.X_WING,
    gltfPath: "/models/xwing.glb",
    transformer: (model) => {
      model.scale.setScalar(0.06);
      return model;
    },
  },
  [ModelId.M_FALCON]: {
    id: ModelId.M_FALCON,
    gltfPath: "/models/mfalcon.glb",
    transformer: (model) => {
      model.scale.setScalar(0.01);
      return model;
    },
  },
};

/**
 * Preload GLTF assets once using useLoader
 */
function usePreloadGLTFs() {
  const modelArr = useMemo(() => Object.values(models), []);

  const paths = useMemo(
    () => modelArr.map(({ gltfPath }) => gltfPath),
    [modelArr]
  );

  // TODO: consumers need `Suspense`
  const loaded = useLoader(GLTFLoader, paths);

  return useMemo(
    () =>
      loaded.reduce(
        (map: { [id: string]: Group<Object3DEventMap> }, cur, i) => {
          const transformed = modelArr[i].transformer
            ? modelArr[i].transformer!(cur.scene)
            : cur.scene;
          map[modelArr[i].id] = transformed;
          return map;
        },
        {}
      ),
    [loaded, modelArr]
  );
}

const ships: { props: ShipProps; count: number }[] = [
  {
    count: 5,
    props: {
      modelId: ModelId.CR90,
    },
  },
  {
    count: 2,
    props: {
      modelId: ModelId.STAR_DESTROYER,
    },
  },
  {
    count: 10,
    props: {
      modelId: ModelId.TIE_FIGHTER,
    },
  },
  {
    count: 10,
    props: {
      modelId: ModelId.X_WING,
    },
  },
  {
    count: 3,
    props: {
      modelId: ModelId.M_FALCON,
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
