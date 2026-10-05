import { useEffect, useCallback } from "react"
import { Pressable, View, Button } from "react-native"

import useResponsiveStyles from "@/hooks/useResponsiveStyles";

import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider"

import useNavigationIntent from "@/hooks/useNavigationIntent";

import Divider from "@/components/Divider"
import { Header1 } from "@/components/Header"
import Space from "@/components/Space"

import colors from "@/styles/Colors"

export default function LogoutModal() {
    const { dialogStyles, layoutStyles } = useResponsiveStyles()

    const { isLoggedIn, signOut } = useAuthContext()

    const { followIntent, toSource } = useNavigationIntent()

    useEffect(() => {
        if (isLoggedIn)
            return

        followIntent()
    }, [isLoggedIn, followIntent])

    const onLogOutPress = useCallback(() => { signOut() }, [signOut])

    return (
        <Pressable style={dialogStyles.dialogBackdrop} onPress={toSource}>
            <Pressable style={dialogStyles.dialogContainer} accessibilityViewIsModal>
                <Divider>
                    <Header1>Log out</Header1>
                </Divider>

                <Space />

                <View style={[dialogStyles.dialogContainerButtons, layoutStyles.defaultRowContainer]}>
                    <Button title="Cancel" color={colors.secondaryButtonColor} onPress={toSource} />

                    <Space />

                    <Button title="LogOut" onPress={onLogOutPress} />
                </View>
            </Pressable>
        </Pressable>
    )
}