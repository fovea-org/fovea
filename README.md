<a href="https://www.npmjs.com/package/@fovea/core"><img alt="NPM Version" src="https://badge.fury.io/js/%40fovea%2Fcore.svg" height="20"></img></a>
<a href="https://github.com/fovea-org/fovea/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/fovea-org%2Ffovea.svg" height="20"></img></a>
<a href="https://opensource.org/licenses/MIT"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-yellow.svg" height="20"></img></a>
<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Support on Patreon" src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" height="20"></img></a>

## Introduction

Fovea is a compiler for generating tiny and powerful Web Components, to use in building Web applications.
The days of huge monolithic Javascript bundles that takes forever to load are over. Our users deserve better.

By shifting computations to compile-time, rather than run-time, Fovea enables you to do way more with way less overhead.

And, because components compiled with Fovea are just Web Components, they work in any framework you may choose - or with no framework at all.
They're built on standards, so you won't run into weird interoperability issues.

Fovea also makes it super easy to build powerful Progressive Web Apps with the [`@fovea/cli`](https://github.com/fovea-org/fovea/tree/v1.0.96/packages/cli).

There's so much we want to say, but let's take it bit by bit:

## Install

- [Build Progressive Web Apps with Fovea] by leveraging the powerful `@fovea/cli`.
- [Build reusable Web Components with Fovea] with the `@fovea/compiler` and `@fovea/rollup-plugin-fovea`.

## Examples

A Fovea component looks like a Custom Element - because it *is* a Custom Element! And, your templates and styles are completely encapsulated within the Shadow DOM.
Here's a very simple example of a Fovea component:

```typescript
@templateSrc("./my-component.html")
@styleSrc(["./my-component.scss"])
class MyComponent extends HTMLElement {
}
``` 

Fovea enables you to write your styles in `.css` (or `.scss`) and your template in `.html`, - but it doesn't force you to!
If you're a fan of [React], [lit-html] or [stencil], you can also declare both directly from the component with `template` and/or `styles` accessors, methods or property declarations.
Because Fovea is compiled, it doesn't matter how you provide your template and styles. Fovea will figure it out:

```typescript
class MyComponent extends HTMLElement {
	// You can also provide the template from a get accessor or from a method of the same name
	// In this example, it is provided from a property.
	template = `<h1>This is my component!</h1>`;
}
```

By design, Fovea let's you write as little as possible, and fills out the gaps for you as required. In this example:

- The `MyComponent` Custom Element is automatically registered with the selector `my-component`
- A Shadow Root is automatically attached to the element
- The template is compiled into a sequence of blazing fast, secure instructions and attached the Shadow root
- The styles are run through PostCSS and compiled with SASS if applicable, and attached to the Shadow root

But you can manually invoke `customElements.define(...)` if you want, or provide a different selector name. Fovea won't get in your way.

Here's another example of a component that does a little more:

```typescript
@selector("clickey-thingey")
class MyComponent extends HTMLElement {
	@prop @setOnHost clickAmount: number = 0;
	template = `<button on-click="${this.clickAmount++}">I've been clicked ${this.clickAmount} ${this.clickAmount === 1 ? "time" : "times"}!</button>`;
	
	@onChange("clickAmount")
	onClickAmountChanged () {
		if (this.clickAmount >= 10) {
			console.log("You should go play Cookie clicker instead!");
		}
	}
}
```

This example is a bit more involved, but showcase some of the strongest parts of Fovea:
- You can declare `@prop`s which are the properties you'd like to use within your templates and styles. Here, the `@rop` `clickAmount` of type `number` is declared (yes, the data type is actually used for coercion!)
- You can use complex Expressions inside your templates. We call them *Live Expressions*, because they react immediately to changes to the `prop`s that are used within them. You can use *all* Javascript language features within those.
- You can automatically sync your `props` with host attributes. Fovea takes care of mapping the names between them. In this example, the `prop` `clickAmount` will be set on the host element as the attribute `click-amount` and update each time the value changes.
- You can react to changes to your props with the `@onChange` decorator.

Naturally, Fovea components can do **so** much more, so instead we'll refer you to the [full examples section].

## Contributing

Do you want to contribute? Awesome! Please follow [these recommendations](./CONTRIBUTING.md).

## Maintainers

- <a href="https://github.com/wessberg"><img alt="Frederik Wessberg" src="https://avatars2.githubusercontent.com/u/20454213?s=460&v=4" height="11"></img></a> [Frederik Wessberg](https://github.com/wessberg): _Lead Developer_

## Backers 🏅

[Become a backer](https://www.patreon.com/bePatron?u=11315442) and get your name, logo, and link to your site listed here.

## License 📄

MIT © [Frederik Wessberg](https://github.com/wessberg)

## FAQ

<!-- TODO -->
