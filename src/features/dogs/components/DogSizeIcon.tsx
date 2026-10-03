import { ReactElement } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Dog as DogIcon } from "lucide-react-native";

import { DogSizeEnum } from "@/shared/data/enums/DogSizeEnum";
import { getSizeTitle } from "@/shared/data/utils/DogHelpers";

type Props = {
    size: DogSizeEnum;
    style?: StyleProp<ViewStyle>;
};

const iconSizes: Record<DogSizeEnum, number> = {
    small: .7,
    mid: .85,
    big: 1,
};

export default function DogSizeIcon({ size, style }: Props): ReactElement {
    return (
        <View
            style={style}
            accessible
            accessibilityRole="image"
            accessibilityLabel={`${getSizeTitle(size)} dog`}
        >
            <DogIcon size={`${Math.round(70 * iconSizes[size])}%`} color="#35423D" strokeWidth={2.25 * iconSizes[size]} />
        </View>
    );
}