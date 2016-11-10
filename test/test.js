#!/usr/bin/env node

/*
{ a: [ 1, 2 ] } => { a: [ 1, 2 ] }   
{ a: { a: 2 } } => { a: { a: 2 } }
{ q: { a: 1 }, p: { a: 2 } } => a: [ {q : 1}, {p: 2} ]
*/ 

'use strict';

const test = require( 'tape' )
  , Expector = require( 'expector' ).SeqExpector
  , flatten = require( '../json-flatten.js' );

function testTransform( key, prop ) {
  var t = {};
  t[key] = prop; 
  return t;
}

test( 'single element', (t) => {

  const e = new Expector(t)
    , obj = { a : 2 }; 

    e.expect( JSON.stringify( 2 ) ); 
    flatten( obj, /a/, testTransform )
    .then( (result) => {
      e.emit( result ).check(); 
    })
    .catch( (err) => {
      e.emit( err ); 
    });
});

test( 'single array', (t) => {

  const e = new Expector(t)
    , obj = { a : [1, 2] }; 

    e.expect( JSON.stringify( [1, 2] ) ); 
    flatten( obj, /a/, testTransform )
    .then( (result) => {
      e.emit( result ).check(); 
    })
    .catch( (err) => {
      e.emit( err ); 
    });
});

test( 'single object', (t) => {

  const e = new Expector(t)
    , obj = { a : { b: 2 } }; 

    e.expect( JSON.stringify( { b: 2 } ) ); 
    flatten( obj, /a/, testTransform )
    .then( (result) => {
      e.emit( result ).check(); 
    })
    .catch( (err) => {
      e.emit( err ); 
    });
});

test( 'simplest case', (t) => {
  const e = new Expector(t)
    , obj = { a: { p: 2 } };
  
  e.expect( JSON.stringify( { p: 2 } ) ); 
  flatten( obj, /a/, testTransform )
  .then( (result) => { 
    e.emit( result ).check(); 
  });
});


test( 'transform composite', (t) => {

  const e = new Expector(t)
    , obj = { a: { p: 2 }, p: 1 };
  
  e.expect( JSON.stringify( { p: 2 } ) ); 
  flatten( obj, /a/, testTransform )
  .then( (result) => { 
    e.emit( result ).check(); 
  });
}); 


test( 'composite objects', (t) => {
  const e = new Expector(t)
    , obj = { a: {p : 3}, q: 2 };
 
  e.expect( JSON.stringify( { p : 3 } ) );

  flatten( obj, /a/, testTransform )
  .then( (result) => { 
    e.emit( result ).check();
  });
});

test( 'nested objects', (t) => {
  const e = new Expector(t)
    , obj = { a: { a: {p : 3}, q: 2 }, p: 1 };

  e.expect( JSON.stringify( { a: {p : 3}, q: 2 } ) ); 

  flatten( obj, /a/, testTransform )
  .then( (result) => { 
    e.emit( result ).check();
  });
});

test( 'transform', (t) => {
  const e = new Expector(t)
    , obj = { x: { a: 2 } };

  e.expect( JSON.stringify( { x: 2 } ) );

  flatten( obj, /a/)
  .then( (result) => { 
    e.emit( result ).check();
  });
});