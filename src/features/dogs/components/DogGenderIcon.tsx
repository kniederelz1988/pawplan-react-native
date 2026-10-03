import { ReactElement } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Mars as MarsIcon, Venus as VenusIcon } from "lucide-react-native";

import { DogGenderEnum } from "@/shared/data/enums/DogGenderEnum";
import { getGenderTitle } from "@/shared/data/utils/DogHelpers";

type Props = {
    gender: DogGenderEnum;
    style?: StyleProp<ViewStyle>;
};

export default function DogGenderIcon({ gender, style }: Props): ReactElement {
    const Icon = gender.startsWith("female") ? VenusIcon : MarsIcon;

    return (
        <View
            style={style}
            accessible
            accessibilityRole="image"
            accessibilityLabel={getGenderTitle(gender)}
        >
            <Icon size="70%" color="#35423D" strokeWidth={2.25} />
        </View>
    );
}