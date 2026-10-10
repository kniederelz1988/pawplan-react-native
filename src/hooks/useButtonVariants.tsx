import { useMemo } from "react";
import { StyleProp } from "react-native";
import { ViewStyle, TextStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

import useResponsiveStyles from "@/hooks/useResponsiveStyles";

type ButtonVariantName = "default" | "cancel" | "plain";

export type ButtonVariantProps = {
    variant?: ButtonVariantName
}
type ButtonVariant = {
    base: StyleProp<ViewStyle>;
    hover?: StyleProp<ViewStyle>;
    selected?: StyleProp<ViewStyle>;
    disabled?: StyleProp<ViewStyle>;
    textBase: StyleProp<TextStyle>;
    textHover?: StyleProp<TextStyle>;
    textSelected?: StyleProp<TextStyle>;
    textDisabled?: StyleProp<TextStyle>;
}

export default function useButtonVariants(variant: ButtonVariantName = "default"): ButtonVariant {
    const { buttonStyles } = useResponsiveStyles()

    const variants = useMemo(() => {
        return {
            "default": {
                base: buttonStyles.defaultColors,
                hover: buttonStyles.defaultColors_onHover,
                selected: buttonStyles.defaultColors_onSelected,
                disabled: buttonStyles.defaultColors_onDisabled,

                textBase: buttonStyles.defaultText,
                textHover: buttonStyles.defaultText_onHover,
                textSelected: buttonStyles.defaultText_onSelected,
                textDisabled: buttonStyles.defaultText_onDisabled
            },
            "cancel": {
                base: buttonStyles.cancelButton,
                hover: buttonStyles.cancelButton_onHover,
                selected: buttonStyles.cancelButton_onSelected,
                disabled: buttonStyles.cancelButton_onDisabled,

                textBase: buttonStyles.defaultText,
                textHover: buttonStyles.defaultText_onHover,
                textSelected: buttonStyles.defaultText_onSelected,
                textDisabled: buttonStyles.defaultText_onDisabled
            },
            "plain": {
                base: buttonStyles.plainButton,

                textBase: buttonStyles.plainButtonText
            }
        }
    }, [buttonStyles])

    return variants[variant]
}
