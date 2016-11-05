#!/usr/bin/env node

'use strict'; 

const test = require( 'tape' )
  , Expector = require( 'expector' ).SeqExpector
  , flatten = require( '../json-flatten.js' );

function testTransform( key, prop ) {
  var t = {};
  t[key] = prop; 
  return t;
}

test( 'simplest case', (t) => {
  const e = new Expector(t)
    , obj = { a: { p: 2 }, p: 1 };
 
  e.expect( JSON.stringify( { p: [ { a: 2 }, 1 ] } ) ); 
  flatten( obj, /a/, testTransform )
  .then( (result) => { 
    e.emit( result ).check(); 
  });
});

test( 'composite objects', (t) => {
  const e = new Expector(t)
    , obj = { a: {p : 3}, q: 2 };
 
  e.expect( JSON.stringify( { p : { a : 3 }, q : 2 } ) );

  flatten( obj, /a/, testTransform )
  .then( (result) => { 
    e.emit( result ).check();
  });
});

test( 'nested objects', (t) => {
  const e = new Expector(t)
    , obj = { a: { a: {p : 3}, q: 2 }, p: 1 };

  e.expect( JSON.stringify( { p: [ { a: { a: 3 } }, 1 ], q: { a: 2 } } ) ); 

  flatten( obj, /a/, testTransform )
  .then( (result) => { 
    e.emit( result ).check();
  });
});

test( 'defaulTransform', (t) => {
  const e = new Expector(t)
    , obj = { a: { p: 2 }, p: 1 };

  e.expect( JSON.stringify( { p: [ 2, 1 ] } ) );

  flatten( obj, /a/)
  .then( (result) => { 
    e.emit( result ).check();
  });
});
