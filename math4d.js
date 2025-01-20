import { is } from "./utils";

import { PointSpace } from "./math3d";


class PointSpaceTime extends PointSpace {

  static validate( potentialPointSpaceTime ) {
    const is_invalid = is.any([
      !potentialPointSpaceTime.isPointSpaceTime,
      !potentialPointSpaceTime.isPointSpace,
      !potentialPointSpaceTime.isVector3,
    ]);
    if (is_invalid) {

      throw new Error( `Invalid PointSpaceTime! Given: ${ potentialPointSpaceTime }`);

    }
  }

  constructor( t=0, ...args ) {
    let x=0, y=0, z=0;
    if (args.length === 1) {

      const pointSpace = args[0];
      PointSpace.validate( pointSpace );

      x = pointSpace.x;
      y = pointSpace.y;
      z = pointSpace.z;

    } else {

      x = args[0];
      y = args[1];
      z = args[2];

    }
    super( x, y, z );

    this._t = t;

  }

  get isPointSpaceTime() {
    return true;
  }

  get t() {
    return this._t;
  }

  set t( new_t ) {

    this._t = new_t;

  }

  add( point ) {
    PointSpaceTime.validate( point );
    
    super.add( point );

    this.t += is.number( point.t ) ? point.t : 0;

    return this;
  }

}


export { PointSpaceTime }