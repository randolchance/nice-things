const { abs, pow, floor, random, max, min } = Math;

export const DEFAULT_PRECISION = 5;

export const EPSILON = order => pow( 10, -order );


export function is_object( object ) {
  return typeof object === 'object' && !is_array( object );
}

export function is_function( object ) {
  return typeof object === 'object' && !is_array( object );
}

export function is_string( string ) {
  return typeof string === 'string';
}

export function is_number( number ) {
  return typeof number === 'number' && !isNaN( number );
}

export function is_boolean( boolean ) {
  return typeof boolean === 'boolean';
}

export function is_array( array ) {
  return Array.isArray( array );
}

export function is_null( object ) {
  return object === null;
}

export function is_defined( object ) {
  return object !== undefined;
}

export function is_nothing( object ) {
  return !is_defined( object ) || is_null( object );
}

export function is_something( object ) {
  return !is_nothing( object );
}

export function is_empty_object( object ) {
  return Object.keys( object ).length === 0;
}
  
export function is_empty_string( string ) {
  return string.length === 0;
}

export function is_empty_array( array ) {
  return array.length === 0;
}


export function is_empty( object ) {

  switch (true) {
    case is_object( object ):
      return is_empty_object( object );

    case is_string( object ):
      return is_empty_string( object );

    case is_array( object ):
      return is_empty_array( object );

    case is_number( object ):
      return object !== 0;

    case is_boolean( object ):
      return object;
      
    case is_function( object ):
      throw new TypeError( `Passed a function to is.empty! ...What?` );

    case is_nothing( object ):
    default:
      throw new TypeError( `Passed nothing to is.empty!` );
  }

}



export function is_near( value1, value2, epsilon=EPSILON( DEFAULT_PRECISION ) ) {
  return abs( value2 - value1 ) <= epsilon;
}



export function any( ...args ) {
  if (is_nothing( args )) return false;

  return args.flat(Infinity).some( Boolean );
}

export function all( ...args ) {
  if (is_nothing( args )) return false;

  return args.flat(Infinity).every( Boolean );
}


export const is = {
  near: is_near,
  object: is_object,
  function: is_function,
  string: is_string,
  number: is_number,
  boolean: is_boolean,
  array: is_array,
  null: is_null,
  defined: is_defined,
  nothing: is_nothing,
  something: is_something,

  empty: is_empty,

  any,
  all,

}

export function intToHexString( number, digits=8 ) {
  return number.toString(16).padStart( digits, '0' );
}

export function makeUrlString( url ) {
  return `url('${ url }')`;
}


export class Range {

  static lerp = new Range();

  static *through( number_of_divisions, params={} ) {
    number_of_divisions = abs( number_of_divisions );

    const { in_reverse, exclude_first, include_last } = params;
    const is_forward = !in_reverse;

    const start_step = exclude_first ? 1 : 0;
    const end_step = number_of_divisions;

    for (let step = start_step; step <= end_step; step++) {
      if (exclude_first && step === 0 || !include_last && step === number_of_divisions) continue;

      const u = (is_forward ? step : number_of_divisions - step) / number_of_divisions;
      yield u;
    }
  }

  constructor( minimum=0, maximum=1 ) {
    this.min = minimum;
    this.max = maximum;
  }

  get size() {
    return this.max - this.min;
  }

  getRelativeTo( size ) {
    return size / this.size;
  }

  getAlpha( value ) {
    return this.getRelativeTo( value );
  }

  getClampedAlpha( value ) {
    return Range.lerp.clamp( this.getAlpha( value ) );
  }

  lerp( alpha ) {
    return this.min + this.size * alpha;
  }

  clamp( value ) {
    return min( this.max, max( value, this.min ) );
  }

  contains( value ) {
    return value >= this.min && value <= this.max;
  }

  *through( number_of_divisions, params ) {
    yield* Range.through( number_of_divisions, params ).map( u => this.lerp( u ) );
  }

}


