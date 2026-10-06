import { useEffect } from "react";
import { Pressable } from "react-native";

import useResponsiveStyles from "@/hooks/useResponsiveStyles";

import BookAppointmentDialogue from "@/features/appointments/components/BookAppointmentDialogue";
import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider";
import useNavigation, { Operations } from "@/hooks/useNavigation";

type Params = { dogId: string }

export default function BookAppointmentsModal() {
    const { dialogStyles } = useResponsiveStyles()
    
    const { replace, toSource, parameters } = useNavigation<Params>()

    const { isLoggedIn } = useAuthContext()

    useEffect(() => {
        if (isLoggedIn)
            return

        replace("/auth/login", Operations.Keep)
    }, [isLoggedIn, replace])

    return (
        <Pressable style={dialogStyles.dialogBackdrop} onPress={toSource}>
            <BookAppointmentDialogue dogId={parameters.dogId} onClose={toSource} />
        </Pressable>
    )
}