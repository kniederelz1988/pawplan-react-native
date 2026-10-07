import { useCallback, useEffect } from "react"
import { IntentNavigationParams, NavigationParams, useNavigationParameters } from "@/hooks/useNavigationParameters"
import useNavigationRouter from "@/hooks/useNavigationRouter"
import useNavigation from "./useNavigation"

export default function useNavigationIntentRedirect() {
    const { intentParameters, routeParameters } = useNavigationParameters()
    const { routerPush, routerReplace, routerHasNavigation } = useNavigationRouter()

    const initIntent = useCallback((intentParameters: IntentNavigationParams, routeParameters: NavigationParams) => {
        if (!intentParameters.intentInit)
            return routerReplace(
                intentParameters.intentSource,
                intentParameters.intent,
                intentParameters.intentSource,
                {
                    intentInit: "true",
                    ...routeParameters
                }
            )

        return routerPush(
            intentParameters.intent,
            intentParameters.intent,
            intentParameters.intentSource,
            routeParameters
        )
    }, [routerReplace, routerPush])

    useEffect(() => {
        if(routerHasNavigation())
            return

        if (!intentParameters.intentSource || !intentParameters.intent)
            return

        initIntent(intentParameters, routeParameters)
    }, [initIntent, routerHasNavigation, intentParameters, routeParameters])

}