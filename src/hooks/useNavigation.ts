import { useCallback, useEffect } from "react"
import { RoutePath } from "expo-router"

import useNavigationRouter from "@/hooks/useNavigationRouter"
import { NavigationIntent, NavigationParams, useNavigationParameters } from "@/hooks/useNavigationParameters"

export type IntentOperation = "keep" | "new" | "clear"

export type IntentData =
    | { operation: "keep" }
    | { operation: "new"; intent?: NavigationIntent }
    | { operation: "clear" }

export const Operations = {
    Keep: ({ operation: "keep" }) as IntentData,
    New: (intent: NavigationIntent): IntentData => ({
        operation: "new",
        intent: intent,
    }),
    Clear: ({ operation: "clear" }) as IntentData
}

export default function useNavigation<T extends NavigationParams>() {
    const { routerPush, routerReplace, routerDismiss, routerBack, routerHasNavigation } = useNavigationRouter()

    const { intentParameters, routeParameters, routePath } = useNavigationParameters()

    const push = useCallback((path: RoutePath, flag: IntentData = Operations.Keep, params?: NavigationParams): boolean => {
        switch (flag.operation) {
            case "keep":
                return routerPush(path, intentParameters.intent, intentParameters.intentSource, { ...routeParameters, ...params })
            case "new":
                return routerPush(path, flag.intent, intentParameters.intentSource ?? routePath, params)
            case "clear":
                return routerPush(path, undefined, undefined, params)
        }
    }, [routerPush, routePath, intentParameters, routeParameters])
    const replace = useCallback((path: RoutePath, flag: IntentData = Operations.Keep, params?: NavigationParams): boolean => {
        switch (flag.operation) {
            case "keep":
                return routerReplace(path, intentParameters.intent, intentParameters.intentSource, { ...params, ...routeParameters })
            case "new":
                return routerReplace(path, flag.intent, intentParameters.intentSource ?? routePath, params)
            case "clear":
                return routerReplace(path, undefined, undefined, params)
        }
    }, [routerReplace, routePath, intentParameters, routeParameters])
    const dismiss = useCallback((path: RoutePath, flag: IntentData = Operations.Keep, params?: NavigationParams): boolean => {
        switch (flag.operation) {
            case "keep":
                return routerDismiss(path, intentParameters.intent, intentParameters.intentSource, { ...params, ...routeParameters })
            case "new":
                return routerDismiss(path, flag.intent, intentParameters.intentSource ?? routePath, params)
            case "clear":
                return routerDismiss(path, undefined, undefined, params)
        }
    }, [routerDismiss, routePath, intentParameters, routeParameters])

    const back = useCallback(() => { return routerBack() }, [routerBack])

    const reset = useCallback(() => {
        if (back())
            return true

        return replace("/", Operations.Clear)
    }, [back, replace])

    const toIntent = useCallback(() => {
        if (!intentParameters.intent)
            return reset()

        return replace(intentParameters.intent, Operations.Keep)
    }, [reset, replace, intentParameters])
    const toSource = useCallback(() => {
        if (!intentParameters.intentSource)
            return reset()

        if (dismiss(intentParameters.intentSource, Operations.Clear))
            return true

        return replace(intentParameters.intentSource, Operations.Clear)
    }, [reset, dismiss, replace, intentParameters])

    const initIntent = useCallback(() => {
        if (routerHasNavigation || !intentParameters.intentSource || !intentParameters.intent)
            return

        if (!intentParameters.intentInit)
            return replace(intentParameters.intentSource, Operations.Keep, { intentInit: "true" })

        return push(intentParameters.intent, Operations.Keep)
    }, [replace, push, routerHasNavigation, intentParameters])

    useEffect(() => { initIntent() }, [initIntent])

    return { parameters: routeParameters as T, push, replace, dismiss, back, toIntent, toSource }
}