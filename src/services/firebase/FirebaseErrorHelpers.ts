import { FirebaseError } from "firebase/app";

export function getFirestoreErrorMessage( error: unknown ) : string {
    if (!(error instanceof FirebaseError)) {
        return "An unexpected error occurred.";
    }

    switch (error.code) {
        case "permission-denied":
            return "You do not have permission to perform this action.";
        case "unauthenticated":
            return "Please sign in.";
        case "unavailable":
            return "Service is temporarily unavailable.";
    }

    return "Something went wrong.";
}

export function getAuthErrorMessage(code: string) : string {
    switch(code) {
        case "auth/invalid-email":
            return "E-Mail not valid"
        case "auth/email-already-in-use":
            return "E-Mail is already in use"
        case "auth/invalid-credential":
            return "Login data not valid"
        case "auth/missing-password":
            return "Password not valid"
    }

    return "Unknown error"
}
