import { isBrowser, isNode, isJsDom } from "./index";

console.log(isBrowser ? "❌" : "✅", "browser:", isBrowser);
console.log(isNode ? "✅" : "❌", "node:", isNode);
console.log(isBrowser ? "❌" : "✅", "js-dom:", isJsDom);

if (isBrowser || !isNode || isJsDom) {
  process.exit(1);
}
