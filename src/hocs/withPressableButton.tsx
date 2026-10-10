import { LucideIcon, LucideProps } from "lucide-react-native"
import PressableButton, { PressableButtonProps } from "@/components/PressableButton"
import useResponsiveStyles from "@/hooks/useResponsiveStyles"
import colors from "@/styles/Colors"

export type WithPressableButtonProps = {
    size?: LucideProps["size"]
    width?: LucideProps["width"]
    height?: LucideProps["height"]
    color?: LucideProps["color"],
    fill?: LucideProps["fill"]
} & Omit<PressableButtonProps, "children">

export function withPressableButton(Icon: LucideIcon) {

    return function ComponentWithIcon({ style, width, height, size = 18, color = colors.defaultButtonText, fill, ...props }: WithPressableButtonProps) {
        const { layoutStyles } = useResponsiveStyles()

        return (
            <PressableButton style={[layoutStyles.defaultRowContainer, layoutStyles.gapSmall, style]} {...props}>
                <Icon width={width} height={height} size={size} color={color} fill={fill ?? "transparent"}/>
            </PressableButton>
        )
    }
}