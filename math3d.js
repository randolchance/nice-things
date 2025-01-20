import { is } from "./utils";

import { Vector3 } from "three";


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


export { PointSpace }