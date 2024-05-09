# chrome-version

> Detect the chrome version in the browser


## Install

```
$ npm install --save chrome-version
```


## Usage

```js
var chromeVersion = require('chrome-version')

chromeVersion('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36')
//=> 54
```

## API

#### `chromeVersion(agent)` -> `Number`

Returns a `Number` with the chrome version number.

##### agent

*Required*
Type: `string`

A user agent string from the browser.


## License

MIT © [Jack Hanford](http://jackhanford.com)
