# @fovea/router
[![NPM version][npm-version-image]][npm-version-url]
[![License-mit][license-mit-image]][license-mit-url]

[license-mit-url]: https://opensource.org/licenses/MIT

[license-mit-image]: https://img.shields.io/badge/License-MIT-yellow.svg

[npm-version-url]: https://www.npmjs.com/package/@fovea/router

[npm-version-image]: https://badge.fury.io/js/%40fovea%2Frouter.svg

## Introduction

`@fovea/router` is the official Router for Fovea. Features include:

- Component-based router configuration
- Nested route mapping
- Lazy loading of matched routes
- Named routes, params, query parameters, redirects, and aliases.
- Global and per-route guards
- Navigation lifecycle hooks (For example for transition animations)

## Installation

```
npm install @fovea/router
```

## Basic example

The following example shows how to setup a simple Router that can route between a couple of views:

**HTML**

```html
<!-- inside app-component.html -->
<h1>My awesome app</h1>

<!-- Matched routes goes inside the <router-outlet> -->
<router-outlet></router-outlet>

<!-- routerLinks annotate <a> tags -->
<a href="/" *router-link>Go to Home</a>
<a href="/profile" *router-link>Go to Profile</a>
```

**Javascript/Typescript**

```typescript
// Inside app-component.ts
import {templateSrc} from "@fovea/core";
import {Router, RouterLink} from "@fovea/router";

@templateSrc("./app-component.html")
class AppComponent extends HTMLElement {
	/**
	 * Instantiate the Router after the component has been attached to the DOM.
	 */
	connectedCallback () {
		new Router({
			// root can be any element that has a router-outlet element in its' local DOM.
			root: this,
			routes: [
				// Your routes can be configured here
				{
					path: "/",
					name: "home",
					component: () => import("./home-component")
				},
				{
					path: "/profile/:userId",
					name: "profile",
					component: () => import("./profile-component")
				},
				// An aliased route can provide custom params and query params to another configured route
				{
					path: "/profile/me",
					alias: {name: "profile", params: {userId: -1}}
				}
			]
		});
	}
}
```

## Route patterns

Quite often, the same routes should be matched for different paths.
For example, imagine a `/profile` route that should display data about
a user. We can provide dynamic segments to our paths to indicate the dynamic
parts of a URL by prefixing those parts with a `:`:

```typescript
const profileRoute = {
	path: "/profile/:userId",
	name: "profile"
}
```

The `:userId` part is dynamic. For example, `/profile/1` matches the route, and so does `/profile/2`.

The dynamic parts are called `Params`, and these are provided to the matched components so that they can
use them, for example to fetch user data from an API.

Here's a few examples of patterns and paths that matches them as well as the `Params` that will be provided to the matched components:

| Pattern                               | Matched path            | Params                      |
|:--------------------------------------|:------------------------|:----------------------------|
| `/profile/:userId`                    | `/profile/1`            | `{userId: 1}`               |
| `/posts/:postId/comments/:commentId`  | `/posts/1/comments/3`   | `{postId: 1, commentId: 3}` |

### Matching the same Route with different Params

The Router will create a new instance of the component matched by a Route each time the `Params` change, rather than reusing the component instance and passing the
new values to it like some other routers do. This makes it possible to animate transitions between multiple instances of the same Route, but with different `Params` (for example, from one Profile page to another).

### Matching priority

The Routes will be matched in the priority they are declared in. This means that if multiple Routes are matched by the same path, the route that is declared the earliest will be matched.

## Nested/Child Routes

Apps are frequently composed of top-level routes (for example `/`, `/profile`, etc), and each of those may declare a routing hierarchy of their own.
For example, the component matched by the `/profile` route may wish to optionally display the posts, comments, and other contributions by a user on the profile page and make sure
that they can be routed to.

For example, consider this markup

```html
<h1>John Doe's Profile</h1>
<hr>
<nav>
	<ol>
		<li><a href="profile.posts" *router-link="params: ${params}">Posts</a> </li>
		<li><a href="profile.comments" *router-link="params: ${params}">Comments</a></li>
		<li><a href="profile.likes" *router-link="params: ${params}">Likes</a></li>
  </ol>
</nav>

<article>
	Content goes here
	<router-outlet></router-outlet>
</article>
```

We will get into the details of the markup later when we describe `RouterLink`s.

Here's how it may render with some very basic styling

![Nested Route example](./documentation/asset/nested_route_example.png)

The Router supports this kind of routing seamlessly through *Nested routes*. These are declared by passing routes to the `children` property of a route.
Note that this works recursively. Any route can have child routes, even if it is a child route itself:

