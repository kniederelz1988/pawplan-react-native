import { useCallback } from "react";
import { Pressable, View, Button } from "react-native"

import useResponsiveStyles from "@/hooks/useResponsiveStyles";
import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider";

import Divider from "@/components/Divider"
import { Header1 } from "@/components/Header"
import Space from "@/components/Space"

import colors from "@/styles/Colors"

type Props = {
    onClose: () => void
}

export default function LogOutDialogue({ onClose }: Props) {
    const { signOut } = useAuthContext()

    const { dialogStyles, layoutStyles } = useResponsiveStyles()

    const onLogOutPress = useCallback(() => { signOut() }, [signOut])

    return (
        <Pressable style={dialogStyles.dialogContainer}>
            <Divider>
                <Header1>LogOut</Header1>
            </Divider>

            <Space />

            <View style={[dialogStyles.dialogContainerButtons, layoutStyles.defaultRowContainer]}>
                <Button title="Cancel" color={colors.secondaryButtonColor} onPress={onClose} />

                <Space />

                <Button title="LogOut" onPress={onLogOutPress} />
            </View>
        </Pressable>
    )
}


