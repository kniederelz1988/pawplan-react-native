import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react"

import { Auth as Auth } from "./Auth"
import { AuthUser } from "@/shared/data/AuthUser"
import { useAppDependencies } from "@/shared/dependencies/hooks/useAppDependencies"

const AuthContext = createContext<Auth>({ isLoggedIn: false, user: null, signIn: (_1, _2) => {},  signOut: () => {} })

interface Props extends PropsWithChildren {}

export const useAuthContext = () => useContext(AuthContext)

export function AuthContextProvider({ children }: Props) {
    const [user, setUser] = useState<AuthUser>(null)

    const { authRepository } = useAppDependencies()

    const auth = useMemo<Auth>(() => {
        return {
            isLoggedIn: !!user,
            user: user,

            signIn: async (email: string, password: string) => {
                console.log(`Login with: ${email} and ${password}`)

                try {
                    const user = await authRepository.signIn(email, password)
                    setUser(user)

                    console.log(`User logged in.. [${user?.userId}, ${user?.userEmail}]`)
                }
                catch (e: unknown) {
                    console.error(e)
                }
            },
            signOut: async () => {
                console.log(`LogOut`)

                try {
                    await authRepository.signOut()
                    setUser(null)

                    console.log(`User logged out..`)
                } catch (e: unknown) {
                    console.error(e)
                }
            }
        }
    }, [authRepository, user])

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}
