import { View } from "react-native";

import useResponsiveStyles from "@/styles/hooks/useResponsiveStyles";

export function Spacer() {
    const { globalStyles } = useResponsiveStyles();

    return <View style={globalStyles.spacer} />;
}
