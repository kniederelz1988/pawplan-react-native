import { useMemo } from "react";

import { RoutePath, useGlobalSearchParams, useRoute } from "expo-router";

export type NavigationIntent = RoutePath
export type NavigationIntentSource = RoutePath

export type NavigationParams = Record<string, string | string[]>
export type IntentNavigationParams = {
  intent: NavigationIntent,
  intentInit: boolean,
  intentSource: NavigationIntent
}

export function useNavigationParameters() {
  const params = useGlobalSearchParams<NavigationParams>()
  const route = useRoute()

  const intent = params?.intent as NavigationIntent
  const intentInit = params?.intentInit === "true"
  const intentSource = params?.source as NavigationIntent

  const intentParameters = useMemo<IntentNavigationParams>(() => {
    return { intent: intent, intentInit: intentInit, intentSource: intentSource }
  }, [intent, intentInit, intentSource])

  const routeParameters = useMemo<NavigationParams>(() => {
    return (({ intent, source, intentInit, ...rest }) => (rest))(params)
  }, [params])

  return { intentParameters, routeParameters, routePath: route.name as RoutePath }
}
