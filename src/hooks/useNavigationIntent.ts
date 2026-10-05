import { useCallback } from "react"

import useNavigation, { NavigationParams, NavigationPath } from "@/hooks/useNavigation"

export default function useNavigationIntent<T extends NavigationParams>() {
    const { 
        routeParameters,
        followIntent: navigationFollowIntent,
        toSource: navigationToSource,
        replace,
        back
    } = useNavigation()

    const followIntent = useCallback(() => {
        if (navigationFollowIntent("keep"))
            return

        if (back())
            return

        replace("/", { flag: "clear" })
    }, [navigationFollowIntent, back, replace])

    const toSource = useCallback(() => {
        if (navigationToSource("clear"))
            return

        if (back())
            return

        replace("/", { flag: "clear" })
    }, [navigationToSource, back, replace])

    const redirect = useCallback((route: NavigationPath) => {
        replace(route, { flag: "keep" })
    }, [replace])

    return { parameters: routeParameters as T, followIntent, toSource, redirect }
}