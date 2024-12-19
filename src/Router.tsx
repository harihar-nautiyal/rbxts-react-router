import React, {
    Children,
    createContext,
    PropsWithChildren,
    ReactChildren,
    useCallback,
    useContext,
    useState,
} from "@rbxts/react";

interface RouterContextType {
    currentPath: string;
    navigate: (path: string) => void;
    params: Map<string, string>;
}

type RouterProviderProps = PropsWithChildren<{
    initialPath?: string;
}>;

type RoutesProps = PropsWithChildren<{}>;

interface RouteProps {
    path: string;
    component: React.ComponentType;
}

interface LinkProps {
    to: string;
    children: React.ReactNode;
}

const RouterContext = createContext<RouterContextType>({
    currentPath: "/",
    navigate: () => {},
    params: new Map(),
});
export const RouterProvider = (
    { children, initialPath = "/" }: RouterProviderProps,
) => {
    const [currentPath, setCurrentPath] = useState(initialPath);
    const [params] = useState(new Map<string, string>());

    const navigate = useCallback((path: string) => {
        setCurrentPath(path);
    }, []);

    return (
        <RouterContext.Provider value={{ currentPath, navigate, params }}>
            {children}
        </RouterContext.Provider>
    );
};

export const Routes = ({ children }: RoutesProps) => {
    return (
        <frame BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)}>
            {children}
        </frame>
    );
};

export const Route: React.FC<RouteProps> = ({ path, component: Component }) => {
    const { currentPath } = useRouter();

    const matchRoute = (
        routePath: string,
        currentPath: string,
    ): { isMatch: boolean; params: Map<string, string> } => {
        const routeParts = string.split(routePath, "/").filter((part) =>
            part !== ""
        );
        const currentParts = string.split(currentPath, "/").filter((part) =>
            part !== ""
        );

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

    return isMatch ? <Component /> : undefined;
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
