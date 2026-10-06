import { useCallback } from "react"
import { Pressable, Text } from "react-native"

import useResponsiveStyles from "@/hooks/useResponsiveStyles";
import useNavigation, { Operations } from "@/hooks/useNavigation";

export default function HeaderMenu() {
    const { menuStyles } = useResponsiveStyles()

    const { push } = useNavigation()

    const openMenuCallback = useCallback(() => push("/menus/main", Operations.Clear), [push])

    return <>
        <Pressable
            style={menuStyles.menuButton}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={openMenuCallback} 
        >
            <Text accessible={false}>{"⋮"}</Text>
        </Pressable>
    </>
}
