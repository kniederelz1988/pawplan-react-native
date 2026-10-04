import { useEffect } from "react"
import { Pressable } from "react-native"

import LogInDialogue from "@/features/auth/components/LogInDialogue"

import useResponsiveStyles from "@/hooks/useResponsiveStyles";
import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider"
import useNavigationIntent from "@/hooks/useNavigationIntent";

export default function LoginModal() {
    const { dialogStyles } = useResponsiveStyles()

    const { isLoggedIn } = useAuthContext()

    const { followIntent, toSource } = useNavigationIntent()

    useEffect(() => {
        if (!isLoggedIn)
            return
        
        followIntent()
    }, [isLoggedIn, followIntent])

    return (
        <Pressable style={dialogStyles.dialogBackdrop} onPress={toSource}>
            <LogInDialogue onClose={toSource} />
        </Pressable>
    )
}