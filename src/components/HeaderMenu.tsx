import { useCallback } from "react"
import { View } from "react-native"
import { Menu, PawPrint } from "lucide-react-native";

import useResponsiveStyles from "@/hooks/useResponsiveStyles";
import useNavigation, { Operations } from "@/hooks/useNavigation";

import { withPressableButton } from "@/hocs/withPressableButton";

import colors from "@/styles/Colors";

const HomeButton = withPressableButton(PawPrint)
const MenuButton = withPressableButton(Menu)

export default function HeaderMenu() {
    const { layoutStyles, menuStyles } = useResponsiveStyles()

    const { push } = useNavigation()

    const openMenuCallback = useCallback(() => push("/menus/main", Operations.New("/menus/main")), [push])

    return <View style={[layoutStyles.defaultRowContainer, { width: "100%" }]}>
        <View style={[layoutStyles.flex1]}>
            <HomeButton
                style={[menuStyles.headerMenuButton, layoutStyles.gapMid]}
                textStyle={[menuStyles.headerMenuButtonText]}
                title="Paw Plan"
                variant="plain"
                size={32}
                color={colors.plainButtonText}
                fill={colors.plainButtonText}
                onPress={() => { push("/") }}
            />
        </View>

        <MenuButton
            style={[menuStyles.headerMenuButton]}
            textStyle={{ display: "none" }}
            title="Open Menu"
            variant="plain"
            size={32}
            color={colors.plainButtonText}
            fill={colors.plainButtonText}
            onPress={openMenuCallback}
        />

    </View>
}
