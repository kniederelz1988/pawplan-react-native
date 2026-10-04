import { useState } from "react";
import { Pressable, Modal, View, Text, PressableProps } from "react-native";

import useNavigation from "@/hooks/useNavigation";
import useResponsiveStyles from "@/hooks/useResponsiveStyles";
import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider";

function MenuItem({ onPress, children }: PressableProps) {
    const { menuStyles } = useResponsiveStyles();

    const [hoverState, setHoverState] = useState(false);

    return <Pressable accessibilityRole="button"
        style={[menuStyles.menuItem, hoverState && menuStyles.menuItemHover]}

        onHoverIn={() => setHoverState(true)}
        onHoverOut={() => setHoverState(false)}
        onPress={onPress}
    >
        {children}
    </Pressable>;
}
type MenuProps = {
    state: boolean; onClose: () => void;
};
export function Menu({ state, onClose }: MenuProps) {
    const { dialogStyles, menuStyles } = useResponsiveStyles();

    const { isLoggedIn } = useAuthContext();
    const navigation = useNavigation();

    return (
        <Modal visible={state} transparent animationType="fade"
            onRequestClose={onClose}>

            <Pressable style={[dialogStyles.dialogBackdrop]} onPress={onClose}>
                <View style={[menuStyles.menuDialogue,menuStyles.menuContainer]}>
                    <MenuItem onPress={onClose}>
                        <Text style={{ flex: 1 }}>Profile</Text>
                    </MenuItem>

                    {isLoggedIn ||
                        <MenuItem
                            onPress={() => {
                                onClose();
                                navigation.push("/auth/login", { flag: "keep" });
                            }}
                        >
                            <Text style={{ flex: 1 }}>Sign In</Text>
                        </MenuItem>}

                    {isLoggedIn &&
                        <MenuItem
                            onPress={async () => {
                                onClose();
                                navigation.push("/auth/logout", { flag: "clear" });
                            }}
                            style={menuStyles.menuItem}
                        >
                            <Text style={{}}>Sign Out</Text>
                        </MenuItem>}
                </View>
            </Pressable>
        </Modal>
    );
}
