import { PropsWithChildren, useState } from "react";
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";

import useButtonVariants, { ButtonVariantProps } from "../hooks/useButtonVariants";
import useResponsiveStyles from "@/hooks/useResponsiveStyles";

export type PressableButtonProps = {
    title: string,
    state?: PressableButtonState,
    style?: StyleProp<ViewStyle>,
    textStyle?: StyleProp<TextStyle>,

    onPress: () => void
} & ButtonVariantProps & PropsWithChildren

interface PressableButtonState {
    disabled?: boolean | undefined;
    selected?: boolean | undefined;
    checked?: boolean | 'mixed' | undefined;
    busy?: boolean | undefined;
    expanded?: boolean | undefined;
}

export default function PressableButton({
    variant,
    title,
    state,
    style,
    textStyle,
    children,
    onPress
}: PressableButtonProps) {
    const { buttonStyles } = useResponsiveStyles()
    const buttonVariant = useButtonVariants(variant)

    const [hoverState, setHoverState] = useState(false)

    return <Pressable
        style={[
            buttonStyles.defaultButton, buttonVariant.base, style,
            (state?.selected || hoverState) && buttonVariant.hover,
            state?.checked && buttonVariant.selected,
            state?.disabled && buttonVariant.disabled,
        ]}
        accessible
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={state}
        disabled={state?.disabled}
        onHoverIn={() => setHoverState(true)}
        onHoverOut={() => setHoverState(false)}
        onPress={onPress}
    >
        {children}

        <Text
            style={[
                buttonStyles.defaultText, buttonVariant.textBase, textStyle,
                (state?.selected || hoverState) && buttonVariant.textHover,
                state?.checked && buttonVariant.textSelected,
                state?.disabled && buttonVariant.textDisabled,
            ]}
            accessible={false}
        >
            {title}
        </Text>
    </Pressable>
}