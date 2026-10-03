import { useState } from "react"
import { Modal, Pressable, PressableProps, StyleSheet, Text, View } from "react-native"

import { useRouter } from "expo-router"

import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider"

import useResponsiveStyles from "@/styles/hooks/useResponsiveStyles";

function MenuItem({ onPress, children }: PressableProps) {
    const { menuStyles } = useResponsiveStyles()

    const [hoverState, setHoverState] = useState(false)

    return <Pressable accessibilityRole="button"
        style={[menuStyles.menuItem, hoverState && menuStyles.menuItemHover]}

        onHoverIn={() => setHoverState(true)}
        onHoverOut={() => setHoverState(false)}
        onPress={onPress}
    >
        {children}
    </Pressable>
}

export default function Menu() {
    const { menuStyles, dialogStyles} = useResponsiveStyles()

    const [state, setState] = useState(false)

    const { user, signIn, signOut } = useAuthContext()
    const router = useRouter()

    return <>
        <Pressable accessibilityRole="button" accessibilityLabel="Open menu"
            style={menuStyles.menuButton}
            onPress={() => setState(true)}
        >
            {
                state ? <Text>X</Text> : <Text>⋮</Text>
            }
        </Pressable>

        <Modal visible={state} transparent animationType="fade"
            onRequestClose={() => { setState(false) }}
        >
            <Pressable style={dialogStyles.dialogBackdrop} onPress={() => setState(false)}>
                <View style={menuStyles.menu}>

                    <MenuItem onPress={() => {
                        setState(false)
                        router.push("/test")
                    }}>
                        <Text style={{ flex: 1 }}>Profile</Text>
                    </MenuItem>

                    {
                        user ?
                            <MenuItem
                                onPress={() => {
                                    signOut()

                                    setState(false)
                                }}
                            >
                                <Text style={{ flex: 1 }}>Sign Out</Text>
                            </MenuItem>
                            :
                            <MenuItem
                                onPress={async () => {
                                    console.log("Sign In")
                                    await signIn("alexmorgan@pawplan.com", "morganalex")

                                    setState(false)
                                }}
                                style={menuStyles.menuItem}
                            >
                                <Text style={{}}>Sign In</Text>
                            </MenuItem>
                    }
                </View>
            </Pressable>
        </Modal>
    </>
}
