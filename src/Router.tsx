import React, {
    Children,
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useState,
    useEffect,
} from "@rbxts/react";


type TransitionType = "fade" | "slide-left" | "slide-right" | "slide-up" | "slide-down";

interface RouterContextType {
    currentPath: string;
    navigate: (path: string) => void;
    params: Map<string, string>;
}

interface RouterProviderProps extends PropsWithChildren<{
    initialPath?: string;
    transition?: TransitionType;
    transitionDuration?: number;
}> {}

interface RoutesProps extends PropsWithChildren<{
    transition?: TransitionType;
    transitionDuration?: number;
}> {}

interface RouteProps {
    path: string;
    component: React.ComponentType;
    transition?: TransitionType;
    transitionDuration?: number;
}

interface LinkProps {
    to: string;
    children: React.ReactNode;
}

// Transition configurations
const transitionConfigs = {
    "fade": {
        initial: { BackgroundTransparency: 1, Position: UDim2.fromScale(0, 0) },
        animate: { BackgroundTransparency: 0, Position: UDim2.fromScale(0, 0) },
        exit: { BackgroundTransparency: 1, Position: UDim2.fromScale(0, 0) },
    },
    "slide-left": {
        initial: { BackgroundTransparency: 0, Position: UDim2.fromScale(1, 0) },
        animate: { BackgroundTransparency: 0, Position: UDim2.fromScale(0, 0) },
        exit: { BackgroundTransparency: 0, Position: UDim2.fromScale(-1, 0) },
    },
    "slide-right": {
        initial: { BackgroundTransparency: 0, Position: UDim2.fromScale(-1, 0) },
        animate: { BackgroundTransparency: 0, Position: UDim2.fromScale(0, 0) },
        exit: { BackgroundTransparency: 0, Position: UDim2.fromScale(1, 0) },
    },
    "slide-up": {
        initial: { BackgroundTransparency: 0, Position: UDim2.fromScale(0, 1) },
        animate: { BackgroundTransparency: 0, Position: UDim2.fromScale(0, 0) },
        exit: { BackgroundTransparency: 0, Position: UDim2.fromScale(0, -1) },
    },
    "slide-down": {
        initial: { BackgroundTransparency: 0, Position: UDim2.fromScale(0, -1) },
        animate: { BackgroundTransparency: 0, Position: UDim2.fromScale(0, 0) },
        exit: { BackgroundTransparency: 0, Position: UDim2.fromScale(0, 1) },
    },
};


const RouterContext = createContext<RouterContextType>({
    currentPath: "/",
    navigate: () => {},
    params: new Map(),
});

export const RouterProvider: React.FC<RouterProviderProps> = ({
    children,
    initialPath = "/",
    transition = "fade",
    transitionDuration = 0.3,
}) => {
    const [currentPath, setCurrentPath] = useState(initialPath);
    const [params] = useState(new Map<string, string>());

    const navigate = useCallback((path: string) => {
        setCurrentPath(path);
    }, []);

    return (
        <RouterContext.Provider value={{ currentPath, navigate, params }}>
            <frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
                {children}
            </frame>
        </RouterContext.Provider>
    );
};

export const Routes: React.FC<RoutesProps> = ({ 
    children, 
    transition = "fade", 
    transitionDuration = 0.3 
}) => {
    const childrenArray = Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
                transition,
                transitionDuration,
            });
        }
        return child;
    });

    return (
        <frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
            {childrenArray}
        </frame>
    );
};

export const Route: React.FC<RouteProps> = ({
    path,
    component: Component,
    transition = "fade",
    transitionDuration = 0.3,
}) => {
    const { currentPath } = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const matchRoute = (
        routePath: string,
        currentPath: string,
    ): { isMatch: boolean; params: Map<string, string> } => {
        const routeParts = string.split(routePath, "/").filter((part) => part !== "");
        const currentParts = string.split(currentPath, "/").filter((part) => part !== "");

        if (routeParts.size() !== currentParts.size()) {
            return { isMatch: false, params: new Map() };
        }

        const params = new Map<string, string>();

        const isMatch = routeParts.every((routePart, index) => {
            const currentPart = currentParts[index];

            if (string.sub(routePart, 1, 1) === ":") {
                const paramName = string.sub(routePart, 2);
                params.set(paramName, currentPart);
                return true;
            }

            return routePart === currentPart;
        });

        return { isMatch, params };
    };

    const { isMatch } = matchRoute(path, currentPath);

    useEffect(() => {
        if (isMatch) {
            setIsAnimating(true);
            setIsVisible(true);
            task.delay(transitionDuration, () => {
                setIsAnimating(false);
            });
        } else {
            setIsAnimating(true);
            task.delay(transitionDuration, () => {
                setIsVisible(false);
                setIsAnimating(false);
            });
        }
    }, [isMatch]);

    if (!isVisible && !isAnimating) return undefined;

    const config = transitionConfigs[transition];
    const currentStyle = isMatch ? config.animate : (isAnimating ? config.exit : config.initial);

    const tweenInfo = new TweenInfo(transitionDuration);

    return (
        <frame
            BackgroundTransparency={currentStyle.BackgroundTransparency}
            Position={currentStyle.Position}
            Size={UDim2.fromScale(1, 1)}
            Change={{
                Position: (rbx: Frame) => {
                    if (currentStyle.Position) {
                        const tween = game.GetService("TweenService").Create(
                            rbx,
                            tweenInfo,
                            { Position: currentStyle.Position as UDim2 }
                        );
                        tween.Play();
                    }
                },
                BackgroundTransparency: (rbx: Frame) => {
                    if (currentStyle.BackgroundTransparency !== undefined) {
                        const tween = game.GetService("TweenService").Create(
                            rbx,
                            tweenInfo,
                            { BackgroundTransparency: currentStyle.BackgroundTransparency }
                        );
                        tween.Play();
                    }
                },
            }}
        >
            <Component />
        </frame>
    );
};


export const Link: React.FC<LinkProps> = ({ to, children }) => {
    const { navigate } = useRouter();

    const buttonText = typeIs(children, "string") ? children : "Link";

    return (
        <textbutton
            AutomaticSize={Enum.AutomaticSize.XY}
            BackgroundColor3={new Color3(1, 1, 1)}
            BorderSizePixel={0}
            Text={buttonText}
            TextSize={14}
            Font={Enum.Font.SourceSans}
            Event={{
                MouseButton1Click: () => navigate(to),
            }}
        />
    );
};

export const useRouter = (): RouterContextType => {
    return useContext(RouterContext);
};

export const useParams = (): Map<string, string> => {
    const { params } = useRouter();
    return params;
};