export class Cooldown {
  constructor( time=0 ) {
    
    this.time = time;
    this._cooldownTimer = null;

    this._is_started = false;
    this._is_done = false;

  }

  get isNew() {
    return !this._is_started && !this._is_done;
  }

  get isCooling() {
    return this._is_started;
  }

  get isDone() {
    return this._is_done;
  }

  get isStarted() {
    return this._is_started;
  }

  // Surely this is frowned upon, but it keeps them read-only functions
  get _startCooldown() {

    this._is_started = true;
    this._is_done = false;

    if (this.onCooldownStart) this.onCooldownStart();

  }

  // Surely this is frowned upon, but it keeps them read-only functions
  get _endCooldown() {

    this._cooldownTimer = null;
    
    this._is_started = false;
    this._is_done = true;

    if (this.onCooldownEnd) this.onCooldownEnd();

  }

  startCooldown() {

    this.resetCooldown();

  }

  resetCooldown() {

    if (this.isStarted) this.stopCooldown();
    
    this._cooldownTimer = setTimeout( () => this.stopCooldown(), this.time );

    this._startCooldown;

  }

  stopCooldown() {

    clearTimeout( this._cooldownTimer );
    
    this._endCooldown;

  }

  onCooldownStart() {}

  onCooldownEnd() {}
  
}


const DEFAULT_ITERATIONS = 3;   // This is the minimum needed to get a normal curve
const DEFAULT_SAMPLES = 100;

const CACHED_DISTRIBUTIONS = new Map();

export class Gaussian {

  static get cache() {
    return CACHED_DISTRIBUTIONS;
  }

  /**
   * Create an instance of a Gaussian distribution
   * @param { Number } [ iterations=DEFAULT_ITERATIONS ] - Number of coin flips / dice rolls / etc.
   * @param { Number } [ samples=DEFAULT_SAMPLES ] - Number of slots in the histogram / distribution
   */
  constructor( iterations=DEFAULT_ITERATIONS, samples=DEFAULT_SAMPLES ) {
    this.iterations = iterations;
    this.samples = samples;

    const key = `n: ${ iterations },  ${ samples }`;
    this._key = key;

    let cache = CACHED_DISTRIBUTIONS.get( key );
    if (!cache) {

      cache = new Map();

      CACHED_DISTRIBUTIONS.set( key, cache );

    }
    
    this._cache = cache;

  }

  get cache() {
    return this._cache;
  }

  /**
   * Generate a random number
   * @param { Number } [scale=1] - A scale factor
   * @returns { Number } - A normally distributed value in the range [0,scale)
   */
  random( scale=1 ) {
    let result = 0;
    for (let i=0; i<this.iterations; i++) result += random();
    return scale * result / this.iterations;
  }

  /**
   * Randomly generate a number within a range according to the distribution
   *  generated by this.iterations
   * @param { Number } [maximum=1] - Distribution maximum
   * @param { Number } [minimum=0] - Distribution minimum
   * @returns { Number } - A number normally distributed between maximum and minimum
   */
  randomRange( maximum=1, minimum=0 ) {
    return minimum + this.random( maximum - minimum );
  }

  getDistribution( width, height=1, fresh=false, do_cache=true ) {
    if (width <= 1) throw new RangeError( `${ width } is too small! It should be an integer over 1.` );

    // Return the cached distribution unless flagged to create a fresh one
    const cache_key = `${ width }x${ height }`;
    const cache = this._cache.get( cache_key );
    if (!fresh && cache) return cache;

    // Initialise empty count array
    const distribution = new Array( width ).fill( 0 );

    // Populate the histogram
    let maximum = 0;
    for (const _ of Range.lerp.through( this.samples )) {
      const slot_index = floor( width * this.random() );
      const count = ++distribution[ slot_index ];
      if (count > maximum) maximum = count;
    }

    // Scale the histogram by the height
    const scaled_distribution = distribution.map( count => height * count / maximum );

    // Cache the histogram
    if (do_cache) this._cache.set( cache_key, scaled_distribution );

    return scaled_distribution;
  }
  
}