import { StyleProp, View, ViewStyle } from "react-native";

import useResponsiveStyles from "@/styles/hooks/useResponsiveStyles";

type Props = {
    style?: StyleProp<ViewStyle>
}

export default function Space({ style }: Props) {
    const { globalStyles } = useResponsiveStyles()

    return <View style={[globalStyles.space, style]} />;
}
