import { useLocalSearchParams, RoutePath, useRoute } from "expo-router";
import { useMemo } from "react";

import { NavigationParams, Intent } from "@/hooks/useNavigation";

export function useNavigationParameters<T extends NavigationParams>() {
    const searchParameters = useLocalSearchParams()
    const route = useRoute()

    const intent = useMemo(() => searchParameters.intent as Intent, [searchParameters])
    const intentInit = useMemo(() => searchParameters.intentInit === "true", [searchParameters])
    const intentSource = useMemo(() => searchParameters.source as RoutePath, [searchParameters])

    const routeParameters = useMemo<T>(() => {
        if (!searchParameters)
            return {} as T

        return (({ intent, source, intentInit, ...rest }) => rest)(searchParameters) as T
    }, [searchParameters])

    return { intentParameters: { intent, intentInit, intentSource }, routeParameters, routeName: route.name}
}
