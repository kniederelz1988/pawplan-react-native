import { useEffect } from "react"
import { Text, View, Image } from "react-native"

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

import useNavigation, { Operations } from "@/hooks/useNavigation"
import useResponsiveStyles from "@/hooks/useResponsiveStyles";
import { withPressableButton } from "@/hocs/withPressableButton"
import { Calendar } from "lucide-react-native"
import colors from "@/styles/Colors"

const BookAppointmentButton = withPressableButton(Calendar)

type DogDetailsCardProps = {
    dog: Dog
}

function DogDetailsCard({ dog }: DogDetailsCardProps) {
    const { push } = useNavigation()
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
                        <Image
                            style={cardStyles.itemImage}
                            accessible
                            accessibilityRole="image"
                            accessibilityLabel={`Photo of ${dog.name}`}
                            source={{ uri: dog.imageURL }}
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
                    <Header1>{dog.name}</Header1>
                    <SubHeader2>{getDogAge(dog)}</SubHeader2>

                    <Space />

                    <View style={cardStyles.itemButtons}>
                        <BookAppointmentButton
                            style={{ justifyContent: "center" }}
                            title={`Book an appointment with ${dog.name}`}
                            size={18}
                            color={colors.defaultButtonText}
                            onPress={() => {
                                push("/appointments/book", Operations.New("/appointments/book"), { dogId: dog.id ?? "" })
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

    useEffect(() => {
        ratingsFilter(dog)
    }, [ratingsFilter, dog])

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
                    <Header1 accessibilityRole="header" style={globalStyles.textCenter}>About {dog.name}</Header1>
                </Divider>

                <Text accessibilityRole="text">{dog.description}</Text>

                <Space />
                <Space />
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

