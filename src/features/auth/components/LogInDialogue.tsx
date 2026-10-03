import { Pressable, View, Button } from "react-native"

import Divider from "@/components/Divider"

import { Header1 } from "@/components/Header"
import Space from "@/components/Space"

import LogInButton from "@/features/auth/components/LogInButton"

import useResponsiveStyles from "@/styles/hooks/useResponsiveStyles";

type Props = {
    onClose: () => void
}

export default function LogInDialogue({ onClose }: Props) {
    const { dialogStyles, layoutStyles } = useResponsiveStyles()

    return (
        <Pressable style={dialogStyles.dialogContainer}>
            <Divider>
                <Header1>Login</Header1>
            </Divider>

            <Space />

            <View style={[dialogStyles.dialogContainerButtons, layoutStyles.defaultRowContainer]}>
                <Button title="Cancel" color={"grey"} onPress={onClose} />

                <Space />

                <LogInButton />
            </View>
        </Pressable>
    )
}


