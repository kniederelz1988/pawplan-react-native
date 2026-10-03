import { Stack } from "expo-router";

import { AppDependenciesProvider } from "@/shared/dependencies/AppDependenciesProvider";
import { AuthContextProvider } from "@/shared/auth/contexts/AuthContextProvider";

import ToastHost from "@/services/toast/components/ToastHost";

import HeaderMenu from "@/components/Menu";

export default function RootLayout() {
  return (
    <>
      <AppDependenciesProvider>
        <AuthContextProvider>
          <Stack screenOptions={{
            headerShown: false,
            headerRight: () => <HeaderMenu />,
          }}>

            <Stack.Screen name="index" />
            <Stack.Screen name="test" options={{ title: "Test" }} />
            <Stack.Screen name="dogs" />
            <Stack.Screen name="dogs/details" />

            <Stack.Screen name="auth/login" options={{ presentation: "transparentModal" }} />
            <Stack.Screen name="appointments/book" options={{ presentation: "transparentModal" }} />

          </Stack>
        </AuthContextProvider>
      </AppDependenciesProvider>

      <ToastHost />
    </>
  )
}

