import { AuthUser } from "@/domain/AuthUser"

export interface Auth {
    isLoggedIn: boolean

    user: AuthUser

    signIn: (email: string, password: string) => void
    signOut: () => void
}