```typescript
const profileRoute = {
	path: "/profile/:userId",
	name: "profile",
	component: () => import("./profile-component"),
	children: [
		{
			path: "/posts",
			name: "profile.posts",
			component: () => import("./post-list-component")
		},
		{
			path: "/comments",
			name: "profile.comments",
			component: () => import("./comment-list-component")
		},
		{
			path: "/likes",
			name: "profile.likes",
			component: () => import("./like-list-component")
		}
	]
}
```

The paths of child routes will be appended to the path of their parent route.
In the above example, the child route with the name `profile.posts` will match the pattern: `/profile/:userId/posts`.

## Named routes

Sometimes it is convenient to associate a name with a route, for example if the path is complex, include several `Params`, or if the route should receive a specific combination of query parameters. 
There can be plenty of reasons why you want to refer to a name for a route, and for all these reasons, use the `name` property when a route is declared:

```typescript
const someRoute = {
	path: "/some/complex/path/:someParam",
	name: "foo"
}
```

## Aliased Routes

You can use *aliases* to refer to another route by the pattern for the aliased route.
This makes it possible to have multiple routes with different paths, but with the same behavior.
It also enables adding routes with special names that mask more complex paths. For example, in the
[basic example](#basic-example), we introduced the following route configuration:

```typescript
const routes = [
	{
		path: "/profile/:userId",
		name: "profile",
		component: () => import("./profile-component")
	},
	{
		path: "/profile/me",
		alias: {name: "profile", params: {userId: -1}}
	}
];
```

Here, the `/profile/me` path is special in that it isn't a user ID, but it makes perfect
semantic sense nonetheless. Here, an aliased route is a great way of referring to the `/profile` route
with a URL that is more convenient.

## Redirect routes

*Redirect* routes behave exactly like aliased routes, but rather than preserve the path provided by
the redirected route, the path will be rewritten to the path of the route it redirects to. This mimics the
behavior of standard HTTP redirects.

For example:

```typescript
const routes = [
	{
		path: "/",
		name: "home",
		component: () => import("./home-component")
	},
	{
		path: "/feed",
		redirect: {name: "home"}
	}
];
```

## Navigation lifecycle hooks

Components that can be mapped to a Route should implement the `IRouterTarget` interface.
The relevant navigation lifecycle hooks will be invoked on the matched components if they implement them.

The lifecycle hooks are:

| Lifecycle hook                                                                                    | Description                                                                                                                                                                                                                                                                                                            |
|:--------------------------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `onNavigateTo? (options: IRouteInstanceNavigateToOptions): Promise<void>`                         | Invoked when the component is attached and will replace any existing route. It receives options such as the `Params` and query parameters as an argument. Must return a Promise. The navigation change will be halted until the Promise is resolved, so you can use this hook to animate the entry of the component.   |
| `onNavigateFrom? (options: IRouteInstanceNavigateOptions): Promise<void>`                         | Invoked when the component is about to become detached. Must return a Promise. The navigation change will be halted until the Promise is resolved, so you can use this hook to animate the exit of the component.                                                                                                      |

## Receiving and reacting to `Params` within components

The `Params` that is matched by a Route will be provided to the component through the navigation lifecycle hook `onNavigateTo` (see [Navigation lifecycle hooks](#navigation-lifecycle-hooks)).

For example, to store a reference to one or more of the given `Params` inside a component as `@prop`s, and to react to changes, the following code example will work:

```typescript
import {prop, onChange} from "@fovea/core";
import {IRouteInstanceNavigateToOptions} from "@fovea/router";

class ProfileComponent extends HTMLElement {
	@prop userId: number;
	
	public async onNavigateTo ({params}: IRouteInstanceNavigateToOptions): Promise<void> {
		this.userId = params.userId;
	}
	
	@onChange("userId")
	async onUserIdChanged (): Promise<void> {
		// Do some stuff with the new userId
	}
}
```

## Guards

Guards are functions or methods that checks if a route can be navigated to. This is useful, for example to restrict routes from access from unauthenticated users.
A guard may return a `boolean`, indicating whether or not to *allow* navigation to the associated route, or it may return another `route` to redirect to.

A guard receives two arguments: The new `state`, and the current `state` (if any).

For example:

```typescript
const routes = [
	{
		path: "/profile/:userId",
		name: "profile",
		component: () => import("../profile/profile-component"),
		guards: [
			async (stateInput, currentState) => {
				if (isAuthenticated) {
					return true;
				}
				// If the user is not authenticated, redirect to the 'login' page
				return {name: "login"};
			}
		]
 	},
 	{
		path: "/login",
		name: "login",
		component: () => import("../login/login-component"),
		guards: [
			async (stateInput, currentState) => {
				if (!isAuthenticated) {
					return true;
				}
				// If the user is already logged in, redirect to the 'home' route
				return {name: "home"};
			}
		]
	},
	{
		path: "/",
		name: "home",
		component: () => import("../home/home-component")
  },
];
```

### Guard order and short-circuiting

Guards are automatically combined. For a navigation attempt to pass, *all* guards must return true.
This means that even though one of your guards will accept navigation to the route, it can still be rejected if another one fails.
For nested routes, the chain of guards are tested from parent to child.
For example, of the route with the path `/foo/bar` is a child of the route with path `/foo`, navigation to `/foo/bar` will be rejected if navigation
to `/foo` is rejected.

### Global Guards

Global guards are guards that will be invoked for every navigation attempt. This can be useful if all routes need to pass some basic validation such as
an authentication check.

Global guards are provided directly in the configuration provided to new `Router` instances:

```typescript
new Router({
	// ...
	guards: [
		
		async (stateInput, currentState) => {
			// Handle each navigation attempt within this guard
		}
	],
	routes: [
		// ...
	]
})
```

### Route Guards

Route Guards are guards that are related to specific routes. These will only be checked upon navigation attempts to the route the guard is associated with.
For example:

```typescript
new Router({
	// ...
	routes: [
		{
			path: "/foo",
			name: "foo",
			component: () => import("../foo/foo-component"),
			guards: [
				async (stateInput, currentState) => {
					// Handle each navigation attempt for this specific route within this guard
				}
			]
    },
	]
})
```

## `RouterOutlet`
 
The `<router-outlet>` element is a container for instances of components matched by routes.
The element provided to the `Router` in its initialization options must have a `<router-outlet>` element in its local DOM. The same goes for any
route that declares child roots of its own (*"nested routes"*).
 
When a new route is matched, the matched component will be instantiated and attached to a `<router-outlet>` immediately.
Any existing routes will be detached as soon as all navigation lifecycle hooks have finished executing (for example, to animate entry and exit of the new route).
 
## `RouterLink`

Anchor (`<a>`) tags annotated with the `RouterLink` Custom Attribute will use the `Router` for navigation.
`RouterLinks` will use the `href` attribute on the `<a>` tag to decide which path to navigate to.
Href attribute values prefixed with a `/` will be treated as *paths*, and all other paths will be treated as *names*.
 
For example:
 
```html
<a href="/some_path" *router-link></a>
<a href="some_name" *router-link></a>
```

In the above example, the first `<a>` tag will attempt to navigate to the route that has the path: `/some_path`,
while the second `<a>` tag will attempt to navigate to the route that has the name `some_name`.

### Passing options to `RouterLink`s
 
`RouterLink`s may take options. For example:

```html
<a href="some_name" *router-link="params: ${ {userId: 2} }; replace: true"></a>
```

Here, the route with the name `some_name` will be matched, and the params `{userId: 2}` will be provided.
The `replace` option will replace the current navigation history state with the new one, rather than push it onto the stack.

The full list of options are:

| Option        | Description                                                                             |
|:--------------|:----------------------------------------------------------------------------------------|
| `params`      | A dictionary of the `Params` to provide to the route                                    |
| `query`       | The query parameters to provide to the route                                            |
| `replace`     | Whether to replace the current history state, rather than push a new one onto the stack |
| `title`       | The title to use for the new Route (the text that will appear in the browser tab)       |

## Programmatic navigation

You don't have to use `RouterLink`s for all navigation purposes.
You can just as easily use `Router` directly through its public interface.

### `push(options: RouterPushOptions): Promise<boolean>`

The `push` method will push a new route onto the navigation history stack and navigate to it.

For example:
```typescript
await router.push({
	path: "/some_path",
	params: {someParam: "foo"},
	query: {foo: "bar"},
	title: "This is an awesome title!"
});
```

### `replace(options: RouterPushOptions): Promise<boolean>`

The `replace` method behaves exactly like the `push` method (see above), but *replaces* the current navigation state, rather than
pushing a new one onto the history stack.

### `go(n: number): void`

Goes *n* amount of states back or forth in the navigation history.

For example, to go the route before the previous route:

```typescript
router.go(-2)
```

### `pop(): void`

Pops the current state from the stack and navigates to the previous route. This is equivalent to calling `router.go(-1)`.

### `addRoutes (routes: RouteInput[]): void`

Adds additional routes to the `Router`. This is useful is some routes should only be conditionally hooked up depending
on the state of your app.

### `dispose(): void`

Removes all attached routes and empties the Router state all-together.

### `length: number`

Retrieves the size of the navigation history.