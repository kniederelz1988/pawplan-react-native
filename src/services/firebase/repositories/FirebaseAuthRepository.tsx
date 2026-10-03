import { AuthUser } from "@/shared/data/AuthUser";
import AuthRepository, { AuthListener, AuthUnsubscribe } from "@/shared/repositories/AuthRepository";

import { firebaseAuth } from "@firebase/FirebaseConfig"
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth"

export default function FirebaseAuthRepository(): AuthRepository {
    function subscribeToUser(listener: AuthListener): AuthUnsubscribe {
        return onAuthStateChanged(firebaseAuth, user => {
            if (!user) {
                listener("success", null)
                return
            }

            listener("success", {
                userId: user.uid,
                userEmail: user.email!!
            })
        })
    }

    async function signIn(email: string, password: string): Promise<AuthUser> {
        const authCred = await signInWithEmailAndPassword(firebaseAuth, email, password)
        return {
            userId: authCred?.user.uid,
            userEmail: authCred?.user.email!!
        }
    }
    async function signOut() {
        await firebaseSignOut(firebaseAuth)
    }

    return { signIn, signOut, subscribeToUser }
}