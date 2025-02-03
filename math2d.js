import { Vector2, Vector3 } from 'three';

import { is, Range } from './utils';

const { atan2, PI } = Math;

export const TAU = 2 * PI;

export const ABSOLUTE_RANGE_DEGREES = new Range( 0, 360 );
export const RELATIVE_RANGE_DEGREES = new Range( -180, 180 );

export const PHI_RANGE = new Range( 0, TAU );

export const THETA_RANGE = new Range( 0, PI );

export const ABSOLUTE_RANGE_RADIANS = PHI_RANGE;
export const RELATIVE_RANGE_RADIANS = new Range( -PI, PI );

export const COUNTER_CLOCKWISE = 1;
export const CLOCKWISE = -COUNTER_CLOCKWISE;

export const FORWARD = COUNTER_CLOCKWISE;
export const BACKWARD = -FORWARD;

export const RANGES = {
  absolute: {
    degrees: ABSOLUTE_RANGE_DEGREES,
    radians: ABSOLUTE_RANGE_RADIANS,
  },
  relative: {
    degrees: RELATIVE_RANGE_DEGREES,
    radians: RELATIVE_RANGE_RADIANS,
  }
}

export const DEFAULT_UP = new Vector3(0,0,1);

export const RAD_TO_DEG = 180 / PI;
export const DEG_TO_RAD = PI / 180;

export function degToRad( deg ) {
  return DEG_TO_RAD * deg;
}

export function radToDeg( rad ) {
  return RAD_TO_DEG * rad;
}

export function birdsEyeAngle( vector, up=DEFAULT_UP ) {
  const flat = vector.clone();
  flat.y = 0;
  const abs = flat.angleTo( up );
  return flat.x < 0 ? abs : TAU - abs;
}

export function tiltAngle( obj, up=DEFAULT_UP ) {
  const down = up.negate();
  const forward = new Vector3();
  obj.getWorldDirection( forward );
  return forward.angleTo( down );
}

export function headingAngle( obj ) {
  const forward = new Vector3();
  obj.getWorldDirection( forward );
  return birdsEyeAngle( forward );
}

export function normalise( value, range=null ) {
  if (is.nothing( range )) return value;

  switch (true) {
    case value >= range.max:
      value -= range.size;
      break;
    case value < range.min:
      value += range.size;
      break;
  }

  return value;
}

export function normaliseAngle( angle ) {
  return normalise( angle, ABSOLUTE_RANGE_DEGREES );
}

/**
 * Converts a Vector2 or Vector3 to an angle.
 * @param { Vector2 | Vector3 } vector - Vector2 or Vector3 instance to convert to angle
 * @param { Boolean } [normalise=true] - A boolean to swap the returned bounds from relative to absolute
 * @returns { Number } 
 */
export function vectorToAngle( vector, normalise=true ) {

  let angle;
  switch(true) {
    case vector instanceof Vector2:
      angle = radToDeg( atan2( vector.y, vector.x ) );
    case vector instanceof Vector3:
      angle = radToDeg( atan2( vector.z, vector.x ) );
  }

  return normalise ? normaliseAngle( angle ) : angle;
}

export function geoOrientation( obj ) {
  return {
    tilt: radToDeg( tiltAngle( obj ) ),
    heading: radToDeg( headingAngle( obj ) ),
  };
}