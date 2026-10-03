export type RepositoryDateCompareEnum = "past" | "future"

export function getDateCompareOperator(date: RepositoryDateCompareEnum) {
    switch (date) {
        case "past":
            return "<"
        case "future":
            return ">="
    }
}
export function getDateSortOperator(date: RepositoryDateCompareEnum) {
    switch (date) {
        case "past":
            return "desc"
        case "future":
            return "asc"
    }
}