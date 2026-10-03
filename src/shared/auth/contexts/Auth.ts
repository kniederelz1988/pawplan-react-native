import { AuthUser } from "@/shared/data/AuthUser"

export interface Auth {
    isLoggedIn: boolean

    user: AuthUser

    signIn: (email: string, password: string) => void
    signOut: () => void
}
