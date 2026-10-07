import { useCallback } from "react"
import { RoutePath, useRouter } from "expo-router"
import { NavigationIntent, NavigationIntentSource, NavigationParams } from "./useNavigationParameters"

export default function useNavigationRouter() {
    const { push, replace, canDismiss, dismissTo, canGoBack, back } = useRouter()

    const routerPush = useCallback((path: RoutePath, intent?: NavigationIntent, source?: NavigationIntentSource, params?: NavigationParams): boolean => {
        push({ pathname: path, params: { ...params, intent: intent, source: source } })
        return true
    }, [push])
    const routerReplace = useCallback((path: RoutePath, intent?: NavigationIntent, source?: NavigationIntentSource, params?: NavigationParams): boolean => {
        replace({ pathname: path, params: { ...params, intent: intent, source: source } })
        return true
    }, [replace])
    const routerDismiss = useCallback((path: RoutePath, intent?: NavigationIntent, source?: NavigationIntentSource, params?: NavigationParams): boolean => {
        if (!canDismiss())
            return false

        dismissTo({ pathname: path, params: { ...params, intent: intent, source: source } })
        return true
    }, [canDismiss, dismissTo])
    const routerBack = useCallback((): boolean => {
        if (!canGoBack())
            return false

        back()
        return true
    }, [canGoBack, back])

    const routerHasNavigation = useCallback(() => (canGoBack() || canDismiss()), [canGoBack, canDismiss])

    return { routerPush, routerReplace, routerDismiss, routerBack, routerHasNavigation }
}
