import { useCallback } from "react"
import { RoutePath } from "expo-router"

import useNavigationRouter from "@/hooks/useNavigationRouter"
import { NavigationIntent, NavigationParams, useNavigationParameters } from "@/hooks/useNavigationParameters"

export type IntentData =
    | { operation: "keep" }
    | { operation: "new", intent?: NavigationIntent }
    | { operation: "clear" }

export const Operations = {
    Keep: ({ operation: "keep" }) as IntentData,
    New: (intent?: NavigationIntent): IntentData => ({
        operation: "new",
        intent: intent,
    }),
    Clear: ({ operation: "clear" }) as IntentData
}

export default function useNavigation<T extends NavigationParams>() {
    const { intentParameters, routeParameters, routePath } = useNavigationParameters()
    const { routerPush, routerReplace, routerDismiss, routerBack } = useNavigationRouter()

    const push = useCallback((path: RoutePath, flag: IntentData = Operations.Keep, params?: NavigationParams): boolean => {
        console.log("push:", path, intentParameters.intent, intentParameters.intentSource, intentParameters.intentInit, params, routeParameters)
        switch (flag.operation) {
            case "keep":
                return routerPush(path, intentParameters.intent, intentParameters.intentSource, { ...params, ...routeParameters })
            case "new":
                return routerPush(path, flag.intent, intentParameters.intentSource ?? routePath, { ...params, ...routeParameters })
            case "clear":
                return routerPush(path, undefined, undefined, { ...params, ...routeParameters })
        }
    }, [routerPush, routePath, intentParameters, routeParameters])
    const replace = useCallback((path: RoutePath, flag: IntentData = Operations.Keep, params?: NavigationParams): boolean => {
        console.log("replace:", path, intentParameters.intent, intentParameters.intentSource, intentParameters.intentInit, params, routeParameters)
        switch (flag.operation) {
            case "keep":
                return routerReplace(path, intentParameters.intent, intentParameters.intentSource, { ...params, ...routeParameters })
            case "new":
                return routerReplace(path, flag.intent, intentParameters.intentSource ?? routePath, { ...params, ...routeParameters })
            case "clear":
                return routerReplace(path, undefined, undefined, { ...params, ...routeParameters })
        }
    }, [routerReplace, routePath, intentParameters, routeParameters])
    const dismiss = useCallback((path: RoutePath, flag: IntentData = Operations.Keep, params?: NavigationParams): boolean => {
        console.log("dismiss:", path, intentParameters.intent, intentParameters.intentSource, intentParameters.intentInit, params, routeParameters)
        switch (flag.operation) {
            case "keep":
                return routerDismiss(path, intentParameters.intent, intentParameters.intentSource, { ...params, ...routeParameters })
            case "new":
                return routerDismiss(path, flag.intent, intentParameters.intentSource ?? routePath, { ...params, ...routeParameters })
            case "clear":
                return routerDismiss(path, undefined, undefined, { ...params, ...routeParameters })
        }
    }, [routerDismiss, routePath, intentParameters, routeParameters])

    const back = useCallback(() => {
        return routerBack()
    }, [routerBack])

    const reset = useCallback(() => {
        if (back())
            return true

        return replace("/", Operations.Clear)
    }, [back, replace])

    const toIntent = useCallback((params?: NavigationParams) => {
        if (!intentParameters.intent)
            return reset()

        return replace(intentParameters.intent, Operations.Keep, params)
    }, [reset, replace, intentParameters])
    const toSource = useCallback(() => {
        if (!intentParameters.intentSource)
            return reset()

        if (dismiss(intentParameters.intentSource, Operations.Clear))
            return true

        return replace(intentParameters.intentSource, Operations.Clear)
    }, [reset, dismiss, replace, intentParameters])

    return { parameters: routeParameters as T, push, replace, dismiss, back, toIntent, toSource }
}