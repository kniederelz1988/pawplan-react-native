import { useCallback } from "react";
import { Button } from "react-native";

import { useAuthContext } from "@/shared/auth/contexts/AuthContextProvider";

export default function LogInButton() {
    const { signIn } = useAuthContext()

    const onLogInPress = useCallback(() => {
        if (!signIn)
            return 

        signIn("alexmorgan@pawplan.com", "morganalex")
    }, [signIn])

    return (
        <>
            <Button title="LogIn" onPress={onLogInPress} />
        </>
    )
}