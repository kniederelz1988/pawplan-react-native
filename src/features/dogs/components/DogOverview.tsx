import { useMemo } from "react";
import { Button, Image, ScrollView, Text, View } from "react-native";

import { Stack } from "expo-router";

import useRouterNavigation from "@/features/navigation/hooks/useRouterNavigation";

import { Dog } from "@/shared/data/Dog";
import { getDogAge } from "@/shared/data/utils/DogHelpers";
import useDogsCollection from "@/shared/repositories/hooks/DogHooks";

import DogLikeButton from "@/features/dogs/components/DogLikeButton";
import DogGenderIcon from "@/features/dogs/components/DogGenderIcon";
import DogSizeIcon from "@/features/dogs/components/DogSizeIcon";

import { useVolunteer } from "@/shared/repositories/hooks/VolunteerHooks";

import { Header2, SubHeader2 } from "@/components/Header";
import Space from "@/components/Space";
import Divider from "@/components/Divider";

import useResponsiveStyles from "@/styles/hooks/useResponsiveStyles";
import { useResponsiveColumnBasedOnSize } from "@/styles/hooks/useResponsiveColumn";
import { ListView } from "../../../components/ListView";

export function EmptyCard() {
    return (
        <View style={{ flex: 1 }} />
    )
}

type DogCardProps = {
    dog: Dog
}

export function DogCard({ dog }: DogCardProps) {
    const navigation = useRouterNavigation()
    const { cardStyles } = useResponsiveStyles()

    const { volunteer } = useVolunteer()

    return (
        <View style={cardStyles.item}>
            <View style={cardStyles.itemWrapper}>
                <View style={cardStyles.itemHeader}>

                    {volunteer &&
                        <View style={[cardStyles.overlayItem, { left: 16, top: 16, width: "15%", aspectRatio: 1, display: "none" }]}>
                            <View style={cardStyles.overlayItemContent}>
                                <Text>E</Text>
                            </View>
                        </View>
                    }

                    {volunteer &&
                        <View style={[cardStyles.overlayItem, { right: 16, top: 16, width: "15%", aspectRatio: 1 }]}>
                            <DogLikeButton
                                data={dog}
                                style={cardStyles.overlayItemContent}
                            />
                        </View>
                    }

                    <View style={cardStyles.itemImageContainer}>
                        <Image style={cardStyles.itemImage} source={{ uri: dog.imageURL }} />
                    </View>

                    <View style={[cardStyles.overlayItem, { left: 16, bottom: 16, width: "10%", aspectRatio: 1 }]}>
                        <DogGenderIcon style={cardStyles.overlayItemContent} gender={dog.gender} />
                    </View>

                    <View style={[cardStyles.overlayItem, { right: 16, bottom: 16, width: "10%", aspectRatio: 1 }]}>
                        <DogSizeIcon style={[cardStyles.overlayItemContent]} size={dog.size} />
                    </View>

                </View>

                <View style={cardStyles.itemContent}>
                    <Header2>{dog.name}</Header2>
                    <SubHeader2>{getDogAge(dog)}</SubHeader2>

                    <Space />

                    <View style={cardStyles.itemButtons}>
                        <Button title="More..." onPress={() => {
                            if (!dog?.id)
                                return

                            navigation.push("/dogs/details", { flag: "clear" }, { dogId: dog.id })
                        }} />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default function DogOverview() {
    const { globalStyles, layoutStyles } = useResponsiveStyles()

    const { dogs } = useDogsCollection([])

    const numColumns = useResponsiveColumnBasedOnSize(3, { "compact": 1, "medium": 2 })

    const allElements = useMemo<Array<Dog | null>>(() => {
        const elementCount = Math.ceil(dogs.length / numColumns) * numColumns
        const emptyCount = Math.max(0, elementCount - dogs.length)

        return [...dogs, ...Array.from({ length: emptyCount }, () => null)]
    }, [dogs, numColumns])

    return (
        <>
            <Stack.Title>Dogs</Stack.Title>

            <View style={[globalStyles.contentContainer]}>
                <Divider >
                    <Header2 accessibilityRole="header">Dogs</Header2>
                </Divider>

                <SubHeader2 accessibilityRole="summary">
                    {
                        dogs.length === 0 ? "No dogs found..."
                            : `${dogs.length} dogs found...`
                    }
                </SubHeader2>

                <Space />

                <ListView
                    data={allElements}
                    style={layoutStyles.list} containerStyle={[layoutStyles.listContainer, layoutStyles.gapLarge]} wrapperStyle={[layoutStyles.listWrapper, layoutStyles.gapLarge]}
                    numColumns={numColumns}
                    keyExtractor={(dog, index) => dog?.id ?? `empty-${index}`}
                    renderItem={(dog) => dog ? <DogCard dog={dog} /> : <EmptyCard />}
                />
            </View>
        </>
    )
}
