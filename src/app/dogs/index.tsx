import { ScrollView } from "react-native";

import DogOverview from "@/features/dogs/components/DogOverview";

import useResponsiveStyles from "@/hooks/useResponsiveStyles";
import { Stack } from "expo-router";

export default function DogIndexPage() {
    const { globalStyles } = useResponsiveStyles()

    return (
        <>
            <Stack.Title>Dogs</Stack.Title>
            <ScrollView style={globalStyles.app} contentContainerStyle={globalStyles.appContentContainer}>
                <DogOverview />
            </ScrollView>
        </>
    )
}