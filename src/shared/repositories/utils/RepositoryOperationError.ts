export type RepositoryOperationError = "none" | "undefined-data"

export function getErrorMessage(error?: RepositoryOperationError): string {
    if (error) {
        switch (error) {
            case "undefined-data":
                return "Data not defined."
        }
    }

    return "Unknown error. Please try again later."
}