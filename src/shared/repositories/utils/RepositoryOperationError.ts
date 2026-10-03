// import { getFirestoreErrorMessage } from "@fb/FirebaseErrorHelpers"

export type RepositoryOperationErrorEnum = "none" | "undefinedData"

export function getRepositoryOperationUndefinedDataMessage() {
    return getRepositoryOperationErrorMessage("undefinedData")
}

export function getRepositoryOperationErrorMessage(
    error: any
) : string {
    const rError = (error as RepositoryOperationErrorEnum)
    if (rError) {
        switch (rError) {
            case "undefinedData":
                return "Data not defined."
        }
    }

    // TODO: ENABLE LAST LINE
    return ""
    // return getFirestoreErrorMessage(error)
}