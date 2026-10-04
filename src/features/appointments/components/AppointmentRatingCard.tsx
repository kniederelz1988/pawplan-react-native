import { Text, View } from "react-native"
import { Star } from "lucide-react-native"

import { AppointmentRating } from "@/domain/Appointment"

import { useVolunteerById } from "@/shared/repositories/hooks/VolunteerHooks"

import { Header2, SubHeader2 } from "@/components/Header"
import Space from "@/components/Space"

import colors from "@/styles/Colors"
import useResponsiveStyles from "@/hooks/useResponsiveStyles";

declare type Props = {
    data: AppointmentRating
}

export default function AppointmentRatingCard({ data }: Props) {
    const { cardStyles, globalStyles, layoutStyles } = useResponsiveStyles()
    const { volunteer } = useVolunteerById(data.volunteerId)
    const filledStars = Math.round(Math.max(0, Math.min(5, data.rating)))

    return (
        <View style={[cardStyles.item, cardStyles.itemContent]}>
            <View style={[cardStyles.itemHeader, layoutStyles.defaultRowContainer]}>
                <View style={[layoutStyles.rowContent, globalStyles.alignStart]}>
                    <Header2>{volunteer && volunteer.name}</Header2>
                    <SubHeader2>{data.updateAt.toLocaleString()}</SubHeader2>
                </View>

                <View style={[layoutStyles.rowContent, globalStyles.alignEnd]}>
                    <View
                        style={[layoutStyles.defaultRowContainer]}
                        accessible
                        accessibilityRole="summary"
                        accessibilityLabel={`Rating: ${data.rating} out of 5 stars`}
                    >
                        {Array.from({ length: 5 }, (_, index) => (
                            <Star
                                key={index}
                                size={20}
                                color={colors.highlightColor}
                                fill={index < filledStars ? colors.highlightColor : "white"}
                            />
                        ))
                        }
                    </View>
                </View>
            </View>

            <Space />
            <Text>{data.comment}</Text>
        </View>
    )
}