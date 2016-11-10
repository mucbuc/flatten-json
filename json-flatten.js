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

    if (  typeof obj === 'number'
      ||  typeof obj === 'string') {
      resolve( obj ); 
      return;
    }
    
    let result = {};
    traverse( obj, ( p, next ) => {

      const key = Object.keys( p )[0];
  
      if (key.match(propRegex)) {
        if (!Array.isArray(obj[key])) {
          flatten( obj[key], propRegex, transform )
          .then( (o) => {
            if (typeof o === 'object') {
              for (var p in o) {
                result[p] = transform( key, o[p] )
              }
            }
            else {
              result = o;
            }
            next();
          })
          .catch( (err) => {
            console.log( 'error', err ); 
          });
        }
        else {
          //result[key] = obj[key]; 
          result = obj[key];
          next(); 
        }
      }
      else
      {
        if (result.hasOwnProperty(key)) {
          if (Array.isArray(result[key])) {
            result[key].push(obj[key]);
          }
          else {
            result[key] = [ result[key], obj[key] ];
          }
        }
        else 
        {
          result[key] = obj[key];
        }
        next();
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