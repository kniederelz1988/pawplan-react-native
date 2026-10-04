import { Text, TextProps } from "react-native";

import useResponsiveStyles from "@/hooks/useResponsiveStyles";

function BaseHeader(props: TextProps) {
    return (
        <Text {...props}>
            {props.children}
        </Text>
    )
}

export function Header1({ style, children }: TextProps) {
    const { globalStyles } = useResponsiveStyles()

    return (
        <BaseHeader
            style={[globalStyles.header1, style]}
            accessibilityRole="header"
        >
            {children}
        </BaseHeader>
    )
}
export function SubHeader1({ style, children }: TextProps) {
    const { globalStyles } = useResponsiveStyles()

    return (
        <BaseHeader
            style={[globalStyles.subHeader1, style]}
        >
            {children}
        </BaseHeader>
    )
}

export function Header2({ style, children }: TextProps) {
    const { globalStyles } = useResponsiveStyles()

    return (
        <BaseHeader
            style={[globalStyles.header2, style]}
            accessibilityRole="header"
        >
            {children}
        </BaseHeader>
    )
}
export function SubHeader2({ style, children }: TextProps) {
    const { globalStyles } = useResponsiveStyles()

    return (
        <BaseHeader
            style={[globalStyles.subHeader2, style]}
        >
            {children}
        </BaseHeader>
    )
}