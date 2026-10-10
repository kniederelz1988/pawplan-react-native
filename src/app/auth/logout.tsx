import { useEffect, useCallback } from "react"
import { Pressable, View } from "react-native"
import { LogOut, X } from "lucide-react-native"

import { withPressableButton } from "@/hocs/withPressableButton"

import useResponsiveStyles from "@/hooks/useResponsiveStyles"

import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider"

import useNavigation from "@/hooks/useNavigation";

import Divider from "@/components/Divider"
import { Header1 } from "@/components/Header"
import Space from "@/components/Space"

const CancelButton = withPressableButton(X)
const LogoutButton = withPressableButton(LogOut)

export default function LogoutModal() {
    const { dialogStyles, layoutStyles } = useResponsiveStyles()

    const { isLoggedIn, signOut } = useAuthContext()

    const { toIntent, toSource } = useNavigation()

    useEffect(() => {
        if (isLoggedIn)
            return

        toIntent()
    }, [isLoggedIn, toIntent])

    const onLogOutPress = useCallback(() => { signOut() }, [signOut])

    return (
        <Pressable style={dialogStyles.dialogBackdrop} onPress={toSource}>
            <Pressable style={dialogStyles.dialogContainer} accessibilityViewIsModal>
                <Divider>
                    <Header1>Log out</Header1>
                </Divider>

                <Space />

                <View style={[dialogStyles.dialogContainerButtons, layoutStyles.defaultRowContainer]}>
                    <CancelButton title="Cancel" variant="cancel" onPress={toSource} />

                    <Space />

                    <LogoutButton title="Log out" onPress={onLogOutPress} />
                </View>
            </Pressable>
        </Pressable>
    )
}