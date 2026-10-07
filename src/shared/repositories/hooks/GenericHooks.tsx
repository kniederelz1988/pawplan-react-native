import { useCallback, useMemo, useState } from "react"

export function usePages<T>() {
    const [page, setPage] = useState(0)
    const [pageCursors, setPageCursors] = useState<T[]>([])

    const setPageCursor = useCallback((nextCursor: T) => {
        setPageCursors((currentCursors) => {
            if (Object.is(currentCursors[page], nextCursor))
                return currentCursors

            return [
                ...currentCursors.slice(0, page),
                nextCursor,
                ...currentCursors.slice(page + 1)
            ]
        })
    }, [page])

    const getPageCursor = useCallback(() => {
        if (page <= 0)
            return null

        if (page >= pageCursors.length)
            return pageCursors[pageCursors.length - 1]

        return pageCursors[page - 1]
    }, [page, pageCursors])

    const previousPage = useCallback(() => {
        if (page === 0)
            return

        setPage(page - 1)
    }, [page])
    const previousPageActive = page >= 1
    
    const nextPage = useCallback(() => {
        if (page >= pageCursors.length)
            return
        
        setPage(page + 1)
    }, [page, pageCursors.length])
    const nextPageActive = page < pageCursors.length

    const pageControls = useMemo(() => ({
        previousPage,
        previousPageActive,
        nextPage,
        nextPageActive
    }), [previousPage, previousPageActive, nextPage, nextPageActive])

    const pageCursor = useMemo(() => ({
        set: setPageCursor,
        get: getPageCursor
    }), [setPageCursor, getPageCursor])

    return { 
        page:           page,
        pageControls,
        pageCursor
    }
}
