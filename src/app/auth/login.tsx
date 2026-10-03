import { useCallback, useEffect } from "react"
import { Pressable } from "react-native"

import useRouterNavigation from "@/features/navigation/hooks/useRouterNavigation"

import { useVolunteer } from "@/shared/repositories/hooks/VolunteerHooks"
import LogInDialogue from "@/features/auth/components/LogInDialogue"

import useResponsiveStyles from "@/styles/hooks/useResponsiveStyles";

export default function LoginModal() {
    const { dialogStyles } = useResponsiveStyles()
    
    const navigation = useRouterNavigation()

    const { volunteer, volunteerLoading } = useVolunteer()

    useEffect(() => {
        if (volunteerLoading || !volunteer?.id)
            return

        navigation.followIntent("replace", "keep", navigation.routeParams)
    }, [volunteerLoading, volunteer?.id])

    const onCloseCallback = useCallback(() => { navigation.toSource("dismissTo", "clear", navigation.routeParams)}, [])

    return (
        <Pressable style={dialogStyles.dialogBackdrop} onPress={onCloseCallback}>
            <LogInDialogue onClose={onCloseCallback} />
        </Pressable>
    )
}