# Building Blocks Component

Use the best parts of the Web to build [efficient](https://github.com/bBlocks/sandbox/wiki/Intro) web applications. 

Build you components once and use everywhere. A lightweight and extremenly modular solution. Designed to reduced cost and maximize profit. 

Reliable. With two simple APIs that would never change. The rest is just your imagination.

## Quick start

* Install

```
npm install @bblocks/component
```

* Create an HTML page and place the code
```HTML
<!DOCTYPE html>
<html>

<head>
	<title>Component</title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<script src="node_modules/@bblocks/component/component.polyfills.min.js"></script>
	<script src="node_modules/@bblocks/component/component.js"></script>
</head>
<body>
	<my-field-element class="form-control"></my-field-element>
	<script>
		bb.component({
			is: 'my-field-element',
			on: {
				attach: function() {
					this.innerHTML = 'Hello!';
				}
			}

		});
	</script>
</body>

</html>
```
* You now free to build the Web!

## DEMO
* [demo]() 

## API ()
*

## What is different?
* Create Features and define Components.
* Lifecycle events.
* Extend native DOM elements.



