# json-flatten

flatten JSON properties matching given regex

####example
`cat test.json`   
`{"a":{"p":2},"p":1}`   
`json-flatten /a/ test.json`   
`{"p":[2,1]}`    

####usage
```
  Usage: json-flatten [options] <regexp> <json file>

  Options:

    -h, --help                  output usage information
    -V, --version               output the version number
    -t, --transform [function]  specify transform. default = ( key, value ) => { return value; }
```



V2: 
{ a: [ 1, 2 ] } => [ 1, 2 ]  
{ a: { a: 2 } } => 2
{ q: { a: 1 }, p: { a: 2 } } => a: [ {q : 1}, {p: 2} ]

example: 
{
	modA: 
	{
		"sources": [ a ]
	}, 
	modB:
	{
		"sources": [ b ]
	}
}
=> 
{
	"sources": [
		{ modA: a },
		{ modB: b }
	]
}

{ a: 1 }		 				=> 1						// number
{ a: [1, 2] } 					=> [1, 2]					// array 
{ a: { b: 1 } } 				=> { b: 1 }					// object

{ x: { a: 2 } } 				=> { x: 2 }					// object
{ x: { a: 2 }, y: { a: 3 } } 	=> { x: 2, y : 3 }			// object
{ x: { a: 2 }, y: { b: 3 } } 	=> { x: 2, y : { b: 3 } }	// object 
{ x: { a: [3, 2] } } 			=> { x: [3, 2] }

recursive exceptions:
{ a: { a: 1 } }					=> { a: 1 } 	=> 1

