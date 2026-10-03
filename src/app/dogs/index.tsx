import { ScrollView } from "react-native";

import DogOverview from "@/features/dogs/components/DogOverview";

import useResponsiveStyles from "@/styles/hooks/useResponsiveStyles";

export default function DogIndexPage() {
    const { globalStyles } = useResponsiveStyles()
        
    return (
        <ScrollView style={globalStyles.app} contentContainerStyle={globalStyles.appContentContainer}>
            <DogOverview />
        </ScrollView>
    )
}