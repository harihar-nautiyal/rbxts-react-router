# @rbxts/react-router

A lightweight and type-safe React Router implementation specifically designed for Roblox TypeScript (@rbxts/react).

## Installation

```bash
npm install @rbxtsx/react-router
```

## Features

- 🎯 Type-safe routing
- 🚀 Simple and intuitive API
- 🔄 Dynamic route matching
- 🎮 Optimized for Roblox
- ⚡ Lightweight implementation
- 🛠️ Built-in navigation hooks

## Quick Start

```typescript
import { RouterProvider, Routes, Route, Link } from '@rbxts/react-router';

// Your components
const Home: React.FC = () => (
    <frame>
        <textlabel Text="Home Page" />
        <Link to="/profile">Go to Profile</Link>
    </frame>
);

const Profile: React.FC = () => (
    <frame>
        <textlabel Text="Profile Page" />
        <Link to="/">Back to Home</Link>
    </frame>
);

// App setup
const App: React.FC = () => (
    <RouterProvider>
        <Routes>
            <Route path="/" component={Home} />
            <Route path="/profile" component={Profile} />
        </Routes>
    </RouterProvider>
);
```

## API Reference

### `<RouterProvider>`
The main router component that provides routing context.

```typescript
interface RouterProviderProps {
    children: React.ReactNode;
    initialPath?: string;
}

<RouterProvider initialPath="/">
    {/* Your routes */}
</RouterProvider>
```

### `<Routes>`
Container for Route components.

```typescript
<Routes>
    <Route path="/" component={Home} />
    <Route path="/profile" component={Profile} />
</Routes>
```

### `<Route>`
Defines a route with a path and component.

```typescript
interface RouteProps {
    path: string;
    component: React.ComponentType;
}

<Route path="/profile" component={Profile} />
```

### `<Link>`
Navigation component for route transitions.

```typescript
interface LinkProps {
    to: string;
    children: React.ReactNode;
}

<Link to="/profile">Go to Profile</Link>
```

### `useRouter` Hook
Hook for programmatic navigation and accessing router context.

```typescript
const MyComponent: React.FC = () => {
    const { navigate, currentPath } = useRouter();

    return (
        <textbutton 
            Text="Navigate"
            Event={{
                MouseButton1Click: () => navigate("/profile")
            }}
        />
    );
};
```

## Examples

### Basic Navigation
```typescript
const Navigation: React.FC = () => {
    const { navigate } = useRouter();

    return (
        <frame>
            <Link to="/">Home</Link>
            <Link to="/profile">Profile</Link>
            <textbutton 
                Text="Dashboard"
                Event={{
                    MouseButton1Click: () => navigate("/dashboard")
                }}
            />
        </frame>
    );
};
```

### Programmatic Navigation
```typescript
const GameComponent: React.FC = () => {
    const { navigate } = useRouter();

    const handleGameEnd = () => {
        // Do something
        navigate("/results");
    };

    return (
        <frame>
            <textbutton 
                Text="End Game"
                Event={{
                    MouseButton1Click: handleGameEnd
                }}
            />
        </frame>
    );
};
```

## Best Practices

1. Keep your routes organized in a central location
2. Use consistent path naming conventions
3. Handle navigation errors gracefully
4. Clean up any subscriptions or events in your components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT © [Harihar Nautiyal](https://github.com/harihar-nautiyal)

## Author

**Harihar Nautiyal**
- GitHub: [@harihar-nautiyal](https://github.com/harihar-nautiyal)
- npm: [@rbxts/react-router](https://www.npmjs.com/package/@rbxts/react-router)

## Changelog

### 1.0.0 (2024-12-18)
- Initial release
- Basic routing functionality
- Navigation hooks
- Link component
- Route matching

## Support

If you found this project useful, please consider giving it a ⭐️ on GitHub!

For issues and feature requests, please [create an issue](https://github.com/harihar-nautiyal/rbxts-react-router/issues) on GitHub.
```

This README provides:
1. Clear installation instructions
2. Comprehensive API documentation
3. Multiple usage examples
4. Best practices
5. Contribution guidelines
6. Proper attribution and licensing
7. Support information
8. Changelog
