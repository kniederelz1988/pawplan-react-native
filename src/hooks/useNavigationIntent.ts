import { useCallback } from "react"

import useNavigation, { NavigationParams, NavigationPath } from "@/hooks/useNavigation"

export default function useNavigationIntent<T extends NavigationParams>() {
    const navigation = useNavigation()

    const followIntent = useCallback(() => {
        if (navigation.followIntent("keep"))
            return

        if (navigation.back())
            return

        navigation.replace("/", { flag: "clear" })
    }, [navigation])

    const toSource = useCallback(() => {
        if (navigation.toSource("clear"))
            return

        if (navigation.back())
            return
    
        navigation.replace("/", { flag: "clear" })
    }, [navigation])

    const redirect = useCallback((route: NavigationPath) => {
        navigation.replace(route, { flag: "keep" })
    }, [navigation])

    return { parameters: navigation.routeParameters as T, followIntent, toSource, redirect }
}