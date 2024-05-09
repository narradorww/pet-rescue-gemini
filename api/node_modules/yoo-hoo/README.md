# Yoo-Hoo

Yoo-Hoo! It's a tiny library for printing a noticeable banner of words for your project. Such as below,

![yoo-hoo logo](img/logo.png)

Maybe useful when you want a banner for your project. Have fun!

---

## How to install

```bash
npm i yoo-hoo
```

## How to use

```js
import { yo } from 'yoo-hoo';

yo('GOOD');
```

or in commonjs

```js
const { yo } = require('yoo-hoo');

yo('GOOD');
```

## API

```typescript
yo(text: string, options?: Option): string[]
```

It will return the lines for printing. Then you can print it yourself line by line.

**Options:**

- fontFamily: `object` Specify the font family. Optional. See more in the [Built-In Fonts Section](#built-in-fonts).
- spacing: `number`  The number of spaces between two characters. Default `1`.
- paddingStart: `number`  The number of spaces before the text. Default `0`.
- maxLineWidth: `number`  The max length of lines. If exceed `maxLineWidth` following characters will get a line feed. Default `Infinity`.
- color: `string`  Setting the color for print. Default `none`. There contains several values:
  - `random` choosing a random color from the palette
  - `rainbow` printing rainbow fonts 🌈
  - `none` without color setting
  - any other color string supported by [chalk](https://github.com/chalk/chalk)
- silent: `boolean`  Whether to prevent print characters when calling `yo()`. Default `false`.

For example,

```typescript
yo('ho', {
  color: 'blue',
  spacing: 2,
});
```

Then it will print a blue `HO` with two spaces between H and O.

## Built-In Fonts

Below is the fonts supported for the `fontFamily` option:

- default
- anis-shadow
- big
- crazy
- whimsy

You can import font sets from `lib/fonts/xxx` and use it. Such as below:

```typescript
import * as fontFamily from 'yoo-hoo/lib/fonts/ansi-shadow';

yo('yoo-hoo', {
    fontFamily,
});
```

When not receiving a `fontFamily` object, it will use the default font set.

## Characters Supported

> 🤘 `yoo-hoo` can be used in **both NodeJS and browsers**.

- 26 letters: `A-Z` (letters will be converted to uppercase)
- 10 numbers: `0-9`
- some punctuations: `·` `*` `-` `|`

Characters that are not supported will be ignored.

## Run the example

```bash
npm run example
```

```text
 /\\\    /\\\  /\\\\\\\\      /\\\\\\\\                /\\\    /\\\    /\\\\\\\\      /\\\\\\\\
 \/\\\   /\\\ /\\\_____/\\\  /\\\_____/\\\             \/\\\   \/\\\  /\\\_____/\\\  /\\\_____/\\\
   \/_\\\/\\\ \/\\\    \/\\\ \/\\\    \/\\\             \/\\\   \/\\\ \/\\\    \/\\\ \/\\\    \/\\\
      \/_\\\\  \/\\\    \/\\\ \/\\\    \/\\\  /\\\\\\\\\ \/\\\\\\\\\\\ \/\\\    \/\\\ \/\\\    \/\\\
         \/\\\  \/\\\    \/\\\ \/\\\    \/\\\ \/_______/  \/\\\____/\\\ \/\\\    \/\\\ \/\\\    \/\\\
          \/\\\  \/\\\    \/\\\ \/\\\    \/\\\             \/\\\   \/\\\ \/\\\    \/\\\ \/\\\    \/\\\
           \/\\\  \/_/\\\\\\\\\  \/_/\\\\\\\\\              \/\\\   \/\\\ \/_/\\\\\\\\\  \/_/\\\\\\\\\
            \/_/     \/_______/     \/_______/               \/_/    \/_/    \/_______/     \/_______/
```