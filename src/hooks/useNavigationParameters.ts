import { useEffect, useMemo } from "react";

import { RoutePath, useRoute } from "expo-router";
import { RouteProp } from "expo-router/build/react-navigation";

export type NavigationIntent = RoutePath
export type NavigationIntentSource = RoutePath

export type NavigationParams = Record<string, string | string[] | undefined>

type Route = RouteProp<{
  root: {
    intent?: NavigationIntent,
    intentInit?: string

    source: NavigationIntentSource
  }
}>;

export function useNavigationParameters<T extends NavigationParams>() {
  const route = useRoute<Route>()

  const intent = route.params ? route.params.intent as NavigationIntent : undefined
  const intentInit = route.params ? route.params.intentInit === "true" : false
  const intentSource = route.params ? route.params.source as NavigationIntent : undefined

  const path = route.name as RoutePath 

  const routeParameters = useMemo<T>(() => {
    if (!route.params)
      return {} as T

    return (({ intent, source, intentInit, ...rest }) => rest as T)(route.params)
  }, [route.params])
  useEffect(() => console.log( routeParameters ), [routeParameters])

  return { intentParameters: { intent, intentInit, intentSource }, routeParameters, routePath: path }
}
