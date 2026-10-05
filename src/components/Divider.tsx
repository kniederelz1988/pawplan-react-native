import { PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import useResponsiveStyles from "@/hooks/useResponsiveStyles";

declare type Props = {
    viewStyle?: StyleProp<ViewStyle>,
    lineStyle?: StyleProp<ViewStyle>
} & PropsWithChildren

export default function Divider({ viewStyle, lineStyle, children } : Props) {
    const { globalStyles } = useResponsiveStyles()
    
    return (
        <View accessible={false} style={[ viewStyle, globalStyles.dividerViewStyle]}>
            <View style={[ lineStyle, globalStyles.dividerLineStyle, globalStyles.dividerLineStyleStart ]} />
            <View>
                {children}
            </View>
            <View style={[ lineStyle, globalStyles.dividerLineStyle, globalStyles.dividerLineStyleEnd ]} />
        </View>
    )
}