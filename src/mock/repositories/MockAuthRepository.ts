import { AuthUser } from "@/domain/AuthUser";

import AuthRepository, { AuthListener } from "@/shared/repositories/AuthRepository";

export default function MockAuthRepository(): AuthRepository {
    const userData = [
        { id: "user-001", email: "alexmorgan@pawplan.com", password: "morganalex" },
        { id: "user-002", email: "jordanlee@pawplan.com", password: "leejordan" }
    ]
    const userMap = new Map(userData.map((user) => [user.email, user] as const))

    

    async function signIn(email: string, password: string): Promise<AuthUser> {
        const userData = userMap.get(email)
        if (!userData || userData.password !== password) {
            throw Object.assign(new Error("Login data not valid"), {
                code: "auth/invalid-credential",
            })
        }

        const authUser: AuthUser = {
            userId: userData.id,
            userEmail: userData.email,
        }
        return authUser
    }
    async function signOut(): Promise<void> {}

    function subscribeToUser(listener: AuthListener) {
        listener("error", null)
        return () => {}
    }

    return {
        signIn,
        signOut,
        subscribeToUser
    }
}