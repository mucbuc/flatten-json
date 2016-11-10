#!/usr/bin/env node 

'use strict';

const traverse = require( 'traverjs' );

function flatten(obj, propRegex, transform ) {
  
  if (typeof transform === 'undefined') {
    transform = ( key, value ) => {
      return value; 
    }; 
  }

  return new Promise( (resolve, reject) => {

    let result = {};
    traverse( obj, ( p, next ) => {
      const key = Object.keys( p )[0];
      if (key.match(propRegex)) {
        result = transform( key, obj[key] );
        next();
      }
      else {
        flatten(obj[key], propRegex, transform )
        .then( (sub) => {
          result[key] = sub;
          next(); 
        })
        .catch( () => {
          next();
        }); 
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
  .version( '0.0.0' )
  .usage( '[options] <regexp> <json file>')
  .option( '-t, --transform [function]', 'specify transform. default = ( key, value ) => { return value; }' )
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