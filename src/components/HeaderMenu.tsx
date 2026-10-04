import { useCallback, useState } from "react"
import { Pressable, Text } from "react-native"

import useResponsiveStyles from "@/hooks/useResponsiveStyles";
import useNavigation from "@/hooks/useNavigation";

import { Menu } from "@/components/Menu";

export default function HeaderMenu() {
    const { menuStyles } = useResponsiveStyles()

    const navigation = useNavigation()

    const [state, setState] = useState(false)

    const onCloseCallback = useCallback(() => setState(false), [navigation, setState])

    return <>
        <Pressable style={menuStyles.menuButton} accessibilityRole="button" accessibilityLabel="Open menu"
            onPress={() => setState(true)} >
            {
                state ? <Text>X</Text> : <Text>⋮</Text>
            }
        </Pressable>

        <Menu state={state} onClose={onCloseCallback} />
    </>
}
