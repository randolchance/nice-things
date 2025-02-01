import { is } from "./utils";

import { Vector3 } from "three";


const X_AXIS = new Vector3(1,0,0);
const Y_AXIS = new Vector3(0,1,0);
const Z_AXIS = new Vector3(0,0,1);

const AXIS = {
  X: X_AXIS,
  Y: Y_AXIS,
  Z: Z_AXIS,
}


class PointSpace extends Vector3 {

  static validate( potentialPointSpace ) {
    const is_invalid = is.any([
      !potentialPointSpace.isPointSpace,
      !potentialPointSpace.isVector3,
    ]);
    
    if (is_invalid) {

      throw new Error( `Invalid PointSpace! Given: ${ potentialPointSpace }`);

    }
  }

  constructor( ...args ) {
    super( ...args );

  }

  get isPointSpace() {
    return true;
  }

}


export { AXIS, PointSpace }