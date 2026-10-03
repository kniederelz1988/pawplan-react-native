
import { ScrollView } from "react-native"

import { useLocalSearchParams } from "expo-router"

import DogDetails from "@/features/dogs/components/DogDetails"

import useResponsiveStyles from "@/styles/hooks/useResponsiveStyles";

export default function DogDetailsPage() {
    const { globalStyles } = useResponsiveStyles()

    const { dogId } = useLocalSearchParams<{ dogId: string }>()

    return (
        <ScrollView style={globalStyles.app} contentContainerStyle={globalStyles.appContentContainer}>
            <DogDetails dogId={dogId} />
        </ScrollView>
    )
}
