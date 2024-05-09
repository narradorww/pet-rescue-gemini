# Is In Browser?

```js
import isBrowser from "is-in-browser";

if (isBrowser) {
  //...
}
```

More thoroughly:

```js
import { isJsDom, isNode, isBrowser } from "is-in-browser";

if (isBrowser) {
  // you're in the browser
  // jsdom considered in browser
}

if (isJsDom) {
  // you're in the JSDom
}

if (isNode) {
  // you're in the Node
}
```

## CommonJS

For those not using Babel / ES6 Modules

```js
var isBrowser = require('is-in-browser').default;

if(isBrowser) { //... }
```
