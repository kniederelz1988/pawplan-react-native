import { Pressable, Text } from "react-native"

import useResponsiveStyles from "@/hooks/useResponsiveStyles";

export default function LoadingDialogue() {
    const { dialogStyles } = useResponsiveStyles()

    return (
        <Pressable style={dialogStyles.dialogContainer}>
            <Text>Loading...</Text>
        </Pressable>
    )
}