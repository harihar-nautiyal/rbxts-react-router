# @rbxtsx/react-router
## A React-like Router for Roblox with Transitions

**Welcome!** This is the official documentation for the `@rbxtsx/react-router` package. This package provides a routing solution for your Roblox experiences built with Roblox's TypeScript framework, RbxTs. It allows you to manage navigation between different UI components based on URL paths and includes support for animated transitions.

**Author:** Harihar Nautiyal

**Important Configuration**

1. Update tsconfig.json
Add @rbxtsx to your typeRoots:

```json
{
  "compilerOptions": {
    "typeRoots": [
      "node_modules/@rbxts",
      "node_modules/@rbxtsx",  // Add this line
      "node_modules/@types"
    ]
  }
}
```

Update default.project.json
Add the @rbxtsx scope to your Rojo configuration:

```json
{
  "ReplicatedStorage": {
    "$className": "ReplicatedStorage",
    "rbxts_include": {
      "$path": "include",
      "node_modules": {
        "$className": "Folder",
        "@rbxts": {
          "$path": "node_modules/@rbxts"
        },
        "@rbxtsx": {           // Add this block
          "$path": "node_modules/@rbxtsx"
        }
      }
    }
  }
}
```

**Installation:**

```bash
npm install @rbxtsx/react-router
```

**Features:**

*   **Navigation:** Define routes and navigate between them using paths.
*   **Route Matching:** Match URLs to specific components based on path patterns.
*   **Parameters:** Capture dynamic segments in paths using colon syntax (`:paramName`).
*   **Transitions:** Apply smooth animations when switching between routes. You can choose from various built-in transition types or customize your own.
*   **Context API:** Access routing information like the current path and navigation function from any component in your application using `useRouter` and `useParams` hooks.

**Getting Started:**

1.  **Import the necessary components:**

```jsx
import { RouterProvider, Routes, Route, Link, useRouter, useParams } from "@rbxtsx/react-router";
```

2.  **Wrap your application with `RouterProvider`:**

This component provides the context for routing and manages the current path. You can also set default transition properties here.

```jsx
function App() {
  return (
    <RouterProvider transition="slide-left" transitionDuration={0.5}> {/* Default transition for all routes */}
      {/* Your application components here */}
    </RouterProvider>
  );
}
```

3.  **Define routes with `Routes`:** This component acts as a container for your routes. You can also override the default transition properties from the `RouterProvider`.

```jsx
<Routes transition="fade" transitionDuration={0.3}> {/* Overrides default transition for routes within */}
  <Route path="/" component={HomePage} />
  <Route path="/about" component={AboutPage} />
  <Route path="/products/:productId" component={ProductPage} />
</Routes>
```

4.  **Define individual routes with `Route`:**

*   `path`: The URL pattern for this route.
*   `component`: The React component to render for this route.
*   `transition` (Optional): Overrides the parent `Routes` or `RouterProvider` transition.
*   `transitionDuration` (Optional): Overrides the parent `Routes` or `RouterProvider` transition duration.

5.  **Create links with `Link`:**

This component allows users to navigate between routes.

```jsx
<Link to="/">Home</Link>
<Link to="/about">About</Link>
```

6.  **Access route information:**

*   `useRouter` hook: Returns the current routing context object.
*   `useParams` hook: Returns a map of captured parameters from the current route.

**Transitions:**

The `@rbxtsx/react-router` package provides several built-in transition types:

*   `fade`: Fades the new component in and the old component out.
*   `slide-left`: Slides the new component in from the left and the old component out to the left.
*   `slide-right`: Slides the new component in from the right and the old component out to the right.
*   `slide-up`: Slides the new component in from the bottom and the old component out to the bottom.
*   `slide-down`: Slides the new component in from the top and the old component out to the top.

You can set the transition type and duration on the `RouterProvider`, `Routes`, or individual `Route` components. The order of precedence is `Route` > `Routes` > `RouterProvider`.

**Example with Transitions:**

```jsx
function App() {
  return (
    <RouterProvider transition="fade" transitionDuration={0.5}>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/products/123">Product 123</Link>
      </nav>
      <Routes>
        <Route path="/" component={HomePage} />
        <Route path="/about" component={AboutPage} transition="slide-right" /> {/* Overrides default to slide-right */}
        <Route path="/products/:productId" component={ProductPage} />
      </Routes>
    </RouterProvider>
  );
}
// ... (HomePage, AboutPage, ProductPage components remain the same)
```

In this example:

*   All routes will initially have a `fade` transition with a duration of 0.5 seconds.
*   The `/about` route will override this to use a `slide-right` transition, while keeping the 0.5-second duration.

**Additional Notes:**

*   This package utilizes Roblox-specific components like `frame`, `textbutton`, and `TweenService`. Ensure you're familiar with these components for proper usage within Roblox.