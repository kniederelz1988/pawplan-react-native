import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react"

import { Auth } from "@/shared/auth/contexts/Auth"
import { AuthUser } from "@/domain/AuthUser"
import { useAppDependencies } from "@/shared/dependencies/hooks/useAppDependencies"

const AuthContext = createContext<Auth>({ isLoggedIn: false, user: null, signIn: (_1, _2) => { }, signOut: () => { } })

type Props = { } & PropsWithChildren

export const useAuthContext = () => useContext(AuthContext)

export function AuthContextProvider({ children }: Props) {
    const [user, setUser] = useState<AuthUser>(null)

    const { authRepository } = useAppDependencies()

    const signIn = useCallback(async (email: string, password: string) => {
        try {
            const user = await authRepository.signIn(email, password)
            setUser(user)
        }
        catch (e: unknown) {
            console.error(e)
        }
    }, [authRepository])
    const signOut = useCallback(async () => {
        try {
            await authRepository.signOut()
            setUser(null)
        } catch (e: unknown) {
            console.error(e)
        }
    }, [authRepository])

    useEffect(() => {
        return authRepository.subscribeToUser((_state, user) => {
            setUser(user);
        });
    }, [authRepository]);

    const auth: Auth = useMemo(() => {
        return {
            isLoggedIn: !!user,
            user: user,

            signIn: signIn,
            signOut: signOut
        }
    }, [user, signIn, signOut])

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}
