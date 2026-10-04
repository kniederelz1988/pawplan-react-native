import { useMemo } from "react";
import { ScrollView } from "react-native"

import { Stack, useLocalSearchParams } from "expo-router"

import DogDetails from "@/features/dogs/components/DogDetails"

import useResponsiveStyles from "@/hooks/useResponsiveStyles";
import useDogsCollection from "@/shared/repositories/hooks/DogHooks";

export default function DogDetailsPage() {
    const { globalStyles } = useResponsiveStyles()

    const { dogId } = useLocalSearchParams<{ dogId: string }>()
    const { dogs } = useDogsCollection([dogId])
    const dog = useMemo(() => { return dogs.at(0) ?? null }, [dogs])

    if (!dog) {
        return null
    }

    return (
        <>
            <Stack.Title>{dog.name}</Stack.Title>
            
            <ScrollView style={globalStyles.app} contentContainerStyle={globalStyles.appContentContainer} >
                <DogDetails dog={dog} />
            </ScrollView >
        </>
    )
}
