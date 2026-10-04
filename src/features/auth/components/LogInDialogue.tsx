import { useCallback, useEffect, useRef, type ComponentRef } from "react";
import { Pressable, View, Button, Text } from "react-native"

import useResponsiveStyles from "@/hooks/useResponsiveStyles";
import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider";

import Divider from "@/components/Divider"
import { Header1 } from "@/components/Header"
import Space from "@/components/Space"

import colors from "@/styles/Colors"

type Props = {
    onClose: () => void
}

export default function LogInDialogue({ onClose }: Props) {
    const { dialogStyles, layoutStyles } = useResponsiveStyles()

    const { signIn } = useAuthContext()

    const onLogInPress = useCallback(() => { signIn("alexmorgan@pawplan.com", "morganalex") }, [signIn])

    const focusRef = useRef<ComponentRef<typeof Pressable> | null>(null);

    useEffect(() => {
        focusRef.current?.focus?.();
    });

    return (
        <Pressable style={dialogStyles.dialogContainer}>
            <Divider>
                <Header1 accessibilityLabel="Login dialog">Login</Header1>
            </Divider>

            <Space />

            <View style={[dialogStyles.dialogContainerButtons, layoutStyles.defaultRowContainer]}>
                <Button title="Cancel" color={colors.secondaryButtonColor} onPress={onClose} />

                <Space />

                <Pressable
                    ref={focusRef}
                    accessibilityRole="button"
                    accessibilityLabel="Log in"
                    onPress={onLogInPress}
                    style={{
                        backgroundColor: colors.primaryButtonColor,
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "600" }}>LogIn</Text>
                </Pressable>
            </View>
        </Pressable>
    )
}


