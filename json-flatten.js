#!/usr/bin/env node 

'use strict';

const traverse = require( 'traverjs' )
  ,  path = require( 'path' ); 

function flatten(obj, propRegex, transform, base) {
  
  if (typeof base === 'undefined') {
    base = ''; 
  }
  
  if (typeof transform === 'undefined') {
    transform = ( key, value, cb ) => {
      cb( value ); 
    }; 
  }

  return new Promise( (resolve, reject) => {

    let result = [];
    traverse( obj, ( p, next ) => {
      
      const key = Object.keys( p )[0];
      if (key.match(propRegex)) {
        transform( obj, obj[key], (r) => {
          result = result.concat(r);
          next();
        }, base );
      }
      else {
        flatten(obj[key], propRegex, transform, path.join( base, key ) )
        .then( (sub) => {
          result = result.concat(sub);
          next(); 
        })
        .catch( next ); 
      }
    })
    .then( () => {
      resolve( result );
    })
    .catch( () => {
      resolve( result ); 
    });
  });
}

if (module.parent) {
  module.exports = flatten;
}
else {

  var transform;
  const program = require( 'commander' )
    , fs = require( 'fs' ); 

  program
  .version( '0.0.3' )
  .usage( '[options] <regexp> <json file>')
  .option( '-t, --transform [function]', 'specify transform. default = ( key, value, cb ) => { cb( value ); }' )
  .parse( process.argv ); 
    
  if (program.transform) {
    const vm = require( 'vm' )
      , context = vm.createContext()
      , script = new vm.Script( program.transform );
    transform = script.runInContext( context );
  }

  if (program.args.length < 2) {
    program.help(); 
  }
  else {
    const regexp = new RegExp( program.args[0] )
      , fileName = program.args[1];

    fs.readFile( fileName, (err, data) => {
      if (err) throw err; 
      flatten( JSON.parse(data), regexp, transform )
      .then( (result) => {
        console.log( JSON.stringify( result, null, 2 ) );
      })
      .catch( (err) => {
        console.error( err ); 
      });
    });
  } 
}