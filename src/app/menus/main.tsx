import { Pressable } from "react-native";
import { LogIn, LogOut, X } from "lucide-react-native";

import { withPressableButton } from "@/hocs/withPressableButton";

import useNavigation from "@/hooks/useNavigation";
import useResponsiveStyles from "@/hooks/useResponsiveStyles";

import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider";

import Divider from "@/components/Divider";
import { Header1 } from "@/components/Header";
import Space from "@/components/Space";
import colors from "@/styles/Colors";

const LoginButton = withPressableButton(LogIn)
const LogoutButton = withPressableButton(LogOut)
const CloseButton = withPressableButton(X)

export default function MainMenu() {
    const { dialogStyles, menuStyles } = useResponsiveStyles()

    const { isLoggedIn } = useAuthContext()
    const { replace, back } = useNavigation()

    return (
        <Pressable style={[dialogStyles.dialogBackdrop]}
            importantForAccessibility="no"
            accessible={false}

            onPress={back}
        >
            <Pressable style={[dialogStyles.dialogContainer, menuStyles.menuDialogue, menuStyles.menuContainer]}
                importantForAccessibility="yes"
            >

                <Divider>
                    <Header1>Menu</Header1>
                </Divider>

                <Space />


                {!isLoggedIn && (
                    <LoginButton 
                        style={menuStyles.menuButton}
                        title="Sign in"
                        color={colors.defaultButtonText}
                        onPress={() => { replace("/auth/login")}}
                    />
                )}

                {isLoggedIn && (
                    <LogoutButton 
                        style={menuStyles.menuButton}
                        title="Sign out"
                        color={colors.defaultButtonText}
                        onPress={() => { replace("/auth/logout")}}
                    />
                )}

                <Space />
                <Space />
                <Space />

                <CloseButton
                    style={menuStyles.menuButton}
                    title="Close menu"
                    variant="cancel"
                    color={colors.defaultButtonText}
                    onPress={back}
                />
            </Pressable>
        </Pressable >
    );
}