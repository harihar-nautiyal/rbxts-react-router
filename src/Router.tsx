import React, {
    Children,
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useState,
    useEffect,
    ReactNode,
    ComponentType,
} from "@rbxts/react";

type TransitionType = "fade" | "slide-left" | "slide-right" | "slide-up" | "slide-down";


interface TransitionStyle {
    BackgroundTransparency?: number;
    ImageTransparency?: number; 
    TextTransparency?: number; 
    Position?: UDim2;
}

interface RouterContextType {
    currentPath: string;
    navigate: (path: string) => void;
    params: Map<string, string>;
}

interface RouterProviderProps extends PropsWithChildren<{
    initialPath?: string;
    transition?: TransitionType;
    transitionDuration?: number;
}> { }

interface RoutesProps extends PropsWithChildren<{
    transition?: TransitionType;
    transitionDuration?: number;
}> { }

interface RouteProps {
    path: string;
    component: ComponentType;
    transition?: TransitionType;
    transitionDuration?: number;
}

interface LinkProps {
    to: string;
    children: ReactNode;
}


const transitionConfigs: Record<TransitionType, {
    initial?: TransitionStyle;
    animate: TransitionStyle;
    exit: TransitionStyle;
}> = {
    "fade": {
        animate: { BackgroundTransparency: 0, ImageTransparency: 0 },
        exit: { BackgroundTransparency: 1, ImageTransparency: 1 },
    },
    "slide-left": {
        initial: { Position: UDim2.fromScale(1, 0) },
        animate: { Position: UDim2.fromScale(0, 0) },
        exit: { Position: UDim2.fromScale(-1, 0) },
    },
    "slide-right": {
        initial: { Position: UDim2.fromScale(-1, 0) },
        animate: { Position: UDim2.fromScale(0, 0) },
        exit: { Position: UDim2.fromScale(1, 0) },
    },
    "slide-up": {
        initial: { Position: UDim2.fromScale(0, 1) },
        animate: { Position: UDim2.fromScale(0, 0) },
        exit: { Position: UDim2.fromScale(0, -1) },
    },
    "slide-down": {
        initial: { Position: UDim2.fromScale(0, -1) },
        animate: { Position: UDim2.fromScale(0, 0) },
        exit: { Position: UDim2.fromScale(0, 1) },
    },
};

const RouterContext = createContext<RouterContextType>({
    currentPath: "/",
    navigate: () => { },
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
    transitionDuration = 0.3,
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
    const { currentPath, params } = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const matchRoute = useCallback((
        routePath: string,
        currentPath: string,
    ): { isMatch: boolean; params: Map<string, string> } => {
        const routeParts = string.split(routePath, "/").filter((part) => part !== "");
        const currentParts = string.split(currentPath, "/").filter((part) => part !== "");

        if (routeParts.size() !== currentParts.size()) {
            return { isMatch: false, params: new Map() };
        }

        const newParams = new Map<string, string>();

        const isMatch = routeParts.every((routePart, index) => {
            const currentPart = currentParts[index];

            if (string.sub(routePart, 1, 1) === ":") {
                const paramName = string.sub(routePart, 2);
                newParams.set(paramName, currentPart);
                return true;
            }

            return routePart === currentPart;
        });

        return { isMatch, params: newParams };
    }, []);

    const { isMatch, params: newParams } = matchRoute(path, currentPath);

    useEffect(() => {
        if (isMatch) {
            newParams.forEach((value, key) => {
                params.set(key, value);
            });
        }
    }, [isMatch, newParams, params]);

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
    }, [isMatch, transitionDuration]);

    if (!isVisible && !isAnimating) return undefined;

    const config = transitionConfigs[transition];
    const currentStyle = isMatch ? config.animate : config.exit;

    return (
        <frame
            BackgroundTransparency={currentStyle.BackgroundTransparency || 1} 
            Position={currentStyle.Position || UDim2.fromScale(0, 0)}
            Size={UDim2.fromScale(1, 1)}
        >
            <Component />
            {isAnimating && (
                <frame
                    BackgroundTransparency={1}
                    Size={UDim2.fromScale(0, 0)}
                    Event={{
                        AncestryChanged: (rbx: Instance) => {
                            if (rbx.IsDescendantOf(game)) {
                                const tweenInfo = new TweenInfo(transitionDuration);
                                const propsToTween: Partial<WritableInstanceProperties<Frame>> = {};

                                if (currentStyle.Position !== undefined) {
                                    propsToTween.Position = currentStyle.Position;
                                }

                                if (currentStyle.BackgroundTransparency !== undefined) {
                                    propsToTween.BackgroundTransparency = currentStyle.BackgroundTransparency;
                                }

                                
                                if (currentStyle.ImageTransparency !== undefined) {
                                    propsToTween.Transparency = currentStyle.ImageTransparency;
                                }

                                if (currentStyle.TextTransparency !== undefined) {
                                    propsToTween.Transparency = currentStyle.TextTransparency;
                                }

                                const tween = game.GetService("TweenService").Create(
                                    rbx.Parent as Frame,
                                    tweenInfo,
                                    propsToTween
                                );
                                tween.Play();

                                tween.Completed.Connect(() => tween.Destroy());
                            }
                        },
                    }}
                />
            )}
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