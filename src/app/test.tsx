import { Button, ScrollView, Text } from "react-native";
import { router } from "expo-router";

import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider";

import useResponsiveStyles from "@/styles/hooks/useResponsiveStyles";

export default function Test() {
    const { globalStyles } = useResponsiveStyles()
    
    const { user } = useAuthContext()

    return (
        <ScrollView style={globalStyles.app} contentContainerStyle={globalStyles.appContentContainer}>
            <Text>{user ? `logged in: ${user.userId}` : "not loggedin"}</Text>
            <Button title="Login" onPress={() => {
                router.push({pathname: "/auth/login"})
            }} />
        </ScrollView>
    );
}
