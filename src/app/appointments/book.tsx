import { useCallback, useEffect } from "react";
import { Pressable } from "react-native";

import useRouterNavigation from "@/features/navigation/hooks/useRouterNavigation";

import BookAppointmentDialogue from "@/features/appointments/components/AppointmentDialogue";
import { useVolunteer } from "@/shared/repositories/hooks/VolunteerHooks";

import useResponsiveStyles from "@/styles/hooks/useResponsiveStyles";

export default function BookAppointmentsModal() {
    const { dialogStyles } = useResponsiveStyles()
    
    const navigation = useRouterNavigation()

    const { volunteer, volunteerLoading } = useVolunteer()

    useEffect(() => {
        if (volunteerLoading || volunteer?.id)
            return

        navigation.replace("/auth/login", { flag: "keep" }, navigation.routeParams)
    }, [navigation, volunteerLoading, volunteer?.id])

    const onCloseCallback = useCallback(() => { navigation.toSource("dismissTo", "clear", navigation.routeParams) }, [])

    return (
        <Pressable style={dialogStyles.dialogBackdrop} onPress={onCloseCallback}>
            <BookAppointmentDialogue dogId={navigation.routeParams.dogId as string} onClose={onCloseCallback} />
        </Pressable>
    )
}