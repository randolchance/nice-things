import { is } from "./utils";
import { FORWARD } from "./math2d";

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
    const is_invalid = is.all([
      !potentialPointSpace.isPointSpace,
      !potentialPointSpace.isVector3,
      !potentialPointSpace.isVector2,
      !is.any( [ potentialPointSpace.x, potentialPointSpace.y, potentialPointSpace.z ].map( is.something ) ),
    ]);
    
    if (is_invalid) {

      throw new Error( `Invalid PointSpace! Given: ${ potentialPointSpace }`);

    }
  }

  constructor( ...args ) {
    let x=0, y=0, z=0;
    if (args.length === 1) {

      const [ pointSpace ] = args;
      PointSpace.validate( pointSpace );

      x = is.number( pointSpace.x ) ? pointSpace.x : x;
      y = is.number( pointSpace.y ) ? pointSpace.y : y;
      z = is.number( pointSpace.z ) ? pointSpace.z : z;

    } else {

      x = is.number( args[0] ) ? args[0] : x;
      y = is.number( args[1] ) ? args[1] : y;
      z = is.number( args[2] ) ? args[2] : z;
    }
    super( x, y, z );

  }

  get isPointSpace() {
    return true;
  }

  *spatialComponents( start_index=0, step=FORWARD ) {
    const components = [ this.x, this.y, this.z ].filter( is.number );
    const length = components.length;
    start_index %= length
    for (let index = start_index, count = length; --count >= 0; index = (index + step) % length) {

      yield components.at( index );

    }
  }

}


export { AXIS, PointSpace }