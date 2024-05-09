# latest-lib [![Build Status](https://travis-ci.org/GabrielMangiurea/latest-lib.svg?branch=master)](https://travis-ci.org/GabrielMangiurea/latest-lib)

> Get the latest version of a CSS or JavaScript library hosted on CDNJS


## Install

```
$ npm install --save latest-lib
```


## Usage

```javascript
const latestLib = require('latest-lib');

// search for the latest version of bootstrap
latestLib('bootstrap')
.then(library => console.log(library))
//=> {name: 'twitter-bootstrap', version: '4.0.0-alpha.6', files: [...]}
.catch(err => console.log(err));

// search for the latest version of bootstrap 3
latestLib('bootstrap@3')
.then(library => console.log(library))
//=> {name: 'twitter-bootstrap', version: '3.3.7', files: [...]}
.catch(err => console.log(err));
```


## API

### latestLib(name[, opts])

Returns a `Promise` containing an object with the following properties:

- On success:
  - **name** `String`
  - **version** `String`
  - **files** `Array`


- On error:
  - an `Error` object

#### name

Type: `String`

The name of the library

Suffixing the name with `@[number]` will fetch the latest version of `[number]` major release

#### opts

Type: `Object`

##### only

Type: `String`

Possible choices:

- `css`
  - return only the `.css` files of the library in the response
- `js`
  - return only the `.js` files of the library in the response


## License

MIT &copy; [Gabriel Mangiurea](https://gabrielmangiurea.github.io)
