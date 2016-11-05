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


