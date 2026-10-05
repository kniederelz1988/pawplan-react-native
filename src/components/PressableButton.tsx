import { useState } from "react";
import { Pressable, Text } from "react-native";

import useResponsiveStyles from "@/hooks/useResponsiveStyles";

type Props = {
    title: string,
    onPress: () => void
}

export default function PressableButton({ title, onPress }: Props) {
    const { menuStyles } = useResponsiveStyles()

    const [hoverState, setHoverState] = useState(false)

    return <Pressable
        style={[menuStyles.menuItem, hoverState && menuStyles.menuItemHover]}
        accessible
        accessibilityRole="button"
        accessibilityLabel={title}
        onHoverIn={() => setHoverState(true)}
        onHoverOut={() => setHoverState(false)}
        onPress={onPress}
    >
        <Text accessible={false}>{title}</Text>
    </Pressable>;
}