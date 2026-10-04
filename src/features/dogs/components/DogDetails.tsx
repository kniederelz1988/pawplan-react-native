import { useEffect } from "react"
import { Text, View, Button, Image } from "react-native"

import useNavigation from "@/hooks/useNavigation"

import { useVolunteer } from "@/shared/repositories/hooks/VolunteerHooks"

import { Dog } from "@/domain/Dog"
import { getDogAge } from "@/domain/utils/DogHelpers"

import AppointmentRatingCard from "@/features/appointments/components/AppointmentRatingCard"
import { useAppointmentRatingsFilteredByDog } from "@/shared/repositories/hooks/AppointmentHooks"

import DogLikeButton from "@/features/dogs/components/DogLikeButton"
import DogGenderIcon from "@/features/dogs/components/DogGenderIcon"
import DogSizeIcon from "@/features/dogs/components/DogSizeIcon"

import { Header1, Header2, SubHeader2 } from "@/components/Header"
import Space from "@/components/Space"
import Divider from "@/components/Divider"
import { ListView } from "@/components/ListView"

import useResponsiveStyles from "@/hooks/useResponsiveStyles";

type DogDetailsCardProps = {
    dog: Dog
}

function DogDetailsCard({ dog }: DogDetailsCardProps) {
    const navigation = useNavigation()
    const { cardStyles } = useResponsiveStyles()

    const { volunteer } = useVolunteer()

    return (
        <View style={cardStyles.item}>
            <View style={cardStyles.itemWrapper}>
                <View style={cardStyles.itemHeader}>

                    {volunteer &&
                        <View style={[cardStyles.overlayItem, { left: 16, top: 16, width: "15%", aspectRatio: 1, display: "none" }]}>
                            <View style={[cardStyles.overlayItemContent]}>
                                <Text>E</Text>
                            </View>
                        </View>
                    }

                    {volunteer &&
                        <View style={[cardStyles.overlayItem, { right: 16, top: 16, width: "15%", aspectRatio: 1 }]}>
                            <DogLikeButton
                                data={dog}
                                style={[cardStyles.overlayItemContent]}
                            />
                        </View>
                    }

                    <View style={cardStyles.itemImageContainer}>
                        <Image source={{ uri: dog.imageURL }}
                            style={cardStyles.itemImage}
                        />
                    </View>

                    <View style={[cardStyles.overlayItem, { left: 16, bottom: 16, width: "10%", aspectRatio: 1 }]}>
                        <DogGenderIcon
                            gender={dog.gender}
                            style={[cardStyles.overlayItemContent]}
                        />
                    </View>

                    <View style={[cardStyles.overlayItem, { right: 16, bottom: 16, width: "10%", aspectRatio: 1 }]}>
                        <DogSizeIcon
                            size={dog.size}
                            style={[cardStyles.overlayItemContent]}
                        />
                    </View>

                </View>

                <View style={cardStyles.itemContent}>
                    <Header1 accessibilityRole="header">{dog.name}</Header1>
                    <SubHeader2>{getDogAge(dog)}</SubHeader2>

                    <Space />

                    <View style={cardStyles.itemButtons}>
                        <Button title="Book appointment" onPress={() => {
                            navigation.push("/appointments/book", { flag: "new", data: "bookAppointment" }, { dogId: dog.id ?? "" })
                        }} />
                    </View>
                </View>
            </View>
        </View>
    )
}

type DogDetailsProps = {
    dog: Dog
}

export default function DogDetails({ dog }: DogDetailsProps) {
    const { globalStyles, layoutStyles } = useResponsiveStyles()

    const { ratings, for: ratingsFilter } = useAppointmentRatingsFilteredByDog(5)

    useEffect(() => ratingsFilter(dog))

    return (
        <View style={[globalStyles.contentContainer, layoutStyles.listContainer, layoutStyles.gapLarge, layoutStyles.defaultColumnContainer, layoutStyles.mediumRowContainer, layoutStyles.largeRowContainer]}>
            <View style={layoutStyles.rowSidebar}>
                <View style={{ width: "100%", maxWidth: 500, marginHorizontal: "auto" }}>
                    <View style={{ flexDirection: "column" }}>
                        <DogDetailsCard dog={dog} />
                    </View>
                </View>
            </View>

            <View style={layoutStyles.rowContent}>
                <Divider>
                    <Header2 accessibilityRole="header" style={globalStyles.textCenter}>Description</Header2>
                </Divider>

                <Text accessibilityRole="text">{dog.description}</Text>

                <Space />

                <Divider>
                    <Header2 accessibilityRole="header" style={globalStyles.textCenter}>Ratings</Header2>
                </Divider>

                <SubHeader2 accessibilityRole="summary">
                    {
                        ratings.length > 0
                            ? `${ratings.length} ratings found..`
                            : "No ratings found.."
                    }
                </SubHeader2>

                <Space />

                <ListView
                    data={ratings}

                    style={layoutStyles.list} containerStyle={[layoutStyles.listContainer, layoutStyles.gapLarge]} wrapperStyle={[layoutStyles.listWrapper, layoutStyles.gapLarge]}
                    keyExtractor={(rating) => rating.appointmentId}
                    renderItem={(rating) => <AppointmentRatingCard data={rating} />}
                />

            </View>
        </View>
    )
}

