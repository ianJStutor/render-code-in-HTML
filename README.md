# Render Code in HTML

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Author

[Ian Marshall](https://ianjstutor.github.io/ian-marshall/)

## Live Site

> [https://ianjstutor.github.io/render-code-in-HTML/](https://ianjstutor.github.io/render-code-in-HTML/)

## Description

An interesting approach to displaying code snippets in HTML. Who knew you could access HTML comments using JavaScript?

Built with vanilla JavaScript, my favorite flavor!

## History

This version is adapted from my 2008 legacy code. The original HTML and CSS syntax parser (using RegEx) still works. But I never did finish my JavaScript tokenizer. (It's a tough task.) This time, I used an AST (Abstract Syntax Tree) library to help: [Esprima](https://esprima.org/).

## Dependency

For JavaScript parsing, I'm using [Esprima](https://esprima.org/). But using it is optional. The only loss is syntax highlighting in JavaScript. Syntax highlighting is still available in HTML and CSS (no dependencies). Without Esprima, rendered JavaScript code will print in black text on a white background (light mode) or white text on an off-black background (dark mode).

## Usage

Include both <code>render-code-in-HTML.css</code> and <code>render-code-in-HTML.js</code> in your project. Link the CSS to your HTML document, import the JS into your main JavaScript file and call <code>renderCode()</code>. In your HTML, add ... ??? attribute to ... ???.

### HTML

```html
<head>
    <link rel="stylesheet" href="render-code-in-HTML.css" />
    <script src="https://unpkg.com/esprima@~4.0/dist/esprima.js"></script><!-- optional -->
    <script defer type="module" src="main.js"></script>
</head>
<body>
    <!--

    -->
</body>
```

### JavaScript

```js
//main.js
import { renderCode } from "./render-code-in-HTML.js";
renderCode();
```

## Documentation

### Module Export

```js
export { renderCode };
```

### Public Method

```js
function renderCode() {}
```

???
