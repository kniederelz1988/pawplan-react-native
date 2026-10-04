import { useEffect } from "react";
import { Pressable } from "react-native";

import useResponsiveStyles from "@/hooks/useResponsiveStyles";

import BookAppointmentDialogue from "@/features/appointments/components/BookAppointmentDialogue";
import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider";
import useNavigationIntent from "@/hooks/useNavigationIntent";

export default function BookAppointmentsModal() {
    const { dialogStyles } = useResponsiveStyles()
    
    const { parameters, redirect, toSource } = useNavigationIntent<{ dogId: string }>()

    const { isLoggedIn } = useAuthContext()

    useEffect(() => {
        if (isLoggedIn)
            return

        redirect("/auth/login")
    }, [isLoggedIn, redirect])

    return (
        <Pressable style={dialogStyles.dialogBackdrop} onPress={toSource}>
            <BookAppointmentDialogue dogId={parameters.dogId} onClose={toSource} />
        </Pressable>
    )
}