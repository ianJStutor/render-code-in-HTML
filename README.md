# Render Code in HTML

## Ian Marshall

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

### Live Site

> [https://ianjstutor.github.io/render-code-in-HTML/](https://ianjstutor.github.io/render-code-in-HTML/)

### Description

An interesting approach to displaying code snippets in HTML. Who knew you could access HTML comments using JavaScript?

Built with vanilla JavaScript, my favorite flavor!

### Usage

Include both <code>render-code-in-HTML.css</code> and <code>render-code-in-HTML.js</code> in your project. Link the CSS to your HTML document, import the JS into your main JavaScript file and call <code>renderCode()</code>. In your HTML, add ... ??? attribute to ... ???.

#### HTML

```html
<head>
    <link rel="stylesheet" href="render-code-in-HTML.css" />
    <script defer type="module" src="main.js"></script>
</head>
<body>
    <!--

    -->
</body>
```

#### JavaScript

```js
//main.js
import { renderCode } from "./render-code-in-HTML.js";
renderCode();
```

### Documentation

#### Module Export

```js
export { renderCode };
```

#### Public Method

```js
function renderCode() {}
```

???
