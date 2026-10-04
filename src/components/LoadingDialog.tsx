import { Text, View } from "react-native"

import useResponsiveStyles from "@/hooks/useResponsiveStyles";

export default function LoadingDialogue() {
    return (
        <View
            accessibilityRole="progressbar"
            accessibilityLabel="Loading"
            accessibilityState={{ busy: true }}
        >
            <Text>Loading...</Text>
        </View>
    )
}