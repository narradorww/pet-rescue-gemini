# v1.3.1

## Fix

- support browsers: remove the module which not supported in browsers

---

# v1.3.0

## Feature

Support more font families. Now you can use the `fontFamily` option to specify the type of font as below:

```typescript
import * as fontFamily from 'yoo-hoo/lib/fonts/ansi-shadow';

yo('yoo-hoo', {
    fontFamily,
});
```

[See more >>](./README.md#built-in-fonts)

---

# v1.2.0

## Feature

- support print rainbow fonts 🌈
- support padding start

---

# v1.0.1

## Fix

- char height should be calculated from the source texts
- use a string text instead of a variable for the default font set module, so that it can work in webpack
- codes should be numbers in the font set module

---

# v1.0.0

Init release 🎉

- easily use to print notable logos and banners in the console
- a built-in font set
- support both nodejs and browers
- support setting max line length
- support colorful paint
- support rendering by yourself