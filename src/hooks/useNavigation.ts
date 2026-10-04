import { useCallback, useEffect } from "react"
import { RoutePath, useRoute, useRouter } from "expo-router"
import { useNavigationParameters } from "@/hooks/useNavigationParameters"

export type Intent = "bookAppointment"

type IntentFlag = "keep" | "new" | "clear"
type IntentData =
    { flag: "keep" } |
    { flag: "new", data: Intent } |
    { flag: "clear" }

export type NavigationParams = Record<string, string | string[] | undefined>
export type NavigationPath = RoutePath

const routes: Record<Intent, RoutePath> = {
    "bookAppointment": "/appointments/book",
}

export default function useNavigation() {
    const router = useRouter()
    const route = useRoute()

    const { intentParameters, routeParameters } = useNavigationParameters()

    const push = useCallback((path: RoutePath, intent: IntentData, params?: NavigationParams): boolean => {
        switch (intent.flag) {
            case "keep":
                router.push({ pathname: path, params: { source: intentParameters.intentSource, intent: intentParameters.intent, ...routeParameters, ...params } })
                break
            case "new":
                router.push({ pathname: path, params: { source: route.name, intent: intent.data, ...params } })
                break
            case "clear":
                router.push({ pathname: path, params: { ...routeParameters, ...params } })
                break
        }

        return true
    }, [router, route, intentParameters, routeParameters])
    const replace = useCallback((path: RoutePath, intent: IntentData, params?: NavigationParams): boolean => {
        switch (intent.flag) {
            case "keep":
                router.replace({ pathname: path, params: { intent: intentParameters.intent, source: intentParameters.intentSource, ...routeParameters, ...params } })
                break;
            case "new":
                router.replace({ pathname: path, params: { source: route.name, intent: intent.data, ...params } })
                break
            case "clear":
                router.replace({ pathname: path, params: { ...routeParameters, ...params } })
                break
        }

        return true
    }, [router, route, intentParameters, routeParameters])
    const dismiss = useCallback((path: RoutePath, intent: IntentData, params?: NavigationParams): boolean => {
        if (!router.canDismiss())
            return false

        switch (intent.flag) {
            case "keep":
                router.dismissTo({ pathname: path, params: { intent: intentParameters.intent, source: intentParameters.intentSource, ...routeParameters, ...params } })
                break;
            case "new":
                router.dismissTo({ pathname: path, params: { source: route.name, intent: intent.data, ...params } })
                break
            case "clear":
                router.dismissTo({ pathname: path, params: { ...routeParameters, ...params } })
                break
        }

        return true
    }, [router, route, intentParameters, routeParameters])

    const followIntent = useCallback((intentFlag: IntentFlag, params?: NavigationParams): boolean => {
        if (!intentParameters.intent)
            return false

        return replace(routes[intentParameters.intent], { flag: intentFlag, data: intentParameters.intent }, params)
    }, [intentParameters, replace])

    const toSource = useCallback((intentFlag: IntentFlag, params?: NavigationParams): boolean => {
        if (!intentParameters.intent || !intentParameters.intentSource)
            return false

        if (dismiss(intentParameters.intentSource, { flag: intentFlag, data: intentParameters.intent }, params))
            return true

        return replace(intentParameters.intentSource, { flag: intentFlag, data: intentParameters.intent }, params)
    }, [intentParameters, dismiss, replace])

    const back = useCallback((): boolean => {
        if (!router.canGoBack())
            return false

        router.back()
        return true
    }, [router])

    const initIntent = useCallback(() => {
        if (!router.canGoBack())
            return toSource("keep", { intentInit: "true" })

        if (intentParameters.intent && intentParameters.intentInit)
            return followIntent("keep")
    }, [router, intentParameters, toSource, followIntent])

    useEffect(() => {
        const timeout = setTimeout(initIntent, 100)

        return () => clearTimeout(timeout)
    })



    return { routeParameters, followIntent, toSource, replace, push, back }
}
