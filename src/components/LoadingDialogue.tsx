import { Text, View } from "react-native"

export default function LoadingDialogue() {
    return (
        <View
            accessibilityRole="progressbar"
            accessibilityLabel="Loading"
            accessibilityState={{ busy: true }}
        >
            <Text accessible={false}>Loading...</Text>
        </View>
    )
}