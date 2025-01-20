import { is } from "./utils";


export async function waitFor( object, fn_name ) {
  return new Promise( resolve => {
    object[ fn_name ] = resolve;
  } );
}

export async function waitForCallback( fn, ...args ) {
  return new Promise( resolve => {
    fn( resolve, ...args );       //  Assumes first arg of fn is the callback fn
  } );
}

export function delay( time ) {
  return new Promise( resolve => setTimeout( resolve, time ) );
}


export function waitForEvent( object, event_name, { timeout, remove_on_resolve=true } ) {
  remove_on_resolve = Boolean( remove_on_resolve );
  timeout = is.number( timeout ) && timeout > 0 ?
    timeout :
    Infinity;

  return new Promise( async resolve => {

    let resolved = false;

    const callback = event => {

      if (remove_on_resolve) object.removeEventListener( event_name, callback );

      if (!resolved) resolve( event );

      resolved = true;

    }

    object.addEventListener( event_name, callback, { passive: true } );

    if (timeout == Infinity) return;

    await delay( timeout );

    callback({ type: 'timeout', waiting_for: event_name, waited: timeout });

  } );
}