import { useCallback, useState } from "react"
import { Pressable, Text } from "react-native"

import useResponsiveStyles from "@/hooks/useResponsiveStyles";

import { Menu } from "@/components/Menu";

export default function HeaderMenu() {
    const { menuStyles } = useResponsiveStyles()

    const [state, setState] = useState(false)

    const onCloseCallback = useCallback(() => setState(false), [setState])

    return <>
        <Pressable
            style={menuStyles.menuButton}
            accessible
            accessibilityRole="button"
            accessibilityLabel={state ? "Close menu" : "Open menu"}
            accessibilityState={{ expanded: state }}
            onPress={() => setState(true)} >
            {
                <Text accessible={false}>{state ? "X" : "⋮"}</Text>
            }
        </Pressable>

        <Menu state={state} onClose={onCloseCallback} />
    </>
}
