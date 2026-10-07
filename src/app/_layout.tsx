import { Stack } from "expo-router";

import { AppDependenciesProvider } from "@/shared/dependencies/AppDependenciesProvider";
import { AuthContextProvider } from "@/shared/auth/contexts/AuthContextProvider";

import ToastHost from "@/services/toast/components/ToastHost";

import HeaderMenu from "@/components/HeaderMenu";
import useNavigationIntentRedirect from "@/hooks/useNavigationIntentRedirect";

export default function RootLayout() {
  useNavigationIntentRedirect()
  
  return (
    <>
      <AppDependenciesProvider>
        <AuthContextProvider>
          <Stack screenOptions={{
            headerShown: true,
            headerRight: () => <HeaderMenu />,
          }}>

            <Stack.Screen name="index" />
            <Stack.Screen name="dogs/overview" />
            <Stack.Screen name="dogs/details"  />

            <Stack.Screen name="auth/login" options={{ headerShown: false, presentation: "transparentModal" }} />
            <Stack.Screen name="auth/logout" options={{ headerShown: false, presentation: "transparentModal" }} />
            <Stack.Screen name="appointments/book" options={{ headerShown: false, presentation: "transparentModal" }} />

            <Stack.Screen name="menus/main" options={{ headerShown: false, presentation: "transparentModal" }} />
          </Stack>
        </AuthContextProvider>
      </AppDependenciesProvider>

      <ToastHost />
    </>
  )
}

