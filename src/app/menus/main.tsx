import { Pressable } from "react-native";

import useNavigation from "@/hooks/useNavigation";
import useResponsiveStyles from "@/hooks/useResponsiveStyles";

import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider";

import PressableButton from "@/components/PressableButton";
import Divider from "@/components/Divider";
import { Header1 } from "@/components/Header";
import Space from "@/components/Space";
export default function MainMenu() {
    const { dialogStyles, menuStyles } = useResponsiveStyles()

    const { isLoggedIn } = useAuthContext()
    const { push, back } = useNavigation()

    return (
        <Pressable style={[dialogStyles.dialogBackdrop]}
            importantForAccessibility="no"
            accessible={false}

            onPress={back}
        >
            <Pressable style={[menuStyles.menuDialogue, menuStyles.menuContainer]}
                accessible
                accessibilityRole="alert"
                importantForAccessibility="yes"
            >

                <Divider>
                    <Header1>Menu</Header1>
                </Divider>

                <Space />

                <PressableButton
                        title="Home"
                        onPress={() => { push("/", { flag: "clear" }) }}
                    />

                {!isLoggedIn && (
                    <PressableButton
                        title="Log in"
                        onPress={() => { push("/auth/login", { flag: "clear" }) }}
                    />
                )}

                {isLoggedIn && (
                    <PressableButton
                        title="Sign out"
                        onPress={() => { push("/auth/logout", { flag: "clear" }) }}
                    />
                )}

                <PressableButton
                    title="Close menu"
                    onPress={back}
                />
            </Pressable>
        </Pressable>
    );
}