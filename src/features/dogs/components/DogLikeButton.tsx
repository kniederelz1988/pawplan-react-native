import { Pressable, StyleProp, ViewStyle } from "react-native";
import { Heart } from "lucide-react-native";

import { Dog } from "@/domain/Dog";
import { useVolunteer } from "@/shared/repositories/hooks/VolunteerHooks";

type Props = {
    data: Dog,
    style: StyleProp<ViewStyle>
}

export default function DogLikeButton({ data, style }: Props) {
    const { isFavourite, toggleFavourite } = useVolunteer()

    const favourite = isFavourite(data)

    return (
        <Pressable
            style={style}
            accessible
            accessibilityRole="button"
            accessibilityLabel={
                favourite
                    ? `Remove ${data.name} from favourites`
                    : `Add ${data.name} to favourites`
            }
            accessibilityState={{ selected: favourite }}
            onPress={() => toggleFavourite(data)}
        >

            <Heart 
                aria-hidden={true}
                focusable={false}size="70%"
                fill={isFavourite(data) ? "red" : "transparent"}
                color={isFavourite(data) ? "red" : "#35423D"}
                strokeWidth={2.25}
            />
        </Pressable>
    )
}