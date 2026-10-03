import { RoutePath, UnknownOutputParams, useLocalSearchParams, useRoute, useRoutePath, useRouter } from "expo-router"
import { useEffect, useMemo } from "react"

type Intent = "bookAppointment"
type IntentFlag = "keep" | "new" | "clear"
type IntentData =
    { flag: "keep" } |
    { flag: "new", data: Intent } |
    { flag: "clear" }

type OperationFlag = "dismissTo" | "push" | "replace"

type Source = RoutePath

type Params = UnknownOutputParams


const routes: Record<Intent, RoutePath> = {
    "bookAppointment": "/appointments/book",
}

export default function useRouterNavigation() {
    const router = useRouter()
    const route = useRoute()

    const parameters = useLocalSearchParams()

    const currentIntent = useMemo(() => parameters.intent as Intent, [parameters])
    const currentIntentSource = useMemo(() => parameters.source as Source, [parameters])

    const routeParams = useMemo(() => parameters
        ? (({ intent: _intent, source: _source, initIntent: _initIntent, ...rest }) => rest)(parameters)
        : {}
        , [parameters])

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!router.canGoBack() && parameters.initIntent !== "true")
                return toSource("replace", "keep", { initIntent: "true", ...routeParams })
            
            if (currentIntent && parameters.initIntent === "true")
                return followIntent("push", "keep", routeParams)
        }, 100)

        return () => clearTimeout(timeout)
    }, [])

    function followIntent(operationFlag: OperationFlag = "replace", intentFlag: IntentFlag, params?: Params) {
        if (!currentIntent)
            return

        switch (operationFlag) {
            case "dismissTo":
                return dismissTo(routes[currentIntent], { flag: intentFlag, data: currentIntent }, params)
            case "push":
                return push(routes[currentIntent], { flag: intentFlag, data: currentIntent }, params)
            case "replace":
                return replace(routes[currentIntent], { flag: intentFlag, data: currentIntent }, params)
        }
    }
    function toSource(operationFlag: OperationFlag = "replace", intentFlag: IntentFlag, params?: Params) {
        if (!currentIntent || !currentIntentSource)
            return

        switch (operationFlag) {
            case "dismissTo":
                return dismissTo(currentIntentSource, { flag: intentFlag, data: currentIntent }, params)
            case "push":
                return push(currentIntentSource, { flag: intentFlag, data: currentIntent }, params)
            case "replace":
                return replace(currentIntentSource, { flag: intentFlag, data: currentIntent }, params)
        }
    }

    function dismissTo(path: RoutePath, intent: IntentData, params?: Params) {
        switch (intent.flag) {
            case "keep":
                return router.dismissTo({ pathname: path, params: { source: currentIntentSource, intent: currentIntent, ...params } })
            case "new":
                return router.dismissTo({ pathname: path, params: { source: route.name, intent: intent.data, ...params } })
            case "clear":
                return router.dismissTo({ pathname: path, params: params })
        }
    }


    function push(path: RoutePath, intent: IntentData, params?: Params) {
        switch (intent.flag) {
            case "keep":
                return router.push({ pathname: path, params: { source: currentIntentSource, intent: currentIntent, ...params } })
            case "new":
                return router.push({ pathname: path, params: { source: route.name, intent: intent.data, ...params } })
            case "clear":
                return router.push({ pathname: path, params: params })
        }
    }

    function replace(path: RoutePath, intent: IntentData, params?: Params) {
        switch (intent.flag) {
            case "keep":
                return router.replace({ pathname: path, params: { source: currentIntentSource, intent: currentIntent, ...params } })
            case "new":
                return router.replace({ pathname: path, params: { source: route.name, intent: intent.data, ...params } })
            case "clear":
                return router.replace({ pathname: path, params: params })
        }
    }

    return { followIntent, toSource, replace, push, routeParams }
}
