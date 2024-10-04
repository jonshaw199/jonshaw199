import { Vector3 } from "three";

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Utility function to get a random point on the surface of a sphere
export function getRandomPointOnSphere(radius: number) {
  const theta = Math.random() * Math.PI * 2; // Angle around the equator
  const phi = Math.acos(2 * Math.random() - 1); // Angle from the pole

  // Convert spherical coordinates to Cartesian
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);

  return new Vector3(x, y, z);
}

export function getRandomOffset(minOffset: number, maxOffset: number) {
  // Generate a random offset within the specified range
  const range = maxOffset - minOffset;

  return new Vector3(
    (Math.random() - 0.5) * range + Math.sign(Math.random() - 0.5) * minOffset, // Offset in x direction
    (Math.random() - 0.5) * range + Math.sign(Math.random() - 0.5) * minOffset, // Offset in y direction
    (Math.random() - 0.5) * range + Math.sign(Math.random() - 0.5) * minOffset // Offset in z direction
  );
}

export type ShipPositions = {
  src: Vector3;
  dest: Vector3;
};

export function getInitialShipPositions(radius: number): ShipPositions {
  // Anywhere in scene
  const src = new Vector3(
    getRandomArbitrary(-radius, radius),
    getRandomArbitrary(-radius, radius),
    getRandomArbitrary(-radius, radius)
  );

  const dest = src
    .clone()
    .negate()
    .normalize()
    .multiplyScalar(radius)
    .add(getRandomOffset(radius / 4, radius / 2));

  return {
    src,
    dest,
  };
}

export function getResetShipPositions(radius: number): ShipPositions {
  // Anywhere at edge of scene
  const src = getRandomPointOnSphere(radius);

  const dest = src
    .clone()
    .negate()
    .add(getRandomOffset(radius / 4, radius / 2));

  return {
    src,
    dest,
  };
}

export function getUpdateShipPositions({
  curShipPositions,
  shipSpeed,
  maxDistance,
}: {
  curShipPositions: ShipPositions;
  shipSpeed: number;
  maxDistance: number;
}): ShipPositions {
  // Update position
  const curPosition = curShipPositions.src
    .clone()
    .add(curShipPositions.dest.clone().normalize().multiplyScalar(shipSpeed));
  const destPosition = curShipPositions.dest;

  // Reset position if out of bounds
  if (
    Math.abs(curPosition.x) > maxDistance ||
    Math.abs(curPosition.y) > maxDistance ||
    Math.abs(curPosition.z) > maxDistance
  ) {
    return getResetShipPositions(maxDistance);
  }

  return {
    src: curPosition,
    dest: destPosition,
  };
}
