import { useCallback, useEffect } from "react"
import { Pressable } from "react-native"

import useResponsiveStyles from "@/hooks/useResponsiveStyles";

import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider"

import LogOutDialogue from "@/features/auth/components/LogOutDialogue";
import useNavigationIntent from "@/hooks/useNavigationIntent";

export default function LogoutModal() {
    const { dialogStyles } = useResponsiveStyles()

    const { isLoggedIn } = useAuthContext()

    const { followIntent, toSource } = useNavigationIntent()

    useEffect(() => {
        if (isLoggedIn)
            return

        followIntent()
    }, [isLoggedIn, navigation])

    return (
        <Pressable style={dialogStyles.dialogBackdrop} onPress={toSource}>
            <LogOutDialogue onClose={toSource} />
        </Pressable>
    )
}