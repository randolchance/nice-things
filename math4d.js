import { is } from "./utils";

import { PointSpace } from "./math3d";
import { EventDispatcher } from "three";


class PointSpaceTime extends PointSpace {

  static _dispatcher = new EventDispatcher();

  static update( dt ) {

    this._dispatcher.dispatchEvent({ type: 'update', dt });

  }

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

    PointSpaceTime._dispatcher.addEventListener( 'update', dt => this.t += dt );

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


class MovingPointSpaceTime extends PointSpaceTime {

  constructor( v, ...args ) {
    super( ...args );

    v = v || new PointSpace();
    PointSpace.validate( v );
    if (v.isPointSpaceTime) {

      throw new Error(`Velocity vector is not a static vector (PointSpace or Vector3)!`);

    }

    this._v = v;

  }

  get v() {
    return this._v;
  }

  get t() {
    return this._t;
  }

  set t( new_t ) {
    if (!is.number( new_t )) throw new Error(`Invalid time! Given: ${ new_t }`);

    const dt = new_t - this.t;
    const dv = this.v.clone().multiplyScalar( dt );

    this.add( dv );

    this._t = new_t;

  }

}


class AcceleratingPointSpaceTime extends PointSpaceTime {
  constructor( a, ...args ) {
    super( ...args );

    a = a || new PointSpace();
    PointSpace.validate( a );
    if (a.isPointSpaceTime) {

      throw new Error(`Acceleration vector is not a static vector (PointSpace or Vector3)!`);

    }

    this._a = a;
    
  }

  get v() {
    return this._v;
  }

  get t() {
    return this._t;
  }

  set t( new_t ) {
    if (!is.number( new_t )) throw new Error(`Invalid time! Given: ${ new_t }`);

    const dt = new_t - this.t;

    const dv = this.v.clone().multiplyScalar( dt );
    this.add( dv );

    const da = this.a.clone().multiplyScalar( dt );
    this.v.add( da );

    this._t = new_t;

  }

}


export { PointSpaceTime, MovingPointSpaceTime, AcceleratingPointSpaceTime }