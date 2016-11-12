#!/usr/bin/env node

'use strict';

const tapeTest = require( 'tape' )
  , Expector = require( 'expector' ).SeqExpector
  , flatten = require( '../json-flatten.js' ); 

function test(name, input, regexp, expected, transform) {
  tapeTest( name, (t) => {
    const e = new Expector(t); 
    e.expect( JSON.stringify( expected ) ); 
    flatten( input, regexp, transform )
    .then( (result) => {
      e.emit( result ).check(); 
    })
    .catch( (err) => {
      e.emit( err ); 
    });
  });
}

test( 'single element', { a : 2 }, /a/, 2 );
test( 'single array', { a : [1, 2] }, /a/, [1, 2] ); 
test( 'single object', { a : { b: 2 } }, /a/, { b: 2 } );
test( 'simplest case', { a: { p: 2 } }, /a/, { p: 2 } );
test( 'transform composite', { a: { p: 2 }, p: 1 }, /a/, { p: 2 } );
test( 'composite objects', { a: {p : 3}, q: 2 }, /a/, { p : 3 } );
test( 'nested objects', { a: { a: {p : 3}, q: 2 }, p: 1 }, /a/, { a: {p : 3}, q: 2 } );
test( 'transform', { x: { a: 2 } }, /a/, { x: 2 } );
test( 'more transform', { x: { a: 2 }, y: { a: 3 } }, /a/, { x: 2, y: 3 } );
test( 'more transform two', { x: { a: 2 }, y: { b: 3 } }, /a/, { x: 2 } );
test( 'one more', { x: { a: [3, 2] } }, /a/, { x: [3, 2] } );
test( 'transform again', { a: 1 }, /a/, { a : 1 }, (key, value) => {
  let t = {};
  t[key] = value;
  return t; 
});

test( 'transform with source', 
  { modA: { sources: [1, 2] }, modB: { sources: [3, 4] } }, 
  /sources/, 
  {modA:[ 1, 2 ], modB: [ 3, 4 ] });