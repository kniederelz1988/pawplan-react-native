import { firebaseAuth } from "@firebase/FirebaseConfig"
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from "@react-native-firebase/auth"

import { AuthUser } from "@/domain/AuthUser";
import AuthRepository, { AuthListener, AuthUnsubscribe } from "@/shared/repositories/AuthRepository";

export default function FirebaseAuthRepository(): AuthRepository {
    function subscribeToUser(listener: AuthListener): AuthUnsubscribe {
        return onAuthStateChanged(firebaseAuth, user => {
            if (!user) {
                listener("error", null)
                return
            }

            listener("success", {
                userId: user.uid,
                userEmail: user.email ?? ""
            })
        })
    }

    async function signIn(email: string, password: string): Promise<AuthUser> {
        const cred = await signInWithEmailAndPassword(firebaseAuth, email, password)
        return {
            userId: cred.user.uid,
            userEmail: cred.user.email ?? email
        }
    }
    async function signOut() {
        await firebaseSignOut(firebaseAuth)
    }

    return { signIn, signOut, subscribeToUser }
}