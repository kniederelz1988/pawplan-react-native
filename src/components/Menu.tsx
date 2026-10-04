import { Ref, useEffect, useRef, type ComponentRef } from "react";
import { Pressable, Modal, View, Text } from "react-native";

import useNavigation from "@/hooks/useNavigation";
import useResponsiveStyles from "@/hooks/useResponsiveStyles";
import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider";

type MenuItemProps = {
    title: string,
    ref?: Ref<View>,
    onPress: () => void,
}

function MenuItem({ ref, title, onPress, }: MenuItemProps) {
    const { menuStyles } = useResponsiveStyles();

    return (
        <Pressable
            ref={ref}
            accessible
            accessibilityRole="button"
            accessibilityLabel={title}
            style={menuStyles.menuItem}
            onPress={onPress}
        >
            <Text accessible={false}>{title}</Text>
        </Pressable>
    );
}
type MenuProps = {
    state: boolean; onClose: () => void;
};
export function Menu({ state, onClose }: MenuProps) {
    const { dialogStyles, menuStyles } = useResponsiveStyles();
    const { isLoggedIn } = useAuthContext();
    const navigation = useNavigation();

    const focusRef = useRef<View>(null);

    useEffect(() => {
        if (!state) return;

        focusRef.current?.focus?.();
    }, [state]);

    return (
        <Modal
            visible={state}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            accessibilityViewIsModal
        >
            <Pressable
                style={[dialogStyles.dialogBackdrop]}
                importantForAccessibility="no"
                accessible={false}
                onPress={onClose}
            >
                <View
                    style={[menuStyles.menuDialogue, menuStyles.menuContainer]}
                    accessible
                    accessibilityRole="alert"
                    importantForAccessibility="yes"
                >
                    <MenuItem
                        ref={focusRef}
                        title="Profile"
                        onPress={onClose}
                    />

                    {!isLoggedIn && (
                        <MenuItem
                            title="Sign in"
                            onPress={() => {
                                onClose();
                                navigation.push("/auth/login", { flag: "keep" });
                            }}
                        />
                    )}

                    {isLoggedIn && (
                        <MenuItem
                            title="Sign out"
                            onPress={async () => {
                                onClose();
                                navigation.push("/auth/logout", { flag: "clear" });
                            }}
                        />
                    )}
                </View>
            </Pressable>
        </Modal>
    );
}
