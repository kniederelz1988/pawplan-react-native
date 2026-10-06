import { useCallback, useEffect } from "react"
import { Pressable, View, Button } from "react-native"

import useResponsiveStyles from "@/hooks/useResponsiveStyles";
import useNavigation from "@/hooks/useNavigation";
import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider";

import Divider from "@/components/Divider"
import { Header1 } from "@/components/Header"
import Space from "@/components/Space"

import colors from "@/styles/Colors"

export default function LoginModal() {
    const { dialogStyles, layoutStyles } = useResponsiveStyles()

    const { isLoggedIn, signIn } = useAuthContext()

    const { toIntent, toSource } = useNavigation()

    useEffect(() => {
        if (!isLoggedIn)
            return

        toIntent()
    }, [isLoggedIn, toIntent])

    const onLogInPress = useCallback(() => {
        // THIS IS FOR STREAMLINING LOGIN FOR DEV PORPUSES
        signIn("alexmorgan@pawplan.com", "morganalex")
    }, [signIn])

    return (
        <Pressable style={dialogStyles.dialogBackdrop} onPress={toSource}>
            <Pressable style={dialogStyles.dialogContainer} accessibilityViewIsModal>
                <Divider>
                    <Header1>Log in</Header1>
                </Divider>

                <Space />

                <View style={[dialogStyles.dialogContainerButtons, layoutStyles.defaultRowContainer]}>
                    <Button title="Cancel"
                        accessibilityLabel="Close"
                        color={colors.secondaryButtonColor}
                        onPress={toSource} />

                    <Space />

                    <Button accessibilityLabel="Log in" title="Log in" color={colors.primaryButtonColor} onPress={onLogInPress} />
                </View>
            </Pressable>
        </Pressable>
    )
}