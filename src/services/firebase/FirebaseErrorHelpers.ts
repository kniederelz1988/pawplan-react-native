import { getErrorMessage, RepositoryOperationError } from "@/shared/repositories/utils/RepositoryOperationError";

function getErrorCode(error: unknown): string | undefined {
    if (
        typeof error !== "object" ||
        error === null ||
        !("code" in error) ||
        typeof error.code !== "string"
    ) {
        return undefined
    }

    // RNFirebase codes may include a service prefix, such as "firestore/".
    return error.code
}

export function getFirestoreErrorMessage(error: unknown): string {
    const errorCode = getErrorCode(error)
    switch (errorCode) {
        case "firestore/permission-denied":
            return "You do not have permission to perform this action.";
        case "unauthenticated":
            return "Please sign in.";
        case "unavailable":
            return "Service is temporarily unavailable.";
    }

    return "Something went wrong.";
}

export function getAuthErrorMessage(error: unknown): string {
    const errorCode = getErrorCode(error)
    switch (errorCode) {
        case "auth/invalid-email":
            return "E-Mail not valid"
        case "auth/email-already-in-use":
            return "E-Mail is already in use"
        case "auth/invalid-credential":
            return "Login data not valid"
        case "auth/missing-password":
            return "Password not valid"
    }

    return getErrorMessage(error as RepositoryOperationError)
}